import React, { useState, useCallback, useMemo, useEffect } from 'react';
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

import { optionsMapToArray, momentFormatter, optionsArrayToMap } from 'utils';
import { TimezonePicker } from '@blueprintjs/timezone';
import { Select } from '@blueprintjs/select';
import classNames from 'classnames';
import ErrorMessage from 'components/ErrorMessage';
import Icon from 'components/Icon';
import { compose } from 'utils';
import SettingsConnect from 'connectors/Settings.connect';
import AppToaster from 'components/AppToaster';
import { useIntl } from 'react-intl';
import useAsync from 'hooks/async';

function GeneralPreferences({
  organizationSettings,
  requestSubmitOptions,
  requestFetchOptions,
}) {
  const [selectedItems, setSelectedItems] = useState({});
  const [timeZone, setTimeZone] = useState('');

  const businessLocation = [
    { id: 218, name: 'LIBYA', code: 'LY' },
    { id: 380, name: 'UKRAINE', code: 'UA' },
    { id: 212, name: 'Morocco', code: 'MA' },
  ];
  const languagesDisplay = [
    { id: 0, name: 'EN', label: 'English' },
    { id: 1, name: 'Arb', label: 'Arabic' },
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
    { id: 1, name: '04/11/2020', format: 'MM-DD-YY' },
    { id: 3, name: '2020/03/21', format: 'YY/MM/DD' },
    { id: 4, name: 'Apr 11, 2020', format: 'MMMM yyyy' },
    { id: 6, name: 'Saturday, Apr 11, 2020', format: 'EEEE, MMM d, yyyy' },
  ];

  const intl = useIntl();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(intl.formatMessage({ id: 'required' })),
    industry: Yup.string().required(intl.formatMessage({ id: 'required' })),
    location: Yup.string().required(intl.formatMessage({ id: 'required' })),
    base_currency: Yup.string().required(
      intl.formatMessage({ id: 'required' })
    ),
    fiscal_year: Yup.string().required(intl.formatMessage({ id: 'required' })),
    language: Yup.string().required(intl.formatMessage({ id: 'required' })),
    // time_zone: Yup.object().required(intl.formatMessage({ id: 'required' })),
    date_format: Yup.date().required(intl.formatMessage({ id: 'required' })),
  });
  console.log(organizationSettings.name);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...organizationSettings,
    },
    validationSchema: validationSchema,

    onSubmit: (values, { setSubmitting }) => {
      const options = optionsMapToArray(values).map((option) => {
        return { key: option.key, ...option, group: 'organization' };
      });

      requestSubmitOptions({ options })
        .then((response) => {
          AppToaster.show({
            message: 'The_Options_has_been_Submit',
          });
          setSubmitting(false);
        })
        .catch((error) => {
          setSubmitting(false);
        });
    },
  });

  const { errors, values, touched } = useMemo(() => formik, [formik]);

  const fetchHook = useAsync(async () => {
    await Promise.all([requestFetchOptions()]);
  });

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

  const date_format = (item, { handleClick }) => (
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
          intent={errors.name && touched.name && Intent.DANGER}
          helperText={<ErrorMessage name='name' {...formik} />}
        >
          <InputGroup
            medium={'true'}
            intent={errors.name && touched.name && Intent.DANGER}
            {...formik.getFieldProps('name')}
          />
        </FormGroup>

        <FormGroup
          label={'Organization Industry'}
          inline={true}
          intent={errors.industry && touched.industry && Intent.DANGER}
          helperText={<ErrorMessage name='industry' {...formik} />}
        >
          <InputGroup
            medium={'true'}
            intent={errors.industry && touched.industry && Intent.DANGER}
            {...formik.getFieldProps('industry')}
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
          helperText={<ErrorMessage name='location' {...formik} />}
          intent={errors.location && touched.location && Intent.DANGER}
        >
          <Select
            items={businessLocation}
            noResults={<MenuItem disabled={true} text='No result.' />}
            itemRenderer={businessLocationItem}
            popoverProps={{ minimal: true }}
            onItemSelect={onItemsSelect('location')}
          >
            <Button
              fill={true}
              rightIcon='caret-down'
              text={getSelectedItemLabel(
                'location',
                organizationSettings.location
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
              text={getSelectedItemLabel(
                'base_currency',
                organizationSettings.base_currency
              )}
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
              text={getSelectedItemLabel(
                'fiscal_year',
                organizationSettings.fiscal_year
              )}
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
              text={getSelectedItemLabel(
                'language',
                organizationSettings.language
              )}
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
            'form-group--language',
            'form-group--select-list',
            Classes.FILL
          )}
          intent={errors.date_format && touched.date_format && Intent.DANGER}
          helperText={<ErrorMessage name='date_format' {...formik} />}
        >
          <Select
            items={dateFormat}
            noResults={<MenuItem disabled={true} text='No result.' />}
            itemRenderer={date_format}
            popoverProp={{ minimal: true }}
            onItemSelect={onItemsSelect('date_format')}
          >
            <Button
              rightIcon='caret-down'
              text={getSelectedItemLabel(
                'date_format',
                organizationSettings.date_format
              )}
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

export default compose(SettingsConnect)(GeneralPreferences);
