export interface Country {
  name: string;
  native: string;
  phone: number[];
  continent: string;
  continents?: string[];
  capital: string;
  currency: string[];
  languages: string[];
}

export type Maybe<T> = T | null;