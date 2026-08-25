import { Formik, type FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { ApiKeyDisplayView } from './ApiKeyDisplayView';
import { CreateApiKeyFormSchema as ApiKeysGenerateFormSchema } from './ApiKeysGenerateForm.schema';
import { ApiKeysGenerateFormContent } from './ApiKeysGenerateFormContent';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useGenerateApiKey } from '@/hooks/query';
import { compose } from '@/utils';

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
  const handleFormSubmit = (
    values: ApiKeyFormValues,
    { setSubmitting, setErrors }: FormikHelpers<ApiKeyFormValues>,
  ) => {
    const form = { name: values.name || undefined };

    // Handle request response errors.
    const handleError = (error: unknown) => {
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
      setSubmitting(false);
    };

    generateApiKeyMutate.mutate(form, {
      onSuccess: (response: unknown) => {
        // The API returns { key, id }, which might be wrapped in response.data.
        const apiKey =
          // FIXME: response shape not typed by SDK; original runtime probing preserved.
          ((response as { data?: { key?: string } })?.data?.key as string) ||
          ((response as { key?: string })?.key as string);
        if (apiKey) {
          setGeneratedApiKey(apiKey);
        } else {
          setSubmitting(false);
        }
      },
      onError: handleError,
    });
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

export const ApiKeysGenerateDialogContent = compose(withDialogActions)(
  ApiKeysGenerateDialogContentInner,
);

// FIXME: latent bug preserved — `index.tsx` re-exports `ApiKeysGenerateDialog`
// but this module historically only exported `ApiKeysGenerateDialogContent`.
// The Dialog wrapper (`<Dialog>...`) was never created in the original code;
// instead the dialog content is used directly. Re-export under the dialog
// name to keep external consumers (DialogsContainer.tsx) working.
export { ApiKeysGenerateDialogContent as ApiKeysGenerateDialog };
