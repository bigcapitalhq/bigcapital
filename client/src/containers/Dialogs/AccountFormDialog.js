import React, { useCallback, useMemo, useEffect } from 'react';
import {
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
  TextArea,
  Checkbox,
  Position,
} from '@blueprintjs/core';
import { useFormik } from 'formik';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { pick, omit } from 'lodash';
import { useQuery, queryCache } from 'react-query';
import classNames from 'classnames';
import Yup from 'services/yup';
import {
  If,
  ErrorMessage,
  Dialog,
  AppToaster,
  FieldRequiredHint,
  Hint,
  AccountsSelectList,
  AccountsTypesSelect,
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
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required()
      .min(3)
      .max(255)
      .label(formatMessage({ id: 'account_name_' })),
    code: Yup.string().digits().min(3).max(6),
    account_type_id: Yup.number()
      .required()
      .label(formatMessage({ id: 'account_type_id' })),
    description: Yup.string().min(3).max(512).nullable().trim(),
    parent_account_id: Yup.number().nullable(),
  });
  const initialValues = useMemo(
    () => ({
      account_type_id: null,
      name: '',
      code: '',
      description: '',
    }),
    [],
  );
  const transformApiErrors = (errors) => {
    const fields = {};
    if (errors.find((e) => e.type === 'NOT_UNIQUE_CODE')) {
      fields.code = formatMessage({ id: 'account_code_is_not_unique' });
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
      ...initialValues,
      ...(payload.action === 'edit' &&
        pick(account, Object.keys(initialValues))),
    },
    validationSchema,
    onSubmit: (values, { setSubmitting, setErrors }) => {
      const form = omit(values, ['subaccount']);
      const toastAccountName = values.code
        ? `${values.code} - ${values.name}`
        : values.name;

      const afterSubmit = () => {
        closeDialog(dialogName);
        queryCache.invalidateQueries('accounts-table');
        queryCache.invalidateQueries('accounts-list');
      };
      const afterErrors = (errors) => {
        const errorsTransformed = transformApiErrors(errors);
        setErrors({ ...errorsTransformed });
        setSubmitting(false);
      };
      if (payload.action === 'edit') {
        requestEditAccount(payload.id, form)
          .then((response) => {
            afterSubmit(response);

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
          .catch(afterErrors);
      } else {
        requestSubmitAccount({ form })
          .then((response) => {
            afterSubmit(response);

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
          .catch(afterErrors);
      }
    },
  });

  useEffect(() => {
    if (values.parent_account_id) {
      setFieldValue('subaccount', true);
    }
  }, [values.parent_account_id]);
  
  // Reset `parent account id` after change `account type`.
  useEffect(() => {
    setFieldValue('parent_account_id', null);
  }, [values.account_type_id]);

  // Filtered accounts based on the given account type.
  const filteredAccounts = useMemo(
    () =>
      accounts.filter(
        (account) =>
          account.account_type_id === values.account_type_id ||
          !values.account_type_id,
      ),
    [accounts, values.account_type_id],
  );

  // Handles dialog close.
  const handleClose = useCallback(() => {
    closeDialog(dialogName);
  }, [closeDialog, dialogName]);

  // Fetches accounts list.
  const fetchAccountsList = useQuery(
    'accounts-list',
    () => requestFetchAccounts(),
    { enabled: false },
  );

  // Fetches accounts types.
  const fetchAccountsTypes = useQuery(
    'accounts-types-list',
    async () => {
      await requestFetchAccountTypes();
    },
    { enabled: false },
  );

  // Fetch the given account id on edit mode.
  const fetchAccount = useQuery(
    ['account', payload.id],
    (key, _id) => requestFetchAccount(_id),
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
    if (payload.action === 'new_child') {
      setFieldValue('parent_account_id', payload.parentAccountId);
      setFieldValue('account_type_id', payload.accountTypeId);
    }
  }, [payload, fetchAccount, fetchAccountsList, fetchAccountsTypes]);

  // Handle account type change.
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

  // Handle dialog on closed.
  const onDialogClosed = useCallback(() => {
    resetForm();
  }, [resetForm]);

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
            <AccountsTypesSelect
              accountsTypes={accountsTypes}
              selectedTypeId={values.account_type_id}
              defaultSelectText={<T id={'select_account_type'} />}
              onTypeSelected={onChangeAccountType}
              buttonProps={{ disabled: payload.action === 'edit' }}
              popoverProps={{ minimal: true }}
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
            labelInfo={<Hint content={<T id="account_code_hint" />} />}
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
              label={
                <>
                  <T id={'sub_account'} />
                  <Hint />
                </>
              }
              {...getFieldProps('subaccount')}
              checked={values.subaccount}
            />
          </FormGroup>

          <If condition={values.subaccount}>
            <FormGroup
              label={<T id={'parent_account'} />}
              className={classNames(
                'form-group--parent-account',
                'form-group--select-list',
                Classes.FILL,
              )}
              inline={true}
            >
              <AccountsSelectList
                accounts={filteredAccounts}
                onAccountSelected={onChangeSubaccount}
                defaultSelectText={<T id={'select_parent_account'} />}
                selectedAccountId={values.parent_account_id}
              />
            </FormGroup>
          </If>

          <FormGroup
            label={<T id={'description'} />}
            className={'form-group--description'}
            intent={errors.description && Intent.DANGER}
            helperText={errors.description && errors.credential}
            inline={true}
          >
            <TextArea
              growVertically={true}
              height={280}
              {...getFieldProps('description')}
            />
          </FormGroup>
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={handleClose} style={{ minWidth: '75px' }}>
              <T id={'close'} />
            </Button>
            <Button
              intent={Intent.PRIMARY}
              disabled={isSubmitting}
              style={{ minWidth: '75px' }}
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
