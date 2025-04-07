import { ClsService } from 'nestjs-cls';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { ModelObject } from 'objection';
import { JwtPayload } from '../Auth.interfaces';

@Injectable()
export class AuthSigninService {
  constructor(
    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,
    private readonly jwtService: JwtService,
    private readonly clsService: ClsService,
  ) {}

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
      throw new UnauthorizedException(
        `There isn't any user with email: ${email}`,
      );
    }
    if (!(await user.checkPassword(password))) {
      throw new UnauthorizedException(
        `Wrong password for user with email: ${email}`,
      );
    }
    if (!user.verified) {
      throw new UnauthorizedException(
       `The user is not verified yet, check out your mail inbox.`
      );
    }
    return user;
  }

  /**
   * Verifies the given jwt payload.
   * @param {JwtPayload} payload
   * @returns {Promise<any>}
   */
  async verifyPayload(payload: JwtPayload): Promise<any> {
    let user: SystemUser;

    try {
      user = await this.systemUserModel
        .query()
        .findOne({ email: payload.sub })
        .throwIfNotFound();

      this.clsService.set('tenantId', user.tenantId);
      this.clsService.set('userId', user.id);
    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${payload.sub}`,
      );
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
      sub: user.email,
    };
    return this.jwtService.sign(payload);
  }
}
