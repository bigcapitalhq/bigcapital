import React from 'react';
import { FormGroup, Intent, InputGroup, TextArea } from '@blueprintjs/core';
import { Row, Col } from 'components';
import { FormattedMessage as T } from 'react-intl';

import ErrorMessage from 'components/ErrorMessage';

const CustomerBillingAddress = ({
  errors,
  touched,
  setFieldValue,
  getFieldProps,
}) => {
  return (
    <div className={'tab-panel--address'}>
      <Row>
        <Col xs={6}>
          <h4>
            <T id={'billing_address'} />
          </h4>
          {/*------------ Billing Address country -----------*/}
          <FormGroup
            className={'form-group--journal-number'}
            intent={
              errors.billing_address_country &&
              touched.billing_address_country &&
              Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage
                name="billing_address_country"
                {...{ errors, touched }}
              />
            }
            label={<T id={'country'} />}
          >
            <InputGroup
              intent={
                errors.billing_address_country &&
                touched.billing_address_country &&
                Intent.DANGER
              }
              {...getFieldProps('billing_address_country')}
            />
          </FormGroup>
          {/*------------ Billing Address 1  -----------*/}
          <FormGroup
            label={<T id={'address_line_1'} />}
            className={'form-group--address_line_1'}
            intent={
              errors.billing_address_1 &&
              touched.billing_address_1 &&
              Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage name="billing_address_1" {...{ errors, touched }} />
            }
          >
            <TextArea
              intent={
                errors.billing_address_1 &&
                touched.billing_address_1 &&
                Intent.DANGER
              }
              {...getFieldProps('billing_address_1')}
            />
          </FormGroup>
          {/*------------ Billing Address 2  -----------*/}
          <FormGroup
            label={<T id={'address_line_2'} />}
            className={'form-group--journal-number'}
            intent={
              errors.billing_address_2 &&
              touched.billing_address_2 &&
              Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage name="billing_address_2" {...{ errors, touched }} />
            }
          >
            <TextArea
              intent={
                errors.billing_address_2 &&
                touched.billing_address_2 &&
                Intent.DANGER
              }
              {...getFieldProps('billing_address_2')}
            />
          </FormGroup>
          {/*------------ Billing Address city  -----------*/}
          <FormGroup
            label={<T id={'city_town'} />}
            className={'form-group--journal-number'}
            intent={
              errors.billing_address_city &&
              touched.billing_address_city &&
              Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage
                name="billing_address_city"
                {...{ errors, touched }}
              />
            }
          >
            <InputGroup
              intent={
                errors.billing_address_city &&
                touched.billing_address_city &&
                Intent.DANGER
              }
              {...getFieldProps('billing_address_city')}
            />
          </FormGroup>
          {/*------------ Billing Address state  -----------*/}
          <FormGroup
            label={<T id={'state'} />}
            className={'form-group--journal-number'}
            intent={
              errors.billing_address_state &&
              touched.billing_address_state &&
              Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage
                name="billing_address_state"
                {...{ errors, touched }}
              />
            }
          >
            <InputGroup
              intent={
                errors.billing_address_state &&
                touched.billing_address_state &&
                Intent.DANGER
              }
              {...getFieldProps('billing_address_state')}
            />
          </FormGroup>
          {/*------------ Billing Address postcode  -----------*/}
          <FormGroup
            label={<T id={'zip_code'} />}
            intent={
              errors.billing_address_postcode &&
              touched.billing_address_postcode &&
              Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage
                name="billing_address_postcode"
                {...{ errors, touched }}
              />
            }
          >
            <InputGroup
              intent={
                errors.billing_address_postcode &&
                touched.billing_address_postcode &&
                Intent.DANGER
              }
              {...getFieldProps('billing_address_postcode')}
            />
          </FormGroup>
          {/*------------ Billing Address phone  -----------*/}
          <FormGroup
            label={<T id={'phone'} />}
            intent={
              errors.billing_address_phone && touched.billing_address_phone && Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage name="billing_address_phone" {...{ errors, touched }} />
            }
          >
            <InputGroup
              intent={
                errors.billing_address_phone && touched.billing_address_phone && Intent.DANGER
              }
              {...getFieldProps('billing_address_phone')}
            />
          </FormGroup>
        </Col>

        <Col xs={6}>
          <h4>
            <T id={'shipping_address'} />
          </h4>
          {/*------------ Shipping Address country -----------*/}
          <FormGroup
            label={<T id={'country'} />}
            className={'form-group--journal-number'}
            intent={
              errors.shipping_address_country &&
              touched.shipping_address_country &&
              Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage
                name="shipping_address_country"
                {...{ errors, touched }}
              />
            }
          >
            <InputGroup
              intent={
                errors.shipping_address_country &&
                touched.shipping_address_country &&
                Intent.DANGER
              }
              {...getFieldProps('shipping_address_country')}
            />
          </FormGroup>
          {/*------------ Shipping Address 1  -----------*/}
          <FormGroup
            label={<T id={'address_line_1'} />}
            className={'form-group--journal-number'}
            intent={
              errors.shipping_address_1 &&
              touched.shipping_address_1 &&
              Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage name="shipping_address_1" {...{ errors, touched }} />
            }
          >
            <TextArea
              intent={
                errors.shipping_address_1 &&
                touched.shipping_address_1 &&
                Intent.DANGER
              }
              {...getFieldProps('shipping_address_1')}
            />
          </FormGroup>
          {/*------------ Shipping Address 2  -----------*/}
          <FormGroup
            label={<T id={'address_line_2'} />}
            className={'form-group--journal-number'}
            intent={
              errors.shipping_address_2 &&
              touched.shipping_address_2 &&
              Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage name="shipping_address_2" {...{ errors, touched }} />
            }
          >
            <TextArea
              intent={
                errors.shipping_address_2 &&
                touched.shipping_address_2 &&
                Intent.DANGER
              }
              {...getFieldProps('shipping_address_2')}
            />
          </FormGroup>
          {/*------------ Shipping Address city  -----------*/}
          <FormGroup
            label={<T id={'city_town'} />}
            className={'form-group--journal-number'}
            intent={
              errors.shipping_address_city &&
              touched.shipping_address_city &&
              Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage
                name="shipping_address_city"
                {...{ errors, touched }}
              />
            }
          >
            <InputGroup
              intent={
                errors.shipping_address_city &&
                touched.shipping_address_city &&
                Intent.DANGER
              }
              {...getFieldProps('shipping_address_city')}
            />
          </FormGroup>
          {/*------------ Shipping Address state  -----------*/}
          <FormGroup
            label={<T id={'state'} />}
            className={'form-group--journal-number'}
            intent={
              errors.shipping_address_state &&
              touched.shipping_address_state &&
              Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage
                name="shipping_address_state"
                {...{ errors, touched }}
              />
            }
          >
            <InputGroup
              intent={
                errors.shipping_address_state &&
                touched.shipping_address_state &&
                Intent.DANGER
              }
              {...getFieldProps('shipping_address_state')}
            />
          </FormGroup>
          {/*------------ Shipping Address postcode  -----------*/}
          <FormGroup
            label={<T id={'zip_code'} />}
            intent={
              errors.shipping_address_postcode &&
              touched.shipping_address_postcode &&
              Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage
                name="shipping_address_postcode"
                {...{ errors, touched }}
              />
            }
          >
            <InputGroup
              intent={
                errors.shipping_address_postcode &&
                touched.shipping_address_postcode &&
                Intent.DANGER
              }
              {...getFieldProps('shipping_address_postcode')}
            />
          </FormGroup>
          {/*------------ Shipping Address phone  -----------*/}
          <FormGroup
            label={<T id={'phone'} />}
            intent={
              errors.shipping_address_phone && touched.shipping_address_phone && Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage name="shipping_address_phone" {...{ errors, touched }} />
            }
          >
            <InputGroup
              intent={
                errors.shipping_address_phone && touched.shipping_address_phone && Intent.DANGER
              }
              {...getFieldProps('shipping_address_phone')}
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};

export default CustomerBillingAddress;
