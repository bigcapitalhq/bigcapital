import React, {useCallback} from 'react';
import {Row, Col} from 'react-grid-system';
import {
  Button,
  Intent,
} from '@blueprintjs/core';
import moment from 'moment';
import {useFormik} from 'formik';
import {useIntl} from 'react-intl';
import * as Yup from 'yup';
import FinancialStatementDateRange from 'containers/Dashboard/FinancialStatements/FinancialStatementDateRange';
import FinancialStatementHeader from 'containers/Dashboard/FinancialStatements/FinancialStatementHeader';


export default function JournalHeader({
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
    onSubmit: (values, actions) => {
      onSubmitFilter(values);
      actions.setSubmitting(false);
    },
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
            class={'button--submit-filter'}>
            { 'Run Report' }
          </Button>
        </Col>
      </Row>

    </FinancialStatementHeader>
  );
}