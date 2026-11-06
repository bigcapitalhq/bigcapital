import { Injectable } from '@nestjs/common';
import type { TaxProvider } from '@bigcapital/extension-sdk/bridges';
import {
  BridgeRegistry,
  type RegisteredBridgeProvider,
} from '../bridge.registry';

@Injectable()
export class TaxRegistry {
  private readonly registry = new BridgeRegistry<TaxProvider>();

  register(owner: string, provider: TaxProvider) {
    return this.registry.register(owner, provider);
  }

  getProviders(): RegisteredBridgeProvider<TaxProvider>[] {
    return this.registry.getEntries();
  }

  /**
   * Resolves the active tax provider for a tenant.
   *
   * Core tax calculation is untouched until the tax integration phase; when no
   * provider is configured, this returns `undefined` and core behavior applies.
   */
  getActive(activeKey?: string): TaxProvider | undefined {
    if (activeKey) {
      const provider = this.registry.get(activeKey);

      if (provider) {
        return provider;
      }
    }

    return this.registry.getEntries()[0]?.provider;
  }

  removeByOwner(owner: string): number {
    return this.registry.removeByOwner(owner);
  }

  clear(): void {
    this.registry.clear();
  }
}
