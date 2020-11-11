import React, { useCallback } from 'react';
import {
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
  TextArea,
  MenuItem,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';
import { ErrorMessage, Form, FastField } from 'formik';
import {
  ListSelect,
  AccountsSelectList,
  FieldRequiredHint,
  Hint,
} from 'components';
import { inputIntent } from 'utils';

export default function ItemCategoryForm({
  itemCategoryId,
  accountsList,
  categoriesList,
  isSubmitting,
}) {
  // Filters Item Categories list.
  const filterItemCategories = useCallback(
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

  return (
    <Form>
      <div className={Classes.DIALOG_BODY}>
        {/* ----------- Category name ----------- */}
        <FastField name={'name'}>
          {({ field, field: { value }, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'category_name'} />}
              labelInfo={FieldRequiredHint}
              className={'form-group--category-name'}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="name" />}
              inline={true}
            >
              <InputGroup medium={true} {...field} />
            </FormGroup>
          )}
        </FastField>

        {/* ----------- Parent Category ----------- */}
        <FastField name={'parent_account_id'}>
          {({ form, field: { value }, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'parent_category'} />}
              labelInfo={Hint}
              className={classNames(
                'form-group--select-list',
                'form-group--parent-category',
                Classes.FILL,
              )}
              inline={true}
              helperText={<ErrorMessage name="parent_category_id" />}
              intent={inputIntent({ error, touched })}
            >
              <ListSelect
                items={categoriesList}
                noResults={<MenuItem disabled={true} text="No results." />}
                itemRenderer={parentCategoryItem}
                itemPredicate={filterItemCategories}
                popoverProps={{ minimal: true }}
                onItemSelect={(parentCategory) => {
                  form.setFieldValue('parent_category_id', parentCategory.id);
                }}
                selectedItem={value}
                selectedItemProp={'id'}
                defaultText={<T id={'select_parent_category'} />}
                labelProp={'name'}
              />
            </FormGroup>
          )}
        </FastField>

        {/* ----------- Description ----------- */}
        <FastField name={'description`'}>
          {({ field, field: { value }, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'description'} />}
              className={'form-group--description'}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="description" />}
              inline={true}
            >
              <TextArea growVertically={true} large={true} {...field} />
            </FormGroup>
          )}
        </FastField>

        {/* ----------- Cost account ----------- */}
        <FastField name={'cost_account_id'}>
          {({ form, field: { value }, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'cost_account'} />}
              inline={true}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="cost_account_id" />}
              className={classNames(
                'form-group--cost-account',
                'form-group--select-list',
                Classes.FILL,
              )}
            >
              <AccountsSelectList
                accounts={accountsList}
                onAccountSelected={(account) => {
                  form.setFieldValue(account.id);
                }}
                defaultSelectText={<T id={'select_account'} />}
                selectedAccountId={value}
                filterByTypes={['cost_of_goods_sold']}
              />
            </FormGroup>
          )}
        </FastField>

        {/* ----------- Sell account ----------- */}
        <FastField name={'sell_account_id'}>
          {({ form, field: { value }, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'sell_account'} />}
              inline={true}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="sell_account_id" />}
              className={classNames(
                'form-group--sell-account',
                'form-group--select-list',
                Classes.FILL,
              )}
            >
              <AccountsSelectList
                accounts={accountsList}
                onAccountSelected={(account) => {
                  form.setFieldValue('sell_account_id', account.id);
                }}
                defaultSelectText={<T id={'select_account'} />}
                selectedAccountId={value}
                filterByTypes={['income']}
              />
            </FormGroup>
          )}
        </FastField>

        {/* ----------- inventory account ----------- */}
        <FastField name={'inventory_account_id'}>
          {({ form, field: { value }, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'inventory_account'} />}
              inline={true}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="inventory_account_id" />}
              className={classNames(
                'form-group--sell-account',
                'form-group--select-list',
                Classes.FILL,
              )}
            >
              <AccountsSelectList
                accounts={accountsList}
                onAccountSelected={(account) => {
                  form.setFieldValue('inventory_account_id', account.id);
                }}
                defaultSelectText={<T id={'select_account'} />}
                selectedAccountId={value}
              />
            </FormGroup>
          )}
        </FastField>
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button>
            <T id={'close'} />
          </Button>
          <Button intent={Intent.PRIMARY} type="submit" disabled={isSubmitting}>
            {itemCategoryId ? <T id={'edit'} /> : <T id={'submit'} />}
          </Button>
        </div>
      </div>
    </Form>
  );
}
