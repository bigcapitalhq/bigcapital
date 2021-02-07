import React, { useMemo, useCallback, useEffect } from 'react';
import { Formik, Form } from 'formik';
import moment from 'moment';
import { Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { pick, sumBy, isEmpty, omit } from 'lodash';
import { CLASSES } from 'common/classes';

import { EditBillFormSchema, CreateBillFormSchema } from './BillForm.schema';
import BillFormHeader from './BillFormHeader';
import BillFloatingActions from './BillFloatingActions';
import BillFormFooter from './BillFormFooter';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { AppToaster } from 'components';

import { ERROR } from 'common/errors';
import { compose, repeatValue, orderingLinesIndexes } from 'utils';
import BillFormBody from './BillFormBody';
import { useBillFormContext } from './BillFormProvider';

const MIN_LINES_NUMBER = 5;

const defaultBill = {
  index: 0,
  item_id: '',
  rate: '',
  discount: 0,
  quantity: 1,
  description: '',
};

const defaultInitialValues = {
  vendor_id: '',
  bill_number: '',
  bill_date: moment(new Date()).format('YYYY-MM-DD'),
  due_date: moment(new Date()).format('YYYY-MM-DD'),
  reference_no: '',
  note: '',
  open: '',
  entries: [...repeatValue(defaultBill, MIN_LINES_NUMBER)],
};

/**
 * Bill form.
 */
function BillForm({
  //#withDashboard
  changePageTitle,
  changePageSubtitle,
}) {
  const { formatMessage } = useIntl();
  const history = useHistory();

  const {
    bill,
    billId,
    submitPayload,
    createBillMutate,
    editBillMutate,
  } = useBillFormContext();

  const isNewMode = !billId;

  useEffect(() => {
    if (!isNewMode) {
      changePageTitle(formatMessage({ id: 'edit_bill' }));
    } else {
      changePageTitle(formatMessage({ id: 'new_bill' }));
    }
  }, [changePageTitle, isNewMode, formatMessage]);

  // Initial values in create and edit mode.
  const initialValues = useMemo(
    () => ({
      ...(!isEmpty(bill)
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
            entries: orderingLinesIndexes(defaultInitialValues.entries),
          }),
    }),
    [bill],
  );

  // Transform response error to fields.
  const handleErrors = (errors, { setErrors }) => {
    if (errors.some((e) => e.type === ERROR.BILL_NUMBER_EXISTS)) {
      setErrors({
        bill_number: formatMessage({ id: 'bill_number_exists' }),
      });
    }
  };

  // Handles form submit.
  const handleFormSubmit = (
    values,
    { setSubmitting, setErrors, resetForm },
  ) => {
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
      open: submitPayload.status,
      entries: entries.map((entry) => ({ ...omit(entry, ['total']) })),
    };
    // Handle the request success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: formatMessage(
          {
            id: isNewMode
              ? 'the_bill_has_been_created_successfully'
              : 'the_bill_has_been_edited_successfully',
          },
          { number: values.bill_number },
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      changePageSubtitle('');

      if (submitPayload.redirect) {
        history.push('/bills');
      }
      if (submitPayload.resetForm) {
        resetForm();
      }
    };
    // Handle the request error.
    const onError = (errors) => {
      handleErrors(errors, { setErrors });
      setSubmitting(false);
    };
    if (bill && bill.id) {
      editBillMutate(bill.id, form).then(onSuccess).catch(onError);
    } else {
      createBillMutate(form).then(onSuccess).catch(onError);
    }
  };

  // Handle bill number changed once the field blur.
  const handleBillNumberChanged = useCallback(
    (billNumber) => {
      changePageSubtitle(billNumber);
    },
    [changePageSubtitle],
  );

  return (
    <div
      className={classNames(
        CLASSES.PAGE_FORM,
        CLASSES.PAGE_FORM_STRIP_STYLE,
        CLASSES.PAGE_FORM_BILL,
      )}
    >
      <Formik
        validationSchema={isNewMode ? CreateBillFormSchema : EditBillFormSchema}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <Form>
          <BillFormHeader onBillNumberChanged={handleBillNumberChanged} />
          <BillFormBody defaultBill={defaultBill} />
          <BillFormFooter />
          <BillFloatingActions />
        </Form>
      </Formik>
    </div>
  );
}

export default compose(withDashboardActions)(BillForm);
