import type { ComponentProps, ReactNode } from 'react';
import { FInputGroup, FSwitch, Group, Stack } from '@/components';
import { CLASSES } from '@/constants';

interface ElementCustomizeFieldsGroupProps {
  label: string;
  children: ReactNode;
}

interface ElementCustomizeContentItemFieldGroupProps {
  inputGroupProps: ComponentProps<typeof FSwitch>;
  switchProps?: Partial<ComponentProps<typeof FInputGroup>>;
}

export function ElementCustomizeFieldsGroup({
  label,
  children,
}: ElementCustomizeFieldsGroupProps) {
  return (
    <Stack spacing={20}>
      <h4 className={CLASSES.TEXT_MUTED} style={{ fontWeight: 600 }}>
        {label}
      </h4>

      <Stack spacing={14}>{children}</Stack>
    </Stack>
  );
}

export function ElementCustomizeContentItemFieldGroup({
  inputGroupProps,
  switchProps,
}: ElementCustomizeContentItemFieldGroupProps) {
  return (
    <Group spacing={14} position={'apart'}>
      <FSwitch {...inputGroupProps} fastField />

      {switchProps?.name && (
        <FInputGroup
          {...(switchProps as ComponentProps<typeof FInputGroup>)}
          style={{ maxWidth: 150 }}
          fastField
        />
      )}
    </Group>
  );
}
