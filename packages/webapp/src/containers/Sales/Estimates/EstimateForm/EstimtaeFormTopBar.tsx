// @ts-nocheck
import React from 'react';
import {
  Alignment,
  NavbarGroup,
  NavbarDivider,
  Classes,
} from '@blueprintjs/core';
import {
  useSetPrimaryBranchToForm,
  useSetPrimaryWarehouseToForm,
} from './utils';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import {
  BranchSelect,
  FeatureCan,
  WarehouseSelect,
  FormTopbar,
  DetailsBarSkeletonBase,
  FormWarehouseSelectButton,
  FormBranchSelectButton,
} from '@/components';
import { useEstimateFormContext } from './EstimateFormProvider';

/**
 * Estimate form topbar .
 * @returns {JSX.Element}
 */
export default function EstimtaeFormTopBar() {
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
          <EstimateFormSelectBranch />
        </FeatureCan>
        {featureCan(Features.Warehouses) && featureCan(Features.Branches) && (
          <NavbarDivider />
        )}
        <FeatureCan feature={Features.Warehouses}>
          <EstimateFormSelectWarehouse />
        </FeatureCan>
      </NavbarGroup>
    </FormTopbar>
  );
}

function EstimateFormSelectBranch() {
  // Estimate form context.
  const { branches, isBranchesLoading } = useEstimateFormContext();

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

function EstimateFormSelectWarehouse() {
  // Estimate form context.
  const { warehouses, isWarehouesLoading } = useEstimateFormContext();

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
