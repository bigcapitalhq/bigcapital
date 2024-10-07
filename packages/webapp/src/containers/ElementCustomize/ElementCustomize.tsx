import React from 'react';
import { Group } from '@/components';
import { ElementCustomizeProvider } from './ElementCustomizeProvider';
import {
  ElementCustomizeForm,
  ElementCustomizeFormProps,
} from './ElementCustomizerForm';
import { ElementCustomizeTabsControllerProvider } from './ElementCustomizeTabsController';
import { ElementCustomizeFields } from './ElementCustomizeFields';
import { ElementCustomizePreview } from './ElementCustomizePreview';
import { extractChildren } from '@/utils/extract-children';
import { ElementPreviewState } from '../BrandingTemplates/types';

export interface ElementCustomizeProps<T, Y>
  extends ElementCustomizeFormProps<T, Y> {
  brandingState?: Y;
  children?: React.ReactNode;
}

export function ElementCustomize<T, Y extends ElementPreviewState>({
  initialValues,
  validationSchema,
  brandingState,
  onSubmit,
  children,
}: ElementCustomizeProps<T, Y>) {
  const PaperTemplate = React.useMemo(
    () => extractChildren(children, ElementCustomize.PaperTemplate),
    [children],
  );
  const CustomizeTabs = React.useMemo(
    () => extractChildren(children, ElementCustomize.FieldsTab),
    [children],
  );

  const value = { PaperTemplate, CustomizeTabs, brandingState };

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
  return <>{children}</>;
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
  return <>{children}</>;
};
