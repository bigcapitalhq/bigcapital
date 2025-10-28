import * as R from 'ramda';
import { useFormikContext } from 'formik';
import { css } from '@emotion/css';
import {
  InvoicePaymentPagePreview,
  InvoicePaymentPagePreviewProps,
} from '@/containers/PaymentPortal/InvoicePaymentPagePreview';
import { useElementCustomizeContext } from '@/containers/ElementCustomize/ElementCustomizeProvider';
import { InvoiceCustomizeFormValues } from './types';
import { Box } from '@/components';

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
    return (
      <Box px={4} pt={8} pb={16}>
        <Component
          {...(props as P)}
          {...mergedProps}
          classNames={{
            root: css`
              margin: 0 auto;
              border-radius: 5px !important;
              transform: scale(0.9);
              transform-origin: top;
              boxshadow: 0 10px 15px rgba(0, 0, 0, 0.05) !important;
            `,
            bigTitle: css`
              color: #333 !important;
            `,
          }}
        />
      </Box>
    );
  };
};

export const InvoiceCustomizePaymentPreview = R.compose(
  withInvoicePaymentPreviewPageProps,
)(InvoicePaymentPagePreview);
