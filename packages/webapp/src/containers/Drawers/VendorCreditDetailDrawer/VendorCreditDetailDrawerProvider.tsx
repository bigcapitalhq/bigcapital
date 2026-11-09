import React from 'react';
import intl from 'react-intl-universal';
import type {
  VendorCredit,
  VendorCreditRefund,
  VendorCreditAppliedBill,
} from '@bigcapital/sdk-ts';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { Features } from '@/constants';
import { DRAWERS } from '@/constants/drawers';
import {
  useVendorCredit,
  useRefundVendorCredit,
  useReconcileVendorCredits,
} from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

export interface VendorCreditDetailDrawerContextValue {
  vendorCreditId: number | undefined;
  vendorCredit: VendorCredit | undefined;
  refundVendorCredit: VendorCreditRefund[] | undefined;
  reconcileVendorCredits: VendorCreditAppliedBill[] | undefined;
  isRefundVendorCreditLoading: boolean;
  isRefundVendorCreditFetching: boolean;
}

const VendorCreditDetailDrawerContext = React.createContext<
  VendorCreditDetailDrawerContextValue | undefined
>(undefined);

interface VendorCreditDetailDrawerProviderProps {
  vendorCreditId: number | undefined;
}

/**
 * Vendor credit drawer provider.
 */
function VendorCreditDetailDrawerProvider({
  vendorCreditId,
  ...props
}: VendorCreditDetailDrawerProviderProps & { children?: React.ReactNode }) {
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

  // Handle fetch reconcile credit notes.
  const {
    data: reconcileVendorCredits,
    isLoading: isReconcileVendorCreditLoading,
  } = useReconcileVendorCredits(vendorCreditId, {
    enabled: !!vendorCreditId,
  });

  const provider: VendorCreditDetailDrawerContextValue = {
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
          vendorNumber: vendorCredit?.vendorCreditNumber,
        })}
        subTitle={
          featureCan(Features.Branches)
            ? intl.get('vendor_credit.drawer.subtitle', {
                value: vendorCredit?.branch?.name,
              })
            : null
        }
      />
      <VendorCreditDetailDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useVendorCreditDetailDrawerContext =
  (): VendorCreditDetailDrawerContextValue => {
    const ctx = React.useContext(VendorCreditDetailDrawerContext);
    if (ctx === undefined) {
      throw new Error(
        'useVendorCreditDetailDrawerContext must be used within a VendorCreditDetailDrawerProvider',
      );
    }
    return ctx;
  };

export { VendorCreditDetailDrawerProvider, useVendorCreditDetailDrawerContext };
