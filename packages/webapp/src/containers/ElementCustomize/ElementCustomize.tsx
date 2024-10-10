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
import { TabProps } from '@blueprintjs/core';
import { useBrandingState } from '../BrandingTemplates/_utils';

export interface ElementCustomizeProps<T, Y>
  extends ElementCustomizeFormProps<T, Y> {
  brandingState?: Y;
  children?: React.ReactNode;
}

export interface ElementCustomizeContentProps {
  children?: React.ReactNode;
}

export function ElementCustomizeContent({
  children,
}: ElementCustomizeContentProps) {
  const PaperTemplate = React.useMemo(
    () => extractChildren(children, ElementCustomize.PaperTemplate),
    [children],
  );
  const CustomizeTabs = React.useMemo(
    () => extractChildren(children, ElementCustomize.FieldsTab),
    [children],
  );
  const brandingState = useBrandingState();
  const value = { PaperTemplate, CustomizeTabs, brandingState };

  return (
    <ElementCustomizeTabsControllerProvider>
      <ElementCustomizeProvider value={value}>
        <Group spacing={0} align="stretch">
          <ElementCustomizeFields />
          <ElementCustomizePreview />
        </Group>
      </ElementCustomizeProvider>
    </ElementCustomizeTabsControllerProvider>
  );
}

export function ElementCustomize<T, Y extends ElementPreviewState>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
}: ElementCustomizeProps<T, Y>) {
  return (
    <ElementCustomizeForm
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {children}
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

export interface ElementCustomizeFieldsTabProps {
  id: string;
  label: string;
  children?: React.ReactNode;
  tabProps?: Partial<TabProps>;
}

ElementCustomize.FieldsTab = ({
  id,
  label,
  children,
}: ElementCustomizeFieldsTabProps) => {
  return <>{children}</>;
};
