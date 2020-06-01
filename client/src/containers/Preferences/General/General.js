import React, { useState, useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  FormGroup,
  InputGroup,
  Intent,
  MenuItem,
  Classes,
  Spinner,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { TimezonePicker } from '@blueprintjs/timezone';
import { useQuery, queryCache } from 'react-query';
import { FormattedMessage as T, useIntl } from 'react-intl';
import moment from 'moment';

import { compose, optionsMapToArray } from 'utils';

import ErrorMessage from 'components/ErrorMessage';
import AppToaster from 'components/AppToaster';
import { ListSelect } from 'components';
import { If } from 'components';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withSettings from 'containers/Settings/withSettings';
import withSettingsActions from 'containers/Settings/withSettingsActions';

function GeneralPreferences({
  // #withSettings
  organizationSettings,

  //# withDashboardActions
  changePreferencesPageTitle,

  // #withSettingsActions
  requestSubmitOptions,
  requestFetchOptions,
}) {
  const { formatMessage } = useIntl();
  const [selectedItems, setSelectedItems] = useState({});
  const [timeZone, setTimeZone] = useState('');

  const fetchHook = useQuery(
    ['settings'],
    () => {
      requestFetchOptions();
    },
    { manual: true },
  );

  useEffect(() => {
    changePreferencesPageTitle(formatMessage({ id: 'general' }));
  }, [changePreferencesPageTitle, formatMessage]);

  const businessLocation = [{ id: 218, name: 'LIBYA', value: 'libya' }];
  const languagesDisplay = [
    { id: 0, name: 'English', value: 'EN' },
    { id: 1, name: 'Arabic', value: 'Arab  ' },
  ];
  const currencies = [
    { id: 0, name: 'US Dollar', value: 'USD' },
    { id: 1, name: 'Euro', value: 'EUR' },
    { id: 1, name: 'Libyan Dinar	', value: 'LYD' },
  ];

  // @todo @mohamed - Translate the months.
  // eg. > `${formatMessage({ id: 'january' })} - ${formatMessage({ id: 'december' })}`
  const fiscalYear = [
    { id: 0, name: 'January - December', value: 'january' },
    { id: 1, name: 'February - January', value: 'february' },
    { id: 2, name: 'March - February', value: 'March' },
    { id: 3, name: 'April - March', value: 'april' },
    { id: 4, name: 'May - April', value: 'may' },
    { id: 5, name: 'June - May', value: 'june' },
    { id: 6, name: 'July - June', value: 'july' },
    { id: 7, name: 'August - July', value: 'August' },
    { id: 8, name: 'September - August', value: 'september' },
    { id: 9, name: 'October - September', value: 'october' },
    { id: 10, name: 'November - October', value: 'november' },
    { id: 11, name: 'December - November', value: 'December' },
  ];

  const dateFormat = [
    {
      id: 1,
      name: 'MM/DD/YY',
      label: `${moment().format('MM/DD/YYYY')}`,
      value: 'mm/dd/yy',
    },
    {
      id: 2,
      name: 'DD/MM/YY',
      label: `${moment().format('DD/MM/YYYY')}`,
      value: 'dd/mm/yy',
    },
    {
      id: 3,
      name: 'YY/MM/DD',
      label: `${moment().format('YYYY/MM/DD')}`,
      value: 'yy/mm/dd',
    },
    {
      id: 4,
      name: 'MM-DD-YY',
      label: `${moment().format('MM-DD-YYYY')}`,
      value: 'mm-dd-yy',
    },
    {
      id: 5,
      name: 'DD-MM-YY',
      label: `${moment().format('DD-MM-YYYY')}`,
      value: 'dd-mm-yy',
    },
    {
      id: 6,
      name: 'YY-MM-DD',
      label: `${moment().format('YYYY-MM-DD')}`,
      value: 'yy-mm-dd',
    },
  ];

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required()
      .label(formatMessage({ id: 'organization_name_' })),
    industry: Yup.string()
      .required()
      .label(formatMessage({ id: 'organization_industry_' })),
    location: Yup.string()
      .required()
      .label(formatMessage({ id: 'location' })),
    base_currency: Yup.string().required(formatMessage({ id: 'required' })),
    fiscal_year: Yup.string()
      .required()
      .label(formatMessage({ id: 'base_currency_' })),
    language: Yup.string()
      .required()
      .label(formatMessage({ id: 'language' })),
    // time_zone: Yup.string()
    //   .required()
    //   .label(formatMessage({ id: 'time_zone' })),
    date_format: Yup.string()
      .required()
      .label(formatMessage({ id: 'date_format_' })),
  });

  const query = queryCache.refetchQueries('settings');

  const {
    values,
    errors,
    touched,
    setFieldValue,
    getFieldProps,
    handleSubmit,
    resetForm,
    isSubmitting,
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
            message: formatMessage({
              id: 'the_options_has_been_successfully_created',
            }),
            intent: Intent.SUCCESS,
          });
          setSubmitting(false);
          resetForm();
          queryCache.refetchQueries('settings', { force: true });
        })
        .catch((error) => {
          setSubmitting(false);
        });
    },
  });

  // @todo @mohamed remove duplicate functions.
  const businessLocationItem = (item, { handleClick }) => (
    <MenuItem
      key={item.id}
      text={item.name}
      onClick={handleClick}
    />
  );

  const currencyItem = (item, { handleClick }) => (
    <MenuItem
      key={item.id}
      text={item.name}
      label={item.value}
      onClick={handleClick}
    />
  );
  const fiscalYearItem = (item, { handleClick }) => (
    <MenuItem
      key={item.id}
      text={item.name}
      onClick={handleClick}
    />
  );

  const languageItem = (item, { handleClick }) => (
    <MenuItem
      key={item.id}
      text={item.name}
      onClick={handleClick}
    />
  );

  const date_format = (item, { handleClick }) => (
    <MenuItem
      key={item.id}
      text={item.name}
      label={item.label}
      onClick={handleClick}
    />
  );

  const onItemsSelect = (filedName) => {
    return (filed) => {
      setSelectedItems({
        ...selectedItems,
        [filedName]: filed,
      });
      setFieldValue(filedName, filed.value);
    };
  };

  const filterItems = (query, item, _index, exactMatch) => {
    const normalizedTitle = item.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return normalizedTitle.indexOf(normalizedQuery) >= 0;
    }
  };

  const handleTimezoneChange = (timezone) => setTimeZone(timezone);

  return (
    <div
      className={classNames({
        'preferences__inside-content--general': true,
        preferences__loading: fetchHook.pending,
      })}
    >
      <form onSubmit={handleSubmit}>
        <FormGroup
          label={<T id={'organization_name'} />}
          inline={true}
          intent={errors.name && touched.name && Intent.DANGER}
          helperText={<ErrorMessage name="name" {...{ errors, touched }} />}
          className={'form-group--org-name'}
        >
          <InputGroup
            medium={'true'}
            intent={errors.name && touched.name && Intent.DANGER}
            {...getFieldProps('name')}
          />
        </FormGroup>

        <FormGroup
          label={<T id={'organization_industry'} />}
          inline={true}
          intent={errors.industry && touched.industry && Intent.DANGER}
          helperText={<ErrorMessage name="industry" {...{ errors, touched }} />}
          className={'form-group--org-industry'}
        >
          <InputGroup
            medium={'true'}
            intent={errors.industry && touched.industry && Intent.DANGER}
            {...getFieldProps('industry')}
          />
        </FormGroup>

        <FormGroup
          label={<T id={'business_location'} />}
          className={classNames(
            'form-group--business-location',
            'form-group--select-list',
            Classes.FILL,
          )}
          inline={true}
          helperText={<ErrorMessage name="location" {...{ errors, touched }} />}
          intent={errors.location && touched.location && Intent.DANGER}
        >
          <ListSelect
            items={businessLocation}
            noResults={<MenuItem disabled={true} text="No result." />}
            itemRenderer={businessLocationItem}
            popoverProps={{ minimal: true }}
            onItemSelect={onItemsSelect('location')}
            selectedItem={values.location}
            selectedItemProp={'value'}
            defaultText={<T id={'select_business_location'} />}
            labelProp={'name'}
          />
        </FormGroup>

        <FormGroup
          label={<T id={'base_currency'} />}
          className={classNames(
            'form-group--base-currency',
            'form-group--select-list',
            Classes.LOADING,
            Classes.FILL,
          )}
          inline={true}
          helperText={
            <ErrorMessage name="base_currency" {...{ errors, touched }} />
          }
          intent={
            errors.base_currency && touched.base_currency && Intent.DANGER
          }
        >
          <ListSelect
            items={currencies}
            noResults={<MenuItem disabled={true} text="No result." />}
            itemRenderer={currencyItem}
            popoverProps={{ minimal: true }}
            onItemSelect={onItemsSelect('base_currency')}
            itemPredicate={filterItems}
            selectedItem={values.base_currency}
            selectedItemProp={'value'}
            defaultText={<T id={'select_base_currency'} />}
            labelProp={'name'}
          />
        </FormGroup>

        <FormGroup
          label={<T id={'fiscal_year'} />}
          className={classNames(
            'form-group--fiscal-year',
            'form-group--select-list',
            Classes.FILL,
          )}
          inline={true}
          helperText={
            <ErrorMessage name="fiscal_year" {...{ errors, touched }} />
          }
          intent={errors.fiscal_year && touched.fiscal_year && Intent.DANGER}
        >
          <ListSelect
            items={fiscalYear}
            noResults={<MenuItem disabled={true} text="No result." />}
            itemRenderer={fiscalYearItem}
            popoverProps={{ minimal: true }}
            onItemSelect={onItemsSelect('fiscal_year')}
            itemPredicate={filterItems}
            selectedItem={values.fiscal_year}
            selectedItemProp={'value'}
            defaultText={<T id={'select_fiscal_year'} />}
            labelProp={'name'}
          />
        </FormGroup>

        <FormGroup
          label={<T id={'language'} />}
          inline={true}
          className={classNames(
            'form-group--language',
            'form-group--select-list',
            Classes.FILL,
          )}
          intent={errors.language && touched.language && Intent.DANGER}
          helperText={<ErrorMessage name="language" {...{ errors, touched }} />}
        >
          <ListSelect
            items={languagesDisplay}
            noResults={<MenuItem disabled={true} text="No results." />}
            itemRenderer={languageItem}
            popoverProps={{ minimal: true }}
            onItemSelect={onItemsSelect('language')}
            itemPredicate={filterItems}
            selectedItem={values.language}
            selectedItemProp={'value'}
            defaultText={<T id={'select_language'} />}
            labelProp={'name'}
          />
        </FormGroup>
        <FormGroup
          label={<T id={'time_zone'} />}
          inline={true}
          className={classNames(
            'form-group--time-zone',
            'form-group--select-list',
            Classes.FILL,
          )}
          intent={errors.time_zone && touched.time_zone && Intent.DANGER}
          helperText={
            <ErrorMessage name="time_zone" {...{ errors, touched }} />
          }
        >
          <TimezonePicker
            value={timeZone}
            onChange={handleTimezoneChange}
            valueDisplayFormat="composite"
            placeholder={<T id={'select_time_zone'} />}
          />
        </FormGroup>
        <FormGroup
          label={<T id={'date_format'} />}
          inline={true}
          className={classNames(
            'form-group--language',
            'form-group--select-list',
            Classes.FILL,
          )}
          intent={errors.date_format && touched.date_format && Intent.DANGER}
          helperText={
            <ErrorMessage name="date_format" {...{ errors, touched }} />
          }
        >
          <ListSelect
            items={dateFormat}
            noResults={<MenuItem disabled={true} text="No result." />}
            itemRenderer={date_format}
            popoverProp={{ minimal: true }}
            onItemSelect={onItemsSelect('date_format')}
            itemPredicate={filterItems}
            selectedItem={values.date_format}
            selectedItemProp={'value'}
            defaultText={<T id={'select_date_format'} />}
            labelProp={'name'}
          />
        </FormGroup>

        <div className={'preferences__floating-footer '}>
          <Button
            className={'preferences-button'}
            intent={Intent.PRIMARY}
            type="submit"
            loading={isSubmitting}
          >
            <T id={'save'} />
          </Button>
          <Button onClick={'handleClose'}>
            <T id={'close'} />
          </Button>
        </div>
      </form>
      <If condition={fetchHook.isFetching || isSubmitting}>
        <div className={'preferences__loading-overlay'}>
          <Spinner size={40} />
        </div>
      </If>
    </div>
  );
}

export default compose(
  withSettings,
  withSettingsActions,
  withDashboardActions,
)(GeneralPreferences);
