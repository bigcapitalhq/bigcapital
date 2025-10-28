// @ts-nocheck
import intl from 'react-intl-universal';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import { sumBy, isEmpty } from 'lodash';
import { useHistory } from 'react-router-dom';
import { css } from '@emotion/css';

import {
  EditReceiptFormSchema,
  CreateReceiptFormSchema,
} from './ReceiptForm.schema';

import { useReceiptFormContext } from './ReceiptFormProvider';

import ReceiptFromHeader from './ReceiptFormHeader';
import ReceiptItemsEntriesEditor from './ReceiptItemsEntriesEditor';
import ReceiptFormFloatingActions from './ReceiptFormFloatingActions';
import { ReceiptFormFooter } from './ReceiptFormFooter';
import ReceiptFormDialogs from './ReceiptFormDialogs';
import ReceiptFormTopBar from './ReceiptFormTopbar';

import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import withSettings from '@/containers/Settings/withSettings';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

import { AppToaster } from '@/components';
import { compose, orderingLinesIndexes, transactionNumber } from '@/utils';
import {
  transformToEditForm,
  defaultReceipt,
  handleErrors,
  transformFormValuesToRequest,
  resetFormState,
} from './utils';
import {
  ReceiptSyncAutoExRateToForm,
  ReceiptSyncIncrementSettingsToForm,
} from './components';
import { PageForm } from '@/components/PageForm';

/**
 * Receipt form.
 */
function ReceiptFormRoot({
  // #withSettings
  receiptNextNumber,
  receiptNumberPrefix,
  receiptAutoIncrement,
  receiptTermsConditions,
  receiptMessage,
  preferredDepositAccount,

  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const history = useHistory();

  // Receipt form context.
  const {
    receipt,
    editReceiptMutate,
    createReceiptMutate,
    submitPayload,
    isNewMode,
    saleReceiptState,
  } = useReceiptFormContext();

  // The next receipt number.
  const nextReceiptNumber = transactionNumber(
    receiptNumberPrefix,
    receiptNextNumber,
  );
  // Initial values in create and edit mode.
  const initialValues = {
    ...(!isEmpty(receipt)
      ? { ...transformToEditForm(receipt) }
      : {
          ...defaultReceipt,
          ...(receiptAutoIncrement && {
            receipt_number: nextReceiptNumber,
          }),
          deposit_account_id: parseInt(preferredDepositAccount),
          entries: orderingLinesIndexes(defaultReceipt.entries),
          currency_code: base_currency,
          receipt_message: receiptMessage,
          terms_conditions: receiptTermsConditions,
          pdf_template_id: saleReceiptState?.defaultTemplateId,
        }),
  };
  // Handle the form submit.
  const handleFormSubmit = (
    values,
    { setErrors, setSubmitting, resetForm },
  ) => {
    const entries = values.entries.filter(
      (item) => item.item_id && item.quantity,
    );
    const totalQuantity = sumBy(entries, (entry) => parseInt(entry.quantity));

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
      closed: submitPayload.status,
    };
    // Handle the request success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_receipt_has_been_created_successfully'
            : 'the_receipt_has_been_edited_successfully',
          { number: values.receipt_number },
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      if (submitPayload.redirect) {
        history.push('/receipts');
      }
      if (submitPayload.resetForm) {
        resetFormState();
      }
    };

    // Handle the request error.
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      if (errors) {
        handleErrors(errors, { setErrors });
      }
      setSubmitting(false);
    };
    if (!isNewMode) {
      editReceiptMutate([receipt.id, form]).then(onSuccess).catch(onError);
    } else {
      createReceiptMutate(form).then(onSuccess).catch(onError);
    }
  };

  return (
    <Formik
      validationSchema={
        isNewMode ? CreateReceiptFormSchema : EditReceiptFormSchema
      }
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
            <ReceiptFormTopBar />
            <ReceiptFromHeader />
            <ReceiptItemsEntriesEditor />
            <ReceiptFormFooter />
          </PageForm.Body>

          <PageForm.Footer>
            <ReceiptFormFloatingActions />
          </PageForm.Footer>
        </PageForm>

        {/*---------- Dialogs ---------*/}
        <ReceiptFormDialogs />

        {/*---------- Effects ---------*/}
        <ReceiptSyncIncrementSettingsToForm />
        <ReceiptSyncAutoExRateToForm />
      </Form>
    </Formik>
  );
}

export const ReceiptForm = compose(
  withDashboardActions,
  withSettings(({ receiptSettings }) => ({
    receiptNextNumber: receiptSettings?.nextNumber,
    receiptNumberPrefix: receiptSettings?.numberPrefix,
    receiptAutoIncrement: receiptSettings?.autoIncrement,
    receiptMessage: receiptSettings?.receiptMessage,
    receiptTermsConditions: receiptSettings?.termsConditions,
    preferredDepositAccount: receiptSettings?.preferredDepositAccount,
  })),
  withCurrentOrganization(),
)(ReceiptFormRoot);
