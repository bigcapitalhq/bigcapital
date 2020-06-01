import React, { useCallback, useState, useMemo } from 'react';
import {
  NavbarGroup,
  NavbarDivider,
  Button,
  Classes,
  Intent,
  Popover,
  Position,
  PopoverInteractionKind,
} from '@blueprintjs/core';
import classNames from 'classnames';
import Icon from 'components/Icon';
import { connect } from 'react-redux';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import withDialog from 'connectors/Dialog.connector';

import FilterDropdown from 'components/FilterDropdown';
import withResourceDetail from 'containers/Resources/withResourceDetails';

import { compose } from 'utils';
import { FormattedMessage as T, useIntl } from 'react-intl';

function ExchangeRateActionsBar({
  // #withDialog.
  openDialog,

  // #withResourceDetail
  resourceFields,

  // #ownProps
  selectedRows = [],
  onDeleteExchangeRate,
  onFilterChanged,
  onBulkDelete,
}) {
  const [filterCount, setFilterCount] = useState(0);
  const { formatMessage } = useIntl();

  const onClickNewExchangeRate = () => {
    openDialog('exchangeRate-form', {});
  };

  const filterDropdown = FilterDropdown({
    fields: resourceFields,
    onFilterChange: (filterConditions) => {
      setFilterCount(filterConditions.length || 0);

      onFilterChanged && onFilterChanged(filterConditions);
    },
  });

  // const handelDeleteExchangeRate = useCallback(
  //   (exchangeRate) => {
  //     onDeleteExchangeRate(exchangeRate);
  //   },
  //   [selectedRows, onDeleteExchangeRate]
  // );

  const hasSelectedRows = useMemo(() => selectedRows.length > 0, [
    selectedRows,
  ]);

  const handelBulkDelete = useCallback(() => {
    onBulkDelete && onBulkDelete(selectedRows.map((r) => r.id));
  }, [onBulkDelete, selectedRows]);

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="plus" />}
          text={<T id={'new_exchange_rate'} />}
          onClick={onClickNewExchangeRate}
        />
        <NavbarDivider />

        <Popover
          minimal={true}
          content={filterDropdown}
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
            icon={<Icon icon="filter-16" iconSize={16} />}
          />
        </Popover>

        {hasSelectedRows && (
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handelBulkDelete}
          />
        )}
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-import-16" iconSize={16} />}
          text={<T id={'import'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

const mapStateToProps = (state, props) => ({
  resourceName: 'exchange_rates',
});

const withExchangeRateActionBar = connect(mapStateToProps);

export default compose(
  withExchangeRateActionBar,
  withDialog,
  withResourceDetail(({ resourceFields }) => ({
    resourceFields,
  })),
)(ExchangeRateActionsBar);
