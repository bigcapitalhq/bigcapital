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
    <div
      className={
        'customer-form__tabs-section customer-form__tabs-section--address'
      }
    >
      <Row>
        <Col xs={6}>
          <h4>
            <T id={'billing_address'} />
          </h4>

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

          <FormGroup
            label={<T id={'zip_code'} />}
            intent={
              errors.billing_address_zipcode &&
              touched.billing_address_zipcode &&
              Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage
                name="billing_address_zipcode"
                {...{ errors, touched }}
              />
            }
          >
            <InputGroup
              intent={
                errors.billing_address_zipcode &&
                touched.billing_address_zipcode &&
                Intent.DANGER
              }
              {...getFieldProps('billing_address_zipcode')}
            />
          </FormGroup>

          <FormGroup
            label={<T id={'phone'} />}
            intent={
              errors.shipping_phone && touched.shipping_phone && Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage name="shipping_phone" {...{ errors, touched }} />
            }
          >
            <InputGroup
              intent={
                errors.shipping_phone && touched.shipping_phone && Intent.DANGER
              }
              {...getFieldProps('shipping_phone')}
            />
          </FormGroup>
        </Col>

        <Col xs={6}>
          <h4>
            <T id={'shipping_address'} />
          </h4>

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

          <FormGroup
            label={<T id={'address_line_1'} />}
            className={'form-group--journal-number'}
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

          <FormGroup
            label={<T id={'zip_code'} />}
            intent={
              errors.shipping_address_zipcode &&
              touched.shipping_address_zipcode &&
              Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage
                name="shipping_address_zipcode"
                {...{ errors, touched }}
              />
            }
          >
            <InputGroup
              intent={
                errors.shipping_address_zipcode &&
                touched.shipping_address_zipcode &&
                Intent.DANGER
              }
              {...getFieldProps('shipping_address_zipcode')}
            />
          </FormGroup>

          <FormGroup
            label={<T id={'phone'} />}
            intent={
              errors.shipping_phone && touched.shipping_phone && Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage name="shipping_phone" {...{ errors, touched }} />
            }
          >
            <InputGroup
              intent={
                errors.shipping_phone && touched.shipping_phone && Intent.DANGER
              }
              {...getFieldProps('shipping_phone')}
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};

export default CustomerBillingAddress;
