// @ts-nocheck
import { Suspense, lazy } from 'react';
import { Spinner } from '@blueprintjs/core';
import { AppContentShell } from '@/components/AppShell';

const CategorizeTransactionAside = lazy(() =>
  import('../CategorizeTransactionAside/CategorizeTransactionAside').then(
    (module) => ({ default: module.CategorizeTransactionAside }),
  ),
);

export function AccountTransactionsAside() {
  return (
    <AppContentShell.Aside>
      <Suspense fallback={<Spinner size={20} />}>
        <CategorizeTransactionAside />
      </Suspense>
    </AppContentShell.Aside>
  );
}
