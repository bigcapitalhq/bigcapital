// @ts-nocheck
import React from 'react';
import { Position, ControlGroup } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import {
  FFormGroup,
  FormattedMessage as T,
  WarehouseSelect,
  FDateInput,
  FInputGroup,
} from '@/components';
import { momentFormatter, compose } from '@/utils';
import classNames from 'classnames';

import { CLASSES } from '@/constants/classes';
import { FieldRequiredHint, Icon, InputPrependButton } from '@/components';
import { useWarehouseTransferFormContext } from './WarehouseTransferFormProvider';
import { useObserveTransferNoSettings } from './utils';
import { withSettings } from '@/containers/Settings/withSettings';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';

/**
 * Warehouse transfer form header fields.
 */
function WarehouseTransferFormHeaderFields({
  // #withDialogActions
  openDialog,

  // #withSettings
  warehouseTransferAutoIncrement,
  warehouseTransferNextNumber,
  warehouseTransferNumberPrefix,
}) {
  const { warehouses } = useWarehouseTransferFormContext();
  const { values } = useFormikContext();

  // Handle warehouse transfer number changing.
  const handleTransferNumberChange = () => {
    openDialog('warehouse-transfer-no-form');
  };

  // Handle transfer no. field blur.
  const handleTransferNoBlur = (event) => {
    const newValue = event.target.value;

    if (
      values.transaction_number !== newValue &&
      warehouseTransferAutoIncrement
    ) {
      openDialog('warehouse-transfer-no-form', {
        initialFormValues: {
          manualTransactionNo: newValue,
          incrementMode: 'manual-transaction',
        },
      });
    }
  };

  // Syncs transfer number settings with form.
  useObserveTransferNoSettings(
    warehouseTransferNumberPrefix,
    warehouseTransferNextNumber,
  );

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      {/* ----------- Date ----------- */}
      <FFormGroup
        name={'date'}
        label={<T id={'date'} />}
        inline
        labelInfo={<FieldRequiredHint />}
        fill
        fastField
      >
        <FDateInput
          name={'date'}
          {...momentFormatter('YYYY/MM/DD')}
          popoverProps={{ position: Position.BOTTOM_LEFT, minimal: true }}
          inputProps={{
            leftIcon: <Icon icon={'date-range'} />,
          }}
          fill
          fastField
        />
      </FFormGroup>

      {/* ----------- Transfer number ----------- */}
      <FFormGroup
        name={'transaction_number'}
        label={<T id={'warehouse_transfer.label.transfer_no'} />}
        inline
        fill
      >
        <ControlGroup fill={true}>
          <FInputGroup
            name={'transaction_number'}
            minimal={true}
            asyncControl={true}
            onBlur={handleTransferNoBlur}
          />
          <InputPrependButton
            buttonProps={{
              onClick: handleTransferNumberChange,
              icon: <Icon icon={'settings-18'} />,
            }}
            tooltip={true}
            tooltipProps={{
              content: (
                <T
                  id={
                    'warehouse_transfer.setting_your_auto_generated_transfer_no'
                  }
                />
              ),
              position: Position.BOTTOM_LEFT,
            }}
          />
        </ControlGroup>
      </FFormGroup>

      {/* ----------- Form Warehouse ----------- */}
      <FFormGroup
        name={'from_warehouse_id'}
        items={warehouses}
        label={<T id={'warehouse_transfer.label.from_warehouse'} />}
        inline={true}
        labelInfo={<FieldRequiredHint />}
      >
        <WarehouseSelect
          name={'from_warehouse_id'}
          warehouses={warehouses}
          placeholder={<T id={'select_warehouse_transfer'} />}
          allowCreate={true}
          fill={true}
        />
      </FFormGroup>

      {/* ----------- To Warehouse ----------- */}
      <FFormGroup
        name={'to_warehouse_id'}
        label={<T id={'warehouse_transfer.label.to_warehouse'} />}
        inline={true}
        labelInfo={<FieldRequiredHint />}
      >
        <WarehouseSelect
          name={'to_warehouse_id'}
          warehouses={warehouses}
          placeholder={<T id={'select_warehouse_transfer'} />}
          fill={true}
          allowCreate={true}
        />
      </FFormGroup>
    </div>
  );
}

export default compose(
  withDialogActions,
  withSettings(({ warehouseTransferSettings }) => ({
    warehouseTransferAutoIncrement: warehouseTransferSettings?.autoIncrement,
    warehouseTransferNextNumber: warehouseTransferSettings?.nextNumber,
    warehouseTransferNumberPrefix: warehouseTransferSettings?.numberPrefix,
  })),
)(WarehouseTransferFormHeaderFields);
