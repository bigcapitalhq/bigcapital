import React, { useMemo, useCallback, useEffect } from 'react';
import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import { Row, Col, Visible } from 'react-grid-system';
import {
  Button,
  FormGroup,
  MenuItem,
} from "@blueprintjs/core";
import moment from 'moment';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { FormattedMessage as T, useIntl } from 'react-intl';

import Icon from 'components/Icon';
import SelectList from 'components/SelectList';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import SelectDisplayColumnsBy from '../SelectDisplayColumnsBy';
import RadiosAccountingBasis from '../RadiosAccountingBasis';

import withBalanceSheet from './withBalanceSheetDetail';
import withBalanceSheetActions from './withBalanceSheetActions';

import { compose } from 'utils';

function BalanceSheetHeader({
  onSubmitFilter,
  pageFilter,
  show,
  refresh,

  // #withBalanceSheetActions
  refreshBalanceSheet
}) {
  const { formatMessage } = useIntl();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...pageFilter,
      basis: 'cash',
      from_date: moment(pageFilter.from_date).toDate(),
      to_date: moment(pageFilter.to_date).toDate(),
    },
    validationSchema: Yup.object().shape({
      from_date: Yup.date().required().label(formatMessage({id:'from_data'})),
      to_date: Yup.date().min(Yup.ref('from_date')).required().label(formatMessage({id:'to_date'})),
    }),
    onSubmit: (values, actions) => {
      onSubmitFilter(values);
      actions.setSubmitting(false);
    },
  });

  // Handle item select of `display columns by` field.
  const onItemSelectDisplayColumns = useCallback((item) => {
    formik.setFieldValue('display_columns_type', item.type);
    formik.setFieldValue('display_columns_by', item.by);
  }, [formik]);

  const filterAccountsOptions = useMemo(() => [
    { key: '', name: formatMessage({ id: 'accounts_with_zero_balance' }) },
    { key: 'all-trans', name: formatMessage({ id: 'all_transactions' }) },
  ], [formatMessage]);

  const filterAccountRenderer = useCallback((item, { handleClick, modifiers, query }) => {
    return (<MenuItem text={item.name} key={item.id} onClick={handleClick} />);
  }, []);

  const handleAccountingBasisChange = useCallback((value) => {
    formik.setFieldValue('basis', value);
  }, [formik]);

  // Handle submit filter submit button.
  useEffect(() => {
    if (refresh) {
      formik.submitForm();  
      refreshBalanceSheet(false);
    }
  }, [refresh]);

  return (
    <FinancialStatementHeader show={show}>
      <Row>
        <FinancialStatementDateRange formik={formik} />

        <Visible xl><Col width={'100%'} /></Visible>

        <Col width={260} offset={10}>
          <SelectDisplayColumnsBy
            onItemSelect={onItemSelectDisplayColumns} />
        </Col>

        <Col width={260}>
          <FormGroup
            label={<T id={'filter_accounts'} />}
            className="form-group--select-list bp3-fill"
            inline={false}>

            <SelectList
              items={filterAccountsOptions}
              itemRenderer={filterAccountRenderer}
              onItemSelect={onItemSelectDisplayColumns}
              popoverProps={{ minimal: true }}
              filterable={false} />
          </FormGroup>
        </Col>

        <Col width={260}>
          <RadiosAccountingBasis
            selectedValue={formik.values.basis}
            onChange={handleAccountingBasisChange} />
        </Col>
      </Row>
    </FinancialStatementHeader>
  )
}

export default compose(
  withBalanceSheet(({ balanceSheetRefresh }) => ({
    refresh: balanceSheetRefresh,
  })),
  withBalanceSheetActions,
)(BalanceSheetHeader);