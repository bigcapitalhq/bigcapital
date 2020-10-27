import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import moment from 'moment';
import { Intent } from '@blueprintjs/core';
import { useIntl } from 'react-intl';
import { pick, setWith } from 'lodash';

import MakeJournalEntriesHeader from './MakeJournalEntriesHeader';
import MakeJournalEntriesFooter from './MakeJournalEntriesFooter';
import MakeJournalEntriesTable from './MakeJournalEntriesTable';

import withJournalsActions from 'containers/Accounting/withJournalsActions';
import withManualJournalDetail from 'containers/Accounting/withManualJournalDetail';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withSettings from 'containers/Settings/withSettings';
import withManualJournals from './withManualJournals';

import AppToaster from 'components/AppToaster';
import Dragzone from 'components/Dragzone';
import withMediaActions from 'containers/Media/withMediaActions';

import useMedia from 'hooks/useMedia';
import { compose, repeatValue } from 'utils';
import withManualJournalsActions from './withManualJournalsActions';

const ERROR = {
  JOURNAL_NUMBER_ALREADY_EXISTS: 'JOURNAL.NUMBER.ALREADY.EXISTS',
  CUSTOMERS_NOT_WITH_RECEVIABLE_ACC: 'CUSTOMERS.NOT.WITH.RECEIVABLE.ACCOUNT',
  VENDORS_NOT_WITH_PAYABLE_ACCOUNT: 'VENDORS.NOT.WITH.PAYABLE.ACCOUNT',
  PAYABLE_ENTRIES_HAS_NO_VENDORS: 'PAYABLE.ENTRIES.HAS.NO.VENDORS',
  RECEIVABLE_ENTRIES_HAS_NO_CUSTOMERS: 'RECEIVABLE.ENTRIES.HAS.NO.CUSTOMERS',
  CREDIT_DEBIT_SUMATION_SHOULD_NOT_EQUAL_ZERO:
    'CREDIT.DEBIT.SUMATION.SHOULD.NOT.EQUAL.ZERO',
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

  // #withDashboard
  changePageTitle,
  changePageSubtitle,

  // #withSettings
  journalNextNumber,
  journalNumberPrefix,
  
  // #withManualJournals
  nextJournalNumberChanged,

  setJournalNumberChanged,

  manualJournalId,
  manualJournal,
  onFormSubmit,
  onCancelForm,
}) {
  const { formatMessage } = useIntl();
  const {
    setFiles,
    saveMedia,
    deletedFiles,
    setDeletedFiles,
    deleteMedia,
  } = useMedia({
    saveCallback: requestSubmitMedia,
    deleteCallback: requestDeleteMedia,
  });

  const handleDropFiles = useCallback((_files) => {
    setFiles(_files.filter((file) => file.uploaded === false));
  }, []);

  const savedMediaIds = useRef([]);
  const clearSavedMediaIds = () => {
    savedMediaIds.current = [];
  };

  useEffect(() => {
    if (manualJournal && manualJournal.id) {
      changePageTitle(formatMessage({ id: 'edit_journal' }));
      changePageSubtitle(`No. ${manualJournal.journal_number}`);
    } else {
      changePageTitle(formatMessage({ id: 'new_journal' }));
    }
  }, [changePageTitle, changePageSubtitle, manualJournal, formatMessage]);

  const validationSchema = Yup.object().shape({
    journal_number: Yup.string()
      .required()
      .min(1)
      .max(255)
      .label(formatMessage({ id: 'journal_number_' })),
    journal_type: Yup.string()
      .required()
      .min(1)
      .max(255)
      .label(formatMessage({ id: 'journal_type' })),
    date: Yup.date()
      .required()
      .label(formatMessage({ id: 'date' })),
    reference: Yup.string().min(1).max(255),
    description: Yup.string().min(1).max(1024),
    entries: Yup.array().of(
      Yup.object().shape({
        credit: Yup.number().decimalScale(13).nullable(),
        debit: Yup.number().decimalScale(13).nullable(),
        account_id: Yup.number()
          .nullable()
          .when(['credit', 'debit'], {
            is: (credit, debit) => credit || debit,
            then: Yup.number().required(),
          }),
        contact_id: Yup.number().nullable(),
        contact_type: Yup.string().nullable(),
        note: Yup.string().max(255).nullable(),
      }),
    ),
  });

  const saveInvokeSubmit = useCallback(
    (payload) => {
      onFormSubmit && onFormSubmit(payload);
    },
    [onFormSubmit],
  );

  const [payload, setPayload] = useState({});

  const reorderingEntriesIndex = (entries) =>
    entries.map((entry, index) => ({
      ...entry,
      index: index + 1,
    }));

  const defaultEntry = useMemo(
    () => ({
      index: 0,
      account_id: null,
      credit: 0,
      debit: 0,
      contact_id: null,
      note: '',
    }),
    [],
  );

  const journalNumber = (journalNumberPrefix) ?
    `${journalNumberPrefix}-${journalNextNumber}` : journalNextNumber;

  const defaultInitialValues = useMemo(
    () => ({
      journal_number: journalNumber,
      journal_type: 'Journal',
      date: moment(new Date()).format('YYYY-MM-DD'),
      description: '',
      reference: '',
      entries: [...repeatValue(defaultEntry, 4)],
    }),
    [defaultEntry, journalNumber],
  );

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
            entries: reorderingEntriesIndex(defaultInitialValues.entries),
          }),
    }),
    [manualJournal, defaultInitialValues, defaultEntry],
  );

  const initialAttachmentFiles = useMemo(() => {
    return manualJournal && manualJournal.media
      ? manualJournal.media.map((attach) => ({
          preview: attach.attachment_file,
          uploaded: true,
          metadata: { ...attach },
        }))
      : [];
  }, [manualJournal]);

  // Transform API errors in toasts messages.
  const transformErrors = (resErrors, { setErrors, errors }) => {
    const getError = (errorType) => resErrors.find((e) => e.type === errorType);
    const toastMessages = [];
    let error;
    let newErrors = { ...errors, entries: [] };

    const setEntriesErrors = (indexes, prop, message) =>
      indexes.forEach((i) => {
        const index = Math.max(i - 1, 0);
        newErrors = setWith(newErrors, `entries.[${index}].${prop}`, message);
      });

    if ((error = getError(ERROR.PAYABLE_ENTRIES_HAS_NO_VENDORS))) {
      toastMessages.push(
        formatMessage({
          id: 'vendors_should_selected_with_payable_account_only',
        }),
      );
      setEntriesErrors(error.indexes, 'contact_id', 'error');
    }
    if ((error = getError(ERROR.RECEIVABLE_ENTRIES_HAS_NO_CUSTOMERS))) {
      toastMessages.push(
        formatMessage({
          id: 'should_select_customers_with_entries_have_receivable_account',
        }),
      );
      setEntriesErrors(error.indexes, 'contact_id', 'error');
    }
    if ((error = getError(ERROR.CUSTOMERS_NOT_WITH_RECEVIABLE_ACC))) {
      toastMessages.push(
        formatMessage({
          id: 'customers_should_selected_with_receivable_account_only',
        }),
      );
      setEntriesErrors(error.indexes, 'account_id', 'error');
    }
    if ((error = getError(ERROR.VENDORS_NOT_WITH_PAYABLE_ACCOUNT))) {
      toastMessages.push(
        formatMessage({
          id: 'vendors_should_selected_with_payable_account_only',
        }),
      );
      setEntriesErrors(error.indexes, 'account_id', 'error');
    }
    if ((error = getError(ERROR.JOURNAL_NUMBER_ALREADY_EXISTS))) {
      newErrors = setWith(
        newErrors,
        'journal_number',
        formatMessage({
          id: 'journal_number_is_already_used',
        }),
      );
    }
    setErrors({ ...newErrors });

    if (toastMessages.length > 0) {
      AppToaster.show({
        message: toastMessages.map((message) => {
          return <div>- {message}</div>;
        }),
        intent: Intent.DANGER,
      });
    }
  };

  const formik = useFormik({
    validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
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
      const form = { ...values, status: payload.publish, entries };

      const saveJournal = (mediaIds) =>
        new Promise((resolve, reject) => {
          const requestForm = { ...form, media_ids: mediaIds };

          if (manualJournal && manualJournal.id) {
            requestEditManualJournal(manualJournal.id, requestForm)
              .then((response) => {
                AppToaster.show({
                  message: formatMessage(
                    { id: 'the_journal_has_been_successfully_edited' },
                    { number: values.journal_number },
                  ),
                  intent: Intent.SUCCESS,
                });
                setSubmitting(false);
                saveInvokeSubmit({ action: 'update', ...payload });
                clearSavedMediaIds([]);
                resetForm();
                resolve(response);
              })
              .catch((errors) => {
                transformErrors(errors, { setErrors });
                setSubmitting(false);
              });
          } else {
            requestMakeJournalEntries(requestForm)
              .then((response) => {
                AppToaster.show({
                  message: formatMessage(
                    { id: 'the_journal_has_been_successfully_created' },
                    { number: values.journal_number },
                  ),
                  intent: Intent.SUCCESS,
                });
                setSubmitting(false);
                saveInvokeSubmit({ action: 'new', ...payload });
                clearSavedMediaIds();
                resetForm();
                resolve(response);
              })
              .catch((errors) => {
                transformErrors(errors, { setErrors });
                setSubmitting(false);
              });
          }
        });

      Promise.all([saveMedia(), deleteMedia()])
        .then(([savedMediaResponses]) => {
          const mediaIds = savedMediaResponses.map((res) => res.data.media.id);
          savedMediaIds.current = mediaIds;

          return savedMediaResponses;
        })
        .then(() => {
          return saveJournal(savedMediaIds.current);
        });
    },
  });

  useEffect(() => {
    formik.setFieldValue('journal_number', journalNumber);
    setJournalNumberChanged(false);
  }, [nextJournalNumberChanged, journalNumber]);

  const handleSubmitClick = useCallback(
    (payload) => {
      setPayload(payload);
      // formik.resetForm();
      formik.handleSubmit();
    },
    [setPayload, formik],
  );

  const handleCancelClick = useCallback(
    (payload) => {
      onCancelForm && onCancelForm(payload);
    },
    [onCancelForm],
  );

  const handleDeleteFile = useCallback(
    (_deletedFiles) => {
      _deletedFiles.forEach((deletedFile) => {
        if (deletedFile.uploaded && deletedFile.metadata.id) {
          setDeletedFiles([...deletedFiles, deletedFile.metadata.id]);
        }
      });
    },
    [setDeletedFiles, deletedFiles],
  );

  // Handle click on add a new line/row.
  const handleClickAddNewRow = () => {
    formik.setFieldValue(
      'entries',
      reorderingEntriesIndex([...formik.values.entries, defaultEntry]),
    );
  };

  // Handle click `Clear all lines` button.
  const handleClickClearLines = () => {
    formik.setFieldValue(
      'entries',
      reorderingEntriesIndex([...repeatValue(defaultEntry, 4)]),
    );
  };

  return (
    <div class="make-journal-entries">
      <form onSubmit={formik.handleSubmit}>
        <MakeJournalEntriesHeader formik={formik} />

        <MakeJournalEntriesTable
          values={formik.values.entries}
          formik={formik}
          defaultRow={defaultEntry}
          onClickClearAllLines={handleClickClearLines}
          onClickAddNewRow={handleClickAddNewRow}
        />
        <MakeJournalEntriesFooter
          formik={formik}
          onSubmitClick={handleSubmitClick}
          onCancelClick={handleCancelClick}
          manualJournal={manualJournal}
        />
      </form>

      <Dragzone
        initialFiles={initialAttachmentFiles}
        onDrop={handleDropFiles}
        onDeleteFile={handleDeleteFile}
        hint={'Attachments: Maxiumum size: 20MB'}
      />
    </div>
  );
}

export default compose(
  withJournalsActions,
  withManualJournalDetail,
  withManualJournals(({ nextJournalNumberChanged }) => ({
    nextJournalNumberChanged,
  })),
  withAccountsActions,
  withDashboardActions,
  withMediaActions,
  withSettings(({ manualJournalsSettings }) => ({
    journalNextNumber: manualJournalsSettings.nextNumber,
    journalNumberPrefix: manualJournalsSettings.numberPrefix
  })),
  withManualJournalsActions,
)(MakeJournalEntriesForm);
