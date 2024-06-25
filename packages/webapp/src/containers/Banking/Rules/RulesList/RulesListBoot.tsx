import React, { createContext } from 'react';
import { DialogContent } from '@/components';
import { useBankRules } from '@/hooks/query/bank-rules';

interface RulesListBootValues {
  bankRules: any;
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

  return (
    <DialogContent isLoading={false}>
      <RulesListBootContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useRulesListBoot = () =>
  React.useContext<RulesListBootValues>(RulesListBootContext);

export { RulesListBoot, useRulesListBoot };
