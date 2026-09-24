import { ClsService } from 'nestjs-cls';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { ModelObject } from 'objection';
import { JwtPayload } from '../Auth.interfaces';
import { JWT_ISSUER, JWT_AUDIENCE } from '../Auth.constants';
import { InvalidEmailPasswordException } from '../exceptions/InvalidEmailPassword.exception';
import { UserNotFoundException } from '../exceptions/UserNotFound.exception';

@Injectable()
export class AuthSigninService {
  constructor(
    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,
    private readonly jwtService: JwtService,
    private readonly clsService: ClsService,
  ) { }

  /**
   * Validates the given email and password.
   * @param {string} email - Signin email address.
   * @param {string} password - Signin password.
   * @returns {Promise<ModelObject<SystemUser>>}
   */
  async signin(
    email: string,
    password: string,
  ): Promise<ModelObject<SystemUser>> {
    let user: SystemUser;

    try {
      user = await this.systemUserModel
        .query()
        .findOne({ email })
        .throwIfNotFound();
    } catch (err) {
      throw new InvalidEmailPasswordException(email);
    }
    if (!(await user.checkPassword(password))) {
      throw new InvalidEmailPasswordException(email);
    }
    return user;
  }

  /**
   * Verifies the given jwt payload.
   * @param {JwtPayload} payload
   * @returns {Promise<any>}
   */
  async verifyPayload(payload: JwtPayload): Promise<any> {
    if (payload.iss !== JWT_ISSUER || payload.aud !== JWT_AUDIENCE) {
      throw new UnauthorizedException('Invalid token claims.');
    }
    let user: SystemUser;

    try {
      user = await this.systemUserModel
        .query()
        .findOne({ id: Number(payload.sub) })
        .throwIfNotFound();

      this.clsService.set('tenantId', user.tenantId);
      this.clsService.set('userId', user.id);
    } catch (error) {
      throw new UserNotFoundException(String(payload.sub));
    }
    return payload;
  }

  /**
   *
   * @param {SystemUser} user
   * @returns {string}
   */
  signToken(user: SystemUser): string {
    const payload = {
      sub: String(user.id),
    };
    return this.jwtService.sign(payload, {
      expiresIn: '1d',
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
  }
}
