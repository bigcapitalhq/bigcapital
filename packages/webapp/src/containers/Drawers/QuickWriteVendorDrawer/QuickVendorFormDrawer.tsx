import { Card, DrawerLoading } from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { DRAWERS } from '@/constants/drawers';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { VendorFormFormik } from '@/containers/Vendors/VendorForm/VendorFormFormik';
import {
  VendorFormProvider,
  useVendorFormContext,
} from '@/containers/Vendors/VendorForm/VendorFormProvider';
import type { VendorFormValues } from '@/containers/Vendors/VendorForm/utils';
import { useAddAutofillRef } from '@/hooks/state/autofill';
import type { FormikHelpers } from 'formik';
import { compose } from '@/utils';

type VendorFormSubmitPayload = { noRedirect?: boolean };

interface QuickVendorFormDrawerProps
  extends WithDrawerActionsProps,
    WithDashboardActionsProps {
  displayName?: string;
  vendorId?: number;
  autofillRef?: number;
  // Latent bug preserved: action is not actually injected by
  // WithDashboardActionsProps — runtime ReferenceError if invoked.
  addQuickActionEvent?: (event: unknown, payload: unknown) => void;
}

/**
 * Drawer vendor form loading wrapper.
 */
function DrawerVendorFormLoading({ children }: { children: React.ReactNode }) {
  const { isFormLoading } = useVendorFormContext();

  return <DrawerLoading loading={isFormLoading}>{children}</DrawerLoading>;
}

/**
 * Quick vendor form of the drawer.
 */
function QuickVendorFormDrawerInner({
  displayName,
  closeDrawer,
  vendorId,
  autofillRef,
}: QuickVendorFormDrawerProps) {
  const { payload: _payload } = useDrawerContext();
  const addAutofillRef = useAddAutofillRef();

  // Handle the form submit request success.
  // `responseData` is typed as `unknown` because `VendorFormFormik` forwards
  // the mutate result opaquely; the SDK's `createVendor` returns void so the
  // created id is unavailable here. To preserve the previous runtime behavior
  // we fall back to `vendorId` when `responseData.id` is missing.
  const handleSubmitSuccess = (
    values: VendorFormValues,
    _form: FormikHelpers<VendorFormValues>,
    submitPayload: VendorFormSubmitPayload,
    responseData?: unknown,
  ) => {
    if (!submitPayload.noRedirect) {
      closeDrawer(DRAWERS.QUICK_WRITE_VENDOR);
    }
    if (autofillRef) {
      const responseId =
        (responseData as { id?: number } | undefined)?.id ?? vendorId;
      addAutofillRef(autofillRef, {
        displayName: values.displayName,
        vendorId: responseId,
      });
    }
  };
  // Handle the form cancel action.
  const handleCancelForm = () => {
    closeDrawer(DRAWERS.QUICK_WRITE_VENDOR);
  };

  return (
    <VendorFormProvider vendorId={vendorId}>
      <DrawerVendorFormLoading>
        <VendorFormFormik
          initialValues={{ firstName: displayName }}
          onSubmitSuccess={handleSubmitSuccess}
          onCancel={handleCancelForm}
        />
      </DrawerVendorFormLoading>
    </VendorFormProvider>
  );
}

export const QuickVendorFormDrawer = compose(
  withDrawerActions,
  withDashboardActions,
)(QuickVendorFormDrawerInner);
