import { ComponentType, useMemo } from 'react';
import { defaultCreditNoteMailReceiptProps } from './_constants';
import { useCreditNoteSendMailBoot } from './CreditNoteSendMailBoot';
import { CreditNoteSendMailReceiptProps } from './CreditNoteSendMailReceipt';
import { useSendCreditNoteMailMessage } from './hooks';

/**
 * Injects props from credit note mail state into the `CreditNoteSendMailReceipt` component.
 */
export const withCreditNoteMailReceiptPreviewProps = <
  P extends CreditNoteSendMailReceiptProps,
>(
  WrappedComponent: ComponentType<P & CreditNoteSendMailReceiptProps>,
) => {
  return function WithCreditNoteMailReceiptPreviewProps(props: P) {
    const { creditNoteMailState } = useCreditNoteSendMailBoot();
    const message = useSendCreditNoteMailMessage();

    const items = useMemo(
      () =>
        creditNoteMailState?.entries?.map(
          (entry: {
            quantity?: number;
            totalFormatted?: string;
            name?: string;
          }) => ({
            quantity: entry.quantity,
            total: entry.totalFormatted,
            label: entry.name,
          }),
        ),
      [creditNoteMailState?.entries],
    );

    const mailReceiptPreviewProps = {
      ...defaultCreditNoteMailReceiptProps,
      companyName: creditNoteMailState?.companyName,
      companyLogoUri: creditNoteMailState?.companyLogoUri,
      primaryColor: creditNoteMailState?.primaryColor,
      total: creditNoteMailState?.totalFormatted,
      creditNoteDate: creditNoteMailState?.creditNoteDateFormatted,
      creditNoteNumber: creditNoteMailState?.creditNoteNumber,
      subtotal: creditNoteMailState?.subtotalFormatted,
      discount: creditNoteMailState?.discountAmountFormatted,
      adjustment: creditNoteMailState?.adjustmentFormatted,
      items,
      message,
    };
    return <WrappedComponent {...mailReceiptPreviewProps} {...props} />;
  };
};
