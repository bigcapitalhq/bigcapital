import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaymentProvider } from '@bigcapital/extension-sdk/bridges';
import {
  BridgeRegistry,
  type RegisteredBridgeProvider,
} from '../bridge.registry';

@Injectable()
export class PaymentRegistry {
  private readonly registry = new BridgeRegistry<PaymentProvider>();

  register(owner: string, provider: PaymentProvider) {
    return this.registry.register(owner, provider);
  }

  getProviders(): RegisteredBridgeProvider<PaymentProvider>[] {
    return this.registry.getEntries();
  }

  getProvider(key: string): PaymentProvider | undefined {
    return this.registry.get(key);
  }

  requireProvider(key: string): PaymentProvider {
    const provider = this.getProvider(key);

    if (!provider) {
      throw new NotFoundException(`Payment provider "${key}" was not found.`);
    }

    return provider;
  }

  removeByOwner(owner: string): number {
    return this.registry.removeByOwner(owner);
  }

  clear(): void {
    this.registry.clear();
  }
}
