import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostPet } from './lost-pet.entity';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPet)
    private repo: Repository<LostPet>,
  ) {}

  async create(dto: CreateLostPetDto): Promise<LostPet> {
    const pet = this.repo.create({
      name: dto.name,
      species: dto.species,
      breed: dto.breed,
      color: dto.color,
      size: dto.size,
      description: dto.description ?? null,
      photo_url: dto.photo_url ?? null,
      owner_name: dto.owner_name,
      owner_email: dto.owner_email,
      owner_phone: dto.owner_phone,
      latitude: dto.latitude,
      longitude: dto.longitude,
      address: dto.address ?? null,
      lost_date: new Date(dto.lost_date),
    });
    return this.repo.save(pet);
  }
}
