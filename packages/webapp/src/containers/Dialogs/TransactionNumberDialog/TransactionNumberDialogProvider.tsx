import React from 'react';
import { DialogContent } from '@/components';
import { useSettingCashFlow } from '@/hooks/query';

interface TransactionNumberDialogContextValue {
  isSettingsLoading: boolean;
}

const TransactionNumberDialogContext =
  React.createContext<TransactionNumberDialogContextValue>(
    {} as TransactionNumberDialogContextValue,
  );

interface TransactionNumberDialogProviderProps {
  query?: Record<string, unknown>;
  children?: React.ReactNode;
}

/**
 * Transaction number dialog provider.
 */
function TransactionNumberDialogProvider({
  ...props
}: TransactionNumberDialogProviderProps) {
  const { isLoading: isSettingsLoading } = useSettingCashFlow();

  // Provider payload.
  const provider: TransactionNumberDialogContextValue = { isSettingsLoading };

  return (
    <DialogContent isLoading={isSettingsLoading}>
      <TransactionNumberDialogContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useTransactionNumberDialogContext = () =>
  React.useContext(TransactionNumberDialogContext);

export { TransactionNumberDialogProvider, useTransactionNumberDialogContext };
