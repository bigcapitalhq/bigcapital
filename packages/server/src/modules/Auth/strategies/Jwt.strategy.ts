import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthSigninService } from '../commands/AuthSignin.service';
import { JwtPayload } from '../Auth.interfaces';
import { ConfigService } from '@nestjs/config';
import { JWT_ISSUER, JWT_AUDIENCE } from '../Auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authSigninService: AuthSigninService,
    private readonly configService: ConfigService,
  ) {
    const secretOrKey = configService.get<string>('jwt.secret');
    if (!secretOrKey) {
      throw new Error(
        'APP_JWT_SECRET is not configured. Generate a strong secret (e.g. `openssl rand -base64 48`) and set it as APP_JWT_SECRET in your environment or .env file.',
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithms: ['HS384'],
    });
  }

  validate(payload: JwtPayload) {
    return this.authSigninService.verifyPayload(payload);
  }
}
