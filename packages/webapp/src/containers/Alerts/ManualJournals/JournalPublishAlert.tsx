import { Alert, Intent } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { usePublishJournal } from '@/hooks/query';

interface JournalPublishAlertPayload {
  manualJournalId: number;
  journalNumber: string;
}

interface PublishJournalError {
  message?: string;
  data?: {
    errors?: Array<{
      type?: string;
      message?: string;
      payload?: {
        assignments?: Array<{ categoryName?: string }>;
      };
    }>;
  };
}

interface JournalPublishAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: JournalPublishAlertPayload;
}

/**
 * Journal publish alert.
 */
function JournalPublishAlertInner({
  name,
  isOpen,
  payload: { manualJournalId },
  closeAlert,
}: JournalPublishAlertProps): React.ReactElement {
  const { mutateAsync: publishJournalMutate, isPending: isLoading } =
    usePublishJournal();

  const handleCancel = () => {
    closeAlert(name);
  };

  const handleConfirm = () => {
    publishJournalMutate(manualJournalId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_manual_journal_has_been_published'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: PublishJournalError) => {
        // Bugfix: the original had an empty `.catch((error) => {})` that silently swallowed failures.
        const mandatoryError = error.data?.errors?.find(
          (err) => err.type === 'TRACKING_CATEGORY_MANDATORY',
        );
        const categoryNames = Array.from(
          new Set(
            (mandatoryError?.payload?.assignments ?? [])
              .map((assignment) => assignment.categoryName)
              .filter((name): name is string => Boolean(name)),
          ),
        );

        if (categoryNames.length > 0) {
          AppToaster.show({
            message: categoryNames.map((categoryName) => (
              <div key={categoryName}>
                {intl.get('make_journal.errors.tracking_category_mandatory', {
                  category: categoryName,
                })}
              </div>
            )),
            intent: Intent.DANGER,
          });
          return;
        }
        AppToaster.show({
          message: error.message ?? intl.get('something_went_wrong'),
          intent: Intent.DANGER,
        });
      })
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('publish')}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      loading={isLoading}
    >
      <p>
        <T id={'are_sure_to_publish_this_manual_journal'} />
      </p>
    </Alert>
  );
}

export const JournalPublishAlert = FF.pipe(
  JournalPublishAlertInner,
  withAlertActions,
  withAlertStoreConnect(),
);
