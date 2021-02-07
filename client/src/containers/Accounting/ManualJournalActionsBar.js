import React from 'react';
import Icon from 'components/Icon';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Popover,
  PopoverInteractionKind,
  Position,
  Intent,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { FormattedMessage as T } from 'react-intl';
import { connect } from 'react-redux';

import { useManualJournalsContext } from 'containers/Accounting/ManualJournalsListProvider';
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
  // #withManualJournalsActions
  addManualJournalsTableQueries,
}) {
  const history = useHistory();
  const { journalsViews } = useManualJournalsContext();

  // Handle click a new manual journal.
  const onClickNewManualJournal = () => {
    history.push('/make-journal-entry');
  };

  // Handle delete button click.
  const handleBulkDelete = () => {
    
  };

  // Handle tab change.
  const handleTabChange = (viewId) => {
    addManualJournalsTableQueries({
      custom_view_id: viewId.id || null,
    });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'manual-journals'}
          views={journalsViews}
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
          // content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter', {
              'has-active-filters': false,
            })}
            text="Filter"
            icon={<Icon icon="filter-16" iconSize={16} />}
          />
        </Popover>

        <If condition={false}>
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
