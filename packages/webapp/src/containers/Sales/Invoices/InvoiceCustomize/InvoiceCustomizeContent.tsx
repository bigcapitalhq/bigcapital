import React from 'react';
import * as R from 'ramda';
import { AppToaster } from '@/components';
import { Intent } from '@blueprintjs/core';
import { FormikHelpers, useFormikContext } from 'formik';
import {
  InvoicePaperTemplate,
  InvoicePaperTemplateProps,
} from './InvoicePaperTemplate';
import { ElementCustomize } from '../../../ElementCustomize/ElementCustomize';
import { InvoiceCustomizeGeneralField } from './InvoiceCustomizeGeneralFields';
import { InvoiceCustomizeContentFields } from './InvoiceCutomizeContentFields';
import { InvoiceCustomizeValues } from './types';
import {
  useCreatePdfTemplate,
  useEditPdfTemplate,
} from '@/hooks/query/pdf-templates';
import {
  transformToEditRequest,
  transformToNewRequest,
  useInvoiceCustomizeInitialValues,
} from './utils';
import { InvoiceCustomizeSchema } from './InvoiceCustomizeForm.schema';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useDrawerActions } from '@/hooks/state';

export function InvoiceCustomizeContent() {
  const { mutateAsync: createPdfTemplate } = useCreatePdfTemplate();
  const { mutateAsync: editPdfTemplate } = useEditPdfTemplate();

  const { payload, name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();

  const templateId = payload?.templateId || null;

  const handleFormSubmit = (
    values: InvoiceCustomizeValues,
    { setSubmitting }: FormikHelpers<InvoiceCustomizeValues>,
  ) => {
    const handleSuccess = (message: string) => {
      AppToaster.show({ intent: Intent.SUCCESS, message });
      setSubmitting(false);
      closeDrawer(name);
    };
    const handleError = (message: string) => {
      AppToaster.show({ intent: Intent.DANGER, message });
      setSubmitting(false);
    };
    if (templateId) {
      const reqValues = transformToEditRequest(values);
      setSubmitting(true);

      // Edit existing template
      editPdfTemplate({ templateId, values: reqValues })
        .then(() => handleSuccess('PDF template updated successfully!'))
        .catch(() =>
          handleError('An error occurred while updating the PDF template.'),
        );
    } else {
      const reqValues = transformToNewRequest(values);
      setSubmitting(true);

      // Create new template
      createPdfTemplate(reqValues)
        .then(() => handleSuccess('PDF template created successfully!'))
        .catch(() =>
          handleError('An error occurred while creating the PDF template.'),
        );
    }
  };
  const initialValues = useInvoiceCustomizeInitialValues();

  return (
    <ElementCustomize<InvoiceCustomizeValues>
      initialValues={initialValues}
      validationSchema={InvoiceCustomizeSchema}
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
