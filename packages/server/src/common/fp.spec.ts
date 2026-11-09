import { assoc, ifElse, unless, when } from '@/common/fp';

describe('common/fp helpers', () => {
  describe('when', () => {
    it('applies f when predicate passes', () => {
      const result = when(
        (n: number) => n > 5,
        (n: number) => n * 2,
      )(10);
      expect(result).toBe(20);
    });

    it('returns value unchanged when predicate fails', () => {
      const result = when(
        (n: number) => n > 5,
        (n: number) => n * 2,
      )(3);
      expect(result).toBe(3);
    });
  });

  describe('unless', () => {
    it('applies f when predicate fails', () => {
      const result = unless(
        (n: number) => n > 5,
        (n: number) => n * 2,
      )(3);
      expect(result).toBe(6);
    });

    it('returns value unchanged when predicate passes', () => {
      const result = unless(
        (n: number) => n > 5,
        (n: number) => n * 2,
      )(10);
      expect(result).toBe(10);
    });
  });

  describe('ifElse', () => {
    it('routes to onTrue when predicate passes', () => {
      const result = ifElse(
        (n: number) => n % 2 === 0,
        (n: number) => `even:${n}`,
        (n: number) => `odd:${n}`,
      )(4);
      expect(result).toBe('even:4');
    });

    it('routes to onFalse when predicate fails', () => {
      const result = ifElse(
        (n: number) => n % 2 === 0,
        (n: number) => `even:${n}`,
        (n: number) => `odd:${n}`,
      )(5);
      expect(result).toBe('odd:5');
    });
  });

  describe('assoc', () => {
    it('adds a new key without mutating the source object', () => {
      const source = { id: 1, name: 'a' };
      const result = assoc('total', 10, source);

      expect(result).toEqual({ id: 1, name: 'a', total: 10 });
      expect(source).toEqual({ id: 1, name: 'a' });
    });

    it('overrides an existing key', () => {
      const result = assoc('name', 'b', { name: 'a' });
      expect(result).toEqual({ name: 'b' });
    });

    it('keeps prototype-less object values', () => {
      const result = assoc('meta', null, { id: 2 });
      expect(result).toEqual({ id: 2, meta: null });
    });
  });
});
