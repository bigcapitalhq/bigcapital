import Currency from 'js-money/lib/currency';
import intl from 'react-intl-universal';

export interface MoneyParts {
  /** Minus sign for negatives, empty otherwise. */
  sign: string;
  /** `$`, `€` or `£`, otherwise the ISO 4217 code, e.g. `AED`. */
  unit: string;
  /** Narrow no-break space after a code, nothing after a symbol. */
  separator: string;
  number: string;
  /** True when the unit is an ISO code, which is typeset differently. */
  isCode: boolean;
}

/**
 * Only these symbols are unambiguous across locales; every other currency
 * shows its ISO code, since a bare local symbol (kr, ¥, $) can mean several.
 */
const UNAMBIGUOUS_SYMBOLS: Readonly<Record<string, string>> = {
  USD: '$',
  EUR: '\u20ac',
  GBP: '\u00a3',
};

// tight space for tiles, where the code is shrunk and raised.
const NARROW_NO_BREAK_SPACE = '\u202f';
// a narrow space nearly vanishes against bold digits in prose.
const NO_BREAK_SPACE = '\u00a0';
const LEFT_TO_RIGHT_ISOLATE = '\u2066';
const POP_DIRECTIONAL_ISOLATE = '\u2069';

/**
 * Keeps a numeric token in left-to-right order inside right-to-left text:
 * without it an RTL paragraph turns `1–30` into `30–1` and detaches signs.
 */
export function isolate(text: string): string {
  return `${LEFT_TO_RIGHT_ISOLATE}${text}${POP_DIRECTIONAL_ISOLATE}`;
}

// beyond ten digits a tile value no longer fits, so it goes compact.
const COMPACT_THRESHOLD = 1e10;

/** Digits after the decimal point for a currency, e.g. 2 for AED, 0 for JPY. */
export function currencyMinorUnits(currencyCode: string): number {
  const digits = (
    Currency as Record<string, { decimal_digits?: number } | undefined>
  )[currencyCode]?.decimal_digits;
  return typeof digits === 'number' ? digits : 2;
}

interface MoneyOptions {
  /** Show the currency's minor units (cents) instead of whole units. */
  withMinorUnits?: boolean;
  /** Abbreviate very large amounts, e.g. `1.2B`, so a tile value fits. */
  compactLarge?: boolean;
}

/**
 * Splits an amount so the currency unit can be typeset smaller. Grouping and
 * Latin digits match the app's other money formatting (`accounting`), which
 * does not localize digits, so `ar` shows the same numerals as reports.
 */
export function moneyParts(
  amount: number,
  currencyCode: string,
  { withMinorUnits = false, compactLarge = false }: MoneyOptions = {},
): MoneyParts {
  const digits = withMinorUnits ? currencyMinorUnits(currencyCode) : 0;
  const factor = 10 ** digits;
  const rounded = Math.round(amount * factor) / factor;
  const symbol = UNAMBIGUOUS_SYMBOLS[currencyCode];

  const isCompact = compactLarge && Math.abs(rounded) >= COMPACT_THRESHOLD;
  const isCode = !symbol && !!currencyCode;

  return {
    sign: rounded < 0 ? '\u2212' : '',
    unit: symbol ?? currencyCode,
    separator: isCode ? NARROW_NO_BREAK_SPACE : '',
    number: new Intl.NumberFormat(
      'en-US',
      isCompact
        ? { notation: 'compact', maximumFractionDigits: 1 }
        : { minimumFractionDigits: digits, maximumFractionDigits: digits },
    ).format(Math.abs(rounded)),
    isCode,
  };
}

/**
 * Money for running text, e.g. `$68,040`, `−€1,200` or `AED 306,640`,
 * isolated so it keeps its order inside right-to-left sentences.
 */
export function formatMoney(
  amount: number,
  currencyCode: string,
  options?: MoneyOptions,
): string {
  const { sign, unit, isCode, number } = moneyParts(
    amount,
    currencyCode,
    options,
  );
  return isolate(`${sign}${unit}${isCode ? NO_BREAK_SPACE : ''}${number}`);
}

// grouping matches the app's money formatting (`accounting`): 12,345.
const wholeNumber = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

/** Plain grouped number for statement cells, where the currency is the header. */
export function formatNumber(amount: number): string {
  const rounded = Math.round(amount);
  const number = wholeNumber.format(Math.abs(rounded));
  return rounded < 0 ? `(${number})` : number;
}

/**
 * An amount without its currency, for list rows under a value that already
 * shows the unit once, e.g. `239,940` or `−1,200`.
 */
export function formatAmount(amount: number): string {
  const rounded = Math.round(amount);
  return isolate(
    `${rounded < 0 ? '\u2212' : ''}${wholeNumber.format(Math.abs(rounded))}`,
  );
}

const percentText = (fraction: number) =>
  `${Math.round(Math.abs(fraction) * 100)}%`;

/** A fraction as a whole percentage without sign, e.g. `0.29` to `29%`. */
export function formatPercent(fraction: number): string {
  return isolate(percentText(fraction));
}

/** A signed whole percentage, e.g. `+29%` or `−4%`. */
export function formatDelta(fraction: number): string {
  return isolate(`${fraction < 0 ? '\u2212' : '+'}${percentText(fraction)}`);
}

/** A day range, e.g. `1–30`, or an open-ended one, e.g. `31+`. */
export function formatRange(from: number, to?: number): string {
  return isolate(to === undefined ? `${from}+` : `${from}\u2013${to}`);
}

/**
 * The app locale for dates, with Latin digits: reports show Latin numerals in
 * every locale, and Arabic month names should not bring Arabic-Indic digits.
 */
function dateLocale(): string {
  const locale = intl.getInitOptions()?.currentLocale || 'en';
  return `${locale}-u-nu-latn`;
}

const toUtcDate = (day: string) =>
  new Date(
    Date.UTC(
      Number(day.slice(0, 4)),
      Number(day.slice(5, 7)) - 1,
      Number(day.slice(8, 10)) || 1,
    ),
  );

/** A `YYYY-MM` key in the user's locale, e.g. `October` or `Oct`. */
export function formatMonth(key: string, pattern: 'MMMM' | 'MMM'): string {
  return new Intl.DateTimeFormat(dateLocale(), {
    month: pattern === 'MMMM' ? 'long' : 'short',
    timeZone: 'UTC',
  }).format(toUtcDate(`${key}-01`));
}

/** An ISO day in the user's locale, e.g. `Nov 15`. */
export function formatDay(day: string): string {
  return new Intl.DateTimeFormat(dateLocale(), {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(toUtcDate(day));
}

/** A `YYYY-MM` key with its year, e.g. `Feb 2026`, in the user's locale. */
export function formatMonthYear(key: string): string {
  return new Intl.DateTimeFormat(dateLocale(), {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(toUtcDate(`${key}-01`));
}
