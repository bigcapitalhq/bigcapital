import React from 'react';
import {
  NavbarDivider,
  NavbarGroup,
  Classes,
  Button,
  Popover,
  PopoverInteractionKind,
  Position,
} from "@blueprintjs/core";
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';

import DashboardActionsBar from "components/Dashboard/DashboardActionsBar";
import FilterDropdown from 'components/FilterDropdown';
import Icon from 'components/Icon';
import { If } from 'components';

import withReceivableAging from './withReceivableAgingSummary';
import withReceivableAgingActions from './withReceivableAgingSummaryActions';

import { compose } from 'utils';


function ReceivableAgingSummaryActionsBar({
  // #withReceivableAging
  receivableAgingFilter,
  
  // #withReceivableAgingActions
  toggleFilterReceivableAgingSummary,
  refreshReceivableAgingSummary,
}) {
  const filterDropdown = FilterDropdown({
    fields: [],
    onFilterChange: (filterConditions) => {},
  });

  const handleFilterToggleClick = () => {
    toggleFilterReceivableAgingSummary();
  };

  const handleRecalcReport = () => {
    refreshReceivableAgingSummary(true);
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
          icon={<Icon icon="refresh-16" iconSize={16} />}
          onClick={handleRecalcReport}
        />

        <If condition={receivableAgingFilter}>
          <Button
            className={Classes.MINIMAL}
            text={<T id={'hide_filter'} />}
            onClick={handleFilterToggleClick}
            icon={<Icon icon="arrow-to-top" />}
          />
        </If>

        <If condition={!receivableAgingFilter}>
          <Button
            className={Classes.MINIMAL}
            text={<T id={'show_filter'} />}
            onClick={handleFilterToggleClick}
            icon={<Icon icon="arrow-to-bottom" />}
          />
        </If>

        <Popover
          content={filterDropdown}
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
  )
}

export default compose(
  withReceivableAgingActions,
  withReceivableAging(({ receivableAgingSummaryFilter }) => ({
    receivableAgingFilter: receivableAgingSummaryFilter,
  })),
)(ReceivableAgingSummaryActionsBar)