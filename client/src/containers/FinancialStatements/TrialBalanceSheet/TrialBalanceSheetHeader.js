import React, { useEffect, useCallback } from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import { Row, Col, Visible } from 'react-grid-system';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { FormGroup } from '@blueprintjs/core';
import { useFormik } from 'formik';

import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import RadiosAccountingBasis from '../RadiosAccountingBasis';
import FinancialAccountsFilter from '../FinancialAccountsFilter';

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
      to_date: moment(pageFilter.to_date).toDate(),
    },
    validationSchema: Yup.object().shape({
      from_date: Yup.date()
        .required()
        .label(formatMessage({ id: 'from_date' })),
      to_date: Yup.date()
        .min(Yup.ref('from_date'))
        .required()
        .label(formatMessage({ id: 'to_date' })),
    }),
    onSubmit: (values, { setSubmitting }) => {
      onSubmitFilter(values);
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (trialBalanceSheetRefresh) {
      formik.submitForm();
      refreshTrialBalance(false);
    }
  }, [formik, trialBalanceSheetRefresh]);

  const handleAccountingBasisChange = useCallback(
    (value) => {
      formik.setFieldValue('basis', value);
    },
    [formik],
  );

  const handleAccountsFilterSelect = (filterType) => {
    const noneZero = filterType.key === 'without-zero-balance' ? true : false;
    formik.setFieldValue('none_zero', noneZero);
  };

  return (
    <FinancialStatementHeader show={trialBalanceSheetFilter}>
      <Row>
        <FinancialStatementDateRange formik={formik} />

        <Visible xl>
          <Col width={'100%'} />
        </Visible>

        <Col width={260}>
          <FormGroup
            label={<T id={'filter_accounts'} />}
            className="form-group--select-list bp3-fill"
            inline={false}
          >
            <FinancialAccountsFilter
              initialSelectedItem={'all-accounts'}
              onItemSelect={handleAccountsFilterSelect}
            />
          </FormGroup>
        </Col>

        <Col width={260}>
          <RadiosAccountingBasis
            selectedValue={formik.values.basis}
            onChange={handleAccountingBasisChange}
          />
        </Col>
      </Row>
    </FinancialStatementHeader>
  );
}

export default compose(
  withTrialBalance(({ trialBalanceSheetFilter, trialBalanceSheetRefresh }) => ({
    trialBalanceSheetFilter,
    trialBalanceSheetRefresh,
  })),
  withTrialBalanceActions,
)(TrialBalanceSheetHeader);
