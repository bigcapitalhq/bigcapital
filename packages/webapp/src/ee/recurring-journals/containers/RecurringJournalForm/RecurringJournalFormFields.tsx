import { Position } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useRecurringJournalFormContext } from './RecurringJournalFormProvider';
import type { RecurringJournalFormValues } from './utils';
import {
  BranchSelect,
  FDateInput,
  FFormGroup,
  FInputGroup,
  FSelect,
  FSwitch,
  FieldRequiredHint,
  FormBranchSelectButton,
  Hint,
  Icon,
  SegmentedControl,
  Stack,
} from '@/components';
import { Features } from '@/constants';
import { useDateInputFormatter } from '@/hooks';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

const FREQUENCY_OPTIONS = [
  { key: 'day', label: intl.get('recurring_journal.frequency.day') },
  { key: 'week', label: intl.get('recurring_journal.frequency.week') },
  { key: 'month', label: intl.get('recurring_journal.frequency.month') },
  { key: 'year', label: intl.get('recurring_journal.frequency.year') },
];

type BasisOption = 'general' | 'accrual' | 'cash';

export function RecurringJournalFormFields() {
  const dateInputFormatter = useDateInputFormatter();
  const { featureCan } = useFeatureCan();
  const { currencies, branches } = useRecurringJournalFormContext();
  const form = useFormikContext<RecurringJournalFormValues>();
  const baseCurrency = useCurrentOrganizationBaseCurrency();
  const isForeignCurrency =
    !!form.values.currencyCode && form.values.currencyCode !== baseCurrency;

  return (
    <Stack spacing={18} flex={1}>
      <FFormGroup
        name={'profileName'}
        label={intl.get('recurring_journal.field.profile_name')}
        labelInfo={<FieldRequiredHint />}
        inline
        fastField
      >
        <FInputGroup
          name={'profileName'}
          data-testId="recurring-journal-profile-name"
        />
      </FFormGroup>

      <FFormGroup
        name={'reference'}
        label={intl.get('reference')}
        inline
        fastField
      >
        <FInputGroup name={'reference'} />
      </FFormGroup>

      <FFormGroup
        name={'startDate'}
        label={intl.get('recurring_journal.field.start_date')}
        labelInfo={<FieldRequiredHint />}
        inline
        fastField
      >
        <FDateInput
          name={'startDate'}
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

      <FFormGroup
        name={'endDate'}
        label={intl.get('recurring_journal.field.end_date')}
        inline
        fastField
      >
        <FDateInput
          name={'endDate'}
          {...dateInputFormatter}
          canClearSelection={true}
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

      <FFormGroup
        name={'repeatInterval'}
        label={intl.get('recurring_journal.field.repeat_every')}
        labelInfo={<FieldRequiredHint />}
        inline
        fastField
      >
        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
          <FInputGroup
            name={'repeatInterval'}
            type="number"
            min={1}
            style={{ maxWidth: 90 }}
          />
          <FSelect
            name={'frequency'}
            items={FREQUENCY_OPTIONS}
            valueAccessor={'key'}
            textAccessor={'label'}
            popoverProps={{ minimal: true }}
          />
        </div>
      </FFormGroup>

      <FFormGroup
        name={'maxOccurrences'}
        label={intl.get('recurring_journal.field.max_occurrences')}
        inline
        fastField
      >
        <FInputGroup
          name={'maxOccurrences'}
          type="number"
          min={1}
          placeholder={intl.get('recurring_journal.field.unlimited')}
        />
      </FFormGroup>

      <FFormGroup
        name={'autoPublish'}
        inline
        helperText={intl.get('recurring_journal.field.auto_publish_hint')}
      >
        <FSwitch
          name={'autoPublish'}
          labelElement={intl.get('recurring_journal.field.auto_publish')}
          large={true}
        />
      </FFormGroup>

      <FFormGroup
        name={'journalType'}
        label={intl.get('journal_type')}
        inline
        fastField
      >
        <FInputGroup name={'journalType'} fill />
      </FFormGroup>

      <FFormGroup
        name={'basis'}
        label={intl.get('accounting_basis_')}
        labelInfo={
          <Hint
            content={intl.get('accounting_basis_hint')}
            position={Position.RIGHT}
          />
        }
        inline
      >
        <SegmentedControl<BasisOption>
          value={(form.values.basis || 'general') as BasisOption}
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

      {isForeignCurrency && (
        <FFormGroup
          name={'exchangeRate'}
          label={intl.get('exchange_rate')}
          inline
          fastField
        >
          <FInputGroup
            name={'exchangeRate'}
            type="number"
            min={0}
            step="0.000001"
          />
        </FFormGroup>
      )}

      {featureCan(Features.Branches) && (
        <FFormGroup name={'branchId'} label={intl.get('branch')} inline>
          <BranchSelect
            name={'branchId'}
            branches={branches}
            input={FormBranchSelectButton}
            popoverProps={{ minimal: true }}
            fill={false}
          />
        </FFormGroup>
      )}
    </Stack>
  );
}
