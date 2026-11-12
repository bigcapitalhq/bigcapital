import { Button, Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { RecurringJournalGeneratedJournalsDialog } from '../Dialogs/RecurringJournalGeneratedJournalsDialog';
import { useRecurringJournalFormContext } from './RecurringJournalFormProvider';
import { FormattedMessage as T } from '@/components';
import { PageForm } from '@/components/PageForm';
import { CLASSES } from '@/constants/classes';

export function RecurringJournalFloatingActions() {
  const history = useHistory();
  const { isSubmitting, isValid, dirty, resetForm } = useFormikContext();
  const { isNewMode, recurringJournal } = useRecurringJournalFormContext();
  const [isGeneratedJournalsOpen, setGeneratedJournalsOpen] = useState(false);

  // Handle reset/clear button click.
  const handleClearBtnClick = () => {
    resetForm();
  };

  // Handle cancel button click.
  const handleCancelBtnClick = () => {
    history.push('/recurring-journals');
  };

  return (
    <>
      <PageForm.FooterActions
        spacing={10}
        className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}
      >
        <Button
          intent={Intent.PRIMARY}
          type="submit"
          loading={isSubmitting}
          disabled={!isValid || (!dirty && !isNewMode)}
          text={isNewMode ? <T id={'create'} /> : <T id={'save'} />}
        />
        {!isNewMode && (
          <Button
            onClick={() => setGeneratedJournalsOpen(true)}
            disabled={isSubmitting}
            text={<T id={'recurring_journal.generated_journals'} />}
          />
        )}
        <Button
          className={'ml1'}
          onClick={handleClearBtnClick}
          disabled={isSubmitting}
          text={recurringJournal ? <T id={'reset'} /> : <T id={'clear'} />}
        />
        <Button
          className={'ml1'}
          onClick={handleCancelBtnClick}
          disabled={isSubmitting}
          text={<T id={'cancel'} />}
        />
      </PageForm.FooterActions>

      <RecurringJournalGeneratedJournalsDialog
        recurringJournalId={recurringJournal?.id}
        isOpen={isGeneratedJournalsOpen}
        onClose={() => setGeneratedJournalsOpen(false)}
      />
    </>
  );
}
