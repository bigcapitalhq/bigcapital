// Attachments module doesn't have specific query keys defined in types.tsx
// Query keys are defined locally in the queries file

// Query key factory (for future use)
export const attachmentsKeys = {
  all: () => ['ATTACHMENTS'] as const,
} as const;

// Grouped object for use in components/hooks
export const AttachmentsQueryKeys = {
  ATTACHMENTS: 'ATTACHMENTS',
} as const;
