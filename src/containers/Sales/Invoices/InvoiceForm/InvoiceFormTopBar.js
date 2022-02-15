import React from 'react';
import {
  Alignment,
  Navbar,
  NavbarGroup,
  NavbarDivider,
  Button,
} from '@blueprintjs/core';
import intl from 'react-intl-universal';

import { useFeatureCan } from 'hooks/state';
import { Icon, BranchSelect, FeatureCan, WarehouseSelect } from 'components';
import { useInvoiceFormContext } from './InvoiceFormProvider';
import { Features } from 'common';

/**
 * Invoice form topbar .
 * @returns {JSX.Element}
 */
export default function InvoiceFormTopBar() {
  // Invoice form context.
  const { branches, warehouses } = useInvoiceFormContext();

  // Features guard.
  const { featureCan } = useFeatureCan();

  // Can't display the navigation bar if warehouses or branches feature is not enabled.
  if (!featureCan(Features.Warehouses) || !featureCan(Features.Branches)) {
    return null;
  }
  return (
    <Navbar className={'navbar--dashboard-topbar'}>
      <NavbarGroup align={Alignment.LEFT}>
        <FeatureCan feature={Features.Warehouses}>
          <BranchSelect
            name={'branch_id'}
            branches={branches}
            input={InvoiceBranchSelectButton}
            popoverProps={{
              minimal: true,
            }}
          />
        </FeatureCan>

        {featureCan(Features.Warehouses) && featureCan(Features.Branches) && (
          <NavbarDivider />
        )}
        <FeatureCan feature={Features.Warehouses}>
          <WarehouseSelect
            name={'warehouse_id'}
            warehouses={warehouses}
            input={InvoiceWarehouseSelectButton}
            popoverProps={{
              minimal: true,
            }}
          />
        </FeatureCan>
      </NavbarGroup>
    </Navbar>
  );
}

function InvoiceWarehouseSelectButton({ label }) {
  return (
    <Button
      text={intl.get('invoice.branch_button.label', { label })}
      minimal={true}
      small={true}
      icon={<Icon icon={'warehouse-16'} iconSize={16} />}
    />
  );
}

function InvoiceBranchSelectButton({ label }) {
  return (
    <Button
      text={intl.get('invoice.warehouse_button.label', { label })}
      minimal={true}
      small={true}
      icon={<Icon icon={'branch-16'} iconSize={16} />}
    />
  );
}
