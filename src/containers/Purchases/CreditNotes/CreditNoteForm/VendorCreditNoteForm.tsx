// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import { isEmpty } from 'lodash';
import { CLASSES } from '@/constants/classes';
import {
  CreateCreditNoteFormSchema,
  EditCreditNoteFormSchema,
} from './VendorCreditNoteForm.schema';

import VendorCreditNoteFormHeader from './VendorCreditNoteFormHeader';
import VendorCreditNoteItemsEntriesEditor from './VendorCreditNoteItemsEntriesEditor';
import VendorCreditNoteFormFooter from './VendorCreditNoteFormFooter';
import VendorCreditNoteFloatingActions from './VendorCreditNoteFloatingActions';
import VendorCreditNoteFormDialogs from './VendorCreditNoteFormDialogs';
import VendorCreditNoteFormTopBar from './VendorCreditNoteFormTopBar';

import { useVendorCreditNoteFormContext } from './VendorCreditNoteFormProvider';

import { AppToaster } from '@/components';
import { compose, safeSumBy, transactionNumber } from '@/utils';
import {
  defaultVendorsCreditNote,
  filterNonZeroEntries,
  transformToEditForm,
  transformFormValuesToRequest,
} from './utils';

import withSettings from '@/containers/Settings/withSettings';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

/**
 * Vendor Credit note form.
 */
function VendorCreditNoteForm({
  // #withSettings
  vendorcreditAutoIncrement,
  vendorcreditNumberPrefix,
  vendorcreditNextNumber,

  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const history = useHistory();

  // Vendor Credit note form context.
  const {
    isNewMode,
    submitPayload,
    vendorCredit,
    newVendorCredit,
    createVendorCreditMutate,
    editVendorCreditMutate,
  } = useVendorCreditNoteFormContext();

  // Credit number.
  const vendorCreditNumber = transactionNumber(
    vendorcreditNumberPrefix,
    vendorcreditNextNumber,
  );

  // Initial values.
  const initialValues = React.useMemo(
    () => ({
      ...(!isEmpty(vendorCredit)
        ? {
            ...transformToEditForm(vendorCredit),
          }
        : {
            ...defaultVendorsCreditNote,
            ...(vendorcreditAutoIncrement && {
              vendor_credit_number: vendorCreditNumber,
            }),
            currency_code: base_currency,
            ...newVendorCredit,
          }),
    }),
    [vendorCredit, base_currency],
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
      open: submitPayload.open,
    };
    // Handle the request success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'vendor_credits.success_message'
            : 'vendor_credits.edit_success_message',
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      if (submitPayload.redirect) {
        history.push('/vendor-credits');
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
      setSubmitting(false);
    };
    if (isNewMode) {
      createVendorCreditMutate(form).then(onSuccess).catch(onError);
    } else {
      editVendorCreditMutate([vendorCredit.id, form])
        .then(onSuccess)
        .catch(onError);
    }
  };

  return (
    <div
      className={classNames(
        CLASSES.PAGE_FORM,
        CLASSES.PAGE_FORM_STRIP_STYLE,
        CLASSES.PAGE_FORM_VENDOR_CREDIT_NOTE,
      )}
    >
      <Formik
        validationSchema={
          isNewMode ? CreateCreditNoteFormSchema : EditCreditNoteFormSchema
        }
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <Form>
          <VendorCreditNoteFormTopBar />
          <VendorCreditNoteFormHeader />
          <VendorCreditNoteItemsEntriesEditor />
          <VendorCreditNoteFormFooter />
          <VendorCreditNoteFloatingActions />
          <VendorCreditNoteFormDialogs />
        </Form>
      </Formik>
    </div>
  );
}

export default compose(
  withSettings(({ vendorsCreditNoteSetting }) => ({
    vendorcreditAutoIncrement: vendorsCreditNoteSetting?.autoIncrement,
    vendorcreditNextNumber: vendorsCreditNoteSetting?.nextNumber,
    vendorcreditNumberPrefix: vendorsCreditNoteSetting?.numberPrefix,
  })),
  withCurrentOrganization(),
)(VendorCreditNoteForm);
