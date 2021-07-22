import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DashboardInsider } from 'components';

const BillDrawerContext = React.createContext();

/**
 * Bill drawer provider.
 */
function BillDrawerProvider({ billId, ...props }) {
  //provider.
  const provider = {};
  return (
    <DashboardInsider>
      <DrawerHeaderContent
        name="bill-drawer"
        title={intl.get('bill_details')}
      />
      <BillDrawerContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useBillDrawerContext = () => React.useContext(BillDrawerContext);

export { BillDrawerProvider, useBillDrawerContext };
