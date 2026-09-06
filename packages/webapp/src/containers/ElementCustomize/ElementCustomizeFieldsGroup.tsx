// @ts-nocheck
import { InputGroupProps, SwitchProps } from '@blueprintjs/core';
import { FInputGroup, FSwitch, Group, Stack } from '@/components';
import { CLASSES } from '@/constants';

interface ElementCustomizeFieldsGroupProps {
  label: string;
  children: React.ReactNode;
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
      <FSwitch {...inputGroupProps} fastField />

      {switchProps?.name && (
        <FInputGroup {...switchProps} style={{ maxWidth: 150 }} fastField />
      )}
    </Group>
  );
}
