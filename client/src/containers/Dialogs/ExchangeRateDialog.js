import React, { useState, useMemo, useCallback } from 'react';
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
import { useQuery, queryCache } from 'react-query';
import moment from 'moment';
import { DateInput } from '@blueprintjs/datetime';
import { momentFormatter } from 'utils';
import { 
  AppToaster,
  Dialog,
  ErrorMessage,
  ListSelect,
} from 'components';
import classNames from 'classnames';
import withExchangeRatesDialog from './ExchangeRateDialog.container';

/**
 * Exchange rate dialog.
 */
function ExchangeRateDialog({
  dialogName,
  payload = {},
  isOpen,

  // #withDialog
  closeDialog,

  // #withCurrencies
  currenciesList,

  // #withExchangeRatesActions
  requestSubmitExchangeRate,
  requestFetchExchangeRates,
  requestEditExchangeRate,
  requestFetchCurrencies,
  editExchangeRate,
}) {
  const { formatMessage } = useIntl();
  const [selectedItems, setSelectedItems] = useState({});

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

  const fetchExchangeRatesDialog = useQuery(
    'exchange-rates-dialog',
    () => requestFetchExchangeRates(),
    { manual: true },
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
      ...(payload.action === 'edit' &&
        pick(editExchangeRate, Object.keys(initialValues))),
    },
    onSubmit: (values, { setSubmitting, setErrors }) => {
      if (payload.action === 'edit') {
        requestEditExchangeRate(payload.id, values)
          .then((response) => {
            closeDialog(dialogName);
            AppToaster.show({
              message: formatMessage({
                id: 'the_exchange_rate_has_been_successfully_edited',
              }),
              intent: Intent.SUCCESS,
            });
            setSubmitting(false);
            queryCache.invalidateQueries('exchange-rates-dialog');
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
                id: 'the_exchange_rate_has_been_successfully_created',
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

  const requiredSpan = useMemo(() => <span class="required">*</span>, []);

  const handleClose = useCallback(() => {
    closeDialog(dialogName);
  }, [dialogName, closeDialog]);

  const onDialogClosed = useCallback(() => {
    resetForm();
    closeDialog(dialogName);
  }, [closeDialog, dialogName, resetForm]);

  const onDialogOpening = useCallback(() => {
    fetchExchangeRatesDialog.refetch();
  }, [fetchExchangeRatesDialog]);

  const handleDateChange = useCallback(
    (date) => {
      const formatted = moment(date).format('YYYY-MM-DD');
      setFieldValue('date', formatted);
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

  const filterCurrencyCode = (query, currency, _index, exactMatch) => {
    const normalizedTitle = currency.currency_code.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return (
        `${currency.currency_code} ${normalizedTitle}`.indexOf(
          normalizedQuery,
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

  return (
    <Dialog
      name={dialogName}
      title={
        payload.action === 'edit' ? (
          <T id={'edit_exchange_rate'} />
        ) : (
          <T id={'new_exchange_rate'} />
        )
      }
      className={classNames(
        { 'dialog--loading': fetchExchangeRatesDialog.isFetching },
        'dialog--exchangeRate-form',
      )}
      isOpen={isOpen}
      onClosed={onDialogClosed}
      onOpening={onDialogOpening}
      isLoading={fetchExchangeRatesDialog.isFetching}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit}>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup
            label={<T id={'date'} />}
            inline={true}
            labelInfo={requiredSpan}
            intent={errors.date && touched.date && Intent.DANGER}
            helperText={<ErrorMessage name="date" {...{ errors, touched }} />}
          >
            <DateInput
              fill={true}
              {...momentFormatter('YYYY-MM-DD')}
              defaultValue={new Date()}
              onChange={handleDateChange}
              popoverProps={{ position: Position.BOTTOM }}
              disabled={payload.action === 'edit'}
            />
          </FormGroup>

          <FormGroup
            label={<T id={'exchange_rate'} />}
            labelInfo={requiredSpan}
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

          <FormGroup
            label={<T id={'currency_code'} />}
            labelInfo={requiredSpan}
            className={classNames('form-group--select-list', Classes.FILL)}
            inline={true}
            intent={
              errors.currency_code && touched.currency_code && Intent.DANGER
            }
            helperText={
              <ErrorMessage name="currency_code" {...{ errors, touched }} />
            }
          >
            <ListSelect
              items={currenciesList}
              noResults={<MenuItem disabled={true} text="No results." />}
              itemRenderer={currencyCodeRenderer}
              itemPredicate={filterCurrencyCode}
              popoverProps={{ minimal: true }}
              onItemSelect={onItemsSelect('currency_code')}
              selectedItem={values.currency_code}
              selectedItemProp={'currency_code'}
              defaultText={<T id={'select_currency_code'} />}
              labelProp={'currency_code'}
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
              {payload.action === 'edit' ? (
                <T id={'edit'} />
              ) : (
                <T id={'submit'} />
              )}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}

export default withExchangeRatesDialog(ExchangeRateDialog);
