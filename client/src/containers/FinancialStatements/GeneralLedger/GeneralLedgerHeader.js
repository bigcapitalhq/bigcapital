import React, { useEffect, useCallback } from 'react';
import { Button, FormGroup, Classes } from '@blueprintjs/core';
import { Row, Col, Visible } from 'react-grid-system';
import moment from 'moment';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { FormattedMessage as T } from 'react-intl';

import AccountsMultiSelect from 'components/AccountsMultiSelect';
import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import withAccounts from 'containers/Accounts/withAccounts';

import classNames from 'classnames';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import RadiosAccountingBasis from '../RadiosAccountingBasis';

import withGeneralLedger from './withGeneralLedger';
import withGeneralLedgerActions from './withGeneralLedgerActions';

import { compose } from 'utils';


function GeneralLedgerHeader({
  onSubmitFilter,
  pageFilter,

  // #withAccounts
  accounts,

  // #withGeneralLedgerActions
  refreshGeneralLedgerSheet,

  // #withGeneralLedger
  generalLedgerSheetFilter,
  generalLedgerSheetRefresh
}) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...pageFilter,
      from_date: moment(pageFilter.from_date).toDate(),
      to_date: moment(pageFilter.to_date).toDate(),
    },
    validationSchema: Yup.object().shape({
      from_date: Yup.date().required(),
      to_date: Yup.date().min(Yup.ref('from_date')).required(),
    }),
    onSubmit(values, actions) {
      onSubmitFilter(values);
      actions.setSubmitting(false);
    },
  });

  const onAccountSelected = useCallback((selectedAccounts) => {
    
  }, []);

  const handleAccountingBasisChange = useCallback(
    (value) => {
      formik.setFieldValue('basis', value);
    },
    [formik],
  );
  
  // handle submit filter submit button.
  useEffect(() => {
    if (generalLedgerSheetRefresh) {
      formik.submitForm();
      refreshGeneralLedgerSheet(false);
    }
  }, [formik, generalLedgerSheetRefresh])

  return (
    <FinancialStatementHeader show={generalLedgerSheetFilter}>
      <Row>
        <FinancialStatementDateRange formik={formik} />

        <Visible xl><Col width={'100%'} /></Visible>

        <Col width={260}>
          <FormGroup
            label={<T id={'specific_accounts'} />}
            className={classNames('form-group--select-list', Classes.FILL)}
          >
            <AccountsMultiSelect
              accounts={accounts}
              onAccountSelected={onAccountSelected}
            />
          </FormGroup>
        </Col>

        <Col width={260}>
          <RadiosAccountingBasis
            onChange={handleAccountingBasisChange}
            selectedValue={formik.values.basis}
          />
        </Col>

      </Row>
    </FinancialStatementHeader>
  );
}

export default compose(
  withAccounts(({ accounts }) => ({
    accounts,
  })),
  withGeneralLedger(({ generalLedgerSheetFilter, generalLedgerSheetRefresh }) => ({
    generalLedgerSheetFilter,
    generalLedgerSheetRefresh,
  })),
  withGeneralLedgerActions,
)(GeneralLedgerHeader);
