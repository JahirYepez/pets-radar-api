import { PetSize } from "src/core/enums/pet-size.enum";
import { PetSpecies } from "src/core/enums/pet-species.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import type { Point } from "typeorm";

@Entity("lost_pets")
export class LostPet {

    @PrimaryGeneratedColumn() //ID
    id!:number;

    @Column({ type: 'varchar' }) //NAME
    name!:string;

    @Column({ type: 'enum', enum: PetSpecies }) //SPECIES
    species!: PetSpecies;

    @Column({ type:'varchar' }) //BREED
    breed!:string;

    @Column({ type:'varchar' }) //COLOR
    color!:string;

    @Column({ type:'enum', enum: PetSize }) //SIZE
    size!: PetSize;

    @Column({ type:'text' }) //DESCRIPTION
    description!:string;

    @Column({ type:'varchar', nullable:true }) //PHOTO
    photoUrl!:string|null;

    @Column({ type:'varchar' }) //OWNER NAME
    ownerName!:string;

    @Column({ type:'varchar' }) //OWNER EMAIL
    ownerEmail!:string;

    @Column({ type:'varchar' }) //OWNER PHONE
    ownerPhone!:string;

    @Column({
        type:'geometry',
        spatialFeatureType:'Point',
        srid:4326
    }) //LOCATION
    location!:Point;

    @Column({ type:'varchar' }) //ADDRESS
    address!:string;

    @Column({ type:'timestamp' }) //LOST DATE
    lostDate!:Date;
    
    @Column({ type:'boolean', default:true }) //IS ACTIVE
    isActive!:boolean;

    @CreateDateColumn({ type:'timestamp' }) //CREATED AT
    createdAt!:Date;
    
    @UpdateDateColumn({ type:'timestamp' }) //UPDATED AT
    updatedAt!:Date;
}