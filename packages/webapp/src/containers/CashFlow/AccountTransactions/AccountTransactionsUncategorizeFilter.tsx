// @ts-nocheck
import styled from 'styled-components';
import { Tag } from '@blueprintjs/core';
import { useAppQueryString } from '@/hooks';
import { useUncontrolled } from '@/hooks/useUncontrolled';
import { Group } from '@/components';

const Root = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 18px;
`;

const FilterTag = styled(Tag)`
  min-height: 26px;

  &.bp4-minimal:not([class*='bp4-intent-']) {
    background: #fff;
    border: 1px solid #e1e2e8;

    &.bp4-interactive:hover {
      background-color: rgba(143, 153, 168, 0.05);
    }
  }
`;

export function AccountTransactionsUncategorizeFilter() {
  const [locationQuery, setLocationQuery] = useAppQueryString();

  const handleTabsChange = (value) => {
    setLocationQuery({ uncategorizedFilter: value });
  };

  return (
    <Group position={'apart'}>
      <SegmentedTabs
        options={[
          { value: 'all', label: 'All' },
          { value: 'recognized', label: 'Recognized' },
        ]}
        value={locationQuery?.uncategorizedFilter || 'all'}
        onValueChange={handleTabsChange}
      />
      <SegmentedTabs
        options={[{ value: 'excluded', label: 'Excluded' }]}
        value={locationQuery?.uncategorizedFilter || 'all'}
        onValueChange={handleTabsChange}
      />
    </Group>
  );
}

interface SegmentedTabs {
  options: Array<{ label: string; value: string }>;
  initialValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

function SegmentedTabs({ options, initialValue, value, onValueChange }) {
  const [_value, handleChange] = useUncontrolled({
    initialValue,
    value,
    onChange: onValueChange,
  });
  return (
    <Root>
      {options.map((option) => (
        <FilterTag
          round
          interactive
          onClick={() => handleChange(option.value)}
          minimal={option.value !== _value}
        >
          {option.label}
        </FilterTag>
      ))}
    </Root>
  );
}
