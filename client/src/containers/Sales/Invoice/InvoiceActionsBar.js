import React, { useMemo, useCallback } from 'react';
import Icon from 'components/Icon';
import {
  Button,
  Classes,
  Menu,
  MenuItem,
  Popover,
  NavbarDivider,
  NavbarGroup,
  PopoverInteractionKind,
  Position,
  Intent,
} from '@blueprintjs/core';

import classNames from 'classnames';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { FormattedMessage as T } from 'react-intl';

import { If } from 'components';
import FilterDropdown from 'components/FilterDropdown';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import withResourceDetail from 'containers/Resources/withResourceDetails';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withInvoiceActions from './withInvoices';

import { compose } from 'utils';
import { connect } from 'react-redux';

function InvoiceActionsBar({
  // #withResourceDetail
  resourceFields,

  //#withInvoice
  InvoiceViews,

  // #withInvoiceActions
  addInvoiceTableQueries,

  // #own Porps
  onFilterChanged,
  selectedRows,
}) {
  const history = useHistory();

  const FilterDropdown = FilterDropdown({
    initialCondition: {
      fieldKey: '',
      compatator: '',
      value: '',
    },
    fields: resourceFields,
    onFilterChange: (filterConditions) => {
      addInvoiceTableQueries({
        filter_roles: filterConditions || '',
      });
      onFilterChanged && onFilterChanged(filterConditions);
    },
  });

  const hasSelectedRows = useMemo(() => selectedRows.length > 0, [
    selectedRows,
  ]);

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'plus'} />}
          text={<T id={'new_invoice'} />}
          onClick={onClickNewInvoice}
        />
        <Popover
          minimal={true}
          content={FilterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL)}
            text={'Filter'}
            icon={<Icon icon={'filter-16'} iconSize={16} />}
          />
        </Popover>
        <If condition={hasSelectedRows}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            // onClick={handleBulkDelete}
          />
        </If>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'print-16'} iconSize={'16'} />}
          text={<T id={'print'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-import-16'} />}
          text={<T id={'import'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-export-16'} iconSize={'16'} />}
          text={<T id={'export'} />}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

const mapStateToProps = (state, props) => ({
  resourceName: 'invoice',
});

const withInvoiceActionsBar = connect(mapStateToProps);

export default compose(
  withInvoiceActionsBar,
  withDialogActions,
  withResourceDetail(({ resourceFields }) => ({
    resourceFields,
  })),
  // withInvoices(({ invoiceViews }) => ({
  //   invoiceViews,
  // })),
  withInvoiceActions,
)(InvoiceActionsBar);
