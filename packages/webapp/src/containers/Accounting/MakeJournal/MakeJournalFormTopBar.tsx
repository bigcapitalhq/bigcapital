// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Button, Alignment, NavbarGroup, Classes } from '@blueprintjs/core';
import { useSetPrimaryBranchToForm } from './utils';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import {
  Icon,
  BranchSelect,
  FeatureCan,
  FormTopbar,
  DetailsBarSkeletonBase,
  FormBranchSelectButton,
} from '@/components';
import { useMakeJournalFormContext } from './MakeJournalProvider';

/**
 * Make journal form topbar.
 * @returns
 */
export default function MakeJournalFormTopBar() {
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
          <MakeJournalFormSelectBranch />
        </FeatureCan>
      </NavbarGroup>
    </FormTopbar>
  );
}

function MakeJournalFormSelectBranch() {
  // Invoice form context.
  const { branches, isBranchesLoading } = useMakeJournalFormContext();

  return isBranchesLoading ? (
    <DetailsBarSkeletonBase className={Classes.SKELETON} />
  ) : (
    <BranchSelect
      name={'branch_id'}
      branches={branches}
      input={FormBranchSelectButton}
      popoverProps={{ minimal: true }}
      fill={false}
    />
  );
}
