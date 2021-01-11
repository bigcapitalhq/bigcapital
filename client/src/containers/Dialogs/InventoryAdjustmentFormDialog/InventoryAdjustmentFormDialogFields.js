import React from 'react';
import {
  Form,
  FastField,
  ErrorMessage,
  useFormikContext,
  useField,
} from 'formik';
import {
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
  TextArea,
  Position,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { FormattedMessage as T } from 'react-intl';
import { DateInput } from '@blueprintjs/datetime';
import { ListSelect, Choose, If, FieldRequiredHint } from 'components';
import {
  inputIntent,
  momentFormatter,
  tansformDateValue,
  handleDateChange,
} from 'utils';
import { CLASSES } from 'common/classes';
import adjustmentType from 'common/adjustmentType';
import IncrementAdjustmentFields from './IncrementAdjustmentFields';
import DecrementAdjustmentFields from './DecrementAdjustmentFields';
import AccountsSuggestField from 'components/AccountsSuggestField';

import withAccounts from 'containers/Accounts/withAccounts';
import { compose } from 'redux';

/**
 * Inventory adjustment form dialogs fields.
 */
function InventoryAdjustmentFormDialogFields({
  // #ownProps
  onClose,

  //# withAccount
  accountsList,
}) {
  const { values, isSubmitting } = useFormikContext();

  return (
    <Form>
      <div className={Classes.DIALOG_BODY}>
        {/*------------ Date -----------*/}
        <FastField name={'date'}>
          {({ form, field: { value }, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'date'} />}
              labelInfo={<FieldRequiredHint />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="date" />}
              minimal={true}
              className={classNames(CLASSES.FILL)}
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

        {/*------------ Adjustment type -----------*/}
        <FastField name={'type'}>
          {({ form, field: { value }, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'adjustment_type'} />}
              labelInfo={<FieldRequiredHint />}
              helperText={<ErrorMessage name="type" />}
              intent={inputIntent({ error, touched })}
              className={classNames(CLASSES.FILL)}
            >
              <ListSelect
                items={adjustmentType}
                onItemSelect={(type) => {
                  console.log(type.value, 'EE');
                  form.setFieldValue('type', type.value);
                }}
                selectedItem={value}
                selectedItemProp={'value'}
                labelProp={'name'}
                popoverProps={{ minimal: true }}
              />
            </FormGroup>
          )}
        </FastField>
        <Choose>
          <Choose.When condition={values.type === 'decrement'}>
            <DecrementAdjustmentFields />
          </Choose.When>
          <Choose.When condition={values.type === 'increment'}>
            <IncrementAdjustmentFields />
          </Choose.When>
        </Choose>

        {/*------------ Reason -----------*/}
        <FastField name={'reason'}>
          {({ form, field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'reason'} />}
              labelInfo={<FieldRequiredHint />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="reason" />}
            >
              <InputGroup fill={true} {...field} />
            </FormGroup>
          )}
        </FastField>
        {/*------------ Adjustment account -----------*/}
        <FastField name={'adjustment_account_id'}>
          {({ form, field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'adjustment_account'} />}
              labelInfo={<FieldRequiredHint />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="reason" />}
            >
              <AccountsSuggestField
                accounts={accountsList}
                onAccountSelected={(item) =>
                  form.setFieldValue('adjustment_account_id', item)
                }
              />
            </FormGroup>
          )}
        </FastField>
        {/*------------ Reference -----------*/}
        <FastField name={'reference_no'}>
          {({ form, field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'reference_no'} />}
              className={classNames(CLASSES.FILL)}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="reference_no" />}
            >
              <InputGroup {...field} />
            </FormGroup>
          )}
        </FastField>
        {/*------------ description -----------*/}
        <FastField name={'description'}>
          {({ field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'description'} />}
              className={'form-group--description'}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name={'description'} />}
            >
              <TextArea growVertically={true} large={true} {...field} />
            </FormGroup>
          )}
        </FastField>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={onClose} style={{ minWidth: '75px' }}>
            <T id={'close'} />
          </Button>

          <Button
            disabled={isSubmitting}
            style={{ minWidth: '75px' }}
            type="submit"
          >
            {<T id={'save_as_draft'} />}
          </Button>
          <Button
            intent={Intent.PRIMARY}
            disabled={isSubmitting}
            style={{ minWidth: '75px' }}
            type="submit"
          >
            {<T id={'make_adjustment'} />}
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default compose(
  withAccounts(({ accountsList }) => ({
    accountsList,
  })),
)(InventoryAdjustmentFormDialogFields);
