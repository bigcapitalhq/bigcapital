import { Alignment, NavbarGroup, Classes } from '@blueprintjs/core';
import React from 'react';
import { useMakeJournalFormContext } from './MakeJournalProvider';
import { useSetPrimaryBranchToForm } from './utils';
import {
  BranchSelect,
  FormTopbar,
  DetailsBarSkeletonBase,
  FormBranchSelectButton,
} from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';

/**
 * Make journal form topbar.
 */
export function MakeJournalFormTopBar() {
  // Features guard.
  const { featureCan } = useFeatureCan();

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();

  // Can't display the navigation bar if branches feature is not enabled.
  if (!featureCan(Features.Branches)) {
    return null;
  }

  return (
    // @ts-expect-error FormTopbar is untyped and infers a required className prop that is unused at runtime
    <FormTopbar>
      <NavbarGroup align={Alignment.LEFT}>
        <MakeJournalFormSelectBranch />
      </NavbarGroup>
    </FormTopbar>
  );
}

function MakeJournalFormSelectBranch() {
  const { branches, isBranchesLoading } = useMakeJournalFormContext();

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
