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
import classNames from 'classnames';
import { CLASSES } from 'common/classes';

import InvoiceFormHeader from './InvoiceFormHeader';
import EntriesItemsTable from 'containers/Sales/Estimate/EntriesItemsTable';
import InvoiceFloatingActions from './InvoiceFloatingActions';

import withInvoiceActions from './withInvoiceActions';
import withInvoiceDetail from './withInvoiceDetail';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withSettings from 'containers/Settings/withSettings';

import { AppToaster, Col, Row } from 'components';
import Dragzone from 'components/Dragzone';
import useMedia from 'hooks/useMedia';
import { ERROR } from 'common/errors';

import { compose, repeatValue } from 'utils';

const MIN_LINES_NUMBER = 4;

function InvoiceForm({
  //#WithMedia
  requestSubmitMedia,
  requestDeleteMedia,

  //#WithInvoiceActions
  requestSubmitInvoice,
  requestEditInvoice,

  //#withDashboard
  changePageTitle,

  // #withSettings
  invoiceNextNumber,
  invoiceNumberPrefix,

  //#withInvoiceDetail
  invoice,

  //#own Props
  invoiceId,
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
    invoice_no: Yup.string()
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
      discount: 0,
      quantity: null,
      description: '',
    }),
    [],
  );

  const invoiceNumber = invoiceNumberPrefix
    ? `${invoiceNumberPrefix}-${invoiceNextNumber}`
    : invoiceNextNumber;

  const defaultInitialValues = useMemo(
    () => ({
      customer_id: '',
      invoice_date: moment(new Date()).format('YYYY-MM-DD'),
      due_date: moment(new Date()).format('YYYY-MM-DD'),
      status: 'SEND',
      invoice_no: invoiceNumber,
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
      ...(invoice
        ? {
            ...pick(invoice, Object.keys(defaultInitialValues)),
            entries: [
              ...invoice.entries.map((invoice) => ({
                ...pick(invoice, Object.keys(defaultInvoice)),
              })),
              ...repeatValue(
                defaultInvoice,
                Math.max(MIN_LINES_NUMBER - invoice.entries.length, 0),
              ),
            ],
          }
        : {
            ...defaultInitialValues,
            entries: orderingIndex(defaultInitialValues.entries),
          }),
    }),
    [invoice, defaultInitialValues, defaultInvoice],
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

  const handleErrors = (errors, { setErrors }) => {
    if (errors.some((e) => e.type === ERROR.SALE_INVOICE_NUMBER_IS_EXISTS)) {
      setErrors({
        invoice_no: formatMessage({
          id: 'sale_invoice_number_is_exists',
        }),
      });
    }
  };

  const formik = useFormik({
    validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      setSubmitting(true);

      const entries = values.entries.filter(
        (item) => item.item_id && item.quantity,
      );
      const form = {
        ...values,
        entries,
      };

      const requestForm = { ...form };
      if (invoice && invoice.id) {
        requestEditInvoice(invoice.id, requestForm)
          .then((response) => {
            AppToaster.show({
              message: formatMessage(
                {
                  id: 'the_invoice_has_been_successfully_edited',
                },
                { number: values.invoice_no },
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
  useEffect(() => {
    formik.setFieldValue('invoice_no', invoiceNumber);
  }, [invoiceNumber]);

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
    <div className={classNames(CLASSES.PAGE_FORM, CLASSES.PAGE_FORM_INVOICE)}>
      <form onSubmit={formik.handleSubmit}>
        <InvoiceFormHeader formik={formik} />
        <EntriesItemsTable
          entries={formik.values.entries}
          onClickAddNewRow={handleClickAddNewRow}
          onClickClearAllLines={handleClearAllLines}
          formik={formik}
        />

        <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
          <Row>
            <Col md={8}>
              {/* --------- Invoice message --------- */}
              <FormGroup
                label={<T id={'invoice_message'} />}
                className={'form-group--invoice_message'}
              >
                <TextArea
                  growVertically={true}
                  {...formik.getFieldProps('invoice_message')}
                />
              </FormGroup>

              {/* --------- Terms and conditions --------- */}
              <FormGroup
                label={<T id={'terms_conditions'} />}
                className={'form-group--terms_conditions'}
              >
                <TextArea
                  growVertically={true}
                  {...formik.getFieldProps('terms_conditions')}
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

      <InvoiceFloatingActions
        formik={formik}
        onSubmitClick={handleSubmitClick}
        invoice={invoice}
        onCancelClick={handleCancelClick}
      />
    </div>
  );
}

export default compose(
  withInvoiceActions,
  withDashboardActions,
  withMediaActions,
  withInvoiceDetail(),

  withSettings(({ invoiceSettings }) => ({
    invoiceNextNumber: invoiceSettings?.nextNumber,
    invoiceNumberPrefix: invoiceSettings?.numberPrefix,
  })),
)(InvoiceForm);
