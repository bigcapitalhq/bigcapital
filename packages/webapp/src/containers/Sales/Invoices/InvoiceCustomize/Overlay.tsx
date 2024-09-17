import clsx from 'classnames';
import { Box } from '@/components';
import styles from './Overlay.module.scss';

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
