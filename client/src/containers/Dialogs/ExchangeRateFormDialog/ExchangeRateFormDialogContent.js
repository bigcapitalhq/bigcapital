import React, { useState, useMemo, useCallback } from 'react';
import {
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
  Position,
} from '@blueprintjs/core';
import { pick } from 'lodash';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useQuery, queryCache } from 'react-query';
import moment from 'moment';
import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { momentFormatter, tansformDateValue } from 'utils';
import {
  AppToaster,
  ErrorMessage,
  DialogContent,
  FieldRequiredHint,
  CurrencySelectList,
} from 'components';
import classNames from 'classnames';
import withExchangeRateDetail from 'containers/ExchangeRates/withExchangeRateDetail';
import withExchangeRatesActions from 'containers/ExchangeRates/withExchangeRatesActions';

import withCurrencies from 'containers/Currencies/withCurrencies';
import withCurrenciesActions from 'containers/Currencies/withCurrenciesActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

import 'style/pages/ExchangeRate/ExchangeRateDialog.scss';

/**
 * Exchange rate form content.
 */
function ExchangeRateFormDialogContent({
  // #withDialogActions
  closeDialog,

  // #withCurrencies
  currenciesList,

  //#WithExchangeRateDetail
  exchangeRate,

  // #withExchangeRatesActions
  requestSubmitExchangeRate,
  requestEditExchangeRate,

  // #wihtCurrenciesActions
  requestFetchCurrencies,

  // #ownProp
  action,
  exchangeRateId,
  dialogName,
}) {
  const { formatMessage } = useIntl();
  const [selectedItems, setSelectedItems] = useState({});

  const fetchCurrencies = useQuery(
    'currencies',
    () => requestFetchCurrencies(),
    { enabled: true },
  );

  const validationSchema = Yup.object().shape({
    exchange_rate: Yup.number()
      .required()
      .label(formatMessage({ id: 'exchange_rate_' })),
    currency_code: Yup.string()
      .max(3)
      .required(formatMessage({ id: 'currency_code_' })),
    date: Yup.date()
      .required()
      .label(formatMessage({ id: 'date' })),
  });

  const initialValues = useMemo(
    () => ({
      exchange_rate: '',
      currency_code: '',
      date: moment(new Date()).format('YYYY-MM-DD'),
    }),
    [],
  );

  const {
    values,
    touched,
    errors,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...initialValues,
      ...(action === 'edit' && pick(exchangeRate, Object.keys(initialValues))),
    },
    onSubmit: (values, { setSubmitting, setErrors }) => {
      if (action === 'edit') {
        requestEditExchangeRate(exchangeRateId, values)
          .then((response) => {
            closeDialog(dialogName);
            AppToaster.show({
              message: formatMessage({
                id: 'the_exchange_rate_has_been_edited_successfully',
              }),
              intent: Intent.SUCCESS,
            });
            setSubmitting(false);
            queryCache.invalidateQueries('exchange-rates-table');
          })
          .catch((error) => {
            setSubmitting(false);
          });
      } else {
        requestSubmitExchangeRate(values)
          .then((response) => {
            closeDialog(dialogName);
            AppToaster.show({
              message: formatMessage({
                id: 'the_exchange_rate_has_been_created_successfully',
              }),
              intent: Intent.SUCCESS,
            });
            setSubmitting(false);
            queryCache.invalidateQueries('exchange-rates-table');
          })
          .catch((errors) => {
            if (
              errors.find((e) => e.type === 'EXCHANGE.RATE.DATE.PERIOD.DEFINED')
            ) {
              setErrors({
                exchange_rate: formatMessage({
                  id:
                    'there_is_exchange_rate_in_this_date_with_the_same_currency',
                }),
              });
            }
          });
      }
    },
  });

  const handleClose = useCallback(() => {
    closeDialog(dialogName);
    resetForm();
  }, [dialogName, closeDialog]);

  const handleDateChange = useCallback(
    (date_filed) => (date) => {
      const formatted = moment(date).format('YYYY-MM-DD');
      setFieldValue(date_filed, formatted);
    },
    [setFieldValue],
  );

  const onItemsSelect = useCallback(
    (filedName) => {
      return (filed) => {
        setSelectedItems({
          ...selectedItems,
          [filedName]: filed,
        });
        setFieldValue(filedName, filed.currency_code);
      };
    },
    [setFieldValue, selectedItems],
  );
  return (
    <DialogContent isLoading={fetchCurrencies.isFetching}>
      <form onSubmit={handleSubmit}>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup
            label={<T id={'date'} />}
            inline={true}
            labelInfo={FieldRequiredHint}
            intent={errors.date && touched.date && Intent.DANGER}
            helperText={<ErrorMessage name="date" {...{ errors, touched }} />}
          >
            <DateInput
              fill={true}
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(values.date)}
              onChange={handleDateChange('date')}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              disabled={action === 'edit'}
            />
          </FormGroup>
          <FormGroup
            label={<T id={'currency_code'} />}
            labelInfo={FieldRequiredHint}
            className={classNames('form-group--select-list', Classes.FILL)}
            inline={true}
            intent={
              errors.currency_code && touched.currency_code && Intent.DANGER
            }
            helperText={
              <ErrorMessage name="currency_code" {...{ errors, touched }} />
            }
          >
            <CurrencySelectList
              currenciesList={currenciesList}
              selectedCurrencyCode={values.currency_code}
              onCurrencySelected={onItemsSelect('currency_code')}
              disabled={action === 'edit'}
            />
          </FormGroup>
          <FormGroup
            label={<T id={'exchange_rate'} />}
            labelInfo={FieldRequiredHint}
            intent={
              errors.exchange_rate && touched.exchange_rate && Intent.DANGER
            }
            helperText={
              <ErrorMessage name="exchange_rate" {...{ errors, touched }} />
            }
            inline={true}
          >
            <InputGroup
              medium={true}
              intent={
                errors.exchange_rate && touched.exchange_rate && Intent.DANGER
              }
              {...getFieldProps('exchange_rate')}
            />
          </FormGroup>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={handleClose}>
              <T id={'close'} />
            </Button>
            <Button
              intent={Intent.PRIMARY}
              type="submit"
              disabled={isSubmitting}
            >
              {action === 'edit' ? <T id={'edit'} /> : <T id={'submit'} />}
            </Button>
          </div>
        </div>
      </form>
    </DialogContent>
  );
}

export default compose(
  withDialogActions,
  withExchangeRatesActions,
  withExchangeRateDetail,
  withCurrenciesActions,
  withCurrencies(({ currenciesList }) => ({ currenciesList })),
)(ExchangeRateFormDialogContent);
