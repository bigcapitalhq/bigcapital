import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LicenseService } from '../License.service';
import { LICENSE_FEATURE_KEY } from '../constants';

@Injectable()
export class LicenseGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly licenseService: LicenseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFeature =
      this.reflector.get<string>(LICENSE_FEATURE_KEY, context.getHandler()) ||
      this.reflector.get<string>(LICENSE_FEATURE_KEY, context.getClass());

    if (!requiredFeature) {
      return true; // No license required
    }

    const isLicensed = await this.licenseService.isFeatureLicensed(requiredFeature);

    if (!isLicensed) {
      throw new ForbiddenException(
        'This feature requires a valid Enterprise license.',
      );
    }

    return true;
  }
}
