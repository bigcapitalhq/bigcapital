import * as R from 'ramda';
import { InvoicePaymentPagePreviewProps } from '@/containers/PaymentPortal/InvoicePaymentPagePreview';
import { InvoiceCustomizeFormValues } from './types';
import { useElementCustomizeContext } from '@/containers/ElementCustomize/ElementCustomizeProvider';
import { useFormikContext } from 'formik';
import { InvoiceMailReceiptPreview } from './InvoiceMailReceiptPreview';
import { Box } from '@/components';

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
    return (
      <Box px={4} py={8}>
        <Component {...(props as P)} {...mergedProps} />
      </Box>
    );
  };
};

export const InvoiceCustomizeMailReceiptPreview = R.compose(
  withInvoiceMailReceiptPreviewConnected,
)(InvoiceMailReceiptPreview);
