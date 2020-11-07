import React, { useMemo, useCallback } from 'react';
import classNames from 'classnames';
import { FormGroup, Intent, InputGroup, ControlGroup } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import {
  Hint,
  FieldRequiredHint,
  SalutationList,
  DisplayNameList,
  ErrorMessage,
  Row,
  Col,
} from 'components';
import CustomerTypeRadioField from 'containers/Customers/CustomerTypeRadioField';
import { CLASSES } from 'common/classes';

/**
 * Customer form primary section.
 */
export default function CustomerFormPrimarySection({
  setFieldValue,
  getFieldProps,
  errors,
  values,
  touched,
}) {
  const handleCustomerTypeCahange = useCallback(
    (value) => {
      setFieldValue('customer_type', value);
    },
    [setFieldValue],
  );

  // Handle salutation field select.
  const handleSalutationSelect = (salutation) => {
    setFieldValue('salutation', salutation.label);
  };
  // Handle display name field select.
  const handleDisplayNameSelect = (displayName) => {
    setFieldValue('display_name', displayName.label);
  };

  return (
    <div className={'customer-form__primary-section-content'}>
      {/**-----------Customer type. -----------*/}
      <CustomerTypeRadioField
        selectedValue={values.customer_type}
        onChange={handleCustomerTypeCahange}
      />

      {/**----------- Contact name -----------*/}
      <FormGroup
        className={classNames('form-group--contact_name')}
        label={<T id={'contact_name'} />}
        inline={true}
      >
        <ControlGroup>
          <SalutationList
            onItemSelect={handleSalutationSelect}
            popoverProps={{ minimal: true }}
            className={classNames(
              CLASSES.FORM_GROUP_LIST_SELECT,
              CLASSES.FILL,
              'input-group--salutation-list',
              'select-list--fill-button',
            )}
          />
          <InputGroup
            placeholder={'First Name'}
            intent={errors.first_name && touched.first_name && Intent.DANGER}
            {...getFieldProps('first_name')}
            className={classNames('input-group--first-name')}
          />
          <InputGroup
            placeholder={'Last Name'}
            intent={errors.last_name && touched.last_name && Intent.DANGER}
            {...getFieldProps('last_name')}
            className={classNames('input-group--last-name')}
          />
        </ControlGroup>
      </FormGroup>

      {/*----------- Company Name -----------*/}
      <FormGroup
        className={classNames('form-group--company_name')}
        label={<T id={'company_name'} />}
        intent={errors.company_name && touched.company_name && Intent.DANGER}
        helperText={
          <ErrorMessage {...{ errors, touched }} name={'company_name'} />
        }
        inline={true}
      >
        <InputGroup
          intent={errors.company_name && touched.company_name && Intent.DANGER}
          {...getFieldProps('company_name')}
        />
      </FormGroup>

      {/*----------- Display Name -----------*/}
      <FormGroup
        intent={errors.display_name && touched.display_name && Intent.DANGER}
        helperText={
          <ErrorMessage {...{ errors, touched }} name={'display_name'} />
        }
        label={
          <>
            <T id={'display_name'} />
            <FieldRequiredHint />
            <Hint />
          </>
        }
        className={classNames(CLASSES.FORM_GROUP_LIST_SELECT, CLASSES.FILL)}
        inline={true}
      >
        <DisplayNameList
          firstName={values.first_name}
          lastName={values.last_name}
          company={values.company_name}
          onItemSelect={handleDisplayNameSelect}
          popoverProps={{ minimal: true }}
        />
      </FormGroup>
    </div>
  );
}
