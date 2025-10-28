// @ts-nocheck
import clsx from 'classnames';
import { Checkbox, Text } from '@blueprintjs/core';
import { useUncontrolled } from '@/hooks/useUncontrolled';
import { Group, Stack } from '@/components';
import styles from './MatchTransactionCheckbox.module.scss';

export interface MatchTransactionCheckboxProps {
  active?: boolean;
  initialActive?: boolean;
  onChange?: (state: boolean) => void;
  label: string | React.ReactNode;
  date: string;
}

export function MatchTransactionCheckbox({
  active,
  initialActive,
  onChange,
  label,
  date,
}: MatchTransactionCheckboxProps) {
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
      <Stack spacing={2}>
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
