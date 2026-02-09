import React, { ReactNode } from 'react';

interface IfProps {
  condition: boolean;
  children?: ReactNode;
  render?: () => ReactNode;
}

export const If = (props: IfProps): React.ReactElement | null =>
  props.condition ? (props.render ? <>{props.render()}</> : <>{props.children}</>) : null;
