import { User } from '../../user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ nullable: true, name: 'postal_address' })
  postalAddress: string;

  @ManyToOne(() => User, (user) => user.contacts)
  userId: number;

  constructor(contacts: Partial<Contact>) {
    Object.assign(this, contacts);
  }
}
