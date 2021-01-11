import React, { useCallback, useMemo } from 'react';
import { Intent } from '@blueprintjs/core';
import { Formik } from 'formik';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { useQuery, queryCache } from 'react-query';
import moment from 'moment';
import { omit } from 'lodash';

import {
  AppToaster,
  DialogContent,
  Row,
  Col,
  ListSelect,
  IF,
} from 'components';
import { CreateInventoryAdjustmentFormSchema } from './InventoryAdjustmentForm.schema';
import InventoryAdjustmentFormDialogFields from './InventoryAdjustmentFormDialogFields';

import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

const defaultInitialValues = {
  date: moment(new Date()).format('YYYY-MM-DD'),
  type: 'decrement',
  adjustment_account_id: '',
  reason: '',
  reference_no: '',
  description: '',
};

/**
 * Inventory adjustment form dialog content.
 */
function InventoryAdjustmentFormDialogContent({
  // #withDialogActions
  closeDialog,

  // #withAccountsActions
  requestFetchAccounts,

  // #ownProp
  dialogName,
  action,
}) {
  const { formatMessage } = useIntl();

  // Fetches accounts list.
  const fetchAccountsList = useQuery('accounts-list', () =>
    requestFetchAccounts(),
  );

  const initialValues = useMemo(
    () => ({
      ...defaultInitialValues,
    }),
    [],
  );

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const form = { ...values };

    const onSuccess = ({ response }) => {
      closeDialog(dialogName);
      queryCache.invalidateQueries('accounts-list');

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
    //requestInventoryAdjustment
  };

  // Handles dialog close.
  const handleClose = useCallback(() => {
    closeDialog(dialogName);
  }, [closeDialog, dialogName]);

  return (
    <DialogContent>
      <Formik
        validationSchema={CreateInventoryAdjustmentFormSchema}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <InventoryAdjustmentFormDialogFields
          dialogName={dialogName}
          onClose={handleClose}
        />
      </Formik>
    </DialogContent>
  );
}

export default compose(withDialogActions)(InventoryAdjustmentFormDialogContent);
