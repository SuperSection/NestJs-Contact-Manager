import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { GetCurrentUserId } from '../common/decorators';
import { ContactsService } from './contacts.service';
import { CreateContactDto, UpdateContactDto } from './dto';
import { Contact } from './types';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async createContact(
    @Body() createContactDto: CreateContactDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.contactsService.createContact(userId, createContactDto);
  }

  @Get()
  async getContacts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @GetCurrentUserId() userId: number,
  ) {
    const [contacts, total] = await this.contactsService.findAndCount({
      where: { userId },
    });
    return {
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  @Get('search')
  searchContacts(
    @Query('term') term: string,
    @GetCurrentUserId() userId: number,
  ): Promise<Contact[]> {
    return this.contactsService.findContacts();
  }

  @Put(':contactId')
  async updateContact(
    @Body() updateContactDto: UpdateContactDto,
    @GetCurrentUserId() userId: number,
    @Param('contactId') contactId: number,
  ) {
    return this.contactsService.updateContact(
      userId,
      contactId,
      updateContactDto,
    );
  }
}
