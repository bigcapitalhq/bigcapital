import React, { useCallback } from 'react';
import { Button, FormGroup, Classes } from '@blueprintjs/core';
import { Row, Col } from 'react-grid-system';
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
import { compose } from 'utils';

import withGeneralLedger from './withGeneralLedger';

function GeneralLedgerHeader({
  onSubmitFilter,
  pageFilter,

  // #withAccounts
  accounts,

  // #withGeneralLedger
  generalLedgerSheetFilter,
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

  // handle submit filter submit button.
  const handleSubmitClick = useCallback(() => {
    formik.submitForm();
  }, []);

  const onAccountSelected = useCallback((selectedAccounts) => {
    console.log(selectedAccounts);
  }, []);

  const handleAccountingBasisChange = useCallback(
    (value) => {
      formik.setFieldValue('basis', value);
    },
    [formik],
  );

  return (
    <FinancialStatementHeader show={generalLedgerSheetFilter}>
      <FinancialStatementDateRange formik={formik} />

      <Row>
        <Col sm={3}>
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
        <Col sm={3}>
          <RadiosAccountingBasis
            onChange={handleAccountingBasisChange}
            selectedValue={formik.values.basis}
          />
        </Col>

        <Col sm={3}>
          <Button
            type="submit"
            onClick={handleSubmitClick}
            disabled={formik.isSubmitting}
            className={'button--submit-filter mt2'}
          >
            <T id={'calculate_report'} />
          </Button>
        </Col>
      </Row>
    </FinancialStatementHeader>
  );
}

export default compose(
  withAccounts(({ accounts }) => ({
    accounts,
  })),
  withGeneralLedger(({ generalLedgerSheetFilter }) => ({
    generalLedgerSheetFilter,
  })),
)(GeneralLedgerHeader);
