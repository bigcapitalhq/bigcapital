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
  handlePreviousYearChangeCheckboxChange,
  handlePreviousPeriodCheckBoxChange,
  handlePreivousPeriodPercentageCheckboxChange,
  handlePreviousYearPercentageCheckboxChange,
  handlePreviousPeriodChangeCheckboxChange,
} from './utils';

/**
 * Balance sheet header - Comparison panal - Comparisons fields.
 */
function BalanceSheetHeaderComparisonPanalFields() {
  const form = useFormikContext();

  return (
    <>
      {/**----------- Previous Year -----------*/}
      <FFormGroup name={'previousYear'} labelInfo={<FieldHint />}>
        <FCheckbox
          inline={true}
          label={<T id={'balance_sheet.previous_year'} />}
          name={'previousYear'}
          onChange={handlePreviousYearCheckBoxChange(form)}
        />
      </FFormGroup>

      <FlexSubFields align={'left'}>
        <FlexItem col={6}>
          <FFormGroup
            name={'previousYearAmountChange'}
            labelInfo={<FieldHint />}
          >
            <FCheckbox
              inline={true}
              small={true}
              label={<T id={'balance_sheet.total_change'} />}
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
              label={<T id={'balance_sheet.change'} />}
              name={'previousYearPercentageChange'}
              onChange={handlePreviousYearPercentageCheckboxChange(form)}
            />
          </FFormGroup>
        </FlexItem>
      </FlexSubFields>

      {/*------------ Previous Period -----------*/}
      <FFormGroup name={'previousPeriod'} labelInfo={<FieldHint />}>
        <FCheckbox
          inline={true}
          small={true}
          label={<T id={'balance_sheet.previous_period'} />}
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
              label={<T id={'balance_sheet.total_change'} />}
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
              label={<T id={'balance_sheet.change'} />}
              name={'previousPeriodPercentageChange'}
              onChange={handlePreivousPeriodPercentageCheckboxChange(form)}
            />
          </FFormGroup>
        </FlexItem>
      </FlexSubFields>

      {/**----------- % of Column -----------*/}
      <FFormGroup name={'percentageOfColumn'} labelInfo={<FieldHint />}>
        <FCheckbox
          inline={true}
          small={true}
          label={<T id={'balance_sheet.percentage_of_column'} />}
          name={'percentageOfColumn'}
        />
      </FFormGroup>

      {/**----------- % of Row -----------*/}
      <FFormGroup name={'percentageOfRow'} labelInfo={<FieldHint />}>
        <FCheckbox
          inline={true}
          small={true}
          label={<T id={'balance_sheet.percentage_of_row'} />}
          name={'percentageOfRow'}
        />
      </FFormGroup>
    </>
  );
}

/**
 * Balance sheet header - Comparison panal.
 */
export default function BalanceSheetHeaderComparisonPanal() {
  return (
    <BalanceSheetComparisonWrap>
      <BalanceSheetComparisonFieldsWrap>
        <BalanceSheetHeaderComparisonPanalFields />
      </BalanceSheetComparisonFieldsWrap>
    </BalanceSheetComparisonWrap>
  );
}

const BalanceSheetComparisonWrap = styled.div`
  .bp4-form-group {
    margin-bottom: 3px;
  }
`;

const FlexSubFields = styled(Flex)`
  padding-left: 20px;
`;

const BalanceSheetComparisonFieldsWrap = styled.div`
  width: 400px;
`;
