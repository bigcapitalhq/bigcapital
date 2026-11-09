import React from 'react';
import { AccountDrawerActionBar } from './AccountDrawerActionBar';
import { AccountDrawerHeader } from './AccountDrawerHeader';
import { AccountDrawerTable } from './AccountDrawerTable';
import { Card } from '@/components';

/**
 * Account view details.
 */
export function AccountDrawerDetails() {
  return (
    <div className={'account-drawer'}>
      <AccountDrawerActionBar />

      <Card className={'card-header'}>
        <AccountDrawerHeader />
      </Card>
      <AccountDrawerTable />
    </div>
  );
}
