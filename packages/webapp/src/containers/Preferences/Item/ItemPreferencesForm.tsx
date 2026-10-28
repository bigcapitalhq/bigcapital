import { Button, Divider, Intent } from '@blueprintjs/core';
import { Form, useFormikContext } from 'formik';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useItemPreferencesFormContext } from './ItemPreferencesFormProvider';
import {
  AccountsSelect,
  CardFooterActions,
  FieldRequiredHint,
  FFormGroup,
  FSwitch,
  FormattedMessage as T,
} from '@/components';
import { ACCOUNT_PARENT_TYPE, ACCOUNT_TYPE } from '@/constants/accountTypes';

export interface ItemPreferencesFormValues {
  preferredSellAccount: string | number;
  preferredCostAccount: string | number;
  preferredInventoryAccount: string | number;
  preventStockFromGoingBelowZero: boolean;
}

export function ItemForm(): React.ReactElement {
  const history = useHistory();
  const { accounts } = useItemPreferencesFormContext();

  const { isSubmitting } = useFormikContext<ItemPreferencesFormValues>();

  const handleCloseClick = () => {
    history.go(-1);
  };

  return (
    <Form>
      <ItemFormGroup
        name={'preferredSellAccount'}
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
          name={'preferredSellAccount'}
          items={accounts}
          placeholder={<T id={'select_payment_account'} />}
          filterByParentTypes={[ACCOUNT_PARENT_TYPE.INCOME]}
        />
      </ItemFormGroup>

      <ItemFormGroup
        name={'preferredCostAccount'}
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
          name={'preferredCostAccount'}
          items={accounts}
          placeholder={<T id={'select_payment_account'} />}
          filterByParentTypes={[ACCOUNT_PARENT_TYPE.EXPENSE]}
        />
      </ItemFormGroup>

      <ItemFormGroup
        name={'preferredInventoryAccount'}
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
          name={'preferredInventoryAccount'}
          items={accounts}
          placeholder={<T id={'select_payment_account'} />}
          filterByTypes={[ACCOUNT_TYPE.INVENTORY]}
        />
      </ItemFormGroup>

      <Divider style={{ margin: '20px 0' }} />

      {/* ----------- Prevent stock from going below zero ----------- */}
      <ItemFormGroup
        name={'preventStockFromGoingBelowZero'}
        helperText={<T id={'prevent_stock_from_going_below_zero_hint'} />}
        inline={true}
      >
        <FSwitch
          name={'preventStockFromGoingBelowZero'}
          labelElement={<T id={'prevent_stock_from_going_below_zero'} />}
          large={true}
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
