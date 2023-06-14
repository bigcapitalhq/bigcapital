// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Features } from '@/constants';
import { useEstimate } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { DRAWERS } from '@/constants/drawers';

const EstimateDetailDrawerContext = React.createContext();

/**
 * Estimate detail provider.
 */
function EstimateDetailDrawerProvider({ estimateId, ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();

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
        name={DRAWERS.ESTIMATE_DETAILS}
        title={intl.get('estimate.drawer.title', {
          number: estimate.estimate_number,
        })}
        subTitle={
          featureCan(Features.Branches)
            ? intl.get('estimate.drawer.subtitle', {
                value: estimate.branch?.name,
              })
            : null
        }
      />
      <EstimateDetailDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useEstimateDetailDrawerContext = () =>
  React.useContext(EstimateDetailDrawerContext);

export { EstimateDetailDrawerProvider, useEstimateDetailDrawerContext };
