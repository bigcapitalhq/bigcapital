import React from 'react';
import {
  FormGroup,
  InputGroup,
  Position,
  ControlGroup,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField, Field, ErrorMessage } from 'formik';
import { FormattedMessage as T } from '@/components';
import { momentFormatter, compose, tansformDateValue } from '@/utils';
import classNames from 'classnames';

import { CLASSES } from '@/common/classes';
import {
  AccountsSelectList,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
} from '@/components';
import { inputIntent, handleDateChange } from '@/utils';
import { useWarehouseTransferFormContext } from './WarehouseTransferFormProvider';
import { useObserveTransferNoSettings } from './utils';
import withSettings from '@/containers/Settings/withSettings';
import withDialogActions from '@/containers/Dialog/withDialogActions';

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

  // Handle warehouse transfer number changing.
  const handleTransferNumberChange = () => {
    openDialog('warehouse-transfer-no-form');
  };

  // Handle transfer no. field blur.
  const handleTransferNoBlur = (form, field) => (event) => {
    const newValue = event.target.value;

    if (field.value !== newValue && warehouseTransferAutoIncrement) {
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
      <FastField name={'date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'date'} />}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            className={classNames('form-group--date', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="date" />}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(value)}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('date', formattedDate);
              })}
              popoverProps={{ position: Position.BOTTOM_LEFT, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FormGroup>
        )}
      </FastField>
      {/* ----------- Transfer number ----------- */}
      <Field name={'transaction_number'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'warehouse_transfer.label.transfer_no'} />}
            // labelInfo={<FieldRequiredHint />}
            inline={true}
            className={classNames('form-group--transfer-no', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="transfer_number" />}
          >
            <ControlGroup fill={true}>
              <InputGroup
                minimal={true}
                value={field.value}
                asyncControl={true}
                onBlur={handleTransferNoBlur(form, field)}
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
          </FormGroup>
        )}
      </Field>
      {/* ----------- Form Warehouse ----------- */}
      <FastField name={'from_warehouse_id'} accounts={warehouses}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'warehouse_transfer.label.from_warehouse'} />}
            className={classNames(
              'form-group--warehouse-transfer',
              CLASSES.FILL,
            )}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'from_warehouse_id'} />}
          >
            <AccountsSelectList
              accounts={warehouses}
              onAccountSelected={(account) => {
                form.setFieldValue('from_warehouse_id', account.id);
              }}
              defaultSelectText={<T id={'select_warehouse_transfer'} />}
              selectedAccountId={value}
              popoverFill={true}
              allowCreate={true}
            />
          </FormGroup>
        )}
      </FastField>
      {/* ----------- To Warehouse ----------- */}
      <FastField name={'to_warehouse_id'} accounts={warehouses}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'warehouse_transfer.label.to_warehouse'} />}
            className={classNames(
              'form-group--warehouse-transfer',
              CLASSES.FILL,
            )}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'to_warehouse_id'} />}
          >
            <AccountsSelectList
              accounts={warehouses}
              onAccountSelected={(account) => {
                form.setFieldValue('to_warehouse_id', account.id);
              }}
              defaultSelectText={<T id={'select_warehouse_transfer'} />}
              selectedAccountId={value}
              popoverFill={true}
              allowCreate={true}
            />
          </FormGroup>
        )}
      </FastField>
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
