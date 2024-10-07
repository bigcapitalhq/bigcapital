import React, { createContext, useContext } from 'react';
import { Spinner } from '@blueprintjs/core';
import {
  GetPdfTemplateBrandingStateResponse,
  GetPdfTemplateResponse,
  useGetPdfTemplate,
  useGetPdfTemplateBrandingState,
} from '@/hooks/query/pdf-templates';

interface PdfTemplateContextValue {
  templateId: number | string;

  // Pdf template.
  pdfTemplate: GetPdfTemplateResponse | undefined;
  isPdfTemplateLoading: boolean;

  // Branding state.
  brandingTemplateState: GetPdfTemplateBrandingStateResponse;
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
  // Retrieves the branding template state.
  const { data: brandingTemplateState, isLoading: isBrandingTemplateLoading } =
    useGetPdfTemplateBrandingState();

  const isLoading = isPdfTemplateLoading ||
    isBrandingTemplateLoading ||
    !brandingTemplateState;

  if (isLoading) {
    return <Spinner size={20} />;
  }
  const value = {
    templateId,
    pdfTemplate,
    isPdfTemplateLoading,

    brandingTemplateState,
    isBrandingTemplateLoading,
  };

  return (
    <PdfTemplateContext.Provider value={value}>
      {children}
    </PdfTemplateContext.Provider>
  );
};

export const useBrandingTemplateBoot = () => {
  return useContext<PdfTemplateContextValue>(PdfTemplateContext);
};
