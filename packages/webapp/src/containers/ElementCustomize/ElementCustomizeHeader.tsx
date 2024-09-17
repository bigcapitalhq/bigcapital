import { Button, Classes } from '@blueprintjs/core';
import { Group, Icon } from '@/components';
import styles from './ElementCustomizeHeader.module.scss';

interface ElementCustomizeHeaderProps {
  label?: string;
  children?: React.ReactNode;
  closeButton?: boolean;
  onClose?: () => void;
}

export function ElementCustomizeHeader({
  label,
  closeButton,
  onClose,
  children,
}: ElementCustomizeHeaderProps) {
  const handleClose = () => {
    onClose && onClose();
  };
  return (
    <Group className={styles.root}>
      {label && <h1 className={styles.title}>{label}</h1>}
      {closeButton && (
        <Button
          aria-label="Close"
          className={Classes.DIALOG_CLOSE_BUTTON}
          icon={<Icon icon={'smallCross'} color={'#000'} />}
          minimal={true}
          onClick={handleClose}
          style={{ marginLeft: 'auto' }}
        />
      )}
    </Group>
  );
}
