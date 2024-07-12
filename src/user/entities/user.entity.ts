import { Contact } from '../../contacts/entities/contact.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ nullable: true, name: 'refresh_token' })
  refreshToken: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Contact, (contact) => contact.userId, {
    onDelete: 'CASCADE',
  })
  contacts: Contact[];

  constructor(users: Partial<User>) {
    Object.assign(this, users);
  }
}
