import { DuplicateContributionError } from '@bigcapital/extension-sdk';

export interface OwnedContribution {
  id: string;
  owner: string;
}

/**
 * Ownership-aware catalog used by every extension contribution type.
 *
 * Re-registering the same contribution id by the same owner is idempotent so
 * that manifest-declared contributions and module-time registrations can
 * coexist. A different owner registering the same id is always an error.
 */
export class ContributionCatalog<T extends OwnedContribution> {
  private readonly items = new Map<string, T>();

  register(item: T): T {
    const existing = this.items.get(item.id);

    if (existing) {
      if (existing.owner === item.owner) {
        return existing;
      }

      throw new DuplicateContributionError(item.id, existing.owner, item.owner);
    }

    this.items.set(item.id, item);

    return item;
  }

  get(id: string): T | undefined {
    return this.items.get(id);
  }

  getAll(): T[] {
    return Array.from(this.items.values());
  }

  getByOwner(owner: string): T[] {
    return this.getAll().filter((item) => item.owner === owner);
  }

  has(id: string): boolean {
    return this.items.has(id);
  }

  remove(id: string): boolean {
    return this.items.delete(id);
  }

  removeByOwner(owner: string): number {
    let removed = 0;

    for (const [id, item] of this.items) {
      if (item.owner === owner) {
        this.items.delete(id);
        removed += 1;
      }
    }

    return removed;
  }

  clear(): void {
    this.items.clear();
  }

  get size(): number {
    return this.items.size;
  }
}
