import { Body, Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create-contact')
  async createContact(@Body() body) {
    return this.userService.createContact(body);
  }
  
}
