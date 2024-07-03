import { Button, Classes } from '@blueprintjs/core';
import { Box, Group } from '../Layout';
import { Icon } from '../Icon';
import styles from './Aside.module.scss';

interface AsideProps {
  title?: string;
  onClose?: () => void;
  children?: React.ReactNode;
  hideCloseButton?: boolean;
}

export function Aside({
  title,
  onClose,
  children,
  hideCloseButton,
}: AsideProps) {
  const handleClose = () => {
    onClose && onClose();
  };
  return (
    <Box className={styles.root}>
      <Group position="apart" className={styles.title}>
        {title}

        {hideCloseButton !== true && (
          <Button
            aria-label="Close"
            className={Classes.DIALOG_CLOSE_BUTTON}
            icon={<Icon icon={'smallCross'} color={'#000'} />}
            minimal={true}
            onClick={handleClose}
          />
        )}
      </Group>
      <Box className={styles.content}>{children}</Box>
    </Box>
  );
}