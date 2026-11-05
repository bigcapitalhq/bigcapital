import { Bill } from './Bill';

/**
 * A query stand-in that records the `where` and `modify` calls a modifier
 * makes, so the modifier's filters can be checked without a database.
 */
const recordingQuery = () => {
  const calls: unknown[][] = [];
  const query = {
    calls,
    where: (...args: unknown[]) => {
      calls.push(['where', ...args]);
      return query;
    },
    modify: (...args: unknown[]) => {
      calls.push(['modify', ...args]);
      return query;
    },
  };
  return query;
};

// The modifiers are called with the recording stand-in, not a real builder.
const modifiers = Bill.modifiers as Record<
  string,
  (query: unknown, ...args: unknown[]) => void
>;

describe('Bill modifiers', () => {
  it('overdue uses the given as-of date', () => {
    const query = recordingQuery();

    modifiers.overdue(query, '2025-12-31');

    expect(query.calls).toEqual([['where', 'due_date', '<', '2025-12-31']]);
  });

  it('dueBillsFromDate passes the as-of date to notOverdue', () => {
    const query = recordingQuery();

    modifiers.dueBillsFromDate(query, '2025-12-31');

    expect(query.calls).toContainEqual(['modify', 'notOverdue', '2025-12-31']);
  });
});
