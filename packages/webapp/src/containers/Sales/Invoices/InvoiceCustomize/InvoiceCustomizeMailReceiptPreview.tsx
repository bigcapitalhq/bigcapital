import * as R from 'ramda';
import { InvoicePaymentPagePreviewProps } from '@/containers/PaymentPortal/InvoicePaymentPagePreview';
import { InvoiceCustomizeFormValues } from './types';
import { useElementCustomizeContext } from '@/containers/ElementCustomize/ElementCustomizeProvider';
import { useFormikContext } from 'formik';
import { InvoiceMailReceiptPreview } from './InvoiceMailReceiptPreview';

const withInvoiceMailReceiptPreviewConnected = <P extends Object>(
  Component: React.ComponentType<P>,
) => {
  return (props: Omit<P, keyof InvoicePaymentPagePreviewProps>) => {
    const { values } = useFormikContext<InvoiceCustomizeFormValues>();
    const { brandingState } = useElementCustomizeContext();

    const mergedBrandingState = {
      ...brandingState,
      ...values,
    };
    const mergedProps: InvoicePaymentPagePreviewProps = {
      companyLogoUri: mergedBrandingState?.companyLogoUri,
      primaryColor: mergedBrandingState?.primaryColor,
      // organizationAddress: mergedBrandingState,
    };
    return <Component {...(props as P)} {...mergedProps} />;
  };
};

export const InvoiceCustomizeMailReceiptPreview = R.compose(
  withInvoiceMailReceiptPreviewConnected,
)(InvoiceMailReceiptPreview);
