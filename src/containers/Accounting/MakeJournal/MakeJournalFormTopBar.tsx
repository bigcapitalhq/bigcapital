import React from 'react';
import intl from 'react-intl-universal';
import { Button, Alignment, NavbarGroup, Classes } from '@blueprintjs/core';
import { useSetPrimaryBranchToForm } from './utils';
import { useFeatureCan } from '@/hooks/state';
import {
  Icon,
  BranchSelect,
  FeatureCan,
  FormTopbar,
  DetailsBarSkeletonBase,
} from '@/components';
import { useMakeJournalFormContext } from './MakeJournalProvider';
import { Features } from '@/common';

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
      input={MakeJournalBranchSelectButton}
      popoverProps={{ minimal: true }}
    />
  );
}
function MakeJournalBranchSelectButton({ label }) {
  return (
    <Button
      text={intl.get('make_journal.branch_button.label', { label })}
      minimal={true}
      small={true}
      icon={<Icon icon={'branch-16'} iconSize={16} />}
    />
  );
}
