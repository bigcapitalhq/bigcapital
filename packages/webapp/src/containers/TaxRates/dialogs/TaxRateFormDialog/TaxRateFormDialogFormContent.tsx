import { Tag, Text } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { ChangeEvent } from 'react';
import styled from 'styled-components';
import { useTaxRateFormDialogContext } from './TaxRateFormDialogBoot';
import {
  TaxRateFormValues,
  transformTaxRateCodeValue,
  useIsTaxRateChanged,
} from './utils';
import { FCheckbox, FFormGroup, FInputGroup, Hint } from '@/components';

/**
 * Tax rate form content.
 * @returns {JSX.Element}
 */
export function TaxRateFormDialogContent() {
  return (
    <div>
      <FFormGroup
        name={'name'}
        label={'Name'}
        labelInfo={<Tag minimal>Required</Tag>}
        subLabel={
          'The name as you would like it to appear in customers invoices.'
        }
        fastField={true}
      >
        <FInputGroup name={'name'} fastField={true} />
      </FFormGroup>

      <TaxRateCodeField />
      <FFormGroup
        name={'rate'}
        label={'Rate (%)'}
        labelInfo={<Tag minimal>Required</Tag>}
        fastField={true}
      >
        <RateFormGroup
          name={'rate'}
          rightElement={<Tag minimal>%</Tag>}
          fill={false}
          fastField={true}
        />
      </FFormGroup>

      <FFormGroup
        name={'description'}
        label={'Description'}
        labelInfo={
          <Hint content="This description is for internal use only and will not be visiable to your customers." />
        }
        fastField={true}
      >
        <FInputGroup name={'description'} fastField={true} />
      </FFormGroup>

      <CompoundFormGroup name={'isCompound'} fastField={true}>
        <FCheckbox label={'Is compound'} name={'isCompound'} fastField={true} />
      </CompoundFormGroup>

      <CompoundFormGroup name={'isNonRecoverable'} fastField={true}>
        <FCheckbox
          label={'Is non recoverable'}
          name={'isNonRecoverable'}
          fastField={true}
        />
      </CompoundFormGroup>

      <ConfirmEditingTaxRate />
    </div>
  );
}

/**
 * Tax rate code input group
 * @returns {JSX.Element}
 */
function TaxRateCodeField() {
  const { setFieldValue } = useFormikContext<TaxRateFormValues>();

  // Handle the field change.
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const transformedValue = transformTaxRateCodeValue(event.target.value);
    setFieldValue('code', transformedValue);
  };

  return (
    <FFormGroup
      name={'code'}
      label={'Code'}
      labelInfo={<Tag minimal>Required</Tag>}
      fastField={true}
    >
      <FInputGroup name={'code'} fastField={true} onChange={handleChange} />
    </FFormGroup>
  );
}

function ConfirmEditingTaxRate() {
  const isTaxRateChanged = useIsTaxRateChanged();
  const { isNewMode } = useTaxRateFormDialogContext();

  // Can't continue if it is new mode or tax rate not changed.
  if (!isTaxRateChanged || isNewMode) return null;

  return (
    <EditWarningWrap>
      <Text color={'#766f58'}>Please Note:</Text>
      <ConfirmEditFormGroup name={'confirmEdit'} helperText={''}>
        <FCheckbox
          name={'confirmEdit'}
          label={`I understand that updating the
          tax will mark the existing tax inactive, create a new tax, and update
          it in the chosen transactions.`}
        />
      </ConfirmEditFormGroup>
    </EditWarningWrap>
  );
}

const RateFormGroup = styled(FInputGroup)`
  max-width: 100px;
`;

const CompoundFormGroup = styled(FFormGroup)`
  margin-bottom: 0;
`;

const EditWarningWrap = styled(`div`)`
  background: #fcf8ec;
  margin-left: -20px;
  margin-right: -20px;
  padding: 14px 20px;
  font-size: 13px;
  margin-top: 8px;
  border-top: 1px solid #f2eddf;
  border-bottom: 1px solid #f2eddf;
`;

const ConfirmEditFormGroup = styled(FFormGroup)`
  margin-bottom: 0;
`;
