// Query key constants
export const ACCOUNTS_TEMPLATES = 'ACCOUNTS_TEMPLATES';
export const ACCOUNTS_TEMPLATE_PREVIEW = 'ACCOUNTS_TEMPLATE_PREVIEW';

// Query key factory
export const accountsTemplatesKeys = {
  list: () => [ACCOUNTS_TEMPLATES] as const,
  preview: (templateKey?: string | null, variant?: string | null) =>
    [ACCOUNTS_TEMPLATE_PREVIEW, templateKey, variant] as const,
};
