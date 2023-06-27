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
import { useVendorCreditNoteFormContext } from './VendorCreditNoteFormProvider';
import { Features } from '@/constants';

/**
 * Vendor Credit note form topbar .
 * @returns {JSX.Element}
 */
export default function VendorCreditNoteFormTopBar() {
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
          <VendorCreditNoteFormSelectBranch />
        </FeatureCan>
        {featureCan(Features.Warehouses) && featureCan(Features.Branches) && (
          <NavbarDivider />
        )}
        <FeatureCan feature={Features.Warehouses}>
          <VendorCreditFormSelectWarehouse />
        </FeatureCan>
      </NavbarGroup>
    </FormTopbar>
  );
}

function VendorCreditNoteFormSelectBranch() {
  //  Vendor credit note form context.
  const { branches, isBranchesLoading } = useVendorCreditNoteFormContext();

  return isBranchesLoading ? (
    <DetailsBarSkeletonBase className={Classes.SKELETON} />
  ) : (
    <BranchSelect
      name={'branch_id'}
      branches={branches}
      input={VendorCreditNoteBranchSelectButton}
      popoverProps={{ minimal: true }}
    />
  );
}

function VendorCreditFormSelectWarehouse() {
  // vendor credit note form context.
  const { warehouses, isWarehousesLoading } = useVendorCreditNoteFormContext();

  return isWarehousesLoading ? (
    <DetailsBarSkeletonBase className={Classes.SKELETON} />
  ) : (
    <WarehouseSelect
      name={'warehouse_id'}
      warehouses={warehouses}
      input={VendorCreditNoteWarehouseSelectButton}
      popoverProps={{ minimal: true }}
    />
  );
}

function VendorCreditNoteWarehouseSelectButton({ label }) {
  return (
    <Button
      text={intl.get('vendor_credit.warehouse_button.label', { label })}
      minimal={true}
      small={true}
      icon={<Icon icon={'warehouse-16'} iconSize={16} />}
    />
  );
}

function VendorCreditNoteBranchSelectButton({ label }) {
  return (
    <Button
      text={intl.get('vendor_credit.branch_button.label', { label })}
      minimal={true}
      small={true}
      icon={<Icon icon={'branch-16'} iconSize={16} />}
    />
  );
}
