import { useMemo } from 'react';
import intl from 'react-intl-universal';
import { Formik, Form, FormikHelpers } from 'formik';
import { Intent } from '@blueprintjs/core';
import styled from 'styled-components';
import { CreateCustomerForm, EditCustomerForm } from './CustomerForm.schema';
import { transformToForm, saveInvoke, parseBoolean } from '@/utils';
import { useCustomerFormContext } from './CustomerFormProvider';
import { defaultInitialValues } from './utils';
import { AppToaster } from '@/components';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { CustomerFormContent } from './CustomerFormContent';

type CustomerFormValues = {
  customer_type: string;
  salutation: string;
  first_name: string;
  last_name: string;
  company_name: string;
  display_name: string;

  email?: string;
  work_phone?: string;
  personal_phone?: string;
  website?: string;
  note?: string;
  active: boolean | string;

  billing_address_country: string;
  billing_address1: string;
  billing_address2: string;
  billing_address_city: string;
  billing_address_state: string;
  billing_address_postcode?: string;
  billing_address_phone?: string;

  shipping_address_country: string;
  shipping_address1: string;
  shipping_address2: string;
  shipping_address_city: string;
  shipping_address_state: string;
  shipping_address_postcode?: string;
  shipping_address_phone?: string;

  currency_code: string;
  opening_balance?: string | number;
  opening_balance_at?: string;
  opening_balance_exchange_rate?: string;
  opening_balance_branch_id?: string;

  [key: string]: any;
};

type CustomerFormSubmitPayload = {
  noRedirect?: boolean;
};

type CustomerFormFormikRootProps = {
  // #ownProps
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
  // #ownProps
  initialValues: initialCustomerValues = EMPTY_INITIAL_VALUES,
  onSubmitSuccess,
  onSubmitError,
  // `onCancel` is accepted for compatibility but currently not used.
  className,
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

  const initialValues = useMemo<CustomerFormValues>(
    () =>
      ({
        ...defaultInitialValues,
        currency_code: baseCurrency,
        ...transformToForm(
          contactDuplicate ?? customer ?? {},
          defaultInitialValues,
        ),
        ...transformToForm(initialCustomerValues, defaultInitialValues),
      }) as CustomerFormValues,
    [customer, contactDuplicate, baseCurrency, initialCustomerValues],
  );

  // Handles the form submit.
  const handleFormSubmit = (
    values: CustomerFormValues,
    formArgs: FormikHelpers<CustomerFormValues>,
  ) => {
    const { setSubmitting, resetForm } = formArgs;
    const formValues = {
      ...values,
      active: parseBoolean(values.active, true),
      // Empty input means no withholding - the API expects null, not ''.
      withholding_tax_rate:
        values.withholding_tax_rate === '' || values.withholding_tax_rate == null
          ? null
          : Number(values.withholding_tax_rate),
    };

    const onSuccess = (res: { data?: unknown }) => {
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
      saveInvoke(onSubmitSuccess, values, formArgs, submitPayload, res.data);
    };

    const onError = () => {
      setSubmitting(false);
      saveInvoke(onSubmitError, values, formArgs, submitPayload);
    };
    if (isNewMode) {
      createCustomerMutate(formValues).then(onSuccess).catch(onError);
    } else {
      if (!customer) return;

      editCustomerMutate([customer?.id, formValues])
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
