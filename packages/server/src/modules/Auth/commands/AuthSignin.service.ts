import { ClsService } from 'nestjs-cls';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { ModelObject } from 'objection';
import { JwtPayload } from '../Auth.interfaces';
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
    let user: SystemUser;

    try {
      user = await this.systemUserModel
        .query()
        .findOne({ email: payload.sub })
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
      sub: user.email,
    };
    return this.jwtService.sign(payload);
  }
}
