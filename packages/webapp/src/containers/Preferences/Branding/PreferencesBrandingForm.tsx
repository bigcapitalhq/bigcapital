import { Intent } from '@blueprintjs/core';
import { Formik, Form, FormikHelpers } from 'formik';
import { omit } from 'lodash';
import React, { CSSProperties } from 'react';
import * as Yup from 'yup';
import { PreferencesBrandingFormValues } from './_types';
import { usePreferencesBrandingBoot } from './PreferencesBrandingBoot';
import { AppToaster } from '@/components';
import { useUpdateOrganization } from '@/hooks/query';
import { useUploadAttachments } from '@/hooks/query/attachments';
import {
  excludePrivateProps,
  transformToCamelCase,
  transformToForm,
  transfromToSnakeCase,
} from '@/utils';

// The same default the invoice, estimate, receipt, credit note and payment
// customize screens fall back to.
const DEFAULT_PRIMARY_COLOR = '#2c3dd8';

const initialValues = {
  logoKey: '',
  logoUri: '',
  // The color input shows a swatch even when the value is empty, so an
  // organization that never picked a color has to start from the default one
  // the customize screens use; otherwise the required validation fails on a
  // field that looks filled.
  primaryColor: DEFAULT_PRIMARY_COLOR,
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
  // Mutate organization information.
  const { mutateAsync: updateOrganization } = useUpdateOrganization();

  const { organization } = usePreferencesBrandingBoot();

  const formInitialValues = {
    ...transformToForm(
      transformToCamelCase(organization?.metadata),
      initialValues,
    ),
  } as PreferencesBrandingFormValues;

  // Handle the form submitting.
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
        const uploadedAttachmentRes = await uploadAttachments(formData);
        setSubmitting(false);

        // Adds the attachment key to the values after finishing upload.
        _values['logoKey'] = uploadedAttachmentRes?.key;
      } catch {
        handleError('An error occurred while uploading company logo.');
        setSubmitting(false);
        return;
      }
    }
    // Exclude all the private props that starts with _.
    const excludedPrivateValues = excludePrivateProps(_values);

    const __values = transfromToSnakeCase(
      omit(excludedPrivateValues, ['logoUri']),
    );
    // Update organization branding.
    await updateOrganization({ ...__values });

    AppToaster.show({
      message: 'Organization branding has been updated.',
      intent: Intent.SUCCESS,
    });
  };

  return (
    <Formik
      initialValues={formInitialValues}
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
