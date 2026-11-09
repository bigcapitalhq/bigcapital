import React from 'react';
import intl from 'react-intl-universal';
import type { SaleEstimate } from '@bigcapital/sdk-ts';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { Features } from '@/constants';
import { DRAWERS } from '@/constants/drawers';
import { useEstimateDetail } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

/**
 * The SDK's ItemEntryDto shape, plus the formatted fields the backend actually
 * returns and the detail drawer's table columns read.
 */
export type EstimateDetailEntry = SaleEstimate['entries'][number] & {
  item?: { name?: string };
  quantityFormatted?: string;
  rateFormatted?: string;
  discountFormatted?: string;
  totalFormatted?: string;
};

/**
 * Fields the OpenAPI schema's `SaleEstimateResponseDto` does not surface but
 * the backend returns and the detail drawer consumes. Augmented locally until
 * the schema is updated.
 */
export interface EstimateDetail extends Omit<SaleEstimate, 'entries'> {
  subtotal?: number;
  branch?: { name?: string };
  entries: EstimateDetailEntry[];
}

export interface EstimateDetailDrawerContextValue {
  estimateId: number | undefined;
  estimate: EstimateDetail | undefined;
}

const EstimateDetailDrawerContext = React.createContext<
  EstimateDetailDrawerContextValue | undefined
>(undefined);

interface EstimateDetailDrawerProviderProps {
  estimateId: number | undefined;
}

/**
 * Estimate detail provider.
 */
function EstimateDetailDrawerProvider({
  estimateId,
  ...props
}: EstimateDetailDrawerProviderProps & { children?: React.ReactNode }) {
  // Features guard.
  const { featureCan } = useFeatureCan();

  // Fetches the estimate by the given id.
  const { data, isLoading: isEstimateLoading } = useEstimateDetail(estimateId, {
    enabled: !!estimateId,
  });
  const estimate = data as EstimateDetail | undefined;

  const provider: EstimateDetailDrawerContextValue = {
    estimateId,
    estimate,
  };

  return (
    <DrawerLoading loading={isEstimateLoading}>
      <DrawerHeaderContent
        name={DRAWERS.ESTIMATE_DETAILS}
        title={intl.get('estimate.drawer.title', {
          number: estimate?.estimateNumber,
        })}
        subTitle={
          featureCan(Features.Branches)
            ? intl.get('estimate.drawer.subtitle', {
                value: estimate?.branch?.name,
              })
            : null
        }
      />
      <EstimateDetailDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useEstimateDetailDrawerContext = (): EstimateDetailDrawerContextValue => {
  const ctx = React.useContext(EstimateDetailDrawerContext);
  if (ctx === undefined) {
    throw new Error(
      'useEstimateDetailDrawerContext must be used within an EstimateDetailDrawerProvider',
    );
  }
  return ctx;
};

export { EstimateDetailDrawerProvider, useEstimateDetailDrawerContext };
