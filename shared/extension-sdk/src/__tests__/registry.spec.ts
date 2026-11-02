import { describe, expect, it } from 'vitest';
import { DuplicateContributionError, Registry } from '../registry';

interface TestContribution {
  id: string;
  value: string;
}

const contribution = (id: string, value = id): TestContribution => ({
  id,
  value,
});

describe('Registry', () => {
  it('registers and retrieves contributions', () => {
    const registry = new Registry<TestContribution>();

    registry.register(contribution('a'), 'acme.one');
    registry.register(contribution('b'), 'acme.two');

    expect(registry.get('a')?.value).toBe('a');
    expect(registry.getAll().map((item) => item.id)).toEqual(['a', 'b']);
    expect(registry.getByOwner('acme.one').map((item) => item.id)).toEqual([
      'a',
    ]);
    expect(registry.size).toBe(2);
  });

  it('rejects duplicate contribution ids with owner information', () => {
    const registry = new Registry<TestContribution>();

    registry.register(contribution('a'), 'acme.one');

    expect(() => registry.register(contribution('a'), 'acme.two')).toThrow(
      DuplicateContributionError,
    );

    try {
      registry.register(contribution('a'), 'acme.two');
    } catch (error) {
      expect((error as Error).message).toContain('acme.one');
      expect((error as Error).message).toContain('acme.two');
    }
  });

  it('removes a contribution when its disposable is disposed', () => {
    const registry = new Registry<TestContribution>();
    const disposable = registry.register(contribution('a'), 'acme.one');

    disposable.dispose();

    expect(registry.has('a')).toBe(false);
    expect(registry.size).toBe(0);
  });

  it('does not let a stale disposable remove a replacement', () => {
    const registry = new Registry<TestContribution>();
    const disposable = registry.register(contribution('a'), 'acme.one');

    disposable.dispose();
    registry.register(contribution('a'), 'acme.two');
    disposable.dispose();

    expect(registry.get('a')?.value).toBe('a');
    expect(registry.getOwner('a')).toBe('acme.two');
  });

  it('removes all contributions owned by an extension', () => {
    const registry = new Registry<TestContribution>();

    registry.register(contribution('a'), 'acme.one');
    registry.register(contribution('b'), 'acme.one');
    registry.register(contribution('c'), 'acme.two');

    expect(registry.removeByOwner('acme.one')).toBe(2);
    expect(registry.getAll().map((item) => item.id)).toEqual(['c']);
  });

  it('clears the registry', () => {
    const registry = new Registry<TestContribution>();

    registry.register(contribution('a'), 'acme.one');
    registry.clear();

    expect(registry.size).toBe(0);
  });
});
