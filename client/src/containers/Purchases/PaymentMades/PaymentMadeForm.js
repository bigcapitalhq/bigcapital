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

import PaymentMadeHeader from './PaymentMadeFormHeader';
import PaymentMadeItemsTable from './PaymentMadeItemsTable';
import PaymentMadeFooter from './PaymentMadeFormFooter';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withPaymentMadeActions from './withPaymentMadeActions';
import withPaymentMadeDetail from './withPaymentMadeDetail';
import withPaymentMade from './withPaymentMade';
import { AppToaster } from 'components';
import Dragzone from 'components/Dragzone';
import useMedia from 'hooks/useMedia';

import { compose, repeatValue } from 'utils';
import withSettings from 'containers/Settings/withSettings';

const MIN_LINES_NUMBER = 5;

function PaymentMadeForm({
  //#withMedia
  requestSubmitMedia,
  requestDeleteMedia,

  //#withPaymentMadesActions
  requestSubmitPaymentMade,
  requestEditPaymentMade,
  setPaymentNumberChange,

  // #withPaymentMade
  nextPaymentNumberChanged,

  // #withSettings
  paymentNextNumber,
  paymentNumberPrefix,

  //#withDashboard
  changePageTitle,
  changePageSubtitle,

  //#withPaymentMadeDetail
  paymentMade,

  onFormSubmit,
  onCancelForm,
  onVenderChange,
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
    onVenderChange && onVenderChange(formik.values.vendor_id);
  });

  useEffect(() => {
    if (paymentMade && paymentMade.id) {
      changePageTitle(formatMessage({ id: 'edit_payment_made' }));
    } else {
      changePageTitle(formatMessage({ id: 'payment_made' }));
    }
  }, [changePageTitle, paymentMade, formatMessage]);

  const validationSchema = Yup.object().shape({
    vendor_id: Yup.string()
      .label(formatMessage({ id: 'vendor_name_' }))
      .required(),
    payment_date: Yup.date()
      .required()
      .label(formatMessage({ id: 'payment_date_' })),
    payment_account_id: Yup.number()
      .required()
      .label(formatMessage({ id: 'payment_account_' })),
    payment_number: Yup.string()
      .required()
      .label(formatMessage({ id: 'payment_no_' })),
    reference: Yup.string().min(1).max(255).nullable(),
    description: Yup.string(),
    entries: Yup.array().of(
      Yup.object().shape({
        payment_amount: Yup.number().nullable(),
        bill_number: Yup.number().nullable(),
        amount: Yup.number().nullable(),
        due_amount: Yup.number().nullable(),
        bill_date: Yup.date(),
        bill_id: Yup.number()
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

  const savePaymentMadeSubmit = useCallback((payload) => {
    onFormSubmit && onFormSubmit(payload);
  });

  const defaultPaymentMade = useMemo(
    () => ({
      bill_id: '',
      bill_date: moment(new Date()).format('YYYY-MM-DD'),
      bill_number: '',
      amount: '',
      due_amount: '',
      payment_amount: '',
    }),
    [],
  );

  const paymentNumber = paymentNumberPrefix
    ? `${paymentNumberPrefix}-${paymentNextNumber}`
    : paymentNextNumber;

  const defaultInitialValues = useMemo(
    () => ({
      vendor_id: '',
      payment_account_id: '',
      payment_date: moment(new Date()).format('YYYY-MM-DD'),
      reference: '',
      payment_number: paymentNumber,
      // receive_amount: '',
      description: '',
      entries: [...repeatValue(defaultPaymentMade, MIN_LINES_NUMBER)],
    }),
    [defaultPaymentMade],
  );

  const orderingIndex = (_entries) => {
    return _entries.map((item, index) => ({
      ...item,
      index: index + 1,
    }));
  };

  const initialValues = useMemo(
    () => ({
      ...(paymentMade
        ? {
            ...pick(paymentMade, Object.keys(defaultInitialValues)),
            entries: [
              ...paymentMade.entries.map((paymentMade) => ({
                ...pick(paymentMade, Object.keys(defaultPaymentMade)),
              })),
              ...repeatValue(
                defaultPaymentMade,
                Math.max(MIN_LINES_NUMBER - paymentMade.entries.length, 0),
              ),
            ],
          }
        : {
            ...defaultInitialValues,
            entries: orderingIndex(defaultInitialValues.entries),
          }),
    }),
    [paymentMade, defaultInitialValues, defaultPaymentMade],
  );

  const initialAttachmentFiles = useMemo(() => {
    return paymentMade && paymentMade.media
      ? paymentMade.media.map((attach) => ({
          preview: attach.attachment_file,
          uploaded: true,
          metadata: { ...attach },
        }))
      : [];
  }, [paymentMade]);

  const formik = useFormik({
    validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      setSubmitting(true);
      const entries = formik.values.entries.filter((item) => {
        if (item.bill_id !== undefined) {
          return { ...item };
        }
      });
      const form = {
        ...values,
        entries,
      };

      const requestForm = { ...form };

      if (paymentMade && paymentMade.id) {
        requestEditPaymentMade(paymentMade.id, requestForm)
          .then((response) => {
            AppToaster.show({
              message: formatMessage({
                id: 'the_payment_made_has_been_successfully_edited',
              }),
              intent: Intent.SUCCESS,
            });
            setSubmitting(false);
            savePaymentMadeSubmit({ action: 'update', ...payload });
            resetForm();
          })
          .catch((error) => {
            setSubmitting(false);
          });
      } else {
        requestSubmitPaymentMade(requestForm)
          .then((response) => {
            AppToaster.show({
              message: formatMessage({
                id: 'the_payment_made_has_been_successfully_created',
              }),
              intent: Intent.SUCCESS,
            });
            setSubmitting(false);
            resetForm();
            savePaymentMadeSubmit({ action: 'new', ...payload });
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

  const handleClickAddNewRow = () => {
    formik.setFieldValue(
      'entries',
      orderingIndex([...formik.values.entries, defaultPaymentMade]),
    );
  };

  const handleClearAllLines = () => {
    formik.setFieldValue(
      'entries',
      orderingIndex([...repeatValue(defaultPaymentMade, MIN_LINES_NUMBER)]),
    );
  };

  useEffect(() => {
    formik.setFieldValue('payment_number', paymentNumber);
    setPaymentNumberChange(false);
  }, [nextPaymentNumberChanged, paymentNumber]);

  return (
    <div className={'payment_made_form'}>
      <form onSubmit={formik.handleSubmit}>
        <PaymentMadeHeader formik={formik} />
        <PaymentMadeItemsTable
          formik={formik}
          entries={formik.values.entries}
          vendor_id={formik.values.vendor_id}
          onClickAddNewRow={handleClickAddNewRow}
          onClickClearAllLines={handleClearAllLines}
        />

        {/* <Dragzone
          initialFiles={initialAttachmentFiles}
          onDrop={handleDropFiles}
          onDeleteFile={handleDeleteFile}
          hint={'Attachments: Maxiumum size: 20MB'}
        /> */}
      </form>
      <PaymentMadeFooter
        formik={formik}
        onSubmitClick={handleSubmitClick}
        onCancel={handleCancelClick}
      />
    </div>
  );
}

export default compose(
  withPaymentMadeActions,
  withDashboardActions,
  withMediaActions,
  withPaymentMadeDetail(),
  withPaymentMade(({ nextPaymentNumberChanged }) => ({
    nextPaymentNumberChanged,
  })),
  withSettings(({ billPaymentSettings }) => ({
    paymentNextNumber: billPaymentSettings?.next_number,
    paymentNumberPrefix: billPaymentSettings?.number_prefix,
  })),
)(PaymentMadeForm);
