import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import '@/style/pages/AllocateLandedCost/AllocateLandedCostForm.scss';
import { useAllocateLandedConstDialogContext } from './AllocateLandedCostDialogProvider';
import { AllocateLandedCostFormSchema } from './AllocateLandedCostForm.schema';
import { AllocateLandedCostFormContent } from './AllocateLandedCostFormContent';
import { defaultInitialValues } from './utils';
import type { AllocateLandedCostFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose, transformToForm } from '@/utils';

interface AllocateLandedCostFormProps
  extends Pick<WithDialogActionsProps, 'closeDialog'> {}

interface LandedCostErrorResponse {
  response: { data: { errors: Array<{ type: string }> } };
}

/**
 * Allocate landed cost form.
 */
function AllocateLandedCostFormInner({
  // #withDialogActions
  closeDialog,
}: AllocateLandedCostFormProps) {
  const { dialogName, bill, billId, createLandedCostMutate } =
    useAllocateLandedConstDialogContext();

  // Initial form values.
  const initialValues: AllocateLandedCostFormValues = {
    ...defaultInitialValues,
    items: (bill?.entries ?? []).map((entry) => ({
      ...entry,
      entryId: entry.id,
      cost: '',
    })) as AllocateLandedCostFormValues['items'],
  };
  // Handle form submit.
  const handleFormSubmit = (
    values: AllocateLandedCostFormValues,
    { setSubmitting }: FormikHelpers<AllocateLandedCostFormValues>,
  ) => {
    setSubmitting(true);

    // Filters the entries has no cost.
    const entries = values.items
      .filter((entry) => entry.entryId && entry.cost)
      .map(
        (entry) =>
          transformToForm(
            entry,
            defaultInitialValues.items[0],
          ) as (typeof defaultInitialValues.items)[0],
      );

    if (entries.length <= 0) {
      AppToaster.show({
        message: intl.get('something_wrong'),
        intent: Intent.DANGER,
      });
      return;
    }
    const form = {
      ...values,
      items: entries,
    };
    // Handle the request success.
    const onSuccess = (_response: unknown) => {
      AppToaster.show({
        message: intl.get('the_landed_cost_has_been_created_successfully'),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      closeDialog(dialogName);
    };
    // Handle the request error.
    const onError = (res: LandedCostErrorResponse) => {
      const { errors } = res.response.data;
      setSubmitting(false);

      if (
        errors.some(
          (e) => e.type === 'COST_AMOUNT_BIGGER_THAN_UNALLOCATED_AMOUNT',
        )
      ) {
        AppToaster.show({
          message: intl.get(
            'landed_cost.error.the_total_located_cost_is_bigger_than_the_transaction_line',
          ),
          intent: Intent.DANGER,
        });
      } else {
        AppToaster.show({
          message: intl.get('something_went_wrong'),
          intent: Intent.DANGER,
        });
      }
    };
    // `useCreateLandedCost` lives in an `@ts-nocheck` queries file and infers
    // a `void` variables type; the runtime accepts `[billId, form]`.
    // @ts-expect-error — @ts-nocheck hook infers void variables type.
    createLandedCostMutate([billId, form]).then(onSuccess).catch(onError);
  };

  // Computed validation schema.
  const validationSchema = AllocateLandedCostFormSchema();

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={AllocateLandedCostFormContent}
    />
  );
}

export const AllocateLandedCostForm = compose(withDialogActions)(
  AllocateLandedCostFormInner,
);
