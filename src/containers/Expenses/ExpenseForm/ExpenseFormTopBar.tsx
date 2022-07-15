import React from 'react';
import intl from 'react-intl-universal';
import { Button, Alignment, NavbarGroup, Classes } from '@blueprintjs/core';
import { useSetPrimaryBranchToForm } from './utils';
import { useFeatureCan } from '@/hooks/state';
import { Features } from '@/constants';
import {
  Icon,
  BranchSelect,
  FeatureCan,
  FormTopbar,
  DetailsBarSkeletonBase,
} from '@/components';
import { useExpenseFormContext } from './ExpenseFormPageProvider';

/**
 * Expenses form topbar.
 * @returns
 */
export default function ExpenseFormTopBar() {
  // Features guard.
  const { featureCan } = useFeatureCan();

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();

  // Can't display the navigation bar if  branches feature is not enabled.
  if (!featureCan(Features.Branches)) {
    return null;
  }

  return (
    <FormTopbar>
      <NavbarGroup align={Alignment.LEFT}>
        <FeatureCan feature={Features.Branches}>
          <ExpenseFormSelectBranch />
        </FeatureCan>
      </NavbarGroup>
    </FormTopbar>
  );
}

function ExpenseFormSelectBranch() {
  // Invoice form context.
  const { branches, isBranchesLoading } = useExpenseFormContext();

  return isBranchesLoading ? (
    <DetailsBarSkeletonBase className={Classes.SKELETON} />
  ) : (
    <BranchSelect
      name={'branch_id'}
      branches={branches}
      input={ExpenseBranchSelectButton}
      popoverProps={{ minimal: true }}
    />
  );
}

function ExpenseBranchSelectButton({ label }) {
  return (
    <Button
      text={intl.get('expense.branch_button.label', { label })}
      minimal={true}
      small={true}
      icon={<Icon icon={'branch-16'} iconSize={16} />}
    />
  );
}
