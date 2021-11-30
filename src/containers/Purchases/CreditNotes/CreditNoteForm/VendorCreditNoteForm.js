import React from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { Button, Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { sumBy, omit, isEmpty } from 'lodash';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import {
  CreateCreditNoteFormSchema,
  EditCreditNoteFormSchema,
} from './VendorCreditNoteForm.schema';

import VendorCreditNoteFormHeader from './VendorCreditNoteFormHeader';
import VendorCreditNoteItemsEntriesEditor from './VendorCreditNoteItemsEntriesEditor';
import VendorCreditNoteFormFooter from './VendorCreditNoteFormFooter';
import VendorCreditNoteFloatingActions from './VendorCreditNoteFloatingActions';
import { useVendorCreditNoteFormContext } from './VendorCreditNoteFormProvider';

import { AppToaster } from 'components';

import { compose, safeSumBy } from 'utils';
import {
  defaultVendorsCreditNote,
  filterNonZeroEntries,
  transformToEditForm,
  transformFormValuesToRequest,
} from './utils';
import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';

/**
 * Vendor Credit note form.
 */
function VendorCreditNoteForm({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const history = useHistory();

  // Vendor Credit note form context.
  const {
    isNewMode,
    submitPayload,
    vendorCredit,
    createVendorCreditMutate,
    editVendorCreditMutate,
  } = useVendorCreditNoteFormContext();

  // Initial values.
  const initialValues = React.useMemo(
    () => ({
      ...(!isEmpty(vendorCredit)
        ? {
            ...transformToEditForm(vendorCredit),
          }
        : {
            ...defaultVendorsCreditNote,
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
          <VendorCreditNoteFormHeader />
          <VendorCreditNoteItemsEntriesEditor />
          <VendorCreditNoteFormFooter />

          <VendorCreditNoteFloatingActions />
        </Form>
      </Formik>
    </div>
  );
}

export default compose(withCurrentOrganization())(VendorCreditNoteForm);
