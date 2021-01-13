import React, { useState, useCallback, useMemo } from 'react';
import { Intent } from '@blueprintjs/core';
import { Formik, Form } from 'formik';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { useQuery, queryCache } from 'react-query';
import moment from 'moment';
import { omit } from 'lodash';

import { AppToaster, DialogContent } from 'components';
import { CreateInventoryAdjustmentFormSchema } from './InventoryAdjustmentForm.schema';
import InventoryAdjustmentFormDialogFields from './InventoryAdjustmentFormDialogFields';
import InventoryAdjustmentFloatingActions from './InventoryAdjustmentFloatingActions';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withInventoryAdjustmentActions from 'containers/Items/withInventoryAdjustmentActions';
import { compose } from 'utils';

const defaultInitialValues = {
  date: moment(new Date()).format('YYYY-MM-DD'),
  type: 'decrement',
  adjustment_account_id: '',
  item_id: '',
  reason: '',
  cost: '',
  quantity: '',
  reference_no: '',
  quantity_on_hand: '',
  description: '',
  publish: '',
};

/**
 * Inventory adjustment form dialog content.
 */
function InventoryAdjustmentFormDialogContent({
  // #withDialogActions
  closeDialog,

  // #withAccountsActions
  requestFetchAccounts,

  // #withInventoryAdjustmentActions
  requestSubmitInventoryAdjustment,

  // #ownProp
  itemDetail,
  dialogName,
}) {
  const { formatMessage } = useIntl();
  const [submitPayload, setSubmitPayload] = useState({});

  // Fetches accounts list.
  const fetchAccount = useQuery('accounts-list', () => requestFetchAccounts());

  const initialValues = useMemo(
    () => ({
      ...defaultInitialValues,
      ...itemDetail,
    }),
    [],
  );

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const form = {
      ...omit(values, ['quantity_on_hand', 'new_quantity', 'action']),
      publish: submitPayload.publish,
    };

    const onSuccess = ({ response }) => {
      closeDialog(dialogName);
      queryCache.invalidateQueries('accounts-list');
      queryCache.invalidateQueries('items-table');

      AppToaster.show({
        message: formatMessage({
          id: 'the_make_adjustment_has_been_successfully_created',
        }),
        intent: Intent.SUCCESS,
      });
    };
    const onError = (error) => {
      setSubmitting(false);
    };
    requestSubmitInventoryAdjustment({ form }).then(onSuccess).catch(onError);
  };

  // Handles dialog close.
  const handleCloseClick = useCallback(() => {
    closeDialog(dialogName);
  }, [closeDialog, dialogName]);

  const handleSubmitClick = useCallback(
    (event, payload) => {
      setSubmitPayload({ ...payload });
    },
    [setSubmitPayload],
  );

  return (
    <DialogContent>
      <Formik
        validationSchema={CreateInventoryAdjustmentFormSchema}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <Form>
          <InventoryAdjustmentFormDialogFields dialogName={dialogName} />
          <InventoryAdjustmentFloatingActions
            onSubmitClick={handleSubmitClick}
            onCloseClick={handleCloseClick}
          />
        </Form>
      </Formik>
    </DialogContent>
  );
}

export default compose(
  withInventoryAdjustmentActions,
  withDialogActions,
)(InventoryAdjustmentFormDialogContent);
