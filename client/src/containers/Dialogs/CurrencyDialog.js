import React, { useMemo, useCallback } from 'react';
import {
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
} from '@blueprintjs/core';
import * as Yup from 'yup';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { useFormik } from 'formik';
import { useQuery, queryCache } from 'react-query';
import { connect } from 'react-redux';
import { pick } from 'lodash';

import AppToaster from 'components/AppToaster';
import Dialog from 'components/Dialog';
import withDialogRedux from 'components/DialogReduxConnect';
import ErrorMessage from 'components/ErrorMessage';
import classNames from 'classnames';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { getDialogPayload } from 'store/dashboard/dashboard.reducer';

import withCurrency from 'containers/Currencies/withCurrency';
import withCurrenciesActions from 'containers/Currencies/withCurrenciesActions';

import { compose } from 'utils';

function CurrencyDialog({
  name,
  payload,
  isOpen,

  // #withDialogActions
  closeDialog,

  // #withCurrency
  currencyCode,
  currency,

  // #wihtCurrenciesActions
  requestFetchCurrencies,
  requestSubmitCurrencies,
  requestEditCurrency,
}) {
  const { formatMessage } = useIntl();
  const fetchCurrencies = useQuery('currencies', () =>
    requestFetchCurrencies(),
  );

  const validationSchema = Yup.object().shape({
    currency_name: Yup.string()
      .required()
      .label(formatMessage({ id: 'currency_name_' })),
    currency_code: Yup.string()
      .max(4)
      .required()
      .label(formatMessage({ id: 'currency_code_' })),
  });
  const initialValues = useMemo(
    () => ({
      currency_name: '',
      currency_code: '',
    }),
    [],
  );

  const {
    errors,
    touched,
    isSubmitting,
    getFieldProps,
    handleSubmit,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...(payload.action === 'edit' &&
        pick(currency, Object.keys(initialValues))),
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      if (payload.action === 'edit') {
        requestEditCurrency(currency.id, values)
          .then((response) => {
            closeDialog(name);
            AppToaster.show({
              message: formatMessage({
                id: 'the_currency_has_been_successfully_edited',
              }),
              intent: Intent.SUCCESS,
            });
            setSubmitting(false);
            queryCache.refetchQueries('currencies', { force: true });
          })
          .catch((error) => {
            setSubmitting(false);
          });
      } else {
        requestSubmitCurrencies(values)
          .then((response) => {
            closeDialog(name);
            AppToaster.show({
              message: formatMessage({
                id: 'the_currency_has_been_successfully_created',
              }),
              intent: Intent.SUCCESS,
            });
            setSubmitting(false);
            queryCache.refetchQueries('currencies', { force: true });
          })
          .catch((error) => {
            setSubmitting(false);
          });
      }
    },
  });

  const handleClose = useCallback(() => {
    closeDialog(name);
  }, [name, closeDialog]);

  const onDialogOpening = useCallback(() => {
    fetchCurrencies.refetch();
  }, [fetchCurrencies]);

  const onDialogClosed = useCallback(() => {
    resetForm();
    closeDialog(name);
  }, [closeDialog, name, resetForm]);

  const requiredSpan = useMemo(() => <span className={'required'}>*</span>, []);

  return (
    <Dialog
      name={name}
      title={
        payload.action === 'edit' ? (
          <T id={'edit_currency'} />
        ) : (
          <T id={'new_currency'} />
        )
      }
      className={classNames(
        {
          'dialog--loading': fetchCurrencies.isFetching,
        },
        'dialog--currency-form',
      )}
      isOpen={isOpen}
      onClosed={onDialogClosed}
      onOpening={onDialogOpening}
      isLoading={fetchCurrencies.isFetching}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit}>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup
            label={<T id={'currency_name'} />}
            labelInfo={requiredSpan}
            className={'form-group--currency-name'}
            intent={
              errors.currency_name && touched.currency_name && Intent.DANGER
            }
            helperText={
              <ErrorMessage name="currency_name" {...{ errors, touched }} />
            }
            inline={true}
          >
            <InputGroup
              medium={true}
              intent={
                errors.currency_name && touched.currency_name && Intent.DANGER
              }
              {...getFieldProps('currency_name')}
            />
          </FormGroup>

          <FormGroup
            label={<T id={'currency_code'} />}
            labelInfo={requiredSpan}
            className={'form-group--currency-code'}
            intent={
              errors.currency_code && touched.currency_code && Intent.DANGER
            }
            helperText={
              <ErrorMessage name="currency_code" {...{ errors, touched }} />
            }
            inline={true}
          >
            <InputGroup
              medium={true}
              intent={
                errors.currency_code && touched.currency_code && Intent.DANGER
              }
              {...getFieldProps('currency_code')}
            />
          </FormGroup>
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={handleClose}>
              <T id={'cancel'} />
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

const mapStateToProps = (state, props) => ({
  dialogName: 'currency-form',
});

const withCurrencyFormDialog = connect(mapStateToProps);

export default compose(
  withCurrencyFormDialog,
  withDialogRedux(null, 'currency-form'),
  withCurrency,
  withDialogActions,
  withCurrenciesActions,
)(CurrencyDialog);
