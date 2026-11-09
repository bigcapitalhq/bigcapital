import { HTMLAttributes, ElementType } from 'react';

export type Range = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface ItemProps extends HTMLAttributes<HTMLDivElement> {
  gap?: number;
  col: Range;
  marginBottom?: number;
  stretch?: boolean;
  as?: ElementType;
}

export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  gap?: number;
  align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  col?: Range;
  as?: ElementType;
}
