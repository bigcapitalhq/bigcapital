import { Alignment, NavbarGroup, Classes } from '@blueprintjs/core';
import React from 'react';
import { usePaymentMadeFormContext } from './PaymentMadeFormProvider';
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
 * Payment made from top bar.
 */
export function PaymentMadeFormTopBar() {
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
      name={'branchId'}
      branches={branches}
      input={FormBranchSelectButton}
      popoverProps={{ minimal: true }}
      fill={false}
    />
  );
}
