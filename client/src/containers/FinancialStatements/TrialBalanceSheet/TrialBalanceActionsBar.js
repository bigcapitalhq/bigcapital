import React from 'react';
import { NavbarGroup, Button, Classes, NavbarDivider } from '@blueprintjs/core';
import Icon from 'components/Icon';
import { FormattedMessage as T } from 'react-intl';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import classNames from 'classnames';
// import FilterDropdown from 'components/FilterDropdown';

import { If } from 'components';

import withTrialBalance from './withTrialBalance';
import withTrialBalanceActions from './withTrialBalanceActions';
import { compose } from 'utils';


function TrialBalanceActionsBar({

  // #withTrialBalance
  trialBalanceSheetFilter,

  // #withTrialBalanceActions
  toggleTrialBalanceFilter,
}) {

  const handleFilterToggleClick = () => {
    toggleTrialBalanceFilter();
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

        <If condition={trialBalanceSheetFilter}>
          <Button
            className={Classes.MINIMAL}
            text={<T id={'hide_filter'} />}
            icon={<Icon icon="arrow-to-top" />}
            onClick={handleFilterToggleClick}
          />
        </If>

        <If condition={!trialBalanceSheetFilter}>
          <Button
            className={Classes.MINIMAL}
            text={<T id={'show_filter'} />}
            icon={<Icon icon="arrow-to-bottom" />}
            onClick={handleFilterToggleClick}
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
  withTrialBalance(({ trialBalanceSheetFilter }) => ({ trialBalanceSheetFilter })),
  withTrialBalanceActions
)(TrialBalanceActionsBar);