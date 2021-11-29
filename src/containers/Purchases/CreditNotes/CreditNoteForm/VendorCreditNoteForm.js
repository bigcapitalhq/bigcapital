import React from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
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
  const { bill } = useVendorCreditNoteFormContext();

  // Initial values.
  const initialValues = React.useMemo(
    () => ({
      ...(!isEmpty(bill)
        ? {
            ...transformToEditForm(bill),
            currency_code: base_currency,
          }
        : {
            ...defaultVendorsCreditNote,
            currency_code: base_currency,
          }),
    }),
    [],
  );

  // Handle form submit.
  const handleSubmit = (values, { setSubmitting, setErrors, resetForm }) => {
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

    const form = {};

    // Handle the request success.
    const onSuccess = (response) => {};

    // Handle the request error.
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {};
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
          true ? CreateCreditNoteFormSchema : EditCreditNoteFormSchema
        }
        initialValues={initialValues}
        onSubmit={handleSubmit}
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
