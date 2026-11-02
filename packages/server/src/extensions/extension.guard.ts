import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import type { Request } from 'express';
import { EXTENSION_ROUTE_PREFIX } from './extension.constants';
import { ExtensionManager } from './extension.manager';

const EXTENSION_ROUTE_PATTERN = new RegExp(
  `^${EXTENSION_ROUTE_PREFIX.replace(/\//g, '\\/')}([^/]+)(?:/|$)`,
);

/**
 * Global guard that rejects `/api/ext/<id>/...` requests when the extension is
 * not enabled for the current organization.
 *
 * Non-extension routes are always allowed. Requests without a tenant context
 * are left to the tenancy guards.
 */
@Injectable()
export class ExtensionEnabledGuard implements CanActivate {
  constructor(
    private readonly manager: ExtensionManager,
    private readonly cls: ClsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const path = (
      request.path ||
      request.originalUrl ||
      request.url ||
      ''
    ).split('?')[0];
    const match = path.match(EXTENSION_ROUTE_PATTERN);

    if (!match) {
      return true;
    }

    const extensionId = decodeURIComponent(match[1]);
    const organizationId = this.cls.get<string>('organizationId');

    if (!organizationId) {
      return true;
    }

    const enabled = await this.manager.isEnabled(extensionId, organizationId);

    if (!enabled) {
      throw new ForbiddenException(
        `Extension "${extensionId}" is not enabled for this organization.`,
      );
    }

    return true;
  }
}
