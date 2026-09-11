declare module 'react-grid-system' {
  import type { ComponentType, HTMLAttributes, ReactNode } from 'react';

  export interface RowProps extends HTMLAttributes<HTMLDivElement> {
    gutterWidth?: number;
    children?: ReactNode;
  }

  export interface ColProps extends HTMLAttributes<HTMLDivElement> {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    children?: ReactNode;
  }

  export const Row: ComponentType<RowProps>;
  export const Col: ComponentType<ColProps>;
  export const Container: ComponentType<HTMLAttributes<HTMLDivElement>>;
  export const ScreenClassProvider: ComponentType<{ children?: ReactNode }>;
  export function useScreenClass(): string;
}
