// Query key constants for PDF templates
export const PDF_TEMPLATE = 'PdfTemplate';

// Query key factory
export const pdfTemplatesKeys = {
  all: () => [PDF_TEMPLATE] as const,
  list: (query?: unknown) => [PDF_TEMPLATE, query] as const,
  detail: (id: number | string) => [PDF_TEMPLATE, id] as const,
  state: () => [PDF_TEMPLATE, 'state'] as const,
};

// Grouped object for use in components/hooks (for backward compatibility)
export const PdfTemplatesQueryKeys = {
  PDF_TEMPLATE,
} as const;
