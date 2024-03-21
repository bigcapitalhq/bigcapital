import React, { cloneElement } from 'react';
import { upperFirst } from 'lodash';
import { DropzoneContextValue, useDropzoneContext } from './DropzoneProvider';
import { isElement } from '@/utils/is-element';

export interface DropzoneStatusProps {
  children: React.ReactNode;
}

type DropzoneStatusComponent = React.FC<DropzoneStatusProps>;

function createDropzoneStatus(status: keyof DropzoneContextValue) {
  const Component: DropzoneStatusComponent = (props) => {
    const { children, ...others } = props;

    const ctx = useDropzoneContext();
    const _children = isElement(children) ? children : <span>{children}</span>;

    if (ctx[status]) {
      return cloneElement(_children as JSX.Element, others);
    }

    return null;
  };
  Component.displayName = `@bigcapital/core/dropzone/${upperFirst(status)}`;

  return Component;
}

export const DropzoneAccept = createDropzoneStatus('accept');
export const DropzoneReject = createDropzoneStatus('reject');
export const DropzoneIdle = createDropzoneStatus('idle');

export type DropzoneAcceptProps = DropzoneStatusProps;
export type DropzoneRejectProps = DropzoneStatusProps;
export type DropzoneIdleProps = DropzoneStatusProps;
