import React from 'react';
import {
  DEFAULT_OVERVIEW_PANELS,
  movePanel,
  normalizePanels,
  togglePanel,
} from './overviewPanels';
import type { OverviewPanelId, OverviewPanelPref } from './overviewPanels';
import { useLocalStorage } from '@/hooks/utils';

export type HomepageView = 'overview' | 'classic';

/** Overview or the classic shortcut boxes, remembered per browser. */
export function useHomepageView() {
  const [stored, setStored] = useLocalStorage<unknown>(
    'homepage.view',
    'overview',
  );
  const view: HomepageView = stored === 'classic' ? 'classic' : 'overview';
  return [view, setStored as (view: HomepageView) => void] as const;
}

/** Whether prior-year marks and deltas show, remembered per browser. */
export function useOverviewCompare() {
  const [stored, setStored] = useLocalStorage<unknown>(
    'homepage.overview.compare',
    true,
  );
  return [stored !== false, setStored as (compare: boolean) => void] as const;
}

/** Panel order and visibility, remembered per browser. */
export function useOverviewPanels() {
  const [stored, setStored] = useLocalStorage<unknown>(
    'homepage.overview.panels',
    DEFAULT_OVERVIEW_PANELS,
  );
  const panels = React.useMemo(() => normalizePanels(stored), [stored]);

  return {
    panels,
    move: (index: number, direction: -1 | 1) =>
      setStored(movePanel(panels, index, direction)),
    toggle: (id: OverviewPanelId) => setStored(togglePanel(panels, id)),
    reset: () => setStored([...DEFAULT_OVERVIEW_PANELS]),
  };
}

export type { OverviewPanelPref };
