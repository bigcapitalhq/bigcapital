import React, { useState, useCallback } from 'react';
import { Intent } from '@blueprintjs/core';
import { Formik, Form } from 'formik';
import { useIntl } from 'react-intl';
import { useQuery, queryCache } from 'react-query';
import moment from 'moment';
import { omit, get } from 'lodash';

import 'style/pages/Items/ItemAdjustmentDialog.scss';

import { AppToaster, DialogContent } from 'components';

import { CreateInventoryAdjustmentFormSchema } from './InventoryAdjustmentForm.schema';

import InventoryAdjustmentFormDialogFields from './InventoryAdjustmentFormDialogFields';
import InventoryAdjustmentFloatingActions from './InventoryAdjustmentFloatingActions';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withInventoryAdjustmentActions from 'containers/Items/withInventoryAdjustmentActions';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withItem from 'containers/Items/withItem';
import withItemsActions from 'containers/Items/withItemsActions';

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

  // #withItemsActions
  requestFetchItem,

  // #withItem
  item,

  // #ownProp
  itemId,
  dialogName,
}) {
  const { formatMessage } = useIntl();
  const [submitPayload, setSubmitPayload] = useState({});

  // Fetches accounts list.
  const fetchAccount = useQuery('accounts-list', () => requestFetchAccounts());

  // Fetches the item details.
  const fetchItem = useQuery(['item', itemId],
    (key, id) => requestFetchItem(id));

  // Initial form values.
  const initialValues = {
    ...defaultInitialValues,
    item_id: itemId,
    quantity_on_hand: get(item, 'quantity_on_hand', 0),
  };

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
    <DialogContent isLoading={fetchAccount.isFetching || fetchItem.isFetching}>
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
  withAccountsActions,
  withItem(({ item }) => ({
    item: item
  })),
  withItemsActions,
)(InventoryAdjustmentFormDialogContent);
