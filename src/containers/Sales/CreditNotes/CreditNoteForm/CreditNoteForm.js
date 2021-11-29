import React from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { sumBy, omit, isEmpty } from 'lodash';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import {
  getCreateCreditNoteFormSchema,
  getEditCreditNoteFormSchema,
} from './CreditNoteForm.schema';

import CreditNoteFormHeader from './CreditNoteFormHeader';
import CreditNoteItemsEntriesEditorField from './CreditNoteItemsEntriesEditorField';
import CreditNoteFormFooter from './CreditNoteFormFooter';
import CreditNoteFloatingActions from './CreditNoteFloatingActions';

import { AppToaster } from 'components';
import { compose, orderingLinesIndexes, transactionNumber } from 'utils';
import { useCreditNoteFormContext } from './CreditNoteFormProvider';
import { transformToEditForm, defaultCreditNote } from './utils';

import withSettings from 'containers/Settings/withSettings';
import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';

/**
 * Credit note form.
 */
function CreditNoteForm({
  // #withSettings

  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const history = useHistory();

  // Credit note form context.
  const { invoice } = useCreditNoteFormContext();

  // Initial values.
  const initialValues = React.useMemo(
    () => ({
      ...(!isEmpty(invoice)
        ? { ...transformToEditForm(invoice), currency_code: base_currency }
        : {
            ...defaultCreditNote,
            entries: orderingLinesIndexes(defaultCreditNote.entries),
            currency_code: base_currency,
          }),
    }),
    [],
  );

  // Handle form submit.
  const handleSubmit = (values, { setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);

    const entries = values.entries.filter(
      (item) => item.item_id && item.quantity,
    );

    const totalQuantity = sumBy(entries, (entry) => parseInt(entry.quantity));

    // Throw danger toaster in case total quantity equals zero.
    if (totalQuantity === 0) {
      AppToaster.show({
        message: intl.get('quantity_cannot_be_zero_or_empty'),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }
    // Transformes the values of the form to request.
    const form = {
      // ...transformValueToRequest(values),
    };

    // Handle the request success.
    const onSuccess = () => {};
    // Handle the request error.
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {};
  };

  const CreateCreditNoteFormSchema = getCreateCreditNoteFormSchema();
  const EditCreditNoteFormSchema = getEditCreditNoteFormSchema();

  return (
    <div
      className={classNames(
        CLASSES.PAGE_FORM,
        CLASSES.PAGE_FORM_STRIP_STYLE,
        CLASSES.PAGE_FORM_CREDIT_NOTE,
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
          <CreditNoteFormHeader />
          <CreditNoteItemsEntriesEditorField />
          <CreditNoteFormFooter />
          <CreditNoteFloatingActions />
        </Form>
      </Formik>
    </div>
  );
}

export default compose(withCurrentOrganization())(CreditNoteForm);
