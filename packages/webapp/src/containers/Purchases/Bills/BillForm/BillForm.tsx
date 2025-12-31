// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { CLASSES } from '@/constants/classes';
import { css } from '@emotion/css';

import { EditBillFormSchema, CreateBillFormSchema } from './BillForm.schema';
import BillFormHeader from './BillFormHeader';
import BillFloatingActions from './BillFloatingActions';
import BillFormFooter from './BillFormFooter';
import BillItemsEntriesEditor from './BillItemsEntriesEditor';
import BillFormTopBar from './BillFormTopBar';

import { AppToaster, Box } from '@/components';
import { PageForm } from '@/components/PageForm';
import { useBillFormContext } from './BillFormProvider';
import { compose, safeSumBy } from '@/utils';
import {
  defaultBill,
  filterNonZeroEntries,
  transformToEditForm,
  transformFormValuesToRequest,
  handleErrors,
} from './utils';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';
import { BillFormEntriesActions } from './BillFormEntriesActions';

/**
 * Bill form.
 */
function BillForm({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const history = useHistory();

  // Bill form context.
  const { bill, isNewMode, submitPayload, createBillMutate, editBillMutate, taxRates } =
    useBillFormContext();

  // Initial values in create and edit mode.
  const initialValues = useMemo(
    () => ({
      ...(!isEmpty(bill)
        ? {
            ...transformToEditForm(bill, taxRates),
          }
        : {
            ...defaultBill,
            currency_code: base_currency,
          }),
    }),
    [bill, base_currency, taxRates],
  );

  // Handles form submit.
  const handleFormSubmit = (
    values,
    { setSubmitting, setErrors, resetForm },
  ) => {
    const entries = filterNonZeroEntries(values.entries);
    const totalQuantity = safeSumBy(entries, 'quantity');

    if (totalQuantity === 0) {
      AppToaster.show({
        message: intl.get('quantity_cannot_be_zero_or_empty'),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }
    const form = {
      ...transformFormValuesToRequest(values),
      open: submitPayload.status,
    };
    // Handle the request success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_bill_has_been_created_successfully'
            : 'the_bill_has_been_edited_successfully',
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      if (submitPayload.redirect) {
        history.push('/bills');
      }
      if (submitPayload.resetForm) {
        resetForm();
      }
    };
    // Handle the request error.
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      handleErrors(errors, { setErrors });
      setSubmitting(false);
    };
    if (isNewMode) {
      createBillMutate(form).then(onSuccess).catch(onError);
    } else {
      editBillMutate([bill.id, form]).then(onSuccess).catch(onError);
    }
  };

  return (
    <Formik
      validationSchema={isNewMode ? CreateBillFormSchema : EditBillFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
    >
      <Form
        className={css({
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        })}
      >
        <PageForm flex={1}>
          <PageForm.Body>
            <BillFormTopBar />
            <BillFormHeader />

            <Box p="18px 32px 0">
              <BillFormEntriesActions />
              <BillItemsEntriesEditor />
            </Box>
            <BillFormFooter />
          </PageForm.Body>

          <PageForm.Footer>
            <BillFloatingActions />
          </PageForm.Footer>
        </PageForm>
      </Form>
    </Formik>
  );
}
export default compose(withCurrentOrganization())(BillForm);
