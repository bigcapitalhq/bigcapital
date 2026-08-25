import { Intent } from '@blueprintjs/core';
import { Formik, Form, FormikHelpers } from 'formik';
import { useMemo } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import {
  CreateVendorFormSchema,
  EditVendorFormSchema,
} from './VendorForm.schema';
import { VendorFormContent } from './VendorFormContent';
import { useVendorFormContext } from './VendorFormProvider';
import type { VendorFormSubmitPayload } from './VendorFormProvider';
import {
  VendorFormValues,
  defaultInitialValues,
  transformFormToCreateRequest,
  transformFormToEditRequest,
  transformValuesToForm,
  transformVendorToForm,
} from './utils';
import { AppToaster } from '@/components';
import { inferDisplayNameFormat } from '@/components/Select/displayNameUtils';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { saveInvoke } from '@/utils';

/**
 * Vendor form.
 */
function VendorFormFormikBase({
  initialValues,
  onSubmitSuccess,
  onSubmitError,
  onCancel,
  className: _className,
}: {
  initialValues?: Partial<VendorFormValues>;
  onSubmitSuccess?: (
    values: VendorFormValues,
    formArgs: FormikHelpers<VendorFormValues>,
    submitPayload: VendorFormSubmitPayload,
    responseData?: unknown,
  ) => void;
  onSubmitError?: (
    values: VendorFormValues,
    formArgs: FormikHelpers<VendorFormValues>,
    submitPayload: VendorFormSubmitPayload,
    errorData?: unknown,
  ) => void;
  onCancel?: () => void;
  className?: string;
}) {
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  // Vendor form context.
  const {
    vendor,
    contactDuplicate,
    createVendorMutate,
    editVendorMutate,
    submitPayload,
    isNewMode,
  } = useVendorFormContext();

  const initialFormValues = useMemo<VendorFormValues>(() => {
    const merged: VendorFormValues = {
      ...defaultInitialValues,
      ...transformValuesToForm(initialValues ?? {}, defaultInitialValues),
      ...transformVendorToForm(vendor, defaultInitialValues),
      ...transformVendorToForm(contactDuplicate, defaultInitialValues),
    };
    if (!merged.currencyCode && baseCurrency) {
      merged.currencyCode = baseCurrency;
    }
    // Infer the selected display-name format from the existing display name.
    if (merged.displayName && !merged.displayNameFormat) {
      merged.displayNameFormat = inferDisplayNameFormat(merged);
    }
    return merged;
  }, [vendor, contactDuplicate, baseCurrency, initialValues]);

  // Handles the form submit.
  const handleFormSubmit = (
    values: VendorFormValues,
    form: FormikHelpers<VendorFormValues>,
  ) => {
    const { setSubmitting, resetForm } = form;

    setSubmitting(true);

    const onSuccess = () => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_vendor_has_been_created_successfully'
            : 'the_item_vendor_has_been_edited_successfully',
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      resetForm();

      saveInvoke(onSubmitSuccess, values, form, submitPayload);
    };

    const onError = () => {
      setSubmitting(false);
      saveInvoke(onSubmitError, values, form, submitPayload);
    };

    if (isNewMode) {
      createVendorMutate(transformFormToCreateRequest(values))
        .then(onSuccess)
        .catch(onError);
    } else {
      if (!vendor) return;
      editVendorMutate([vendor.id, transformFormToEditRequest(values)])
        .then(onSuccess)
        .catch(onError);
    }
  };

  return (
    <Formik<VendorFormValues>
      validationSchema={
        isNewMode ? CreateVendorFormSchema : EditVendorFormSchema
      }
      initialValues={initialFormValues}
      onSubmit={handleFormSubmit}
    >
      <Form>
        <VendorFormFields>
          <VendorFormContent onCancel={onCancel} />
        </VendorFormFields>
      </Form>
    </Formik>
  );
}

const VendorFormFields = styled.div`
  .bp4-form-content,
  .bp6-form-content {
    min-width: 300px;
  }
  .bp4-form-group {
    margin-bottom: 20px;
  }
  .bp4-form-group.bp4-inline label.bp4-label {
    min-width: 140px;
  }
`;

export const VendorFormFormik = VendorFormFormikBase;
