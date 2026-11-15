/**
 * Overview panel order and visibility, persisted per browser. Pure helpers so
 * a stale or hand-edited stored value can never break the page.
 */

export const OVERVIEW_PANEL_IDS = [
  'cash',
  'net-income',
  'revenue',
  'spend',
  'owed',
  'bills',
  'top-expenses',
] as const;

export type OverviewPanelId = (typeof OVERVIEW_PANEL_IDS)[number];

export interface OverviewPanelPref {
  id: OverviewPanelId;
  visible: boolean;
}

// optional panels start hidden.
const HIDDEN_BY_DEFAULT: ReadonlySet<OverviewPanelId> = new Set([
  'top-expenses',
]);

export const DEFAULT_OVERVIEW_PANELS: readonly OverviewPanelPref[] =
  OVERVIEW_PANEL_IDS.map((id) => ({ id, visible: !HIDDEN_BY_DEFAULT.has(id) }));

const isPanelId = (value: unknown): value is OverviewPanelId =>
  (OVERVIEW_PANEL_IDS as readonly unknown[]).includes(value);

/**
 * Keeps the stored order of known panels, drops unknown or duplicate ids and
 * appends panels added since the value was stored.
 */
export function normalizePanels(stored: unknown): OverviewPanelPref[] {
  const panels: OverviewPanelPref[] = [];
  const seen = new Set<OverviewPanelId>();

  if (Array.isArray(stored)) {
    for (const item of stored) {
      const id = (item as { id?: unknown } | null)?.id;
      if (!isPanelId(id) || seen.has(id)) continue;
      seen.add(id);
      panels.push({
        id,
        visible: (item as { visible?: unknown }).visible !== false,
      });
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
