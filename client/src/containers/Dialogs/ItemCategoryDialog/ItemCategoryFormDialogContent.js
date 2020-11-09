import React, { useState, useMemo, useCallback } from 'react';
import {
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
  TextArea,
  MenuItem,
} from '@blueprintjs/core';
import { pick } from 'lodash';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useQuery, queryCache } from 'react-query';
import { FormattedMessage as T, useIntl } from 'react-intl';

import classNames from 'classnames';
import {
  ListSelect,
  AccountsSelectList,
  FieldRequiredHint,
  Hint,
  AppToaster,
  ErrorMessage,
  DialogContent,
} from 'components';

import withItemCategories from 'containers/Items/withItemCategories';
import withItemCategoryDetail from 'containers/Items/withItemCategoryDetail';
import withItemCategoriesActions from 'containers/Items/withItemCategoriesActions';

import withAccounts from 'containers/Accounts/withAccounts';
import withAccountsActions from 'containers/Accounts/withAccountsActions';

import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

function ItemCategoryFormDialogContent({
  // #withDialogActions
  closeDialog,

  // #withItemCategoryDetail
  itemCategory,

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
  const { formatMessage } = useIntl();
  const [selectedParentCategory, setParentCategory] = useState(null);

  const fetchList = useQuery(['items-categories-list'], () =>
    requestFetchItemCategories(),
  );
  const fetchAccounts = useQuery(
    'accounts-list',
    () => requestFetchAccounts(),
    { enabled: false },
  );

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required()
      .label(formatMessage({ id: 'category_name_' })),
    parent_category_id: Yup.string().nullable(),
    cost_account_id: Yup.number().nullable(),
    sell_account_id: Yup.number().nullable(),
    inventory_account_id: Yup.number(),
    description: Yup.string().trim().nullable(),
  });

  const initialValues = useMemo(
    () => ({
      name: '',
      description: '',
      parent_category_id: null,
      cost_account_id: null,
      sell_account_id: null,
      inventory_account_id: null,
    }),
    [],
  );

  // Formik
  const {
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    handleSubmit,
    getFieldProps,
  } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...initialValues,
      ...(action === 'edit' && pick(itemCategory, Object.keys(initialValues))),
    },
    onSubmit: (values, { setSubmitting }) => {
      const afterSubmit = () => {
        closeDialog(dialogName);
        queryCache.invalidateQueries('items-categories-list');
        queryCache.invalidateQueries('accounts-list');
      };
      if (action === 'edit') {
        requestEditItemCategory(itemCategoryId, values)
          .then((response) => {
            AppToaster.show({
              message: formatMessage({
                id: 'the_item_category_has_been_successfully_edited',
              }),
              intent: Intent.SUCCESS,
            });
            afterSubmit(response);
          })
          .catch((error) => {
            setSubmitting(false);
          });
      } else {
        requestSubmitItemCategory(values)
          .then((response) => {
            AppToaster.show({
              message: formatMessage({
                id: 'the_item_category_has_been_successfully_created',
              }),
              intent: Intent.SUCCESS,
            });
            afterSubmit(response);
          })
          .catch((error) => {
            setSubmitting(false);
          });
      }
    },
  });

  const filterItemCategory = useCallback(
    (query, category, _index, exactMatch) => {
      const normalizedTitle = category.name.toLowerCase();
      const normalizedQuery = query.toLowerCase();

      if (exactMatch) {
        return normalizedTitle === normalizedQuery;
      } else {
        return normalizedTitle.indexOf(normalizedQuery) >= 0;
      }
    },
    [],
  );

  const parentCategoryItem = useCallback(
    (category, { handleClick, modifiers, query }) => {
      return (
        <MenuItem
          text={category.name}
          key={category.id}
          onClick={handleClick}
        />
      );
    },
    [],
  );

  // Handle the dialog closing.
  const handleClose = useCallback(() => {
    closeDialog(dialogName);
  }, [dialogName, closeDialog]);

  const onChangeParentCategory = useCallback(
    (parentCategory) => {
      setParentCategory(parentCategory);
      setFieldValue('parent_category_id', parentCategory.id);
    },
    [setFieldValue],
  );

  const onItemAccountSelect = useCallback(
    (filedName) => {
      return (account) => {
        setFieldValue(filedName, account.id);
      };
    },
    [setFieldValue],
  );

  return (
    <DialogContent isLoading={fetchList.isFetching || fetchAccounts.isFetching}>
      <form onSubmit={handleSubmit}>
        <div className={Classes.DIALOG_BODY}>
          
          {/* ----------- Category name ----------- */}
          <FormGroup
            label={<T id={'category_name'} />}
            labelInfo={FieldRequiredHint}
            className={'form-group--category-name'}
            intent={errors.name && touched.name && Intent.DANGER}
            helperText={<ErrorMessage name="name" {...{ errors, touched }} />}
            inline={true}
          >
            <InputGroup
              medium={true}
              intent={errors.name && touched.name && Intent.DANGER}
              {...getFieldProps('name')}
            />
          </FormGroup>
          {/* ----------- Parent Category ----------- */}
          <FormGroup
            label={<T id={'parent_category'} />}
            labelInfo={Hint}
            className={classNames(
              'form-group--select-list',
              'form-group--parent-category',
              Classes.FILL,
            )}
            inline={true}
            helperText={
              <ErrorMessage
                name="parent_category_id"
                {...{ errors, touched }}
              />
            }
            intent={
              errors.parent_category_id &&
              touched.parent_category_id &&
              Intent.DANGER
            }
          >
            <ListSelect
              items={categoriesList}
              noResults={<MenuItem disabled={true} text="No results." />}
              itemRenderer={parentCategoryItem}
              itemPredicate={filterItemCategory}
              popoverProps={{ minimal: true }}
              onItemSelect={onChangeParentCategory}
              selectedItem={values.parent_category_id}
              selectedItemProp={'id'}
              defaultText={<T id={'select_parent_category'} />}
              labelProp={'name'}
            />
          </FormGroup>
          {/* ----------- Description ----------- */}
          <FormGroup
            label={<T id={'description'} />}
            className={'form-group--description'}
            intent={errors.description && touched.description && Intent.DANGER}
            helperText={
              <ErrorMessage name="description" {...{ errors, touched }} />
            }
            inline={true}
          >
            <TextArea
              growVertically={true}
              large={true}
              {...getFieldProps('description')}
            />
          </FormGroup>
          {/* ----------- Cost account ----------- */}
          <FormGroup
            label={<T id={'cost_account'} />}
            inline={true}
            intent={
              errors.cost_account_id && touched.cost_account_id && Intent.DANGER
            }
            helperText={
              <ErrorMessage {...{ errors, touched }} name="cost_account_id" />
            }
            className={classNames(
              'form-group--cost-account',
              'form-group--select-list',
              Classes.FILL,
            )}
          >
            <AccountsSelectList
              accounts={accountsList}
              onAccountSelected={onItemAccountSelect('cost_account_id')}
              defaultSelectText={<T id={'select_account'} />}
              selectedAccountId={values.cost_account_id}
            />
          </FormGroup>
          {/* ----------- Sell account ----------- */}
          <FormGroup
            label={<T id={'sell_account'} />}
            inline={true}
            intent={
              errors.sell_account_id && touched.sell_account_id && Intent.DANGER
            }
            helperText={
              <ErrorMessage {...{ errors, touched }} name="sell_account_id" />
            }
            className={classNames(
              'form-group--sell-account',
              'form-group--select-list',
              Classes.FILL,
            )}
          >
            <AccountsSelectList
              accounts={accountsList}
              onAccountSelected={onItemAccountSelect('sell_account_id')}
              defaultSelectText={<T id={'select_account'} />}
              selectedAccountId={values.sell_account_id}
            />
          </FormGroup>
          {/* ----------- inventory account ----------- */}
          <FormGroup
            label={<T id={'inventory_account'} />}
            inline={true}
            intent={
              errors.inventory_account_id &&
              touched.inventory_account_id &&
              Intent.DANGER
            }
            helperText={
              <ErrorMessage
                {...{ errors, touched }}
                name="inventory_account_id"
              />
            }
            className={classNames(
              'form-group--sell-account',
              'form-group--select-list',
              Classes.FILL,
            )}
          >
            <AccountsSelectList
              accounts={accountsList}
              onAccountSelected={onItemAccountSelect('inventory_account_id')}
              defaultSelectText={<T id={'select_account'} />}
              selectedAccountId={values.inventory_account_id}
            />
          </FormGroup>
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={handleClose}>
              <T id={'close'} />
            </Button>
            <Button
              intent={Intent.PRIMARY}
              type="submit"
              disabled={isSubmitting}
            >
              {action === 'edit' ? <T id={'edit'} /> : <T id={'submit'} />}
            </Button>
          </div>
        </div>
      </form>
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
