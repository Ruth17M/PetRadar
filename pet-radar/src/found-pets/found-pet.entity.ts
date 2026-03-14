import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('found_pets')
export class FoundPet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  species: string;

  @Column({ type: 'text', nullable: true })
  breed: string | null;

  @Column({ length: 100 })
  color: string;

  @Column({ length: 50 })
  size: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: true })
  photo_url: string | null;

  @Column({ length: 255 })
  finder_name: string;

  @Column({ length: 255 })
  finder_email: string;

  @Column({ length: 50 })
  finder_phone: string;

  @Column({ type: 'real' })
  latitude: number;

  @Column({ type: 'real' })
  longitude: number;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'datetime' })
  found_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
