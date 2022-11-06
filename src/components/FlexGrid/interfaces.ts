// @ts-nocheck
import { HTMLAttributes, Component, StyleHTMLAttributes } from 'react';

export type Range = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface ItemProps extends HTMLAttributes<HTMLDivElement> {
  gap?: number;
  col: Range;
  marginBottom?: number;
  stretch?: boolean;
  as?: string | Component;
  className?: string;
  style?: StyleHTMLAttributes<HTMLDivElement>;
}

export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  gap?: number;
  align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  col?: Range;
  className?: string;
  style?: StyleHTMLAttributes<HTMLDivElement>;
  as?: string | Component;
}