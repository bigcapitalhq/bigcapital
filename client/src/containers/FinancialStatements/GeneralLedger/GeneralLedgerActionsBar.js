import React from 'react';
import {
  NavbarGroup,
  Button,
  Classes,
  NavbarDivider,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import Icon from 'components/Icon';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar'
import { If } from 'components';
import classNames from 'classnames';
import FilterDropdown from 'components/FilterDropdown';

import withGeneralLedger from './withGeneralLedger';
import withGeneralLedgerActions from './withGeneralLedgerActions';

import { compose } from 'utils';

/**
 * General ledger actions bar.
 */
function GeneralLedgerActionsBar({
  // #withGeneralLedger
  generalLedgerSheetFilter,

  // #withGeneralLedgerActions
  toggleGeneralLedgerSheetFilter,
  refreshGeneralLedgerSheet
}) {
  const filterDropdown = FilterDropdown({
    fields: [],
    onFilterChange: (filterConditions) => {
      
    },
  });

  const handleFilterClick = () => {
    toggleGeneralLedgerSheetFilter();
  };

  const handleRecalcReport = () => {
    refreshGeneralLedgerSheet(true);
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={classNames(Classes.MINIMAL, 'button--table-views')}
          icon={<Icon icon='cog-16' iconSize={16} />}
          text={<T id={'customize_report'}/>}
        />

        <NavbarDivider />

        <Button
          className={classNames(
            Classes.MINIMAL,
            'button--gray-highlight',
          )}
          text={'Re-calc Report'}
          onClick={handleRecalcReport}
          icon={<Icon icon="refresh-16" iconSize={16} />}
        />

        <If condition={generalLedgerSheetFilter}>
          <Button
            className={Classes.MINIMAL}
            text={<T id={'hide_filter'} />}
            icon={<Icon icon="arrow-to-top" />}
            onClick={handleFilterClick}
          />
        </If>

        <If condition={!generalLedgerSheetFilter}>
          <Button
            className={Classes.MINIMAL}
            text={<T id={'show_filter'} />}
            icon={<Icon icon="arrow-to-bottom" />}
            onClick={handleFilterClick}
          />
        </If>

        <Popover
          content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}>

          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={<T id={'filter'}/>}
            icon={<Icon icon="filter-16" iconSize={16} /> } />
        </Popover>

        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='print-16' iconSize={16} />}
          text={<T id={'print'}/>}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='file-export-16' iconSize={16} />}
          text={<T id={'export'}/>}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withGeneralLedger(({ generalLedgerSheetFilter }) => ({ generalLedgerSheetFilter })),
  withGeneralLedgerActions,
)(GeneralLedgerActionsBar);