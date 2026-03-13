import { Module } from '@nestjs/common';
import { LostPetsService } from './lost-pets.service';
import { LostPetsController } from './lost-pets.controller';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostPet } from 'src/core/db/entities/lost-pets.entity';
import { FoundPet } from 'src/core/db/entities/found-pets.entity';

@Module({
  imports:[
    EmailModule,
    TypeOrmModule.forFeature([LostPet, FoundPet]),
  ],
  providers: [LostPetsService],
  controllers: [LostPetsController],
  exports: [LostPetsService],
})
export class LostPetsModule {}
