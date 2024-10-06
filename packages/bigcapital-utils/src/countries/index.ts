import { Countries } from './constant';
import { Country, Maybe } from './types';

export const getAllCountries = () => {
  return Object.keys(Countries).map((countryCode) => {
    return {
      ...Countries[countryCode],
      countryCode,
    };
  });
};

export const findByIsoCountryCode = (
  isoCode: string
): Maybe<Country & { countryCode: string }> => {
  const _isoCode = isoCode?.toUpperCase();
  const country = Countries[_isoCode];

  return country ? { ...country, countryCode: isoCode } : null;
};
