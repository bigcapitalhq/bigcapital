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
import { useCreditNoteFormContext } from './CreditNoteFormProvider';

/**
 * Credit note form topbar .
 * @returns {JSX.Element}
 */
export default function CreditNoteFormTopbar() {
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
          <CreditNoteFormSelectBranch />
        </FeatureCan>
        {featureCan(Features.Warehouses) && featureCan(Features.Branches) && (
          <NavbarDivider />
        )}
        <FeatureCan feature={Features.Warehouses}>
          <CreditFormSelectWarehouse />
        </FeatureCan>
      </NavbarGroup>
    </FormTopbar>
  );
}

function CreditNoteFormSelectBranch() {
  // Credit note form context.
  const { branches, isBranchesLoading } = useCreditNoteFormContext();

  return isBranchesLoading ? (
    <DetailsBarSkeletonBase className={Classes.SKELETON} />
  ) : (
    <BranchSelect
      name={'branch_id'}
      branches={branches}
      input={CreditNoteBranchSelectButton}
      popoverProps={{ minimal: true }}
    />
  );
}

function CreditFormSelectWarehouse() {
  // Credit note form context.
  const { warehouses, isWarehousesLoading } = useCreditNoteFormContext();

  return isWarehousesLoading ? (
    <DetailsBarSkeletonBase className={Classes.SKELETON} />
  ) : (
    <WarehouseSelect
      name={'warehouse_id'}
      warehouses={warehouses}
      input={CreditNoteWarehouseSelectButton}
      popoverProps={{ minimal: true }}
    />
  );
}

function CreditNoteWarehouseSelectButton({ label }) {
  return (
    <Button
      text={intl.get('credit_note.warehouse_button.label', { label })}
      minimal={true}
      small={true}
      icon={<Icon icon={'warehouse-16'} iconSize={16} />}
    />
  );
}

function CreditNoteBranchSelectButton({ label }) {
  return (
    <Button
      text={intl.get('credit_note.branch_button.label', { label })}
      minimal={true}
      small={true}
      icon={<Icon icon={'branch-16'} iconSize={16} />}
    />
  );
}
