import simplefinConfig from './simplefin';

describe('simplefin config', () => {
  const originals = {
    SIMPLEFIN_ENABLED: process.env.SIMPLEFIN_ENABLED,
    SIMPLEFIN_SYNC_INTERVAL_HOURS: process.env.SIMPLEFIN_SYNC_INTERVAL_HOURS,
    SIMPLEFIN_INITIAL_SYNC_DAYS: process.env.SIMPLEFIN_INITIAL_SYNC_DAYS,
    SIMPLEFIN_SYNC_OVERLAP_DAYS: process.env.SIMPLEFIN_SYNC_OVERLAP_DAYS,
  };

  afterEach(() => {
    Object.entries(originals).forEach(([key, value]) => {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    });
  });

  it('is enabled with sane defaults when nothing is configured', () => {
    delete process.env.SIMPLEFIN_ENABLED;
    delete process.env.SIMPLEFIN_SYNC_INTERVAL_HOURS;
    delete process.env.SIMPLEFIN_INITIAL_SYNC_DAYS;
    delete process.env.SIMPLEFIN_SYNC_OVERLAP_DAYS;

    expect(simplefinConfig()).toEqual({
      enabled: true,
      syncIntervalHours: 12,
      initialSyncDays: 90,
      syncOverlapDays: 7,
    });
  });

  it('reads the configured values', () => {
    process.env.SIMPLEFIN_ENABLED = 'false';
    process.env.SIMPLEFIN_SYNC_INTERVAL_HOURS = '6';
    process.env.SIMPLEFIN_INITIAL_SYNC_DAYS = '30';
    process.env.SIMPLEFIN_SYNC_OVERLAP_DAYS = '3';

    expect(simplefinConfig()).toEqual({
      enabled: false,
      syncIntervalHours: 6,
      initialSyncDays: 30,
      syncOverlapDays: 3,
    });
  });

  it('ignores invalid numeric values', () => {
    process.env.SIMPLEFIN_SYNC_INTERVAL_HOURS = '-1';
    process.env.SIMPLEFIN_INITIAL_SYNC_DAYS = 'abc';

    const config = simplefinConfig();
    expect(config.syncIntervalHours).toBe(12);
    expect(config.initialSyncDays).toBe(90);
  });
});
