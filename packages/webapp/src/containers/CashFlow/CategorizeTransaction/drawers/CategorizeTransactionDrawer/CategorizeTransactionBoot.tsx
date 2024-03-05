// @ts-nocheck
import React from 'react';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { useUncategorizedTransaction } from '@/hooks/query';

const CategorizeTransactionBootContext = React.createContext();

/**
 * Estimate detail provider.
 */
function CategorizeTransactionBoot({ uncategorizedTransactionId, ...props }) {
  const {
    data: uncategorizedTransaction,
    isLoading: isUncategorizedTransactionLoading,
  } = useUncategorizedTransaction(uncategorizedTransactionId);

  const provider = {
    uncategorizedTransaction,
    isUncategorizedTransactionLoading,
  };

  return (
    <DrawerLoading loading={isUncategorizedTransactionLoading}>
      <DrawerHeaderContent
        name={DRAWERS.CATEGORIZE_TRANSACTION}
        title={'Categorize Transaction'}
        subTitle={''}
      />
      <CategorizeTransactionBootContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useCategorizeTransactionBoot = () =>
  React.useContext(CategorizeTransactionBootContext);

export { CategorizeTransactionBoot, useCategorizeTransactionBoot };
