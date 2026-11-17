import {
  Alert,
  Button,
  Classes,
  Intent,
  NavbarDivider,
  NavbarGroup,
} from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React, { useState } from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { useRecurringJournalDetailDrawerContext } from './RecurringJournalDetailDrawerProvider';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import {
  AppToaster,
  Can,
  DrawerActionsBar,
  FormattedMessage as T,
  Icon,
} from '@/components';
import {
  AbilitySubject,
  RecurringJournalAction,
} from '@/constants/abilityOption';
import { DRAWERS } from '@/constants/drawers';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import {
  useDeleteRecurringJournal,
  useGenerateRecurringJournalNow,
  usePauseRecurringJournal,
  useResumeRecurringJournal,
} from '@/hooks/query';

interface RecurringJournalDetailActionsBarInnerProps
  extends WithDrawerActionsProps {}

/**
 * Recurring journal details action bar.
 */
function RecurringJournalDetailActionsBarInner({
  // #withDrawerActions
  closeDrawer,
}: RecurringJournalDetailActionsBarInnerProps) {
  const history = useHistory();
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const { recurringJournalId, recurringJournal } =
    useRecurringJournalDetailDrawerContext();

  const { mutateAsync: deleteRecurringJournal, isPending: isDeleting } =
    useDeleteRecurringJournal();
  const { mutateAsync: generateNow, isPending: isGenerating } =
    useGenerateRecurringJournalNow();
  const { mutateAsync: pauseRecurringJournal, isPending: isPausing } =
    usePauseRecurringJournal();
  const { mutateAsync: resumeRecurringJournal, isPending: isResuming } =
    useResumeRecurringJournal();

  if (!recurringJournal || !recurringJournalId) {
    return null;
  }

  const handleEdit = () => {
    history.push(`/recurring-journals/${recurringJournalId}/edit`);
    closeDrawer(DRAWERS.RECURRING_JOURNAL_DETAILS);
  };

  const handleGenerate = async () => {
    try {
      await generateNow(recurringJournalId);
      AppToaster.show({
        message: intl.get('recurring_journal.generated_successfully'),
        intent: Intent.SUCCESS,
      });
    } catch (_error) {
      AppToaster.show({
        message: intl.get('something_went_wrong'),
        intent: Intent.DANGER,
      });
    }
  };

  const handlePause = async () => {
    try {
      await pauseRecurringJournal(recurringJournalId);
      AppToaster.show({
        message: intl.get('recurring_journal.paused_successfully'),
        intent: Intent.SUCCESS,
      });
    } catch (_error) {
      AppToaster.show({
        message: intl.get('something_went_wrong'),
        intent: Intent.DANGER,
      });
    }
  };

  const handleResume = async () => {
    try {
      await resumeRecurringJournal(recurringJournalId);
      AppToaster.show({
        message: intl.get('recurring_journal.resumed_successfully'),
        intent: Intent.SUCCESS,
      });
    } catch (_error) {
      AppToaster.show({
        message: intl.get('something_went_wrong'),
        intent: Intent.DANGER,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRecurringJournal(recurringJournalId);
      AppToaster.show({
        message: intl.get('recurring_journal.deleted_successfully'),
        intent: Intent.SUCCESS,
      });
      closeDrawer(DRAWERS.RECURRING_JOURNAL_DETAILS);
    } catch (_error) {
      AppToaster.show({
        message: intl.get('something_went_wrong'),
        intent: Intent.DANGER,
      });
    } finally {
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <DrawerActionsBar>
        <NavbarGroup>
          <Can
            I={RecurringJournalAction.Edit}
            a={AbilitySubject.RecurringJournal}
          >
            <Button
              className={Classes.MINIMAL}
              icon={<Icon icon="pen-18" />}
              text={<T id={'edit_recurring_journal'} />}
              onClick={handleEdit}
            />
            <NavbarDivider />
            <Button
              className={Classes.MINIMAL}
              icon={<Icon icon="refresh" />}
              text={<T id={'recurring_journal.generate_now'} />}
              onClick={handleGenerate}
              loading={isGenerating}
            />
            {recurringJournal.status === 'active' && (
              <Button
                className={Classes.MINIMAL}
                icon={<Icon icon="pause" />}
                text={<T id={'recurring_journal.pause'} />}
                onClick={handlePause}
                loading={isPausing}
              />
            )}
            {recurringJournal.status === 'paused' && (
              <Button
                className={Classes.MINIMAL}
                icon={<Icon icon="play" />}
                text={<T id={'recurring_journal.resume'} />}
                onClick={handleResume}
                loading={isResuming}
              />
            )}
          </Can>
          <Can
            I={RecurringJournalAction.Delete}
            a={AbilitySubject.RecurringJournal}
          >
            <NavbarDivider />
            <Button
              className={Classes.MINIMAL}
              icon={<Icon icon={'trash-16'} iconSize={16} />}
              text={<T id={'delete'} />}
              intent={Intent.DANGER}
              onClick={() => setDeleteOpen(true)}
            />
          </Can>
        </NavbarGroup>
      </DrawerActionsBar>

      <Alert
        isOpen={isDeleteOpen}
        intent={Intent.DANGER}
        icon="trash"
        cancelButtonText={intl.get('cancel')}
        confirmButtonText={intl.get('delete')}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      >
        <p>{intl.get('recurring_journal.delete_confirmation')}</p>
      </Alert>
    </>
  );
}

export const RecurringJournalDetailActionsBar = FF.pipe(
  RecurringJournalDetailActionsBarInner,
  withDrawerActions,
);
