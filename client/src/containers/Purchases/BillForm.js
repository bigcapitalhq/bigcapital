import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import moment from 'moment';
import { Intent, FormGroup, TextArea } from '@blueprintjs/core';

import { FormattedMessage as T, useIntl } from 'react-intl';
import { pick, omit } from 'lodash';

import BillFormHeader from './BillFormHeader';
import EstimatesItemsTable from 'containers/Sales/Estimate/EntriesItemsTable';
import BillFormFooter from './BillFormFooter';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withBillActions from './withBillActions';

import { AppToaster } from 'components';
import Dragzone from 'components/Dragzone';
import useMedia from 'hooks/useMedia';

import { compose, repeatValue } from 'utils';

const MIN_LINES_NUMBER = 4;

function BillForm({
  //#WithMedia
  requestSubmitMedia,
  requestDeleteMedia,

  //#withBillActions
  requestSubmitBill,

  //#withDashboard
  changePageTitle,
  changePageSubtitle,

  //#withBillDetail
  bill,

  //#Own Props
  onFormSubmit,
  onCancelForm,
}) {
  const { formatMessage } = useIntl();
  const [payload, setPayload] = useState({});

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
    if (bill && bill.id) {
      changePageTitle(formatMessage({ id: 'edit_bill' }));
    } else {
      changePageTitle(formatMessage({ id: 'new_bill' }));
    }
  });

  const validationSchema = Yup.object().shape({
    vendor_id: Yup.number()
      .required()
      .label(formatMessage({ id: 'vendor_name_' })),
    bill_date: Yup.date()
      .required()
      .label(formatMessage({ id: 'bill_date_' })),
    due_date: Yup.date()
      .required()
      .label(formatMessage({ id: 'due_date_' })),
    bill_number: Yup.number()
      .required()
      .label(formatMessage({ id: 'bill_number_' })),
    reference_no: Yup.string().min(1).max(255),
    status: Yup.string().required(),
    note: Yup.string()
      .trim()
      .min(1)
      .max(1024)
      .label(formatMessage({ id: 'note' })),

    entries: Yup.array().of(
      Yup.object().shape({
        quantity: Yup.number().nullable(),
        rate: Yup.number().nullable(),
        item_id: Yup.number()
          .nullable()
          .when(['quantity', 'rate'], {
            is: (quantity, rate) => quantity || rate,
            then: Yup.number().required(),
          }),
        total: Yup.number().nullable(),
        discount: Yup.number().nullable(),
        description: Yup.string().nullable(),
      }),
    ),
  });

  const saveBillSubmit = useCallback(
    (payload) => {
      onFormSubmit && onFormSubmit(payload);
    },
    [onFormSubmit],
  );

  const defaultBill = useMemo(() => ({
    index: 0,
    item_id: null,
    rate: null,
    discount: null,
    quantity: null,
    description: '',
    status: '',
  }));

  const defaultInitialValues = useMemo(
    () => ({
      accept: '',
      vendor_name: '',
      bill_number: '',
      bill_date: moment(new Date()).format('YYYY-MM-DD'),
      due_date: moment(new Date()).format('YYYY-MM-DD'),
      reference_no: '',
      note: '',
      entries: [...repeatValue(defaultBill, MIN_LINES_NUMBER)],
    }),
    [defaultBill],
  );

  const orderingIndex = (_invoice) => {
    return _invoice.map((item, index) => ({
      ...item,
      index: index + 1,
    }));
  };

  const initialValues = useMemo(
    () => ({
      ...defaultInitialValues,
      entries: orderingIndex(defaultInitialValues.entries),
    }),
    [defaultInitialValues],
  );

  const initialAttachmentFiles = useMemo(() => {
    return bill && bill.media
      ? bill.media.map((attach) => ({
          preview: attach.attachment_file,
          uploaded: true,
          metadata: { ...attach },
        }))
      : [];
  }, [bill]);

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      setSubmitting(true);
      const entries = values.entries.map((item) => omit(item, ['total']));

      const form = {
        ...values,
        entries,
      };
      const saveBill = (mediaIds) =>
        new Promise((resolve, reject) => {
          const requestForm = { ...form, media_ids: mediaIds };

          requestSubmitBill(requestForm)
            .then((response) => {
              AppToaster.show({
                message: formatMessage(
                  { id: 'the_bill_has_been_successfully_created' },
                  { number: values.bill_number },
                ),
                intent: Intent.SUCCESS,
              });
              setSubmitting(false);
              resetForm();
              saveBillSubmit({ action: 'new', ...payload });
              clearSavedMediaIds();
            })
            .catch((errors) => {
              setSubmitting(false);
            });
        });

      Promise.all([saveMedia(), deleteMedia()])
        .then(([savedMediaResponses]) => {
          const mediaIds = savedMediaResponses.map((res) => res.data.media.id);
          savedMediaIds.current = mediaIds;
          return savedMediaResponses;
        })
        .then(() => {
          return saveBill(savedMediaIds.current);
        });
    },
  });

  const handleSubmitClick = useCallback(
    (payload) => {
      setPayload(payload);
      formik.submitForm();
    },
    [setPayload, formik],
  );

  const handleCancelClick = useCallback(
    (payload) => {
      onCancelForm && onCancelForm(payload);
    },
    [onCancelForm],
  );

  console.log(formik.errors, 'Bill');
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

  const onClickCleanAllLines = () => {
    formik.setFieldValue(
      'entries',
      orderingIndex([...repeatValue(defaultBill, MIN_LINES_NUMBER)]),
    );
  };

  const onClickAddNewRow = () => {
    formik.setFieldValue(
      'entries',
      orderingIndex([...formik.values.entries, defaultBill]),
    );
  };

  return (
    <div className={'bill-form'}>
      <form onSubmit={formik.handleSubmit}>
        <BillFormHeader formik={formik} />
        <EstimatesItemsTable
          formik={formik}
          entries={formik.values.entries}
          onClickAddNewRow={onClickAddNewRow}
          onClickClearAllLines={onClickCleanAllLines}
        />
        <FormGroup label={<T id={'note'} />} className={'form-group--'}>
          <TextArea growVertically={true} {...formik.getFieldProps('note')} />
        </FormGroup>
        <Dragzone
          initialFiles={initialAttachmentFiles}
          onDrop={handleDropFiles}
          onDeleteFile={handleDeleteFile}
          hint={'Attachments: Maxiumum size: 20MB'}
        />
        <BillFormFooter
          formik={formik}
          onSubmit={handleSubmitClick}
          onCancelClick={handleCancelClick}
        />
      </form>
    </div>
  );
}

export default compose(
  withBillActions,
  withDashboardActions,
  withMediaActions,
)(BillForm);
