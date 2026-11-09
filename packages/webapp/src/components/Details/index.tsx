import clsx from 'classnames';
import React from 'react';

import '@/style/components/Details.scss';

const DIRECTION = {
  VERTICAL: 'vertical',
  HORIZANTAL: 'horizantal',
} as const;

interface DetailsMenuProps {
  children?: React.ReactNode;
  direction?: string;
  textAlign?: string;
  minLabelSize?: number | string;
  className?: string;
}

const DetailsMenuContext = React.createContext<{
  minLabelSize?: number | string;
}>({});
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
}: DetailsMenuProps) {
  return (
    <div
      className={clsx(
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

interface DetailItemProps {
  label?: React.ReactNode;
  children?: React.ReactNode;
  name?: string;
  align?: string;
  multiline?: boolean;
  className?: string;
}

/**
 * Detail item.
 */
export function DetailItem({
  label,
  children,
  name,
  align,
  multiline,
  className,
}: DetailItemProps) {
  const { minLabelSize } = useDetailsMenuContext();

  return (
    <div
      className={clsx(
        'detail-item',
        {
          [`detail-item--${name}`]: name,
          [`align-${align}`]: align,
          [`detail-item--multilines`]: multiline,
        },
        className,
      )}
    >
      <div
        style={{
          minWidth: minLabelSize,
        }}
        className="detail-item__label"
      >
        {label}
      </div>
      <div className={clsx('detail-item__content')}>{children}</div>
    </div>
  );
}
