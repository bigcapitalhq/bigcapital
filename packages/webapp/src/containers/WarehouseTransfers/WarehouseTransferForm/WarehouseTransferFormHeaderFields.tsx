import { Position, ControlGroup } from '@blueprintjs/core';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useObserveTransferNoSettings } from './utils';
import { useWarehouseTransferFormContext } from './WarehouseTransferFormProvider';
import type { WarehouseTransferFormValues } from './types';
import {
  FFormGroup,
  FormattedMessage as T,
  WarehouseSelect,
  FDateInput,
  FInputGroup,
} from '@/components';
import { FieldRequiredHint, Icon, InputPrependButton } from '@/components';
import { CLASSES } from '@/constants/classes';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { useDateInputFormatter } from '@/hooks';
import { compose } from '@/utils';

/** Blueprint FormGroup/InputGroup support `fastField`/`asyncControl`; package typings omit them. */
interface FFormGroupFieldProps {
  name: string;
  label?: React.ReactNode;
  labelInfo?: React.ReactNode;
  inline?: boolean;
  fill?: boolean;
  fastField?: boolean;
  items?: unknown;
  children: React.ReactElement;
}
const FFormGroupField = FFormGroup as unknown as React.FC<FFormGroupFieldProps>;

interface FInputGroupFieldProps {
  name: string;
  minimal?: boolean;
  asyncControl?: boolean;
  fastField?: boolean;
  fill?: boolean;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}
const FInputGroupField =
  FInputGroup as unknown as React.FC<FInputGroupFieldProps>;

interface WarehouseTransferFormHeaderFieldsProps {
  openDialog: WithDialogActionsProps['openDialog'];
}

/**
 * Warehouse transfer form header fields.
 */
function WarehouseTransferFormHeaderFieldsInner({
  // #withDialogActions
  openDialog,
}: WarehouseTransferFormHeaderFieldsProps) {
  const { warehouses, warehouseTransferSettings } =
    useWarehouseTransferFormContext();
  const warehouseTransferAutoIncrement =
    warehouseTransferSettings?.autoIncrement as boolean | undefined;
  const warehouseTransferNextNumber = warehouseTransferSettings?.nextNumber as
    | number
    | undefined;
  const warehouseTransferNumberPrefix =
    warehouseTransferSettings?.numberPrefix as string | undefined;
  const { values } = useFormikContext<WarehouseTransferFormValues>();

  // Handle warehouse transfer number changing.
  const handleTransferNumberChange = () => {
    openDialog('warehouse-transfer-no-form');
  };

  // Handle transfer no. field blur.
  const handleTransferNoBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (
      values.transactionNumber !== newValue &&
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
    String(warehouseTransferNumberPrefix ?? ''),
    Number(warehouseTransferNextNumber ?? 0),
  );

  const dateInputFormatter = useDateInputFormatter();

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      {/* ----------- Date ----------- */}
      <FFormGroupField
        name={'date'}
        label={intl.get('date')}
        inline
        labelInfo={<FieldRequiredHint />}
        fill
        fastField
      >
        <FDateInput
          name={'date'}
          {...dateInputFormatter}
          popoverProps={{ position: Position.BOTTOM_LEFT, minimal: true }}
          inputProps={{
            leftIcon: <Icon icon={'date-range'} />,
          }}
          fill
          fastField
        />
      </FFormGroupField>

      {/* ----------- Transfer number ----------- */}
      <FFormGroupField
        name={'transactionNumber'}
        label={intl.get('warehouse_transfer.label.transfer_no')}
        inline
        fill
      >
        <ControlGroup fill={true}>
          <FInputGroupField
            name={'transactionNumber'}
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
      </FFormGroupField>

      {/* ----------- Form Warehouse ----------- */}
      <FFormGroupField
        name={'fromWarehouseId'}
        items={warehouses}
        label={intl.get('warehouse_transfer.label.from_warehouse')}
        inline={true}
        labelInfo={<FieldRequiredHint />}
      >
        <WarehouseSelect
          name={'fromWarehouseId'}
          warehouses={warehouses ?? []}
          placeholder={<T id={'select_warehouse_transfer'} />}
          allowCreate={true}
          fill={true}
        />
      </FFormGroupField>

      {/* ----------- To Warehouse ----------- */}
      <FFormGroupField
        name={'toWarehouseId'}
        label={intl.get('warehouse_transfer.label.to_warehouse')}
        inline={true}
        labelInfo={<FieldRequiredHint />}
      >
        <WarehouseSelect
          name={'toWarehouseId'}
          warehouses={warehouses ?? []}
          placeholder={<T id={'select_warehouse_transfer'} />}
          fill={true}
          allowCreate={true}
        />
      </FFormGroupField>
    </div>
  );
}

export const WarehouseTransferFormHeaderFields = compose(withDialogActions)(
  WarehouseTransferFormHeaderFieldsInner,
);
