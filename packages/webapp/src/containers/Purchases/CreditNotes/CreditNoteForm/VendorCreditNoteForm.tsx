import { Intent } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { Formik, Form, FormikHelpers } from 'formik';
import { isEmpty } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import {
  defaultVendorCredit,
  filterNonZeroEntries,
  transformToEditForm,
  transformFormValuesToRequest,
  type VendorCreditFormValues,
} from './utils';
import { VendorCreditNoteFloatingActions } from './VendorCreditNoteFloatingActions';
import {
  CreateCreditNoteFormSchema,
  EditCreditNoteFormSchema,
} from './VendorCreditNoteForm.schema';
import { VendorCreditNoteFormDialogs } from './VendorCreditNoteFormDialogs';
import { VendorCreditNoteFormFooter } from './VendorCreditNoteFormFooter';
import { VendorCreditNoteFormHeader } from './VendorCreditNoteFormHeader';
import { useVendorCreditNoteFormContext } from './VendorCreditNoteFormProvider';
import { VendorCreditNoteFormTopBar } from './VendorCreditNoteFormTopBar';
import { VendorCreditNoteItemsEntriesEditor } from './VendorCreditNoteItemsEntriesEditor';
import { AppToaster, Box } from '@/components';
import { PageForm } from '@/components/PageForm';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { safeSumBy, transactionNumber } from '@/utils';

interface VendorCreditNoteFormInnerProps {}

/**
 * Vendor Credit note form.
 */
function VendorCreditNoteFormInner({}: VendorCreditNoteFormInnerProps) {
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const history = useHistory();

  // Vendor Credit note form context.
  const {
    isNewMode,
    submitPayload,
    vendorCredit,
    newVendorCredit,
    createVendorCreditMutate,
    editVendorCreditMutate,
    vendorCreditSettings,
  } = useVendorCreditNoteFormContext();

  const vendorcreditAutoIncrement = vendorCreditSettings?.autoIncrement as
    | boolean
    | undefined;
  const vendorcreditNextNumber = vendorCreditSettings?.nextNumber as
    | number
    | undefined;
  const vendorcreditNumberPrefix = vendorCreditSettings?.numberPrefix as
    | string
    | undefined;

  // Credit number.
  const vendorCreditNumber = transactionNumber(
    vendorcreditNumberPrefix,
    vendorcreditNextNumber,
  );

  // Initial values.
  const initialValues: VendorCreditFormValues = React.useMemo(() => {
    if (!isEmpty(vendorCredit)) {
      return transformToEditForm(vendorCredit);
    }
    return {
      ...defaultVendorCredit,
      ...(vendorcreditAutoIncrement && {
        vendorCreditNumber,
      }),
      currencyCode: baseCurrency ?? '',
      ...(Array.isArray(newVendorCredit) ? {} : newVendorCredit),
    };
  }, [vendorCredit, baseCurrency]);

  // Handles form submit.
  const handleFormSubmit = (
    values: VendorCreditFormValues,
    { setSubmitting, resetForm }: FormikHelpers<VendorCreditFormValues>,
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
      open: submitPayload?.open ?? false,
    };
    // Handle the request success.
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'vendor_credits.success_message'
            : 'vendor_credits.edit_success_message',
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      if (submitPayload?.redirect) {
        history.push('/vendor-credits');
      }
      if (submitPayload?.resetForm) {
        resetForm();
      }
    };
    // Handle the request error.
    const onError = () => {
      setSubmitting(false);
    };
    if (isNewMode) {
      createVendorCreditMutate(form).then(onSuccess).catch(onError);
    } else if (vendorCredit) {
      editVendorCreditMutate([vendorCredit.id, form])
        .then(onSuccess)
        .catch(onError);
    }
  };

  return (
    <Formik<VendorCreditFormValues>
      validationSchema={
        isNewMode ? CreateCreditNoteFormSchema : EditCreditNoteFormSchema
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
            <VendorCreditNoteFormTopBar />
            <VendorCreditNoteFormHeader />

            <Box p="18px 32px 0">
              <VendorCreditNoteItemsEntriesEditor />
            </Box>

            <VendorCreditNoteFormFooter />
          </PageForm.Body>

          <PageForm.Footer>
            <VendorCreditNoteFloatingActions />
          </PageForm.Footer>

          {/* ---------- Dialogs ---------- */}
          <VendorCreditNoteFormDialogs />
        </PageForm>
      </Form>
    </Formik>
  );
}

export const VendorCreditNoteForm = VendorCreditNoteFormInner;
