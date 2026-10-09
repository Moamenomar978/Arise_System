import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') || 'secretKey',
    });
  }

  async validate(payload: any) {
    // A refresh token must not be accepted as an access token
    if (payload.typ === 'refresh') throw new UnauthorizedException();
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
