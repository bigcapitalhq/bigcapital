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
import classNames from 'classnames';
import { FormattedMessage as T } from 'react-intl';

import Icon from 'components/Icon';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import withTrialBalance from './withTrialBalance';
import withTrialBalanceActions from './withTrialBalanceActions';
import { compose } from 'utils';

function TrialBalanceActionsBar({
  // #withTrialBalance
  trialBalanceSheetFilter,

  // #withTrialBalanceActions
  toggleTrialBalanceFilter,
  refreshTrialBalance,
}) {
  const handleFilterToggleClick = () => {
    toggleTrialBalanceFilter();
  };

  const handleRecalcReport = () => {
    refreshTrialBalance(true);
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={classNames(Classes.MINIMAL, 'button--gray-highlight')}
          text={'Re-calc Report'}
          onClick={handleRecalcReport}
          icon={<Icon icon="refresh-16" iconSize={16} />}
        />
        <NavbarDivider />

        <Button
          className={classNames(Classes.MINIMAL, 'button--table-views')}
          icon={<Icon icon="cog-16" iconSize={16} />}
          text={
            trialBalanceSheetFilter ? (
              <T id={'hide_customizer'} />
            ) : (
              <T id={'customize_report'} />
            )
          }
          active={trialBalanceSheetFilter}
          onClick={handleFilterToggleClick}
        />
        <NavbarDivider />

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

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
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
  withTrialBalance(({ trialBalanceSheetFilter }) => ({
    trialBalanceSheetFilter,
  })),
  withTrialBalanceActions,
)(TrialBalanceActionsBar);
