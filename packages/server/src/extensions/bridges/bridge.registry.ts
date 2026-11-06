import type { Disposable } from '@bigcapital/extension-sdk';
import type { BridgeProvider } from '@bigcapital/extension-sdk/bridges';
import { DuplicateContributionError } from '@bigcapital/extension-sdk';

export interface RegisteredBridgeProvider<
  T extends BridgeProvider = BridgeProvider,
> {
  /**
   * Namespaced key: `ext:<extensionId>:<localKey>` or `core:<localKey>`.
   */
  key: string;
  owner: string;
  localKey: string;
  provider: T;
}

/**
 * Ownership-aware registry for bridge providers.
 *
 * Provider keys are namespaced by the owner so two extensions can both expose a
 * provider named `default` without colliding.
 */
export class BridgeRegistry<T extends BridgeProvider> {
  private readonly providers = new Map<string, RegisteredBridgeProvider<T>>();

  register(owner: string, provider: T): Disposable {
    const key = namespaceProviderKey(owner, provider.key);
    const existing = this.providers.get(key);

    if (existing) {
      throw new DuplicateContributionError(key, existing.owner, owner);
    }

    const entry: RegisteredBridgeProvider<T> = {
      key,
      owner,
      localKey: provider.key,
      provider,
    };

    this.providers.set(key, entry);

    let disposed = false;

    return {
      dispose: () => {
        if (disposed) {
          return;
        }

        disposed = true;

        if (this.providers.get(key) === entry) {
          this.providers.delete(key);
        }
      },
    };
  }

  get(key: string): T | undefined {
    return this.providers.get(key)?.provider;
  }

  getEntry(key: string): RegisteredBridgeProvider<T> | undefined {
    return this.providers.get(key);
  }

  getAll(): T[] {
    return this.getEntries().map((entry) => entry.provider);
  }

  getEntries(): RegisteredBridgeProvider<T>[] {
    return Array.from(this.providers.values());
  }

  getByOwner(owner: string): T[] {
    return this.getEntries()
      .filter((entry) => entry.owner === owner)
      .map((entry) => entry.provider);
  }

  getKeys(): string[] {
    return Array.from(this.providers.keys());
  }

  removeByOwner(owner: string): number {
    let removed = 0;

    for (const [key, entry] of this.providers) {
      if (entry.owner === owner) {
        this.providers.delete(key);
        removed += 1;
      }
    }

    return removed;
  }

  clear(): void {
    this.providers.clear();
  }

  get size(): number {
    return this.providers.size;
  }
}

export function namespaceProviderKey(owner: string, localKey: string): string {
  return owner === 'core' ? `core:${localKey}` : `ext:${owner}:${localKey}`;
}
