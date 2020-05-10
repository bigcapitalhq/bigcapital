import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
  Position,
  MenuItem,
} from '@blueprintjs/core';
import { pick } from 'lodash';
import * as Yup from 'yup';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { useFormik } from 'formik';
import Dialog from 'components/Dialog';

import { useQuery, queryCache } from 'react-query';
import AppToaster from 'components/AppToaster';
import ErrorMessage from 'components/ErrorMessage';
import classNames from 'classnames';
import { Select } from '@blueprintjs/select';
import moment from 'moment';
import { DateInput } from '@blueprintjs/datetime';
import { momentFormatter } from 'utils';
import ExchangeRatesDialogConnect from 'connectors/ExchangeRatesFromDialog.connect';

function ExchangeRateDialog({
  name,
  payload,
  isOpen,

  openDialog,
  closeDialog,
  currencies,

  requestSubmitExchangeRate,
  requestFetchExchangeRates,
  requestEditExchangeRate,
  requestFetchCurrencies,
  editExchangeRate,
  addExchangeRatesTableQueries,
}) {
  const {formatMessage} = useIntl();

  const [selectedItems, setSelectedItems] = useState({});

  const validationSchema = Yup.object().shape({
    exchange_rate: Yup.number().required(
      formatMessage({ id: 'required' })
    ),
    currency_code: Yup.string()
      .max(3)
      .required(formatMessage({ id: 'required' })),
    date: Yup.date().required(formatMessage({ id: 'required' })),
  });

  const initialValues = useMemo(
    () => ({
      exchange_rate: '',
      currency_code: '',
      date: moment(new Date()).format('YYYY-MM-DD'),
    }),
    []
  );

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...(payload.action === 'edit' &&
        pick(editExchangeRate, Object.keys(initialValues))),
    },
    onSubmit: (values, { setSubmitting }) => {
      if (payload.action === 'edit') {
        requestEditExchangeRate(payload.id, values)
          .then((response) => {
            closeDialog(name);
            AppToaster.show({
              message: 'the_exchange_rate_has_been_edited',
            });
            setSubmitting(false);
          })
          .catch((error) => {
            setSubmitting(false);
          });
      } else {
        requestSubmitExchangeRate(values)
          .then((response) => {
            closeDialog(name);
            AppToaster.show({
              message: 'the_exchangeRate_has_been_submit',
            });
            setSubmitting(false);
          })
          .catch((error) => {
            setSubmitting(false);
          });
      }
    },
  });

  const { values, errors, touched } = useMemo(() => formik, [formik]);

  const requiredSpan = useMemo(() => <span class='required'>*</span>, []);

  const handleClose = useCallback(() => {
    closeDialog(name);
  }, [name, closeDialog]);

  const fetchHook = useQuery('exchange-rates-dialog', () => {
    return Promise.all([requestFetchExchangeRates(), requestFetchCurrencies()]);
  });

  const onDialogClosed = useCallback(() => {
    formik.resetForm();
    closeDialog(name);
  }, [formik, closeDialog, name]);

  const onDialogOpening = useCallback(() => {
    fetchHook.refetch();
  }, [fetchHook]);

  const handleDateChange = useCallback(
    (date) => {
      const formatted = moment(date).format('YYYY-MM-DD');
      formik.setFieldValue('date', formatted);
    },
    [formik.setFieldValue]
  );

  const onItemsSelect = useCallback(
    (filedName) => {
      return (filed) => {
        setSelectedItems({
          ...selectedItems,
          [filedName]: filed,
        });
        formik.setFieldValue(filedName, filed.currency_code);
      };
    },
    [formik.setFieldValue, selectedItems]
  );

  const filterCurrencyCode = (query, currency_code, _index, exactMatch) => {
    const normalizedTitle = currency_code.currency_code.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return (
        `${currency_code.currency_code} ${normalizedTitle}`.indexOf(
          normalizedQuery
        ) >= 0
      );
    }
  };

  const currencyCodeRenderer = useCallback((CurrencyCode, { handleClick }) => {
    return (
      <MenuItem
        className={'exchangeRate-menu'}
        key={CurrencyCode.id}
        text={CurrencyCode.currency_code}
        onClick={handleClick}
      />
    );
  }, []);

  const getSelectedItemLabel = useCallback(
    (fieldName, defaultLabel) => {
      return typeof selectedItems[fieldName] !== 'undefined'
        ? selectedItems[fieldName].currency_code
        : defaultLabel;
    },
    [selectedItems]
  );

  return (
    <Dialog
      name={name}
      title={
        payload.action === 'edit' ?  <T id={'edit_exchange_rate'}/> : <T id={'new_exchange_rate'}/>

      }
      className={classNames(
        {
          'dialog--loading': fetchHook.pending,
        },
        'dialog--exchangeRate-form'
      )}
      isOpen={isOpen}
      onClosed={onDialogClosed}
      onOpening={onDialogOpening}
      isLoading={fetchHook.pending}
      onClose={handleClose}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup
            label={<T id={'date'}/>}
            inline={true}
            labelInfo={requiredSpan}
            intent={errors.date && touched.date && Intent.DANGER}
            helperText={<ErrorMessage name='date' {...formik} />}
          >
            <DateInput
              fill={true}
              {...momentFormatter('YYYY-MM-DD')}
              defaultValue={new Date()}
              onChange={handleDateChange}
              popoverProps={{ position: Position.BOTTOM }}
              // disabled={payload.action === 'edit'}
            />
          </FormGroup>

          <FormGroup
            label={<T id={'exchange_rate'}/>}
            labelInfo={requiredSpan}
            intent={
              errors.exchange_rate && touched.exchange_rate && Intent.DANGER
            }
            helperText={<ErrorMessage name='exchange_rate' {...formik} />}
            inline={true}
          >
            <InputGroup
              medium={true}
              intent={
                errors.exchange_rate && touched.exchange_rate && Intent.DANGER
              }
              {...formik.getFieldProps('exchange_rate')}
            />
          </FormGroup>

          <FormGroup
            label={<T id={'currency_code'}/>}
            labelInfo={requiredSpan}
            className={classNames(
              'form-group--select-list',

              Classes.FILL
            )}
            inline={true}
            intent={
              errors.currency_code && touched.currency_code && Intent.DANGER
            }
            helperText={<ErrorMessage name='currency_code' {...formik} />}
          >
            <Select
              items={Object.values(currencies)}
              noResults={<MenuItem disabled={true} text='No results.' />}
              itemRenderer={currencyCodeRenderer}
              itemPredicate={filterCurrencyCode}
              popoverProps={{ minimal: true }}
              onItemSelect={onItemsSelect('currency_code')}
            >
              <Button
                rightIcon='caret-down'
                fill={true}
                text={getSelectedItemLabel(
                  'currency_code',
                  'select Currency Code'
                )}
                // disabled={payload.action === 'edit'}
              />
            </Select>
          </FormGroup>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={handleClose}><T id={'close'}/></Button>
            <Button intent={Intent.PRIMARY} type='submit'>
            {payload.action === 'edit' ? <T id={'edit'}/> : <T id={'submit'}/>}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}

export default ExchangeRatesDialogConnect(ExchangeRateDialog);
