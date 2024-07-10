import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from '../common/decorators';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth.dto';
import { RefreshTokenGuard } from '../common/guards';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('public/register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() authPayload: AuthPayloadDto): Promise<Tokens> {
    return this.authService.signUp(authPayload);
  }

  @Public()
  @Post('public/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() authPayload: AuthPayloadDto): Promise<Tokens> {
    return this.authService.signIn(authPayload);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.signOut(userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshToken(userId, refreshToken);
  }
}
