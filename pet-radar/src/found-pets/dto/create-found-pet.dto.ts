import { IsString, IsNumber, IsOptional, IsEmail, IsDateString, Min, Max } from 'class-validator';

export class CreateFoundPetDto {
  @IsString()
  species: string;

  @IsOptional()
  @IsString()
  breed?: string;

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
  finder_name: string;

  @IsEmail()
  finder_email: string;

  @IsString()
  finder_phone: string;

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
  found_date: string;
}
