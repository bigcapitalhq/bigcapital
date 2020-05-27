import React, { useCallback } from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import { Row, Col } from 'react-grid-system';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { useFormik } from 'formik';
import { Button } from "@blueprintjs/core";

import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import withTrialBalance from './withTrialBalance';

import { compose } from 'utils';


function TrialBalanceSheetHeader({
  pageFilter,
  onSubmitFilter,

  // #withTrialBalance
  trialBalanceSheetFilter,
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
    onSubmit: (values, { setSubmitting }) => {
      onSubmitFilter(values);
      setSubmitting(false);
    }
  });

  const handleSubmitClick = useCallback(() => {
    formik.submitForm();
  }, [formik]);

  return (
    <FinancialStatementHeader show={trialBalanceSheetFilter}>
      <FinancialStatementDateRange formik={formik} />

      <Row>
        <Col sm={3}>
          <Button
            type="submit"
            onClick={handleSubmitClick}
            disabled={formik.isSubmitting}
            className={'button--submit-filter'}>
            <T id={'run_report'} />
          </Button>
        </Col>
      </Row>
    </FinancialStatementHeader>
  );
}

export default compose(
  withTrialBalance(({ trialBalanceSheetFilter }) => ({ trialBalanceSheetFilter })),
)(TrialBalanceSheetHeader);