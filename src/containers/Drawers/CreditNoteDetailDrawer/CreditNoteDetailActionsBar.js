import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
} from '@blueprintjs/core';

import { useCreditNoteDetailDrawerContext } from './CreditNoteDetailDrawerProvider';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { DrawerActionsBar, Icon, FormattedMessage as T, If } from 'components';

import { compose } from 'utils';
import { CreditNoteMenuItem } from './utils';

/**
 * Credit note detail actions bar.
 */
function CreditNoteDetailActionsBar({
  // #withDialogActions
  openDialog,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const { creditNoteId, creditNote } = useCreditNoteDetailDrawerContext();

  const history = useHistory();

  // Handle edit credit note.
  const handleEditCreditNote = () => {
    history.push(`/credit-notes/${creditNoteId}/edit`);
    closeDrawer('credit-note-detail-drawer');
  };

  const handleRefundCreditNote = () => {
    openDialog('refund-credit-note', { creditNoteId });
  };

  const handleReconcileCreditNote = () => {
    openDialog('reconcile-credit-note', { creditNoteId });
  };

  // Handle delete credit note.
  const handleDeleteCreditNote = () => {
    openAlert('credit-note-delete', { creditNoteId });
  };

  return (
    <DrawerActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="pen-18" />}
          text={<T id={'credit_note.action.edit_credit_note'} />}
          onClick={handleEditCreditNote}
        />
        <NavbarDivider />
        <If condition={!creditNote.is_closed && !creditNote.is_draft}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="arrow-upward" iconSize={18} />}
            text={<T id={'refund'} />}
            onClick={handleRefundCreditNote}
          />
          <NavbarDivider />
        </If>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'trash-16'} iconSize={16} />}
          text={<T id={'delete'} />}
          intent={Intent.DANGER}
          onClick={handleDeleteCreditNote}
        />
        <If condition={creditNote.is_published && !creditNote.is_closed}>
          <NavbarDivider />
          <CreditNoteMenuItem
            payload={{
              onReconcile: handleReconcileCreditNote,
            }}
          />
        </If>
      </NavbarGroup>
    </DrawerActionsBar>
  );
}

export default compose(
  withDialogActions,
  withAlertsActions,
  withDrawerActions,
)(CreditNoteDetailActionsBar);
