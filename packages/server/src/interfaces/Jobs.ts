export interface IJobMeta {
  id: string;
  nextRunAt: Date;
  lastModifiedBy: null | Date;
  lockedAt: null | Date;
  lastRunAt: null | Date;
  failCount: number;
  failedAt: null | Date;
  lastFinishedAt: Date | null;
  running: boolean;
  queued: boolean;
  completed: boolean;
  failed: boolean;
}
