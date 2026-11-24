import styles from './AvatarCell.module.scss';
import { firstLettersArgs } from '@/utils';

interface AvatarCellProps {
  row: { original: { displayName?: string; display_name?: string } };
  size?: string;
}

export default function AvatarCell({
  row: { original },
  size,
}: AvatarCellProps) {
  return (
    <span className={styles.avatar} data-size={size}>
      {firstLettersArgs(original.displayName ?? original.display_name)}
    </span>
  );
}
