import { Intent } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { Formik, Form, FormikHelpers } from 'formik';
import { sumBy, isEmpty } from 'lodash';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import {
  ReceiptSyncAutoExRateToForm,
  ReceiptSyncIncrementSettingsToForm,
} from './components';
import {
  EditReceiptFormSchema,
  CreateReceiptFormSchema,
} from './ReceiptForm.schema';
import { ReceiptFormDialogs } from './ReceiptFormDialogs';
import { ReceiptFormFloatingActions } from './ReceiptFormFloatingActions';
import { ReceiptFormFooter } from './ReceiptFormFooter';
import { ReceiptFormHeader as ReceiptFromHeader } from './ReceiptFormHeader';
import { useReceiptFormContext } from './ReceiptFormProvider';
import { ReceiptFormTopBar } from './ReceiptFormTopbar';
import { ReceiptItemsEntriesEditor } from './ReceiptItemsEntriesEditor';
import {
  transformToEditForm,
  defaultReceipt,
  handleErrors,
  transformFormValuesToRequest,
  resetFormState,
} from './utils';
import type { ReceiptFormValues } from './utils';
import { AppToaster } from '@/components';
import { PageForm } from '@/components/PageForm';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { compose, orderingLinesIndexes, transactionNumber } from '@/utils';

type ReceiptFormRootProps = Record<string, never>;

/**
 * Receipt form.
 */
function ReceiptFormRoot({}: ReceiptFormRootProps) {
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const history = useHistory();

  // Receipt form context.
  const {
    receipt,
    editReceiptMutate,
    createReceiptMutate,
    submitPayload,
    isNewMode,
    saleReceiptState,
    receiptSettings,
  } = useReceiptFormContext();

  const receiptNextNumber = receiptSettings?.nextNumber as number | undefined;
  const receiptNumberPrefix = receiptSettings?.numberPrefix as
    | string
    | undefined;
  const receiptAutoIncrement = receiptSettings?.autoIncrement as
    | boolean
    | undefined;
  const receiptTermsConditions = receiptSettings?.termsConditions as
    | string
    | undefined;
  const receiptMessage = receiptSettings?.receiptMessage as string | undefined;
  const preferredDepositAccount = receiptSettings?.preferredDepositAccount as
    | string
    | undefined;

  // The next receipt number.
  const nextReceiptNumber = transactionNumber(
    receiptNumberPrefix,
    receiptNextNumber,
  );
  // Initial values in create and edit mode.
  const initialValues: ReceiptFormValues = !isEmpty(receipt)
    ? transformToEditForm(receipt)
    : {
        ...defaultReceipt,
        ...(receiptAutoIncrement && {
          receiptNumber: nextReceiptNumber,
        }),
        depositAccountId: parseInt(preferredDepositAccount ?? ''),
        entries: orderingLinesIndexes(defaultReceipt.entries),
        currencyCode: baseCurrency ?? '',
        receiptMessage: receiptMessage ?? '',
        termsConditions: receiptTermsConditions ?? '',
        pdfTemplateId: saleReceiptState?.defaultTemplateId ?? '',
      };
  // Handle the form submit.
  const handleFormSubmit = (
    values: ReceiptFormValues,
    { setErrors, setSubmitting, resetForm }: FormikHelpers<ReceiptFormValues>,
  ) => {
    const entries = values.entries.filter(
      (item) => item.itemId && item.quantity,
    );
    const totalQuantity = sumBy(entries, (entry) =>
      parseInt(String(entry.quantity)),
    );

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
      closed: !!submitPayload?.status,
    };
    // Handle the request success.
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_receipt_has_been_created_successfully'
            : 'the_receipt_has_been_edited_successfully',
          { number: values.receiptNumber },
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      if (submitPayload?.redirect) {
        history.push('/receipts');
      }
      if (submitPayload?.resetForm) {
        resetFormState({ resetForm, initialValues, values });
      }
    };

    // Handle the request error.
    const onError = ({
      data: { errors },
    }: {
      data: { errors: Array<{ type: string }> };
    }) => {
      if (errors) {
        handleErrors(errors, { setErrors });
      }
      setSubmitting(false);
    };
    if (!isNewMode && receipt) {
      editReceiptMutate([receipt.id, form]).then(onSuccess).catch(onError);
    } else {
      createReceiptMutate(form).then(onSuccess).catch(onError);
    }
  };

  return (
    <Formik<ReceiptFormValues>
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

export const ReceiptForm = compose(withDashboardActions)(ReceiptFormRoot);
