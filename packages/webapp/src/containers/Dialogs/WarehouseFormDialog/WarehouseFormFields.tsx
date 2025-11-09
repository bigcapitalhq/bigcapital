// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Classes, ControlGroup } from '@blueprintjs/core';

import {
  FieldRequiredHint,
  FormattedMessage as T,
  FFormGroup,
  FInputGroup,
} from '@/components';

/**
 * Warehouse form fields.
 * @returns
 */
export default function WarehouseFormFields() {
  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Warehouse Name -----------*/}
      <FFormGroup
        name={'name'}
        label={<T id={'warehouse.dialog.label.warehouse_name'} />}
        labelInfo={<FieldRequiredHint />}
        inline={true}
        className={'form-group--warehouse_name'}
      >
        <FInputGroup name={'name'} />
      </FFormGroup>

      {/*------------ Warehouse Code -----------*/}
      <FFormGroup
        name={'code'}
        label={<T id={'warehouse.dialog.label.code'} />}
        inline={true}
        className={'form-group--warehouse_name'}
      >
        <FInputGroup name={'code'} />
      </FFormGroup>

      {/*------------ Warehouse Address -----------*/}
      <FFormGroup
        name={'address'}
        label={intl.get('warehouse.dialog.label.warehouse_address')}
        inline={true}
        className={'form-group--warehouse_address_1'}
      >
        <FInputGroup
          name={'address'}
          placeholder={intl.get(
            'warehouse.dialog.label.warehouse_address_1',
          )}
        />
      </FFormGroup>
      <WarehouseAddressWrap>
        {/*------------ Warehouse Address City & Country-----------*/}
        <FFormGroup
          name={'city'}
          inline={true}
          className={'form-group--warehouse_address_city'}
        >
          <ControlGroup>
            <FInputGroup
              name={'city'}
              placeholder={intl.get('warehouse.dialog.label.city')}
            />
            <FInputGroup
              name={'country'}
              placeholder={intl.get('warehouse.dialog.label.country')}
            />
          </ControlGroup>
        </FFormGroup>
      </WarehouseAddressWrap>

      {/*------------ Phone Number -----------*/}
      <FFormGroup
        name={'phone_number'}
        label={intl.get('warehouse.dialog.label.phone_number')}
        inline={true}
        className={'form-group--phone_number'}
      >
        <FInputGroup name={'phone_number'} />
      </FFormGroup>

      {/*------------ Email -----------*/}
      <FFormGroup
        name={'email'}
        label={intl.get('warehouse.dialog.label.email')}
        inline={true}
        className={'form-group--warehouse_name'}
      >
        <FInputGroup name={'email'} />
      </FFormGroup>

      {/*------------ Website -----------*/}
      <FFormGroup
        name={'website'}
        label={intl.get('warehouse.dialog.label.website')}
        inline={true}
        className={'form-group--warehouse_name'}
      >
        <FInputGroup name={'website'} placeholder={'https://'} />
      </FFormGroup>
    </div>
  );
}

const WarehouseAddressWrap = styled.div`
  padding-left: 150px;
`;
