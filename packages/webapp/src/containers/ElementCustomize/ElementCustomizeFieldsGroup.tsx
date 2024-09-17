// @ts-nocheck
import { InputGroupProps, SwitchProps } from '@blueprintjs/core';
import { FInputGroup, FSwitch, Group, Stack } from '@/components';
import { CLASSES } from '@/constants';

export function ElementCustomizeFieldsGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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
}: {
  inputGroupProps: InputGroupProps;
  switchProps?: SwitchProps;
}) {
  return (
    <Group spacing={14} position={'apart'}>
      <FSwitch {...inputGroupProps} fastField />

      {switchProps?.name && (
        <FInputGroup {...switchProps} style={{ maxWidth: 150 }} fastField />
      )}
    </Group>
  );
}
