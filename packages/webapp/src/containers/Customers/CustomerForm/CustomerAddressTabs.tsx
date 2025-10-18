// @ts-nocheck
import React from 'react';
import { Row, Col } from '@/components';
import {
  FormattedMessage as T,
  FFormGroup,
  FInputGroup,
  FTextArea,
} from '@/components';

const CustomerBillingAddress = ({}) => {
  return (
    <div className={'tab-panel--address'}>
      <Row>
        <Col xs={6}>
          <h4>
            <T id={'billing_address'} />
          </h4>
          {/*------------ Billing Address country -----------*/}
          <FFormGroup
            name={'billing_address_country'}
            inline={true}
            label={<T id={'country'} />}
          >
            <FInputGroup name={'billing_address_country'} />
          </FFormGroup>

          {/*------------ Billing Address 1  -----------*/}
          <FFormGroup
            name={'billing_address_1'}
            label={<T id={'address_line_1'} />}
            inline={true}
          >
            <FTextArea name={'billing_address_1'} />
          </FFormGroup>

          {/*------------ Billing Address 2  -----------*/}
          <FFormGroup
            name={'billing_address_2'}
            label={<T id={'address_line_2'} />}
            inline={true}
          >
            <FTextArea name={'billing_address_2'} />
          </FFormGroup>
          {/*------------ Billing Address city  -----------*/}
          <FFormGroup
            name={'billing_address_city'}
            label={<T id={'city_town'} />}
            inline={true}
          >
            <FInputGroup name={'billing_address_city'} />
          </FFormGroup>

          {/*------------ Billing Address state  -----------*/}
          <FFormGroup
            name={'billing_address_state'}
            label={<T id={'state'} />}
            inline={true}
          >
            <FInputGroup name={'billing_address_state'} />
          </FFormGroup>
          {/*------------ Billing Address postcode  -----------*/}
          <FFormGroup
            name={'billing_address_postcode'}
            label={<T id={'zip_code'} />}
            inline={true}
          >
            <FInputGroup name={'billing_address_postcode'} />
          </FFormGroup>

          {/*------------ Billing Address phone  -----------*/}
          <FFormGroup
            name={'billing_address_phone'}
            label={<T id={'phone'} />}
            inline={true}
          >
            <FInputGroup name={'billing_address_phone'} />
          </FFormGroup>
        </Col>

        <Col xs={6}>
          <h4>
            <T id={'shipping_address'} />
          </h4>
          {/*------------ Shipping Address country -----------*/}
          <FFormGroup
            name={'shipping_address_country'}
            label={<T id={'country'} />}
            inline={true}
          >
            <FInputGroup name={'shipping_address_country'} />
          </FFormGroup>

          {/*------------ Shipping Address 1  -----------*/}
          <FFormGroup
            name={'shipping_address_1'}
            label={<T id={'address_line_1'} />}
            inline={true}
          >
            <FTextArea name={'shipping_address_1'} />
          </FFormGroup>

          {/*------------ Shipping Address 2  -----------*/}
          <FFormGroup
            name={'shipping_address_2'}
            label={<T id={'address_line_2'} />}
            inline={true}
          >
            <FTextArea name={'shipping_address_2'} />
          </FFormGroup>

          {/*------------ Shipping Address city  -----------*/}
          <FFormGroup
            name={'shipping_address_city'}
            label={<T id={'city_town'} />}
            inline={true}
          >
            <FInputGroup name={'shipping_address_city'} />
          </FFormGroup>

          {/*------------ Shipping Address state  -----------*/}
          <FFormGroup
            name={'shipping_address_state'}
            label={<T id={'state'} />}
            inline={true}
          >
            <FInputGroup name={'shipping_address_state'} />
          </FFormGroup>

          {/*------------ Shipping Address postcode  -----------*/}
          <FFormGroup
            name={'shipping_address_postcode'}
            label={<T id={'zip_code'} />}
            inline={true}
          >
            <FInputGroup name={'shipping_address_postcode'} />
          </FFormGroup>

          {/*------------ Shipping Address phone  -----------*/}
          <FFormGroup
            name={'shipping_address_phone'}
            label={<T id={'phone'} />}
            inline={true}
          >
            <FInputGroup name={'shipping_address_phone'} />
          </FFormGroup>
        </Col>
      </Row>
    </div>
  );
};

export default CustomerBillingAddress;
