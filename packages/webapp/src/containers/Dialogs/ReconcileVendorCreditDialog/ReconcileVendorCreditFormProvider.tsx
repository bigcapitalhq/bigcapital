import { isEmpty } from 'lodash';
import React, { createContext } from 'react';
import type {
  ReconcileVendorCredit,
  ReconcileVendorCreditContextValue,
  ReconcileVendorCreditFormEntry,
} from './types';
import { DialogContent } from '@/components';
import {
  useCreateReconcileVendorCredit,
  useReconcileVendorCredit,
  useVendorCredit,
} from '@/hooks/query';

const ReconcileVendorCreditFormContext =
  createContext<ReconcileVendorCreditContextValue>(
    {} as ReconcileVendorCreditContextValue,
  );

interface ReconcileVendorCreditFormProviderProps {
  vendorCreditId?: number | null;
  dialogName: string;
  children?: React.ReactNode;
}

/**
 * Reconcile vendor credit provider.
 */
function ReconcileVendorCreditFormProvider({
  vendorCreditId,
  dialogName,
  ...props
}: ReconcileVendorCreditFormProviderProps) {
  // Handle fetch reconcile vendor credits.
  // `useReconcileVendorCredit` returns `unknown` from the SDK; cast narrow.
  const {
    isLoading: isReconcileVendorCreditLoading,
    data: reconcileVendorCreditsRaw,
  } = useReconcileVendorCredit(vendorCreditId, {
    enabled: !!vendorCreditId,
  });
  const reconcileVendorCredits =
    (reconcileVendorCreditsRaw as
      | ReconcileVendorCreditFormEntry[]
      | undefined) ?? [];

  // Handle fetch vendor credit details.
  const { data: vendorCredit, isLoading: isVendorCreditLoading } =
    useVendorCredit(vendorCreditId, {
      enabled: !!vendorCreditId,
    });

  // Create reconcile vendor credit mutations.
  const { mutateAsync: createReconcileVendorCreditMutate } =
    useCreateReconcileVendorCredit();

  // Detarmines the datatable empty status.
  const isEmptyStatus = isEmpty(reconcileVendorCredits);

  // provider.
  const provider: ReconcileVendorCreditContextValue = {
    dialogName,
    reconcileVendorCredits,
    createReconcileVendorCreditMutate,
    isEmptyStatus,
    vendorCredit: vendorCredit as ReconcileVendorCredit | undefined,
  };

  return (
    <DialogContent
      isLoading={isVendorCreditLoading || isReconcileVendorCreditLoading}
      name={'reconcile-vendor-credit'}
    >
      <ReconcileVendorCreditFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useReconcileVendorCreditContext = () =>
  React.useContext(ReconcileVendorCreditFormContext);

export { ReconcileVendorCreditFormProvider, useReconcileVendorCreditContext };
