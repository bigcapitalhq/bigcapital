import React, {useState, useMemo, useEffect, useCallback} from 'react';
import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import {useIntl} from 'react-intl';
import {
  Button,
  FormGroup,
  Classes,
} from '@blueprintjs/core';
import {Row, Col} from 'react-grid-system';
import {
  compose,
} from 'utils';
import moment from 'moment';
import AccountsConnect from 'connectors/Accounts.connector'
import classNames from 'classnames';
import AccountsMultiSelect from 'components/AccountsMultiSelect';
import {useFormik} from 'formik';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import * as Yup from 'yup';
import RadiosAccountingBasis from '../RadiosAccountingBasis';


function GeneralLedgerHeader({
  onSubmitFilter,
  pageFilter,
  accounts,
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

  const handleAccountingBasisChange = useCallback((value) => {
    formik.setFieldValue('basis', value);
  }, [formik]);
  
  return (
    <FinancialStatementHeader>
      <FinancialStatementDateRange formik={formik} />

      <Row>
        <Col sm={3}>
          <FormGroup
            label={'Specific Accounts'}
            className={classNames('form-group--select-list', Classes.FILL)}
          >
            <AccountsMultiSelect
              accounts={accounts}
              onAccountSelected={onAccountSelected} />
          </FormGroup>
        </Col>
        <Col sm={3}>
          <RadiosAccountingBasis
            onChange={handleAccountingBasisChange}
            selectedValue={formik.values.basis} />
        </Col>

        <Col sm={3}>
          <Button
            type="submit"
            onClick={handleSubmitClick}
            disabled={formik.isSubmitting}
            className={'button--submit-filter mt2'}>
            { 'Calculate Report' }
          </Button>
        </Col>
      </Row>
    </FinancialStatementHeader>
  )
}

export default compose(
  AccountsConnect
)(GeneralLedgerHeader);