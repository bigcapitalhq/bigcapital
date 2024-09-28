import React, { CSSProperties } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { PreferencesBrandingFormValues } from './_types';
import { useUploadAttachments } from '@/hooks/query/attachments';
import { AppToaster } from '@/components';
import { Intent } from '@blueprintjs/core';
import { excludePrivateProps } from '@/utils';

const initialValues = {
  logoKey: '',
  logoUri: '',
  primaryColor: '',
};

const validationSchema = Yup.object({
  logoKey: Yup.string().optional(),
  logoUri: Yup.string().optional(),
  primaryColor: Yup.string().required('Primary color is required'),
});

interface PreferencesBrandingFormProps {
  children: React.ReactNode;
}

export const PreferencesBrandingForm = ({
  children,
}: PreferencesBrandingFormProps) => {
  // Uploads the attachments.
  const { mutateAsync: uploadAttachments } = useUploadAttachments({});

  const handleSubmit = async (
    values: PreferencesBrandingFormValues,
    { setSubmitting }: FormikHelpers<PreferencesBrandingFormValues>,
  ) => {
    const _values = { ...values };

    const handleError = (message: string) => {
      AppToaster.show({ intent: Intent.DANGER, message });
      setSubmitting(false);
    };
    // Start upload the company logo file if it is presented.
    if (values._logoFile) {
      const formData = new FormData();
      const key = Date.now().toString();

      formData.append('file', values._logoFile);
      formData.append('internalKey', key);

      try {
        // @ts-expect-error
        const uploadedAttachmentRes = await uploadAttachments(formData);
        setSubmitting(false);

        // Adds the attachment key to the values after finishing upload.
        _values['_logoFile'] = uploadedAttachmentRes?.key;
      } catch {
        handleError('An error occurred while uploading company logo.');
        setSubmitting(false);
        return;
      }
      // Exclude all the private props that starts with _.
      const excludedPrivateValues = excludePrivateProps(_values);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form style={formStyle}>{children}</Form>
    </Formik>
  );
};

const formStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
};
