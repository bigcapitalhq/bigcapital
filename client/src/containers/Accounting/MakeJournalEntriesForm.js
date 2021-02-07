import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Formik, Form } from 'formik';
import moment from 'moment';
import { Intent } from '@blueprintjs/core';
import { useIntl } from 'react-intl';
import { pick, defaultTo } from 'lodash';
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
import MakeJournalNumberWatcher from './MakeJournalNumberWatcher';
import MakeJournalFormFooter from './MakeJournalFormFooter';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withSettings from 'containers/Settings/withSettings';

import AppToaster from 'components/AppToaster';
import withMediaActions from 'containers/Media/withMediaActions';
import {
  compose,
  repeatValue,
  orderingLinesIndexes,
  defaultToTransform,
  transactionNumber,
} from 'utils';
import { transformErrors } from './utils';
import { useMakeJournalFormContext } from './MakeJournalProvider';

const defaultEntry = {
  index: 0,
  account_id: '',
  credit: '',
  debit: '',
  contact_id: '',
  note: '',
};
const defaultInitialValues = {
  journal_number: '',
  journal_type: 'Journal',
  date: moment(new Date()).format('YYYY-MM-DD'),
  description: '',
  reference: '',
  currency_code: '',
  publish: '',
  entries: [...repeatValue(defaultEntry, 4)],
};

/**
 * Journal entries form.
 */
function MakeJournalEntriesForm({
  // #withDashboard
  changePageTitle,
  changePageSubtitle,

  // #withSettings
  journalNextNumber,
  journalNumberPrefix,
  baseCurrency,
}) {
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
  // Changes the page title based on the form in new and edit mode.
  useEffect(() => {
    const transactionNumber = manualJournal
      ? manualJournal.journal_number
      : journalNumber;

    if (isNewMode) {
      changePageTitle(formatMessage({ id: 'new_journal' }));
    } else {
      changePageTitle(formatMessage({ id: 'edit_journal' }));
    }
    changePageSubtitle(
      defaultToTransform(transactionNumber, `No. ${transactionNumber}`, ''),
    );
  }, [
    changePageTitle,
    changePageSubtitle,
    journalNumber,
    manualJournal,
    formatMessage,
    isNewMode,
  ]);

  const initialValues = useMemo(
    () => ({
      ...(manualJournal
        ? {
            ...pick(manualJournal, Object.keys(defaultInitialValues)),
            entries: manualJournal.entries.map((entry) => ({
              ...pick(entry, Object.keys(defaultEntry)),
            })),
          }
        : {
            ...defaultInitialValues,
            journal_number: defaultTo(journalNumber, ''),
            currency_code: defaultTo(baseCurrency, ''),
            entries: orderingLinesIndexes(defaultInitialValues.entries),
          }),
    }),
    [manualJournal, baseCurrency, journalNumber],
  );

  // Handle journal number field change.
  const handleJournalNumberChanged = useCallback(
    (journalNumber) => {
      changePageSubtitle(
        defaultToTransform(journalNumber, `No. ${journalNumber}`, ''),
      );
    },
    [changePageSubtitle],
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
    const handleError = (error) => {
      transformErrors(error, { setErrors });
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
      editJournalMutate(manualJournal.id, form)
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
          <MakeJournalEntriesHeader
            onJournalNumberChanged={handleJournalNumberChanged}
          />
          <MakeJournalNumberWatcher journalNumber={journalNumber} />
          <MakeJournalEntriesField defaultRow={defaultEntry} />
          <MakeJournalFormFooter />
          <MakeJournalFormFloatingActions />
        </Form>
      </Formik>
    </div>
  );
}

export default compose(
  withDashboardActions,
  withMediaActions,
  withSettings(({ manualJournalsSettings, organizationSettings }) => ({
    journalNextNumber: parseInt(manualJournalsSettings?.nextNumber, 10),
    journalNumberPrefix: manualJournalsSettings?.numberPrefix,
    baseCurrency: organizationSettings?.baseCurrency,
  })),
)(MakeJournalEntriesForm);
