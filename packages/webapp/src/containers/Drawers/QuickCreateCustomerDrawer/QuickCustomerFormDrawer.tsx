import { Card, DrawerLoading } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { CustomerFormFormik } from '@/containers/Customers/CustomerForm/CustomerFormFormik';
import {
  CustomerFormProvider,
  useCustomerFormContext,
} from '@/containers/Customers/CustomerForm/CustomerFormProvider';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { useAddAutofillRef } from '@/hooks/state/autofill';
import type { CustomerFormValues } from '@/containers/Customers/CustomerForm/utils';
import type { FormikHelpers } from 'formik';
import { compose } from '@/utils';

type CustomerFormSubmitPayload = { noRedirect?: boolean };

interface QuickCustomerFormDrawerProps extends WithDrawerActionsProps {
  displayName?: string;
  autofillRef?: number;
  customerId?: number;
}

/**
 * Drawer customer form loading wrapper.
 */
function DrawerCustomerFormLoading({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isFormLoading } = useCustomerFormContext();

  return <DrawerLoading loading={isFormLoading}>{children}</DrawerLoading>;
}

/**
 * Quick customer form of the drawer.
 */
function QuickCustomerFormDrawerInner({
  displayName,
  autofillRef,
  closeDrawer,
  customerId,
}: QuickCustomerFormDrawerProps) {
  const addAutofillRef = useAddAutofillRef();

  // Handle the form submit request success.
  // `responseData` is typed as `unknown` because `CustomerFormFormik` forwards
  // the mutate result opaquely; the SDK's `createCustomer` returns void so the
  // created id is unavailable here. To preserve the previous runtime behavior
  // we fall back to `customerId` when `responseData.id` is missing.
  const handleSubmitSuccess = (
    values: CustomerFormValues,
    _formArgs: FormikHelpers<CustomerFormValues>,
    _submitPayload: CustomerFormSubmitPayload,
    responseData?: unknown,
  ) => {
    if (autofillRef) {
      const responseId =
        (responseData as { id?: number } | undefined)?.id ?? customerId;
      addAutofillRef(autofillRef, {
        displayName: values.displayName,
        customerId: responseId,
      });
    }
    closeDrawer(DRAWERS.QUICK_CREATE_CUSTOMER);
  };
  // Handle the form cancel action.
  const handleCancelForm = () => {
    closeDrawer(DRAWERS.QUICK_CREATE_CUSTOMER);
  };

  return (
    <CustomerFormProvider customerId={customerId}>
      <DrawerCustomerFormLoading>
        <CustomerFormFormik
          initialValues={{ firstName: displayName }}
          onSubmitSuccess={handleSubmitSuccess}
          onCancel={handleCancelForm}
        />
      </DrawerCustomerFormLoading>
    </CustomerFormProvider>
  );
}

export const QuickCustomerFormDrawer = compose(withDrawerActions)(
  QuickCustomerFormDrawerInner,
);
