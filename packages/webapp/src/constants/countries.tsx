import intl from 'react-intl-universal';

export const getCountries = (): Array<{ name: string; value: string }> => [
  {
    name: intl.get('libya'),
    value: 'libya',
  },
];
