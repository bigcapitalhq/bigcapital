import { Button, Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { RecurringJournalGeneratedJournalsDialog } from '../Dialogs/RecurringJournalGeneratedJournalsDialog';
import { useRecurringJournalFormContext } from './RecurringJournalFormProvider';
import { Group, Icon } from '@/components';

export function RecurringJournalFloatingActions() {
  const history = useHistory();
  const { isSubmitting, isValid, dirty } = useFormikContext();
  const { isNewMode, recurringJournal } = useRecurringJournalFormContext();
  const [isGeneratedJournalsOpen, setGeneratedJournalsOpen] = useState(false);

  return (
    <>
      <Group spacing={10} position={'right'}>
        {!isNewMode && (
          <Button
            minimal
            icon={<Icon icon={'document'} />}
            onClick={() => setGeneratedJournalsOpen(true)}
            disabled={isSubmitting}
          >
            {intl.get('recurring_journal.generated_journals')}
          </Button>
        )}
        <Button
          intent={Intent.PRIMARY}
          type="submit"
          loading={isSubmitting}
          disabled={!isValid || (!dirty && !isNewMode)}
          icon={<Icon icon={'floppy-disk'} />}
        >
          {isNewMode ? intl.get('create') : intl.get('save')}
        </Button>
        <Button
          onClick={() => history.push('/recurring-journals')}
          disabled={isSubmitting}
        >
          {intl.get('cancel')}
        </Button>
      </Group>

      <RecurringJournalGeneratedJournalsDialog
        recurringJournalId={recurringJournal?.id}
        isOpen={isGeneratedJournalsOpen}
        onClose={() => setGeneratedJournalsOpen(false)}
      />
    </>
  );
}
