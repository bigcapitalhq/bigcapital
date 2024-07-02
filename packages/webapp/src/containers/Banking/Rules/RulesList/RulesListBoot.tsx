import React, { createContext } from 'react';
import { DialogContent } from '@/components';
import { useBankRules } from '@/hooks/query/bank-rules';
import { isEmpty } from 'lodash';

interface RulesListBootValues {
  bankRules: any;
  isBankRulesLoading: boolean;
  isEmptyState: boolean;
}

const RulesListBootContext = createContext<RulesListBootValues>(
  {} as RulesListBootValues,
);

interface RulesListBootProps {
  children: React.ReactNode;
}

function RulesListBoot({ ...props }: RulesListBootProps) {
  const { data: bankRules, isLoading: isBankRulesLoading } = useBankRules();

  const isEmptyState = !isBankRulesLoading && isEmpty(bankRules);
  const isLoading = isBankRulesLoading;

  const provider = { bankRules, isBankRulesLoading, isEmptyState } as RulesListBootValues;

  return (
    <DialogContent isLoading={isLoading}>
      <RulesListBootContext.Provider {...props} value={provider} />
    </DialogContent>
  );
}

const useRulesListBoot = () =>
  React.useContext<RulesListBootValues>(RulesListBootContext);

export { RulesListBoot, useRulesListBoot };
