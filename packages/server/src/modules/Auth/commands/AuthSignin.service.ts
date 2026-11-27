import { ClsService } from 'nestjs-cls';
import {
  Inject,
  Injectable,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import { OrganizationSigninPolicy } from '../OrganizationSigninPolicy';
import { JwtService } from '@nestjs/jwt';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { TenantModel } from '@/modules/System/models/TenantModel';
import { UserTenant } from '@/modules/System/models/UserTenant.model';
import { ModelObject } from 'objection';
import { JwtPayload } from '../Auth.interfaces';
import { JWT_ISSUER, JWT_AUDIENCE } from '../Auth.constants';
import { InvalidEmailPasswordException } from '../exceptions/InvalidEmailPassword.exception';
import { UserNotFoundException } from '../exceptions/UserNotFound.exception';
import { NoActiveWorkspaceException } from '../exceptions/NoActiveWorkspace.exception';
import { AuthSigninResponseDto } from '../dtos/AuthSigninResponse.dto';

@Injectable()
export class AuthSigninService {
  constructor(
    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,

    @Optional() private readonly organizationPolicy: OrganizationSigninPolicy,

    @Inject(UserTenant.name)
    private readonly userTenantModel: typeof UserTenant,

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
    } catch (_err) {
      throw new InvalidEmailPasswordException(email);
    }
    // Accounts created through Google (or pending invites) may not have a
    // password set yet, in which case password sign-in is not available.
    if (!user.password || !(await user.checkPassword(password))) {
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

      this.clsService.set('userId', user.id);
    } catch (_error) {
      throw new UserNotFoundException(String(payload.sub));
    }
    if (payload.samlOrganizationId) {
      if (!this.organizationPolicy || !user.active || !user.verified) {
        throw new UnauthorizedException('Organization sign-in is unavailable.');
      }
      // Account and MFA guards also read this context on headerless requests.
      this.clsService.set('organizationId', payload.samlOrganizationId);
      return { ...payload, scopedOrganizationId: payload.samlOrganizationId };
    }
    return payload;
  }

  /**
   * Resolves which tenant a user should sign in to:
   *  1. Their explicit default workspace (`defaultTenantId`).
   *  2. Their initial/legacy workspace (`tenantId`).
   *  3. The first active workspace they have a membership in.
   * Returns null when the user has no active workspace available.
   */
  async resolveSigninTenant(user: SystemUser): Promise<TenantModel | null> {
    if (user.defaultTenantId) {
      const tenant = await this.tryGetActiveTenantForUser(
        user.id,
        user.defaultTenantId,
      );
      if (tenant) return tenant;
    }
    if (user.tenantId) {
      const tenant = await this.tryGetActiveTenantForUser(
        user.id,
        user.tenantId,
      );
      if (tenant) return tenant;
    }
    const memberships = await this.userTenantModel
      .query()
      .where('userId', user.id)
      .withGraphFetched('tenant')
      .orderBy('id', 'asc');

    const active = memberships.find((m) => m.tenant?.isActive);
    return active?.tenant ?? null;
  }

  async resolveScopedTenant(
    user: SystemUser,
    organizationId: string,
  ): Promise<TenantModel> {
    if (!this.organizationPolicy || !user.active || !user.verified) {
      throw new UnauthorizedException('Organization sign-in is unavailable.');
    }
    const tenantId =
      await this.organizationPolicy.resolveTenantId(organizationId);
    const tenant = await this.tryGetActiveTenantForUser(user.id, tenantId);
    if (!tenant)
      throw new UnauthorizedException('Organization sign-in is unavailable.');
    return tenant;
  }

  /**
   * Returns the tenant only when the user is a member and the tenant is active.
   */
  private async tryGetActiveTenantForUser(
    userId: number,
    tenantId: number,
  ): Promise<TenantModel | null> {
    const membership = await this.userTenantModel
      .query()
      .where({ userId, tenantId })
      .withGraphFetched('tenant')
      .first();

    if (!membership?.tenant?.isActive) return null;
    return membership.tenant;
  }

  /**
   * Builds the sign-in response of the given user: their workspace and a token.
   * @throws {UnauthorizedException} when the user has no active workspace.
   */
  async issueSigninResponse(
    user: SystemUser,
    rememberMe = false,
    scopedOrganizationId?: string,
  ): Promise<AuthSigninResponseDto> {
    const tenant = scopedOrganizationId
      ? await this.resolveScopedTenant(user, scopedOrganizationId)
      : await this.resolveSigninTenant(user);

    if (!tenant) {
      throw new NoActiveWorkspaceException();
    }
    return {
      accessToken: this.signToken(user, rememberMe, scopedOrganizationId),
      organizationId: tenant.organizationId,
      tenantId: tenant.id,
      userId: user.id,
    };
  }

  /**
   *
   * @param {SystemUser} user
   * @param {boolean} rememberMe - Extends the token lifetime when the user opted to stay signed in.
   * @returns {string}
   */
  signToken(
    user: SystemUser,
    rememberMe = false,
    scopedOrganizationId?: string,
  ): string {
    const payload = {
      sub: String(user.id),
      ...(scopedOrganizationId && { samlOrganizationId: scopedOrganizationId }),
    };
    const expiresIn = rememberMe ? '30d' : '1d';
    return this.jwtService.sign(payload, {
      expiresIn,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
  }
}
