import React, { useCallback, useMemo } from 'react';
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
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { omit, pick } from 'lodash';
import { useQuery, queryCache } from 'react-query';
import classNames from 'classnames';
import {
  ListSelect,
  ErrorMessage,
  Dialog,
  AppToaster,
  FieldRequiredHint,
  Hint,
} from 'components';
import AccountFormDialogContainer from 'containers/Dialogs/AccountFormDialog.container';

/**
 * Account form dialog.
 */
function AccountFormDialog({
  dialogName,
  payload = { action: 'new', id: null },
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
    name: Yup.string()
      .required()
      .label(formatMessage({ id: 'account_name_' })),
    code: Yup.number(),
    account_type_id: Yup.string()
      .nullable()
      .required()
      .label(formatMessage({ id: 'account_type_id' })),
    description: Yup.string().trim(),
  });

  const initialValues = useMemo(
    () => ({
      account_type_id: null,
      name: '',
      description: '',
    }),
    [],
  );

  const transformApiErrors = (errors) => {
    const fields = {};
    if (errors.find((e) => e.type === 'NOT_UNIQUE_CODE')) {
      fields.code = 'Account code is not unqiue.';
    }
    return fields;
  };

  // Formik
  const {
    errors,
    values,
    touched,
    setFieldValue,
    resetForm,
    handleSubmit,
    isSubmitting,
    getFieldProps,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...(payload.action === 'edit' && account ? account : initialValues),
    },
    validationSchema: accountFormValidationSchema,
    onSubmit: (values, { setSubmitting, setErrors }) => {
      const exclude = ['subaccount'];
      const toastAccountName = values.code
        ? `${values.code} - ${values.name}`
        : values.name;

      if (payload.action === 'edit') {
        requestEditAccount({
          payload: payload.id,
          // form: { ...omit(values, [...exclude, 'account_type_id']) },
          form: {
            ...pick(values, [
              ...exclude,
              'account_type_id',
              'name',
              'description',
            ]),
          },
        })
          .then((response) => {
            closeDialog(dialogName);
            queryCache.refetchQueries('accounts-table', { force: true });

            AppToaster.show({
              message: formatMessage(
                { id: 'service_has_been_successful_edited' },
                {
                  name: toastAccountName,
                  service: formatMessage({ id: 'account' }),
                },
              ),
              intent: Intent.SUCCESS,
            });
          })
          .catch((errors) => {
            const errorsTransformed = transformApiErrors(errors);
            setErrors({ ...errorsTransformed });
            setSubmitting(false);
          });
      } else {
        requestSubmitAccount({ form: { ...omit(values, exclude) } })
          .then((response) => {
            closeDialog(dialogName);
            queryCache.refetchQueries('accounts-table', { force: true });

            AppToaster.show({
              message: formatMessage(
                { id: 'service_has_been_successful_created' },
                {
                  name: toastAccountName,
                  service: formatMessage({ id: 'account' }),
                },
              ),
              intent: Intent.SUCCESS,
              position: Position.BOTTOM,
            });
          })
          .catch((errors) => {
            const errorsTransformed = transformApiErrors(errors);
            setErrors({ ...errorsTransformed });
            setSubmitting(false);
          });
      }
    },
  });

  // Filtered accounts based on the given account type.
  const filteredAccounts = useMemo(
    () =>
      accounts.filter(
        (account) => account.account_type_id === values.account_type_id,
      ),
    [accounts, values.account_type_id],
  );

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
    [],
  );

  // Handles dialog close.
  const handleClose = useCallback(() => {
    closeDialog(dialogName);
  }, [closeDialog, dialogName]);

  // Fetches accounts list.
  const fetchAccountsList = useQuery(
    'accounts-list',
    () => requestFetchAccounts(),
    { enabled: true },
  );

  // Fetches accounts types.
  const fetchAccountsTypes = useQuery(
    'accounts-types-list',
    async () => {
      await requestFetchAccountTypes();
    },
    { enabled: true },
  );

  // Fetch the given account id on edit mode.
  const fetchAccount = useQuery(
    ['account', payload.id],
    (key, id) => requestFetchAccount(id),
    { enabled: false },
  );

  const isFetching =
    fetchAccountsList.isFetching ||
    fetchAccountsTypes.isFetching ||
    fetchAccount.isFetching;

  // Fetch requests on dialog opening.
  const onDialogOpening = useCallback(() => {
    fetchAccountsList.refetch();
    fetchAccountsTypes.refetch();

    if (payload.action === 'edit' && payload.id) {
      fetchAccount.refetch();
    }    
  }, [payload, fetchAccount, fetchAccountsList, fetchAccountsTypes]);

  const onChangeAccountType = useCallback(
    (accountType) => {
      setFieldValue('account_type_id', accountType.id);
    },
    [setFieldValue],
  );

  // Handles change sub-account.
  const onChangeSubaccount = useCallback(
    (account) => {
      setFieldValue('parent_account_id', account.id);
    },
    [setFieldValue],
  );

  const onDialogClosed = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const subAccountLabel = useMemo(() => {
    return (
      <span>
        <T id={'sub_account'} />
        <Hint />
      </span>
    );
  }, []);

  const requiredSpan = useMemo(() => <span class="required">*</span>, []);

  return (
    <Dialog
      name={dialogName}
      title={
        payload.action === 'edit' ? (
          <T id={'edit_account'} />
        ) : (
          <T id={'new_account'} />
        )
      }
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
      <form onSubmit={handleSubmit}>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup
            label={<T id={'account_type'} />}
            labelInfo={<FieldRequiredHint />}
            className={classNames(
              'form-group--account-type',
              'form-group--select-list',
              Classes.FILL,
            )}
            inline={true}
            helperText={
              <ErrorMessage name="account_type_id" {...{ errors, touched }} />
            }
            intent={
              errors.account_type_id && touched.account_type_id && Intent.DANGER
            }
          >
            <ListSelect
              items={accountsTypes}
              noResults={<MenuItem disabled={true} text="No results." />}
              itemRenderer={accountTypeItem}
              itemPredicate={filterAccountTypeItems}
              popoverProps={{ minimal: true }}
              onItemSelect={onChangeAccountType}
              selectedItem={values.account_type_id}
              selectedItemProp={'id'}
              defaultText={<T id={'select_account_type'} />}
              labelProp={'name'}
              buttonProps={{ disabled: payload.action === 'edit' }}
            />
          </FormGroup>

          <FormGroup
            label={<T id={'account_name'} />}
            labelInfo={<FieldRequiredHint />}
            className={'form-group--account-name'}
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
            label={<T id={'account_code'} />}
            className={'form-group--account-code'}
            intent={errors.code && touched.code && Intent.DANGER}
            helperText={<ErrorMessage name="code" {...{ errors, touched }} />}
            inline={true}
            labelInfo={<Hint content={<T id='account_code_hint' />} />}
          >
            <InputGroup
              medium={true}
              intent={errors.code && touched.code && Intent.DANGER}
              {...getFieldProps('code')}
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
              {...getFieldProps('subaccount')}
            />
          </FormGroup>

          {values.subaccount && (
            <FormGroup
              label={<T id={'parent_account'} />}
              className={classNames(
                'form-group--parent-account',
                'form-group--select-list',
                Classes.FILL,
              )}
              inline={true}
            >
              <ListSelect
                items={filteredAccounts}
                noResults={<MenuItem disabled={true} text="No results." />}
                itemRenderer={accountItem}
                itemPredicate={filterAccountsPredicater}
                popoverProps={{ minimal: true }}
                onItemSelect={onChangeSubaccount}
                selectedItem={values.parent_account_id}
                selectedItemProp={'id'}
                defaultText={<T id={'select_parent_account'} />}
                labelProp={'name'}
              />
            </FormGroup>
          )}

          <FormGroup
            label={<T id={'description'} />}
            className={'form-group--description'}
            intent={errors.description && Intent.DANGER}
            helperText={errors.description && errors.credential}
            inline={true}
          >
            <TextArea
              growVertically={true}
              large={true}
              {...getFieldProps('description')}
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
              disabled={isSubmitting}
              type="submit"
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

export default AccountFormDialogContainer(AccountFormDialog);
