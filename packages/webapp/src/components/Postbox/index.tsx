import React, { useState } from 'react';
import { Collapse } from '@blueprintjs/core';
import classNames from 'classnames';

/**
 * Postbox.
 */
export function Postbox({ defaultOpen = true, toggable = true, title, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Handle the title click.
  const handleTitleClick = () => {
    if (toggable) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      className={classNames('postbox', {
        'is-toggable': toggable,
      })}
    >
      <div className="postbox__header" onClick={handleTitleClick}>
        <h5 className="postbox__title">{title}</h5>

        <span className="postbox__toggle-indicator"></span>
      </div>
      <div className="postbox__content">
        <Collapse isOpen={isOpen}>
          <div className="postbox__content-inner">{children}</div>
        </Collapse>
      </div>
    </div>
  );
}
