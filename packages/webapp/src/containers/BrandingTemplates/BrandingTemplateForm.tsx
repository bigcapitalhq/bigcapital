// @ts-nocheck
import * as Yup from 'yup';
import { useState } from 'react';
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
import { useUploadAttachments } from '@/hooks/query/attachments';

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
  const [isUploading, setIsLoading] = useState<boolean>(false);
  
  // Uploads the attachments.
  const { mutateAsync: uploadAttachments } = useUploadAttachments({
    onSuccess: () => {
      setIsLoading(true);
    },
  });
  // Handles the form submitting.
  //  - Uploads the company logos.
  //  - Push the updated data.
  const handleFormSubmit = async (
    values: T,
    { setSubmitting }: FormikHelpers<T>,
  ) => {
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

    if (values.companyLogoFile) {
      isUploading(true);
      const formData = new FormData();
      const key = Date.now().toString();

      formData.append('file', values.companyLogoFile);
      formData.append('internalKey', key);

      try {
        await uploadAttachments(formData);
        setIsLoading(false);
      } catch {
        handleError('An error occurred while uploading company logo.');
        setIsLoading(false);
        return;
      }
    }
    if (templateId) {
      const reqValues = transformToEditRequest(values);
      setSubmitting(true);

      try {
        await editPdfTemplate({ templateId, values: reqValues });
        handleSuccess('PDF template updated successfully!');
      } catch {
        handleError('An error occurred while updating the PDF template.');
      }
    } else {
      const reqValues = transformToNewRequest(values, resource);
      setSubmitting(true);

      try {
        await createPdfTemplate(reqValues);
        handleSuccess('PDF template created successfully!');
      } catch {
        handleError('An error occurred while creating the PDF template.');
      }
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
