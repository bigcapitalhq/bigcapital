/**
 * Shared fp-ts combinators used across the codebase.
 *
 * Import conventions for fp-ts modules:
 * - `import * as FF from 'fp-ts/function'`
 * - `import * as FA from 'fp-ts/Array'`
 * - `import * as FO from 'fp-ts/Option'`
 */
import * as FA from 'fp-ts/Array';
import * as FF from 'fp-ts/function';
import * as FO from 'fp-ts/Option';

/**
 * Conditional mapper: yields `f(a)` wrapped in `some` when `pred(a)` holds,
 * `none` otherwise (fp-ts equivalent of ramda's `R.when`).
 */
export const when =
  <A, B>(pred: FF.Predicate<A>, f: (a: A) => B) =>
  (a: A): FO.Option<B> =>
    pred(a) ? FO.some(f(a)) : FO.none;

/**
 * Inverse conditional mapper: yields `f(a)` wrapped in `some` when `pred(a)`
 * fails, `none` otherwise (fp-ts equivalent of ramda's `R.unless`).
 */
export const unless =
  <A, B>(pred: FF.Predicate<A>, f: (a: A) => B) =>
  (a: A): FO.Option<B> =>
    pred(a) ? FO.none : FO.some(f(a));

/**
 * Yields the result of the first matcher that produces `some`
 * (fp-ts equivalent of composing a list of `R.when` branches).
 */
export const firstMatch =
  <A, B>(matchers: Array<(a: A) => FO.Option<B>>) =>
  (a: A): FO.Option<B> =>
    FF.pipe(
      matchers,
      FA.findFirstMap((match) => match(a)),
    );
