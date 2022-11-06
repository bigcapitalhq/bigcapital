// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { Icon } from '@/components';

import '@/style/components/BigcapitalLoading.scss';

/**
 * Bigcapital logo loading.
 */
export default function BigcapitalLoading({ className }) {
  return (
    <div className={classNames('bigcapital-loading', className)}>
      <div class="center">
        <Icon icon="bigcapital" height={37} width={228} />
      </div>
    </div>
  );
}
