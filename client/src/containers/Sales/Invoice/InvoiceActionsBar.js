import React, { useCallback, useState, useMemo } from 'react';
import Icon from 'components/Icon';
import {
  Button,
  Classes,
  Popover,
  NavbarDivider,
  NavbarGroup,
  PopoverInteractionKind,
  Position,
  Intent,
} from '@blueprintjs/core';

import classNames from 'classnames';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { FormattedMessage as T, useIntl } from 'react-intl';

import { connect } from 'react-redux';
import FilterDropdown from 'components/FilterDropdown';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import { If, DashboardActionViewsList } from 'components';

import withResourceDetail from 'containers/Resources/withResourceDetails';
import withDialogActions from 'containers/Dialog/withDialogActions';

import withInvoiceActions from './withInvoiceActions';
import withInvoices from './withInvoices';

import { compose } from 'utils';

function InvoiceActionsBar({
  // #withResourceDetail
  resourceFields,

  //#withInvoice
  invoicesViews,

  // #withInvoiceActions
  addInvoiceTableQueries,
  changeInvoiceView,
  // #own Porps
  onFilterChanged,
  selectedRows = [],
}) {
  const history = useHistory();
  const [filterCount, setFilterCount] = useState(0);
  const { formatMessage } = useIntl();

  const handleClickNewInvoice = useCallback(() => {
    history.push('/invoices/new');
  }, [history]);

  const hasSelectedRows = useMemo(() => selectedRows.length > 0, [
    selectedRows,
  ]);

  const handleTabChange = (viewId) => {
    changeInvoiceView(viewId.id || -1);
    addInvoiceTableQueries({
      custom_view_id: viewId.id || null,
    });
  };

  // const filterDropdown = FilterDropdown({
  //   initialCondition: {
  //     fieldKey: '',
  //     compatator: '',
  //     value: '',
  //   },
  //   fields: resourceFields,
  //   onFilterChange: (filterConditions) => {
  //     addInvoiceTableQueries({
  //       filter_roles: filterConditions || '',
  //     });
  //     onFilterChanged && onFilterChanged(filterConditions);
  //   },
  // });

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'invoices'}
          views={invoicesViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'plus'} />}
          text={<T id={'new_invoice'} />}
          onClick={handleClickNewInvoice}
        />
        <Popover
          minimal={true}
          // content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL)}
            text={
              filterCount <= 0 ? (
                <T id={'filter'} />
              ) : (
                `${filterCount} ${formatMessage({ id: 'filters_applied' })}`
              )
            }
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
  resourceName: 'sales_invoices',
});
const withInvoiceActionsBar = connect(mapStateToProps);

export default compose(
  withInvoiceActionsBar,
  withResourceDetail(({ resourceFields }) => ({
    resourceFields,
  })),
  withInvoices(({ invoicesViews }) => ({
    invoicesViews,
  })),
  withInvoiceActions,
)(InvoiceActionsBar);
