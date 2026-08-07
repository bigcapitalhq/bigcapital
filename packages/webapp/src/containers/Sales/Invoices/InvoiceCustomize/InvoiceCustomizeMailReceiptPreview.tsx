import { useFormikContext } from 'formik';
import * as R from 'ramda';
import { InvoiceMailReceiptPreview } from './InvoiceMailReceiptPreview';
import { InvoiceCustomizeFormValues } from './types';
import { Box } from '@/components';
import { useElementCustomizeContext } from '@/containers/ElementCustomize/ElementCustomizeProvider';
import { InvoicePaymentPagePreviewProps } from '@/containers/PaymentPortal/InvoicePaymentPagePreview';

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
      <Box px={4} pt={8} pb={16}>
        <Component {...(props as P)} {...mergedProps} />
      </Box>
    );
  };
};

export const InvoiceCustomizeMailReceiptPreview = R.compose(
  withInvoiceMailReceiptPreviewConnected,
)(InvoiceMailReceiptPreview);
