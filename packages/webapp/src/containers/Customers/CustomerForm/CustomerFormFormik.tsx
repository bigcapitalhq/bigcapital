import { Intent } from '@blueprintjs/core';
import { Formik, Form, FormikHelpers } from 'formik';
import { useMemo } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { CreateCustomerForm, EditCustomerForm } from './CustomerForm.schema';
import { CustomerFormContent } from './CustomerFormContent';
import { useCustomerFormContext } from './CustomerFormProvider';
import {
  CustomerFormValues,
  defaultInitialValues,
  transformCustomerToForm,
  transformFormToCreateRequest,
  transformFormToEditRequest,
  transformValuesToForm,
} from './utils';
import { AppToaster } from '@/components';
import { inferDisplayNameFormat } from '@/components/Select/displayNameUtils';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { saveInvoke } from '@/utils';

type CustomerFormSubmitPayload = {
  noRedirect?: boolean;
};

type CustomerFormFormikRootProps = {
  initialValues?: Partial<CustomerFormValues>;
  onSubmitSuccess?: (
    values: CustomerFormValues,
    formArgs: FormikHelpers<CustomerFormValues>,
    submitPayload: CustomerFormSubmitPayload,
    responseData?: unknown,
  ) => void;
  onSubmitError?: (
    values: CustomerFormValues,
    formArgs: FormikHelpers<CustomerFormValues>,
    submitPayload: CustomerFormSubmitPayload,
    errorData?: unknown,
  ) => void;
  onCancel?: () => void;
  className?: string;
};

const EMPTY_INITIAL_VALUES: Partial<CustomerFormValues> = {};

function CustomerFormFormikRoot({
  initialValues: initialCustomerValues = EMPTY_INITIAL_VALUES,
  onSubmitSuccess,
  onSubmitError,
  // `onCancel` is accepted for compatibility but currently not used.
  onCancel: _onCancel,
  className: _className,
}: CustomerFormFormikRootProps) {
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const {
    customer,
    submitPayload,
    contactDuplicate,
    editCustomerMutate,
    createCustomerMutate,
    isNewMode,
  } = useCustomerFormContext();

  const initialValues = useMemo<CustomerFormValues>(() => {
    const merged: CustomerFormValues = {
      ...defaultInitialValues,
      ...transformCustomerToForm(
        contactDuplicate ?? customer,
        defaultInitialValues,
      ),
      ...transformValuesToForm(initialCustomerValues, defaultInitialValues),
    };
    // Fall back to the organization base currency only if nothing else provided one.
    if (!merged.currencyCode && baseCurrency) {
      merged.currencyCode = baseCurrency;
    }
    // Infer the selected display-name format from the existing display name.
    if (merged.displayName && !merged.displayNameFormat) {
      merged.displayNameFormat = inferDisplayNameFormat(merged);
    }
    return merged;
  }, [customer, contactDuplicate, baseCurrency, initialCustomerValues]);

  // Handles the form submit.
  const handleFormSubmit = (
    values: CustomerFormValues,
    formArgs: FormikHelpers<CustomerFormValues>,
  ) => {
    const { setSubmitting, resetForm } = formArgs;

    const onSuccess = () => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_customer_has_been_created_successfully'
            : 'the_item_customer_has_been_edited_successfully',
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      resetForm();
      saveInvoke(onSubmitSuccess, values, formArgs, submitPayload);
    };

    const onError = () => {
      setSubmitting(false);
      saveInvoke(onSubmitError, values, formArgs, submitPayload);
    };

    if (isNewMode) {
      createCustomerMutate(transformFormToCreateRequest(values))
        .then(onSuccess)
        .catch(onError);
    } else {
      if (!customer) return;
      editCustomerMutate([customer.id, transformFormToEditRequest(values)])
        .then(onSuccess)
        .catch(onError);
    }
  };

  return (
    <Formik<CustomerFormValues>
      validationSchema={isNewMode ? CreateCustomerForm : EditCustomerForm}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
    >
      <Form>
        <CustomerFormFields>
          <CustomerFormContent />
        </CustomerFormFields>
      </Form>
    </Formik>
  );
}

const CustomerFormFields = styled.div`
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

export const CustomerFormFormik = CustomerFormFormikRoot;
