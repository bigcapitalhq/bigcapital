// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Alignment, NavbarGroup, Button, Classes } from '@blueprintjs/core';
import { useSetPrimaryBranchToForm } from './utils';
import { useFeatureCan } from '@/hooks/state';
import {
  Icon,
  BranchSelect,
  FeatureCan,
  FormTopbar,
  DetailsBarSkeletonBase,
} from '@/components';
import { usePaymentMadeFormContext } from './PaymentMadeFormProvider';
import { Features } from '@/constants';

/**
 * Payment made from top bar.
 * @returns
 */
export default function PaymentMadeFormTopBar() {
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
          <PaymentMadeFormSelectBranch />
        </FeatureCan>
      </NavbarGroup>
    </FormTopbar>
  );
}

function PaymentMadeFormSelectBranch() {
  // payment made form context.
  const { branches, isBranchesLoading } = usePaymentMadeFormContext();

  return isBranchesLoading ? (
    <DetailsBarSkeletonBase className={Classes.SKELETON} />
  ) : (
    <BranchSelect
      name={'branch_id'}
      branches={branches}
      input={PaymentMadeBranchSelectButton}
      popoverProps={{ minimal: true }}
    />
  );
}

function PaymentMadeBranchSelectButton({ label }) {
  return (
    <Button
      text={intl.get('payment_made.branch_button.label', { label })}
      minimal={true}
      small={true}
      icon={<Icon icon={'branch-16'} iconSize={16} />}
    />
  );
}
