import { Classes, ControlGroup } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FieldRequiredHint, FFormGroup, FInputGroup } from '@/components';

export function WarehouseFormFields(): React.ReactElement {
  return (
    <div className={Classes.DIALOG_BODY}>
      <FFormGroup
        name={'name'}
        label={intl.get('warehouse.dialog.label.warehouse_name')}
        labelInfo={<FieldRequiredHint />}
        inline={true}
        className={'form-group--warehouse_name'}
      >
        <FInputGroup name={'name'} />
      </FFormGroup>

      <FFormGroup
        name={'code'}
        label={intl.get('warehouse.dialog.label.code')}
        inline={true}
        className={'form-group--warehouse_name'}
      >
        <FInputGroup name={'code'} />
      </FFormGroup>

      <FFormGroup
        name={'address'}
        label={intl.get('warehouse.dialog.label.warehouse_address')}
        inline={true}
        className={'form-group--warehouse_address_1'}
      >
        <FInputGroup
          name={'address'}
          placeholder={intl.get('warehouse.dialog.label.warehouse_address_1')}
        />
      </FFormGroup>
      <WarehouseAddressWrap>
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

      <FFormGroup
        name={'phoneNumber'}
        label={intl.get('warehouse.dialog.label.phone_number')}
        inline={true}
        className={'form-group--phone_number'}
      >
        <FInputGroup name={'phoneNumber'} />
      </FFormGroup>

      <FFormGroup
        name={'email'}
        label={intl.get('warehouse.dialog.label.email')}
        inline={true}
        className={'form-group--warehouse_name'}
      >
        <FInputGroup name={'email'} />
      </FFormGroup>

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
