import React from 'react';
import intl from 'react-intl-universal';
import { useEstimate } from 'hooks/query';
import { DrawerHeaderContent, DrawerLoading } from 'components';

const EstimateDetailDrawerContext = React.createContext();

/**
 * Estimate detail provider.
 */
function EstimateDetailDrawerProvider({ estimateId, ...props }) {
  // Fetches the estimate by the given id.
  const { data: estimate, isLoading: isEstimateLoading } = useEstimate(
    estimateId,
    { enabled: !!estimateId },
  );

  const provider = {
    estimateId,
    estimate,
  };

  return (
    <DrawerLoading loading={isEstimateLoading}>
      <DrawerHeaderContent
        name="estimate-detail-drawer"
        title={intl.get('estimate.drawer.title', {
          number: estimate.estimate_number,
        })}
      />
      <EstimateDetailDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useEstimateDetailDrawerContext = () =>
  React.useContext(EstimateDetailDrawerContext);

export { EstimateDetailDrawerProvider, useEstimateDetailDrawerContext };
