import { TaxType } from '@/interfaces/TaxRates';

export const InclusiveButtonOptions = [
  { key: TaxType.Inclusive, label: 'Inclusive of Tax' },
  { key: TaxType.Exclusive, label: 'Exclusive of Tax' },
];
