import { CreditNotePdfTemplateAttributes } from './types/CreditNotes.types';
import { CreditNoteResponseDto } from './dtos/CreditNoteResponse.dto';
import { contactAddressTextFormat } from '@/utils/address-text-format';

export const transformCreditNoteToPdfTemplate = (
  creditNote: CreditNoteResponseDto,
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
    customerAddress: contactAddressTextFormat(creditNote.customer),
  };
};

export const transformCreditNoteToMailDataArgs = (creditNote: any) => {
  return {
    'Customer Name': creditNote.customer?.displayName,
    'Credit Note Number': creditNote.creditNoteNumber,
    'Credit Note Date': creditNote.formattedCreditNoteDate,
    'Credit Note Amount': creditNote.formattedAmount,
  };
};
