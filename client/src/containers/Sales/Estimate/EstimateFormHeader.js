import React, { useMemo, useCallback, useState } from 'react';
import {
  FormGroup,
  InputGroup,
  Intent,
  Position,
  MenuItem,
  Classes,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T } from 'react-intl';
import { Row, Col } from 'react-grid-system';
import moment from 'moment';
import { momentFormatter, compose, tansformDateValue } from 'utils';
import classNames from 'classnames';
import { ListSelect, ErrorMessage, FieldRequiredHint, Hint } from 'components';

import withCustomers from 'containers/Customers/withCustomers';

function EstimateFormHeader({
  formik: { errors, touched, setFieldValue, getFieldProps, values },

  //#withCustomers
  customers,
}) {
  const handleDateChange = useCallback(
    (date_filed) => (date) => {
      const formatted = moment(date).format('YYYY-MM-DD');
      setFieldValue(date_filed, formatted);
    },
    [setFieldValue],
  );

  const CustomerRenderer = useCallback(
    (cutomer, { handleClick }) => (
      <MenuItem
        key={cutomer.id}
        text={cutomer.display_name}
        onClick={handleClick}
      />
    ),
    [],
  );

  // Filter Customer
  const filterCustomer = (query, customer, _index, exactMatch) => {
    const normalizedTitle = customer.display_name.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return (
        `${customer.display_name} ${normalizedTitle}`.indexOf(
          normalizedQuery,
        ) >= 0
      );
    }
  };

  // handle change customer
  const onChangeCustomer = useCallback(
    (filedName) => {
      return (customer) => {
        setFieldValue(filedName, customer.id);
      };
    },
    [setFieldValue],
  );

  return (
    <div className={'page-form page-form--estimate'}>
      <div className={'page-form__primary-section'}>
        <FormGroup
          label={<T id={'customer_name'} />}
          inline={true}
          className={classNames(
            'form-group--select-list',
            'form-group--customer',
            Classes.FILL,
          )}
          labelInfo={<FieldRequiredHint />}
          intent={errors.customer_id && touched.customer_id && Intent.DANGER}
          helperText={
            <ErrorMessage name={'customer_id'} {...{ errors, touched }} />
          }
        >
          <ListSelect
            items={customers}
            noResults={<MenuItem disabled={true} text="No results." />}
            itemRenderer={CustomerRenderer}
            itemPredicate={filterCustomer}
            popoverProps={{ minimal: true }}
            onItemSelect={onChangeCustomer('customer_id')}
            selectedItem={values.customer_id}
            selectedItemProp={'id'}
            defaultText={<T id={'select_customer_account'} />}
            labelProp={'display_name'}
          />
        </FormGroup>
        
        <Row>
          <Col

          // md={9} push={{ md: 3 }}
          >
            <FormGroup
              label={<T id={'estimate_date'} />}
              inline={true}
              labelInfo={<FieldRequiredHint />}
              className={classNames(
                'form-group--select-list',
                Classes.FILL,
                'form-group--estimate-date'
              )}
              intent={
                errors.estimate_date && touched.estimate_date && Intent.DANGER
              }
              helperText={
                <ErrorMessage name="estimate_date" {...{ errors, touched }} />
              }
            >
              <DateInput
                {...momentFormatter('YYYY/MM/DD')}
                value={tansformDateValue(values.estimate_date)}
                onChange={handleDateChange('estimate_date')}
                popoverProps={{ position: Position.BOTTOM, minimal: true }}
              />
            </FormGroup>
          </Col>
          <Col

          // md={3} pull={{ md: 9 }}
          >
            <FormGroup
              label={<T id={'expiration_date'} />}
              inline={true}
              className={classNames(
                'form-group--select-list',
                'form-group--expiration-date',
                Classes.FILL
              )}
              intent={
                errors.expiration_date &&
                touched.expiration_date &&
                Intent.DANGER
              }
              helperText={
                <ErrorMessage name="expiration_date" {...{ errors, touched }} />
              }
            >
              <DateInput
                {...momentFormatter('YYYY/MM/DD')}
                value={tansformDateValue(values.expiration_date)}
                onChange={handleDateChange('expiration_date')}
                popoverProps={{ position: Position.BOTTOM, minimal: true }}
              />
            </FormGroup>
          </Col>
        </Row>
      </div>

      {/*- Estimate -*/}
      <FormGroup
        label={<T id={'estimate'} />}
        inline={true}
        className={('form-group--estimate-number', Classes.FILL)}
        labelInfo={<FieldRequiredHint />}
        intent={
          errors.estimate_number && touched.estimate_number && Intent.DANGER
        }
        helperText={
          <ErrorMessage name="estimate_number" {...{ errors, touched }} />
        }
      >
        <InputGroup
          intent={
            errors.estimate_number && touched.estimate_number && Intent.DANGER
          }
          minimal={true}
          {...getFieldProps('estimate_number')}
        />
      </FormGroup>
    
      <FormGroup
        label={<T id={'reference'} />}
        inline={true}
        className={classNames('form-group--reference', Classes.FILL)}
        intent={errors.reference && touched.reference && Intent.DANGER}
        helperText={<ErrorMessage name="reference" {...{ errors, touched }} />}
      >
        <InputGroup
          intent={errors.reference && touched.reference && Intent.DANGER}
          minimal={true}
          {...getFieldProps('reference')}
        />
      </FormGroup>
    </div>
  );
}

export default compose(
  withCustomers(({ customers }) => ({
    customers,
  })),
)(EstimateFormHeader);
