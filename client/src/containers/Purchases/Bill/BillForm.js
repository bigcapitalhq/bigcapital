import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Formik, Form } from 'formik';
import moment from 'moment';
import { Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { pick, sumBy, omit } from 'lodash';
import { CLASSES } from 'common/classes';

import { EditBillFormSchema, CreateBillFormSchema } from './BillForm.schema';
import BillFormHeader from './BillFormHeader';
import BillFloatingActions from './BillFloatingActions';
import BillFormFooter from './BillFormFooter';
import EditableItemsEntriesTable from 'containers/Entries/EditableItemsEntriesTable';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withBillActions from './withBillActions';
import withBillDetail from './withBillDetail';

import { AppToaster } from 'components';

import { ERROR } from 'common/errors';
import { compose, repeatValue, defaultToTransform, orderingLinesIndexes } from 'utils';

const MIN_LINES_NUMBER = 5;

const defaultBill = {
  index: 0,
  item_id: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
};

const defaultInitialValues = {
  vendor_id: '',
  bill_number: '',
  bill_date: moment(new Date()).format('YYYY-MM-DD'),
  due_date: moment(new Date()).format('YYYY-MM-DD'),
  reference_no: '',
  note: '',
  entries: [...repeatValue(defaultBill, MIN_LINES_NUMBER)],
};

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
  const history = useHistory();

  const [submitPayload, setSubmitPayload] = useState({});
  const isNewMode = !billId;

  useEffect(() => {
    if (bill && bill.id) {
      changePageTitle(formatMessage({ id: 'edit_bill' }));
    } else {
      changePageTitle(formatMessage({ id: 'new_bill' }));
    }
  }, [changePageTitle, bill, formatMessage]);

  // Initial values in create and edit mode.
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
      entries: entries.map((entry) => ({ ...omit(entry, ['total']) })),
    };
    // Handle the request success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: formatMessage(
          {
            id: isNewMode
              ? 'the_bill_has_been_successfully_created'
              : 'the_bill_has_been_successfully_edited',
          },
          { number: values.bill_number },
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      resetForm();
      changePageSubtitle('');

      if (submitPayload.redirect) {
        history.go('/bills');
      }
    };
    // Handle the request error.
    const onError = (errors) => {
      handleErrors(errors, { setErrors });
      setSubmitting(false);
    };
    if (isNewMode) {
      requestEditBill(bill.id, form).then(onSuccess).catch(onError);
    } else {
      requestSubmitBill(form).then(onSuccess).catch(onError);
    }
  };

  // Handle bill number changed once the field blur.
  const handleBillNumberChanged = useCallback(
    (billNumber) => {
      changePageSubtitle(billNumber);
    },
    [changePageSubtitle],
  );

  // Clear page subtitle once unmount bill form page.
  useEffect(
    () => () => {
      changePageSubtitle('');
    },
    [changePageSubtitle],
  );

  const handleSubmitClick = useCallback(() => {
    setSubmitPayload({ redirect: true });
  }, [setSubmitPayload]);

  const handleCancelClick = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <div className={classNames(CLASSES.PAGE_FORM, CLASSES.PAGE_FORM_BILL)}>
      <Formik
        validationSchema={isNewMode ? CreateBillFormSchema : EditBillFormSchema}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <BillFormHeader onBillNumberChanged={handleBillNumberChanged} />
            <EditableItemsEntriesTable
              defaultEntry={defaultBill}
              filterPurchasableItems={true}
            />
            <BillFormFooter
              oninitialFiles={[]}
              // onDropFiles={handleDeleteFile}
            />
            <BillFloatingActions
              isSubmitting={isSubmitting}
              billId={billId}
              onSubmitClick={handleSubmitClick}
              onCancelForm={handleCancelClick}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default compose(
  withBillActions,
  withBillDetail(),
  withDashboardActions,
  withMediaActions,
)(BillForm);
