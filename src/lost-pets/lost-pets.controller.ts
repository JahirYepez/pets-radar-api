import { Body, Controller, Get, ParseFloatPipe, Post, Query } from '@nestjs/common';
import { LostPetsService } from './lost-pets.service';
import type { lostPetCDto } from 'src/core/interfaces/lost-pet.interface';

@Controller('lost-pets')
export class LostPetsController {

    constructor(private readonly lostPetService:LostPetsService){}

    @Get()
    async getLostPets(){
        const result = await this.lostPetService.getLostPets();
        return result;
    }

    @Get('radius')
    async getLostPetsByRadius(
        @Query('lat', ParseFloatPipe) lat: number,
        @Query('lon', ParseFloatPipe) lon: number,
        @Query('radiusInMeters', ParseFloatPipe) radiusInMeters: number
    ) {
        const result = await this.lostPetService.getLostPetsByRadius(lat, lon, radiusInMeters);
        return result;
    }

    @Post()
    async createLostPet(@Body() lostPet: lostPetCDto) {
        const result = await this.lostPetService.createLostPet(lostPet);
        return result;
    }
}
