// Invite module doesn't have specific query keys defined in types.tsx
// Query keys are defined locally in the queries file

// Query key constants
export const INVITE_META = 'INVITE_META';

// Query key factory
export const inviteKeys = {
  meta: (token: string | null | undefined) => [INVITE_META, token] as const,
};

// Grouped object for use in components/hooks
export const InviteQueryKeys = {
  INVITE_META,
} as const;
