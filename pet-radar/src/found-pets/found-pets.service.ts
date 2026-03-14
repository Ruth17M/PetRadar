import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FoundPet } from './found-pet.entity';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
import { EmailService } from '../email/email.service';

const RADIUS_METERS = 500;

@Injectable()
export class FoundPetsService {
  constructor(
    @InjectRepository(FoundPet)
    private repo: Repository<FoundPet>,
    @InjectDataSource()
    private dataSource: DataSource,
    private emailService: EmailService,
  ) {}

  async create(dto: CreateFoundPetDto): Promise<FoundPet> {
    const pet = this.repo.create({
      species: dto.species,
      breed: dto.breed ?? null,
      color: dto.color,
      size: dto.size,
      description: dto.description ?? null,
      photo_url: dto.photo_url ?? null,
      finder_name: dto.finder_name,
      finder_email: dto.finder_email,
      finder_phone: dto.finder_phone,
      latitude: dto.latitude,
      longitude: dto.longitude,
      address: dto.address ?? null,
      found_date: new Date(dto.found_date),
    });
    const created = await this.repo.save(pet);

    const lostPets = await this.findLostPetsWithinRadius(dto.latitude, dto.longitude);
    const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;

    for (const lost of lostPets) {
      const mapImageUrl = mapboxToken
        ? this.buildMapboxStaticUrl(
            lost.longitude,
            lost.latitude,
            dto.longitude,
            dto.latitude,
          )
        : '';
      await this.emailService.sendFoundNotification({
        foundSpecies: dto.species,
        foundBreed: dto.breed ?? null,
        foundColor: dto.color,
        foundDescription: dto.description ?? null,
        finderName: dto.finder_name,
        finderEmail: dto.finder_email,
        finderPhone: dto.finder_phone,
        lostPetName: lost.name,
        lostPetAddress: lost.address ?? null,
        mapImageUrl,
      });
    }

    return created;
  }

  private async findLostPetsWithinRadius(
    lat: number,
    lng: number,
  ): Promise<Array<{ id: number; name: string; address: string | null; latitude: number; longitude: number }>> {
    const distExpr = `(6371000 * acos(min(1.0, max(-1.0, sin(radians(latitude))*sin(radians(?))+cos(radians(latitude))*cos(radians(?))*cos(radians(?)-radians(longitude))))))`;
    const query = `
      SELECT id, name, address, latitude, longitude
      FROM lost_pets
      WHERE is_active = 1 AND ${distExpr} < ?
      ORDER BY ${distExpr} ASC
    `;
    const rows = await this.dataSource.query(query, [lat, lat, lng, RADIUS_METERS, lat, lat, lng]);
    return rows.map((r: { id: number; name: string; address: string | null; latitude: number; longitude: number }) => ({
      id: r.id,
      name: r.name,
      address: r.address,
      latitude: r.latitude,
      longitude: r.longitude,
    }));
  }

  private buildMapboxStaticUrl(
    lostLng: number,
    lostLat: number,
    foundLng: number,
    foundLat: number,
  ): string {
    const token = process.env.MAPBOX_ACCESS_TOKEN;
    if (!token) return '';
    const style = 'mapbox/streets-v11';
    const pinLost = `pin-l+ff0000(${lostLng},${lostLat})`;
    const pinFound = `pin-l+00ff00(${foundLng},${foundLat})`;
    const pins = `${pinLost},${pinFound}`;
    return `https://api.mapbox.com/styles/v1/${style}/static/${pins}/auto/600x400?access_token=${token}`;
  }
}