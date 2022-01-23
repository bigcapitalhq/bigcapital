import React from 'react';

import intl from 'react-intl-universal';
import { FastField, ErrorMessage, Field } from 'formik';
import styled from 'styled-components';
import {
  Classes,
  FormGroup,
  InputGroup,
  ControlGroup,
  Position,
} from '@blueprintjs/core';
import { inputIntent } from 'utils';
import { FieldRequiredHint, Col, Row, FormattedMessage as T } from 'components';
import { useWarehouseFormContext } from './WarehouseFormProvider';

/**
 * Warehouse form fields.
 * @returns
 */
export default function WarehouseFormFields() {
  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Warehouse Name -----------*/}
      <FastField name={'warehouse_name'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'warehouse.dialog.label.warehouse_name'} />}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            inline={true}
            helperText={<ErrorMessage name="warehouse_name" />}
            className={'form-group--warehouse_name'}
          >
            <InputGroup intent={inputIntent({ error, touched })} {...field} />
          </FormGroup>
        )}
      </FastField>
      {/*------------ Warehouse Address -----------*/}
      <FastField name={'warehouse_address_1'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={intl.get('warehouse.dialog.label.warehouse_address')}
            intent={inputIntent({ error, touched })}
            inline={true}
            helperText={<ErrorMessage name="warehouse_address_1" />}
            className={'form-group--warehouse_address_1'}
          >
            <InputGroup
              intent={inputIntent({ error, touched })}
              placeholder={intl.get(
                'warehouse.dialog.label.warehouse_address_1',
              )}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
      <WarehouseAddressWrap>
        <FastField name={'warehouse_address_2'}>
          {({ form, field, meta: { error, touched } }) => (
            <FormGroup
              intent={inputIntent({ error, touched })}
              inline={true}
              helperText={<ErrorMessage name="warehouse_address_2" />}
              className={'form-group--warehouse_address_2'}
            >
              <InputGroup
                intent={inputIntent({ error, touched })}
                placeholder={intl.get(
                  'warehouse.dialog.label.warehouse_address_2',
                )}
                {...field}
              />
            </FormGroup>
          )}
        </FastField>
        {/*------------ Warehouse Address City & Country-----------*/}
        <FormGroup
          inline={true}
          className={'form-group--warehouse_address_city'}
          helperText={<ErrorMessage name="warehouse_address_city" />}
        >
          <ControlGroup>
            <FastField name={'warehouse_address_city'}>
              {({ field, meta: { error, touched } }) => (
                <InputGroup
                  intent={inputIntent({ error, touched })}
                  placeholder={intl.get('warehouse.dialog.label.city')}
                  {...field}
                />
              )}
            </FastField>
            <FastField name={'warehouse_address_country'}>
              {({ field, meta: { error, touched } }) => (
                <InputGroup
                  intent={inputIntent({ error, touched })}
                  placeholder={intl.get('warehouse.dialog.label.country')}
                  {...field}
                />
              )}
            </FastField>
          </ControlGroup>
        </FormGroup>
      </WarehouseAddressWrap>
      {/*------------ Phone Number -----------*/}
      <FastField name={'phone_number'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={intl.get('warehouse.dialog.label.phone_number')}
            intent={inputIntent({ error, touched })}
            inline={true}
            helperText={<ErrorMessage name="phone_number" />}
            className={'form-group--phone_number'}
          >
            <InputGroup intent={inputIntent({ error, touched })} {...field} />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}

const WarehouseAddressWrap = styled.div`
  padding-left: 150px;
`;
