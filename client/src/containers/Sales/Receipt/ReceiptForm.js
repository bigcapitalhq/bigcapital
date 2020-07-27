import React, {
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import moment from 'moment';
import { Intent, FormGroup, TextArea } from '@blueprintjs/core';

import { FormattedMessage as T, useIntl } from 'react-intl';
import { pick } from 'lodash';

import ReceiptFromHeader from './ReceiptFormHeader';
import EstimatesItemsTable from 'containers/Sales/Estimate/EntriesItemsTable';
import ReceiptFormFooter from './ReceiptFormFooter';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withReceipActions from './withReceipActions';

import { AppToaster } from 'components';
import Dragzone from 'components/Dragzone';
import useMedia from 'hooks/useMedia';

import { compose, repeatValue } from 'utils';

const MIN_LINES_NUMBER = 4;

function ReceiptForm({
  //#withMedia
  requestSubmitMedia,
  requestDeleteMedia,

  //#withReceiptActions
  requestSubmitReceipt,

  //#withDashboard
  changePageTitle,
  changePageSubtitle,

  //#withReceiptDetail
  receipt,

  //#own Props
  receiptId,
  onFormSubmit,
  onCancelForm,
}) {
  const { formatMessage } = useIntl();
  const [payload, setPaload] = useState({});

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
    if (receipt && receipt.id) {
      changePageTitle(formatMessage({ id: 'edit_receipt' }));
    } else {
      changePageTitle(formatMessage({ id: 'new_receipt' }));
    }
  }, [changePageTitle, receipt, formatMessage]);

  const validationSchema = Yup.object().shape({
    customer_id: Yup.string()
      .label(formatMessage({ id: 'customer_name_' }))
      .required(),
    receipt_date: Yup.date()
      .required()
      .label(formatMessage({ id: 'receipt_date_' })),
    receipt_no: Yup.number()
      .required()
      .label(formatMessage({ id: 'receipt_no_' })),
    deposit_account_id: Yup.number()
      .required()
      .label(formatMessage({ id: 'deposit_account_' })),
    reference_no: Yup.string().min(1).max(255),
    receipt_message: Yup.string()
      .trim()
      .min(1)
      .max(1024)
      .label(formatMessage({ id: 'receipt_message_' })),
    send_to_email: Yup.string().email(),
    statement: Yup.string()
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
        discount: Yup.number().nullable(),
        description: Yup.string().nullable(),
      }),
    ),
  });
  const saveReceiptSubmit = useCallback(
    (payload) => {
      onFormSubmit && onFormSubmit(payload);
    },
    [onFormSubmit],
  );

  const defaultReceipt = useMemo(
    () => ({
      index: 0,
      item_id: null,
      rate: null,
      discount: null,
      quantity: null,
      description: '',
    }),
    [],
  );

  const defaultInitialValues = useMemo(
    () => ({
      customer_id: '',
      deposit_account_id: '',
      receipt_date: moment(new Date()).format('YYYY-MM-DD'),
      send_to_email: '',
      reference_no: '',
      receipt_message: '',
      statement: '',
      entries: [...repeatValue(defaultReceipt, MIN_LINES_NUMBER)],
    }),
    [defaultReceipt],
  );

  const orderingIndex = (_receipt) => {
    return _receipt.map((item, index) => ({
      ...item,
      index: index + 1,
    }));
  };

  const initialValues = useMemo(
    () => ({
      ...defaultInitialValues,
      entries: orderingIndex(defaultInitialValues.entries),
    }),
    [defaultReceipt, defaultInitialValues, receipt],
  );

  const initialAttachmentFiles = useMemo(() => {
    return receipt && receipt.media
      ? receipt.media.map((attach) => ({
          preview: attach.attachment_file,
          uploaded: true,
          metadata: { ...attach },
        }))
      : [];
  }, [receipt]);

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      const entries = values.entries.map(
        ({ item_id, quantity, rate, description }) => ({
          item_id,
          quantity,
          rate,
          description,
        }),
      );
      const form = {
        ...values,
        entries,
      };

      const saveReceipt = (mediaIds) =>
        new Promise((resolve, reject) => {
          const requestForm = { ...form, media_ids: mediaIds };

          requestSubmitReceipt(requestForm)
            .then((resposne) => {
              AppToaster.show({
                message: formatMessage({
                  id: 'the_receipt_has_been_successfully_created',
                }),
                intent: Intent.SUCCESS,
              });
              setSubmitting(false);
              resetForm();
              saveReceiptSubmit({ action: 'new', ...payload });
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
          return saveReceipt(saveReceipt.current);
        });
    },
  });

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

  const handleSubmitClick = useCallback(
    (payload) => {
      setPaload(payload);
      formik.submitForm();
    },
    [setPaload, formik],
  );

  const handleCancelClick = useCallback(
    (payload) => {
      onCancelForm && onCancelForm(payload);
    },
    [onCancelForm],
  );

  const handleClickAddNewRow = () => {
    formik.setFieldValue(
      'entries',
      orderingIndex([...formik.values.entries, defaultReceipt]),
    );
  };

  const handleClearAllLines = () => {
    formik.setFieldValue(
      'entries',
      orderingIndex([...repeatValue(defaultReceipt, MIN_LINES_NUMBER)]),
    );
  };

  return (
    <div className={'receipt-form'}>
      <form onSubmit={formik.handleSubmit}>
        <ReceiptFromHeader formik={formik} />

        <EstimatesItemsTable
          entries={formik.values.entries}
          onClickAddNewRow={handleClickAddNewRow}
          onClickClearAllLines={handleClearAllLines}
          formik={formik}
        />
        <FormGroup
          label={<T id={'receipt_message'} />}
          className={'form-group--'}
        >
          <TextArea
            growVertically={true}
            {...formik.getFieldProps('receipt_message')}
          />
        </FormGroup>
        <FormGroup
          label={<T id={'statement'} />}
          className={'form-group--statement'}
        >
          <TextArea
            growVertically={true}
            {...formik.getFieldProps('statement')}
          />
        </FormGroup>

        <Dragzone
          initialFiles={initialAttachmentFiles}
          onDrop={handleDropFiles}
          onDeleteFile={handleDeleteFile}
          hint={'Attachments: Maxiumum size: 20MB'}
        />
        <ReceiptFormFooter
          formik={formik}
          onSubmit={handleSubmitClick}
          onCancelForm={handleCancelClick}
        />
      </form>
    </div>
  );
}

export default compose(
  withReceipActions,
  withDashboardActions,
  withMediaActions,
)(ReceiptForm);
