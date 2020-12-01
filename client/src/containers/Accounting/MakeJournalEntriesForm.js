import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Formik, Form } from 'formik';
import moment from 'moment';
import { Intent } from '@blueprintjs/core';
import { useIntl } from 'react-intl';
import { pick } from 'lodash';
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

import withJournalsActions from 'containers/Accounting/withJournalsActions';
import withManualJournalDetail from 'containers/Accounting/withManualJournalDetail';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withSettings from 'containers/Settings/withSettings';

import AppToaster from 'components/AppToaster';
import Dragzone from 'components/Dragzone';
import withMediaActions from 'containers/Media/withMediaActions';
import {
  compose,
  repeatValue,
  orderingLinesIndexes,
  defaultToTransform,
} from 'utils';
import { transformErrors } from './utils';
import withManualJournalsActions from './withManualJournalsActions';

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
  status: '',
  entries: [...repeatValue(defaultEntry, 4)],
};

/**
 * Journal entries form.
 */
function MakeJournalEntriesForm({
  // #withMedia
  requestSubmitMedia,
  requestDeleteMedia,

  // #withJournalsActions
  requestMakeJournalEntries,
  requestEditManualJournal,
  setJournalNumberChanged,

  // #withManualJournals
  journalNumberChanged,

  // #withDashboard
  changePageTitle,
  changePageSubtitle,

  // #withSettings
  journalNextNumber,
  journalNumberPrefix,

  // #ownProps
  manualJournalId,
  manualJournal,
  onFormSubmit,
  onCancelForm,
}) {
  const isNewMode = !manualJournalId;
  const [submitPayload, setSubmitPayload] = useState({});
  const { formatMessage } = useIntl();
  const history = useHistory();

  const journalNumber = isNewMode
    ? `${journalNumberPrefix}-${journalNextNumber}`
    : journalNextNumber;

  useEffect(() => {
    const transactionNumber = manualJournal
      ? manualJournal.journal_number
      : journalNumber;

    if (manualJournal && manualJournal.id) {
      changePageTitle(formatMessage({ id: 'edit_journal' }));
    } else {
      changePageTitle(formatMessage({ id: 'new_journal' }));
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
            journal_number: journalNumber,
            entries: orderingLinesIndexes(defaultInitialValues.entries),
          }),
    }),
    [manualJournal, journalNumber],
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
    const form = { ...values, status: submitPayload.publish, entries };

    const handleError = (error) => {
      transformErrors(error, { setErrors });
      setSubmitting(false);
    };

    const handleSuccess = (errors) => {
      AppToaster.show({
        message: formatMessage(
          {
            id: isNewMode
              ? 'the_journal_has_been_successfully_created'
              : 'the_journal_has_been_successfully_edited',
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
      requestMakeJournalEntries(form).then(handleSuccess).catch(handleError);
    } else {
      requestEditManualJournal(manualJournal.id, form)
        .then(handleSuccess)
        .catch(handleError);
    }
  };

  const handleCancelClick = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleSubmitClick = useCallback(
    (event, payload) => {
      setSubmitPayload({ ...payload });
    },
    [setSubmitPayload],
  );

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
        {({ isSubmitting, values }) => (
          <Form>
            <MakeJournalEntriesHeader
              manualJournal={manualJournalId}
              onJournalNumberChanged={handleJournalNumberChanged}
            />
            <MakeJournalNumberWatcher journalNumber={journalNumber} />
            <MakeJournalEntriesField defaultRow={defaultEntry} />
            <MakeJournalFormFooter />
            <MakeJournalFormFloatingActions
              isSubmitting={isSubmitting}
              manualJournal={manualJournalId}
              manualJournalPublished={values.status}
              onCancelClick={handleCancelClick}
              onSubmitClick={handleSubmitClick}
            />
          </Form>
        )}
      </Formik>
      {/* <Dragzone
        initialFiles={initialAttachmentFiles}
        onDrop={handleDropFiles}
        onDeleteFile={handleDeleteFile}
        hint={'Attachments: Maxiumum size: 20MB'}
      /> */}
    </div>
  );
}

export default compose(
  withJournalsActions,
  withManualJournalDetail,
  withAccountsActions,
  withDashboardActions,
  withMediaActions,
  withSettings(({ manualJournalsSettings }) => ({
    journalNextNumber: parseInt(manualJournalsSettings?.nextNumber, 10),
    journalNumberPrefix: manualJournalsSettings?.numberPrefix,
  })),
  withManualJournalsActions,
)(MakeJournalEntriesForm);
