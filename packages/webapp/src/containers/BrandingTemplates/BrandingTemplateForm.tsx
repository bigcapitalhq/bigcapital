import * as Yup from 'yup';
import {
  ElementCustomize,
  ElementCustomizeProps,
} from '../ElementCustomize/ElementCustomize';
import {
  transformToEditRequest,
  transformToNewRequest,
  useBrandingTemplateFormInitialValues,
} from './_utils';
import { AppToaster } from '@/components';
import { Intent } from '@blueprintjs/core';
import {
  useCreatePdfTemplate,
  useEditPdfTemplate,
} from '@/hooks/query/pdf-templates';
import { FormikHelpers } from 'formik';
import { BrandingTemplateValues } from './types';

interface BrandingTemplateFormProps<T> extends ElementCustomizeProps<T> {
  resource: string;
  templateId?: number;
  onSuccess?: () => void;
  onError?: () => void;
  defaultValues?: T;
}

export function BrandingTemplateForm<T extends BrandingTemplateValues>({
  templateId,
  onSuccess,
  onError,
  defaultValues,
  resource,
  ...props
}: BrandingTemplateFormProps<T>) {
  const { mutateAsync: createPdfTemplate } = useCreatePdfTemplate();
  const { mutateAsync: editPdfTemplate } = useEditPdfTemplate();

  const initialValues = useBrandingTemplateFormInitialValues<T>(defaultValues);

  const handleFormSubmit = (values: T, { setSubmitting }: FormikHelpers<T>) => {
    const handleSuccess = (message: string) => {
      AppToaster.show({ intent: Intent.SUCCESS, message });
      setSubmitting(false);
      onSuccess && onSuccess();
    };
    const handleError = (message: string) => {
      AppToaster.show({ intent: Intent.DANGER, message });
      setSubmitting(false);
      onError && onError();
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
      const reqValues = transformToNewRequest(values, resource);
      setSubmitting(true);

      // Create new template
      createPdfTemplate(reqValues)
        .then(() => handleSuccess('PDF template created successfully!'))
        .catch(() =>
          handleError('An error occurred while creating the PDF template.'),
        );
    }
  };

  return (
    <ElementCustomize<T>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
      {...props}
    />
  );
}

export const validationSchema = Yup.object().shape({
  templateName: Yup.string().required('Template Name is required'),
});
