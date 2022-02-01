import React from 'react';
import intl from 'react-intl-universal';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { CLASSES } from 'common/classes';
import classNames from 'classnames';

import {
  CreateWarehouseFormSchema,
  EditWarehouseFormSchema,
} from './WarehouseTransferForm.schema';

import WarehouseTransferFormHeader from './WarehouseTransferFormHeader';
import WarehouseTransferEditorField from './WarehouseTransferEditorField';
import WarehouseTransferFormFooter from './WarehouseTransferFormFooter';
import WarehouseTransferFormDialog from './WarehouseTransferFormDialog';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose, orderingLinesIndexes, transactionNumber } from 'utils';
import { defaultWareTransferEntry, defaultWarehouseTransfer } from './utils';

function WarehouseTransferForm({
  // #withSettings
  warehouseTransferNextNumber,
  warehouseTransferNumberPrefix,
  warehouseTransferIncrementMode,
}) {
  const history = useHistory();

  // WarehouseTransfer number.
  const warehouseTransferNumber = transactionNumber(
    warehouseTransferNumberPrefix,
    warehouseTransferNextNumber,
  );

  // Form initial values.
  const initialValues = React.useMemo(
    () => ({
      ...defaultWarehouseTransfer,
    }),
    [],
  );

  // Handles form submit.
  const handleSubmit = (values, { setSubmitting, setErrors, resetForm }) => {
    // Transformes the values of the form to request.
    const form = {};

    // Handle the request success.
    const onSuccess = () => {};

    // Handle the request error.
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      setSubmitting(false);
    };
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
          true ? CreateWarehouseFormSchema : EditWarehouseFormSchema
        }
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        <Form>
          <WarehouseTransferFormHeader />
          <WarehouseTransferEditorField />
          <WarehouseTransferFormFooter />
          <WarehouseTransferFormDialog />
        </Form>
      </Formik>
    </div>
  );
}

export default compose(withDashboardActions)(WarehouseTransferForm);
