import React from 'react';
import {
  Button,
  Classes,
  NavbarDivider,
  NavbarGroup,
  Intent,
  Alignment,
} from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import {
  Icon,
  FormattedMessage as T,
  DashboardActionViewsList,
  AdvancedFilterPopover,
  DashboardFilterButton,
  DashboardRowsHeightButton,
} from 'components';

import DashboardActionsBar from '../../../../components/Dashboard/DashboardActionsBar';

import withCreditNotes from './withCreditNotes';
import withCreditNotesActions from './withCreditNotesActions';
import withSettings from '../../../Settings/withSettings';
import withSettingsActions from '../../../Settings/withSettingsActions';

import { compose } from 'utils';

/**
 * Credit note table actions bar.
 */
function CreditNotesActionsBar({
  // #withCreditNotes
  creditNoteFilterRoles,

  // #withCreditNotesActions
  setCreditNotesTableState,

  // #withSettings
  creditNoteTableSize,

  // #withSettingsActions
  addSetting,
}) {
  const history = useHistory();

  // credit note list context.

  // credit note refresh action.

  // Handle view tab change.
  const handleTabChange = (view) => {
    setCreditNotesTableState({ viewSlug: view ? view.slug : null });
  };

  // Handle click a refresh credit note.
  const handleRefreshBtnClick = () => {};

  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('salesCreditNote', 'tableSize', size);
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          allMenuItem={true}
          resourceName={'credit_note'}
          views={[]}
          onChange={handleTabChange}
        />
        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'print-16'} iconSize={'16'} />}
          text={<T id={'print'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-import-16'} />}
          text={<T id={'import'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-export-16'} iconSize={'16'} />}
          text={<T id={'export'} />}
        />
        <NavbarDivider />
        <DashboardRowsHeightButton
          initialValue={creditNoteTableSize}
          onChange={handleTableRowSizeChange}
        />
        <NavbarDivider />
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
  withCreditNotesActions,
  withSettingsActions,
  withCreditNotes(({ creditNoteTableState }) => ({
    creditNoteFilterRoles: creditNoteTableState.filterRoles,
  })),
  withSettings(({ creditNoteSettings }) => ({
    creditNoteTableSize: creditNoteSettings?.tableSize,
  })),
)(CreditNotesActionsBar);
