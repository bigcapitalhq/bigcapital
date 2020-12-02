import React from 'react';
import { Form } from 'formik';
import {
  FormGroup,
  RadioGroup,
  Radio,
  Checkbox,
  Button,
  Intent,
} from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { AccountsSelectList } from 'components';
import {
  FieldRequiredHint,
} from 'components';
import { FormattedMessage as T } from 'react-intl';
import { compose } from 'utils';
import withAccounts from 'containers/Accounts/withAccounts';

function AccountantForm({
  // #withAccounts
  accountsList,
}) {
  const history = useHistory();
  const handleCloseClick = () => {
    history.go(-1);
  };

  return (
    <Form>
      <FormGroup label={<strong>Accounts</strong>}>
        <Checkbox
          label={'Make account code required when create a new accounts.'}
        />
        <Checkbox
          label={'Should account code be unique when create a new account.'}
        />
      </FormGroup>

      <FormGroup
        labelInfo={<FieldRequiredHint />}
        label={<strong>Accounting Basis</strong>}>
        <RadioGroup inline={true}>
          <Radio label="Cash" value="cash" />
          <Radio label="Accural" value="accural" />
        </RadioGroup>
      </FormGroup>

      <FormGroup
        label={<strong>Deposit customer account</strong>}
        helperText={
          'Select a preferred account to deposit into it after customer make payment.'
        }
        labelInfo={<FieldRequiredHint />}
      >
        <AccountsSelectList
          accounts={accountsList}
          defaultSelectText={<T id={'select_payment_account'} />}
          filterByTypes={['current_asset']}
        />
      </FormGroup>

      <FormGroup
        label={<strong>Withdrawal customer account</strong>}
        helperText={
          'Select a preferred account to deposit into it after customer make payment.'
        }
        labelInfo={<FieldRequiredHint />}
      >
        <AccountsSelectList
          accounts={accountsList}
          defaultSelectText={<T id={'select_payment_account'} />}
          filterByTypes={['current_asset']}
        />
      </FormGroup>

      <FormGroup
        label={<strong>Vendor advance deposit</strong>}
        helperText={
          'Select a preferred account to deposit into it vendor advanced deposits.'
        }
        labelInfo={<FieldRequiredHint />}
      >
        <AccountsSelectList
          accounts={accountsList}
          defaultSelectText={<T id={'select_payment_account'} />}
          filterByTypes={['current_asset', 'other_current_asset']}
        />
      </FormGroup>

      <div className={'card__footer'}>
        <Button intent={Intent.PRIMARY} type="submit">
          <T id={'save'} />
        </Button>
        <Button onClick={handleCloseClick}>
          <T id={'close'} />
        </Button>
      </div>
    </Form>
  );
}

export default compose(
  withAccounts(({ accountsList }) => ({ accountsList })),
)(AccountantForm);
