import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { jwtConstants } from '../constants';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(authPayload: AuthPayloadDto): Promise<Tokens> {
    const hashedPassword = await this.hashData(authPayload.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: authPayload.email,
        password: hashedPassword,
      },
    });

    const tokens = await this.generateTokens(newUser.id, newUser.email);
    await this.updateRefreshTokenHash(newUser.id, tokens.refresh_token);

    return tokens;
  }

  async signIn(authPayload: AuthPayloadDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: authPayload.email },
    });
    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await bcrypt.compare(
      authPayload.password,
      user.password,
    );
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  refreshToken(userId: number, refreshToken: string) {
    
  }

  async signOut(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        refreshToken: {
          not: null,
        },
      },
      data: { refreshToken: null },
    });
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async generateTokens(userId: number, email: string) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.sign(
        {
          sub: userId,
          email,
        },
        {
          secret: jwtConstants.accessTokenSecret,
          expiresIn: '15m',
        },
      ),
      this.jwtService.sign(
        {
          sub: userId,
          email,
        },
        {
          secret: jwtConstants.refreshTokenSecret,
          expiresIn: '7d',
        },
      ),
    ]);

    return { access_token, refresh_token };
  }

  async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }
}
