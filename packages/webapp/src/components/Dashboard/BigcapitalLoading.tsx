import classNames from 'classnames';
import React from 'react';
import { Icon } from '@/components';
import { useIsDarkMode } from '@/hooks/useDarkMode';

import '@/style/components/BigcapitalLoading.scss';

interface BigcapitalLoadingProps {
  className?: string;
}

/**
 * Bigcapital logo loading.
 */
export default function BigcapitalLoading({
  className,
}: BigcapitalLoadingProps) {
  const isDarkmode = useIsDarkMode();

  return (
    <div className={classNames('bigcapital-loading', className)}>
      <div className="center">
        {isDarkmode ? (
          <Icon
            icon="bigcapital-alt"
            height={37}
            width={228}
            color="#fff"
            className="bigcapital-logo"
          />
        ) : (
          <Icon icon="bigcapital" height={37} width={228} />
        )}
      </div>
    </div>
  );
}
