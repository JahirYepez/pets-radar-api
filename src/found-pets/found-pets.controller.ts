import { Body, Controller, Get, ParseFloatPipe, Post, Query } from '@nestjs/common';
import { FoundPetsService } from './found-pets.service';
import type { FoundPetCDto } from 'src/core/interfaces/found-pet.interface';

@Controller('found-pets')
export class FoundPetsController {

    constructor(private readonly foundPetService: FoundPetsService) {}

    @Get()
    async getFoundPets() {
        const result = await this.foundPetService.getFoundPets();
        return result;
    }

    @Get('radius')
    async getFoundPetsByRadius(
        @Query('lat', ParseFloatPipe) lat: number,
        @Query('lon', ParseFloatPipe) lon: number,
        @Query('radiusInMeters', ParseFloatPipe) radiusInMeters: number
    ) {
        const result = await this.foundPetService.getFoundPetsByRadius(lat, lon, radiusInMeters);
        return result;
    }

    @Post()
    async createFoundPet(@Body() foundPet: FoundPetCDto) {
        const result = await this.foundPetService.createFoundPet(foundPet);
        return result;
    }
}