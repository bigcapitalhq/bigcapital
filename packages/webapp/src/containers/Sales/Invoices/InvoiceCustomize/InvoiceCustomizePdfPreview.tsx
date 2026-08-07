import { useFormikContext } from 'formik';
import * as R from 'ramda';
import {
  InvoicePaperTemplate,
  InvoicePaperTemplateProps,
} from './InvoicePaperTemplate';
import { InvoiceCustomizeFormValues } from './types';
import { Box } from '@/components';
import { useElementCustomizeContext } from '@/containers/ElementCustomize/ElementCustomizeProvider';

/**
 * Injects the `InvoicePaperTemplate` component props from the form and branding states.
 * @param {React.ComponentType<P>} Component
 * @returns {JSX.Element}
 */
const withInvoicePreviewTemplateProps = <P extends object>(
  Component: React.ComponentType<P>,
) => {
  return (props: Omit<P, keyof InvoicePaperTemplateProps>) => {
    const { values } = useFormikContext<InvoiceCustomizeFormValues>();
    const { brandingState } = useElementCustomizeContext();

    const mergedProps: InvoicePaperTemplateProps = {
      ...brandingState,
      ...values,
    };
    return (
      <Box px={4} py={6}>
        <Component {...(props as P)} {...mergedProps} />
      </Box>
    );
  };
};

export const InvoiceCustomizePdfPreview = R.compose(
  withInvoicePreviewTemplateProps,
)(InvoicePaperTemplate);
