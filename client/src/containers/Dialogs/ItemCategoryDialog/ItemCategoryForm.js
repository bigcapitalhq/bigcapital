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

import { useAutofocus } from 'hooks';

export default function ItemCategoryForm({
  itemCategoryId,
  accountsList,
  categoriesList,
  isSubmitting,
  onClose,
}) {
  const categoryNameFieldRef = useAutofocus();

  return (
    <Form>
      <div className={Classes.DIALOG_BODY}>
        {/* ----------- Category name ----------- */}
        <FastField name={'name'}>
          {({ field, field: { value }, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'category_name'} />}
              labelInfo={<FieldRequiredHint />}
              className={'form-group--category-name'}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="name" />}
              inline={true}
            >
              <InputGroup
                medium={true}
                inputRef={(ref) => (categoryNameFieldRef.current = ref)}
                {...field}
              />
            </FormGroup>
          )}
        </FastField>


        {/* ----------- Description ----------- */}
        <FastField name={'description'}>
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
                  form.setFieldValue('cost_account_id', account.id);
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
          <Button onClick={onClose}>
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
