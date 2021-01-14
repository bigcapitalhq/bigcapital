import React from 'react';
import {
  NavbarDivider,
  NavbarGroup,
  Classes,
  Button,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import Icon from 'components/Icon';

import withARAgingSummary from './withARAgingSummary';
import withARAgingSummaryActions from './withARAgingSummaryActions';

import { compose } from 'utils';

/**
 * AR Aging summary sheet - Actions bar.
 */
function ARAgingSummaryActionsBar({
  // #withReceivableAging
  receivableAgingFilter,

  // #withReceivableAgingActions
  toggleFilterARAgingSummary,
  refreshARAgingSummary,
}) {
  const handleFilterToggleClick = () => {
    toggleFilterARAgingSummary();
  };
  // Handles re-calculate report button.
  const handleRecalcReport = () => {
    refreshARAgingSummary(true);
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={classNames(Classes.MINIMAL, 'button--gray-highlight')}
          text={<T id={'recalc_report'} />}
          onClick={handleRecalcReport}
          icon={<Icon icon="refresh-16" iconSize={16} />}
        />
        <NavbarDivider />

        <Button
          className={classNames(Classes.MINIMAL, 'button--table-views')}
          icon={<Icon icon="cog-16" iconSize={16} />}
          text={
            receivableAgingFilter ? (
              <T id="hide_customizer" />
            ) : (
              <T id={'customize_report'} />
            )
          }
          onClick={handleFilterToggleClick}
          active={receivableAgingFilter}
        />
        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          text={<T id={'filter'} />}
          icon={<Icon icon="filter-16" iconSize={16} />}
        />        
        <NavbarDivider />

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
  withARAgingSummaryActions,
  withARAgingSummary(({ receivableAgingSummaryFilter }) => ({
    receivableAgingFilter: receivableAgingSummaryFilter,
  })),
)(ARAgingSummaryActionsBar);
