// @ts-nocheck
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

import withDialogActions from '@/containers/Dialog/withDialogActions';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import {
  DrawerActionsBar,
  Can,
  Icon,
  FormattedMessage as T,
  If,
} from '@/components';
import { CreditNoteAction, AbilitySubject } from '@/constants/abilityOption';

import { compose } from '@/utils';
import { CreditNoteMenuItem } from './utils';
import { DRAWERS } from '@/constants/drawers';

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
    closeDrawer(DRAWERS.CREDIT_NOTE_DETAILS);
  };

  const handleRefundCreditNote = () => {
    openDialog('refund-credit-note', { creditNoteId });
  };

  // Handle delete credit note.
  const handleDeleteCreditNote = () => {
    openAlert('credit-note-delete', { creditNoteId });
  };

  const handleReconcileCreditNote = () => {
    openDialog('reconcile-credit-note', { creditNoteId });
  };

  // Handle print credit note.
  const handlePrintCreditNote = () => {
    openDialog('credit-note-pdf-preview', { creditNoteId });
  };

  return (
    <DrawerActionsBar>
      <NavbarGroup>
        <Can I={CreditNoteAction.Edit} a={AbilitySubject.CreditNote}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="pen-18" />}
            text={<T id={'credit_note.action.edit_credit_note'} />}
            onClick={handleEditCreditNote}
          />
          <NavbarDivider />
        </Can>
        <Can I={CreditNoteAction.Refund} a={AbilitySubject.CreditNote}>
          <If condition={!creditNote.is_closed && !creditNote.is_draft}>
            <Button
              className={Classes.MINIMAL}
              icon={<Icon icon="arrow-upward" iconSize={18} />}
              text={<T id={'refund'} />}
              onClick={handleRefundCreditNote}
            />
            <NavbarDivider />
          </If>
        </Can>
        <Can I={CreditNoteAction.View} a={AbilitySubject.CreditNote}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="print-16" />}
            text={<T id={'print'} />}
            onClick={handlePrintCreditNote}
          />
        </Can>
        <Can I={CreditNoteAction.Delete} a={AbilitySubject.CreditNote}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleDeleteCreditNote}
          />
        </Can>
        <Can I={CreditNoteAction.Edit} a={AbilitySubject.CreditNote}>
          <If condition={creditNote.is_published && !creditNote.is_closed}>
            <NavbarDivider />
            <CreditNoteMenuItem
              payload={{
                onReconcile: handleReconcileCreditNote,
              }}
            />
          </If>
        </Can>
      </NavbarGroup>
    </DrawerActionsBar>
  );
}

export default compose(
  withDialogActions,
  withAlertsActions,
  withDrawerActions,
)(CreditNoteDetailActionsBar);
