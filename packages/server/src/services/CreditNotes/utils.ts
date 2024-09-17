import { CreditNotePdfTemplateAttributes, ICreditNote } from '@/interfaces';

export const transformCreditNoteToPdfTemplate = (
  creditNote: ICreditNote
): Partial<CreditNotePdfTemplateAttributes> => {
  return {
    creditNoteDate: creditNote.formattedCreditNoteDate,
    creditNoteNumebr: creditNote.creditNoteNumber,

    total: creditNote.formattedAmount,
    subtotal: creditNote.formattedSubtotal,

    lines: creditNote.entries?.map((entry) => ({
      item: entry.item.name,
      description: entry.description,
      rate: entry.rateFormatted,
      quantity: entry.quantityFormatted,
      total: entry.totalFormatted,
    })),
    customerNote: creditNote.note,
    termsConditions: creditNote.termsConditions,
  };
};
