// Import module query keys
export const ImportPreview = 'ImportPreview';
export const ImportFileMeta = 'ImportFileMeta';

// Query key factory
export const importKeys = {
  preview: (importId: string) => [ImportPreview, importId] as const,
  fileMeta: (importId: string) => [ImportFileMeta, importId] as const,
};

// Grouped object for use in components/hooks
export const ImportQueryKeys = {
  ImportPreview,
  ImportFileMeta,
} as const;
