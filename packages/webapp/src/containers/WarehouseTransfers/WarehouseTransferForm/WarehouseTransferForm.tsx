import { Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import { Formik, Form, type FormikHelpers } from 'formik';
import { isEmpty } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { WarehouseTransferObserveItemsCost } from './components';
import {
  defaultWarehouseTransfer,
  transformValueToRequest,
  transformErrors,
  transformToEditForm,
} from './utils';
import { WarehouseTransferEditorField } from './WarehouseTransferEditorField';
import { WarehouseTransferFloatingActions } from './WarehouseTransferFloatingActions';
import {
  CreateWarehouseFormSchema,
  EditWarehouseFormSchema,
} from './WarehouseTransferForm.schema';
import { WarehouseTransferFormDialog } from './WarehouseTransferFormDialog';
import { WarehouseTransferFormFooter } from './WarehouseTransferFormFooter';
import { WarehouseTransferFormHeader } from './WarehouseTransferFormHeader';
import { useWarehouseTransferFormContext } from './WarehouseTransferFormProvider';
import type { WarehouseTransferFormValues } from './types';
import type {
  CreateWarehouseTransferBody,
  EditWarehouseTransferBody,
} from '@bigcapital/sdk-ts';
import { AppToaster } from '@/components';
import { CLASSES } from '@/constants/classes';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { compose, orderingLinesIndexes, transactionNumber } from '@/utils';

interface WarehouseTransferFormInnerProps {}

interface ApiError {
  data?: { errors?: { type: string }[] };
}

function WarehouseTransferFormInner({}: WarehouseTransferFormInnerProps) {
  const history = useHistory();

  const {
    isNewMode,
    warehouseTransfer,
    createWarehouseTransferMutate,
    editWarehouseTransferMutate,
    submitPayload,
    warehouseTransferSettings,
  } = useWarehouseTransferFormContext();

  const warehouseTransferNextNumber = warehouseTransferSettings?.nextNumber as
    | number
    | undefined;
  const warehouseTransferNumberPrefix =
    warehouseTransferSettings?.numberPrefix as string | undefined;
  const warehouseTransferIncrementMode =
    warehouseTransferSettings?.autoIncrement as boolean | undefined;

  // WarehouseTransfer number.
  const warehouseTransferNumber = transactionNumber(
    warehouseTransferNumberPrefix,
    warehouseTransferNextNumber,
  );

  // Form initial values.
  const initialValues = React.useMemo<WarehouseTransferFormValues>(() => {
    if (!isEmpty(warehouseTransfer)) {
      return transformToEditForm(
        warehouseTransfer as unknown as Record<string, unknown> & {
          entries?: unknown[];
        },
      );
    }
    return {
      ...defaultWarehouseTransfer,
      ...(warehouseTransferIncrementMode
        ? { transactionNumber: warehouseTransferNumber }
        : {}),
      entries: orderingLinesIndexes(defaultWarehouseTransfer.entries),
    } as WarehouseTransferFormValues;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handles form submit.
  const handleSubmit = (
    values: WarehouseTransferFormValues,
    {
      setSubmitting,
      setErrors,
      resetForm,
    }: FormikHelpers<WarehouseTransferFormValues>,
  ) => {
    setSubmitting(true);
    // Transformes the values of the form to request.
    const form = {
      ...transformValueToRequest(values),
      transferInitiated: submitPayload?.initiate,
      transferDelivered: submitPayload?.deliver,
    };

    // Handle the request success.
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'warehouse_transfer.success_message'
            : 'warehouse_transfer.edit_success_message',
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      if (submitPayload?.redirect) {
        history.push('/warehouses-transfers');
      }
      if (submitPayload?.resetForm) {
        resetForm();
      }
    };

    // Handle the request error.
    const onError = ({ data }: ApiError) => {
      if (data?.errors) {
        transformErrors(data.errors, {
          setErrors: setErrors as (errors: unknown) => void,
        });
      }
      setSubmitting(false);
    };

    if (isNewMode) {
      createWarehouseTransferMutate(
        form as unknown as CreateWarehouseTransferBody,
      )
        .then(onSuccess)
        .catch(onError);
    } else {
      editWarehouseTransferMutate([
        warehouseTransfer!.id,
        form as unknown as EditWarehouseTransferBody,
      ])
        .then(onSuccess)
        .catch(onError);
    }
  };

  return (
    <div
      className={classNames(
        CLASSES.PAGE_FORM,
        CLASSES.PAGE_FORM_STRIP_STYLE,
        CLASSES.PAGE_FORM_WAREHOUSE_TRANSFER,
      )}
    >
      <Formik
        validationSchema={
          isNewMode ? CreateWarehouseFormSchema : EditWarehouseFormSchema
        }
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        <Form>
          <WarehouseTransferFormHeader />
          <WarehouseTransferEditorField />
          <WarehouseTransferFormFooter />
          <WarehouseTransferFormDialog />
          <WarehouseTransferFloatingActions />
          <WarehouseTransferObserveItemsCost />
        </Form>
      </Formik>
    </div>
  );
}

export const WarehouseTransferForm = compose(withDashboardActions)(
  WarehouseTransferFormInner,
);
