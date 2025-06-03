import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_ROUTE } from '../Auth/Auth.constants';
import { TENANT_MODELS_INIT } from './TenantModelsInitialize.module';

export const IGNORE_TENANT_MODELS_INITIALIZE =
  'IGNORE_TENANT_MODELS_INITIALIZE';
export const IgnoreTenantModelsInitialize = () =>
  SetMetadata(IGNORE_TENANT_MODELS_INITIALIZE, true);

@Injectable()
export class TenancyInitializeModelsGuard implements CanActivate {
  constructor(
    @Inject(TENANT_MODELS_INIT)
    private readonly tenantModelsInit: () => Promise<boolean>,
    private reflector: Reflector,
  ) {}

  /**
   * Initialize tenant models if the route is decorated with TriggerTenantModelsInitialize.
   * @param {ExecutionContext} context
   * @returns {Promise<boolean>}
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ROUTE,
      [context.getHandler(), context.getClass()],
    );
    // Skip initialization for public routes
    if (isPublic) {
      return true;
    }
    const shouldIgnoreInitialization =
      this.reflector.getAllAndOverride<boolean>(
        IGNORE_TENANT_MODELS_INITIALIZE,
        [context.getHandler(), context.getClass()],
      );
    // Initialize models unless the route is decorated with IgnoreTenantModelsInitialize
    if (!shouldIgnoreInitialization) {
      try {
        await this.tenantModelsInit();
      } catch (error) {
        console.error('Failed to initialize tenant models:', error);
      }
    }
    return true;
  }
}
