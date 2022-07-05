import React, { createContext } from 'react';
import { useEstimate } from '@/hooks/query';
import { DrawerHeaderContent, DashboardInsider } from '@/components';

const EstimateDrawerContext = createContext();

/**
 * Estimate drawer provider.
 */

function EstimateDrawerProvider({ estimateId, ...props }) {
  const {
    data: { entries, ...estimate },
    isLoading: isEstimateLoading,
  } = useEstimate(estimateId, { enabled: !!estimateId });

  // Provider payload.
  const provider = {
    estimateId,
    estimate,
    entries,
    isEstimateLoading,
  };

  return (
    <DashboardInsider loading={isEstimateLoading}>
      <DrawerHeaderContent name={'estimate-drawer'} />
      <EstimateDrawerContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}
const useEstimateDrawerContext = () => React.useContext(EstimateDrawerContext);

export { EstimateDrawerProvider, useEstimateDrawerContext };
