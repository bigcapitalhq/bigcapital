import { Intent } from '@blueprintjs/core';
import { css } from '@emotion/css';
import classNames from 'classnames';
import { Formik, Form, type FormikHelpers } from 'formik';
import { sumBy, round, isEmpty } from 'lodash';
import { useMemo } from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { JournalSyncIncrementSettingsToForm } from './components';
import {
  CreateJournalSchema,
  EditJournalSchema,
} from './MakeJournalEntries.schema';
import { MakeJournalEntriesField } from './MakeJournalEntriesField';
import { MakeJournalEntriesHeader } from './MakeJournalEntriesHeader';
import { MakeJournalFormDialogs } from './MakeJournalFormDialogs';
import { MakeJournalFloatingAction as MakeJournalFormFloatingActions } from './MakeJournalFormFloatingActions';
import { MakeJournalFormFooter } from './MakeJournalFormFooter';
import { MakeJournalFormTopBar } from './MakeJournalFormTopBar';
import { useMakeJournalFormContext } from './MakeJournalProvider';
import {
  transformErrors,
  transformToEditForm,
  transformFormValuesToRequest,
  defaultManualJournal,
  type MakeJournalEntry,
  type MakeJournalFormValues,
  type MakeJournalErrorResponse,
} from './utils';
import { AppToaster } from '@/components';
import { PageForm } from '@/components/PageForm';
import { CLASSES } from '@/constants/classes';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { transactionNumber } from '@/utils';

/**
 * Journal entries form.
 */
function MakeJournalEntriesFormInner() {
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  // Journal form context.
  const {
    createJournalMutate,
    editJournalMutate,
    isNewMode,
    manualJournal,
    submitPayload,
    manualJournalsSettings,
  } = useMakeJournalFormContext();

  // Auto-increment settings derived from the manual journals settings group.
  const journalNextNumber = manualJournalsSettings?.nextNumber as
    | number
    | undefined;
  const journalNumberPrefix = manualJournalsSettings?.numberPrefix as
    | string
    | undefined;
  const journalAutoIncrement = manualJournalsSettings?.autoIncrement as
    | boolean
    | undefined;

  const history = useHistory();

  // New journal number.
  const journalNumber = transactionNumber(
    journalNumberPrefix,
    journalNextNumber,
  );
  // Form initial values.
  const initialValues = useMemo<MakeJournalFormValues>(
    () => ({
      ...(!isEmpty(manualJournal)
        ? {
            ...transformToEditForm(manualJournal),
          }
        : {
            ...defaultManualJournal,
            // If the auto-increment mode is enabled, take the next journal
            // number from the settings.
            ...(journalAutoIncrement && {
              journalNumber,
            }),
            currencyCode: baseCurrency ?? '',
          }),
    }),
    [manualJournal, baseCurrency, journalNumber, journalAutoIncrement],
  );

  // Handle the form submiting.
  const handleSubmit = (
    values: MakeJournalFormValues,
    {
      setErrors,
      setSubmitting,
      resetForm,
    }: FormikHelpers<MakeJournalFormValues>,
  ) => {
    setSubmitting(true);
    const entries = values.entries.filter(
      (entry) => entry.debit || entry.credit,
    );
    // Updated getTotal function using lodash
    const getTotal = (type: 'credit' | 'debit'): number => {
      return round(
        sumBy(entries, (entry: MakeJournalEntry) =>
          parseFloat(String(entry[type] || 0)),
        ),
        2,
      );
    };
    const totalCredit = getTotal('credit');
    const totalDebit = getTotal('debit');

    // Validate the total credit should be equals total debit.
    if (totalCredit !== totalDebit) {
      AppToaster.show({
        message: intl.get('should_total_of_credit_and_debit_be_equal'),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    } else if (totalCredit === 0 || totalDebit === 0) {
      AppToaster.show({
        message: intl.get('amount_cannot_be_zero_or_empty'),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }
    const form = transformFormValuesToRequest(values, !!submitPayload.publish);
    // Handle the request error.
    const handleError = ({
      data: { errors },
    }: {
      data: { errors: MakeJournalErrorResponse[] };
    }) => {
      transformErrors(errors, { setErrors });
      setSubmitting(false);
    };
    // Handle the request success.
    const handleSuccess = () => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_journal_has_been_created_successfully'
            : 'the_journal_has_been_edited_successfully',
          { number: values.journalNumber },
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      if (submitPayload.redirect) {
        history.push('/manual-journals');
      }
      if (submitPayload.resetForm) {
        resetForm();
      }
    };
    if (isNewMode || !manualJournal) {
      createJournalMutate(form).then(handleSuccess).catch(handleError);
    } else {
      editJournalMutate([manualJournal.id, form])
        .then(handleSuccess)
        .catch(handleError);
    }
  };

  return (
    <div
      className={classNames(
        CLASSES.PAGE_FORM,
        CLASSES.PAGE_FORM_STRIP_STYLE,
        CLASSES.PAGE_FORM_MAKE_JOURNAL,
      )}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={isNewMode ? CreateJournalSchema : EditJournalSchema}
        onSubmit={handleSubmit}
      >
        <Form
          className={css({
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          })}
        >
          <PageForm flex={1}>
            <PageForm.Body>
              <MakeJournalFormTopBar />
              <MakeJournalEntriesHeader />
              <MakeJournalEntriesField />
              <MakeJournalFormFooter />
            </PageForm.Body>

            <PageForm.Footer>
              <MakeJournalFormFloatingActions />
            </PageForm.Footer>

            {/* --------- Dialogs --------- */}
            <MakeJournalFormDialogs />

            {/* --------- Effects --------- */}
            <JournalSyncIncrementSettingsToForm />
          </PageForm>
        </Form>
      </Formik>
    </div>
  );
}

export const MakeJournalEntriesForm = MakeJournalEntriesFormInner;
