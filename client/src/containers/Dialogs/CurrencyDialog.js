import React, { useState, useMemo, useCallback } from 'react';
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
import { compose } from 'utils';
import Dialog from 'components/Dialog';
import useAsync from 'hooks/async';
import AppToaster from 'components/AppToaster';
import DialogConnect from 'connectors/Dialog.connector';
import DialogReduxConnect from 'components/DialogReduxConnect';
import CurrencyFromDialogConnect from 'connectors/CurrencyFromDialog.connect';
import ErrorMessage from 'components/ErrorMessage';
import classNames from 'classnames';
import { pick } from 'lodash';

function CurrencyDialog({
  name,
  payload,
  isOpen,
  closeDialog,
  requestFetchCurrencies,
  requestSubmitCurrencies,
  requestEditCurrency,
  editCurrency,
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
  const initialValues = useMemo(
    () => ({
      currency_name: '',
      currency_code: '',
    }),
    []
  );

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      ...(payload.action === 'edit' &&
        pick(editCurrency, Object.keys(initialValues))),
    },

    validationSchema: ValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      if (payload.action === 'edit') {
        requestEditCurrency(editCurrency.id, values)
          .then((response) => {
            closeDialog(name);
            AppToaster.show({
              message: 'the_currency_has_been_edited',
            });
            setSubmitting(false);
          })
          .catch((error) => {
            setSubmitting(false);
          });
      } else {
        requestSubmitCurrencies(values)
          .then((response) => {
            closeDialog(name);
            AppToaster.show({
              message: 'the_currency_has_been_submit',
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

  const handleClose = useCallback(() => {
    closeDialog(name);
  }, [name, closeDialog]);

  const fetchHook = useAsync(async () => {
    await Promise.all([requestFetchCurrencies()]);
  });

  const onDialogOpening = useCallback(() => {
    fetchHook.execute();
  }, [fetchHook]);

  const onDialogClosed = useCallback(() => {
    formik.resetForm();
    closeDialog(name);
  }, [formik, closeDialog, name]);

  const requiredSpan = useMemo(() => <span className={'required'}>*</span>, []);

  return (
    <Dialog
      name={name}
      title={payload.action === 'edit' ? 'Edit Currency' : ' New Currency'}
      className={classNames(
        {
          'dialog--loading': fetchHook.pending,
        },
        'dialog--currency-form'
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
            label={'Currency Name'}
            labelInfo={requiredSpan}
            className={'form-group--currency-name'}
            intent={
              errors.currency_name && touched.currency_name && Intent.DANGER
            }
            helperText={<ErrorMessage name='currency_name' {...formik} />}
            inline={true}
          >
            <InputGroup
              medium={true}
              intent={
                errors.currency_name && touched.currency_name && Intent.DANGER
              }
              {...formik.getFieldProps('currency_name')}
            />
          </FormGroup>
          <FormGroup
            label={'Currency Code'}
            labelInfo={requiredSpan}
            className={'form-group--currency-code'}
            intent={
              errors.currency_code && touched.currency_code && Intent.DANGER
            }
            helperText={<ErrorMessage name='currency_code' {...formik} />}
            inline={true}
          >
            <InputGroup
              medium={true}
              intent={
                errors.currency_code && touched.currency_code && Intent.DANGER
              }
              {...formik.getFieldProps('currency_code')}
            />
          </FormGroup>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={handleClose}>Close</Button>
            <Button intent={Intent.PRIMARY} type='submit'>
              {payload.action === 'edit' ? 'Edit' : 'Submit'}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}

export default compose(
  CurrencyFromDialogConnect,
  DialogConnect,
  DialogReduxConnect
)(CurrencyDialog);
