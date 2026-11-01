import { Button } from '@blueprintjs/core';
import styles from './TagButton.module.scss';
import type { ComponentProps } from 'react';

type TagButtonProps = Omit<ComponentProps<typeof Button>, 'className'> & {
  className?: string;
};

export function TagButton(props: TagButtonProps) {
  return <Button {...props} className={styles.root} />;
}
