import { Button, Classes } from '@blueprintjs/core';
import { x } from '@xstyled/emotion';
import { Group, Icon } from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useDrawerActions } from '@/hooks/state';

interface SendMailViewHeaderProps {
  label?: string;
  children?: React.ReactNode;
  closeButton?: boolean;
}

export function SendMailViewHeader({
  label,
  closeButton = true,
}: SendMailViewHeaderProps) {
  const { name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();

  const handleClose = () => {
    closeDrawer(name);
  };
  return (
    <Group
      p={'10px'}
      pl={'30px'}
      bg="white"
      alignItems={'center'}
      boxShadow={'0 1px 0 rgba(17, 20, 24, .15)'}
      zIndex={1}
      style={{ position: 'relative' }}
    >
      {label && (
        <x.h1 margin={0} fontSize={20} fontWeight={500} color={'#666'}>
          {label}
        </x.h1>
      )}
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
