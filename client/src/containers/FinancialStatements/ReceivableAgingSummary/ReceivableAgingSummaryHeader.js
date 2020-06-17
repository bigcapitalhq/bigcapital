import React, { useCallback, useEffect } from 'react';
import { useIntl, FormattedMessage as T } from 'react-intl';
import { useFormik } from 'formik';
import { Row, Col } from 'react-grid-system';
import * as Yup from 'yup';
import {
  Intent,
  FormGroup,
  InputGroup,
  Position,
  Button,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import moment from 'moment';
import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import { ErrorMessage, FieldHint, FieldRequiredHint } from 'components';
import { momentFormatter } from 'utils';

import withReceivableAging from './withReceivableAgingSummary';
import withReceivableAgingActions from './withReceivableAgingSummaryActions';

import { compose } from 'utils';


function ReceivableAgingSummaryHeader({
  pageFilter,
  onSubmitFilter,
  receivableAgingFilter,

  // #withReceivableAgingSummary
  receivableAgingRefresh,

  // #withReceivableAgingSummaryActions
  refreshReceivableAgingSummary
}) {
  const { formatMessage } = useIntl();

  const {
    values,
    errors,
    touched,
    setFieldValue,
    getFieldProps,
    submitForm,
    isSubmitting,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      as_date: moment(pageFilter.as_date).toDate(),
      aging_before_days: 30,
      aging_periods: 3,
    },
    validationSchema: Yup.object().shape({
      as_date: Yup.date().required().label('as_date'),
      aging_before_days: Yup.number()
        .required()
        .integer()
        .positive()
        .label('aging_before_days'),
      aging_periods: Yup.number()
        .required()
        .integer()
        .positive()
        .label('aging_periods'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      onSubmitFilter(values);
      setSubmitting(false);
    },
  });

  const handleDateChange = useCallback(
    (name) => (date) => {
      setFieldValue(name, date);
    },
    [],
  );

  // Handle submit filter submit button.
  useEffect(() => {
    if (receivableAgingRefresh) {
      submitForm();
      refreshReceivableAgingSummary(false);
    }
  }, [submitForm, receivableAgingRefresh]);

  return (
    <FinancialStatementHeader show={receivableAgingFilter}>
      <Row>
        <Col width={260}>
          <FormGroup
            label={formatMessage({ id: 'as_date' })}
            labelInfo={<FieldHint />}
            fill={true}
            intent={errors.as_date && Intent.DANGER}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={values.as_date}
              onChange={handleDateChange('as_date')}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              minimal={true}
              fill={true}
            />
          </FormGroup>
        </Col>

        <Col width={260}>
          <FormGroup
            label={<T id={'aging_before_days'} />}
            labelInfo={<FieldHint />}
            className={'form-group--aging-before-days'}
            intent={errors.aging_before_days && Intent.DANGER}
          >
            <InputGroup
              medium={true}
              intent={errors.aging_before_days && Intent.DANGER}
              {...getFieldProps('aging_before_days')}
            />
          </FormGroup>
        </Col>

        <Col width={260}>
          <FormGroup
            label={<T id={'aging_periods'} />}
            labelInfo={<FieldHint />}
            className={'form-group--aging-periods'}
            intent={errors.aging_before_days && Intent.DANGER}
          >
            <InputGroup
              medium={true}
              intent={errors.aging_before_days && Intent.DANGER}
              {...getFieldProps('aging_periods')}
            />
          </FormGroup>
        </Col>
      </Row>
    </FinancialStatementHeader>
  );
}

export default compose(
  withReceivableAgingActions,
  withReceivableAging(({ receivableAgingSummaryFilter, receivableAgingSummaryRefresh }) => ({
    receivableAgingFilter: receivableAgingSummaryFilter,
    receivableAgingRefresh: receivableAgingSummaryRefresh
  })),
)(ReceivableAgingSummaryHeader);
