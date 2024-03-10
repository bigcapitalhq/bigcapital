// @ts-nocheck
import React from 'react';
import classNames from 'classnames';

import '@/style/components/Details.scss';

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
  textAlign,
  minLabelSize,
  className,
}) {
  return (
    <div
      className={classNames(
        'details-menu',
        {
          'details-menu--vertical': direction === DIRECTION.VERTICAL,
          'details-menu--horizantal': direction === DIRECTION.HORIZANTAL,
          [`align-${textAlign}`]: textAlign,
        },
        className,
      )}
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
export function DetailItem({ label, children, name, align, className }) {
  const { minLabelSize } = useDetailsMenuContext();

  return (
    <div
      className={classNames(
        'detail-item',
        {
          [`detail-item--${name}`]: name,
          [`align-${align}`]: align,
        },
        className,
      )}
    >
      <div
        style={{
          'min-width': minLabelSize,
        }}
        class="detail-item__label"
      >
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}
