import React from 'react';
import * as R from 'ramda';
import { AppToaster, Box } from '@/components';
import { Classes, Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import {
  InvoicePaperTemplate,
  InvoicePaperTemplateProps,
} from './InvoicePaperTemplate';
import { ElementCustomize } from '../../../ElementCustomize/ElementCustomize';
import { InvoiceCustomizeGeneralField } from './InvoiceCustomizeGeneralFields';
import { InvoiceCustomizeContentFields } from './InvoiceCutomizeContentFields';
import { InvoiceCustomizeValues } from './types';
import { initialValues } from './constants';
import {
  useCreatePdfTemplate,
  useEditPdfTemplate,
} from '@/hooks/query/pdf-templates';
import { transformToEditRequest, transformToNewRequest } from './utils';

export default function InvoiceCustomizeContent() {
  const { mutateAsync: createPdfTemplate } = useCreatePdfTemplate();
  const { mutateAsync: editPdfTemplate } = useEditPdfTemplate();

  const templateId: number = 1;

  const handleFormSubmit = (values: InvoiceCustomizeValues) => {
    const handleSuccess = (message: string) => {
      AppToaster.show({
        intent: Intent.SUCCESS,
        message,
      });
    };
    const handleError = (message: string) => {
      AppToaster.show({
        intent: Intent.DANGER,
        message,
      });
    };
    if (templateId) {
      const reqValues = transformToEditRequest(values, templateId);

      // Edit existing template
      // editPdfTemplate({ templateId, values: reqValues })
      //   .then(() => handleSuccess('PDF template updated successfully!'))
      //   .catch(() =>
      //     handleError('An error occurred while updating the PDF template.'),
      //   );
    } else {
      const reqValues = transformToNewRequest(values);

      // Create new template
      createPdfTemplate(reqValues)
        .then(() => handleSuccess('PDF template created successfully!'))
        .catch(() =>
          handleError('An error occurred while creating the PDF template.'),
        );
    }
  };

  return (
    <Box className={Classes.DRAWER_BODY}>
      <ElementCustomize<InvoiceCustomizeValues>
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <ElementCustomize.PaperTemplate>
          <InvoicePaperTemplateFormConnected />
        </ElementCustomize.PaperTemplate>

        <ElementCustomize.FieldsTab id={'general'} label={'General'}>
          <InvoiceCustomizeGeneralField />
        </ElementCustomize.FieldsTab>

        <ElementCustomize.FieldsTab id={'content'} label={'Content'}>
          <InvoiceCustomizeContentFields />
        </ElementCustomize.FieldsTab>

        <ElementCustomize.FieldsTab id={'totals'} label={'Totals'}>
          asdfasdfdsaf #3
        </ElementCustomize.FieldsTab>
      </ElementCustomize>
    </Box>
  );
}

const withFormikProps = <P extends object>(
  Component: React.ComponentType<P>,
) => {
  return (props: Omit<P, keyof InvoicePaperTemplateProps>) => {
    const { values } = useFormikContext<InvoicePaperTemplateProps>();

    return <Component {...(props as P)} {...values} />;
  };
};

export const InvoicePaperTemplateFormConnected =
  R.compose(withFormikProps)(InvoicePaperTemplate);
