import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    async findByUsername(username: string): Promise<any> {
        return username;
    }
}
