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
  Alignment,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { FormattedMessage as T } from 'components';

import { useRefreshJournals } from 'hooks/query/manualJournals';
import { useManualJournalsContext } from './ManualJournalsListProvider';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { If, DashboardActionViewsList } from 'components';

import withManualJournalsActions from './withManualJournalsActions';
import { compose } from 'utils';

/**
 * Manual journal actions bar.
 */
function ManualJournalActionsBar({
  // #withManualJournalsActions
  setManualJournalsTableState,
}) {
  // History context.
  const history = useHistory();

  // Manual journals context.
  const { journalsViews } = useManualJournalsContext();

  // Manual journals refresh action.
  const { refresh } = useRefreshJournals();

  // Handle click a new manual journal.
  const onClickNewManualJournal = () => {
    history.push('/make-journal-entry');
  };

  // Handle delete button click.
  const handleBulkDelete = () => {};

  // Handle tab change.
  const handleTabChange = (customView) => {
    setManualJournalsTableState({ customViewId: customView.id || null });
  };

  // Handle click a refresh Journals
  const handleRefreshBtnClick = () => {
    refresh();
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
            text={<T id={'filter'} />}
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
      <NavbarGroup align={Alignment.RIGHT}>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="refresh-16" iconSize={14} />}
          onClick={handleRefreshBtnClick}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDialogActions,
  withManualJournalsActions,
)(ManualJournalActionsBar);
