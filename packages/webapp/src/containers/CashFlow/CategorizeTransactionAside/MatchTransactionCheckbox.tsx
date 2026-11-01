import { Checkbox, Text } from '@blueprintjs/core';
import clsx from 'classnames';
import React from 'react';
import styles from './MatchTransactionCheckbox.module.scss';
import { Group, Stack } from '@/components';
import { useUncontrolled } from '@/hooks/useUncontrolled';

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

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        checked={_active}
        className={styles.checkbox}
        onChange={handleCheckboxChange}
      />
    </Group>
  );
}
