import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
  TextArea,
  MenuItem,
  Checkbox,
  Position,
} from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { FormattedMessage as T, useIntl } from 'react-intl';

import { omit } from 'lodash';
import { useQuery, queryCache } from 'react-query';

import Dialog from 'components/Dialog';
import AppToaster from 'components/AppToaster';

import AccountFormDialogContainer from 'containers/Dialogs/AccountFormDialog.container';

import classNames from 'classnames';
import Icon from 'components/Icon';
import ErrorMessage from 'components/ErrorMessage';
import { fetchAccountTypes } from 'store/accounts/accounts.actions';


import {ListSelect} from 'components';

function AccountFormDialog({
  name,
  payload,
  isOpen,

  // #withAccounts
  accountsTypes,
  accounts,

  // #withAccountDetail
  account,

  // #withAccountsActions
  requestFetchAccounts,
  requestFetchAccountTypes,
  requestFetchAccount,
  requestSubmitAccount,
  requestEditAccount,

  // #withDialog
  closeDialog,
}) { 
  const { formatMessage } = useIntl();
  const accountFormValidationSchema = Yup.object().shape({
    name: Yup.string().required().label(formatMessage({id:'account_name_'})),
    code: Yup.number(),
    account_type_id: Yup.string()
      .nullable()
      .required().label(formatMessage({id:'account_type_id'})),
    description: Yup.string().trim()
  });

  const initialValues = useMemo(
    () => ({
      account_type_id: null,
      name: '',
      description: '',
    }),
    []
  );

  const [selectedAccountType, setSelectedAccountType] = useState(null);
  const [selectedSubaccount, setSelectedSubaccount] = useState(
    payload.action === 'new_child'
      ? accounts.find((a) => a.id === payload.id)
      : null
  );

  const transformApiErrors = (errors) => {
    const fields = {};
    if (errors.find((e) => e.type === 'NOT_UNIQUE_CODE')) {
      fields.code = 'Account code is not unqiue.';
    }
    return fields;
  };

  // Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...(payload.action === 'edit' && account ? account : initialValues),
    },
    validationSchema: accountFormValidationSchema,
    onSubmit: (values, { setSubmitting, setErrors }) => {
      const exclude = ['subaccount'];
      const toastAccountName = (values.code) ? `${values.code} - ${values.name}` : values.name;

      if (payload.action === 'edit') {
        requestEditAccount({
          payload: payload.id,
          form: { ...omit(values, [...exclude, 'account_type_id']) }
        }).then((response) => {
          closeDialog(name);
          AppToaster.show({
            message: formatMessage({
              id: 'service_has_been_successful_edited',
            }, {
              name: toastAccountName,
              service: formatMessage({ id: 'account' }),
            }),
            intent: Intent.SUCCESS,
          });
        });
      } else {
        requestSubmitAccount({ form: { ...omit(values, exclude) } }).then((response) => {
          closeDialog(name);
          AppToaster.show({
            message: formatMessage({
              id: 'service_has_been_successful_created',  
            }, {
              name: toastAccountName,
              service: formatMessage({ id: 'account' }),
            }),
            intent: Intent.SUCCESS,
            position: Position.BOTTOM,
          });
        });
      }
    },
  });
  const { errors, values, touched } = useMemo(() => formik, [formik]);

  // Set default account type.
  useEffect(() => {
    if (account && account.account_type_id) {
      const defaultType = accountsTypes.find(
        (t) => t.id === account.account_type_id
      );

      defaultType && setSelectedAccountType(defaultType);
    }
  }, [account, accountsTypes]);

  // Filters accounts types items.
  const filterAccountTypeItems = (query, accountType, _index, exactMatch) => {
    const normalizedTitle = accountType.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return normalizedTitle.indexOf(normalizedQuery) >= 0;
    }
  };

  // Account type item of select filed.
  const accountTypeItem = (item, { handleClick, modifiers, query }) => {
    return <MenuItem text={item.name} key={item.id} onClick={handleClick} />;
  };

  // Account item of select accounts field.
  const accountItem = (item, { handleClick, modifiers, query }) => {
    return (
      <MenuItem
        text={item.name}
        label={item.code}
        key={item.id}
        onClick={handleClick}
      />
    );
  };

  // Filters accounts items.
  const filterAccountsPredicater = useCallback(
    (query, account, _index, exactMatch) => {
      const normalizedTitle = account.name.toLowerCase();
      const normalizedQuery = query.toLowerCase();

      if (exactMatch) {
        return normalizedTitle === normalizedQuery;
      } else {
        return (
          `${account.code} ${normalizedTitle}`.indexOf(normalizedQuery) >= 0
        );
      }
    },
    []
  );

  // Handles dialog close.
  const handleClose = useCallback(() => {
    closeDialog(name);
  }, [closeDialog, name]);

  // Fetches accounts list.
  const fetchAccountsList = useQuery(
    'accounts-list',
    () => requestFetchAccounts(),
    { manual: true }
  );

  // Fetches accounts types.
  const fetchAccountsTypes = useQuery(
    'accounts-types-list',
    async () => {
      await requestFetchAccountTypes();
    },
    { manual: true }
  );

  // Fetch the given account id on edit mode.
  const fetchAccount = useQuery(
    payload.action === 'edit' && ['account', payload.id],
    (key, id) => requestFetchAccount(id),
    { manual: true }
  );

  const isFetching =
    fetchAccountsList.isFetching ||
    fetchAccountTypes.isFetching ||
    fetchAccount.isFetching;

  // Fetch requests on dialog opening.
  const onDialogOpening = useCallback(() => {
    fetchAccountsList.refetch();
    fetchAccountsTypes.refetch();
    fetchAccount.refetch();
  }, []);

  const onChangeAccountType = useCallback(
    (accountType) => {
      formik.setFieldValue('account_type_id', accountType.id);
    },
    [setSelectedAccountType, formik]
  );

  // Handles change sub-account.
  const onChangeSubaccount = useCallback(
    (account) => {
      setSelectedSubaccount(account);
      formik.setFieldValue('parent_account_id', account.id);
    },
    [setSelectedSubaccount, formik]
  );

  const onDialogClosed = useCallback(() => {
    formik.resetForm();
    setSelectedSubaccount(null);
    setSelectedAccountType(null);
  }, [formik]);

  const infoIcon = useMemo(() => <Icon icon='info-circle' iconSize={12} />, []);

  const subAccountLabel = useMemo(() => {
    return (
      <span>
        <T id={'sub_account'}/> <Icon icon='info-circle' iconSize={12} />
      </span>
    );
  }, []);

  const requiredSpan = useMemo(() => <span class='required'>*</span>, []);

  return (
    <Dialog
      name={name}
      title={payload.action === 'edit' ? <T id={'edit_account'}/> : <T id={'new_account'}/>}
      className={{
        'dialog--loading': isFetching,
        'dialog--account-form': true,
      }}
      autoFocus={true}
      canEscapeKeyClose={true}
      onClosed={onDialogClosed}
      onOpening={onDialogOpening}
      isOpen={isOpen}
      isLoading={isFetching}
      onClose={handleClose}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup
            label={<T id={'account_type'}/>}
            labelInfo={requiredSpan}
            className={classNames(
              'form-group--account-type',
              'form-group--select-list',
              Classes.FILL
            )}
            inline={true}
            helperText={<ErrorMessage name='account_type_id' {...formik} />}
            intent={
              errors.account_type_id && touched.account_type_id && Intent.DANGER
            }
          >
            <ListSelect
              items={accountsTypes}
              noResults={<MenuItem disabled={true} text='No results.' />}
              itemRenderer={accountTypeItem}
              itemPredicate={filterAccountTypeItems}
              popoverProps={{ minimal: true }}
              onItemSelect={onChangeAccountType}

              selectedItem={formik.values.account_type_id}
              selectedItemProp={'id'}
              
              defaultText={<T id={'select_account_type'} />}
              labelProp={'name'}
              buttonProps={{ disabled: payload.action === 'edit' }} />
          </FormGroup>

          <FormGroup
            label={<T id={'account_name'}/>}
            labelInfo={requiredSpan}
            className={'form-group--account-name'}
            intent={errors.name && touched.name && Intent.DANGER}
            helperText={<ErrorMessage name='name' {...formik} />}
            inline={true}
          >
            <InputGroup
              medium={true}
              intent={errors.name && touched.name && Intent.DANGER}
              {...formik.getFieldProps('name')}
            />
          </FormGroup>

          <FormGroup
            label={<T id={'account_code'}/>}
            className={'form-group--account-code'}
            intent={errors.code && touched.code && Intent.DANGER}
            helperText={<ErrorMessage name='code' {...formik} />}
            inline={true}
            labelInfo={infoIcon}
          >
            <InputGroup
              medium={true}
              intent={errors.code && touched.code && Intent.DANGER}
              {...formik.getFieldProps('code')}
            />
          </FormGroup>

          <FormGroup
            label={' '}
            className={classNames('form-group--subaccount')}
            inline={true}
          >
            <Checkbox
              inline={true}
              label={subAccountLabel}
              {...formik.getFieldProps('subaccount')}
            />
          </FormGroup>

          {values.subaccount && (
            <FormGroup
              label={<T id={'parent_account'}/>}
              className={classNames(
                'form-group--parent-account',
                'form-group--select-list',
                Classes.FILL
              )}
              inline={true}
            >
              <Select
                items={accounts}
                noResults={<MenuItem disabled={true} text='No results.' />}
                itemRenderer={accountItem}
                itemPredicate={filterAccountsPredicater}
                popoverProps={{ minimal: true }}
                onItemSelect={onChangeSubaccount}
                {...formik.getFieldProps('parent_account_id')}
              >
                <Button
                  rightIcon='caret-down'
                  text={
                    selectedSubaccount
                      ? selectedSubaccount.name
                      : <T id={'select_parent_account'}/>
                  }
                />
              </Select>
            </FormGroup>
          )}

          <FormGroup
            label={<T id={'description'}/>}
            className={'form-group--description'}
            intent={formik.errors.description && Intent.DANGER}
            helperText={formik.errors.description && formik.errors.credential}
            inline={true}
          >
            <TextArea
              growVertically={true}
              large={true}
              {...formik.getFieldProps('description')}
            />
          </FormGroup>
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={handleClose}><T id={'close'}/></Button>
            <Button
              intent={Intent.PRIMARY}
              disabled={formik.isSubmitting}
              type='submit'
            >
              {payload.action === 'edit' ? <T id={'edit'}/> : <T id={'submit'}/>}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}

export default AccountFormDialogContainer(AccountFormDialog);
