import React, {
  useMemo,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import moment from 'moment';
import { Intent, FormGroup, TextArea } from '@blueprintjs/core';
import { useParams, useHistory } from 'react-router-dom';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { pick, values } from 'lodash';

import PaymentReceiveHeader from './PaymentReceiveFormHeader';
import PaymentReceiveItemsTable from './PaymentReceiveItemsTable';
import PaymentReceiveFloatingActions from './PaymentReceiveFloatingActions';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withPaymentReceivesActions from './withPaymentReceivesActions';
import withInvoices from '../Invoice/withInvoices';
import withPaymentReceiveDetail from './withPaymentReceiveDetail';
import withPaymentReceives from './withPaymentReceives';
import { AppToaster } from 'components';
import Dragzone from 'components/Dragzone';
import useMedia from 'hooks/useMedia';

import { compose, repeatValue } from 'utils';

const MIN_LINES_NUMBER = 5;

function PaymentReceiveForm({
  //#withMedia
  requestSubmitMedia,
  requestDeleteMedia,

  //#WithPaymentReceiveActions
  requestSubmitPaymentReceive,
  requestEditPaymentReceive,

  //#withDashboard
  changePageTitle,
  changePageSubtitle,

  //#withPaymentReceiveDetail
  paymentReceive,
  paymentReceiveInvoices,
  paymentReceivesItems,

  //#OWn Props
  // payment_receive,
  onFormSubmit,
  onCancelForm,
  dueInvoiceLength,
  onCustomerChange,
}) {
  const { formatMessage } = useIntl();
  const [payload, setPayload] = useState({});
  const { id } = useParams();
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

  const savedMediaIds = useRef([]);
  const clearSavedMediaIds = () => {
    savedMediaIds.current = [];
  };

  useEffect(() => {
    if (paymentReceive && paymentReceive.id) {
      return;
    } else {
      onCustomerChange && onCustomerChange(formik.values.customer_id);
    }
  });

  useEffect(() => {
    if (paymentReceive && paymentReceive.id) {
      changePageTitle(formatMessage({ id: 'edit_payment_receive' }));
    } else {
      changePageTitle(formatMessage({ id: 'payment_receive' }));
    }
  }, [changePageTitle, paymentReceive, formatMessage]);

  const validationSchema = Yup.object().shape({
    customer_id: Yup.string()
      .label(formatMessage({ id: 'customer_name_' }))
      .required(),
    payment_date: Yup.date()
      .required()
      .label(formatMessage({ id: 'payment_date_' })),
    deposit_account_id: Yup.number()
      .required()
      .label(formatMessage({ id: 'deposit_account_' })),
    // receive_amount: Yup.number()
    //   .required()
    //   .label(formatMessage({ id: 'receive_amount_' })),
    payment_receive_no: Yup.number()
      .required()
      .label(formatMessage({ id: 'payment_receive_no_' })),
    reference_no: Yup.string().min(1).max(255).nullable(),
    description: Yup.string().nullable(),
    entries: Yup.array().of(
      Yup.object().shape({
        payment_amount: Yup.number().nullable(),
        invoice_no: Yup.number().nullable(),
        balance: Yup.number().nullable(),
        due_amount: Yup.number().nullable(),
        invoice_date: Yup.date(),
        invoice_id: Yup.number()
          .nullable()
          .when(['payment_amount'], {
            is: (payment_amount) => payment_amount,
            then: Yup.number().required(),
          }),
      }),
    ),
  });

  const handleDropFiles = useCallback((_files) => {
    setFiles(_files.filter((file) => file.uploaded === false));
  }, []);

  const savePaymentReceiveSubmit = useCallback((payload) => {
    onFormSubmit && onFormSubmit(payload);
  });

  const defaultPaymentReceive = useMemo(
    () => ({
      invoice_id: '',
      invoice_date: moment(new Date()).format('YYYY-MM-DD'),
      invoice_no: '',
      balance: '',
      due_amount: '',
      payment_amount: '',
    }),
    [],
  );
  const defaultInitialValues = useMemo(
    () => ({
      customer_id: '',
      deposit_account_id: '',
      payment_date: moment(new Date()).format('YYYY-MM-DD'),
      reference_no: '',
      payment_receive_no: '',
      // receive_amount: '',
      description: '',
      entries: [...repeatValue(defaultPaymentReceive, MIN_LINES_NUMBER)],
    }),
    [defaultPaymentReceive],
  );

  const orderingIndex = (_entries) => {
    return _entries.map((item, index) => ({
      ...item,
      index: index + 1,
    }));
  };

  const initialValues = useMemo(
    () => ({
      ...(paymentReceive
        ? {
            ...pick(paymentReceive, Object.keys(defaultInitialValues)),
            entries: [
              ...paymentReceive.entries.map((paymentReceive) => ({
                ...pick(paymentReceive, Object.keys(defaultPaymentReceive)),
              })),
              ...repeatValue(
                defaultPaymentReceive,
                Math.max(MIN_LINES_NUMBER - paymentReceive.entries.length, 0),
              ),
            ],
          }
        : {
            ...defaultInitialValues,
            entries: orderingIndex(defaultInitialValues.entries),
          }),
    }),
    [paymentReceive, defaultInitialValues, defaultPaymentReceive],
  );

  const initialAttachmentFiles = useMemo(() => {
    return paymentReceive && paymentReceive.media
      ? paymentReceive.media.map((attach) => ({
          preview: attach.attachment_file,
          uploaded: true,
          metadata: { ...attach },
        }))
      : [];
  }, [paymentReceive]);

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      setSubmitting(true);
      const entries = formik.values.entries.filter((item) => {
        if (item.invoice_id !== undefined) {
          return { ...item };
        }
      });
      const form = {
        ...values,
        entries,
      };

      const requestForm = { ...form };

      if (paymentReceive && paymentReceive.id) {
        requestEditPaymentReceive(paymentReceive.id, requestForm)
          .then((response) => {
            AppToaster.show({
              message: formatMessage({
                id: 'the_payment_receive_has_been_successfully_edited',
              }),
              intent: Intent.SUCCESS,
            });
            setSubmitting(false);
            savePaymentReceiveSubmit({ action: 'update', ...payload });
            resetForm();
          })
          .catch((error) => {
            setSubmitting(false);
          });
      } else {
        requestSubmitPaymentReceive(requestForm)
          .then((response) => {
            AppToaster.show({
              message: formatMessage({
                id: 'the_payment_receive_has_been_successfully_created',
              }),
              intent: Intent.SUCCESS,
            });
            setSubmitting(false);
            resetForm();
            savePaymentReceiveSubmit({ action: 'new', ...payload });
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
        if (deletedFile.upload && deletedFile.metadata.id) {
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

  const handleClearClick = () => {
    formik.resetForm();
  };

  const handleClickAddNewRow = () => {
    formik.setFieldValue(
      'entries',
      orderingIndex([...formik.values.entries, defaultPaymentReceive]),
    );
  };

  const handleClearAllLines = () => {
    formik.setFieldValue(
      'entries',
      orderingIndex([...repeatValue(defaultPaymentReceive, MIN_LINES_NUMBER)]),
    );
  };
 
  return (
    <div className={'payment_receive_form'}>
      <form onSubmit={formik.handleSubmit}>
        <PaymentReceiveHeader formik={formik} />
        <PaymentReceiveItemsTable
          entries={formik.values.entries}
          customer_id={formik.values.customer_id}
          onClickAddNewRow={handleClickAddNewRow}
          onClickClearAllLines={handleClearAllLines}
          formik={formik}
          invoices={paymentReceiveInvoices}
        />
        {/* <Dragzone
          initialFiles={initialAttachmentFiles}
          onDrop={handleDropFiles}
          onDeleteFile={handleDeleteFile}
          hint={'Attachments: Maxiumum size: 20MB'}
        /> */}
      </form>

      <PaymentReceiveFloatingActions
        formik={formik}
        onSubmitClick={handleSubmitClick}
        paymentReceive={paymentReceive}
        onCancel={handleCancelClick}
        onClearClick={handleClearClick}
      />
    </div>
  );
}

export default compose(
  withPaymentReceivesActions,
  withDashboardActions,
  withMediaActions,
  withPaymentReceives(({ paymentReceivesItems }) => ({
    paymentReceivesItems,
  })),
  withPaymentReceiveDetail(),
)(PaymentReceiveForm);
