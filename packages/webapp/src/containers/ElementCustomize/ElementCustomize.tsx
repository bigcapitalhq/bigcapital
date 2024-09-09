import React from 'react';
import { Box, Group } from '@/components';
import { ElementCustomizeProvider } from './ElementCustomizeProvider';
import {
  ElementCustomizeForm,
  ElementCustomizeFormProps,
} from './ElementCustomizerForm';
import { ElementCustomizeTabsControllerProvider } from './ElementCustomizeTabsController';
import { ElementCustomizeFields } from './ElementCustomizeFields';
import { ElementCustomizePreview } from './ElementCustomizePreview';
import { extractChildren } from '@/utils/extract-children';

export interface ElementCustomizeProps<T> extends ElementCustomizeFormProps<T> {
  children?: React.ReactNode;
}

export function ElementCustomize<T>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
}: ElementCustomizeProps<T>) {
  const PaperTemplate = React.useMemo(
    () => extractChildren(children, ElementCustomize.PaperTemplate),
    [children],
  );
  const CustomizeTabs = React.useMemo(
    () => extractChildren(children, ElementCustomize.FieldsTab),
    [children],
  );

  const value = { PaperTemplate, CustomizeTabs };

  return (
    <ElementCustomizeForm
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <ElementCustomizeTabsControllerProvider>
        <ElementCustomizeProvider value={value}>
          <Group spacing={0} align="stretch">
            <ElementCustomizeFields />
            <ElementCustomizePreview />
          </Group>
        </ElementCustomizeProvider>
      </ElementCustomizeTabsControllerProvider>
    </ElementCustomizeForm>
  );
}

export interface ElementCustomizePaperTemplateProps {
  children?: React.ReactNode;
}

ElementCustomize.PaperTemplate = ({
  children,
}: ElementCustomizePaperTemplateProps) => {
  return <Box>{children}</Box>;
};

export interface ElementCustomizeContentProps {
  id: string;
  label: string;
  children?: React.ReactNode;
}

ElementCustomize.FieldsTab = ({
  id,
  label,
  children,
}: ElementCustomizeContentProps) => {
  return <Box>{children}</Box>;
};
