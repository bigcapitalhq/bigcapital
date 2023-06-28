// @ts-nocheck
import React from 'react';
import {
  Alignment,
  NavbarGroup,
  NavbarDivider,
  Classes,
} from '@blueprintjs/core';
import {
  useSetPrimaryWarehouseToForm,
  useSetPrimaryBranchToForm,
} from './utils';

import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import { useReceiptFormContext } from './ReceiptFormProvider';
import {
  BranchSelect,
  FeatureCan,
  WarehouseSelect,
  FormTopbar,
  DetailsBarSkeletonBase,
  FormBranchSelectButton,
  FormWarehouseSelectButton,
} from '@/components';

/**
 * Receipt form topbar .
 * @returns {JSX.Element}
 */
export default function ReceiptFormTopBar() {
  // Features guard.
  const { featureCan } = useFeatureCan();

  // Sets the primary warehouse to form.
  useSetPrimaryWarehouseToForm();

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();

  // Can't display the navigation bar if warehouses or branches feature is not enabled.
  if (!featureCan(Features.Warehouses) && !featureCan(Features.Branches)) {
    return null;
  }

  return (
    <FormTopbar>
      <NavbarGroup align={Alignment.LEFT}>
        <FeatureCan feature={Features.Branches}>
          <ReceiptFormSelectBranch />
        </FeatureCan>
        {featureCan(Features.Warehouses) && featureCan(Features.Branches) && (
          <NavbarDivider />
        )}
        <FeatureCan feature={Features.Warehouses}>
          <ReceiptFormSelectWarehouse />
        </FeatureCan>
      </NavbarGroup>
    </FormTopbar>
  );
}

/**
 * Receipt select branch.
 * @returns
 */
function ReceiptFormSelectBranch() {
  // Receipt form context.
  const { branches, isBranchesLoading } = useReceiptFormContext();

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

/**
 * Receipt select warehouse.
 * @returns
 */
function ReceiptFormSelectWarehouse() {
  // Receipt form context.
  const { warehouses, isWarehouesLoading } = useReceiptFormContext();

  return isWarehouesLoading ? (
    <DetailsBarSkeletonBase className={Classes.SKELETON} />
  ) : (
    <WarehouseSelect
      name={'warehouse_id'}
      warehouses={warehouses}
      input={FormWarehouseSelectButton}
      popoverProps={{ minimal: true }}
      fill={false}
    />
  );
}
