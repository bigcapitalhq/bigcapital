import React from 'react';
import styled from 'styled-components';
import { Dialog, DialogSuspense, FormattedMessage as T } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { compose } from 'utils';

const TimeEntryFormDialogContent = React.lazy(
  () => import('./TimeEntryFormDialogContent'),
);

/**
 * Time entry form dialog.
 * @returns
 */
function TimeEntryFormDialog({ dialogName, isOpen, payload: { timeEntryId } }) {
  return (
    <TimeEntryFormDialogRoot
      name={dialogName}
      title={<T id={'time_entry.dialog.label'} />}
      isOpen={isOpen}
      autoFocus={true}
      canEscapeKeyClose={true}
      style={{ width: '400px' }}
    >
      <DialogSuspense>
        <TimeEntryFormDialogContent
          dialogName={dialogName}
          timeEntry={timeEntryId}
        />
      </DialogSuspense>
    </TimeEntryFormDialogRoot>
  );
}

export default compose(withDialogRedux())(TimeEntryFormDialog);

const TimeEntryFormDialogRoot = styled(Dialog)`
  .bp3-dialog-body {
    .bp3-form-group {
      margin-bottom: 15px;
      margin-top: 15px;

      label.bp3-label {
        margin-bottom: 3px;
        font-size: 13px;
      }
    }

    .form-group {
      &--description {
        .bp3-form-content {
          textarea {
            width: 100%;
            min-width: 100%;
            font-size: 14px;
          }
        }
      }
    }
  }
  .bp3-dialog-footer {
    padding-top: 10px;
  }
`;
