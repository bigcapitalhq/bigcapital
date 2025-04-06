import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthSigninService } from '../commands/AuthSignin.service';
import { ModelObject } from 'objection';
import { SystemUser } from '../../System/models/SystemUser';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authSigninService: AuthSigninService) {
    super({
      usernameField: 'email',
      passReqToCallback: false,
      session: false,
    });
  }

  validate(email: string, password: string): Promise<ModelObject<SystemUser>> {
    return this.authSigninService.signin(email, password);
  }
}
