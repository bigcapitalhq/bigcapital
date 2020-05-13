import React, {useMemo, useCallback} from 'react';
import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import {Row, Col} from 'react-grid-system';
import { 
  Button,
  FormGroup,
  MenuItem,
} from "@blueprintjs/core";
import SelectList from 'components/SelectList';
import {useIntl} from 'react-intl';
import moment from 'moment';
import Icon from 'components/Icon';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import SelectDisplayColumnsBy from '../SelectDisplayColumnsBy';
import RadiosAccountingBasis from '../RadiosAccountingBasis';


export default function BalanceSheetHeader({
  onSubmitFilter,
  pageFilter,
}) {
  const intl = useIntl();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...pageFilter,
      basis: 'cash',
      from_date: moment(pageFilter.from_date).toDate(),
      to_date: moment(pageFilter.to_date).toDate(),
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

  // Handle item select of `display columns by` field.
  const onItemSelectDisplayColumns = useCallback((item) => {
    formik.setFieldValue('display_columns_type', item.type);
    formik.setFieldValue('display_columns_by', item.by);
  }, []);

  // Handle submit filter submit button.
  const handleSubmitClick = useCallback(() => {
    formik.submitForm();
  }, [formik]);  

  const filterAccountsOptions = useMemo(() => [
    {key: '', name: 'Accounts with Zero Balance'},
    {key: 'all-trans', name: 'All Transactions' },
  ], []);

  const filterAccountRenderer = useCallback((item, { handleClick, modifiers, query }) => {
    return (<MenuItem text={item.name} key={item.id} onClick={handleClick} />);
  }, []);

  const infoIcon = useMemo(() => 
    (<Icon icon="info-circle" iconSize={12} />), []);

  const handleAccountingBasisChange = useCallback((value) => {
    formik.setFieldValue('basis', value);
  }, [formik]);

  return (
    <FinancialStatementHeader>
      <FinancialStatementDateRange formik={formik} />

      <Row>
        <Col sm={3}>
          <SelectDisplayColumnsBy
            onItemSelect={onItemSelectDisplayColumns} />
        </Col>

        <Col sm={3}>
          <FormGroup
            label={'Filter Accounts'}
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

        <Col sm={3}>
          <RadiosAccountingBasis
            selectedValue={formik.values.basis} 
            onChange={handleAccountingBasisChange} />          
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