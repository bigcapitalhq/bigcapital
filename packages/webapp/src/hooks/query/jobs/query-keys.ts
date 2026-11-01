// Query key constants for jobs
export const JOB = 'JOB';

// Query key factory
export const jobsKeys = {
  all: () => [JOB] as const,
  detail: (jobId: string | number | undefined | null) => [JOB, jobId] as const,
};

// Grouped object for use in components/hooks
export const JobsQueryKeys = {
  JOB,
} as const;
