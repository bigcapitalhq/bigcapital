import { Button, Divider, Intent } from '@blueprintjs/core';
import { Form, useFormikContext } from 'formik';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useItemPreferencesFormContext } from './ItemPreferencesFormProvider';
import {
  AccountsSelect,
  CardFooterActions,
  FieldRequiredHint,
  FFormGroup,
  FSelect,
  FSwitch,
  FormattedMessage as T,
} from '@/components';
import { ACCOUNT_PARENT_TYPE, ACCOUNT_TYPE } from '@/constants/accountTypes';

export interface ItemPreferencesFormValues {
  preferredSellAccount: string | number;
  preferredCostAccount: string | number;
  preferredInventoryAccount: string | number;
  skuEnabled: boolean;
  skuRequired: boolean;
  reorderPointNotifications: boolean;
  reorderPointNotificationEmail: string;
  preventStockFromGoingBelowZero: boolean;
}

export function ItemForm(): React.ReactElement {
  const history = useHistory();
  const { accounts, users } = useItemPreferencesFormContext();

  const { isSubmitting, values, setFieldValue } =
    useFormikContext<ItemPreferencesFormValues>();

  // The requirement only applies when SKU itself is enabled.
  useEffect(() => {
    if (!values.skuEnabled && values.skuRequired) {
      setFieldValue('skuRequired', false);
    }
  }, [values.skuEnabled, values.skuRequired, setFieldValue]);

  const userOptions = users
    .filter((user) => user.active && user.email)
    .map((user) => ({
      value: user.email,
      label: `${[user.firstName, user.lastName]
        .filter(Boolean)
        .join(' ')} (${user.email})`,
    }));

  if (
    values.reorderPointNotificationEmail &&
    !userOptions.some(
      (option) => option.value === values.reorderPointNotificationEmail,
    )
  ) {
    userOptions.push({
      value: values.reorderPointNotificationEmail,
      label: values.reorderPointNotificationEmail,
    });
  }

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

      {/* ----------- Enable SKU ----------- */}
      <ItemFormGroup
        name={'skuEnabled'}
        helperText={<T id={'enable_item_sku_hint'} />}
        inline={true}
      >
        <FSwitch
          name={'skuEnabled'}
          labelElement={<T id={'enable_item_sku'} />}
          large={true}
        />
      </ItemFormGroup>

      {/* ----------- Require SKU ----------- */}
      <ItemFormGroup
        name={'skuRequired'}
        helperText={<T id={'require_item_sku_hint'} />}
        inline={true}
      >
        <FSwitch
          name={'skuRequired'}
          labelElement={<T id={'require_item_sku'} />}
          disabled={!values.skuEnabled}
        />
      </ItemFormGroup>

      {/* ----------- Reorder point notifications ----------- */}
      <ItemFormGroup
        name={'reorderPointNotifications'}
        helperText={<T id={'reorder_point_notifications_hint'} />}
        inline={true}
      >
        <FSwitch
          name={'reorderPointNotifications'}
          labelElement={<T id={'reorder_point_notifications'} />}
          large={true}
        />
      </ItemFormGroup>

      {/* ----------- Prevent stock from going below zero ----------- */}
      <ItemFormGroup
        name={'preventStockFromGoingBelowZero'}
        helperText={<T id={'prevent_stock_from_going_below_zero_hint'} />}
        inline={true}
      >
        <FSwitch
          name={'preventStockFromGoingBelowZero'}
          labelElement={<T id={'prevent_stock_from_going_below_zero'} />}
        />
      </ItemFormGroup>

      {/* ----------- Notify to ----------- */}
      <ItemFormGroup
        name={'reorderPointNotificationEmail'}
        label={
          <strong>
            <T id={'reorder_point_notification_email'} />
          </strong>
        }
        helperText={<T id={'reorder_point_notification_email_hint'} />}
        inline={true}
      >
        <FSelect
          name={'reorderPointNotificationEmail'}
          items={userOptions}
          valueAccessor={'value'}
          textAccessor={'label'}
          placeholder={<T id={'select_user'} />}
          disabled={!values.reorderPointNotifications}
          popoverProps={{ minimal: true, captureDismiss: true }}
          fill={true}
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
