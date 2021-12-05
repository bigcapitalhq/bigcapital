import React from 'react';
import intl from 'react-intl-universal';
import { useVendorCredit, useRefundVendorCredit } from 'hooks/query';
import { DrawerHeaderContent, DrawerLoading } from 'components';

const VendorCreditDetailDrawerContext = React.createContext();

/**
 * Vendor credit drawer provider.
 */
function VendorCreditDetailDrawerProvider({ vendorCreditId, ...props }) {
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

  const provider = {
    vendorCredit,
    refundVendorCredit,
    isRefundVendorCreditLoading,
    isRefundVendorCreditFetching,
    vendorCreditId,
  };

  return (
    <DrawerLoading
      loading={isVendorCreditLoading || isRefundVendorCreditLoading}
    >
      <DrawerHeaderContent
        name="vendor-credit-detail-drawer"
        title={intl.get('vendor_credit.drawer_vendor_credit_detail')}
      />
      <VendorCreditDetailDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useVendorCreditDetailDrawerContext = () =>
  React.useContext(VendorCreditDetailDrawerContext);

export { VendorCreditDetailDrawerProvider, useVendorCreditDetailDrawerContext };
