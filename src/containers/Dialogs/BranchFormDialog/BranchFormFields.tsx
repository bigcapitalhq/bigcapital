// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FastField, ErrorMessage, Field } from 'formik';
import {
  Classes,
  FormGroup,
  InputGroup,
  ControlGroup,
} from '@blueprintjs/core';
import { inputIntent } from '@/utils';
import { FieldRequiredHint, FormattedMessage as T } from '@/components';

/**
 * Branch form dialog fields.
 */
function BranchFormFields() {
  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Branch Name -----------*/}
      <FastField name={'name'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'branch.dialog.label.branch_name'} />}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            inline={true}
            helperText={<ErrorMessage name="branch_name" />}
            className={'form-group--branch_name'}
          >
            <InputGroup intent={inputIntent({ error, touched })} {...field} />
          </FormGroup>
        )}
      </FastField>
      {/*------------ Branch Code -----------*/}
      <FastField name={'code'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'branch.dialog.label.branch_code'} />}
            intent={inputIntent({ error, touched })}
            inline={true}
            helperText={<ErrorMessage name="code" />}
            className={'form-group--branch_name'}
          >
            <InputGroup intent={inputIntent({ error, touched })} {...field} />
          </FormGroup>
        )}
      </FastField>

      {/*------------ Branch Address  -----------*/}
      <FastField name={'address'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={intl.get('branch.dialog.label.branch_address')}
            intent={inputIntent({ error, touched })}
            inline={true}
            helperText={<ErrorMessage name="address" />}
            className={'form-group--branch_address'}
          >
            <InputGroup
              intent={inputIntent({ error, touched })}
              placeholder={intl.get('branch.dialog.label.address_1')}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
      <BranchAddressWrap>
        {/*------------ Branch Address City & Country-----------*/}
        <FormGroup
          inline={true}
          className={'form-group--branch_address'}
          helperText={<ErrorMessage name="branch_address_2" />}
        >
          <ControlGroup>
            <FastField name={'city'}>
              {({ field, meta: { error, touched } }) => (
                <InputGroup
                  intent={inputIntent({ error, touched })}
                  placeholder={intl.get('branch.dialog.label.city')}
                  {...field}
                />
              )}
            </FastField>

            <FastField name={'country'}>
              {({ field, meta: { error, touched } }) => (
                <InputGroup
                  intent={inputIntent({ error, touched })}
                  placeholder={intl.get('branch.dialog.label.country')}
                  {...field}
                />
              )}
            </FastField>
          </ControlGroup>
        </FormGroup>
      </BranchAddressWrap>

      {/*------------ Phone Number -----------*/}
      <FastField name={'phone_number'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={intl.get('branch.dialog.label.phone_number')}
            intent={inputIntent({ error, touched })}
            inline={true}
            helperText={<ErrorMessage name="phone_number" />}
            className={'form-group--phone_number'}
          >
            <InputGroup placeholder={'https://'} {...field} />
          </FormGroup>
        )}
      </FastField>

      {/*------------ Email -----------*/}
      <FastField name={'email'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={intl.get('branch.dialog.label.email')}
            intent={inputIntent({ error, touched })}
            inline={true}
            helperText={<ErrorMessage name="email" />}
            className={'form-group--email'}
          >
            <InputGroup intent={inputIntent({ error, touched })} {...field} />
          </FormGroup>
        )}
      </FastField>

      {/*------------ Website -----------*/}
      <FastField name={'website'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={intl.get('branch.dialog.label.website')}
            intent={inputIntent({ error, touched })}
            inline={true}
            helperText={<ErrorMessage name="email" />}
            className={'form-group--website'}
          >
            <InputGroup intent={inputIntent({ error, touched })} {...field} />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}

export default BranchFormFields;

const BranchAddressWrap = styled.div`
  margin-left: 160px;
`;
