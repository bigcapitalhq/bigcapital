import {
  Button,
  Classes,
  FormGroup,
  HTMLSelect,
  Intent,
  NumericInput,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import { useBudgetFormContext } from './BudgetFormProvider';
import {
  applyPrefillEntries,
  getVisibleBudgetAccounts,
  parseAmount,
} from './utils';
import type { BudgetFormValues, BudgetPeriod } from './types';
import { AppToaster, Icon, FormattedMessage as T } from '@/components';
import { useBudgetPrefill } from '@/hooks/query';

interface BudgetPrefillPopoverProps {
  periods: BudgetPeriod[];
}

/**
 * Budget prefill popover, prefills the budget entries from a previous year's
 * actual amounts.
 */
export function BudgetPrefillPopover({ periods }: BudgetPrefillPopoverProps) {
  const { values, setFieldValue } = useFormikContext<BudgetFormValues>();
  const { accountRows } = useBudgetFormContext();
  const { mutateAsync: prefillBudget, isPending } = useBudgetPrefill();

  const [isOpen, setIsOpen] = React.useState(false);
  const targetYear = values.fromDate
    ? moment(values.fromDate).year()
    : moment().year();
  const sourceYears = React.useMemo(
    () => Array.from({ length: 6 }, (_, index) => targetYear - 1 - index),
    [targetYear],
  );
  const [sourceYear, setSourceYear] = React.useState<number>(sourceYears[0]);
  const [adjustmentPercentage, setAdjustmentPercentage] =
    React.useState<number>(0);

  // Keep the source year selection valid when the budget period changes.
  React.useEffect(() => {
    if (!sourceYears.includes(sourceYear)) {
      setSourceYear(sourceYears[0]);
    }
  }, [sourceYear, sourceYears]);

  // Handles the prefill button click.
  const handlePrefill = async () => {
    if (!values.fromDate || !values.toDate) {
      return;
    }
    try {
      const response = await prefillBudget({
        fromDate: moment(values.fromDate).format('YYYY-MM-DD'),
        toDate: moment(values.toDate).format('YYYY-MM-DD'),
        sourceYear,
      });

      if (response.entries.length === 0) {
        AppToaster.show({
          message: intl.get('budget.form.prefill.no_actuals', {
            year: sourceYear,
          }),
          intent: Intent.WARNING,
        });
        return;
      }
      const visibleAccounts = getVisibleBudgetAccounts(
        accountRows,
        values.includeBalanceSheetAccounts,
      );
      const nextEntries = applyPrefillEntries(
        values,
        response.entries,
        visibleAccounts,
        periods,
        parseAmount(adjustmentPercentage) || 0,
      );

      setFieldValue('entries', nextEntries, false);
      setIsOpen(false);

      AppToaster.show({
        message: intl.get('budget.form.prefill.success', {
          year: sourceYear,
        }),
        intent: Intent.SUCCESS,
      });
    } catch (_error) {
      AppToaster.show({
        message: intl.get('budget.form.prefill.error'),
        intent: Intent.DANGER,
      });
    }
  };

  return (
    <Popover
      isOpen={isOpen}
      onInteraction={(nextOpenState) => setIsOpen(nextOpenState)}
      interactionKind={PopoverInteractionKind.CLICK}
      position={Position.BOTTOM_LEFT}
      content={
        <div className={'budget-prefill-popover'}>
          <h5 className={Classes.HEADING}>
            <T id={'budget.form.prefill.title'} />
          </h5>

          <FormGroup
            label={intl.get('budget.form.prefill.source_year')}
            labelFor={'budget-prefill-source-year'}
          >
            <HTMLSelect
              id={'budget-prefill-source-year'}
              value={sourceYear}
              onChange={(event) =>
                setSourceYear(Number(event.currentTarget.value))
              }
              fill={true}
            >
              {sourceYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </HTMLSelect>
          </FormGroup>

          <FormGroup
            label={intl.get('budget.form.prefill.adjustment')}
            helperText={intl.get('budget.form.prefill.adjustment_helper_text')}
          >
            <NumericInput
              value={adjustmentPercentage}
              onValueChange={(value) =>
                setAdjustmentPercentage(Number.isFinite(value) ? value : 0)
              }
              fill={true}
              stepSize={1}
              minorStepSize={0.5}
              clampValueOnBlur={false}
              rightElement={<span>%</span>}
            />
          </FormGroup>

          <div className={'budget-prefill-popover__actions'}>
            <Button
              text={intl.get('budget.form.prefill.action')}
              intent={Intent.PRIMARY}
              icon={<Icon icon={'chart'} />}
              loading={isPending}
              onClick={handlePrefill}
            />
          </div>
        </div>
      }
    >
      <Button
        icon={<Icon icon={'history'} />}
        text={intl.get('budget.form.prefill.button')}
      />
    </Popover>
  );
}
