import { Classes, FormGroup, Position } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useInventoryAdjContext } from './InventoryAdjustmentFormProvider';
import { InventoryAdjustmentQuantityFields } from './InventoryAdjustmentQuantityFields';
import {
  diffQuantity,
  useSetPrimaryBranchToForm,
  useSetPrimaryWarehouseToForm,
  useGetAdjustmentTypeOptions,
} from './utils';
import type { InventoryAdjustmentFormValues } from './types';
import {
  FFormGroup,
  FDateInput,
  FInputGroup,
  FTextArea,
  FSelect,
} from '@/components';
import {
  FieldRequiredHint,
  Col,
  Row,
  FeatureCan,
  BranchSelect,
  WarehouseSelect,
  FAccountsSuggestField,
} from '@/components';
import { Features } from '@/constants';
import { useAutofocus, useDateInputFormatter } from '@/hooks';
import { useFeatureCan } from '@/hooks/state';
import { toSafeNumber } from '@/utils';

export function InventoryAdjustmentFormDialogFields(): React.ReactElement {
  const { featureCan } = useFeatureCan();

  const adjustmentTypes = useGetAdjustmentTypeOptions();

  const dateFieldRef = useAutofocus<HTMLInputElement>();
  const dateInputFormatter = useDateInputFormatter();

  const { accounts, branches, warehouses } = useInventoryAdjContext();
  const { values, setFieldValue } =
    useFormikContext<InventoryAdjustmentFormValues>();

  useSetPrimaryWarehouseToForm();
  useSetPrimaryBranchToForm();

  const handleAdjustmentTypeChange = (type: {
    value: 'increment' | 'decrement';
  }) => {
    const result = diffQuantity(
      toSafeNumber(values.quantity),
      toSafeNumber(values.quantityOnHand),
      type.value,
    );
    setFieldValue('type', type.value);
    setFieldValue('newQuantity', result);
  };

  return (
    <div className={Classes.DIALOG_BODY}>
      <Row>
        <FeatureCan feature={Features.Branches}>
          <Col xs={5}>
            <FormGroup label={intl.get('branch')}>
              <BranchSelect
                name={'branchId'}
                branches={branches}
                popoverProps={{ minimal: true }}
              />
            </FormGroup>
          </Col>
        </FeatureCan>
        <FeatureCan feature={Features.Warehouses}>
          <Col xs={5}>
            <FormGroup label={intl.get('warehouse')}>
              <WarehouseSelect
                name={'warehouseId'}
                warehouses={warehouses}
                popoverProps={{ minimal: true }}
              />
            </FormGroup>
          </Col>
        </FeatureCan>
      </Row>

      {featureCan(Features.Warehouses) && featureCan(Features.Branches) && (
        <FeatureRowDivider />
      )}

      <Row>
        <Col xs={5}>
          <FFormGroup
            name={'date'}
            label={intl.get('date')}
            labelInfo={<FieldRequiredHint />}
            fastField
          >
            <FDateInput
              name={'date'}
              {...dateInputFormatter}
              popoverProps={{
                position: Position.BOTTOM,
                minimal: true,
              }}
              inputProps={{ inputRef: dateFieldRef }}
              fastField
            />
          </FFormGroup>
        </Col>

        <Col xs={5}>
          <FFormGroup
            name={'type'}
            label={intl.get('adjustment_type')}
            labelInfo={<FieldRequiredHint />}
            fastField
          >
            <FSelect
              name={'type'}
              items={adjustmentTypes}
              onItemChange={handleAdjustmentTypeChange}
              filterable={false}
              valueAccessor={'value'}
              textAccessor={'name'}
              popoverProps={{ minimal: true }}
              fastField
            />
          </FFormGroup>
        </Col>
      </Row>

      <InventoryAdjustmentQuantityFields />

      <FFormGroup
        name={'adjustmentAccountId'}
        label={intl.get('adjustment_account')}
        labelInfo={<FieldRequiredHint />}
      >
        <FAccountsSuggestField
          name={'adjustmentAccountId'}
          items={accounts}
          inputProps={{
            placeholder: intl.get('select_adjustment_account'),
          }}
          fill
          fastField
        />
      </FFormGroup>

      <FFormGroup
        name={'referenceNo'}
        label={intl.get('reference_no')}
        fastField
      >
        <FInputGroup name={'referenceNo'} fastField />
      </FFormGroup>

      <FFormGroup
        name={'reason'}
        label={intl.get('adjustment_reasons')}
        labelInfo={<FieldRequiredHint />}
        fastField
      >
        <FTextArea name={'reason'} growVertically large fastField fill />
      </FFormGroup>
    </div>
  );
}

export const FeatureRowDivider = styled.div`
  --x-color-background: #e9e9e9;
  .bp4-dark & {
    --x-color-background: rgba(255, 255, 255, 0.1);
  }
  height: 2px;
  background: var(--x-color-background);
  margin-bottom: 15px;
`;
