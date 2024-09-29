import React, { createContext, useContext } from 'react';
import {
  GetPdfTemplateBrandingStateResponse,
  GetPdfTemplateResponse,
  useGetPdfTemplate,
  useGetPdfTemplateBrandingState,
} from '@/hooks/query/pdf-templates';
import { Spinner } from '@blueprintjs/core';

interface PdfTemplateContextValue {
  templateId: number | string;
  pdfTemplate: GetPdfTemplateResponse | undefined;
  isPdfTemplateLoading: boolean;

  // Branding state.
  brandingTemplateState: GetPdfTemplateBrandingStateResponse | undefined;
  isBrandingTemplateLoading: boolean;
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
  // Retreives the branding template state.
  const { data: brandingTemplateState, isLoading: isBrandingTemplateLoading } =
    useGetPdfTemplateBrandingState();

  const value = {
    templateId,
    pdfTemplate,
    isPdfTemplateLoading,

    brandingTemplateState,
    isBrandingTemplateLoading,
  };

  const isLoading = isPdfTemplateLoading || isBrandingTemplateLoading;

  if (isLoading) {
    return <Spinner size={20} />;
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
