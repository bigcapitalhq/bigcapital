// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Formik, Form } from 'formik';
import { isEmpty } from 'lodash';
import { Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { CLASSES } from '@/constants/classes';
import classNames from 'classnames';

import {
  CreateWarehouseFormSchema,
  EditWarehouseFormSchema,
} from './WarehouseTransferForm.schema';

import WarehouseTransferFormHeader from './WarehouseTransferFormHeader';
import WarehouseTransferEditorField from './WarehouseTransferEditorField';
import WarehouseTransferFormFooter from './WarehouseTransferFormFooter';
import WarehouseTransferFloatingActions from './WarehouseTransferFloatingActions';
import WarehouseTransferFormDialog from './WarehouseTransferFormDialog';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import withSettings from '@/containers/Settings/withSettings';

import { AppToaster } from '@/components';
import { useWarehouseTransferFormContext } from './WarehouseTransferFormProvider';
import { compose, orderingLinesIndexes, transactionNumber } from '@/utils';
import { WarehouseTransferObserveItemsCost } from './components';
import {
  defaultWarehouseTransfer,
  transformValueToRequest,
  transformErrors,
  transformToEditForm,
} from './utils';

function WarehouseTransferForm({
  // #withSettings
  warehouseTransferNextNumber,
  warehouseTransferNumberPrefix,
  warehouseTransferIncrementMode,
}) {
  const history = useHistory();

  const {
    isNewMode,
    warehouseTransfer,
    createWarehouseTransferMutate,
    editWarehouseTransferMutate,
    submitPayload,
  } = useWarehouseTransferFormContext();

  // WarehouseTransfer number.
  const warehouseTransferNumber = transactionNumber(
    warehouseTransferNumberPrefix,
    warehouseTransferNextNumber,
  );

  // Form initial values.
  const initialValues = React.useMemo(
    () => ({
      ...(!isEmpty(warehouseTransfer)
        ? { ...transformToEditForm(warehouseTransfer) }
        : {
            ...defaultWarehouseTransfer,
            ...(warehouseTransferIncrementMode && {
              transaction_number: warehouseTransferNumber,
            }),
            entries: orderingLinesIndexes(defaultWarehouseTransfer.entries),
          }),
    }),
    [],
  );

  // Handles form submit.
  const handleSubmit = (values, { setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);
    // Transforms the values of the form to request.
    const form = {
      ...transformValueToRequest(values),
      transfer_initiated: submitPayload.initiate,
      transfer_delivered: submitPayload.deliver,
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

      if (submitPayload.redirect) {
        history.push('/warehouses-transfers');
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
      if (errors) {
        transformErrors(errors, { setErrors });
      }
      setSubmitting(false);
    };

    if (isNewMode) {
      createWarehouseTransferMutate(form).then(onSuccess).catch(onError);
    } else {
      editWarehouseTransferMutate([warehouseTransfer.id, form])
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

export default compose(
  withDashboardActions,
  withSettings(({ warehouseTransferSettings }) => ({
    warehouseTransferNextNumber: warehouseTransferSettings?.nextNumber,
    warehouseTransferNumberPrefix: warehouseTransferSettings?.numberPrefix,
    warehouseTransferIncrementMode: warehouseTransferSettings?.autoIncrement,
  })),
)(WarehouseTransferForm);
