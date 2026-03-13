import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoundPet } from 'src/core/db/entities/found-pets.entity';
import { LostPet } from 'src/core/db/entities/lost-pets.entity';
import { EmailOptions } from 'src/core/interfaces/email-options.interface';
import type { FoundPetCDto } from 'src/core/interfaces/found-pet.interface';
import { EmailService } from 'src/email/email.service';
import { Repository } from 'typeorm';
import { generateFoundPetEmailTemplate } from './templates/found-pet-email.template';

@Injectable()
export class FoundPetsService {
    constructor(
        @InjectRepository(FoundPet)
        private readonly foundPetRepository: Repository<FoundPet>,
        @InjectRepository(LostPet)
        private readonly lostPetRepository: Repository<LostPet>,
        private readonly emailService: EmailService
    ) {}

    async getFoundPets(): Promise<FoundPet[]> {
        try {
            console.log("[FoundPetService] Trayendo todas las mascotas encontradas...");
            const foundPets = await this.foundPetRepository.find();
            console.log(`[FoundPetService] Se obtuvieron ${foundPets.length} mascotas encontradas`);
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

        const template = generateFoundPetEmailTemplate(foundPet);

        const options: EmailOptions = {
            to: foundPet.finderEmail,
            subject: `Reporte de mascota encontrada`,
            html: template
        };

        const result = await this.emailService.sendEmail(options);
        return result;
    }
}