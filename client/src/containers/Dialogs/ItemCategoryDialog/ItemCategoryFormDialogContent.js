import React, { useMemo } from 'react';
import { Intent } from '@blueprintjs/core';
import * as Yup from 'yup';
import { useQuery, queryCache } from 'react-query';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Formik } from 'formik';
import { AppToaster, DialogContent } from 'components';

import withItemCategories from 'containers/Items/withItemCategories';
import withItemCategoryDetail from 'containers/Items/withItemCategoryDetail';
import withItemCategoriesActions from 'containers/Items/withItemCategoriesActions';

import withAccounts from 'containers/Accounts/withAccounts';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose, transformToForm } from 'utils';
import ItemCategoryForm from './ItemCategoryForm';

const defaultInitialValues = {
  name: '',
  description: '',
  parent_category_id: '',
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

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required()
      .label(formatMessage({ id: 'category_name_' })),
    parent_category_id: Yup.number().nullable(),
    cost_account_id: Yup.number().nullable(),
    sell_account_id: Yup.number().nullable(),
    inventory_account_id: Yup.number().nullable(),
    description: Yup.string().trim().nullable(),
  });

  const initialValues = useMemo(
    () => ({
      ...defaultInitialValues,
      ...transformToForm(itemCategoryDetail, defaultInitialValues),
    }),
    [],
  );

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting }) => {
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
    const onError = ({ response }) => {
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

  return (
    <DialogContent
      isLoading={fetchCategoriesList.isFetching || fetchAccountsList.isFetching}
    >
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting }) => (
          <ItemCategoryForm
            itemCategoryId={itemCategoryId}
            accountsList={accountsList}
            categoriesList={categoriesList}
            isSubmitting={isSubmitting}
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
