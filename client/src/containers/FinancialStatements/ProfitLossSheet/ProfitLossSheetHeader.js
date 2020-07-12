import React, { useCallback, useEffect } from 'react';
import { Row, Col, Visible } from 'react-grid-system';
import moment from 'moment';
import { useFormik } from 'formik';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { FormGroup } from '@blueprintjs/core';
import * as Yup from 'yup';

import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import SelectsListColumnsBy from '../SelectDisplayColumnsBy';
import RadiosAccountingBasis from '../RadiosAccountingBasis';
import FinancialAccountsFilter from '../FinancialAccountsFilter';

import withProfitLoss from './withProfitLoss';
import withProfitLossActions from './withProfitLossActions';

import { compose } from 'utils';


function ProfitLossHeader({
  pageFilter,
  onSubmitFilter,

  // #withProfitLoss
  profitLossSheetFilter,
  profitLossSheetRefresh,

  // #withProfitLossActions
  refreshProfitLossSheet,
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
    onSubmit: (values, actions) => {
      onSubmitFilter(values);
      actions.setSubmitting(false);
    },
  });

  // Handle item select of `display columns by` field.
  const handleItemSelectDisplayColumns = useCallback(
    (item) => {
      formik.setFieldValue('display_columns_type', item.type);
      formik.setFieldValue('display_columns_by', item.by);
    },
    [formik],
  );

  const handleAccountingBasisChange = useCallback(
    (value) => {
      formik.setFieldValue('basis', value);
    },
    [formik],
  );

  useEffect(() => {
    if (profitLossSheetRefresh) {
      formik.submitForm();
      refreshProfitLossSheet(false);
    }
  }, [profitLossSheetRefresh]);

  const handleAccountsFilterSelect = (filterType) => {
    const noneZero = filterType.key === 'without-zero-balance' ? true : false;
    formik.setFieldValue('none_zero', noneZero);
  };

  return (
    <FinancialStatementHeader show={profitLossSheetFilter}>
      <Row>
        <FinancialStatementDateRange formik={formik} />
        <Visible xl><Col width={'100%'} /></Visible>

        <Col width={260}>
          <SelectsListColumnsBy onItemSelect={handleItemSelectDisplayColumns} />
        </Col>

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
  withProfitLoss(({
    profitLossSheetFilter,
    profitLossSheetRefresh,
  }) => ({
    profitLossSheetFilter,
    profitLossSheetRefresh,
  })),
  withProfitLossActions,
)(ProfitLossHeader);
