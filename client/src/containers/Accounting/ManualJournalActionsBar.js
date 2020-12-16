import React, { useMemo, useState, useCallback } from 'react';
import Icon from 'components/Icon';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  MenuItem,
  Menu,
  Popover,
  PopoverInteractionKind,
  Position,
  Intent,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { FormattedMessage as T } from 'react-intl';
import { connect } from 'react-redux';

import FilterDropdown from 'components/FilterDropdown';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { If, DashboardActionViewsList } from 'components';

import withResourceDetail from 'containers/Resources/withResourceDetails';
import withManualJournals from 'containers/Accounting/withManualJournals';
import withManualJournalsActions from 'containers/Accounting/withManualJournalsActions';

import { compose } from 'utils';

/**
 * Manual journal actions bar.
 */
function ManualJournalActionsBar({
  // #withResourceDetail
  resourceFields,

  // #withManualJournals
  manualJournalsViews,

  // #withManualJournalsActions
  addManualJournalsTableQueries,
  changeManualJournalCurrentView,

  onFilterChanged,
  selectedRows = [],
  onBulkDelete,
}) {
  const [filterCount, setFilterCount] = useState(0);
  const history = useHistory();

  const onClickNewManualJournal = useCallback(() => {
    history.push('/make-journal-entry');
  }, [history]);

  const filterDropdown = FilterDropdown({
    fields: resourceFields,
    initialCondition: {
      fieldKey: 'journal_number',
      compatator: 'contains',
      value: '',
    },
    onFilterChange: (filterConditions) => {
      setFilterCount(filterConditions.length || 0);
      addManualJournalsTableQueries({
        filter_roles: filterConditions || '',
      });
      onFilterChanged && onFilterChanged(filterConditions);
    },
  });
  const hasSelectedRows = useMemo(() => selectedRows.length > 0, [
    selectedRows,
  ]);

  // Handle delete button click.
  const handleBulkDelete = useCallback(() => {
    onBulkDelete && onBulkDelete(selectedRows.map((r) => r.id));
  }, [onBulkDelete, selectedRows]);

  const handleTabChange = (viewId) => {
    changeManualJournalCurrentView(viewId.id || -1);
    addManualJournalsTableQueries({
      custom_view_id: viewId.id || null,
    });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'manual-journals'}
          views={manualJournalsViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="plus" />}
          text={<T id={'journal_entry'} />}
          onClick={onClickNewManualJournal}
        />
        <Popover
          minimal={true}
          content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter', {
              'has-active-filters': filterCount > 0,
            })}
            text="Filter"
            icon={<Icon icon="filter-16" iconSize={16} />}
          />
        </Popover>

        <If condition={hasSelectedRows}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleBulkDelete}
          />
        </If>

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
        />
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
  resourceName: 'manual_journals',
});

const withManualJournalsActionsBar = connect(mapStateToProps);

export default compose(
  withManualJournalsActionsBar,
  withDialogActions,
  withResourceDetail(({ resourceFields }) => ({
    resourceFields,
  })),
  withManualJournals(({ manualJournalsViews }) => ({
    manualJournalsViews,
  })),
  withManualJournalsActions,
)(ManualJournalActionsBar);
