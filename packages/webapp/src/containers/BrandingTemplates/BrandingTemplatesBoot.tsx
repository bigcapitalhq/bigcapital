import React, { createContext } from 'react';
import { useGetPdfTemplates } from '@/hooks/query/pdf-templates';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';

interface BrandingTemplatesBootValues {
  pdfTemplates: any;
  isPdfTemplatesLoading: boolean;
}

const BrandingTemplatesBootContext = createContext<BrandingTemplatesBootValues>(
  {} as BrandingTemplatesBootValues,
);

interface BrandingTemplatesBootProps {
  children: React.ReactNode;
}

function BrandingTemplatesBoot({ ...props }: BrandingTemplatesBootProps) {
  const { payload } = useDrawerContext();
  const resource = payload?.resource || null;

  const { data: pdfTemplates, isLoading: isPdfTemplatesLoading } =
    useGetPdfTemplates({ resource });

  const provider = {
    pdfTemplates,
    isPdfTemplatesLoading,
  } as BrandingTemplatesBootValues;

  return <BrandingTemplatesBootContext.Provider value={provider} {...props} />;
}

const useBrandingTemplatesBoot = () =>
  React.useContext<BrandingTemplatesBootValues>(BrandingTemplatesBootContext);

export { BrandingTemplatesBoot, useBrandingTemplatesBoot };
