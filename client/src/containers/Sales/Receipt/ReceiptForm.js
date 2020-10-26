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
import { Row, Col } from 'react-grid-system';

import ReceiptFromHeader from './ReceiptFormHeader';
import EstimatesItemsTable from 'containers/Sales/Estimate/EntriesItemsTable';
import ReceiptFormFooter from './ReceiptFormFooter';

import withReceiptActions from './withReceiptActions';
import withReceiptDetail from './withReceiptDetail';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withSettings from 'containers/Settings/withSettings';

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
  requestEditReceipt,

  //#withReceiptDetail
  receipt,

  //#withDashboard
  changePageTitle,

  // #withSettings
  receiptNextNumber,
  receiptNumberPrefix,

  //#own Props
  receiptId,
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
    receipt_number: Yup.string()
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
    send_to_email: Yup.string().email().nullable(),
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
  const saveInvokeSubmit = useCallback(
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
      discount: 0,
      quantity: null,
      description: '',
    }),
    [],
  );

  const receiptNumber = receiptNumberPrefix
    ? `${receiptNumberPrefix}-${receiptNextNumber}`
    : receiptNextNumber;

  const defaultInitialValues = useMemo(
    () => ({
      customer_id: '',
      deposit_account_id: '',
      receipt_number: receiptNumber,
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
      ...(receipt
        ? {
            ...pick(receipt, Object.keys(defaultInitialValues)),
            entries: [
              ...receipt.entries.map((receipt) => ({
                ...pick(receipt, Object.keys(defaultReceipt)),
              })),
              ...repeatValue(
                defaultReceipt,
                Math.max(MIN_LINES_NUMBER - receipt.entries.length, 0),
              ),
            ],
          }
        : {
            ...defaultInitialValues,
            entries: orderingIndex(defaultInitialValues.entries),
          }),
    }),
    [receipt, defaultInitialValues, defaultReceipt],
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
    validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      const entries = values.entries.filter(
        (item) => item.item_id && item.quantity,
      );
      const form = {
        ...values,
        entries,
      };

      const requestForm = { ...form };

      if (receipt && receipt.id) {
        requestEditReceipt(receipt.id, requestForm).then(() => {
          AppToaster.show({
            message: formatMessage(
              {
                id: 'the_receipt_has_been_successfully_edited',
              },
              { number: values.receipt_number },
            ),
            intent: Intent.SUCCESS,
          });
          setSubmitting(false);
          saveInvokeSubmit({ action: 'update', ...payload });
          resetForm();
        });
      } else {
        requestSubmitReceipt(requestForm)
          .then((response) => {
            AppToaster.show({
              message: formatMessage(
                {
                  id: 'the_receipt_has_been_successfully_created',
                },
                { number: values.receipt_number },
              ),
              intent: Intent.SUCCESS,
            });
            setSubmitting(false);
            saveInvokeSubmit({ action: 'new', ...payload });
            resetForm();
          })
          .catch((errors) => {
            setSubmitting(false);
          });
      }
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

  useEffect(() => {
    formik.setFieldValue('receipt_number', receiptNumber);
  }, [receiptNumber]);

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

        <Row>
          <Col>
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
          </Col>

          <Col>
            <Dragzone
              initialFiles={initialAttachmentFiles}
              onDrop={handleDropFiles}
              onDeleteFile={handleDeleteFile}
              hint={'Attachments: Maxiumum size: 20MB'}
            />
          </Col>
        </Row>
      </form>
      <ReceiptFormFooter
        formik={formik}
        onSubmitClick={handleSubmitClick}
        receipt={receipt}
        onCancelForm={handleCancelClick}
      />
    </div>
  );
}

export default compose(
  withReceiptActions,
  withDashboardActions,
  withMediaActions,
  withReceiptDetail(),
  withSettings(({ receiptSettings }) => ({
    receiptNextNumber: receiptSettings?.next_number,
    receiptNumberPrefix: receiptSettings?.number_prefix,
  })),
)(ReceiptForm);
