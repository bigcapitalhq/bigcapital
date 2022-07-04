import React from 'react';
import intl from 'react-intl-universal';
import { Alignment, NavbarGroup, Button, Classes } from '@blueprintjs/core';
import { useSetPrimaryBranchToForm } from './utils';
import { useFeatureCan } from 'hooks/state';
import {
  Icon,
  BranchSelect,
  FeatureCan,
  FormTopbar,
  DetailsBarSkeletonBase,
} from '@/components';
import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';
import { Features } from 'common';

/**
 * Payment receive from top bar.
 * @returns
 */
export default function PaymentReceiveFormTopBar() {
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
          <PaymentReceiveFormSelectBranch />
        </FeatureCan>
      </NavbarGroup>
    </FormTopbar>
  );
}

function PaymentReceiveFormSelectBranch() {
  // payment receive form context.
  const { branches, isBranchesLoading } = usePaymentReceiveFormContext();

  return isBranchesLoading ? (
    <DetailsBarSkeletonBase className={Classes.SKELETON} />
  ) : (
    <BranchSelect
      name={'branch_id'}
      branches={branches}
      input={PaymentReceiveBranchSelectButton}
      popoverProps={{ minimal: true }}
    />
  );
}

function PaymentReceiveBranchSelectButton({ label }) {
  return (
    <Button
      text={intl.get('payment_receive.branch_button.label', { label })}
      minimal={true}
      small={true}
      icon={<Icon icon={'branch-16'} iconSize={16} />}
    />
  );
}
