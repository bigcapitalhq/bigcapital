import {
  InvoicePaperTemplate,
  InvoicePaperTemplateProps,
} from '@bigcapital/pdf-templates';
import { useFormikContext } from 'formik';
import * as FF from 'fp-ts/function';
import { initialValues } from './constants';
import { InvoiceCustomizeFormValues } from './types';
import { Box } from '@/components';
import { useElementCustomizeContext } from '@/containers/ElementCustomize/ElementCustomizeProvider';
import {
  paperTemplatePreviewStyle,
  pickPaperTemplateProps,
} from '@/containers/ElementCustomize/paperTemplatePreview';

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

    const mergedProps = pickPaperTemplateProps<InvoicePaperTemplateProps>(
      { ...brandingState, ...values },
      initialValues,
    );

    return (
      <Box px={4} py={6}>
        <Component
          {...(props as P)}
          {...mergedProps}
          style={paperTemplatePreviewStyle}
        />
      </Box>
    );
  };
};

export const InvoiceCustomizePdfPreview = FF.pipe(
  InvoicePaperTemplate,
  withInvoicePreviewTemplateProps,
);
