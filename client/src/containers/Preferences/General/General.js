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
import classNames from 'classnames';
import { TimezonePicker } from '@blueprintjs/timezone';
import { Select } from '@blueprintjs/select';
import { useQuery } from 'react-query';

import { compose, optionsMapToArray } from 'utils';

import ErrorMessage from 'components/ErrorMessage';
import AppToaster from 'components/AppToaster';

import withSettings from 'containers/Settings/withSettings';
import withSettingsActions from 'containers/Settings/withSettingsActions';
import { FormattedMessage as T, useIntl } from 'react-intl';


function GeneralPreferences({
  // #withSettings
  organizationSettings,

  // #withSettingsActions
  requestSubmitOptions,
  requestFetchOptions,
}) {
  const {formatMessage} = useIntl();
  const [selectedItems, setSelectedItems] = useState({});
  const [timeZone, setTimeZone] = useState('');

  const fetchHook = useQuery(['settings'],
    () => { requestFetchOptions(); });

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

  const validationSchema = Yup.object().shape({
    name: Yup.string().required().label(formatMessage({id:'organization_name_'})),
    industry: Yup.string().required().label(formatMessage({id:'organization_industry_'})),
    location: Yup.string().required().label(formatMessage({id:'location'})),
    base_currency: Yup.string().required(
      formatMessage({ id: 'required' })
    ),
    fiscal_year: Yup.string().required().label(formatMessage({id:'base_currency_'})),
    language: Yup.string().required().label(formatMessage({id:'language'})),
    // time_zone: Yup.object().required()..label(formatMessage({id:''})),
    date_format: Yup.date().required().label(formatMessage({id:'date_format_'})),
  });

  const {
    errors,
    values,
    touched,
    isSubmitting,
    setFieldValue,
    getFieldProps,
    handleSubmit,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...organizationSettings,
    },
    validationSchema,
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
      setFieldValue(filedName, filed.name);
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
      <form onSubmit={handleSubmit}>
        <FormGroup
          label={<T id={'organization_name'}/>}
          inline={true}
          intent={(errors.name && touched.name) && Intent.DANGER}
          helperText={<ErrorMessage name='name' {...{errors, touched}} />}
        >
          <InputGroup
            medium={'true'}
            intent={(errors.name && touched.name) && Intent.DANGER}
            {...getFieldProps('name')}
          />
        </FormGroup>

        <FormGroup
          label={<T id={'organization_industry'}/>}
          inline={true}
          intent={(errors.industry && touched.industry) && Intent.DANGER}
          helperText={<ErrorMessage name='industry' {...{errors, touched}} />}
        >
          <InputGroup
            medium={'true'}
            intent={(errors.industry && touched.industry) && Intent.DANGER}
            {...getFieldProps('industry')}
          />
        </FormGroup>

        <FormGroup
          label={<T id={'business_location'}/>}
          className={classNames(
            'form-group--business-location',
            'form-group--select-list',
            Classes.FILL
          )}
          inline={true}
          helperText={<ErrorMessage name='location' {...{errors, touched}} />}
          intent={(errors.location && touched.location) && Intent.DANGER}
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
          label={<T id={'base_currency'}/>}
          className={classNames(
            'form-group--base-currency',
            'form-group--select-list',
            Classes.FILL
          )}
          inline={true}
          helperText={<ErrorMessage name='base_currency' {...{ errors, touched }} />}
          intent={(errors.base_currency && touched.base_currency) && Intent.DANGER}
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
          label={<T id={'fiscal_year'}/>}
          className={classNames(
            'form-group--fiscal-year',
            'form-group--select-list',
            Classes.FILL
          )}
          inline={true}
          helperText={<ErrorMessage name='fiscal_year' {...{errors, touched}} />}
          intent={(errors.fiscal_year && touched.fiscal_year) && Intent.DANGER}
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
          label={<T id={'language'}/>}
          inline={true}
          className={classNames(
            'form-group--language',
            'form-group--select-list',
            Classes.FILL
          )}
          intent={(errors.language && touched.language) && Intent.DANGER}
          helperText={<ErrorMessage name='language' {...{errors, touched}} />}
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
          label={<T id={'time_zone'}/>}
          inline={true}
          className={classNames(
            'form-group--time-zone',
            'form-group--select-list',
            Classes.FILL
          )}
          intent={(errors.time_zone && touched.time_zone) && Intent.DANGER}
          helperText={<ErrorMessage name='time_zone' {...{errors, touched}} />}
        >
          <TimezonePicker
            value={timeZone}
            onChange={handleTimezoneChange}
            showLocalTimezone={true}
            valueDisplayFormat='composite'
          />
        </FormGroup>
        <FormGroup
          label={<T id={'date_format'}/>}
          inline={true}
          className={classNames(
            'form-group--language',
            'form-group--select-list',
            Classes.FILL
          )}
          intent={(errors.date_format && touched.date_format) && Intent.DANGER}
          helperText={<ErrorMessage name='date_format' {...{errors, touched}} />}
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
            <T id={'save'}/>
          </Button>
          <Button onClick={'handleClose'}><T id={'close'}/></Button>
        </div>
      </form>
    </div>
  );
}

export default compose(
  withSettings,
  withSettingsActions,
)(GeneralPreferences);
