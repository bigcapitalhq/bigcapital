import React, { createContext } from 'react';
import { DialogContent } from '@/components';

interface RulesListBootValues {
  rules: any;
  isRulesLoading: boolean;
}

const RulesListBootContext = createContext<RulesListBootValues>(
  {} as RulesListBootValues,
);

interface RulesListBootProps {
  children: React.ReactNode;
}

function RulesListBoot({ ...props }: RulesListBootProps) {
  const provider = {} as RulesListBootValues;

  return (
    <DialogContent isLoading={false}>
      <RulesListBootContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useRulesListBoot = () =>
  React.useContext<RulesListBootValues>(RulesListBootContext);

export { RulesListBoot, useRulesListBoot };
