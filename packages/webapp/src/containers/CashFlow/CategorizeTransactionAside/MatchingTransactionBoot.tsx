import { useMatchingTransactions } from '@/hooks/query/bank-rules';
import React, { createContext } from 'react';

interface MatchingTransactionBootValues {
  isMatchingTransactionsLoading: boolean;
  matchingTransactions: Array<any>;
  perfectMatchesCount: number;
  perfectMatches: Array<any>;
  matches: Array<any>;
}

const RuleFormBootContext = createContext<MatchingTransactionBootValues>(
  {} as MatchingTransactionBootValues,
);

interface RuleFormBootProps {
  children: React.ReactNode;
}

function MatchingTransactionBoot({ ...props }: RuleFormBootProps) {
  const {
    data: matchingTransactions,
    isLoading: isMatchingTransactionsLoading,
  } = useMatchingTransactions();

  const provider = {
    isMatchingTransactionsLoading,
    matchingTransactions,
    perfectMatchesCount: 2,
    perfectMatches: [],
    matches: [],
  } as MatchingTransactionBootValues;

  return <RuleFormBootContext.Provider value={provider} {...props} />;
}

const useMatchingTransactionBoot = () =>
  React.useContext<MatchingTransactionBootValues>(RuleFormBootContext);

export { MatchingTransactionBoot, useMatchingTransactionBoot };
