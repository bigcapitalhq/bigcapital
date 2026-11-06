/**
 * A contribution registered in a host registry.
 */
export interface Identifiable {
  id: string;
}

export interface Disposable {
  dispose(): void;
}

export interface RegistryEntry<T> {
  item: T;
  owner: string;
}

export class DuplicateContributionError extends Error {
  constructor(
    public readonly contributionId: string,
    public readonly existingOwner: string,
    public readonly attemptedOwner: string,
  ) {
    super(
      `Contribution "${contributionId}" is already registered by "${existingOwner}" and cannot be registered again by "${attemptedOwner}".`,
    );
    this.name = 'DuplicateContributionError';
  }
}

/**
 * Generic, ownership-aware contribution registry.
 *
 * Every contribution is registered by an owner (usually an extension id). The
 * owner can later remove all of its contributions in one call, which makes
 * disabling or uninstalling an extension deterministic.
 */
export class Registry<T extends Identifiable> {
  private readonly entries = new Map<string, RegistryEntry<T>>();

  /**
   * Registers a contribution and returns a disposable handle.
   *
   * @throws DuplicateContributionError when the id is already registered.
   */
  register(item: T, owner: string): Disposable {
    const id = item.id;
    const existing = this.entries.get(id);

    if (existing) {
      throw new DuplicateContributionError(id, existing.owner, owner);
    }

    const entry: RegistryEntry<T> = { item, owner };
    this.entries.set(id, entry);

    let disposed = false;

    return {
      dispose: () => {
        if (disposed) {
          return;
        }
        disposed = true;

        // Only remove the exact entry we registered. This prevents a stale
        // disposable from deleting a replacement registered by someone else.
        if (this.entries.get(id) === entry) {
          this.entries.delete(id);
        }
      },
    };
  }

  get(id: string): T | undefined {
    return this.entries.get(id)?.item;
  }

  getOwner(id: string): string | undefined {
    return this.entries.get(id)?.owner;
  }

  getAll(): T[] {
    return Array.from(this.entries.values(), (entry) => entry.item);
  }

  getByOwner(owner: string): T[] {
    return Array.from(this.entries.values())
      .filter((entry) => entry.owner === owner)
      .map((entry) => entry.item);
  }

  has(id: string): boolean {
    return this.entries.has(id);
  }

  remove(id: string): boolean {
    return this.entries.delete(id);
  }

  /**
   * Removes every contribution owned by the given owner.
   *
   * @returns the number of removed contributions.
   */
  removeByOwner(owner: string): number {
    let removed = 0;

    for (const [id, entry] of this.entries) {
      if (entry.owner === owner) {
        this.entries.delete(id);
        removed += 1;
      }
    }

    return removed;
  }

  clear(): void {
    this.entries.clear();
  }

  get size(): number {
    return this.entries.size;
  }
}
