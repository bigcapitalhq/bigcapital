import React, { createContext } from 'react';
import { DialogContent } from '@/components';
import { useBankRule } from '@/hooks/query/bank-rules';
import { useAccounts } from '@/hooks/query';

interface RuleFormBootValues {
  bankRule?: null;
  bankRuleId?: null;
  isBankRuleLoading: boolean;
}

const RuleFormBootContext = createContext<RuleFormBootValues>(
  {} as RuleFormBootValues,
);

interface RuleFormBootProps {
  bankRuleId?: number;
  children: React.ReactNode;
}

function RuleFormBoot({ bankRuleId, ...props }: RuleFormBootProps) {
  const { data: bankRule, isLoading: isBankRuleLoading } = useBankRule(
    bankRuleId as number,
    {
      enabled: !!bankRuleId,
    },
  );
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts({}, {});

  const provider = {
    bankRule,
    accounts,
    isBankRuleLoading,
    isAccountsLoading,
  } as RuleFormBootValues;

  const isLoading = isBankRuleLoading || isAccountsLoading;

  return (
    <DialogContent isLoading={isLoading}>
      <RuleFormBootContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useRuleFormDialogBoot = () =>
  React.useContext<RuleFormBootValues>(RuleFormBootContext);

export { RuleFormBoot, useRuleFormDialogBoot };
