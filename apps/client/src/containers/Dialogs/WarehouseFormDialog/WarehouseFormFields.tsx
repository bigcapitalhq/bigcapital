// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FastField, ErrorMessage } from 'formik';
import {
  Classes,
  FormGroup,
  InputGroup,
  ControlGroup,
} from '@blueprintjs/core';
import { inputIntent } from '@/utils';

import { FieldRequiredHint, FormattedMessage as T } from '@/components';

/**
 * Warehouse form fields.
 * @returns
 */
export default function WarehouseFormFields() {
  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Warehouse Name -----------*/}
      <FastField name={'name'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'warehouse.dialog.label.warehouse_name'} />}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            inline={true}
            helperText={<ErrorMessage name="name" />}
            className={'form-group--warehouse_name'}
          >
            <InputGroup intent={inputIntent({ error, touched })} {...field} />
          </FormGroup>
        )}
      </FastField>

      {/*------------ Warehouse Code -----------*/}
      <FastField name={'code'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'warehouse.dialog.label.code'} />}
            intent={inputIntent({ error, touched })}
            inline={true}
            helperText={<ErrorMessage name="code" />}
            className={'form-group--warehouse_name'}
          >
            <InputGroup intent={inputIntent({ error, touched })} {...field} />
          </FormGroup>
        )}
      </FastField>

      {/*------------ Warehouse Address -----------*/}
      <FastField name={'address'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={intl.get('warehouse.dialog.label.warehouse_address')}
            intent={inputIntent({ error, touched })}
            inline={true}
            helperText={<ErrorMessage name="address" />}
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
        {/*------------ Warehouse Address City & Country-----------*/}
        <FormGroup
          inline={true}
          className={'form-group--warehouse_address_city'}
          helperText={<ErrorMessage name="warehouse_address_city" />}
        >
          <ControlGroup>
            <FastField name={'city'}>
              {({ field, meta: { error, touched } }) => (
                <InputGroup
                  intent={inputIntent({ error, touched })}
                  placeholder={intl.get('warehouse.dialog.label.city')}
                  {...field}
                />
              )}
            </FastField>
            <FastField name={'country'}>
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

      {/*------------ Email -----------*/}
      <FastField name={'email'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={intl.get('warehouse.dialog.label.email')}
            intent={inputIntent({ error, touched })}
            inline={true}
            helperText={<ErrorMessage name="email" />}
            className={'form-group--warehouse_name'}
          >
            <InputGroup intent={inputIntent({ error, touched })} {...field} />
          </FormGroup>
        )}
      </FastField>

      {/*------------ Website -----------*/}
      <FastField name={'website'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={intl.get('warehouse.dialog.label.website')}
            intent={inputIntent({ error, touched })}
            inline={true}
            helperText={<ErrorMessage name="email" />}
            className={'form-group--warehouse_name'}
          >
            <InputGroup placeholder={'https://'} {...field} />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}

const WarehouseAddressWrap = styled.div`
  padding-left: 150px;
`;
