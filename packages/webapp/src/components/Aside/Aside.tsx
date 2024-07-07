import { Button, Classes } from '@blueprintjs/core';
import clsx from 'classnames';
import { Box, BoxProps, Group } from '../Layout';
import { Icon } from '../Icon';
import styles from './Aside.module.scss';

interface AsideProps extends BoxProps {
  title?: string;
  onClose?: () => void;
  children?: React.ReactNode;
  hideCloseButton?: boolean;
  classNames?: Record<string, string>;
  className?: string;
}

export function Aside({
  title,
  onClose,
  children,
  hideCloseButton,
  classNames,
  className
}: AsideProps) {
  const handleClose = () => {
    onClose && onClose();
  };
  return (
    <Box className={clsx(styles.root, className, classNames?.root)}>
      <Group position="apart" className={clsx(styles.title, classNames?.title)}>
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

      {children}
    </Box>
  );
}

interface AsideContentProps extends BoxProps {}

function AsideContent({ ...props }: AsideContentProps) {
  return <Box {...props} className={clsx(styles.content, props?.className)} />;
}

interface AsideFooterProps extends BoxProps {}

function AsideFooter({ ...props }: AsideFooterProps) {
  return <Box {...props} />;
}

Aside.Body = AsideContent;
Aside.Footer = AsideFooter;
