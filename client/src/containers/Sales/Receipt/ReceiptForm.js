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
import { pick,sumBy } from 'lodash';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';
import { ERROR } from 'common/errors';
import ReceiptFromHeader from './ReceiptFormHeader';
import EntriesItemsTable from 'containers/Sales/Estimate/EntriesItemsTable';
import ReceiptReceiveFloatingActions from './ReceiptReceiveFloatingActions';

import withReceiptActions from './withReceiptActions';
import withReceiptDetail from './withReceiptDetail';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withSettings from 'containers/Settings/withSettings';

import { AppToaster, Row, Col } from 'components';
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
    statement: Yup.string()
      .trim()
      .min(1)
      .max(1024)
      .label(formatMessage({ id: 'note' })),

    entries: Yup.array().of(
      Yup.object().shape({
        quantity: Yup.number()
          .nullable()
          .when(['rate'], {
            is: (rate) => rate,
            then: Yup.number().required(),
          }),
        rate: Yup.number().nullable(),
        item_id: Yup.number()
          .nullable()
          .when(['quantity', 'rate'], {
            is: (quantity, rate) => quantity || rate,
            then: Yup.number().required(),
          }),
        discount: Yup.number().nullable().min(0).max(100),
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

  const handleErrors = (errors, { setErrors }) => {
    if (errors.some((e) => e.type === ERROR.SALE_RECEIPT_NUMBER_NOT_UNIQUE)) {
      setErrors({
        receipt_number: formatMessage({
          id: 'sale_receipt_number_not_unique',
        }),
      });
    }
  };
  const formik = useFormik({
    validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: (values, { setErrors, setSubmitting, resetForm }) => {
      const entries = values.entries.filter(
        (item) => item.item_id && item.quantity,
      );

      const totalQuantity = sumBy(entries, (entry) => parseInt(entry.quantity));

      if (totalQuantity === 0) {
        AppToaster.show({
          message: formatMessage({
            id: 'quantity_cannot_be_zero_or_empty',
          }),
          intent: Intent.DANGER,
        });
        setSubmitting(false);
        return;
      }
      const form = {
        ...values,
        entries,
      };

      const requestForm = { ...form };

      if (receipt && receipt.id) {
        requestEditReceipt(receipt.id, requestForm)
          .then(() => {
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
          })
          .catch((errors) => {
            handleErrors(errors, { setErrors });
            setSubmitting(false);
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
            handleErrors(errors, { setErrors });
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
    <div className={classNames(CLASSES.PAGE_FORM_RECEIPT, CLASSES.PAGE_FORM)}>
      <form onSubmit={formik.handleSubmit}>
        <ReceiptFromHeader formik={formik} />

        <EntriesItemsTable
          entries={formik.values.entries}
          onClickAddNewRow={handleClickAddNewRow}
          onClickClearAllLines={handleClearAllLines}
          formik={formik}
        />

        <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
          <Row>
            <Col md={8}>
              <FormGroup
                label={<T id={'receipt_message'} />}
                className={'form-group--receipt_message'}
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

            <Col md={4}>
              <Dragzone
                initialFiles={initialAttachmentFiles}
                onDrop={handleDropFiles}
                onDeleteFile={handleDeleteFile}
                hint={'Attachments: Maxiumum size: 20MB'}
              />
            </Col>
          </Row>
        </div>
      </form>
      <ReceiptReceiveFloatingActions
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
  withReceiptDetail(),
  withDashboardActions,
  withMediaActions,
  withSettings(({ receiptSettings }) => ({
    receiptNextNumber: receiptSettings?.nextNumber,
    receiptNumberPrefix: receiptSettings?.numberPrefix,
  })),
)(ReceiptForm);
