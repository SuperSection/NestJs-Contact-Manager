import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../user/entities/user.entity';
import { AuthPayloadDto } from './dto/auth.dto';
import { jwtConstants } from '../constants';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authPayload: AuthPayloadDto): Promise<Tokens> {
    const hashedPassword = await this.hashData(authPayload.password);

    const newUser = new User({
      email: authPayload.email,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(newUser.id, newUser.email);
    await this.updateRefreshTokenHash(newUser.id, tokens.refresh_token);

    return tokens;
  }

  async signIn(authPayload: AuthPayloadDto): Promise<Tokens> {
    const user = await this.userRepository.findOne({
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

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches)
      throw new ForbiddenException('Unauthenticated User');

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async signOut(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        refreshToken: Not(IsNull()),
      },
    });

    user.refreshToken = null;
    await this.entityManager.save(user);
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async generateTokens(userId: number, email: string) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: jwtConstants.accessTokenSecret,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
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

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    user.refreshToken = hashedRefreshToken;
    await this.entityManager.save(user);
  }
}
