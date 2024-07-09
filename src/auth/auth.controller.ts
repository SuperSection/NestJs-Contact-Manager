import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Tokens } from './types';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('public/register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() authPayload: AuthPayloadDto): Promise<Tokens> {
    return this.authService.signUp(authPayload);
  }

  @Post('public/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() authPayload: AuthPayloadDto): Promise<Tokens> {
    return this.authService.signIn(authPayload);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Req() req: Request) {
    const user = req.user;
    return this.authService.signOut(user['id']);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Req() req: Request) {
    const user = req.user;
    return this.authService.refreshToken(user["id"], user["refreshToken"]);
  }
}
