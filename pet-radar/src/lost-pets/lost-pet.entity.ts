import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('lost_pets')
export class LostPet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 100 })
  species: string;

  @Column({ length: 255 })
  breed: string;

  @Column({ length: 100 })
  color: string;

  @Column({ length: 50 })
  size: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: true })
  photo_url: string | null;

  @Column({ length: 255 })
  owner_name: string;

  @Column({ length: 255 })
  owner_email: string;

  @Column({ length: 50 })
  owner_phone: string;

  @Column({ type: 'real' })
  latitude: number;

  @Column({ type: 'real' })
  longitude: number;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'datetime' })
  lost_date: Date;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
