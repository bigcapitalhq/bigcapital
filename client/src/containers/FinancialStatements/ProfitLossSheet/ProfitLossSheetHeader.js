import React, { useCallback } from 'react';
import { Row, Col } from 'react-grid-system';
import {
  Button,
} from '@blueprintjs/core';
import moment from 'moment';
import { useFormik } from 'formik';
import { FormattedMessage as T, useIntl } from 'react-intl';
import * as Yup from 'yup';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import SelectsListColumnsBy from '../SelectDisplayColumnsBy';
import RadiosAccountingBasis from '../RadiosAccountingBasis';


export default function JournalHeader({
  pageFilter,
  onSubmitFilter,
}) {
  const { formatMessage } = useIntl();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...pageFilter,
      from_date: moment(pageFilter.from_date).toDate(),
      to_date: moment(pageFilter.to_date).toDate()
    },
    validationSchema: Yup.object().shape({
      from_date: Yup.date().required().label(formatMessage({id:'from_date'})),
      to_date: Yup.date().min(Yup.ref('from_date')).required().label(formatMessage({id:'to_date'})),
    }),
    onSubmit: (values, actions) => {
      onSubmitFilter(values);
      actions.setSubmitting(false);
    },
  });

  // Handle item select of `display columns by` field.
  const handleItemSelectDisplayColumns = useCallback((item) => {
    formik.setFieldValue('display_columns_type', item.type);
    formik.setFieldValue('display_columns_by', item.by);
  }, [formik]);

  const handleSubmitClick = useCallback(() => {
    formik.submitForm();
  }, [formik]);

  const handleAccountingBasisChange = useCallback((value) => {
    formik.setFieldValue('basis', value);
  }, [formik]);

  return (
    <FinancialStatementHeader>
      <FinancialStatementDateRange formik={formik} />

      <Row>
        <Col sm={3}>
          <SelectsListColumnsBy onItemSelect={handleItemSelectDisplayColumns} />
        </Col>

        <Col sm={3}>
          <RadiosAccountingBasis
            selectedValue={formik.values.basis}
            onChange={handleAccountingBasisChange} />
        </Col>

        <Col sm={3}>
          <Button
            type="submit"
            onClick={handleSubmitClick}
            className={'button--submit-filter mt2'}>
            <T id={'run_report'} />
          </Button>
        </Col>
      </Row>
    </FinancialStatementHeader>
  );
}