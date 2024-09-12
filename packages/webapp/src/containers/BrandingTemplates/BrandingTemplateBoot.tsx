import React, { createContext, useContext } from 'react';
import {
  GetPdfTemplateResponse,
  useGetPdfTemplate,
} from '@/hooks/query/pdf-templates';
import { Spinner } from '@blueprintjs/core';

interface PdfTemplateContextValue {
  templateId: number | string;
  pdfTemplate: GetPdfTemplateResponse | undefined;
  isPdfTemplateLoading: boolean;
}

interface BrandingTemplateProps {
  templateId: number;
  children: React.ReactNode;
}

const PdfTemplateContext = createContext<PdfTemplateContextValue>(
  {} as PdfTemplateContextValue,
);

export const BrandingTemplateBoot = ({
  templateId,
  children,
}: BrandingTemplateProps) => {
  const { data: pdfTemplate, isLoading: isPdfTemplateLoading } =
    useGetPdfTemplate(templateId, {
      enabled: !!templateId,
    });

  const value = {
    templateId,
    pdfTemplate,
    isPdfTemplateLoading,
  };

  if (isPdfTemplateLoading) {
    return <Spinner size={20} />
  }
  return (
    <PdfTemplateContext.Provider value={value}>
      {children}
    </PdfTemplateContext.Provider>
  );
};

export const useBrandingTemplateBoot = () => {
  return useContext<PdfTemplateContextValue>(PdfTemplateContext);
};
