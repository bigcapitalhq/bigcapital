import * as R from 'ramda';
import { useFormikContext } from 'formik';
import {
  InvoicePaymentPagePreview,
  InvoicePaymentPagePreviewProps,
} from '@/containers/PaymentPortal/InvoicePaymentPagePreview';
import { useElementCustomizeContext } from '@/containers/ElementCustomize/ElementCustomizeProvider';
import { InvoiceCustomizeFormValues } from './types';

const withInvoicePaymentPreviewPageProps = <P extends Object>(
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
    };
    return <Component {...(props as P)} {...mergedProps} />;
  };
};

export const InvoiceCustomizePaymentPreview = R.compose(
  withInvoicePaymentPreviewPageProps,
)(InvoicePaymentPagePreview);
