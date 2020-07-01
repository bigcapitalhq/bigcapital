import React, { useState } from 'react';
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
import classNames from 'classnames';

import Icon from 'components/Icon';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import FilterDropdown from 'components/FilterDropdown';
import { If } from 'components';

import { compose } from 'utils';
import withBalanceSheetDetail from './withBalanceSheetDetail';
import withBalanceSheetActions from './withBalanceSheetActions';


function BalanceSheetActionsBar({
  // #withBalanceSheetDetail
  balanceSheetFilter,

  // #withBalanceSheetActions
  toggleBalanceSheetFilter,
  refreshBalanceSheet
}) {
  const handleFilterToggleClick = () => {
    toggleBalanceSheetFilter();
  };

  const handleRecalcReport = () => {
    refreshBalanceSheet(true);
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={classNames(Classes.MINIMAL, 'button--table-views')}
          icon={<Icon icon="cog-16" iconSize={16} />}
          text={<T id={'customize_report'} />}
        />
        <NavbarDivider />

        <Button
          className={classNames(
            Classes.MINIMAL,
            'button--gray-highlight',
          )}
          text={<T id={'recalc_report'} />}
          onClick={handleRecalcReport}
          icon={<Icon icon="refresh-16" iconSize={16} />}
        />

        <If condition={balanceSheetFilter}>
          <Button
            className={Classes.MINIMAL}
            text={<T id={'hide_filter'} />}
            onClick={handleFilterToggleClick}
            icon={<Icon icon="arrow-to-top" />}
          />
        </If>

        <If condition={!balanceSheetFilter}>
          <Button
            className={Classes.MINIMAL}
            text={<T id={'show_filter'} />}
            onClick={handleFilterToggleClick}
            icon={<Icon icon="arrow-to-bottom" />}
          />
        </If>

        <Popover
          // content={}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={<T id={'filter'} />}
            icon={<Icon icon="filter-16" iconSize={16} />}
          />
        </Popover>

        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='print-16' iconSize={16} />}
          text={<T id={'print'} />}
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

export default compose(
  withBalanceSheetDetail(({ balanceSheetFilter }) => ({ balanceSheetFilter })),
  withBalanceSheetActions,
)(BalanceSheetActionsBar);