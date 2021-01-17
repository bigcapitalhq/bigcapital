import React from 'react';
import { FastField, ErrorMessage, Field, useFormikContext } from 'formik';
import {
  Classes,
  FormGroup,
  InputGroup,
  TextArea,
  Position,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { DateInput } from '@blueprintjs/datetime';
import { compose } from 'redux';
import { ListSelect, FieldRequiredHint, Col, Row } from 'components';
import {
  inputIntent,
  momentFormatter,
  tansformDateValue,
  handleDateChange,
  toSafeNumber
} from 'utils';
import { CLASSES } from 'common/classes';
import adjustmentType from 'common/adjustmentType';

import AccountsSuggestField from 'components/AccountsSuggestField';
import withAccounts from 'containers/Accounts/withAccounts';
import { diffQuantity } from './utils';
import InventoryAdjustmentQuantityFields from './InventoryAdjustmentQuantityFields';

/**
 * Inventory adjustment form dialogs fields.
 */
function InventoryAdjustmentFormDialogFields({
  //# withAccount
  accountsList,
}) {
  const { values } = useFormikContext();
  const { formatMessage } = useIntl();

  return (
    <div className={Classes.DIALOG_BODY}>
      <Row>
        <Col xs={5}>
          {/*------------ Date -----------*/}
          <FastField name={'date'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'date'} />}
                labelInfo={<FieldRequiredHint />}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="date" />}
                minimal={true}
                className={classNames(CLASSES.FILL, 'form-group--date')}
              >
                <DateInput
                  {...momentFormatter('YYYY/MM/DD')}
                  onChange={handleDateChange((formattedDate) => {
                    form.setFieldValue('date', formattedDate);
                  })}
                  value={tansformDateValue(value)}
                  popoverProps={{
                    position: Position.BOTTOM,
                    minimal: true,
                  }}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>

        <Col xs={5}>
          {/*------------ Adjustment type -----------*/}
          <Field name={'type'}>
            {({ form: { values, setFieldValue }, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'adjustment_type'} />}
                labelInfo={<FieldRequiredHint />}
                helperText={<ErrorMessage name="type" />}
                intent={inputIntent({ error, touched })}
                className={classNames(CLASSES.FILL, 'form-group--type')}
              >
                <ListSelect
                  items={adjustmentType}
                  onItemSelect={(type) => {
                    const result = diffQuantity(
                      toSafeNumber(values.quantity),
                      toSafeNumber(values.quantity_on_hand),
                      type.value
                    );
                    setFieldValue('type', type.value);
                    setFieldValue('new_quantity', result);
                  }}
                  filterable={false}
                  selectedItem={value}
                  selectedItemProp={'value'}
                  textProp={'name'}
                  popoverProps={{ minimal: true }}
                />
              </FormGroup>
            )}
          </Field>
        </Col>
      </Row>

      <InventoryAdjustmentQuantityFields />

      {/*------------ Adjustment account -----------*/}
      <FastField name={'adjustment_account_id'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'adjustment_account'} />}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="reason" />}
            className={'form-group--adjustment-account'}
          >
            <AccountsSuggestField
              accounts={accountsList}
              onAccountSelected={(item) =>
                form.setFieldValue('adjustment_account_id', item.id)
              }
              inputProps={{
                placeholder: formatMessage({
                  id: 'select_adjustment_account',
                }),
              }}
            />
          </FormGroup>
        )}
      </FastField>

      {/*------------ Reference -----------*/}
      <FastField name={'reference_no'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'reference_no'} />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="reference_no" />}
            className={'form-group--reference-no'}
          >
            <InputGroup {...field} />
          </FormGroup>
        )}
      </FastField>

      {/*------------ description -----------*/}
      <FastField name={'reason'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'adjustment_reasons'} />}
            className={'form-group--adjustment-reasons'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'adjustment_reasons'} />}
          >
            <TextArea growVertically={true} large={true} {...field} />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}

export default compose(
  withAccounts(({ accountsList }) => ({
    accountsList,
  })),
)(InventoryAdjustmentFormDialogFields);
