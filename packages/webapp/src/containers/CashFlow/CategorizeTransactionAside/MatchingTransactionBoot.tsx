import { defaultTo } from 'lodash';
import React, { createContext } from 'react';
import { useGetBankTransactionsMatches } from '@/hooks/query/bank-rules';

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
  } = useGetBankTransactionsMatches(uncategorizedTransactionId);

  const provider = {
    isMatchingTransactionsLoading,
    possibleMatches: defaultTo(matchingTransactions?.possibleMatches, []),
    perfectMatchesCount: matchingTransactions?.perfectMatches?.length || 0,
    perfectMatches: defaultTo(matchingTransactions?.perfectMatches, []),
  } as MatchingTransactionBootValues;

  return <RuleFormBootContext.Provider value={provider} {...props} />;
}

const useMatchingTransactionBoot = () =>
  React.useContext<MatchingTransactionBootValues>(RuleFormBootContext);

export { MatchingTransactionBoot, useMatchingTransactionBoot };
