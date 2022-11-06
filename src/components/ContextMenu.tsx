// @ts-nocheck
import React, { memo } from 'react';
import { Popover, Position, Classes } from '@blueprintjs/core';
import { saveInvoke } from '@/utils';

const POPPER_MODIFIERS = {
  preventOverflow: { boundariesElement: 'viewport' },
};

function ContextMenu(props) {
  const { bindMenu, isOpen, children, onClosed, popoverProps } = props;

  const handleClosed = () => {
    requestAnimationFrame(() => saveInvoke(onClosed));
  };

  const handleInteraction = (nextOpenState) => {
    if (!nextOpenState) {
      // Delay the actual hiding till the event queue clears
      // to avoid flicker of opening twice
      requestAnimationFrame(() => saveInvoke(onClosed));
    }
  };

  return (
    <div className={Classes.CONTEXT_MENU_POPOVER_TARGET} {...bindMenu}>
      <Popover
        onClosed={handleClosed}
        modifiers={POPPER_MODIFIERS}
        content={children}
        enforceFocus={true}
        isOpen={isOpen}
        minimal={true}
        position={Position.RIGHT_TOP}
        target={<div />}
        usePortal={false}
        onInteraction={handleInteraction}
        {...popoverProps}
      />
    </div>
  );
}

export default memo(ContextMenu, (prevProps, nextProps) => {
  if (
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.bindMenu.style === nextProps.bindMenu.style
  ) {
    return true;
  } else {
    return false;
  }
});
