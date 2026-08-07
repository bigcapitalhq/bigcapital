import { Intent } from '@blueprintjs/core';
import { Formik, FormikHelpers } from 'formik';
import { defaultTo } from 'lodash';
import moment from 'moment';
import intl from 'react-intl-universal';
import { CreateCustomerOpeningBalanceFormSchema } from './CustomerOpeningBalanceForm.schema';
import { CustomerOpeningBalanceFormContent } from './CustomerOpeningBalanceFormContent';
import { useCustomerOpeningBalanceContext } from './CustomerOpeningBalanceFormProvider';
import type { CustomerOpeningBalanceFormValues } from './utils';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

const defaultInitialValues: CustomerOpeningBalanceFormValues = {
  openingBalance: '0',
  openingBalanceBranchId: '',
  openingBalanceExchangeRate: 1,
  openingBalanceAt: moment(new Date()).format('YYYY-MM-DD'),
};

interface CustomerOpeningBalanceFormProps extends WithDialogActionsProps {}

/**
 * Customer Opening balance form.
 */
function CustomerOpeningBalanceFormInner({
  closeDialog,
}: CustomerOpeningBalanceFormProps) {
  const { dialogName, customer, editCustomerOpeningBalanceMutate } =
    useCustomerOpeningBalanceContext();

  // Initial form values
  const initialValues: CustomerOpeningBalanceFormValues = {
    ...defaultInitialValues,
    ...customer,
    openingBalance: defaultTo(customer.openingBalance, ''),
  };

  // Handles the form submit.
  const handleFormSubmit = (
    values: CustomerOpeningBalanceFormValues,
    { setSubmitting }: FormikHelpers<CustomerOpeningBalanceFormValues>,
  ) => {
    const formValues = {
      openingBalance: Number(values.openingBalance),
      openingBalanceAt: moment(values.openingBalanceAt).format('YYYY-MM-DD'),
      openingBalanceExchangeRate: values.openingBalanceExchangeRate,
      openingBalanceBranchId: values.openingBalanceBranchId
        ? Number(values.openingBalanceBranchId)
        : undefined,
    };

    // Handle request response success.
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('customer_opening_balance.success_message'),
        intent: Intent.SUCCESS,
      });
      closeDialog(dialogName);
    };

    // Handle request response errors.
    const onError = (error: {
      data?: { errors?: Record<string, unknown> };
    }) => {
      const errors = error?.data?.errors;
      if (errors) {
        // Errors are surfaced via the form schema; nothing to do here.
      }
      setSubmitting(false);
    };

    editCustomerOpeningBalanceMutate([customer.id!, formValues])
      .then(onSuccess)
      .catch(onError);
  };

  return (
    <Formik<CustomerOpeningBalanceFormValues>
      validationSchema={CreateCustomerOpeningBalanceFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={CustomerOpeningBalanceFormContent}
    />
  );
}

export const CustomerOpeningBalanceForm = compose(withDialogActions)(
  CustomerOpeningBalanceFormInner,
);
