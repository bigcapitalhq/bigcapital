// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import {
  Alignment,
  NavbarGroup,
  NavbarDivider,
  Button,
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
  Icon,
  BranchSelect,
  FeatureCan,
  WarehouseSelect,
  FormTopbar,
  DetailsBarSkeletonBase,
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
      input={ReceiptBranchSelectButton}
      popoverProps={{ minimal: true }}
    />
  );
}

/**
 * Receipt select warehouse.
 * @returns
 */
function ReceiptFormSelectWarehouse() {
  // Receipt form context.
  const { warehouses, isWarehousesLoading } = useReceiptFormContext();

  return isWarehousesLoading ? (
    <DetailsBarSkeletonBase className={Classes.SKELETON} />
  ) : (
    <WarehouseSelect
      name={'warehouse_id'}
      warehouses={warehouses}
      input={ReceiptWarehouseSelectButton}
      popoverProps={{ minimal: true }}
    />
  );
}

function ReceiptBranchSelectButton({ label }) {
  return (
    <Button
      text={intl.get('receipt.branch_button.label', { label })}
      minimal={true}
      small={true}
      icon={<Icon icon={'branch-16'} iconSize={16} />}
    />
  );
}

function ReceiptWarehouseSelectButton({ label }) {
  return (
    <Button
      text={intl.get('receipt.warehouse_button.label', { label })}
      minimal={true}
      small={true}
      icon={<Icon icon={'warehouse-16'} iconSize={16} />}
    />
  );
}
