import { profitLossMonthLink } from '../overviewLinks';
import { buildMonthWindow } from '../overviewSeries';

const monthOf = (today: string, key: string) => {
  const month = buildMonthWindow(today).find((item) => item.key === key);
  if (!month) throw new Error(`no ${key} in the window`);
  return month;
};

const parse = (link: string) => {
  const [path, search] = link.split('?');
  return { path, query: new URLSearchParams(search) };
};

describe('profitLossMonthLink', () => {
  it('opens a finished month from its first to its last day, as one total', () => {
    const { path, query } = parse(
      profitLossMonthLink(monthOf('2026-11-16', '2026-08')),
    );
    expect(path).toBe('/financial-reports/profit-loss-sheet');
    expect(query.get('fromDate')).toBe('2026-08-01');
    expect(query.get('toDate')).toBe('2026-08-31');
    expect(query.get('displayColumnsType')).toBe('total');
    expect(query.has('displayColumnsBy')).toBe(false);
  });

  it('ends the month in progress today, not at the month end', () => {
    const { query } = parse(
      profitLossMonthLink(monthOf('2026-11-16', '2026-11')),
    );
    expect(query.get('fromDate')).toBe('2026-11-01');
    expect(query.get('toDate')).toBe('2026-11-16');
  });

  it('ends a leap February on the 29th', () => {
    const { query } = parse(
      profitLossMonthLink(monthOf('2028-06-10', '2028-02')),
    );
    expect(query.get('toDate')).toBe('2028-02-29');
  });

  it('leaves the basis out so the report uses the organization setting', () => {
    const { query } = parse(
      profitLossMonthLink(monthOf('2026-11-16', '2026-08')),
    );
    expect(query.has('basis')).toBe(false);
  });
});
