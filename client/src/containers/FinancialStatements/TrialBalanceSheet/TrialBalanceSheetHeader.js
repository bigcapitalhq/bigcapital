import React, { useEffect } from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import { Row, Col } from 'react-grid-system';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { useFormik } from 'formik';
import { Button } from "@blueprintjs/core";

import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import withTrialBalance from './withTrialBalance';
import withTrialBalanceActions from './withTrialBalanceActions';

import { compose } from 'utils';


function TrialBalanceSheetHeader({
  pageFilter,
  onSubmitFilter,

  // #withTrialBalance
  trialBalanceSheetFilter,
  trialBalanceSheetRefresh,

  // #withTrialBalanceActions
  refreshTrialBalance,
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

  useEffect(() => {
    if (trialBalanceSheetRefresh) {
      formik.submitForm();
      refreshTrialBalance(false);
    }
  }, [formik, trialBalanceSheetRefresh]);

  return (
    <FinancialStatementHeader show={trialBalanceSheetFilter}>
      <Row>
        <FinancialStatementDateRange formik={formik} />
      </Row>
    </FinancialStatementHeader>
  );
}

export default compose(
  withTrialBalance(({
    trialBalanceSheetFilter,
    trialBalanceSheetRefresh,
  }) => ({
    trialBalanceSheetFilter,
    trialBalanceSheetRefresh
  })),
  withTrialBalanceActions,
)(TrialBalanceSheetHeader);