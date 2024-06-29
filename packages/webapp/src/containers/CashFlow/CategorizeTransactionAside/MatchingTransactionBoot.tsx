import { useMatchingTransactions } from '@/hooks/query/bank-rules';
import React, { createContext } from 'react';

interface MatchingTransactionBootValues {
  isMatchingTransactionsLoading: boolean;
  possibleMatches: Array<any>;
  perfectMatchesCount: number;
  perfectMatches: Array<any>;
  matches: Array<any>;
}

const RuleFormBootContext = createContext<MatchingTransactionBootValues>(
  {} as MatchingTransactionBootValues,
);

interface RuleFormBootProps {
  uncategorizedTransactionId: number;
  children: React.ReactNode;
}

function MatchingTransactionBoot({
  uncategorizedTransactionId,
  ...props
}: RuleFormBootProps) {
  const {
    data: matchingTransactions,
    isLoading: isMatchingTransactionsLoading,
  } = useMatchingTransactions(uncategorizedTransactionId);

  const provider = {
    isMatchingTransactionsLoading,
    possibleMatches: matchingTransactions?.possibleMatches,
    perfectMatchesCount: 2,
    perfectMatches: matchingTransactions?.perfectMatches,
  } as MatchingTransactionBootValues;

  return <RuleFormBootContext.Provider value={provider} {...props} />;
}

const useMatchingTransactionBoot = () =>
  React.useContext<MatchingTransactionBootValues>(RuleFormBootContext);

export { MatchingTransactionBoot, useMatchingTransactionBoot };
