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
import { Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { pick } from 'lodash';
import { CLASSES } from 'common/classes';

import BillFormHeader from './BillFormHeader';
import EstimatesItemsTable from 'containers/Sales/Estimate/EntriesItemsTable';
import BillFloatingActions from './BillFloatingActions';
import BillFormFooter from './BillFormFooter';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withBillActions from './withBillActions';
import withBillDetail from './withBillDetail';

import { AppToaster } from 'components';
import useMedia from 'hooks/useMedia';
import { ERROR } from 'common/errors';
import { compose, repeatValue } from 'utils';

const MIN_LINES_NUMBER = 5;

function BillForm({
  //#WithMedia
  requestSubmitMedia,
  requestDeleteMedia,

  //#withBillActions
  requestSubmitBill,
  requestEditBill,
  setBillNumberChanged,

  //#withDashboard
  changePageTitle,
  changePageSubtitle,

  //#withBillDetail
  bill,

  //#Own Props
  billId,
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
  }, [changePageTitle, bill, formatMessage]);

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
    bill_number: Yup.string()
      .required()
      .label(formatMessage({ id: 'bill_number_' })),
    reference_no: Yup.string().nullable().min(1).max(255),
    // status: Yup.string().required().nullable(),
    note: Yup.string()
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
        total: Yup.number().nullable(),
        discount: Yup.number().nullable().min(0).max(100),
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

  const defaultBill = useMemo(
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

  const defaultInitialValues = useMemo(
    () => ({
      vendor_id: '',
      bill_number: '',
      bill_date: moment(new Date()).format('YYYY-MM-DD'),
      due_date: moment(new Date()).format('YYYY-MM-DD'),
      // status: 'Bill',
      reference_no: '',
      note: '',
      entries: [...repeatValue(defaultBill, MIN_LINES_NUMBER)],
    }),
    [defaultBill],
  );

  const orderingIndex = (_bill) => {
    return _bill.map((item, index) => ({
      ...item,
      index: index + 1,
    }));
  };

  const initialValues = useMemo(
    () => ({
      ...(bill
        ? {
            ...pick(bill, Object.keys(defaultInitialValues)),
            entries: [
              ...bill.entries.map((bill) => ({
                ...pick(bill, Object.keys(defaultBill)),
              })),
              ...repeatValue(
                defaultBill,
                Math.max(MIN_LINES_NUMBER - bill.entries.length, 0),
              ),
            ],
          }
        : {
            ...defaultInitialValues,
            entries: orderingIndex(defaultInitialValues.entries),
          }),
    }),
    [bill, defaultInitialValues, defaultBill],
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

  const handleErrors = (errors, { setErrors }) => {
    if (errors.some((e) => e.type === ERROR.BILL_NUMBER_EXISTS)) {
      setErrors({
        bill_number: formatMessage({
          id: 'bill_number_exists',
        }),
      });
    }
  };

  const formik = useFormik({
    validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: (values, { setSubmitting, setErrors, resetForm }) => {
      setSubmitting(true);

      const form = {
        ...values,
        entries: values.entries.filter((item) => item.item_id && item.quantity),
      };
      const requestForm = { ...form };
      if (bill && bill.id) {
        requestEditBill(bill.id, requestForm)
          .then((response) => {
            AppToaster.show({
              message: formatMessage(
                {
                  id: 'the_bill_has_been_successfully_edited',
                },
                { number: values.bill_number },
              ),
              intent: Intent.SUCCESS,
            });
            setSubmitting(false);
            saveBillSubmit({ action: 'update', ...payload });
            resetForm();
            changePageSubtitle('');
          })
          .catch((errors) => {
            handleErrors(errors, { setErrors });
            setSubmitting(false);
          });
      } else {
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
            saveBillSubmit({ action: 'new', ...payload });
            resetForm();
          })
          .catch((errors) => {
            handleErrors(errors, { setErrors });
            setSubmitting(false);
          });
      }
    },
  });

  const handleSubmitClick = useCallback(
    (payload) => {
      setPayload(payload);
      formik.submitForm();
      formik.setSubmitting(false);
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

  const handleBillNumberChanged = useCallback((billNumber) => {
    changePageSubtitle(billNumber);
  }, []);

  // Clear page subtitle once unmount bill form page.
  useEffect(() => () => {
    changePageSubtitle('');
  }, [changePageSubtitle]);

  return (
    <div className={classNames(CLASSES.PAGE_FORM, CLASSES.PAGE_FORM_BILL)}>
      <form onSubmit={formik.handleSubmit}>
        <BillFormHeader
          formik={formik}
          onBillNumberChanged={handleBillNumberChanged} />

        <EstimatesItemsTable
          formik={formik}
          entries={formik.values.entries}
          onClickAddNewRow={onClickAddNewRow}
          onClickClearAllLines={onClickCleanAllLines}
        />
        <BillFormFooter
          formik={formik}
          oninitialFiles={initialAttachmentFiles}
          onDropFiles={handleDeleteFile}
        />
      </form>
      <BillFloatingActions
        formik={formik}
        onSubmitClick={handleSubmitClick}
        bill={bill}
        onCancelClick={handleCancelClick}
      />
    </div>
  );
}

export default compose(
  withBillActions,
  withBillDetail(),
  withDashboardActions,
  withMediaActions,
)(BillForm);
