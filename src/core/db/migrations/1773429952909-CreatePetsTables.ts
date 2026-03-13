import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePetsTables1773429952909 implements MigrationInterface {
    name = 'CreatePetsTables1773429952909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."lost_pets_species_enum" AS ENUM('perro', 'gato', 'ave', 'otro')`);
        await queryRunner.query(`CREATE TYPE "public"."lost_pets_size_enum" AS ENUM('pequeño', 'mediano', 'grande')`);
        await queryRunner.query(`CREATE TABLE "lost_pets" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "species" "public"."lost_pets_species_enum" NOT NULL, "breed" character varying NOT NULL, "color" character varying NOT NULL, "size" "public"."lost_pets_size_enum" NOT NULL, "description" text NOT NULL, "photoUrl" character varying, "ownerName" character varying NOT NULL, "ownerEmail" character varying NOT NULL, "ownerPhone" character varying NOT NULL, "location" geometry(Point,4326) NOT NULL, "address" character varying NOT NULL, "lostDate" TIMESTAMP NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4ba852a354b48000bcb3faaaea5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."found_pets_species_enum" AS ENUM('perro', 'gato', 'ave', 'otro')`);
        await queryRunner.query(`CREATE TYPE "public"."found_pets_size_enum" AS ENUM('pequeño', 'mediano', 'grande')`);
        await queryRunner.query(`CREATE TABLE "found_pets" ("id" SERIAL NOT NULL, "species" "public"."found_pets_species_enum" NOT NULL, "breed" character varying, "color" character varying NOT NULL, "size" "public"."found_pets_size_enum" NOT NULL, "description" text NOT NULL, "photoUrl" character varying, "finderName" character varying NOT NULL, "finderEmail" character varying NOT NULL, "finderPhone" character varying NOT NULL, "location" geometry(Point,4326) NOT NULL, "address" character varying NOT NULL, "foundDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1e8aeb0b37dd97bfce972552b8d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "found_pets"`);
        await queryRunner.query(`DROP TYPE "public"."found_pets_size_enum"`);
        await queryRunner.query(`DROP TYPE "public"."found_pets_species_enum"`);
        await queryRunner.query(`DROP TABLE "lost_pets"`);
        await queryRunner.query(`DROP TYPE "public"."lost_pets_size_enum"`);
        await queryRunner.query(`DROP TYPE "public"."lost_pets_species_enum"`);
    }

}
