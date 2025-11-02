// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';

import {
  Flex,
  FlexItem,
  FieldHint,
  FormattedMessage as T,
  FFormGroup,
  FCheckbox,
} from '@/components';

import {
  handlePreviousYearCheckBoxChange,
  handlePreviousPeriodCheckBoxChange,
  handlePreviousYearChangeCheckboxChange,
  handlePreviousYearPercentageCheckboxChange,
  handlePreviousPeriodChangeCheckboxChange,
  handlePreviousPeriodPercentageCheckboxChange,
} from './utils';

/**
 * Profit/loss comparisons panel fields.
 * @returns {JSX.Element}
 */
function ProfitLossComaprsionPanelFields() {
  const form = useFormikContext();

  return (
    <>
      {/**----------- Previous Year -----------*/}
      <FFormGroup name={'previousYear'} labelInfo={<FieldHint />}>
        <FCheckbox
          inline={true}
          small={true}
          label={<T id={'profit_loss_sheet.previous_year'} />}
          name={'previousYear'}
          onChange={handlePreviousYearCheckBoxChange(form)}
        />
      </FFormGroup>

      <FlexSubFields>
        <FlexItem col={6}>
          <FFormGroup
            name={'previousYearAmountChange'}
            labelInfo={<FieldHint />}
          >
            <FCheckbox
              inline={true}
              small={true}
              label={<T id={'profit_loss_sheet.total_change'} />}
              name={'previousYearAmountChange'}
              onChange={handlePreviousYearChangeCheckboxChange(form)}
            />
          </FFormGroup>
        </FlexItem>
        <FlexItem col={6}>
          <FFormGroup
            name={'previousYearPercentageChange'}
            labelInfo={<FieldHint />}
          >
            <FCheckbox
              inline={true}
              small={true}
              label={<T id={'profit_loss_sheet.perentage_change'} />}
              name={'previousYearPercentageChange'}
              onChange={handlePreviousYearPercentageCheckboxChange(form)}
            />
          </FFormGroup>
        </FlexItem>
      </FlexSubFields>

      {/**----------- Previous Period (PP) -----------*/}
      <FFormGroup name={'previousPeriod'} labelInfo={<FieldHint />}>
        <FCheckbox
          inline={true}
          small={true}
          label={<T id={'profit_loss_sheet.previous_period'} />}
          name={'previousPeriod'}
          onChange={handlePreviousPeriodCheckBoxChange(form)}
        />
      </FFormGroup>

      <FlexSubFields>
        <FlexItem col={6}>
          <FFormGroup
            name={'previousPeriodAmountChange'}
            labelInfo={<FieldHint />}
          >
            <FCheckbox
              inline={true}
              small={true}
              label={<T id={'profit_loss_sheet.total_change'} />}
              name={'previousPeriodAmountChange'}
              onChange={handlePreviousPeriodChangeCheckboxChange(form)}
            />
          </FFormGroup>
        </FlexItem>
        <FlexItem col={6}>
          <FFormGroup
            name={'previousPeriodPercentageChange'}
            labelInfo={<FieldHint />}
          >
            <FCheckbox
              inline={true}
              small={true}
              label={<T id={'profit_loss_sheet.perentage_change'} />}
              name={'previousPeriodPercentageChange'}
              onChange={handlePreviousPeriodPercentageCheckboxChange(form)}
            />
          </FFormGroup>
        </FlexItem>
      </FlexSubFields>

      {/**----------- % of Column -----------*/}
      <FFormGroup name={'percentageColumn'} labelInfo={<FieldHint />}>
        <FCheckbox
          inline={true}
          small={true}
          label={<T id={'profit_loss_sheet.percentage_of_column'} />}
          name={'percentageColumn'}
        />
      </FFormGroup>

      {/**----------- % of Row -----------*/}
      <FFormGroup name={'percentageRow'} labelInfo={<FieldHint />}>
        <FCheckbox
          inline={true}
          small={true}
          label={<T id={'profit_loss_sheet.percentage_of_row'} />}
          name={'percentageRow'}
        />
      </FFormGroup>

      {/**----------- % of Expense -----------*/}
      <FFormGroup name={'percentageExpense'} labelInfo={<FieldHint />}>
        <FCheckbox
          inline={true}
          small={true}
          label={<T id={'profit_loss_sheet.percentage_of_expense'} />}
          name={'percentageExpense'}
        />
      </FFormGroup>

      {/**----------- % of Income -----------*/}
      <FFormGroup name={'percentageIncome'} labelInfo={<FieldHint />}>
        <FCheckbox
          inline={true}
          small={true}
          label={<T id={'profit_loss_sheet.percentage_of_income'} />}
          name={'percentageIncome'}
        />
      </FFormGroup>
    </>
  );
}

/**
 * ProfitLoss sheet header -comparison panel.
 */
export default function ProfitLossSheetHeaderComparisonPanel() {
  return (
    <ProfitLossSheetComparisonWrap>
      <ProfitLossComaprsionFieldsWrap>
        <ProfitLossComaprsionPanelFields />
      </ProfitLossComaprsionFieldsWrap>
    </ProfitLossSheetComparisonWrap>
  );
}

const ProfitLossSheetComparisonWrap = styled.div`
  .bp4-form-group {
    margin-bottom: 3px;
  }
`;

const FlexSubFields = styled(Flex)`
  padding-left: 20px;
`;

const ProfitLossComaprsionFieldsWrap = styled.div`
  max-width: 400px;
`;
