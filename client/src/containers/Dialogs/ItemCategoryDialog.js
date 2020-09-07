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
import { Select } from '@blueprintjs/select';
import { pick } from 'lodash';
import * as Yup from 'yup';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { useFormik } from 'formik';
import { compose } from 'utils';
import { useQuery, queryCache } from 'react-query';
import classNames from 'classnames';
import { connect } from 'react-redux';

import AppToaster from 'components/AppToaster';
import ErrorMessage from 'components/ErrorMessage';
import { ListSelect, AccountsSelectList } from 'components';

import Dialog from 'components/Dialog';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withDialogRedux from 'components/DialogReduxConnect';

import withAccounts from 'containers/Accounts/withAccounts';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withItemCategoryDetail from 'containers/Items/withItemCategoryDetail';
import withItemCategories from 'containers/Items/withItemCategories';
import withItemCategoriesActions from 'containers/Items/withItemCategoriesActions';

import Icon from 'components/Icon';

function ItemCategoryDialog({
  dialogName,
  payload = {},
  isOpen,

  // #withDialog
  openDialog,
  closeDialog,

  // #withItemCategoryDetail
  itemCategoryId,
  itemCategory,

  // #withItemCategories
  categoriesList,

  //# withAccount
  accountsList,

  // #withItemCategoriesActions
  requestSubmitItemCategory,
  requestFetchItemCategories,
  requestEditItemCategory,

  // #withAccountsActions
  requestFetchAccounts,
}) {
  const [selectedParentCategory, setParentCategory] = useState(null);
  const { formatMessage } = useIntl();

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
    cost_account_id: Yup.number()
      .required()
      .label(formatMessage({ id: 'cost_account_' })),
    sell_account_id: Yup.number()
      .required()
      .label(formatMessage({ id: 'sell_account_' })),
    inventory_account_id: Yup.number()
      .required()
      .label(formatMessage({ id: 'inventory_account_' })),
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
    setFieldValue,
    handleSubmit,
    resetForm,
    getFieldProps,
    isSubmitting,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...(payload.action === 'edit' &&
        pick(itemCategory, Object.keys(initialValues))),
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      const afterSubmit = () => {
        closeDialog(dialogName);
        queryCache.invalidateQueries('items-categories-table');
        queryCache.invalidateQueries('accounts-list');
      };
      if (payload.action === 'edit') {
        requestEditItemCategory(payload.id, values)
          .then((response) => {
            afterSubmit(response);
            AppToaster.show({
              message: formatMessage({
                id: 'the_item_category_has_been_successfully_edited',
              }),
              intent: Intent.SUCCESS,
            });
          })
          .catch((error) => {
            setSubmitting(false);
          });
      } else {
        requestSubmitItemCategory(values)
          .then((response) => {
            afterSubmit(response);
            AppToaster.show({
              message: formatMessage({
                id: 'the_item_category_has_been_successfully_created',
              }),
              intent: Intent.SUCCESS,
            });
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

  // Handle the dialog opening.
  const onDialogOpening = useCallback(() => {
    fetchList.refetch();
    fetchAccounts.refetch();
  }, [fetchList, fetchAccounts]);

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

  const onDialogClosed = useCallback(() => {
    resetForm();
    closeDialog(dialogName);
  }, [resetForm, closeDialog, dialogName]);

  const requiredSpan = useMemo(() => <span class="required">*</span>, []);
  const infoIcon = useMemo(() => <Icon icon="info-circle" iconSize={12} />, []);

  return (
    <Dialog
      name={dialogName}
      title={
        payload.action === 'edit' ? (
          <T id={'edit_category'} />
        ) : (
          <T id={'new_category'} />
        )
      }
      className={classNames(
        {
          'dialog--loading': fetchList.isFetching || fetchAccounts.isFetching,
        },
        'dialog--category-form',
      )}
      isOpen={isOpen}
      onClosed={onDialogClosed}
      onOpening={onDialogOpening}
      isLoading={fetchList.isFetching || fetchAccounts.isFetching}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit}>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup
            label={<T id={'category_name'} />}
            labelInfo={requiredSpan}
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

          <FormGroup
            label={<T id={'parent_category'} />}
            labelInfo={infoIcon}
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

          {/* cost account */}
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

          {/* sell Account */}
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
          {/* inventory Account */}
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
              {payload.action === 'edit' ? (
                <T id={'edit'} />
              ) : (
                <T id={'submit'} />
              )}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}

const mapStateToProps = (state, props) => ({
  dialogName: 'item-category-form',
  itemCategoryId: props?.payload?.id || null,
});

const withItemCategoryDialog = connect(mapStateToProps);

export default compose(
  withDialogRedux(null, 'item-category-form'),
  withItemCategoryDialog,
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
)(ItemCategoryDialog);
