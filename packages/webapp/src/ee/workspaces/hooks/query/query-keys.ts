export const WORKSPACES = 'WORKSPACES';
export const WORKSPACE = 'WORKSPACE';

export const workspacesKeys = {
  all: () => [WORKSPACES] as const,
  list: (query?: Record<string, unknown>) => [WORKSPACES, query] as const,
  detail: (organizationId: string | null | undefined) =>
    [WORKSPACE, organizationId] as const,
};

export const WorkspacesQueryKeys = {
  WORKSPACES,
  WORKSPACE,
} as const;
