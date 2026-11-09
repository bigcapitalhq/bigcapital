import { Alignment, NavbarGroup, Classes } from '@blueprintjs/core';
import React from 'react';
import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';
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
 * Payment receive from top bar.
 */
export function PaymentReceiveFormTopBar() {
  const { featureCan } = useFeatureCan();

  useSetPrimaryBranchToForm();

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

/**
 * Branch select of payment receive form.
 */
function PaymentReceiveFormSelectBranch() {
  const { branches, isBranchesLoading } = usePaymentReceiveFormContext();

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
