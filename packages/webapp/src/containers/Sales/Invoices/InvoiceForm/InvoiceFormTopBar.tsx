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
import { useInvoiceFormContext } from './InvoiceFormProvider';
import { useFeatureCan } from '@/hooks/state';
import {
  Icon,
  BranchSelect,
  FeatureCan,
  WarehouseSelect,
  FormTopbar,
} from '@/components';

/**
 * Invoice form topbar .
 * @returns {JSX.Element}
 */
export default function InvoiceFormTopBar() {
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
          <InvoiceFormSelectBranch />
        </FeatureCan>
        {featureCan(Features.Warehouses) && featureCan(Features.Branches) && (
          <NavbarDivider />
        )}
        <FeatureCan feature={Features.Warehouses}>
          <InvoiceFormSelectWarehouse />
        </FeatureCan>
      </NavbarGroup>
    </FormTopbar>
  );
}

function InvoiceFormSelectBranch() {
  // Invoice form context.
  const { branches, isBranchesLoading } = useInvoiceFormContext();

  return isBranchesLoading ? (
    <DetailsBarSkeletonBase className={Classes.SKELETON} />
  ) : (
    <BranchSelect
      name={'branch_id'}
      branches={branches}
      input={InvoiceBranchSelectButton}
      popoverProps={{ minimal: true }}
    />
  );
}

function InvoiceFormSelectWarehouse() {
  // Invoice form context.
  const { warehouses, isWarehousesLoading } = useInvoiceFormContext();

  return isWarehousesLoading ? (
    <DetailsBarSkeletonBase className={Classes.SKELETON} />
  ) : (
    <WarehouseSelect
      name={'warehouse_id'}
      warehouses={warehouses}
      input={InvoiceWarehouseSelectButton}
      popoverProps={{ minimal: true }}
    />
  );
}

function InvoiceWarehouseSelectButton({ label }) {
  return (
    <Button
      text={intl.get('invoice.warehouse_button.label', { label })}
      minimal={true}
      small={true}
      icon={<Icon icon={'warehouse-16'} iconSize={16} />}
    />
  );
}

function InvoiceBranchSelectButton({ label }) {
  return (
    <Button
      text={intl.get('invoice.branch_button.label', { label })}
      minimal={true}
      small={true}
      icon={<Icon icon={'branch-16'} iconSize={16} />}
    />
  );
}

const DetailsBarSkeletonBase = styled.div`
  letter-spacing: 10px;
  margin-right: 10px;
  margin-left: 10px;
  font-size: 8px;
  width: 140px;
  height: 10px;
`;
