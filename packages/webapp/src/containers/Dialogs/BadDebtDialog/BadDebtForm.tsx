import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import { omit } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { CreateBadDebtFormSchema } from './BadDebtForm.schema';
import { BadDebtFormContent } from './BadDebtFormContent';
import { useBadDebtContext } from './BadDebtFormProvider';
import { transformErrors } from './utils';
import type { BadDebtFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { compose } from '@/utils';

const defaultInitialValues: BadDebtFormValues = {
  expenseAccountId: '',
  reason: '',
  amount: '',
};

interface BadDebtFormProps extends WithDialogActionsProps {}

function BadDebtFormInner({
  closeDialog,
}: BadDebtFormProps): React.ReactElement {
  const { invoice, dialogName, createBadDebtMutate } = useBadDebtContext();

  // Initial form values
  const initialValues: BadDebtFormValues = {
    ...defaultInitialValues,
    amount: invoice?.dueAmount || '',
  };

  // Handles the form submit.
  const handleFormSubmit = (
    values: BadDebtFormValues,
    { setSubmitting, setErrors }: FormikHelpers<BadDebtFormValues>,
  ) => {
    const form = {
      ...omit(values, ['currencyCode']),
    };

    // Handle request response success.
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('bad_debt.dialog.success_message'),
        intent: Intent.SUCCESS,
      });
      closeDialog(dialogName);
    };

    // Handle request response errors.
    const onError = ({
      data: { errors },
    }: {
      data: { errors: Array<{ type: string }> };
    }) => {
      if (errors) {
        transformErrors(errors, { setErrors });
      }
      setSubmitting(false);
    };
    // FIXME: `invoice?.id` is undefined when invoice hasn't loaded yet — original
    // runtime would crash; preserved with `as number` cast (mutate hook expects number).
    createBadDebtMutate([invoice?.id as number, form])
      .then(onSuccess)
      .catch(onError);
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

export const BadDebtForm = compose(withDialogActions)(BadDebtFormInner);
