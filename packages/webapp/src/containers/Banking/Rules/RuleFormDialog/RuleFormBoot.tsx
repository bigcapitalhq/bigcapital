import React, { createContext } from 'react';
import { DialogContent } from '@/components';

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
  const provider = {} as RuleFormBootValues;

  return (
    <DialogContent isLoading={false}>
      <RuleFormBootContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useRuleFormDialogBoot = () =>
  React.useContext<RuleFormBootValues>(RuleFormBootContext);

export { RuleFormBoot, useRuleFormDialogBoot };
