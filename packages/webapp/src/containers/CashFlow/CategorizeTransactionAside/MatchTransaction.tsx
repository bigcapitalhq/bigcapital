// @ts-nocheck
import clsx from 'classnames';
import { Group, Stack } from '@/components';
import { Checkbox, Text } from '@blueprintjs/core';
import styles from './MatchTransaction.module.scss';
import { useUncontrolled } from '@/hooks/useUncontrolled';

export interface MatchTransactionProps {
  active?: boolean;
  initialActive?: boolean;
  onChange?: (state: boolean) => void;
  label: string;
  date: string;
}

export function MatchTransaction({
  active,
  initialActive,
  onChange,
  label,
  date,
}: MatchTransactionProps) {
  const [_active, handleChange] = useUncontrolled<boolean>({
    value: active,
    initialValue: initialActive,
    finalValue: false,
    onChange,
  });

  const handleClick = () => {
    handleChange(!_active);
  };

  const handleCheckboxChange = (event) => {
    handleChange(!event.target.checked);
  };

  return (
    <Group
      className={clsx(styles.root, {
        [styles.active]: _active,
      })}
      position="apart"
      onClick={handleClick}
    >
      <Stack spacing={3}>
        <span className={styles.label}>{label}</span>
        <Text className={styles.date}>Date: {date}</Text>
      </Stack>

      <Checkbox
        checked={_active as boolean}
        className={styles.checkbox}
        onChange={handleCheckboxChange}
      />
    </Group>
  );
}
