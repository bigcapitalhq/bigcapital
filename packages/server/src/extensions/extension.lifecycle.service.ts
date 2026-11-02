import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { EXTENSIONS_TOKEN } from './extension.constants';
import { validateExtensionControllers } from './extension.routes';
import { ExtensionContextFactory } from './extension.context';
import { ExtensionEventBridge } from './extension.event-bridge';
import { ExtensionManager } from './extension.manager';
import type { ValidatedExtension } from './extension.types';

/**
 * Owns the process-level extension lifecycle:
 *
 *  1. sync the compiled catalog into the system DB
 *  2. wire event subscribers
 *  3. run `onEnable` for installed extensions
 *  4. run `onDisable` and unwire subscribers on shutdown
 *
 * Per-tenant enable/disable is enforced by `ExtensionEnabledGuard`; the hooks
 * here are process-level setup/teardown, not per-tenant callbacks.
 */
@Injectable()
export class ExtensionLifecycleService
  implements OnApplicationBootstrap, OnModuleDestroy
{
  private readonly logger = new Logger(ExtensionLifecycleService.name);

  constructor(
    @Inject(EXTENSIONS_TOKEN)
    private readonly extensions: ValidatedExtension[],

    private readonly manager: ExtensionManager,
    private readonly eventBridge: ExtensionEventBridge,
    private readonly contextFactory: ExtensionContextFactory,
    private readonly discoveryService: DiscoveryService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    validateExtensionControllers(
      this.discoveryService.getControllers(),
      this.extensions,
    );

    await this.manager.syncCatalog();
    this.eventBridge.wire();

    for (const extension of this.extensions) {
      if (!extension.onEnable) {
        continue;
      }

      try {
        await extension.onEnable(
          this.contextFactory.create(extension.manifest),
        );
      } catch (error) {
        this.logger.error(
          `Extension "${extension.manifest.id}" onEnable failed: ${(error as Error).message}`,
          (error as Error).stack,
        );
      }
    }

    // `onEnable` hooks may register additional subscribers.
    this.eventBridge.wire();
  }

  async onModuleDestroy(): Promise<void> {
    for (const extension of this.extensions) {
      if (!extension.onDisable) {
        continue;
      }

      try {
        await extension.onDisable(
          this.contextFactory.create(extension.manifest),
        );
      } catch (error) {
        this.logger.error(
          `Extension "${extension.manifest.id}" onDisable failed: ${(error as Error).message}`,
          (error as Error).stack,
        );
      }
    }

    this.eventBridge.dispose();
  }
}
