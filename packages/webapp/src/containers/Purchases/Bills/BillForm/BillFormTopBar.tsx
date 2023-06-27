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
import { useFeatureCan } from '@/hooks/state';
import {
  Icon,
  BranchSelect,
  FeatureCan,
  WarehouseSelect,
  FormTopbar,
  DetailsBarSkeletonBase,
} from '@/components';
import { useBillFormContext } from './BillFormProvider';
import { Features } from '@/constants';

/**
 * Bill form topbar .
 * @returns {JSX.Element}
 */
export default function BillFormTopBar() {
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
          <BillFormSelectBranch />
        </FeatureCan>
        {featureCan(Features.Warehouses) && featureCan(Features.Branches) && (
          <NavbarDivider />
        )}
        <FeatureCan feature={Features.Warehouses}>
          <BillFormSelectWarehouse />
        </FeatureCan>
      </NavbarGroup>
    </FormTopbar>
  );
}

function BillFormSelectBranch() {
  // Bill form context.
  const { branches, isBranchesLoading } = useBillFormContext();

  return isBranchesLoading ? (
    <DetailsBarSkeletonBase className={Classes.SKELETON} />
  ) : (
    <BranchSelect
      name={'branch_id'}
      branches={branches}
      input={BillBranchSelectButton}
      popoverProps={{ minimal: true }}
    />
  );
}

function BillFormSelectWarehouse() {
  // Bill form context.
  const { warehouses, isWarehousesLoading } = useBillFormContext();

  return isWarehousesLoading ? (
    <DetailsBarSkeletonBase className={Classes.SKELETON} />
  ) : (
    <WarehouseSelect
      name={'warehouse_id'}
      warehouses={warehouses}
      input={BillWarehouseSelectButton}
      popoverProps={{ minimal: true }}
    />
  );
}

function BillWarehouseSelectButton({ label }) {
  return (
    <Button
      text={intl.get('bill.warehouse_button.label', { label })}
      minimal={true}
      small={true}
      icon={<Icon icon={'warehouse-16'} iconSize={16} />}
    />
  );
}

function BillBranchSelectButton({ label }) {
  return (
    <Button
      text={intl.get('bill.branch_button.label', { label })}
      minimal={true}
      small={true}
      icon={<Icon icon={'branch-16'} iconSize={16} />}
    />
  );
}
