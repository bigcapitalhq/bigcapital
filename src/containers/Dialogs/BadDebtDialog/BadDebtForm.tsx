// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';
import { omit } from 'lodash';

import { AppToaster } from '@/components';
import { CreateBadDebtFormSchema } from './BadDebtForm.schema';
import { transformErrors } from './utils';

import BadDebtFormContent from './BadDebtFormContent';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

import { useBadDebtContext } from './BadDebtFormProvider';

import { compose } from '@/utils';

const defaultInitialValues = {
  expense_account_id: '',
  reason: '',
  amount: '',
};

function BadDebtForm({
  // #withDialogActions
  closeDialog,

  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const { invoice, dialogName, createBadDebtMutate, cancelBadDebtMutate } =
    useBadDebtContext();

  // Initial form values
  const initialValues = {
    ...defaultInitialValues,
    amount: invoice.due_amount,
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const form = {
      ...omit(values, ['currency_code']),
    };

    // Handle request response success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get('bad_debt.dialog.success_message'),
        intent: Intent.SUCCESS,
      });
      closeDialog(dialogName);
    };

    // Handle request response errors.
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      if (errors) {
        transformErrors(errors, { setErrors });
      }
      setSubmitting(false);
    };
    createBadDebtMutate([invoice.id, form]).then(onSuccess).catch(onError);
  };

  return (
    <Formik
      validationSchema={CreateBadDebtFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={BadDebtFormContent}
    />
  );
}

export default compose(
  withDialogActions,
  withCurrentOrganization(),
)(BadDebtForm);
