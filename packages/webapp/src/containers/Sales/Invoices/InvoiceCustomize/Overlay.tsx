import clsx from 'classnames';
import styles from './Overlay.module.scss';
import { Box } from '@/components';

export interface OverlayProps {
  visible?: boolean;
  children?: React.ReactNode;
}

export function Overlay({ children, visible }: OverlayProps) {
  return (
    <Box
      className={clsx(styles.root, {
        [styles.visible]: visible,
      })}
    >
      {children}
    </Box>
  );
}
