// @ts-nocheck
import React, { createContext } from 'react';
import { useSaleEstimateDefaultOptions } from '@/hooks/query';
import { DialogContent } from '@/components';

interface EstimateMailDialogBootValues {
  estimateId: number;
  mailOptions: any;
  redirectToEstimatesList: boolean;
}

const EstimateMailDialagBoot = createContext<EstimateMailDialogBootValues>();

interface EstimateMailDialogBootProps {
  estimateId: number;
  redirectToEstimatesList?: boolean;
  children: React.ReactNode;
}

/**
 * Estimate mail dialog boot provider.
 */
function EstimateMailDialogBoot({
  estimateId,
  redirectToEstimatesList,
  ...props
}: EstimateMailDialogBootProps) {
  const { data: mailOptions, isLoading: isMailOptionsLoading } =
    useSaleEstimateDefaultOptions(estimateId);

  const provider = {
    saleEstimateId: estimateId,
    mailOptions,
    isMailOptionsLoading,
    redirectToEstimatesList,
  };

  return (
    <DialogContent isLoading={isMailOptionsLoading}>
      <EstimateMailDialagBoot.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useEstimateMailDialogBoot = () =>
  React.useContext<EstimateMailDialogBootValues>(EstimateMailDialagBoot);

export { EstimateMailDialogBoot, useEstimateMailDialogBoot };
