import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import moment from 'moment';
import { Intent, FormGroup, TextArea } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { pick } from 'lodash';
import { useQuery } from 'react-query';

import ExpenseFormHeader from './ExpenseFormHeader';
import ExpenseTable from './ExpenseTable';
import ExpenseFooter from './ExpenseFooter';

import withExpensesActions from 'containers/Expenses/withExpensesActions';
import withExpneseDetail from 'containers/Expenses/withExpenseDetail';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withMediaActions from 'containers/Media/withMediaActions';

import AppToaster from 'components/AppToaster';
import Dragzone from 'components/Dragzone';

import useMedia from 'hooks/useMedia';
import { compose } from 'utils';

function ExpenseForm({
  // #withMedia
  requestSubmitMedia,
  requestDeleteMedia,

  //#withExpensesActions
  requestSubmitExpense,
  requestEditExpense,
  requestFetchExpensesTable,
  // #withDashboard
  changePageTitle,
  changePageSubtitle,

  //#withExpenseDetail
  // @todo expenseDetail to expense
  expenseDetail,

  // #own Props
  expenseId,
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
    if (expenseDetail && expenseDetail.id) {
      changePageTitle(formatMessage({ id: 'edit_expense' }));
      changePageSubtitle(`No. ${expenseDetail.payment_account_id}`);
    } else {
      changePageTitle(formatMessage({ id: 'new_expense' }));
    }
  // @todo not functions just states.
  }, [changePageTitle, changePageSubtitle, expenseDetail, formatMessage]);

  const validationSchema = Yup.object().shape({
    beneficiary: Yup.string()
      // .required()
      .label(formatMessage({ id: 'beneficiary' })),
    payment_account_id: Yup.string()
      .required()
      .label(formatMessage({ id: 'payment_account_' })),
    payment_date: Yup.date()
      .required()
      .label(formatMessage({ id: 'payment_date_' })),
    reference_no: Yup.string(),
    currency_code: Yup.string().label(formatMessage({ id: 'currency_code' })),
    description: Yup.string()
      .trim()
      .label(formatMessage({ id: 'description' })),

    publish: Yup.boolean().label(formatMessage({ id: 'publish' })),
    categories: Yup.array().of(
      Yup.object().shape({
        index: Yup.number().nullable(),
        amount: Yup.number().nullable(),
        // @todo expense_account_id is required.
        expense_account_id: Yup.number().nullable(),
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

  const defaultCategory = useMemo(
    () => ({
      index: 0,
      amount: 0,
      expense_account_id: null,
      description: '',
    }),
    [],
  );

  const defaultInitialValues = useMemo(
    () => ({
      payment_account_id: '',
      beneficiary: '',
      payment_date: moment(new Date()).format('YYYY-MM-DD'),
      description: '',
      reference_no: '',
      currency_code: '',
      categories: [
        // @todo @mohamed index
        defaultCategory,
        defaultCategory,
        defaultCategory,
        defaultCategory,
      ],
    }),
    [defaultCategory],
  );

  const initialValues = useMemo(
    () => ({
      ...(expenseDetail
        ? {
            ...pick(expenseDetail, Object.keys(defaultInitialValues)),
            categories: expenseDetail.categories.map((category) => ({
              ...pick(category, Object.keys(defaultCategory)),
            })),
          }
        : {
            ...defaultInitialValues,
          }),
    }),
    [expenseDetail, defaultInitialValues, defaultCategory],
  );

  const initialAttachmentFiles = useMemo(() => {
    return expenseDetail && expenseDetail.media
      ? expenseDetail.media.map((attach) => ({
          preview: attach.attachment_file,
          uploaded: true,
          metadata: { ...attach },
        }))
      : [];
  }, [expenseDetail]);

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      const categories = values.categories.filter(
        (category) => category.amount || category.index,
      );
      const form = {
        ...values,
        published: payload.publish,
        categories,
      };

      const saveExpense = (mdeiaIds) =>
        new Promise((resolve, reject) => {
          const requestForm = { ...form, media_ids: mdeiaIds };

          if (expenseDetail && expenseDetail.id) {
            requestEditExpense(expenseDetail.id, requestForm)
              .then((response) => {
                AppToaster.show({
                  message: formatMessage(
                    { id: 'the_expense_has_been_successfully_edited' },
                    { number: values.payment_account_id },
                  ),
                  intent: Intent.SUCCESS,
                });
                setSubmitting(false);
                saveInvokeSubmit({ action: 'update', ...payload });
                clearSavedMediaIds([]);
                resetForm();
                resolve(response);
              })
              .catch((errors) => {
                // @todo handle errors.
                if (errors.find((e) => e.type === 'TOTAL.AMOUNT.EQUALS.ZERO')) {
                }
                setErrors(
                  AppToaster.show({
                    message: formatMessage({
                      id: 'total_amount_equals_zero',
                    }),
                    intent: Intent.DANGER,
                  }),
                );
                setSubmitting(false);
              });
          } else {
            requestSubmitExpense(requestForm)
              .then((response) => {
                AppToaster.show({
                  message: formatMessage(
                    { id: 'the_expense_has_been_successfully_created' },
                    { number: values.payment_account_id },
                  ),
                  intent: Intent.SUCCESS,
                });
                setSubmitting(false);
                saveInvokeSubmit({ action: 'new', ...payload });
                clearSavedMediaIds();
                resetForm();
                resolve(response);
              })
              .catch((errors) => {
                setSubmitting(false);
              });
          }
        });

      Promise.all([saveMedia(), deleteMedia()])
        .then(([savedMediaResponses]) => {
          const mediaIds = savedMediaResponses.map((res) => res.data.media.id);
          savedMediaIds.current = mediaIds;
          return savedMediaResponses;
        })
        .then(() => {
          return saveExpense(savedMediaIds.current);
        });
    },
  });

  console.log(formik.errors);

  const handleSubmitClick = useCallback(
    (payload) => {
      setPayload(payload);
      formik.handleSubmit();
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
  // @todo @mohamed
  const fetchHook = useQuery('expense-form', () => requestFetchExpensesTable());

  return (
    <div className={'dashboard__insider--expense-form'}>
      <form onSubmit={formik.handleSubmit}>
        <ExpenseFormHeader formik={formik} />

        <ExpenseTable
          initialValues={initialValues}
          formik={formik}
          defaultRow={defaultCategory}
        />

        <FormGroup
          label={<T id={'description'} />}
          className={'form-group--description'}
        >
          <TextArea
            growVertically={true}
            large={true}
            {...formik.getFieldProps('description')}
          />
        </FormGroup>

        <ExpenseFooter
          formik={formik}
          onSubmitClick={handleSubmitClick}
          onCancelClick={handleCancelClick}
        />
      </form>
      <Dragzone
        initialFiles={initialAttachmentFiles}
        onDrop={handleDropFiles}
        onDeleteFile={handleDeleteFile}
        hint={'Attachments: Maxiumum size: 20MB'}
      />
    </div>
  );
}

export default compose(
  withExpensesActions,
  withAccountsActions,
  withDashboardActions,
  withMediaActions,
  withExpneseDetail,
)(ExpenseForm);
