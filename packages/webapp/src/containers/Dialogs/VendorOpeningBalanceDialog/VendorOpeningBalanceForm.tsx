import { Intent } from '@blueprintjs/core';
import { Formik, FormikHelpers } from 'formik';
import { defaultTo } from 'lodash';
import moment from 'moment';
import intl from 'react-intl-universal';
import { CreateVendorOpeningBalanceFormSchema } from './VendorOpeningBalanceForm.schema';
import { VendorOpeningBalanceFormContent } from './VendorOpeningBalanceFormContent';
import { useVendorOpeningBalanceContext } from './VendorOpeningBalanceFormProvider';
import type { VendorOpeningBalanceFormValues } from './utils';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

const defaultInitialValues: VendorOpeningBalanceFormValues = {
  openingBalance: '0',
  openingBalanceBranchId: '',
  openingBalanceExchangeRate: 1,
  openingBalanceAt: moment(new Date()).format('YYYY-MM-DD'),
};

interface VendorOpeningBalanceFormProps extends WithDialogActionsProps {}

/**
 * Vendor Opening balance form.
 */
function VendorOpeningBalanceFormInner({
  closeDialog,
}: VendorOpeningBalanceFormProps) {
  const { dialogName, vendor, editVendorOpeningBalanceMutate } =
    useVendorOpeningBalanceContext();

  // Initial form values
  const initialValues: VendorOpeningBalanceFormValues = {
    ...defaultInitialValues,
    ...vendor,
    openingBalance: defaultTo(vendor.openingBalance, ''),
  };

  // Handles the form submit.
  const handleFormSubmit = (
    values: VendorOpeningBalanceFormValues,
    { setSubmitting }: FormikHelpers<VendorOpeningBalanceFormValues>,
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
        message: intl.get('vendor_opening_balance.success_message'),
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

    editVendorOpeningBalanceMutate([vendor.id!, formValues])
      .then(onSuccess)
      .catch(onError);
  };

  return (
    <Formik<VendorOpeningBalanceFormValues>
      validationSchema={CreateVendorOpeningBalanceFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={VendorOpeningBalanceFormContent}
    />
  );
}
export const VendorOpeningBalanceForm = compose(withDialogActions)(
  VendorOpeningBalanceFormInner,
);
