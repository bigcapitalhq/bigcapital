import { InputGroupProps, SwitchProps } from '@blueprintjs/core';
import type { ReactNode } from 'react';
import { FInputGroup, FSwitch, Group, Stack } from '@/components';
import { CLASSES } from '@/constants';

interface ElementCustomizeFieldsGroupProps {
  label: string;
  children: ReactNode;
}

interface ElementCustomizeContentItemFieldGroupProps {
  inputGroupProps: InputGroupProps & { name?: string; label?: string };
  switchProps?: SwitchProps;
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
      <FSwitch
        {...inputGroupProps}
        name={(inputGroupProps.name || '') as string}
        fastField
      />

      {switchProps?.name && (
        <FInputGroup
          name={switchProps.name}
          style={{ maxWidth: 150 }}
          fastField
        />
      )}
    </Group>
  );
}
