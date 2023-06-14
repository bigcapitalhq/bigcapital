// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import {
  useVendorCredit,
  useRefundVendorCredit,
  useReconcileVendorCredits,
} from '@/hooks/query';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { useFeatureCan } from '@/hooks/state';
import { Features } from '@/constants';
import { DRAWERS } from '@/constants/drawers';

const VendorCreditDetailDrawerContext = React.createContext();

/**
 * Vendor credit drawer provider.
 */
function VendorCreditDetailDrawerProvider({ vendorCreditId, ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();

  // Handle fetch vendor credit details.
  const { data: vendorCredit, isLoading: isVendorCreditLoading } =
    useVendorCredit(vendorCreditId, {
      enabled: !!vendorCreditId,
    });

  // Handle fetch refund credit note.
  const {
    data: refundVendorCredit,
    isFetching: isRefundVendorCreditFetching,
    isLoading: isRefundVendorCreditLoading,
  } = useRefundVendorCredit(vendorCreditId, {
    enabled: !!vendorCreditId,
  });

  // Handle fetch refund credit note.
  const {
    data: reconcileVendorCredits,
    isFetching: isReconcileVendorCreditFetching,
    isLoading: isReconcileVendorCreditLoading,
  } = useReconcileVendorCredits(vendorCreditId, {
    enabled: !!vendorCreditId,
  });

  const provider = {
    vendorCredit,
    refundVendorCredit,
    reconcileVendorCredits,
    isRefundVendorCreditLoading,
    isRefundVendorCreditFetching,
    vendorCreditId,
  };

  return (
    <DrawerLoading
      loading={
        isVendorCreditLoading ||
        isRefundVendorCreditLoading ||
        isReconcileVendorCreditLoading
      }
    >
      <DrawerHeaderContent
        name={DRAWERS.VENDOR_CREDIT_DETAILS}
        title={intl.get('vendor_credit.drawer_vendor_credit_detail', {
          vendorNumber: vendorCredit.vendor_credit_number,
        })}
        subTitle={
          featureCan(Features.Branches)
            ? intl.get('vendor_credit.drawer.subtitle', {
                value: vendorCredit.branch?.name,
              })
            : null
        }
      />
      <VendorCreditDetailDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useVendorCreditDetailDrawerContext = () =>
  React.useContext(VendorCreditDetailDrawerContext);

export { VendorCreditDetailDrawerProvider, useVendorCreditDetailDrawerContext };
