import React, { useCallback, useState, useMemo } from 'react';
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
import { FormattedMessage as T, useIntl } from 'react-intl';

import { connect } from 'react-redux';
import { If, DashboardActionViewsList } from 'components';
import FilterDropdown from 'components/FilterDropdown';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import withResourceDetail from 'containers/Resources/withResourceDetails';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withReceiptActions from './withReceiptActions';
import withReceipts from './withReceipts';

import { compose } from 'utils';

function ReceiptActionsBar({
  // #withResourceDetail
  resourceFields,

  //#withReceipts
  receiptview,
  //#withReceiptActions
  addReceiptsTableQueries,
  changeReceiptView,

  //#OWn Props
  onFilterChanged,
  selectedRows = [],
}) {
  const history = useHistory();
  const [filterCount, setFilterCount] = useState(0);
  const { formatMessage } = useIntl();

  const onClickNewReceipt = useCallback(() => {
    history.push('/receipts/new');
  }, [history]);

  const hasSelectedRows = useMemo(() => selectedRows.length > 0, [
    selectedRows,
  ]);

  const handleTabChange = (viewId) => {
    changeReceiptView(viewId.id || -1);
    addReceiptsTableQueries({
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
  //     addReceiptsTableQueries({
  //       filter_roles: filterConditions || '',
  //     });
  //     onFilterChanged && onFilterChange(filterConditions);
  //   },
  // });

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'receipts'}
          views={receiptview}
          onChange={handleTabChange}
        />

        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'plus'} />}
          text={<T id={'new_receipt'} />}
          onClick={onClickNewReceipt}
        />
        <Popover
          minimal={true}
          // content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
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
  resourceName: 'sales_receipts',
});

const withReceiptActionsBar = connect(mapStateToProps);

export default compose(
  withReceiptActionsBar,
  withResourceDetail(({ resourceFields }) => ({
    resourceFields,
  })),
  withReceipts(({ receiptview }) => ({
    receiptview,
  })),
  withReceiptActions,
)(ReceiptActionsBar);
