import React from 'react';
import classNames from 'classnames';

import 'style/components/Details.scss';

const DIRECTION = {
  VERTICAL: 'vertical',
  HORIZANTAL: 'horizantal',
};

const DetailsMenuContext = React.createContext();
const useDetailsMenuContext = () => React.useContext(DetailsMenuContext);

/**
 * Details menu.
 */
export function DetailsMenu({
  children,
  direction = DIRECTION.VERTICAL,
  minLabelSize,
}) {
  return (
    <div
      className={classNames('details-menu', {
        'details-menu--vertical': direction === DIRECTION.VERTICAL,
        'details-menu--horizantal': direction === DIRECTION.HORIZANTAL,
      })}
    >
      <DetailsMenuContext.Provider value={{ minLabelSize }}>
        {children}
      </DetailsMenuContext.Provider>
    </div>
  );
}

/**
 * Detail item.
 */
export function DetailItem({ label, children, name }) {
  const { minLabelSize } = useDetailsMenuContext();

  return (
    <div
      className={classNames('detail-item', {
        [`detail-item--${name}`]: name,
      })}
    >
      <div
        style={{
          'min-width': minLabelSize,
        }}
        class="detail-item__label"
      >
        {label}
      </div>
      <div class="detail-item__content">{children}</div>
    </div>
  );
}
