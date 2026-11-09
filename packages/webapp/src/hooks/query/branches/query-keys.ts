// Query key constants
export const BRANCHES = 'BRANCHES';
export const BRANCH = 'BRANCH';

// Query key factory
export const branchesKeys = {
  all: () => [BRANCHES] as const,
  list: (query?: Record<string, unknown>) => [BRANCHES, query] as const,
  detail: (id: number | string | null | undefined) => [BRANCH, id] as const,
};

// Grouped object for use in components/hooks
export const BranchesQueryKeys = {
  BRANCHES,
  BRANCH,
} as const;
