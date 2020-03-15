

import React, {useState, useEffect} from 'react';
import * as Yup from 'yup';
import MakeJournalEntriesHeader from './MakeJournalEntriesHeader';
import MakeJournalEntriesFooter from './MakeJournalEntriesFooter';
import MakeJournalEntriesTable from './MakeJournalEntriesTable';
import {Formik, useFormik} from "formik";
import MakeJournalEntriesConnect from 'connectors/MakeJournalEntries.connect';
import AccountsConnect from 'connectors/Accounts.connector';
import DashboardConnect from 'connectors/Dashboard.connector';
import {compose} from 'utils';
import useAsync from 'hooks/async';
import moment from 'moment';
import AppToaster from 'components/AppToaster';

function MakeJournalEntriesForm({
  makeJournalEntries,
  fetchAccounts,
  changePageTitle,
}) {
  useEffect(() => {
    changePageTitle('New Journal');  
  }, []);

  const fetchHook = useAsync(async () => {
    await Promise.all([
      fetchAccounts(),
    ]);
  });

  const validationSchema = Yup.object().shape({
    date: Yup.date().required(),
    reference: Yup.string(),
    description: Yup.string(),
    entries: Yup.array().of(
      Yup.object().shape({
        credit: Yup.number().nullable(),
        debit: Yup.number().nullable(),
      }),
    )
  });

  const defaultEntry = {
    account_id: null,
    credit: null,
    debit: null,
    note: '',    
  };

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      reference: '',
      date: moment(new Date()).format('YYYY-MM-DD'),
      description: '',
      entries: [
        defaultEntry,
        defaultEntry,
        defaultEntry,
        defaultEntry,
      ],
    },
    onSubmit: (values) => {
      const form = values.entries.filter((entry) => (
        (entry.credit || entry.debit)
      ));
      makeJournalEntries(values).then((response) => {
        AppToaster.show({
          message: 'the_account_has_been_submit',
        });
      }).catch((error) => {

      });
    },
  });

  console.log(formik.errors);
  return (
    <form onSubmit={formik.handleSubmit}>
      <MakeJournalEntriesHeader formik={formik} />
      <MakeJournalEntriesTable formik={formik} />
      <MakeJournalEntriesFooter formik={formik} />
    </form>
  );
}

export default compose(
  MakeJournalEntriesConnect,
  AccountsConnect,
  DashboardConnect,
)(MakeJournalEntriesForm);