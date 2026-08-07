import React from 'react';
import { DialogContent } from '@/components';
import { useSettingsVendorCredits } from '@/hooks/query';

interface VendorCreditNumberDialogContextValue {
  isSettingsLoading: boolean;
}

const VendorCreditNumberDialogContext =
  React.createContext<VendorCreditNumberDialogContextValue>(
    {} as VendorCreditNumberDialogContextValue,
  );

interface VendorCreditNumberDialogProviderProps {
  query?: Record<string, unknown>;
  children?: React.ReactNode;
}

/**
 * Vendor credit number dialog provider
 */
function VendorCreditNumberDilaogProvider({
  ...props
}: VendorCreditNumberDialogProviderProps) {
  const { isLoading: isSettingsLoading } = useSettingsVendorCredits();

  // Provider payload.
  const provider: VendorCreditNumberDialogContextValue = {
    isSettingsLoading,
  };

  return (
    <DialogContent isLoading={isSettingsLoading}>
      <VendorCreditNumberDialogContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useVendorCreditNumberDialogContext = () =>
  React.useContext(VendorCreditNumberDialogContext);

export { VendorCreditNumberDilaogProvider, useVendorCreditNumberDialogContext };
