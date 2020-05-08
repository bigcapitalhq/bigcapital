import React, {useMemo, useState, useEffect, useRef, useCallback} from 'react';
import * as Yup from 'yup';
import {useFormik} from "formik";
import moment from 'moment';
import { Intent } from '@blueprintjs/core';

import MakeJournalEntriesHeader from './MakeJournalEntriesHeader';
import MakeJournalEntriesFooter from './MakeJournalEntriesFooter';
import MakeJournalEntriesTable from './MakeJournalEntriesTable';

import withJournalsActions from 'containers/Accounting/withJournalsActions';
import withManualJournalDetail from 'containers/Accounting/withManualJournalDetail';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withDashboardActions from 'containers/Dashboard/withDashboard';

import AppToaster from 'components/AppToaster';
import {pick} from 'lodash';
import Dragzone from 'components/Dragzone';
import MediaConnect from 'connectors/Media.connect';

import useMedia from 'hooks/useMedia';
import {compose} from 'utils';


function MakeJournalEntriesForm({
  requestSubmitMedia,
  requestDeleteMedia,

  requestMakeJournalEntries,
  requestEditManualJournal,

  changePageTitle,
  changePageSubtitle,

  manualJournalId,
  manualJournal,
  onFormSubmit,
  onCancelForm, 
}) {
  const { setFiles, saveMedia, deletedFiles, setDeletedFiles, deleteMedia } = useMedia({
    saveCallback: requestSubmitMedia,
    deleteCallback: requestDeleteMedia,
  });
  const handleDropFiles = useCallback((_files) => {
    setFiles(_files.filter((file) => file.uploaded === false));
  }, []);

  const savedMediaIds = useRef([]);
  const clearSavedMediaIds = () => { savedMediaIds.current = []; }

  useEffect(() => {
    if (manualJournal && manualJournal.id) {
      changePageTitle('Edit Journal');
      changePageSubtitle(`No. ${manualJournal.journal_number}`);
    } else {
      changePageTitle('New Journal');  
    }
  }, [changePageTitle, changePageSubtitle, manualJournal]);

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

  const saveInvokeSubmit = useCallback((payload) => {
    onFormSubmit && onFormSubmit(payload)
  }, [onFormSubmit]);

  const [payload, setPayload] = useState({});

  const defaultEntry = useMemo(() => ({
    account_id: null,
    credit: 0,
    debit: 0,
    note: '',
  }), []);

  const defaultInitialValues = useMemo(() => ({
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

  const initialValues = useMemo(() => ({
    ...(manualJournal) ? {
      ...pick(manualJournal, Object.keys(defaultInitialValues)),
      entries: manualJournal.entries.map((entry) => ({
        ...pick(entry, Object.keys(defaultEntry)),
      })),
    } : {
      ...defaultInitialValues,
    }
  }), [manualJournal, defaultInitialValues, defaultEntry]);

  const initialAttachmentFiles = useMemo(() => {
    return manualJournal && manualJournal.media
      ? manualJournal.media.map((attach) => ({
        preview: attach.attachment_file,
        uploaded: true,
        metadata: { ...attach },
      })) : [];
  }, [manualJournal]);

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      const entries = values.entries.filter((entry) => (
        (entry.credit || entry.debit)
      ));
      const getTotal = (type = 'credit') => {
        return entries.reduce((total, item) => {
          return item[type] ? item[type] + total : total;
        }, 0);
      }
      const totalCredit = getTotal('credit');
      const totalDebit = getTotal('debit');

      // Validate the total credit should be eqials total debit.
      if (totalCredit !== totalDebit) {
        AppToaster.show({
          message: 'credit_and_debit_not_equal',
        });
        setSubmitting(false);
        return;
      }
      const form = { ...values, status: payload.publish, entries };

      const saveJournal = (mediaIds) => new Promise((resolve, reject) => {
        const requestForm = { ...form, media_ids: mediaIds };

        if (manualJournal && manualJournal.id) {
          requestEditManualJournal(manualJournal.id, requestForm)
            .then((response) => {
              AppToaster.show({
                message: 'manual_journal_has_been_edited',
                intent: Intent.SUCCESS,
              }); 
              setSubmitting(false);
              saveInvokeSubmit({ action: 'update', ...payload });
              clearSavedMediaIds([]);
              resolve(response);
            }).catch((errors) => {
              if (errors.find(e => e.type === 'JOURNAL.NUMBER.ALREADY.EXISTS')) {
                setErrors({
                  journal_number: 'Journal number is already used.',
                });
              }
              setSubmitting(false);
            });
        } else {
          requestMakeJournalEntries(requestForm)
            .then((response) => {
              AppToaster.show({
                message: 'manual_journal_has_been_submit',
                intent: Intent.SUCCESS,
              }); 
              setSubmitting(false);
              saveInvokeSubmit({ action: 'new', ...payload });
              clearSavedMediaIds();
              resolve(response);
            }).catch((errors) => {
              if (errors.find(e => e.type === 'JOURNAL.NUMBER.ALREADY.EXISTS')) {
                setErrors({
                  journal_number: 'Journal number is already used.',
                });
              }
              setSubmitting(false);
            });
        }
      });

      Promise.all([
        saveMedia(),
        deleteMedia(),
      ]).then(([savedMediaResponses]) => {
        const mediaIds = savedMediaResponses.map(res => res.data.media.id);
        savedMediaIds.current = mediaIds;

        return savedMediaResponses;
      }).then(() => {
        return saveJournal(savedMediaIds.current);
      });
    },
  });

  const handleSubmitClick = useCallback((payload) => {
    setPayload(payload);
    formik.handleSubmit();
  }, [setPayload, formik]);

  const handleCancelClick = useCallback((payload) => {
    onCancelForm && onCancelForm(payload); 
  }, [onCancelForm]);

  const handleDeleteFile = useCallback((_deletedFiles) => {
    _deletedFiles.forEach((deletedFile) => {
      if (deletedFile.uploaded && deletedFile.metadata.id) {
        setDeletedFiles([
          ...deletedFiles, deletedFile.metadata.id,
        ]);
      }
    });
  }, [setDeletedFiles, deletedFiles]);  

  return (
    <div class="make-journal-entries">
      <form onSubmit={formik.handleSubmit}>
        <MakeJournalEntriesHeader formik={formik} />

        <MakeJournalEntriesTable
          initialValues={initialValues}
          formik={formik}
          defaultRow={defaultEntry} />

        <MakeJournalEntriesFooter
          formik={formik}
          onSubmitClick={handleSubmitClick}
          onCancelClick={handleCancelClick} />
      </form>

      <Dragzone
        initialFiles={initialAttachmentFiles}
        onDrop={handleDropFiles}
        onDeleteFile={handleDeleteFile}
        hint={'Attachments: Maxiumum size: 20MB'} />
    </div>
  );
}

export default compose(
  // ManualJournalsConnect,
  // MakeJournalEntriesConnect,
  withJournalsActions,
  withManualJournalDetail,
  withAccountsActions,
  withDashboardActions,
  MediaConnect,
)(MakeJournalEntriesForm);