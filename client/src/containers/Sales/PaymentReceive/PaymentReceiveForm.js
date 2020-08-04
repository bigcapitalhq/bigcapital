import React, { useMemo, useCallback, useEffect, useState,useRef } from 'react';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import moment from 'moment';
import { Intent, FormGroup, TextArea } from '@blueprintjs/core';

import { FormattedMessage as T, useIntl } from 'react-intl';

import PaymentReceiveHeader from './PaymentReceiveFormHeader';
// PaymentReceiptItemsTable
import PaymentReceiveFooter from './PaymentReceiveFormFooter';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withPaymentReceivesActions from './withPaymentReceivesActions'

import { AppToaster } from 'components';
import Dragzone from 'components/Dragzone';
import useMedia from 'hooks/useMedia';

import { compose, repeatValue } from 'utils';

const MIN_LINES_NUMBER = 4;

function PaymentReceiveForm({
  //#withMedia
  requestSubmitMedia,
  requestDeleteMedia,
  
  //#WithPaymentReceiveActions
  requestSubmitPaymentReceive,


  //#withDashboard
  changePageTitle,
  changePageSubtitle,

  //#withPaymentReceiveDetail

  //#OWn Props
  payment_receive,
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

  const savedMediaIds = useRef([]);
  const clearSavedMediaIds = () => {
    savedMediaIds.current = [];
  };

  useEffect(() => {
    if (payment_receive && payment_receive.id) {
      changePageTitle(formatMessage({ id: 'edit_payment_receive' }));
    } else {
      changePageTitle(formatMessage({ id: 'new_payment_receive' }));
    }
  }, [changePageTitle, payment_receive, formatMessage]);

  const validationSchema = Yup.object().shape({
    customer_id: Yup.string()
      .label(formatMessage({ id: 'customer_name_' }))
      .required(),
    deposit_account_id: Yup.number()
      .required()
      .label(formatMessage({ id: 'deposit_account_' })),
    payment_date: Yup.date()
      .required()
      .label(formatMessage({ id: 'payment_date_' })),
    payment_receive_no: Yup.number()
      .required()
      .label(formatMessage({ id: 'payment_receive_no_' })),
    reference_no: Yup.string().min(1).max(255),
    statement: Yup.string()
      .trim()
      .min(1)
      .max(1024)
      .label(formatMessage({ id: 'statement' })),

    entries: Yup.array().of(
      Yup.object().shape({
        payment_amount: Yup.number().nullable(),
        item_id: Yup.number()
          .nullable()
          .when(['payment_amount'], {
            is: (payment_amount) => payment_amount,
            then: Yup.number().required(),
          }),
        description: Yup.string().nullable(),
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
      item_id: null,
      payment_amount: null,
      description: null,
    }),
    [],
  );
  const defaultInitialValues = useMemo(
    () => ({
      customer_id: '',
      deposit_account_id: '',
      payment_date: moment(new Date()).format('YYYY-MM-DD'),
      reference_no: '',
      statement: '',
      entries: [...repeatValue(defaultPaymentReceive, MIN_LINES_NUMBER)],
    }),
    [defaultPaymentReceive],
  );

  const initialValues = useMemo(
    () => ({
      ...defaultInitialValues,
      entries: defaultInitialValues.entries,
    }),
    [defaultPaymentReceive, defaultInitialValues, payment_receive],
  );

  const initialAttachmentFiles = useMemo(() => {
    return payment_receive && payment_receive.media
      ? payment_receive.media.map((attach) => ({
          preview: attach.attachment_file,
          uploaded: true,
          metadata: { ...attach },
        }))
      : [];
  }, [payment_receive]);

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      const form = {
        ...values,
      };
      const savePaymentReceive = (mediaIds) =>
        new Promise((resolve, reject) => {
          const requestForm = { ...form, media_ids: mediaIds };

          requestSubmitPaymentReceive(requestForm)
            .the((response) => {
              AppToaster.show({
                message: formatMessage({
                  id: 'the_payment_receive_has_been_successfully_created',
                }),
                intent: Intent.SUCCESS,
              });
              setSubmitting(false);
              clearSavedMediaIds();
              savePaymentReceiveSubmit({ action: 'new', ...payload });
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
          return savePaymentReceive(savedMediaIds.current);
        });
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

  return (
    <div className={'payment_receive_form'}>
      <form onSubmit={formik.handleSubmit}>
        <PaymentReceiveHeader formik={formik} />
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
        <PaymentReceiveFooter
          formik={formik}
          onSubmit={handleSubmitClick}
          onCancel={handleCancelClick}
          onClearClick={handleClearClick}
        />
      </form>
    </div>
  );
}

export default compose(
  withPaymentReceivesActions,
  withDashboardActions,
  withMediaActions,
)(PaymentReceiveForm);
