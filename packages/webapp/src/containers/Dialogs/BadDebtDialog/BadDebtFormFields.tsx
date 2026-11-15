import {
  Classes,
  ControlGroup,
  Callout,
  Intent,
  Position,
} from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { useBadDebtContext } from './BadDebtFormProvider';
import {
  FTextArea,
  FormattedMessage as T,
  FFormGroup,
  FMoneyInputGroup,
  FAccountsSuggestField,
  FDateInput,
  Icon,
  InputPrependText,
  FieldRequiredHint,
} from '@/components';
import { ACCOUNT_TYPE } from '@/constants/accountTypes';
import { useAutofocus, useDateInputFormatter } from '@/hooks';

/**
 * Bad debt form fields.
 */
export function BadDebtFormFields(): React.ReactElement {
  const amountfieldRef = useAutofocus<HTMLInputElement>();
  const dateInputFormatter = useDateInputFormatter();
  const { accounts, invoice } = useBadDebtContext();

  return (
    <div className={Classes.DIALOG_BODY}>
      <Callout intent={Intent.PRIMARY}>
        <p>
          <T id={'bad_debt.dialog.header_note'} />
        </p>
      </Callout>

      {/*------------ Date -----------*/}
      <FFormGroup
        name={'date'}
        label={intl.get('date')}
        labelInfo={<FieldRequiredHint />}
      >
        <FDateInput
          {...dateInputFormatter}
          name={'date'}
          popoverProps={{ position: Position.BOTTOM, minimal: true }}
          inputProps={{
            leftIcon: <Icon icon={'date-range'} />,
          }}
        />
      </FFormGroup>

      {/*------------ Written-off amount -----------*/}
      <FFormGroup
        name={'amount'}
        label={intl.get('bad_debt.dialog.written_off_amount')}
        labelInfo={<FieldRequiredHint />}
      >
        <ControlGroup>
          <InputPrependText text={invoice?.currencyCode || ''} />
          <FMoneyInputGroup
            name={'amount'}
            minimal={true}
            inputRef={(ref: HTMLInputElement | null) => {
              amountfieldRef.current = ref;
            }}
          />
        </ControlGroup>
      </FFormGroup>

      {/*------------ Expense account ----------- */}
      <FFormGroup
        name={'expenseAccountId'}
        label={intl.get('expense_account_id')}
        labelInfo={<FieldRequiredHint />}
      >
        <FAccountsSuggestField
          name={'expenseAccountId'}
          items={accounts ?? []}
          filterByTypes={[ACCOUNT_TYPE.EXPENSE]}
          fill
        />
      </FFormGroup>

      {/*------------ reason -----------*/}
      <FFormGroup
        name={'reason'}
        label={intl.get('reason')}
        labelInfo={<FieldRequiredHint />}
      >
        <FTextArea name={'reason'} growVertically={true} large={true} fill />
      </FFormGroup>
    </div>
  );
}
