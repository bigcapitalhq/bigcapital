import React from 'react';
import classnames from 'classnames';
import LoadingIndicator from '@/components/LoadingIndicator';

/**
 * Drawer inside.
 */
export function DrawerInsider({
  loading,
  children,
  name,
  mount = false,
  className,
}) {
  return (
    <div className={classnames({
      'drawer__insider': true,
      'drawer__insider--loading': loading,
      [`drawer__insider--${name}`]: !!name,
    }, className)}>
      <LoadingIndicator loading={loading} mount={mount}>
        { children }
      </LoadingIndicator>
    </div>
  );
}