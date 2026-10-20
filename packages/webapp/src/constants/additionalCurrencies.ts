/**
 * Active ISO 4217 currencies that ship with `js-money/lib/currency` are limited
 * to ~120 entries and omit a number of circulating national currencies (e.g.
 * LRD, GYD, SLL/SLE, XCD). This table supplements that list so every currency
 * can be picked as a base/secondary currency and formatted with the right
 * symbol and precision.
 *
 * Shape matches `js-money` currency entries so the two can be merged directly.
 */
export interface CurrencyEntry {
  symbol: string;
  name: string;
  symbol_native: string;
  decimal_digits: number;
  rounding: number;
  code: string;
  name_plural: string;
}

const make = (
  code: string,
  name: string,
  symbol: string,
  name_plural: string,
  decimal_digits = 2,
): CurrencyEntry => ({
  symbol,
  name,
  symbol_native: symbol,
  decimal_digits,
  rounding: 0,
  code,
  name_plural,
});

export const additionalCurrencies: Record<string, CurrencyEntry> = {
  ANG: make('ANG', 'Netherlands Antillean Guilder', 'ƒ', 'guilders'),
  AOA: make('AOA', 'Angolan Kwanza', 'Kz', 'kwanzas'),
  AWG: make('AWG', 'Aruban Florin', 'ƒ', 'florin'),
  BBD: make('BBD', 'Barbadian Dollar', '$', 'dollars'),
  BMD: make('BMD', 'Bermudian Dollar', '$', 'dollars'),
  BSD: make('BSD', 'Bahamian Dollar', '$', 'dollars'),
  BTN: make('BTN', 'Bhutanese Ngultrum', 'Nu.', 'ngultrums'),
  BYN: make('BYN', 'Belarusian Ruble', 'Br', 'rubles'),
  CUP: make('CUP', 'Cuban Peso', '$', 'pesos'),
  FJD: make('FJD', 'Fijian Dollar', '$', 'dollars'),
  GMD: make('GMD', 'Gambian Dalasi', 'D', 'dalasis'),
  GYD: make('GYD', 'Guyanese Dollar', '$', 'dollars'),
  HTG: make('HTG', 'Haitian Gourde', 'G', 'gourdes'),
  KGS: make('KGS', 'Kyrgyzstani Som', 'som', 'soms'),
  KYD: make('KYD', 'Cayman Islands Dollar', '$', 'dollars'),
  LRD: make('LRD', 'Liberian Dollar', '$', 'dollars'),
  LSL: make('LSL', 'Lesotho Loti', 'L', 'maloti'),
  MNT: make('MNT', 'Mongolian Tögrög', '₮', 'tögrög'),
  MRU: make('MRU', 'Mauritanian Ouguiya', 'UM', 'ouguiyas'),
  MVR: make('MVR', 'Maldivian Rufiyaa', 'Rf', 'rufiyaa'),
  MWK: make('MWK', 'Malawian Kwacha', 'MK', 'kwacha'),
  PGK: make('PGK', 'Papua New Guinean Kina', 'K', 'kina'),
  SBD: make('SBD', 'Solomon Islands Dollar', '$', 'dollars'),
  SCR: make('SCR', 'Seychellois Rupee', '₨', 'rupees'),
  SLE: make('SLE', 'Sierra Leonean Leone', 'Le', 'leones'),
  SLL: make('SLL', 'Sierra Leonean Leone (1964–2022)', 'Le', 'leones'),
  SRD: make('SRD', 'Surinamese Dollar', '$', 'dollars'),
  SSP: make('SSP', 'South Sudanese Pound', '£', 'pounds'),
  STN: make('STN', 'São Tomé and Príncipe Dobra', 'Db', 'dobras'),
  SZL: make('SZL', 'Swazi Lilangeni', 'L', 'emalangeni'),
  TJS: make('TJS', 'Tajikistani Somoni', 'ЅМ', 'somoni'),
  TMT: make('TMT', 'Turkmenistani Manat', 'm', 'manat'),
  VES: make('VES', 'Venezuelan Bolívar', 'Bs.', 'bolívares'),
  VUV: make('VUV', 'Vanuatu Vatu', 'VT', 'vatu', 0),
  WST: make('WST', 'Samoan Tala', 'T', 'tala'),
  XCD: make('XCD', 'East Caribbean Dollar', '$', 'dollars'),
  XPF: make('XPF', 'CFP Franc', '₣', 'francs', 0),
  ZWL: make('ZWL', 'Zimbabwean Dollar', '$', 'dollars'),
};
