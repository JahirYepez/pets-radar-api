import { PetSize } from "../enums/pet-size.enum";
import { PetSpecies } from "../enums/pet-species.enum";

export interface FoundPetCDto {
    species: PetSpecies;
    breed?: string;
    color: string;
    size: PetSize;
    description: string;
    photoUrl?: string;
    finderName: string;
    finderEmail: string;
    finderPhone: string;
    lat: number;
    lon: number;
    addres: string;
    foundDate: Date;
    createdAt: Date;
    updatedAt: Date;
}