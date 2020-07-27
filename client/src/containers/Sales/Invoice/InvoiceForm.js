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
import { Intent, FormGroup, TextArea, Button } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { pick, omit } from 'lodash';

import InvoiceFormHeader from './InvoiceFormHeader';
import EstimatesItemsTable from 'containers/Sales/Estimate/EntriesItemsTable';
import InvoiceFormFooter from './InvoiceFormFooter';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withInvoiceActions from './withInvoiceActions';

import { AppToaster } from 'components';
import Dragzone from 'components/Dragzone';
import useMedia from 'hooks/useMedia';

import { compose, repeatValue } from 'utils';

const MIN_LINES_NUMBER = 4;

function InvoiceForm({
  //#WithMedia
  requestSubmitMedia,
  requestDeleteMedia,

  //#WithInvoiceActions
  requestSubmitInvoice,
  
  //#withDashboard
  changePageTitle,
  changePageSubtitle,

  //#withInvoiceDetail
  invoice,

  //#own Props
  InvoiceId,
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
    if (invoice && invoice.id) {
      changePageTitle(formatMessage({ id: 'edit_invoice' }));
    } else {
      changePageTitle(formatMessage({ id: 'new_invoice' }));
    }
  }, [changePageTitle, invoice, formatMessage]);

  const validationSchema = Yup.object().shape({
    customer_id: Yup.string()
      .label(formatMessage({ id: 'customer_name_' }))
      .required(),
    invoice_date: Yup.date()
      .required()
      .label(formatMessage({ id: 'invoice_date_' })),
    due_date: Yup.date()
      .required()
      .label(formatMessage({ id: 'due_date_' })),
    invoice_no: Yup.number()
      .required()
      .label(formatMessage({ id: 'invoice_no_' })),
    reference_no: Yup.string().min(1).max(255),
    status: Yup.string().required(),
    invoice_message: Yup.string()
      .trim()
      .min(1)
      .max(1024)
      .label(formatMessage({ id: 'note' })),
    terms_conditions: Yup.string()
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

  const saveInvokeSubmit = useCallback(
    (payload) => {
      onFormSubmit && onFormSubmit(payload);
    },
    [onFormSubmit],
  );

  const defaultInvoice = useMemo(
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
      invoice_date: moment(new Date()).format('YYYY-MM-DD'),
      due_date: moment(new Date()).format('YYYY-MM-DD'),
      status: 'status',
      invoice_no: '',
      reference_no: '',
      invoice_message: '',
      terms_conditions: '',
      entries: [...repeatValue(defaultInvoice, MIN_LINES_NUMBER)],
    }),
    [defaultInvoice],
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
    [defaultInvoice, defaultInitialValues, invoice],
  );

  const initialAttachmentFiles = useMemo(() => {
    return invoice && invoice.media
      ? invoice.media.map((attach) => ({
          preview: attach.attachment_file,
          uploaded: true,
          metadata: { ...attach },
        }))
      : [];
  }, [invoice]);

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
      const saveInvoice = (mediaIds) =>
        new Promise((resolve, reject) => {
          const requestForm = { ...form, media_ids: mediaIds };

          requestSubmitInvoice(requestForm)
            .then((response) => {
              AppToaster.show({
                message: formatMessage(
                  { id: 'the_invocie_has_been_successfully_created' },
                  { number: values.invoice_no },
                ),
                intent: Intent.SUCCESS,
              });
              setSubmitting(false);
              resetForm();
              saveInvokeSubmit({ action: 'new', ...payload });
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
          return saveInvoice(savedMediaIds.current);
        });
    },
  });
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

  console.log(formik.errors, 'Errors');
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

  const handleClickAddNewRow = () => {
    formik.setFieldValue(
      'entries',
      orderingIndex([...formik.values.entries, defaultInvoice]),
    );
  };

  const handleClearAllLines = () => {
    formik.setFieldValue(
      'entries',
      orderingIndex([...repeatValue(defaultInvoice, MIN_LINES_NUMBER)]),
    );
  };

  return (
    <div className={'invoice-form'}>
      <form onSubmit={formik.handleSubmit}>
        <InvoiceFormHeader formik={formik} />
        <EstimatesItemsTable
          entries={formik.values.entries}
          onClickAddNewRow={handleClickAddNewRow}
          onClickClearAllLines={handleClearAllLines}
          formik={formik}
        />
        <FormGroup
          label={<T id={'invoice_message'} />}
          className={'form-group--customer_note'}
        >
          <TextArea
            growVertically={true}
            {...formik.getFieldProps('invoice_message')}
          />
        </FormGroup>
        <FormGroup
          label={<T id={'terms_conditions'} />}
          className={'form-group--terms_conditions'}
        >
          <TextArea
            growVertically={true}
            {...formik.getFieldProps('terms_conditions')}
          />
        </FormGroup>
        <Dragzone
          initialFiles={initialAttachmentFiles}
          onDrop={handleDropFiles}
          onDeleteFile={handleDeleteFile}
          hint={'Attachments: Maxiumum size: 20MB'}
        />

        <InvoiceFormFooter
          formik={formik}
          onSubmitClick={handleSubmitClick}
          onCancelClick={handleCancelClick}
        />
      </form>
    </div>
  );
}

export default compose(
  withInvoiceActions,
  withDashboardActions,
  withMediaActions,
)(InvoiceForm);
