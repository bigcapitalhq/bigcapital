

import React, {useMemo, useEffect} from 'react';
import * as Yup from 'yup';
import MakeJournalEntriesHeader from './MakeJournalEntriesHeader';
import MakeJournalEntriesFooter from './MakeJournalEntriesFooter';
import MakeJournalEntriesTable from './MakeJournalEntriesTable';
import {useFormik} from "formik";
import MakeJournalEntriesConnect from 'connectors/MakeJournalEntries.connect';
import AccountsConnect from 'connectors/Accounts.connector';
import DashboardConnect from 'connectors/Dashboard.connector';
import {compose} from 'utils';
import useAsync from 'hooks/async';
import moment from 'moment';
import AppToaster from 'components/AppToaster';
import {pick, omit} from 'lodash';

function MakeJournalEntriesForm({
  requestMakeJournalEntries,
  requestEditManualJournal,
  changePageTitle,
  changePageSubtitle,
  editJournal,
}) {
  useEffect(() => {
    if (editJournal && editJournal.id) {
      changePageTitle('Edit Journal');
      changePageSubtitle(`No. ${editJournal.journal_number}`);
    } else {
      changePageTitle('New Journal');  
    }
  }, [changePageTitle, changePageSubtitle, editJournal]);

  const validationSchema = Yup.object().shape({
    journal_number: Yup.string().required(),
    date: Yup.date().required(),
    reference: Yup.string(),
    description: Yup.string(),
    entries: Yup.array().of(
      Yup.object().shape({
        credit: Yup.number().nullable(),
        debit: Yup.number().nullable(),
        account_id: Yup.number().nullable().when(['credit', 'debit'], {
          is: (credit, debit) => credit || debit,
          then: Yup.number().required(),
        }),
        note: Yup.string().nullable(),
      }),
    )
  });

  const defaultEntry = useMemo(() => ({
    account_id: null,
    credit: 0,
    debit: 0,
    note: '',
  }), []);

  const initialValues = useMemo(() => ({
    journal_number: '',
    date: moment(new Date()).format('YYYY-MM-DD'),
    description: '',
    reference: '',
    entries: [
      defaultEntry,
      defaultEntry,
      defaultEntry,
      defaultEntry,
    ],
  }), [defaultEntry]);

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...(editJournal) ? {
        ...pick(editJournal, Object.keys(initialValues)),
        entries: editJournal.entries.map((entry) => ({
          ...pick(entry, Object.keys(defaultEntry)),
        }))
      } : {
        ...initialValues,
      }
    },
    onSubmit: (values, actions) => {
      const form = values.entries.filter((entry) => (
        (entry.credit || entry.debit)
      ));
      const getTotal = (type = 'credit') => {
        return form.reduce((total, item) => {
          return item[type] ? item[type] + total : total;
        }, 0);
      }
      const totalCredit = getTotal('credit');
      const totalDebit = getTotal('debit');

      if (totalCredit !== totalDebit) {
        AppToaster.show({
          message: 'credit_and_debit_not_equal',
        });
        actions.setSubmitting(false);
        return;
      }
      
      if (editJournal && editJournal.id) {
        requestEditManualJournal(editJournal.id, { ...values, entries: form })
          .then((response) => {
            AppToaster.show({
              message: 'manual_journal_has_been_edited',
            }); 
            actions.setSubmitting(false);
          }).catch((error) => {
            actions.setSubmitting(false);
          });
      } else {
        requestMakeJournalEntries({ ...values, entries: form })
          .then((response) => {
            AppToaster.show({
              message: 'manual_journal_has_been_submit',
            }); 
            actions.setSubmitting(false);
          }).catch((error) => {
            actions.setSubmitting(false);
          });
      }
    },
  });

  return (
    <div class="make-journal-entries">
      <form onSubmit={formik.handleSubmit}>
        <MakeJournalEntriesHeader formik={formik} />
        <MakeJournalEntriesTable formik={formik} defaultRow={defaultEntry} />
        <MakeJournalEntriesFooter formik={formik} />
      </form>
    </div>
  );
}

export default compose(
  MakeJournalEntriesConnect,
  AccountsConnect,
  DashboardConnect,
)(MakeJournalEntriesForm);