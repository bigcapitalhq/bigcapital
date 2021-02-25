import React, { useMemo } from 'react';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import { useIntl } from 'react-intl';
import { defaultTo, isEmpty } from 'lodash';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import { CLASSES } from 'common/classes';
import {
  CreateJournalSchema,
  EditJournalSchema,
} from './MakeJournalEntries.schema';
import MakeJournalEntriesHeader from './MakeJournalEntriesHeader';
import MakeJournalFormFloatingActions from './MakeJournalFormFloatingActions';
import MakeJournalEntriesField from './MakeJournalEntriesField';
import MakeJournalFormFooter from './MakeJournalFormFooter';
import MakeJournalFormDialogs from './MakeJournalFormDialogs';

import withSettings from 'containers/Settings/withSettings';

import AppToaster from 'components/AppToaster';
import withMediaActions from 'containers/Media/withMediaActions';
import { compose, orderingLinesIndexes, transactionNumber } from 'utils';
import {
  transformErrors,
  transformToEditForm,
  defaultManualJournal,
} from './utils';
import { useMakeJournalFormContext } from './MakeJournalProvider';

/**
 * Journal entries form.
 */
function MakeJournalEntriesForm({
  // #withSettings
  journalNextNumber,
  journalNumberPrefix,
  baseCurrency,
}) {
  // Journal form context.
  const {
    createJournalMutate,
    editJournalMutate,
    isNewMode,
    manualJournal,
    submitPayload,
  } = useMakeJournalFormContext();

  const { formatMessage } = useIntl();
  const history = useHistory();

  // New journal number.
  const journalNumber = transactionNumber(
    journalNumberPrefix,
    journalNextNumber,
  );
  // Form initial values.
  const initialValues = useMemo(
    () => ({
      ...(!isEmpty(manualJournal)
        ? {
            ...transformToEditForm(manualJournal),
          }
        : {
            ...defaultManualJournal,
            journal_number: defaultTo(journalNumber, ''),
            currency_code: defaultTo(baseCurrency, ''),
            entries: orderingLinesIndexes(defaultManualJournal.entries),
          }),
    }),
    [manualJournal, baseCurrency, journalNumber],
  );

  // Handle the form submiting.
  const handleSubmit = (values, { setErrors, setSubmitting, resetForm }) => {
    setSubmitting(true);
    const entries = values.entries.filter(
      (entry) => entry.debit || entry.credit,
    );
    const getTotal = (type = 'credit') => {
      return entries.reduce((total, item) => {
        return item[type] ? item[type] + total : total;
      }, 0);
    };
    const totalCredit = getTotal('credit');
    const totalDebit = getTotal('debit');

    // Validate the total credit should be eqials total debit.
    if (totalCredit !== totalDebit) {
      AppToaster.show({
        message: formatMessage({
          id: 'should_total_of_credit_and_debit_be_equal',
        }),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    } else if (totalCredit === 0 || totalDebit === 0) {
      AppToaster.show({
        message: formatMessage({
          id: 'amount_cannot_be_zero_or_empty',
        }),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }
    const form = { ...values, publish: submitPayload.publish, entries };

    // Handle the request error.
    const handleError = ({
      response: {
        data: { errors },
      },
    }) => {
      transformErrors(errors, { setErrors });
      setSubmitting(false);
    };

    // Handle the request success.
    const handleSuccess = (errors) => {
      AppToaster.show({
        message: formatMessage(
          {
            id: isNewMode
              ? 'the_journal_has_been_created_successfully'
              : 'the_journal_has_been_edited_successfully',
          },
          { number: values.journal_number },
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

    if (isNewMode) {
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
        <Form>
          <MakeJournalEntriesHeader />
          <MakeJournalEntriesField />
          <MakeJournalFormFooter />
          <MakeJournalFormFloatingActions />

          {/* --------- Dialogs --------- */}
          <MakeJournalFormDialogs />
        </Form>
      </Formik>
    </div>
  );
}

export default compose(
  withMediaActions,
  withSettings(({ manualJournalsSettings, organizationSettings }) => ({
    journalNextNumber: parseInt(manualJournalsSettings?.nextNumber, 10),
    journalNumberPrefix: manualJournalsSettings?.numberPrefix,
    baseCurrency: organizationSettings?.baseCurrency,
  })),
)(MakeJournalEntriesForm);
