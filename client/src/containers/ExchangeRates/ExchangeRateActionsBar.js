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
  Alignment,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';

import { If } from 'components';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import Icon from 'components/Icon';
import FilterDropdown from 'components/FilterDropdown';

import { useRefreshExchangeRate } from 'hooks/query/exchangeRates';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withResourceDetail from 'containers/Resources/withResourceDetails';
import withExchangeRatesActions from './withExchangeRatesActions';
import { compose } from 'utils';

/**
 * Exchange rate actions bar.
 */
function ExchangeRateActionsBar({
  // #withDialogActions.
  openDialog,

  // #withResourceDetail
  resourceFields,

  //#withExchangeRatesActions
  addExchangeRatesTableQueries,

  // #ownProps
  selectedRows = [],
  onDeleteExchangeRate,
  onFilterChanged,
  onBulkDelete,
}) {
  const [filterCount, setFilterCount] = useState(0);

  const onClickNewExchangeRate = () => {
    openDialog('exchangeRate-form', {});
  };

  // Exchange rates refresh action.
  const { refresh } = useRefreshExchangeRate();

  // Handle click a refresh sale estimates
  const handleRefreshBtnClick = () => {
    refresh();
  };

  const hasSelectedRows = useMemo(
    () => selectedRows.length > 0,
    [selectedRows],
  );

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
                `${filterCount} ${intl.get('filters_applied')}`
              )
            }
            icon={<Icon icon="filter-16" iconSize={16} />}
          />
        </Popover>

        <If condition={hasSelectedRows}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handelBulkDelete}
          />
        </If>

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
      <NavbarGroup align={Alignment.RIGHT}>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="refresh-16" iconSize={14} />}
          onClick={handleRefreshBtnClick}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

const mapStateToProps = (state, props) => ({
  resourceName: '',
});

const withExchangeRateActionBar = connect(mapStateToProps);

export default compose(
  withExchangeRateActionBar,
  withDialogActions,
  withResourceDetail(({ resourceFields }) => ({
    resourceFields,
  })),
  withExchangeRatesActions,
)(ExchangeRateActionsBar);
