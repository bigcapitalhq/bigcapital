import { Tag } from '@blueprintjs/core';
import { useUncontrolled } from '@/hooks/useUncontrolled';
import { Box } from '../Layout';
import styles from './TagsControl.module.scss';

interface TagsControProps {
  options: Array<{ label: string; value: string }>;
  initialValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function TagsControl({
  options,
  initialValue,
  value,
  onValueChange,
}: TagsControProps) {
  const [_value, handleChange] = useUncontrolled<string>({
    initialValue,
    value,
    onChange: onValueChange,
    finalValue: '',
  });

  return (
    <Box className={styles.root}>
      {options.map((option, index) => (
        <Tag
          key={index}
          round
          interactive
          onClick={() => handleChange(option.value)}
          minimal={option.value !== _value}
          className={styles.tag}
        >
          {option.label}
        </Tag>
      ))}
    </Box>
  );
}
