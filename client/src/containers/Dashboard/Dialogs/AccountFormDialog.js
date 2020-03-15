import React, { useState} from 'react';
import { 
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
  TextArea,
  MenuItem,
  Checkbox,
} from "@blueprintjs/core";
import {Select} from '@blueprintjs/select';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import { omit } from 'lodash';
import { compose } from 'utils';
import useAsync from 'hooks/async';
import Dialog from 'components/Dialog';
import AppToaster from 'components/AppToaster';
import DialogConnect from 'connectors/Dialog.connector';
import DialogReduxConnect from 'components/DialogReduxConnect';
import AccountFormDialogConnect from 'connectors/AccountFormDialog.connector';

function AccountFormDialog ({
  name,
  payload,
  isOpen,
  accountsTypes,
  accounts,
  fetchAccounts,
  fetchAccountTypes,
  closeDialog,
  submitAccount,
  fetchAccount,
  editAccount
}) {
  const intl = useIntl();
  const accountFormValidationSchema = Yup.object().shape({
    name: Yup
      .string()
      .required(intl.formatMessage({ 'id': 'required' })),
    code: Yup
      .number(intl.formatMessage({ id: 'field_name_must_be_number' })),
    account_type_id: Yup
      .string()
      .nullable()
      .required(intl.formatMessage({ 'id': 'required' })),
    description: Yup.string().trim(),
  });

  // Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...payload.action === 'edit' && editAccount,
    },
    validationSchema: accountFormValidationSchema,
    onSubmit: (values) => {
      const exclude = ['subaccount'];

      if (payload.action === 'edit') {
        editAccount({
          payload: payload.id,
          form: { ...omit(values, exclude) }
        }).then((response) => {
          closeDialog(name);
          AppToaster.show({
            message: 'the_account_has_been_edited',
          });
        });
      } else {
        submitAccount({ form: { ...omit(values, exclude) } }).then(response => {
          closeDialog(name);
          AppToaster.show({
            message: 'the_account_has_been_submit',
          });
        });
      }
    },
  });
  const [state, setState] = useState({
    loading: true,
    dialogActive: true,
    selectedAccountType: null,
    selectedSubaccount: null,
  });
  
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
    return (<MenuItem text={item.name} key={item.id} onClick={handleClick} />);
  };

  // Account item of select accounts field.
  const accountItem = (item, { handleClick, modifiers, query }) => {
    return (<MenuItem text={item.name} label={item.code} key={item.id} onClick={handleClick} />)
  };

  // Filters accounts items.
  const filterAccountsPredicater = (query, account, _index, exactMatch) => {
    const normalizedTitle = account.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return `${account.code} ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
    }
  };

  const handleClose = () => { closeDialog(name); };

  const fetchHook = useAsync(async () => {
    await Promise.all([
      fetchAccounts(),
      fetchAccountTypes(),

      // Fetch the target in case edit mode.
      ...(payload.action === 'edit') ? [
        fetchAccount(payload.id),
      ] : [],
    ]);
  }, false);

  const onDialogOpening = async () => { fetchHook.execute(); }
  
  const onChangeAccountType = (accountType) => {
    setState({ ...state, selectedAccountType: accountType.name });
    formik.setFieldValue('account_type_id', accountType.id);
  };
  const onChangeSubaccount = (account) => {
    setState({ ...state, selectedSubaccount: account });
    formik.setFieldValue('parent_account_id', account.id);
  };

  const onDialogClosed = () => {
    formik.resetForm();
    setState({
      ...state,
      selectedSubaccount: null,
      selectedAccountType: null,
    });
  };
  return (
    <Dialog
      name={name}
      title={payload.action === 'edit' ? 'Edit Account' : 'New Account'}
      className={{'dialog--loading': state.isLoading, 'dialog--account-form': true }}
      onClosed={onDialogClosed}
      onOpening={onDialogOpening}
      isOpen={isOpen}
      isLoading={fetchHook.pending}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup
            label={'Account Type'}
            className="{'form-group--account-type'}"
            inline={true}
            helperText={formik.errors.account_type_id && formik.errors.account_type_id}
            intent={formik.errors.account_type_id && Intent.DANGER}>
              
            <Select
              items={accountsTypes}
              noResults={<MenuItem disabled={true} text="No results." />}
              itemRenderer={accountTypeItem}
              itemPredicate={filterAccountTypeItems}
              popoverProps={{ minimal: true }}
              onItemSelect={onChangeAccountType}>
              <Button
                rightIcon="caret-down"
                text={state.selectedAccountType || 'Select account type'} />
            </Select>
          </FormGroup>

          <FormGroup
            label={'Account Name'}
            className={'form-group--account-name'}
            intent={formik.errors.name && Intent.DANGER}
            helperText={formik.errors.name && formik.errors.name}
            inline={true}>

            <InputGroup
              medium={true}
              intent={formik.errors.name && Intent.DANGER}
              {...formik.getFieldProps('name')} />
          </FormGroup>

          <FormGroup
            label={'Account Code'}
            className={'form-group--account-code'}
            intent={formik.errors.code && Intent.DANGER}
            helperText={formik.errors.code && formik.errors.code}
            inline={true}>

            <InputGroup
              medium={true}
              intent={formik.errors.code && Intent.DANGER}
              {...formik.getFieldProps('code')} />
          </FormGroup>

          <FormGroup
            label={' '}
            className={'form-group--subaccount'}
            inline={true}>

            <Checkbox
              inline={true}
              label={'Sub account?'} 
              {...formik.getFieldProps('subaccount')} />
          </FormGroup>

          { (formik.values.subaccount) &&
            <FormGroup
              label={'Sub Account'}
              className="{'form-group--sub-account'}"
              inline={true}>
              <Select
                items={accounts}
                noResults={<MenuItem disabled={true} text="No results." />}
                itemRenderer={accountItem}
                itemPredicate={filterAccountsPredicater}
                popoverProps={{ minimal: true }}
                onItemSelect={onChangeSubaccount}
                {...formik.getFieldProps('parent_account_id')}>
                <Button
                  rightIcon="caret-down"
                  text={state.selectedSubaccount ? state.selectedSubaccount.name : "Select Parent Account"}
                />
              </Select>
            </FormGroup> }

          <FormGroup
            label={'Description'}
            className={'form-group--description'}
            intent={formik.errors.description && Intent.DANGER}
            helperText={formik.errors.description && formik.errors.credential}
            inline={true}>

            <TextArea growVertically={true} large={true} {...formik.getFieldProps('description')} />
          </FormGroup>
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={handleClose}>Close</Button>
            <Button intent={Intent.PRIMARY} type="submit">
              { payload.action === 'edit' ? 'Edit' : 'Submit' }
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}

export default compose(
  AccountFormDialogConnect,
  DialogReduxConnect,
  DialogConnect,
)(AccountFormDialog);