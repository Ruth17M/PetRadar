import { IsString, IsNumber, IsOptional, IsEmail, IsDateString, Min, Max } from 'class-validator';

export class CreateLostPetDto {
  @IsString()
  name: string;

  @IsString()
  species: string;

  @IsString()
  breed: string;

  @IsString()
  color: string;

  @IsString()
  size: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  photo_url?: string;

  @IsString()
  owner_name: string;

  @IsEmail()
  owner_email: string;

  @IsString()
  owner_phone: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsDateString()
  lost_date: string;
}
