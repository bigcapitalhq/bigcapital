import React from 'react';
import { NavbarGroup, Button, Classes, NavbarDivider } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';

import Icon from 'components/Icon';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import { If } from 'components';
import withProfitLossActions from './withProfitLossActions';
import withProfitLoss from './withProfitLoss';

import { compose } from 'utils';


function ProfitLossActionsBar({
  // #withProfitLoss
  profitLossSheetFilter,

  // #withProfitLossActions
  toggleProfitLossSheetFilter,
  refreshProfitLossSheet,
}) {
  const handleFilterClick = () => {
    toggleProfitLossSheetFilter();
  };

  const handleRecalcReport = () => {
    refreshProfitLossSheet(true);
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
          text={'Re-calc Report'}
          onClick={handleRecalcReport}
          icon={<Icon icon="refresh-16" iconSize={16} />}
        />

        <If condition={profitLossSheetFilter}>
          <Button
            className={Classes.MINIMAL}
            text={<T id={'hide_filter'} />}
            icon={<Icon icon="arrow-to-top" />}
            onClick={handleFilterClick}
          />
        </If>

        <If condition={!profitLossSheetFilter}>
          <Button
            className={Classes.MINIMAL}
            text={<T id={'show_filter'} />}
            icon={<Icon icon="arrow-to-bottom" />}
            onClick={handleFilterClick}
          />
        </If>

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
  withProfitLoss(({ profitLossSheetFilter }) => ({ profitLossSheetFilter })),
  withProfitLossActions,
)(ProfitLossActionsBar);
