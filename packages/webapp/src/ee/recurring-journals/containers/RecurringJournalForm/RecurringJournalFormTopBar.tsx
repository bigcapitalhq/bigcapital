import { Alignment, NavbarGroup } from '@blueprintjs/core';
import React from 'react';
import { useRecurringJournalFormContext } from './RecurringJournalFormProvider';
import { BranchSelect, FormTopbar, FormBranchSelectButton } from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';

/**
 * Recurring journal form topbar.
 */
export function RecurringJournalFormTopBar() {
  const { featureCan } = useFeatureCan();

  // Can't display the navigation bar if branches feature is not enabled.
  if (!featureCan(Features.Branches)) {
    return null;
  }

  return (
    <FormTopbar>
      <NavbarGroup align={Alignment.LEFT}>
        <RecurringJournalFormSelectBranch />
      </NavbarGroup>
    </FormTopbar>
  );
}

function RecurringJournalFormSelectBranch() {
  const { branches } = useRecurringJournalFormContext();

  return (
    <BranchSelect
      name={'branchId'}
      branches={branches}
      input={FormBranchSelectButton}
      popoverProps={{ minimal: true }}
      fill={false}
    />
  );
}
