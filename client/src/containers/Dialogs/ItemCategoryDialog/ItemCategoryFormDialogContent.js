import React, { useMemo, useCallback } from 'react';
import { Intent } from '@blueprintjs/core';
import { useQuery, queryCache } from 'react-query';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Formik } from 'formik';
import { AppToaster, DialogContent } from 'components';

import ItemCategoryForm from './ItemCategoryForm';
import withItemCategories from 'containers/Items/withItemCategories';
import withItemCategoryDetail from 'containers/Items/withItemCategoryDetail';
import withItemCategoriesActions from 'containers/Items/withItemCategoriesActions';

import withAccounts from 'containers/Accounts/withAccounts';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

import {
  EditItemCategoryFormSchema,
  CreateItemCategoryFormSchema,
} from './itemCategoryForm.schema';
import { compose, transformToForm } from 'utils';

const defaultInitialValues = {
  name: '',
  description: '',
  cost_account_id: '',
  sell_account_id: '',
  inventory_account_id: '',
};

/**
 * Item Category form dialog content.
 */

function ItemCategoryFormDialogContent({
  // #withDialogActions
  closeDialog,

  // #withItemCategoryDetail
  itemCategoryDetail,

  // #withItemCategories
  categoriesList,

  // #withItemCategoriesActions
  requestSubmitItemCategory,
  requestEditItemCategory,
  requestFetchItemCategories,

  //# withAccount
  accountsList,

  // #withAccountsActions
  requestFetchAccounts,

  // #ownProp
  action,
  itemCategoryId,
  dialogName,
}) {
  const isNewMode = !itemCategoryId;

  const { formatMessage } = useIntl();

  // Fetches categories list.
  const fetchCategoriesList = useQuery(['items-categories-list'], () =>
    requestFetchItemCategories(),
  );

  // Fetches accounts list.
  const fetchAccountsList = useQuery('accounts-list', () =>
    requestFetchAccounts(),
  );

  const initialValues = useMemo(
    () => ({
      ...defaultInitialValues,
      ...transformToForm(itemCategoryDetail, defaultInitialValues),
    }),
    [],
  );

  const transformErrors = (errors, { setErrors }) => {
    if (errors.find((error) => error.type === 'CATEGORY_NAME_EXISTS')) {
      setErrors({
        name: formatMessage({ id: 'category_name_exists' }),
      });
    }
  };
  
  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    const form = { ...values };
    const afterSubmit = () => {
      closeDialog(dialogName);
      queryCache.invalidateQueries('items-categories-list');
      queryCache.invalidateQueries('accounts-list');
    };
    const onSuccess = ({ response }) => {
      AppToaster.show({
        message: formatMessage({
          id: isNewMode
            ? 'the_item_category_has_been_successfully_created'
            : 'the_item_category_has_been_successfully_edited',
        }),
        intent: Intent.SUCCESS,
      });
      afterSubmit(response);
    };

    const onError = (errors) => {
      transformErrors(errors, { setErrors });
      setSubmitting(false);
    };
    if (isNewMode) {
      requestSubmitItemCategory(form).then(onSuccess).catch(onError);
    } else {
      requestEditItemCategory(itemCategoryId, form)
        .then(onSuccess)
        .catch(onError);
    }
  };

  // Handles dialog close.
  const handleClose = useCallback(() => {
    closeDialog(dialogName);
  }, [closeDialog, dialogName]);

  return (
    <DialogContent
      isLoading={fetchCategoriesList.isFetching || fetchAccountsList.isFetching}
    >
      <Formik
        validationSchema={
          isNewMode ? CreateItemCategoryFormSchema : EditItemCategoryFormSchema
        }
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting }) => (
          <ItemCategoryForm
            itemCategoryId={itemCategoryId}
            accountsList={accountsList}
            categoriesList={categoriesList}
            isSubmitting={isSubmitting}
            onClose={handleClose}
          />
        )}
      </Formik>
    </DialogContent>
  );
}

export default compose(
  withDialogActions,
  withItemCategoryDetail(),
  withItemCategories(({ categoriesList }) => ({
    categoriesList,
  })),
  withAccounts(({ accountsList }) => ({
    accountsList,
  })),
  withItemCategoriesActions,
  withAccountsActions,
)(ItemCategoryFormDialogContent);
