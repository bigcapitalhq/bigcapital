declare module 'react-virtualized' {
  import type { ComponentType, ReactNode } from 'react';

  export interface WindowScrollerProps {
    scrollElement?: HTMLElement | null;
    children?: (props: {
      height: number;
      isScrolling: boolean;
      onChildScroll: (params: { scrollTop: number }) => void;
      scrollTop: number;
    }) => ReactNode;
  }
  export const WindowScroller: ComponentType<WindowScrollerProps>;

  export interface AutoSizerProps {
    disableHeight?: boolean;
    disableWidth?: boolean;
    children?: (props: { width: number; height: number }) => ReactNode;
  }
  export const AutoSizer: ComponentType<AutoSizerProps>;

  export interface ListRowRendererParams {
    index: number;
    key: React.Key;
    isScrolling?: boolean;
    isVisible?: boolean;
    style?: React.CSSProperties;
    parent?: unknown;
  }

  export interface ListProps {
    autoHeight?: boolean;
    className?: string;
    height: number;
    isScrolling?: boolean;
    onScroll?: (params: { scrollTop: number; clientHeight: number }) => void;
    overscanRowCount?: number;
    rowCount: number;
    rowHeight: number;
    rowRenderer: (params: ListRowRendererParams) => ReactNode;
    scrollTop?: number;
    width: number;
  }
  export const List: ComponentType<ListProps>;
}

declare module 'react-use-context-menu' {
  import type { Dispatch, SetStateAction } from 'react';

  type PropsGetter = (props?: Record<string, any>) => Record<string, any>;

  export type ContextMenuState = {
    coords: { x: number; y: number };
    setVisible: Dispatch<SetStateAction<boolean>>;
    isVisible: boolean;
  };

  export type ContextMenuResult = [
    PropsGetter,
    (props?: { className?: string }) => PropsGetter,
    (options?: { collect?: () => unknown }) => [PropsGetter, ContextMenuState],
    ContextMenuState,
  ];

  export default function useContextMenu(): ContextMenuResult;
}
