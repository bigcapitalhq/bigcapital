import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
} from '@blueprintjs/core';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import { useCreditNoteDetailDrawerContext } from './CreditNoteDetailDrawerProvider';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { Icon, FormattedMessage as T, MoreMenuItems, Can } from 'components';

import { compose } from 'utils';

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
  const { creditNoteId } = useCreditNoteDetailDrawerContext();

  const history = useHistory();

  // Handle edit credit note.
  const handleEditCreditNote = () => {
    history.push(`/credit-notes/${creditNoteId}/edit`);
    closeDrawer('credit-note-detail-drawer');
  };

  const handleRefundCreditNote = () => {
    openDialog('refund-credit-note', { creditNoteId });
  };

  // Handle delete credit note.
  const handleDeleteCreditNote = () => {
    openAlert('credit-note-delete', { creditNoteId });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="pen-18" />}
          text={<T id={'credit_note.action.edit_credit_note'} />}
          onClick={handleEditCreditNote}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="quick-payment-16" iconSize={16} />}
          text={'Refund'}
          // text={<T id={'add_payment'} />}
          onClick={handleRefundCreditNote}
        />
        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'trash-16'} iconSize={16} />}
          text={<T id={'delete'} />}
          intent={Intent.DANGER}
          onClick={handleDeleteCreditNote}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDialogActions,
  withAlertsActions,
  withDrawerActions,
)(CreditNoteDetailActionsBar);
