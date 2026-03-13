import { Module } from '@nestjs/common';
import { FoundPetsService } from './found-pets.service';
import { FoundPetsController } from './found-pets.controller';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundPet } from 'src/core/db/entities/found-pets.entity';
import { LostPet } from 'src/core/db/entities/lost-pets.entity';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([FoundPet, LostPet])
  ],
  providers: [FoundPetsService],
  controllers: [FoundPetsController],
  exports: [FoundPetsService]
})
export class FoundPetsModule {}
