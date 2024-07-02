import React, { createContext } from 'react';
import { DialogContent } from '@/components';
import { useBankRules } from '@/hooks/query/bank-rules';

interface RulesListBootValues {
  bankRules: any;
  isBankRulesLoading: boolean;
}

const RulesListBootContext = createContext<RulesListBootValues>(
  {} as RulesListBootValues,
);

interface RulesListBootProps {
  children: React.ReactNode;
}

function RulesListBoot({ ...props }: RulesListBootProps) {
  const { data: bankRules, isLoading: isBankRulesLoading } = useBankRules();

  const provider = { bankRules, isBankRulesLoading } as RulesListBootValues;
  const isLoading = isBankRulesLoading;

  return (
    <DialogContent isLoading={isLoading}>
      <RulesListBootContext.Provider {...props} value={provider} />
    </DialogContent>
  );
}

const useRulesListBoot = () =>
  React.useContext<RulesListBootValues>(RulesListBootContext);

export { RulesListBoot, useRulesListBoot };
