// src/auth/jwt.strategy.ts

/**
 * JwtStrategy - Validates JWT tokens and attaches authenticated user info to requests.
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'), // No fallback
    });
  }

  async validate(payload: any) {
    console.log('JWT payload:', payload); // Debug log
    const user = await this.usersService.findById(payload.sub);
    console.log('User found:', user); // Debug log
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      id: user.id,
      email: user.email,
      tenantId: user.tenantId,
      roles: [user.role], // Wrap single role string into array
    };
  }
}
