// @ts-nocheck
import React from 'react';
import { FormGroup, InputGroup, TextArea } from '@blueprintjs/core';
import { Row, Col } from '@/components';
import { FormattedMessage as T } from '@/components';
import { FastField, ErrorMessage } from 'formik';
import { inputIntent } from '@/utils';

const CustomerBillingAddress = ({}) => {
  return (
    <div className={'tab-panel--address'}>
      <Row>
        <Col xs={6}>
          <h4>
            <T id={'billing_address'} />
          </h4>
          {/*------------ Billing Address country -----------*/}
          <FastField name={'billing_address_country'}>
            {({ field, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                className={'form-group--journal-number'}
                intent={inputIntent({ error, touched })}
                inline={true}
                helperText={<ErrorMessage name="billing_address_country" />}
                label={<T id={'country'} />}
              >
                <InputGroup {...field} />
              </FormGroup>
            )}
          </FastField>

          {/*------------ Billing Address 1  -----------*/}
          <FastField name={'billing_address_1'}>
            {({ field, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'address_line_1'} />}
                className={'form-group--address_line_1'}
                intent={inputIntent({ error, touched })}
                inline={true}
                helperText={<ErrorMessage name="billing_address_1" />}
              >
                <TextArea {...field} />
              </FormGroup>
            )}
          </FastField>

          {/*------------ Billing Address 2  -----------*/}
          <FastField name={'billing_address_2'}>
            {({ field, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'address_line_2'} />}
                className={'form-group--journal-number'}
                intent={inputIntent({ error, touched })}
                inline={true}
                helperText={<ErrorMessage name="billing_address_2" />}
              >
                <TextArea {...field} />
              </FormGroup>
            )}
          </FastField>
          {/*------------ Billing Address city  -----------*/}
          <FastField name={'billing_address_city'}>
            {({ field, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'city_town'} />}
                className={'form-group--journal-number'}
                intent={inputIntent({ error, touched })}
                inline={true}
                helperText={<ErrorMessage name="billing_address_city" />}
              >
                <InputGroup {...field} />
              </FormGroup>
            )}
          </FastField>

          {/*------------ Billing Address state  -----------*/}
          <FastField name={'billing_address_state'}>
            {({ field, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'state'} />}
                className={'form-group--journal-number'}
                intent={inputIntent({ error, touched })}
                inline={true}
                helperText={<ErrorMessage name="billing_address_state" />}
              >
                <InputGroup {...field} />
              </FormGroup>
            )}
          </FastField>
          {/*------------ Billing Address postcode  -----------*/}
          <FastField name={'billing_address_postcode'}>
            {({ field, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'zip_code'} />}
                intent={inputIntent({ error, touched })}
                inline={true}
                helperText={<ErrorMessage name="billing_address_postcode" />}
              >
                <InputGroup {...field} />
              </FormGroup>
            )}
          </FastField>

          {/*------------ Billing Address phone  -----------*/}
          <FastField name={'billing_address_phone'}>
            {({ field, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'phone'} />}
                intent={inputIntent({ error, touched })}
                inline={true}
                helperText={<ErrorMessage name="billing_address_phone" />}
              >
                <InputGroup {...field} />
              </FormGroup>
            )}
          </FastField>
        </Col>

        <Col xs={6}>
          <h4>
            <T id={'shipping_address'} />
          </h4>
          {/*------------ Shipping Address country -----------*/}
          <FastField name={'shipping_address_country'}>
            {({ field, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'country'} />}
                className={'form-group--journal-number'}
                intent={inputIntent({ error, touched })}
                inline={true}
                helperText={<ErrorMessage name="shipping_address_country" />}
              >
                <InputGroup {...field} />
              </FormGroup>
            )}
          </FastField>

          {/*------------ Shipping Address 1  -----------*/}
          <FastField name={'shipping_address_1'}>
            {({ field, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'address_line_1'} />}
                className={'form-group--journal-number'}
                intent={inputIntent({ error, touched })}
                inline={true}
                helperText={<ErrorMessage name="shipping_address_1" />}
              >
                <TextArea {...field} />
              </FormGroup>
            )}
          </FastField>

          {/*------------ Shipping Address 2  -----------*/}
          <FastField name={'shipping_address_2'}>
            {({ field, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'address_line_2'} />}
                className={'form-group--journal-number'}
                intent={inputIntent({ error, touched })}
                inline={true}
                helperText={<ErrorMessage name="shipping_address_2" />}
              >
                <TextArea {...field} />
              </FormGroup>
            )}
          </FastField>

          {/*------------ Shipping Address city  -----------*/}
          <FastField name={'shipping_address_city'}>
            {({ field, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'city_town'} />}
                className={'form-group--journal-number'}
                intent={inputIntent({ error, touched })}
                inline={true}
                helperText={<ErrorMessage name="shipping_address_city" />}
              >
                <InputGroup {...field} />
              </FormGroup>
            )}
          </FastField>

          {/*------------ Shipping Address state  -----------*/}
          <FastField name={'shipping_address_state'}>
            {({ field, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'state'} />}
                className={'form-group--journal-number'}
                intent={inputIntent({ error, touched })}
                inline={true}
                helperText={<ErrorMessage name="shipping_address_state" />}
              >
                <InputGroup {...field} />
              </FormGroup>
            )}
          </FastField>

          {/*------------ Shipping Address postcode  -----------*/}
          <FastField name={'shipping_address_postcode'}>
            {({ field, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'zip_code'} />}
                intent={inputIntent({ error, touched })}
                inline={true}
                helperText={<ErrorMessage name="shipping_address_postcode" />}
              >
                <InputGroup {...field} />
              </FormGroup>
            )}
          </FastField>

          {/*------------ Shipping Address phone  -----------*/}
          <FastField name={'shipping_address_phone'}>
            {({ field, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'phone'} />}
                intent={inputIntent({ error, touched })}
                inline={true}
                helperText={<ErrorMessage name="shipping_address_phone" />}
              >
                <InputGroup {...field} />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
    </div>
  );
};

export default CustomerBillingAddress;
