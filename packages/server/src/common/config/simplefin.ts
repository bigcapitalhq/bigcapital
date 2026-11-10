import { registerAs } from '@nestjs/config';

const parseBoolean = (value: string | undefined, defaultValue: boolean) => {
  if (value === undefined || value === '') return defaultValue;
  return value === 'true' || value === 'yes' || value === '1';
};

const parsePositiveInt = (value: string | undefined, defaultValue: number) => {
  const parsed = parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
};

export default registerAs('simplefin', () => ({
  // SimpleFIN needs no server-side credentials (each user brings their own
  // setup token), so it is enabled by default whenever bank feeds are enabled.
  enabled: parseBoolean(process.env.SIMPLEFIN_ENABLED, true),

  // How often (in hours) the scheduled job pulls new transactions for each
  // SimpleFIN connection. SimpleFIN Bridge refreshes institution data about
  // once a day, so polling more than a few times a day is rarely useful.
  syncIntervalHours: parsePositiveInt(
    process.env.SIMPLEFIN_SYNC_INTERVAL_HOURS,
    12,
  ),

  // How many days of history to pull the first time a connection is synced.
  initialSyncDays: parsePositiveInt(
    process.env.SIMPLEFIN_INITIAL_SYNC_DAYS,
    90,
  ),

  // How many days before the last successful sync to re-request on every
  // subsequent sync, so late-posted transactions are not missed. Already
  // imported transactions are de-duplicated by their SimpleFIN id.
  syncOverlapDays: parsePositiveInt(process.env.SIMPLEFIN_SYNC_OVERLAP_DAYS, 7),
}));
