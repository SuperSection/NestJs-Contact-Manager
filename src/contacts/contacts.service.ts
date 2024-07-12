import { Injectable } from '@nestjs/common';
import { CreateContactDto, UpdateContactDto } from './dto';
import { PrismaService } from './../prisma/prisma.service';
import { Contact } from './types';

@Injectable()
export class ContactsService {

  constructor(private readonly prisma: PrismaService) {}

  async findContacts(): Promise<Contact[]> {
    throw new Error('Method not implemented.');
  }

  updateContact(userId: number, contactId: number, updateContactDto: UpdateContactDto) {
    throw new Error('Method not implemented.');
  }
  find(arg0: { where: { userId: number; name: any; }; }) {
    throw new Error('Method not implemented.');
  }
  findAndCount(arg0: { where: { userId: number; }; }) {
    throw new Error('Method not implemented.');
  }

  async createContact(userId: number, contactPayload: CreateContactDto) {
    const newContact = await this.prisma.contact.create({
      data: {
      },
    });
    return newContact;
  }
}
