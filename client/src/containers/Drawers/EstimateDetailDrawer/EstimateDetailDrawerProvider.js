import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DashboardInsider } from 'components';

const EstimateDetailDrawerContext = React.createContext();

/**
 * Estimate detail provider.
 */
function EstimateDetailDrawerProvider({ estimateId, ...props }) {
  const provider = {
    estimateId,
  };

  return (
    <DashboardInsider>
      <DrawerHeaderContent
        name="estimate-detail-drawer"
        title={intl.get('estimate_details')}
      />

      <EstimateDetailDrawerContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useEstimateDetailDrawerContext = () =>
  React.useContext(EstimateDetailDrawerContext);

export { EstimateDetailDrawerProvider, useEstimateDetailDrawerContext };
