import React, { useMemo, useCallback } from 'react';
import {
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
} from '@blueprintjs/core';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';
import { useFormik } from 'formik';
import { useQuery } from 'react-query';
import { connect } from 'react-redux';

import { compose } from 'utils';
import Dialog from 'components/Dialog';

import AppToaster from 'components/AppToaster';
import DialogConnect from 'connectors/Dialog.connector';
import DialogReduxConnect from 'components/DialogReduxConnect';
import withCurrency from 'containers/Currencies/withCurrency';
import withCurrenciesActions from 'containers/Currencies/withCurrenciesActions';

import ErrorMessage from 'components/ErrorMessage';
import classNames from 'classnames';
import { pick } from 'lodash';
import { getDialogPayload } from 'store/dashboard/dashboard.reducer';


function CurrencyDialog({
  name,
  payload,
  isOpen,

  // #withDialog
  closeDialog,

  // #withCurrency
  currencyCode,
  currency,

  // #wihtCurrenciesActions
  requestFetchCurrencies,
  requestSubmitCurrencies,
  requestEditCurrency,
}) {
  const intl = useIntl();

  const ValidationSchema = Yup.object().shape({
    currency_name: Yup.string().required(
      intl.formatMessage({ id: 'required' })
    ),
    currency_code: Yup.string()
      .max(4)
      .required(intl.formatMessage({ id: 'required' })),
  });
  const initialValues = useMemo(() => ({
    currency_name: '',
    currency_code: '',
  }), []);

  const {
    values, 
    errors,
    touched,
    setFieldValue,
    getFieldProps,
    isSubmitting,
    handleSubmit,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...(payload.action === 'edit' &&
        pick(currency, Object.keys(initialValues))),
    },
    validationSchema: ValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      if (payload.action === 'edit') {
        requestEditCurrency(currency.id, values).then((response) => {
          closeDialog(name);
          AppToaster.show({
            message: 'the_currency_has_been_edited',
            intent: Intent.SUCCESS,
          });
          setSubmitting(false);
        })
        .catch((error) => {
          setSubmitting(false);
        });
      } else {
        requestSubmitCurrencies(values).then((response) => {
          closeDialog(name);
          AppToaster.show({
            message: 'the_currency_has_been_submit',
            intent: Intent.SUCCESS,
          });
          setSubmitting(false);
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

  const fetchCurrencies = useQuery('currencies',
    () => { requestFetchCurrencies(); },
    { manual: true });

  const onDialogOpening = useCallback(() => {
    fetchCurrencies.refetch();
  }, [fetchCurrencies]);

  const onDialogClosed = useCallback(() => {
    resetForm();
    closeDialog(name);
  }, [closeDialog, name]);

  const requiredSpan = useMemo(() => <span className={'required'}>*</span>, []);

  return (
    <Dialog
      name={name}
      title={payload.action === 'edit' ? 'Edit Currency' : ' New Currency'}
      className={classNames(
        {
          'dialog--loading': fetchCurrencies.isFetching,
        },
        'dialog--currency-form'
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
            label={'Currency Name'}
            labelInfo={requiredSpan}
            className={'form-group--currency-name'}
            intent={(errors.currency_name && touched.currency_name) && Intent.DANGER}
            helperText={<ErrorMessage name='currency_name' {...{errors, touched}} />}
            inline={true}
          >
            <InputGroup
              medium={true}
              intent={(errors.currency_name && touched.currency_name) && Intent.DANGER}
              {...getFieldProps('currency_name')}
            />
          </FormGroup>

          <FormGroup
            label={'Currency Code'}
            labelInfo={requiredSpan}
            className={'form-group--currency-code'}
            intent={(errors.currency_code && touched.currency_code) && Intent.DANGER}
            helperText={<ErrorMessage name='currency_code' {...{errors, touched}} />}
            inline={true}
          >
            <InputGroup
              medium={true}
              intent={(errors.currency_code && touched.currency_code) && Intent.DANGER}
              {...getFieldProps('currency_code')}
            />
          </FormGroup>
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={handleClose}>Close</Button>
            <Button intent={Intent.PRIMARY} type='submit' disabled={isSubmitting}>
              {payload.action === 'edit' ? 'Edit' : 'Submit'}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}

const mapStateToProps = (state, props) => {
  const dialogPayload = getDialogPayload(state, 'currency-form');

  return {
    name: 'currency-form',
    payload: { action: 'new', currencyCode: null, ...dialogPayload },
    currencyCode: dialogPayload?.currencyCode || null,
  }
}

const withCurrencyFormDialog = connect(mapStateToProps);

export default compose(
  withCurrencyFormDialog,
  DialogConnect,
  DialogReduxConnect,
  withCurrenciesActions,
  withCurrency,
)(CurrencyDialog);
