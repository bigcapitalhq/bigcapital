import React, { useCallback, useState, useMemo } from 'react';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import { compose } from 'utils';
import {
  NavbarGroup,
  Button,
  Classes,
  Intent,
  Popover,
  Position,
  PopoverInteractionKind,
} from '@blueprintjs/core';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Icon from 'components/Icon';
import DashboardConnect from 'connectors/Dashboard.connector';
import FilterDropdown from 'components/FilterDropdown';
import  ExchangeRatesDialogConnect from 'connectors/ExchangeRatesFromDialog.connect';
import withResourceDetail from 'containers/Resources/withResourceDetails';
import { FormattedMessage as T, useIntl } from 'react-intl';


function ExchangeRateActionsBar({
  openDialog,
  onDeleteExchangeRate,
  onFilterChanged,
  resourceFields,
  selectedRows = [],
}) {
  const onClickNewExchangeRate = useCallback(() => {
    openDialog('exchangeRate-form', {});
  }, [openDialog]);

  const handelDeleteExchangeRate = useCallback(
    (exchangeRate) => {
      onDeleteExchangeRate(exchangeRate);
    },
    [selectedRows, onDeleteExchangeRate]
  );
  const [filterCount, setFilterCount] = useState(0);
  const hasSelectedRows = useMemo(() => selectedRows.length > 0, [
    selectedRows,
  ]);

  const filterDropdown = FilterDropdown({
    fields: resourceFields,
    onFilterChange: (filterConditions) => {
      setFilterCount(filterConditions.length || 0);

      onFilterChanged && onFilterChanged(filterConditions);
    },
  });

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='plus' />}
          text={<T id={'new_exchange_rate'}/>}
          onClick={onClickNewExchangeRate}
        />
        <Popover
          minimal={true}
          content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={
              filterCount <= 0 ? <T id={'filter'}/> : `${filterCount} filters applied`
            }
            icon={<Icon icon='filter' />}
          />
        </Popover>
        {hasSelectedRows && (
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon='trash' iconSize={15} />}
            text={<T id={'delete'}/>}
            intent={Intent.DANGER}
            onClick={handelDeleteExchangeRate}
          />
        )}
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='file-import' />}
          text={<T id={'import'}/>}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='file-export' />}
          text={<T id={'export'}/>}
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
  DashboardConnect,
  ExchangeRatesDialogConnect,
  withResourceDetail
)(ExchangeRateActionsBar);
