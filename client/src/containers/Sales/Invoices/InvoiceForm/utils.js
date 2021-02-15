import { transformToForm, repeatValue } from 'utils';


export function transformToEditForm(invoice, defaultInvoice, linesNumber) {
  return {
    ...transformToForm(invoice, defaultInvoice),
    entries: [
      ...invoice.entries.map((invoice) => ({
        ...transformToForm(invoice, defaultInvoice.entries[0]),
      })),
      ...repeatValue(
        defaultInvoice,
        Math.max(linesNumber - invoice.entries.length, 0),
      ),
    ],
  };
}