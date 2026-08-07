import { useFormikContext } from 'formik';
import styled from 'styled-components';
import { composeEntriesOnEditInclusiveTax, type BillFormValues } from './utils';
import { FFormGroup, FSelect } from '@/components';
import { InclusiveTaxOptions } from '@/constants/InclusiveTaxOptions';
import { EntriesActionsBar } from '@/containers/Entries/EntriesActionBar';

export function BillFormEntriesActions() {
  return (
    <EntriesActionsBar>
      <BillExclusiveInclusiveSelect />
    </EntriesActionsBar>
  );
}

type InclusiveTaxOption = { key: string; label: string };

/**
 * Bill exclusive/inclusive select.
 * @returns {React.ReactNode}
 */
export function BillExclusiveInclusiveSelect(props: Record<string, unknown>) {
  const { values, setFieldValue } = useFormikContext<BillFormValues>();

  const handleItemSelect = (item: InclusiveTaxOption) => {
    const newEntries = composeEntriesOnEditInclusiveTax(
      item.key,
      values.entries,
    );
    setFieldValue('inclusiveExclusiveTax', item.key);
    setFieldValue('entries', newEntries);
  };

  return (
    <InclusiveFormGroup
      name={'inclusiveExclusiveTax'}
      label={'Amounts are'}
      inline={true}
    >
      <FSelect
        name={'inclusiveExclusiveTax'}
        items={InclusiveTaxOptions}
        textAccessor={'label'}
        labelAccessor={() => ''}
        valueAccessor={'key'}
        popoverProps={{ minimal: true, usePortal: true, inline: false }}
        buttonProps={{ small: true }}
        onItemSelect={handleItemSelect}
        filterable={false}
        {...props}
      />
    </InclusiveFormGroup>
  );
}

const InclusiveFormGroup = styled(FFormGroup)`
  margin-left: auto;
`;
