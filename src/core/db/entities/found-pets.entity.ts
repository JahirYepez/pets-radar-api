import { PetSize } from "src/core/enums/pet-size.enum";
import { PetSpecies } from "src/core/enums/pet-species.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import type { Point } from "typeorm";

@Entity("found_pets")
export class FoundPet {

    @PrimaryGeneratedColumn() //ID
    id!:number;

    @Column({ type:'enum',enum:PetSpecies }) //SPECIES
    species!:PetSpecies;

    @Column({ type:'varchar',nullable:true }) //BREED
    breed!:string|null;

    @Column({ type:'varchar' }) //COLOR
    color!:string;

    @Column({ type:'enum',enum:PetSize }) //SIZE
    size!:PetSize;

    @Column({ type:'text' }) //DESCRIPTION
    description!:string;

    @Column({ type:'varchar',nullable:true }) //PHOTO
    photoUrl!:string|null;

    @Column({ type:'varchar' }) //FINDER NAME
    finderName!:string;

    @Column({ type:'varchar' }) //FINDER EMAIL
    finderEmail!:string;

    @Column({ type:'varchar' }) //FINDER PHONE
    finderPhone!:string;

    @Column({
        type:'geometry',
        spatialFeatureType:'Point',
        srid:4326
    }) //LOCATION
    location!:Point;

    @Column({ type:'varchar' }) //ADDRESS
    address!:string;

    @Column({ type:'timestamp' }) //FOUND DATE
    foundDate!:Date;

    @CreateDateColumn({ type:'timestamp' }) //CREATED AT
    createdAt!:Date;

    @UpdateDateColumn({ type:'timestamp' }) //UPDATED AT
    updatedAt!:Date;
}