// @ts-nocheck
import React from 'react';
import { Form, useFormikContext } from 'formik';
import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  AccountsSelect,
  FieldRequiredHint,
  FormattedMessage as T,
  FFormGroup,
  CardFooterActions,
} from '@/components';
import { ACCOUNT_PARENT_TYPE, ACCOUNT_TYPE } from '@/constants/accountTypes';

import { useItemPreferencesFormContext } from './ItemPreferencesFormProvider';

/**
 * Item preferences form.
 */
export default function ItemForm() {
  const history = useHistory();
  const { accounts } = useItemPreferencesFormContext();

  const { isSubmitting } = useFormikContext();

  const handleCloseClick = () => {
    history.go(-1);
  };

  return (
    <Form>
      {/* ----------- Preferred Sell Account ----------- */}
      <ItemFormGroup
        name={'preferred_sell_account'}
        label={
          <strong>
            <T id={'preferred_sell_account'} />
          </strong>
        }
        helperText={
          <T
            id={
              'select_a_preferred_account_to_deposit_into_it_after_customer_make_payment'
            }
          />
        }
        labelInfo={<FieldRequiredHint />}
        fastField={true}
      >
        <AccountsSelect
          name={'preferred_sell_account'}
          items={accounts}
          placeholder={<T id={'select_payment_account'} />}
          filterByParentTypes={[ACCOUNT_PARENT_TYPE.INCOME]}
        />
      </ItemFormGroup>

      {/* ----------- Preferred Cost Account ----------- */}
      <ItemFormGroup
        name={'preferred_cost_account'}
        label={
          <strong>
            <T id={'preferred_cost_account'} />
          </strong>
        }
        helperText={
          <T
            id={
              'select_a_preferred_account_to_deposit_into_it_after_customer_make_payment'
            }
          />
        }
        labelInfo={<FieldRequiredHint />}
        fastField={true}
      >
        <AccountsSelect
          name={'preferred_cost_account'}
          items={accounts}
          placeholder={<T id={'select_payment_account'} />}
          filterByParentTypes={[ACCOUNT_PARENT_TYPE.EXPENSE]}
        />
      </ItemFormGroup>

      {/* ----------- Preferred Inventory Account ----------- */}
      <ItemFormGroup
        name={'preferred_inventory_account'}
        label={
          <strong>
            <T id={'preferred_inventory_account'} />
          </strong>
        }
        helperText={
          <T
            id={
              'select_a_preferred_account_to_deposit_into_it_vendor_advanced_deposits'
            }
          />
        }
        labelInfo={<FieldRequiredHint />}
        fastField={true}
      >
        <AccountsSelect
          name={'preferred_inventory_account'}
          items={accounts}
          placeholder={<T id={'select_payment_account'} />}
          filterByTypes={[ACCOUNT_TYPE.INVENTORY]}
        />
      </ItemFormGroup>

      <CardFooterActions>
        <Button intent={Intent.PRIMARY} loading={isSubmitting} type="submit">
          <T id={'save'} />
        </Button>
        <Button onClick={handleCloseClick} disabled={isSubmitting}>
          <T id={'close'} />
        </Button>
      </CardFooterActions>
    </Form>
  );
}

const ItemFormGroup = styled(FFormGroup)`
  max-width: 400px;
`;
