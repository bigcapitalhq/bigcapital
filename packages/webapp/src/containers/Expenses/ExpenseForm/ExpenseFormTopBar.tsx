import { Alignment, NavbarGroup, Classes } from '@blueprintjs/core';
import React from 'react';
import { useExpenseFormContext } from './ExpenseFormPageProvider';
import { useSetPrimaryBranchToForm } from './utils';
import {
  BranchSelect,
  FeatureCan,
  FormTopbar,
  DetailsBarSkeletonBase,
  FormBranchSelectButton,
} from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';

/**
 * Expenses form topbar.
 * @returns
 */
export function ExpenseFormTopBar() {
  const { featureCan } = useFeatureCan();

  useSetPrimaryBranchToForm();

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
  const { branches, isBranchesLoading } = useExpenseFormContext();

  return isBranchesLoading ? (
    <DetailsBarSkeletonBase className={Classes.SKELETON} />
  ) : (
    <BranchSelect
      name={'branchId'}
      branches={branches}
      input={FormBranchSelectButton}
      popoverProps={{ minimal: true }}
      fill={false}
    />
  );
}
