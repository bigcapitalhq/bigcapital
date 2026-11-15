/**
 * Overview panel order and visibility, persisted per browser. Pure helpers so
 * a stale or hand-edited stored value can never break the page.
 */

/**
 * Default order, in three rows of a three-column grid. Positions are stable:
 * they never move with the data.
 * 1. act now: tasks (two columns) and cash
 * 2. money in motion: owed to you, bills to pay, sales tax
 * 3. how the year is going: net income, revenue and spend (two columns)
 * The single-series revenue and spend tiles, cash in and out and top
 * expenses are optional and start hidden.
 */
export const OVERVIEW_PANEL_IDS = [
  'tasks',
  'cash',
  'owed',
  'bills',
  'sales-tax',
  'net-income',
  'revenue-spend',
  'revenue',
  'spend',
  'cash-flow',
  'top-expenses',
] as const;

export type OverviewPanelId = (typeof OVERVIEW_PANEL_IDS)[number];

/** Wide spans two columns with 12 months; narrow is one column, 6 months. */
export type OverviewPanelSize = 'wide' | 'narrow';

export interface OverviewPanelPref {
  id: OverviewPanelId;
  visible: boolean;
  /** Set only for panels that come in both sizes. */
  size?: OverviewPanelSize;
}

const RESIZABLE: ReadonlySet<OverviewPanelId> = new Set([
  'tasks',
  'revenue-spend',
  'cash-flow',
]);

export const isResizable = (id: OverviewPanelId): boolean => RESIZABLE.has(id);

// optional panels start hidden.
const HIDDEN_BY_DEFAULT: ReadonlySet<OverviewPanelId> = new Set([
  'revenue',
  'spend',
  'cash-flow',
  'top-expenses',
]);

const defaultPref = (id: OverviewPanelId): OverviewPanelPref =>
  isResizable(id)
    ? { id, visible: !HIDDEN_BY_DEFAULT.has(id), size: 'wide' }
    : { id, visible: !HIDDEN_BY_DEFAULT.has(id) };

export const DEFAULT_OVERVIEW_PANELS: readonly OverviewPanelPref[] =
  OVERVIEW_PANEL_IDS.map(defaultPref);

const isPanelId = (value: unknown): value is OverviewPanelId =>
  (OVERVIEW_PANEL_IDS as readonly unknown[]).includes(value);

const isPanelSize = (value: unknown): value is OverviewPanelSize =>
  value === 'wide' || value === 'narrow';

/**
 * Earlier defaults, as Reset stored them, with the panels each one hid. Only
 * Reset writes an untouched default, so a stored value equal to one of these
 * was never customized and moves to the current default; any other order is
 * the user's and is kept.
 */
const PREVIOUS_DEFAULTS: ReadonlyArray<{
  ids: readonly string[];
  hidden: readonly string[];
}> = [
  {
    ids: [
      'cash',
      'net-income',
      'revenue',
      'spend',
      'owed',
      'bills',
      'top-expenses',
    ],
    hidden: ['top-expenses'],
  },
  {
    ids: [
      'cash',
      'net-income',
      'revenue',
      'owed',
      'bills',
      'sales-tax',
      'tasks',
      'spend',
      'top-expenses',
    ],
    hidden: ['top-expenses'],
  },
  {
    ids: [
      'tasks',
      'cash',
      'owed',
      'bills',
      'sales-tax',
      'net-income',
      'revenue',
      'spend',
      'top-expenses',
    ],
    hidden: ['top-expenses'],
  },
];

function isPreviousDefault(stored: unknown[]): boolean {
  const items = stored.map((item) => {
    const { id, visible } = (item ?? {}) as { id?: unknown; visible?: unknown };
    return { id, visible: visible !== false };
  });
  return PREVIOUS_DEFAULTS.some(
    ({ ids, hidden }) =>
      ids.length === items.length &&
      ids.every(
        (id, index) =>
          items[index].id === id &&
          items[index].visible === !hidden.includes(id),
      ),
  );
}

/**
 * Keeps the stored order of known panels, drops unknown or duplicate ids and
 * appends panels added since the value was stored.
 */
export function normalizePanels(stored: unknown): OverviewPanelPref[] {
  const panels: OverviewPanelPref[] = [];
  const seen = new Set<OverviewPanelId>();

  if (Array.isArray(stored) && isPreviousDefault(stored)) {
    return DEFAULT_OVERVIEW_PANELS.map((panel) => ({ ...panel }));
  }
  if (Array.isArray(stored)) {
    for (const item of stored) {
      const id = (item as { id?: unknown } | null)?.id;
      if (!isPanelId(id) || seen.has(id)) continue;
      seen.add(id);
      const { visible, size } = item as { visible?: unknown; size?: unknown };
      panels.push(
        isResizable(id)
          ? {
              id,
              visible: visible !== false,
              size: isPanelSize(size) ? size : 'wide',
            }
          : { id, visible: visible !== false },
      );
    }
  }
  for (const fallback of DEFAULT_OVERVIEW_PANELS) {
    if (!seen.has(fallback.id)) panels.push({ ...fallback });
  }
  return panels;
}

/** Moves the panel at `index` one place up (-1) or down (+1). */
export function movePanel(
  panels: OverviewPanelPref[],
  index: number,
  direction: -1 | 1,
): OverviewPanelPref[] {
  const target = index + direction;
  if (index < 0 || target < 0 || target >= panels.length) return panels;
  const next = [...panels];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function togglePanel(
  panels: OverviewPanelPref[],
  id: OverviewPanelId,
): OverviewPanelPref[] {
  return panels.map((panel) =>
    panel.id === id ? { ...panel, visible: !panel.visible } : panel,
  );
}

export function resizePanel(
  panels: OverviewPanelPref[],
  id: OverviewPanelId,
  size: OverviewPanelSize,
): OverviewPanelPref[] {
  return panels.map((panel) =>
    panel.id === id && isResizable(id) ? { ...panel, size } : panel,
  );
}
