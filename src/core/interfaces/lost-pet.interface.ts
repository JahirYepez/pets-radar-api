import { PetSize } from "../enums/pet-size.enum";
import { PetSpecies } from "../enums/pet-species.enum";

export interface lostPetCDto{
    name: string;
    species: PetSpecies;
    breed: string;
    color: string;
    size: PetSize;
    description: string;
    photoUrl?: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string; // O number???
    lat: number;
    lon: number;
    address: string;
    lostDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}