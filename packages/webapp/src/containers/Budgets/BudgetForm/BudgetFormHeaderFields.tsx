import { Checkbox, Classes, Position } from '@blueprintjs/core';
import { ErrorMessage, useField, useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useBudgetFormContext } from './BudgetFormProvider';
import { getVisibleBudgetAccounts, parseEntryFieldKey } from './utils';
import type { BudgetFormValues } from './types';
import {
  Card,
  Col,
  FDateInput,
  FFormGroup,
  FInputGroup,
  FTextArea,
  Icon,
  Row,
} from '@/components';
import { useDateInputFormatter } from '@/hooks';

const DATE_INPUT_MIN_DATE = new Date(1900, 0, 1);
const DATE_INPUT_MAX_DATE = new Date(2200, 11, 31);

/**
 * Budget form header fields.
 */
export function BudgetFormHeaderFields() {
  const dateInputFormatter = useDateInputFormatter();
  const { accountRows } = useBudgetFormContext();
  const { values, setFieldValue } = useFormikContext<BudgetFormValues>();
  const [includeBalanceSheetField, , includeBalanceSheetHelpers] =
    useField<boolean>('includeBalanceSheetAccounts');

  // Handle the balance sheet accounts checkbox change.
  const handleIncludeBalanceSheetChange = (
    event: React.FormEvent<HTMLInputElement>,
  ) => {
    const checked = event.currentTarget.checked;

    if (!checked) {
      // Remove the entries of the balance sheet accounts as they are no
      // longer visible in the budget table.
      const visibleAccounts = getVisibleBudgetAccounts(accountRows, false);
      const visibleAccountIds = new Set(
        visibleAccounts.map((account) => account.id),
      );
      const entries = Object.fromEntries(
        Object.entries(values.entries).filter(([fieldKey]) => {
          const parsedKey = parseEntryFieldKey(fieldKey);
          return parsedKey ? visibleAccountIds.has(parsedKey[0]) : false;
        }),
      );
      setFieldValue('entries', entries);
    }
    includeBalanceSheetHelpers.setValue(checked);
  };

  return (
    <Card className="budget-form__header-card">
      <h5 className={Classes.HEADING}>{intl.get('budget.form.details')}</h5>

      <Row>
        <Col xs={12} md={6}>
          <FFormGroup
            name={'name'}
            label={intl.get('budget.form.name')}
            labelInfo={intl.get('budget.form.name_required')}
            helperText={<ErrorMessage name={'name'} />}
          >
            <FInputGroup
              name={'name'}
              placeholder={intl.get('budget.form.name_placeholder')}
              fill={true}
              autoFocus={true}
            />
          </FFormGroup>
        </Col>

        <Col xs={12} md={6}>
          <FFormGroup
            name={'description'}
            label={intl.get('budget.form.description')}
          >
            <FTextArea
              name={'description'}
              placeholder={intl.get('budget.form.description_placeholder')}
              fill={true}
              rows={2}
            />
          </FFormGroup>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={6}>
          <FFormGroup
            name={'fromDate'}
            label={intl.get('budget.form.start_date')}
            helperText={<ErrorMessage name={'fromDate'} />}
          >
            <FDateInput
              name={'fromDate'}
              {...dateInputFormatter}
              fill={true}
              minDate={DATE_INPUT_MIN_DATE}
              maxDate={DATE_INPUT_MAX_DATE}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              inputProps={{ leftIcon: <Icon icon={'date-range'} /> }}
            />
          </FFormGroup>
        </Col>

        <Col xs={12} md={6}>
          <FFormGroup
            name={'toDate'}
            label={intl.get('budget.form.end_date')}
            helperText={<ErrorMessage name={'toDate'} />}
          >
            <FDateInput
              name={'toDate'}
              {...dateInputFormatter}
              fill={true}
              minDate={DATE_INPUT_MIN_DATE}
              maxDate={DATE_INPUT_MAX_DATE}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              inputProps={{ leftIcon: <Icon icon={'date-range'} /> }}
            />
          </FFormGroup>
        </Col>
      </Row>

      <p className={Classes.TEXT_MUTED + ' budget-form__hint'}>
        {intl.get('budget.form.period_hint')}
      </p>

      <Checkbox
        checked={includeBalanceSheetField.value}
        onChange={handleIncludeBalanceSheetChange}
        label={intl.get('budget.form.include_balance_sheet_accounts')}
        className={'budget-form__include-balance-sheet'}
      />
      <p className={Classes.TEXT_MUTED + ' budget-form__hint'}>
        {intl.get('budget.form.include_balance_sheet_accounts_hint')}
      </p>
    </Card>
  );
}
