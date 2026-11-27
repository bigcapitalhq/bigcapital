import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { AuthSigninService } from '@/modules/Auth/commands/AuthSignin.service';
import { AuthSigninResponseDto } from '@/modules/Auth/dtos/AuthSigninResponse.dto';
import { TwoFactorSetupRequiredException } from '@/modules/Auth/two-factor/TwoFactor.exceptions';
import { TwoFactorSigninService } from '@/modules/Auth/two-factor/TwoFactorSignin.service';

@Injectable()
export class SamlSigninService {
  constructor(
    @Inject(SystemUser.name) private readonly users: typeof SystemUser,
    private readonly signin: AuthSigninService,
    private readonly twoFactor: TwoFactorSigninService,
  ) {}

  async begin(
    organizationId: string,
    email: string,
  ): Promise<AuthSigninResponseDto> {
    const normalizedEmail = email.trim().toLowerCase();
    // Invites can create separate system accounts with the same email.
    const matches = await this.users
      .query()
      .select('users.*')
      .join('user_tenants', 'user_tenants.userId', 'users.id')
      .join('tenants', 'tenants.id', 'user_tenants.tenantId')
      .where('tenants.organizationId', organizationId)
      .where('users.email', normalizedEmail)
      .where('users.active', true)
      .where('users.verified', true)
      .limit(2);
    const [user] = matches;
    if (matches.length !== 1 || user.email.toLowerCase() !== normalizedEmail) {
      throw new UnauthorizedException('SSO sign-in is unavailable.');
    }

    const tenant = await this.signin.resolveScopedTenant(user, organizationId);
    try {
      const challenge = await this.twoFactor.begin(
        user,
        tenant,
        false,
        organizationId,
      );
      return (
        challenge ??
        this.signin.issueSigninResponse(user, false, organizationId)
      );
    } catch (error) {
      if (error instanceof TwoFactorSetupRequiredException) {
        throw new ForbiddenException({
          code: 'SAML_MFA_ENROLLMENT_REQUIRED',
          message:
            'Sign in with your existing method to set up two-factor authentication, then try SSO again.',
        });
      }
      throw error;
    }
  }
}
