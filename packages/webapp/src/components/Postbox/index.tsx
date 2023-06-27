// @ts-nocheck
import React, { useState } from 'react';
import { Collapse } from '@blueprintjs/core';
import classNames from 'classnames';

/**
 * Postbox.
 */
export function Postbox({
  defaultOpen = true,
  toggleable = true,
  title,
  children,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Handle the title click.
  const handleTitleClick = () => {
    if (toggleable) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      class={classNames('postbox', {
        'is-toggleable': toggleable,
      })}
    >
      <div class="postbox__header" onClick={handleTitleClick}>
        <h5 class="postbox__title">{title}</h5>

        <span class="postbox__toggle-indicator"></span>
      </div>
      <div class="postbox__content">
        <Collapse isOpen={isOpen}>
          <div class="postbox__content-inner">{children}</div>
        </Collapse>
      </div>
    </div>
  );
}
