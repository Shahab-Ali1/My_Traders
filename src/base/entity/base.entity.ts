import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  Entity,
  BaseEntity as typeOrmBaseEntity,
  Column,
} from 'typeorm';

@Entity()
export abstract class BaseEntity extends typeOrmBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: Date | null;

  @Exclude()
  @Column()
  flags: number;
}
