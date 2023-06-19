// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import {
  Alignment,
  NavbarGroup,
  NavbarDivider,
  Button,
  Classes,
} from '@blueprintjs/core';
import {
  useSetPrimaryBranchToForm,
  useSetPrimaryWarehouseToForm,
} from './utils';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import {
  Icon,
  BranchSelect,
  FeatureCan,
  WarehouseSelect,
  FormTopbar,
  DetailsBarSkeletonBase,
} from '@/components';
import { useEstimateFormContext } from './EstimateFormProvider';

/**
 * Estimate form topbar .
 * @returns {JSX.Element}
 */
export default function EstimateFormTopBar() {
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
      input={EstimateBranchSelectButton}
      popoverProps={{ minimal: true }}
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
      input={EstimateWarehouseSelectButton}
      popoverProps={{ minimal: true }}
    />
  );
}

function EstimateWarehouseSelectButton({ label }) {
  return (
    <Button
      text={intl.get('estimate.warehouse_button.label', { label })}
      minimal={true}
      small={true}
      icon={<Icon icon={'warehouse-16'} iconSize={16} />}
    />
  );
}

function EstimateBranchSelectButton({ label }) {
  return (
    <Button
      text={intl.get('estimate.branch_button.label', { label })}
      minimal={true}
      small={true}
      icon={<Icon icon={'branch-16'} iconSize={16} />}
    />
  );
}
