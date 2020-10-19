import React, { useEffect, useCallback, useMemo } from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { useQuery, queryCache } from 'react-query';
import { Dialog } from 'components';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withDialogRedux from 'components/DialogReduxConnect';
import withSettingsActions from 'containers/Settings/withSettingsActions';
import withSettings from 'containers/Settings/withSettings';
import ReferenceNumberForm from 'containers/JournalNumber/ReferenceNumberForm';
import classNames from 'classnames';

import { connect } from 'react-redux';
import { compose, optionsMapToArray } from 'utils';

function JournalNumberDailog({
  dialogName,
  payload,
  isOpen,

  // #withSettingsActions
  requestSubmitOptions,

  // #withDialogActions
  closeDialog,
}) {
  // Handles dialog close.
  const handleClose = useCallback(() => {
    closeDialog(dialogName);
  }, [closeDialog, dialogName]);

  const handleSubmitForm = useCallback(() => {});

  // Handle dialog on closed.
  // const onDialogClosed = useCallback(() => {
  //   resetForm();
  // }, [resetForm]);

  return (
    <Dialog
      name={dialogName}
      // isLoading={}
      title={<T id={'journal_number_settings'} />}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      onClose={handleClose}
    >
      <ReferenceNumberForm
        onSubmit={handleSubmitForm}
        initialNumber={'1000'}
        initialPrefix={'A'}
        onClose={handleClose}
        groupName={'manual_journals'}
      />
    </Dialog>
  );
}

const mapStateToProps = (state, props) => ({
  dialogName: 'journalNumber-form',
  journalNumberId: props?.payload?.id || null,
});

const withJournalNumberDailog = connect(mapStateToProps);

export default compose(
  withDialogRedux(null, 'journalNumber-form'),
  withJournalNumberDailog,
  withDialogActions,
  withSettingsActions,
)(JournalNumberDailog);
