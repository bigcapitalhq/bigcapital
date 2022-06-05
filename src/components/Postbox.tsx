import React, { useState } from 'react';
import { Collapse } from '@blueprintjs/core';
import classNames from 'classnames';

/**
 * Postbox.
 */
export default function Postbox({
  defaultOpen = true,
  toggable = true,
  title,
  children,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Handle the title click.
  const handleTitleClick = () => {
    if (toggable) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      class={classNames('postbox', {
        'is-toggable': toggable,
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
