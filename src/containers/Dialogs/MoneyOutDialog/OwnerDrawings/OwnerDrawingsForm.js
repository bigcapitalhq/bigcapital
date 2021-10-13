import React from 'react';
import moment from 'moment';
import { Intent } from '@blueprintjs/core';
import { Formik } from 'formik';
import intl from 'react-intl-universal';

// styles

import { AppToaster } from 'components';
import { CreateOwnerDrawingsFormSchema } from './OwnerDrawingsForm.schema';
import OwnerDrawingsFormContent from './OwnerDrawingsFormContent';

import { useMoneyOutDialogContext } from '../MoneyOutProvider';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';

import { compose } from 'utils';

const defaultInitialValues = {
  date: moment(new Date()).format('YYYY-MM-DD'),
  amount: '',
  transaction_number: '',
  reference_no: '',
  equity_account_id: '',
  account_id: '',
  description: '',
  published: '',
};

/**
 * Owner drawings form.
 */
function OwnerDrawingsForm({
  // #withDialogActions
  closeDialog,

  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const { accountId, submitPayload } = useMoneyOutDialogContext();

  // Initial form values.
  const initialValues = {
    ...defaultInitialValues,
    currency_code: base_currency,
    account_id: accountId,
  };
  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const form = {
      ...values,
      published: submitPayload.publish,
    };
    setSubmitting(true);
  };

  return (
    <Formik
      validationSchema={CreateOwnerDrawingsFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
    >
      <OwnerDrawingsFormContent />
    </Formik>
  );
}

export default compose(
  withDialogActions,
  withCurrentOrganization(),
)(OwnerDrawingsForm);
