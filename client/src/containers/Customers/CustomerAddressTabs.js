import React, { useState, useMemo, useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  FormGroup,
  MenuItem,
  Intent,
  InputGroup,
  HTMLSelect,
  Button,
  Classes,
} from '@blueprintjs/core';

import { Row, Col } from 'react-grid-system';
import { FormattedMessage as T, useIntl } from 'react-intl';

import ErrorMessage from 'components/ErrorMessage';

const CustomerBillingAddress = ({
  formik: { errors, touched, setFieldValue, getFieldProps },
}) => {
  return (
    <div className={'customer-form'}>
      <Row gutterWidth={16} className={'customer-form__tabs-section'}>
        <Col width={404}>
          <h4>
            <T id={'billing_address'} />
          </h4>

          <FormGroup
            label={<T id={'country'} />}
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
        </Col>
        <Col width={404}>
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
        </Col>
      </Row>
    </div>
  );
};

export default CustomerBillingAddress;
