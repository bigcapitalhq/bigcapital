import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClsService } from 'nestjs-cls';
import {
  EXTENSION_EVENT_TIMEOUT_MS,
  EXTENSION_OPTIONS_TOKEN,
} from './extension.constants';
import { ExtensionContributionRegistry } from './extension.registry';
import { ExtensionManager } from './extension.manager';
import type { ExtensionsModuleOptions } from './extension.types';
import type { EventSubscriberContribution } from './extension.types';

/**
 * Bridges extension event subscribers to the host `EventEmitter2`.
 *
 * Subscribers are isolated: handler errors and timeouts are logged and never
 * propagate into the core request that emitted the event. Tenant enablement is
 * checked before invoking a handler when a tenant context is available.
 */
@Injectable()
export class ExtensionEventBridge {
  private readonly logger = new Logger(ExtensionEventBridge.name);
  private readonly unsubscribers: Array<() => void> = [];
  private readonly wiredSubscriberIds = new Set<string>();

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly registry: ExtensionContributionRegistry,
    private readonly manager: ExtensionManager,
    private readonly cls: ClsService,

    @Inject(EXTENSION_OPTIONS_TOKEN)
    private readonly options: ExtensionsModuleOptions,
  ) {}

  wire(): void {
    const defaultTimeoutMs =
      this.options.eventTimeoutMs ?? EXTENSION_EVENT_TIMEOUT_MS;

    for (const subscriber of this.registry.getEventSubscribers()) {
      if (this.wiredSubscriberIds.has(subscriber.id)) {
        continue;
      }

      this.wireSubscriber(subscriber, defaultTimeoutMs);
      this.wiredSubscriberIds.add(subscriber.id);
    }
  }

  dispose(): void {
    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
    this.unsubscribers.length = 0;
    this.wiredSubscriberIds.clear();
  }

  private wireSubscriber(
    subscriber: EventSubscriberContribution,
    defaultTimeoutMs: number,
  ): void {
    const wrapped = async (payload: unknown) => {
      try {
        const organizationId = this.cls.get<string>('organizationId');

        if (
          organizationId &&
          !(await this.manager.isEnabled(subscriber.owner, organizationId))
        ) {
          return;
        }

        await withTimeout(
          Promise.resolve(subscriber.handler(payload)),
          subscriber.options?.timeoutMs ?? defaultTimeoutMs,
        );
      } catch (error) {
        this.logger.error(
          `Extension "${subscriber.owner}" handler for "${subscriber.event}" failed: ${(error as Error).message}`,
          (error as Error).stack,
        );
      }
    };

    this.eventEmitter.on(subscriber.event, wrapped);
    this.unsubscribers.push(() => {
      this.eventEmitter.off(subscriber.event, wrapped);
    });
  }
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<T> {
  let timer: NodeJS.Timeout;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () =>
        reject(new Error(`Extension handler timed out after ${timeoutMs}ms.`)),
      timeoutMs,
    );
    timer.unref?.();
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
}
