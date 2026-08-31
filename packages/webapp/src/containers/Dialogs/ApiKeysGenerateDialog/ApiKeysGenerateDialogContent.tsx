import { Formik, type FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { ApiKeyDisplayView } from './ApiKeyDisplayView';
import { CreateApiKeyFormSchema as ApiKeysGenerateFormSchema } from './ApiKeysGenerateForm.schema';
import { ApiKeysGenerateFormContent } from './ApiKeysGenerateFormContent';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useGenerateApiKey } from '@/hooks/query';

interface ApiKeyFormValues {
  name: string;
}

const defaultInitialValues: ApiKeyFormValues = {
  name: '',
};

interface ApiKeysGenerateDialogContentProps extends WithDialogActionsProps {
  dialogName: string;
}

/**
 * API Keys Generate form dialog content.
 */
function ApiKeysGenerateDialogContentInner({
  closeDialog,
  dialogName,
}: ApiKeysGenerateDialogContentProps): React.ReactElement {
  const [generatedApiKey, setGeneratedApiKey] = useState<string | null>(null);
  const generateApiKeyMutate = useGenerateApiKey();

  // Handles the form submit.
  const handleFormSubmit = async (
    values: ApiKeyFormValues,
    { setSubmitting, setErrors }: FormikHelpers<ApiKeyFormValues>,
  ) => {
    const form = { name: values.name || undefined };

    try {
      const response = await generateApiKeyMutate.mutateAsync(form);
      if (response?.key) {
        setGeneratedApiKey(response.key);
      }
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { errors?: Record<string, string[]> } };
      };
      const errors = err?.response?.data?.errors;
      if (errors) {
        const errorsTransformed = Object.keys(errors).reduce(
          (acc: Record<string, string>, key) => {
            acc[key] = errors[key][0];
            return acc;
          },
          {},
        );
        setErrors(errorsTransformed);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // If API key has been generated, show the display view
  if (generatedApiKey) {
    return (
      <ApiKeyDisplayView
        dialogName={dialogName}
        apiKey={generatedApiKey}
        onClose={() => {
          setGeneratedApiKey(null);
          closeDialog(dialogName);
        }}
      />
    );
  }

  // Otherwise, show the generate form
  return (
    <Formik
      validationSchema={ApiKeysGenerateFormSchema}
      initialValues={defaultInitialValues}
      onSubmit={handleFormSubmit}
    >
      <ApiKeysGenerateFormContent dialogName={dialogName} />
    </Formik>
  );
}

export const ApiKeysGenerateDialogContent = withDialogActions(
  ApiKeysGenerateDialogContentInner,
);
