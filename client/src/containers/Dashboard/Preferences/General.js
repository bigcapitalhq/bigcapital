import React, { useState, useCallback, useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  FormGroup,
  InputGroup,
  Intent,
  MenuItem,
  Classes,
} from '@blueprintjs/core';

import { optionsMapToArray, momentFormatter } from 'utils';
import { TimezonePicker } from '@blueprintjs/timezone';
import { Select } from '@blueprintjs/select';
import classNames from 'classnames';
import ErrorMessage from 'components/ErrorMessage';
import Icon from 'components/Icon';

function GeneralPreferences(props) {
  const [selectedItems, setSelectedItems] = useState({});
  const [disableItems, setDisableItems] = useState(false);
  const [timeZone, setTimeZone] = useState('');

  const businessLocation = [
    { id: 218, name: 'LIBYA', code: 'LY' },
    { id: 380, name: 'UKRAINE', code: 'UA' },
    { id: 212, name: 'Morocco', code: 'MA' },
  ];
  const languagesDisplay = [
    { name: 'EN', label: 'English' },
    { name: 'Arb', label: 'Arabic' },
  ];
  const currencies = [
    { id: 0, name: 'US Dollar', code: 'USD' },
    { id: 1, name: 'Euro', code: 'EUR' },
    { id: 2, name: 'Libyan Dinar	', code: 'LYD' },
  ];
  const fiscalYear = [
    { id: 0, name: 'January-July', label: 'January-July' },
    { id: 1, name: 'August-December', label: 'August-December' },
  ];
  const dateFormat = [
    { name: '04/11/2020', format: 'MM-DD-YY' },
    { name: '2020/03/21', format: 'YY/MM/DD' },
    { name: 'Apr 11, 2020', format: 'MMMM yyyy' },
    { name: 'Saturday, Apr 11, 2020', format: 'EEEE, MMM d, yyyy' },
  ];
  const validationSchema = Yup.object().shape({
    organization_name: Yup.string().required('required field'),
    organization_industry: Yup.string().required('required field'),
    business_location: Yup.string().required('required field'),
    base_currency: Yup.string().required('required field'),
    fiscal_year: Yup.string().required('required field'),
    language: Yup.string().required('required field'),
    time_zone: Yup.date().required('required field'),
    date_format: Yup.date().required('required field'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {},
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const options = optionsMapToArray(values).map((option) => {
        return { ...option, group: 'general' };
      });
    },
  });
  const { errors, values, touched } = useMemo(() => formik, [formik]);

  const businessLocationItem = (item, { handleClick }) => (
    <MenuItem
      className={'preferences-menu'}
      key={item.id}
      text={item.name}
      label={item.code}
      onClick={handleClick}
    />
  );

  const currencyItem = (item, { handleClick }) => (
    <MenuItem
      className={'preferences-menu'}
      key={item.id}
      text={item.name}
      label={item.code}
      onClick={handleClick}
    />
  );
  const fiscalYearItem = (item, { handleClick }) => (
    <MenuItem
      className={'preferences-menu'}
      key={item.id}
      text={item.name}
      onClick={handleClick}
    />
  );

  const languageItem = (item, { handleClick }) => (
    <MenuItem
      className={'preferences-menu'}
      key={item.id}
      text={item.name}
      label={item.label}
      onClick={handleClick}
    />
  );

  const data_Format = (item, { handleClick }) => (
    <MenuItem
      className={'preferences-menu'}
      key={item.id}
      text={item.format}
      label={item.name}
      onClick={handleClick}
    />
  );

  const onItemsSelect = (filedName) => {
    return (filed) => {
      setSelectedItems({
        ...selectedItems,
        [filedName]: filed,
      });
      formik.setFieldValue(filedName, filed.name);
    };
  };
  const getSelectedItemLabel = (filedName, defaultLabel) => {
    return typeof selectedItems[filedName] !== 'undefined'
      ? selectedItems[filedName].name
      : defaultLabel;
  };

  const handleTimezoneChange = (timezone) => setTimeZone(timezone);

  return (
    <div className='preferences__inside-content--general'>
      <form onSubmit={formik.handleSubmit}>
        <FormGroup
          label={'Organization Name'}
          inline={true}
          intent={
            errors.organization_name &&
            touched.organization_name &&
            Intent.DANGER
          }
          helperText={<ErrorMessage name='organization_name' {...formik} />}
        >
          <InputGroup
            medium={true}
            intent={
              errors.organization_name &&
              touched.organization_name &&
              Intent.DANGER
            }
            {...formik.getFieldProps('organization_name')}
          />
        </FormGroup>

        <FormGroup
          label={'Organization Industry'}
          inline={true}
          intent={
            errors.organization_industry &&
            touched.organization_industry &&
            Intent.DANGER
          }
          helperText={<ErrorMessage name='organization_industry' {...formik} />}
        >
          <InputGroup
            medium={true}
            intent={
              errors.organization_industry &&
              touched.organization_industry &&
              Intent.DANGER
            }
            {...formik.getFieldProps('organization_industry')}
          />
        </FormGroup>

        <FormGroup
          label={'Business Location'}
          className={classNames(
            'form-group--business-location',
            'form-group--select-list',
            Classes.FILL
          )}
          inline={true}
          helperText={<ErrorMessage name='business_location' {...formik} />}
          intent={
            errors.business_location &&
            touched.business_location &&
            Intent.DANGER
          }
        >
          <Select
            items={businessLocation}
            noResults={<MenuItem disabled={true} text='No result.' />}
            itemRenderer={businessLocationItem}
            popoverProps={{ minimal: true }}
            onItemSelect={onItemsSelect('business_location')}
          >
            <Button
              fill={true}
              rightIcon='caret-down'
              text={getSelectedItemLabel(
                'business_location',
                'Business Location'
              )}
            />
          </Select>
        </FormGroup>

        <FormGroup
          label={'Base Currency'}
          className={classNames(
            'form-group--base-currency',
            'form-group--select-list',
            Classes.FILL
          )}
          inline={true}
          helperText={<ErrorMessage name='base_currency' {...formik} />}
          intent={
            errors.base_currency && touched.base_currency && Intent.DANGER
          }
        >
          <Select
            items={currencies}
            noResults={<MenuItem disabled={true} text='No result.' />}
            itemRenderer={currencyItem}
            popoverProps={{ minimal: true }}
            onItemSelect={onItemsSelect('base_currency')}
          >
            <Button
              fill={true}
              rightIcon='caret-down'
              text={getSelectedItemLabel('base_currency', 'Base Currency')}
            />
          </Select>
        </FormGroup>

        <FormGroup
          label={'Fiscal Year'}
          className={classNames(
            'form-group--fiscal-year',
            'form-group--select-list',
            Classes.FILL
          )}
          inline={true}
          helperText={<ErrorMessage name='fiscal_year' {...formik} />}
          intent={errors.fiscal_year && touched.fiscal_year && Intent.DANGER}
        >
          <Select
            items={fiscalYear}
            noResults={<MenuItem disabled={true} text='No result.' />}
            itemRenderer={fiscalYearItem}
            popoverProps={{ minimal: true }}
            onItemSelect={onItemsSelect('fiscal_year')}
          >
            <Button
              fill={true}
              rightIcon='caret-down'
              text={getSelectedItemLabel('fiscal_year', 'Fiscal Year')}
            />
          </Select>
        </FormGroup>

        <FormGroup
          label={'Language'}
          inline={true}
          className={classNames(
            'form-group--language',
            'form-group--select-list',
            Classes.FILL
          )}
          intent={errors.language && touched.language && Intent.DANGER}
          helperText={<ErrorMessage name='language' {...formik} />}
        >
          <Select
            items={languagesDisplay}
            noResults={<MenuItem disabled={true} text='No results.' />}
            itemRenderer={languageItem}
            popoverProps={{ minimal: true }}
            onItemSelect={onItemsSelect('language')}
          >
            <Button
              rightIcon='caret-down'
              text={getSelectedItemLabel('language', 'English')}
            />
          </Select>
        </FormGroup>

        <FormGroup
          label={'Time Zone'}
          inline={true}
          className={classNames(
            'form-group--time-zone',
            'form-group--select-list',
            Classes.FILL
          )}
          intent={errors.time_zone && touched.time_zone && Intent.DANGER}
          helperText={<ErrorMessage name='time_zone' {...formik} />}
        >
          <TimezonePicker
            value={timeZone}
            onChange={handleTimezoneChange}
            showLocalTimezone={true}
            valueDisplayFormat='composite'
          />
        </FormGroup>

        <FormGroup
          label={'Date Format'}
          inline={true}
          className={classNames(
            'form-group--date-format',
            'form-group--select-list',
            Classes.FILL
          )}
          intent={errors.date_format && touched.data_Format && Intent.DANGER}
          helperText={<ErrorMessage name='date_format' {...formik} />}
          minimal={true}
        >
          <Select
            items={dateFormat}
            noResults={<MenuItem disabled={true} text='No result.' />}
            itemRenderer={data_Format}
            popoverProps={{ minimal: true }}
            onItemSelect={onItemsSelect('date_format')}
          >
            <Button
              fill={true}
              rightIcon='caret-down'
              text={getSelectedItemLabel('fiscal_year', 'Fiscal Year')}
            />
          </Select>
        </FormGroup>

        <div className={'preferences__floating-footer '}>
          <Button
            className={'preferences-button'}
            intent={Intent.PRIMARY}
            type='submit'
          >
            {'Save'}
          </Button>
          <Button onClick={'handleClose'}>Close</Button>
        </div>
      </form>
    </div>
  );
}

export default GeneralPreferences;
