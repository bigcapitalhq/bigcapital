import React, { createContext, useContext } from 'react';
import { Spinner } from '@blueprintjs/core';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { SaleEstimateMailStateResponse, useSaleEstimateMailState } from '@/hooks/query';

interface EstimateSendMailBootValues {
  estimateId: number;

  estimateMailState: SaleEstimateMailStateResponse | undefined;
  isEstimateMailState: boolean;
}
interface EstimateSendMailBootProps {
  children: React.ReactNode;
}

const EstimateSendMailContentBootContext =
  createContext<EstimateSendMailBootValues>({} as EstimateSendMailBootValues);

export const EstimateSendMailBoot = ({
  children,
}: EstimateSendMailBootProps) => {
  const {
    payload: { estimateId },
  } = useDrawerContext();

  // Estimate mail options.
  const { data: estimateMailState, isLoading: isEstimateMailState } =
    useSaleEstimateMailState(estimateId);

  const isLoading = isEstimateMailState;

  if (isLoading) {
    return <Spinner size={20} />;
  }
  const value = {
    estimateId,

    // # Estimate mail options
    isEstimateMailState,
    estimateMailState,
  };

  return (
    <EstimateSendMailContentBootContext.Provider value={value}>
      {children}
    </EstimateSendMailContentBootContext.Provider>
  );
};
EstimateSendMailBoot.displayName = 'EstimateSendMailBoot';

export const useEstimateSendMailBoot = () => {
  return useContext<EstimateSendMailBootValues>(
    EstimateSendMailContentBootContext,
  );
};
