import React, {useState, useCallback, useMemo} from 'react';
import * as Yup from 'yup';
import {Row, Col} from 'react-grid-system';
import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import { 
  Button,
} from "@blueprintjs/core";
import moment from 'moment';
import {useIntl} from 'react-intl';
import { useFormik } from 'formik';

import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';


export default function TrialBalanceSheetHeader({
  pageFilter,
  onSubmitFilter,
}) {
  const intl = useIntl();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...pageFilter,
      from_date: moment(pageFilter.from_date).toDate(),
      to_date: moment(pageFilter.to_date).toDate()
    },
    validationSchema: Yup.object().shape({
      from_date: Yup.date().required(),
      to_date: Yup.date().min(Yup.ref('from_date')).required(),
    }),
    onSubmit: (values, { setSubmitting }) => {
      onSubmitFilter(values);
      setSubmitting(false);
    }
  });

  const handleSubmitClick = useCallback(() => {
    formik.submitForm();
  }, [formik]);

  return (
    <FinancialStatementHeader>
      <FinancialStatementDateRange formik={formik} />

      <Row>
        <Col sm={3}>
          <Button
            type="submit"
            onClick={handleSubmitClick}
            disabled={formik.isSubmitting}
            className={'button--submit-filter'}>
            { 'Run Report' }
          </Button>
        </Col>
      </Row>
    </FinancialStatementHeader>
  );
}