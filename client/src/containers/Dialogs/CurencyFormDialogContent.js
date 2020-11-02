import React, { useMemo, useCallback } from 'react';
import {
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
} from '@blueprintjs/core';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useQuery, queryCache } from 'react-query';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { pick } from 'lodash';
import classNames from 'classnames';
import {
  If,
  ErrorMessage,
  AppToaster,
  FieldRequiredHint,
  DialogContent,
} from 'components';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withCurrencyDetail from 'containers/Currencies/withCurrencyDetail';
import withCurrenciesActions from 'containers/Currencies/withCurrenciesActions';

import { compose } from 'utils';

function CurencyFormDialogContent({
  // #withCurrencyDetail
  currency,

  // #wihtCurrenciesActions
  requestFetchCurrencies,
  requestSubmitCurrencies,
  requestEditCurrency,

  // #withDialogActions
  closeDialog,

  // #ownProp
  action,
  currencyId,
  dialogName,
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
    values,
    errors,
    touched,
    isSubmitting,
    getFieldProps,
    handleSubmit,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...(action === 'edit' && pick(currency, Object.keys(initialValues))),
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      if (action === 'edit') {
        requestEditCurrency(currency.id, values)
          .then((response) => {
            closeDialog(dialogName);
            AppToaster.show({
              message: formatMessage({
                id: 'the_currency_has_been_successfully_edited',
              }),
              intent: Intent.SUCCESS,
            });
            setSubmitting(false);
            queryCache.invalidateQueries('currencies');
          })
          .catch((error) => {
            setSubmitting(false);
          });
      } else {
        requestSubmitCurrencies(values)
          .then((response) => {
            closeDialog(dialogName);
            AppToaster.show({
              message: formatMessage({
                id: 'the_currency_has_been_successfully_created',
              }),
              intent: Intent.SUCCESS,
            });
            setSubmitting(false);
            queryCache.invalidateQueries('currencies');
          })
          .catch((error) => {
            setSubmitting(false);
          });
      }
    },
  });
  const handleClose = useCallback(() => {
    closeDialog(dialogName);
  }, [dialogName, closeDialog]);

  const onDialogOpening = useCallback(() => {
    fetchCurrencies.refetch();
  }, [fetchCurrencies]);

  const onDialogClosed = useCallback(() => {
    resetForm();
    closeDialog(dialogName);
  }, [closeDialog, dialogName, resetForm]);

  return (
    <DialogContent isLoading={fetchCurrencies.isFetching}>
      <form onSubmit={handleSubmit}>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup
            label={<T id={'currency_name'} />}
            labelInfo={FieldRequiredHint}
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
            labelInfo={FieldRequiredHint}
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
              {action === 'edit' ? <T id={'edit'} /> : <T id={'submit'} />}
            </Button>
          </div>
        </div>
      </form>
    </DialogContent>
  );
}

export default compose(
  withCurrencyDetail,
  withDialogActions,
  withCurrenciesActions,
)(CurencyFormDialogContent);
