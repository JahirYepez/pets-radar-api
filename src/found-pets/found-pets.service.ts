import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoundPet } from 'src/core/db/entities/found-pets.entity';
import { LostPet } from 'src/core/db/entities/lost-pets.entity';
import { EmailOptions } from 'src/core/interfaces/email-options.interface';
import type { FoundPetCDto } from 'src/core/interfaces/found-pet.interface';
import { EmailService } from 'src/email/email.service';
import { Repository } from 'typeorm';
import { generateFoundPetEmailTemplate } from './templates/found-pet-email.template';
import { CacheService } from 'src/cache/cache.service';
import { logger } from 'src/config/logger';

const CACHE_KEY_ALL_FOUND_PETS = 'found-pets:all';

@Injectable()
export class FoundPetsService {
    constructor(
        @InjectRepository(FoundPet)
        private readonly foundPetRepository: Repository<FoundPet>,
        @InjectRepository(LostPet)
        private readonly lostPetRepository: Repository<LostPet>,
        private readonly emailService: EmailService,
        private readonly cacheService: CacheService
    ) {}

    async getFoundPets(): Promise<FoundPet[]> {
        try {
            logger.info("[FoundPetService] Consultando mascotas encontradas en cache...");
            const data = await this.cacheService.get<FoundPet[]>(CACHE_KEY_ALL_FOUND_PETS);

            if (data && data.length > 0) {
                logger.info("[FoundPetService] Mascotas encontradas en cache");
                return data;
            }

            logger.info("[FoundPetService] Trayendo todas las mascotas encontradas...");
            const foundPets = await this.foundPetRepository.find();

            logger.info("[FoundPetService] Guardando mascotas encontradas en cache");
            await this.cacheService.set(CACHE_KEY_ALL_FOUND_PETS, foundPets);

            logger.info(`[FoundPetService] Se obtuvieron ${foundPets.length} mascotas encontradas`);
            return foundPets;
        } catch (error) {
            console.error("[FoundPetService] Error al traer las mascotas encontradas");
            console.error(error);
            return [];
        }
    }


    async getFoundPetsByRadius(lat: number, lon: number, radius: number): Promise<LostPet[]> {
        try {
            console.log(`Buscando mascotas perdidas en ${lat},${lon} en un radio de ${radius} metros`);

            const lostPets = await this.lostPetRepository
                .createQueryBuilder('lost_pet')
                .where(`
                    ST_DWithin(
                        lost_pet.location::geography,
                        ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
                        :radius
                    )
                `, { lon, lat, radius })
                .andWhere('lost_pet.isActive = true')
                .getMany();

            console.log(`${lostPets.length} mascotas perdidas encontradas en un radio de ${radius} metros`);
            return lostPets;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async createFoundPet(foundPet: FoundPetCDto): Promise<Boolean> {
        const newFoundPet = this.foundPetRepository.create({
            species: foundPet.species,
            breed: foundPet.breed ?? null,
            color: foundPet.color,
            size: foundPet.size,
            description: foundPet.description,
            photoUrl: foundPet.photoUrl ?? null,
            finderName: foundPet.finderName,
            finderEmail: foundPet.finderEmail,
            finderPhone: foundPet.finderPhone,
            address: foundPet.address,
            foundDate: foundPet.foundDate,
            location: {
                type: 'Point',
                coordinates: [foundPet.lon, foundPet.lat]
            }
        });

        await this.foundPetRepository.save(newFoundPet);

        await this.cacheService.delete(CACHE_KEY_ALL_FOUND_PETS);

        const nearbyLostPets = await this.lostPetRepository
            .createQueryBuilder('lost_pet')
            .where(`
                ST_DWithin(
                    lost_pet.location::geography,
                    ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
                    :radius
                )
            `, {
                lon: foundPet.lon,
                lat: foundPet.lat,
                radius: 500
            })
            .andWhere('lost_pet.isActive = true')
            .getMany();

        logger.info(`[FoundPetService] Se encontraron ${nearbyLostPets.length} mascotas perdidas cercanas`);


        const template = generateFoundPetEmailTemplate(foundPet);

        const options: EmailOptions = {
            to: "yepezjahir@gmail.com",
            subject: `Reporte de mascota encontrada`,
            html: template
        };

        const result = await this.emailService.sendEmail(options);
        return result;
    }
}