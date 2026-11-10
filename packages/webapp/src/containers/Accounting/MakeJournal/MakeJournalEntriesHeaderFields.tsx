import { Position } from '@blueprintjs/core';
import { useTheme } from '@emotion/react';
import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';
import { JournalExchangeRateInputField } from './components';
import { getMakeJournalFieldsStyle } from './fieldsStyle';
import { useMakeJournalFormContext } from './MakeJournalProvider';
import { MakeJournalTransactionNoField } from './MakeJournalTransactionNoField';
import type { MakeJournalFormValues } from './utils';
import {
  Hint,
  FieldRequiredHint,
  Icon,
  FSelect,
  FormattedMessage as T,
  FFormGroup,
  FInputGroup,
  FDateInput,
  SegmentedControl,
  Stack,
} from '@/components';
import { useDateInputFormatter } from '@/hooks';

type MakeJournalBasisOption = 'general' | 'accrual' | 'cash';

/**
 * Make journal entries header fields.
 */
export function MakeJournalEntriesHeader() {
  const { currencies } = useMakeJournalFormContext();
  const form = useFormikContext<MakeJournalFormValues>();
  const theme = useTheme();
  const fieldsClassName = getMakeJournalFieldsStyle(theme);
  const dateInputFormatter = useDateInputFormatter();

  return (
    <Stack spacing={18} flex={1} className={fieldsClassName}>
      {/*------------ Posting date -----------*/}
      <FFormGroup
        name={'date'}
        label={intl.get('posting_date')}
        labelInfo={<FieldRequiredHint />}
        inline
        fastField
      >
        <FDateInput
          name={'date'}
          {...dateInputFormatter}
          popoverProps={{
            position: Position.BOTTOM_LEFT,
            minimal: true,
            fill: true,
          }}
          inputProps={{
            leftIcon: <Icon icon={'date-range'} />,
          }}
          fill
          fastField
        />
      </FFormGroup>

      {/*------------ Journal number -----------*/}
      <MakeJournalTransactionNoField />

      {/*------------ Reference -----------*/}
      <FFormGroup
        name={'reference'}
        label={intl.get('reference')}
        labelInfo={
          <Hint
            content={<T id={'journal_reference_hint'} />}
            position={Position.RIGHT}
          />
        }
        inline
        fastField
      >
        <FInputGroup name={'reference'} fill />
      </FFormGroup>

      {/*------------ Journal type  ----------- */}
      <FFormGroup
        name={'journalType'}
        label={intl.get('journal_type')}
        inline
        fastField
      >
        <FInputGroup name={'journalType'} fill />
      </FFormGroup>

      {/*------------ Accounting method  ----------- */}
      <FFormGroup
        name={'basis'}
        label={intl.get('accounting_basis_')}
        labelInfo={
          <Hint
            content={<T id={'accounting_basis_hint'} />}
            position={Position.RIGHT}
          />
        }
        inline
      >
        <SegmentedControl<MakeJournalBasisOption>
          value={form.values.basis || 'general'}
          onChange={(value) => {
            form.setFieldValue('basis', value === 'general' ? '' : value);
          }}
          items={[
            { label: intl.get('general'), value: 'general' },
            { label: intl.get('accrual'), value: 'accrual' },
            { label: intl.get('cash'), value: 'cash' },
          ]}
        />
      </FFormGroup>

      {/*------------ Currency  -----------*/}
      <FFormGroup
        name={'currencyCode'}
        label={intl.get('currency')}
        inline
        fastField
      >
        <FSelect
          name={'currencyCode'}
          items={currencies}
          onItemChange={(currencyItem: Record<string, unknown>) => {
            form.setFieldValue('currencyCode', currencyItem.currencyCode);
            form.setFieldValue('exchangeRate', '');
          }}
          popoverProps={{
            inline: true,
            minimal: true,
            captureDismiss: true,
          }}
          valueAccessor={'currencyCode'}
          labelAccessor={'currencyName'}
          textAccessor={'currencyCode'}
          fastField
        />
      </FFormGroup>

      {/* ----------- Exchange rate ----------- */}
      <JournalExchangeRateInputField
        name={'exchangeRate'}
        formGroupProps={{ label: ' ', inline: true }}
      />
    </Stack>
  );
}
