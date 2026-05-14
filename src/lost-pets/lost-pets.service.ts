import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoundPet } from 'src/core/db/entities/found-pets.entity';
import { LostPet } from 'src/core/db/entities/lost-pets.entity';
import { EmailOptions } from 'src/core/interfaces/email-options.interface';
import { lostPetCDto } from 'src/core/interfaces/lost-pet.interface';
import { EmailService } from 'src/email/email.service';
import { Repository } from 'typeorm';
import { generateLostPetEmailTemplate } from './templates/lost-pet-email.template';
import { CacheService } from 'src/cache/cache.service';
import { logger } from 'src/config/logger';

const CACHE_KEY_ALL_LOST_PETS = 'lost-pets:all';

@Injectable()
export class LostPetsService {
    constructor(
        @InjectRepository(LostPet)
        private readonly lostPetRepository : Repository<LostPet>,
        @InjectRepository(FoundPet)
        private readonly foundPetRepository : Repository<FoundPet>,
        private readonly emailService : EmailService,
        private readonly cacheService : CacheService
    ) {}

    async getLostPets() : Promise<LostPet[]> {
        try{
            logger.info("[LostPetService] Consultando mascotas perdidas en cache...");
            const data = await this.cacheService.get<LostPet[]>(CACHE_KEY_ALL_LOST_PETS);
            
            if (data && data.length > 0) {
                logger.info("[LostPetService] Mascotas perdidas encontradas en cache");
                return data;
            }

            logger.info("[LostPetService] Trayendo todas las mascotas perdidas activas...");
            const lostPets = await this.lostPetRepository.find({
                where: { isActive: true }
            });

            logger.info("[LostPetService] Guardando mascotas perdidas en cache");
            await this.cacheService.set(CACHE_KEY_ALL_LOST_PETS, lostPets);

            logger.info(`[LostPetService] Se obtuvieron ${lostPets.length} mascotas perdidas`);
            return lostPets;
        }catch(error){
            console.error("[LostPetService] Error al traer las mascotas perdidas");
            console.error(error);
            return[];
        }
    }

    async getLostPetsByRadius(lat:number,lon:number,radius:number) : Promise<LostPet[]> {
        try{
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
            console.log(`${lostPets} mascotas perdidas en un radio de ${radius} metros`);
            return lostPets;
        }catch(error){
            console.error(error);
            return[];
        }
    }

    async createLostPet(lostPet:lostPetCDto) : Promise<Boolean> {
        const newLostPet = this.lostPetRepository.create({
            name: lostPet.name,
            species: lostPet.species,
            breed: lostPet.breed,
            color: lostPet.color,
            size: lostPet.size,
            description: lostPet.description,
            photoUrl: lostPet.photoUrl ?? null,
            ownerName: lostPet.ownerName,
            ownerEmail: lostPet.ownerEmail,
            ownerPhone: lostPet.ownerPhone,
            address: lostPet.address,
            lostDate: lostPet.lostDate,
            isActive: true,
            location: {
                type: 'Point',
                coordinates: [lostPet.lon, lostPet.lat]
            }
        });
        await this.lostPetRepository.save(newLostPet);
        await this.cacheService.delete(CACHE_KEY_ALL_LOST_PETS);
        const template = generateLostPetEmailTemplate(lostPet);
        const options: EmailOptions = {
            to: "yepezjahir@gmail.com",
            subject: `Reporte de mascota perdida: ${lostPet.name}`,
            html: template
        };
        const result = await this.emailService.sendEmail(options);
        return result;
        
    }
}
