import React from 'react';
import { Box, Group } from '@/components';
import { InvoiceCustomizeProvider } from './InvoiceCustomizeProvider';
import {
  InvoiceCustomizeForm,
  InvoiceCustomizeFormProps,
} from './InvoiceCustomizerForm';
import { InvoiceCustomizeTabsControllerProvider } from './InvoiceCustomizeTabsController';
import { InvoiceCustomizeFields } from './InvoiceCustomizeFields';
import { InvoiceCustomizePreview } from './InvoiceCustomizePreview';
import { extractChildren } from '@/utils/extract-children';

export interface InvoiceCustomizeProps<T> extends InvoiceCustomizeFormProps<T> {
  children?: React.ReactNode;
}

export function InvoiceCustomize<T>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
}: InvoiceCustomizeProps<T>) {
  const PaperTemplate = React.useMemo(
    () => extractChildren(children, InvoiceCustomize.PaperTemplate),
    [children],
  );
  const CustomizeTabs = React.useMemo(
    () => extractChildren(children, InvoiceCustomize.FieldsTab),
    [children],
  );

  const value = { PaperTemplate, CustomizeTabs };

  return (
    <InvoiceCustomizeForm
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <InvoiceCustomizeTabsControllerProvider>
        <InvoiceCustomizeProvider value={value}>
          <Group spacing={0} align="stretch">
            <InvoiceCustomizeFields />
            <InvoiceCustomizePreview />
          </Group>
        </InvoiceCustomizeProvider>
      </InvoiceCustomizeTabsControllerProvider>
    </InvoiceCustomizeForm>
  );
}

export interface InvoiceCustomizePaperTemplateProps {
  children?: React.ReactNode;
}

InvoiceCustomize.PaperTemplate = ({
  children,
}: InvoiceCustomizePaperTemplateProps) => {
  return <Box>{children}</Box>;
};

export interface InvoiceCustomizeContentProps {
  id: string;
  label: string;
  children?: React.ReactNode;
}

InvoiceCustomize.FieldsTab = ({
  id,
  label,
  children,
}: InvoiceCustomizeContentProps) => {
  return <Box>{children}</Box>;
};
