import React from 'react';
import { Intent, Tag } from '@blueprintjs/core';

import { Choose, T } from 'components';

/**
 * Receipt details status.
 * @returns {React.JSX}
 */
export function ReceiptDetailsStatus({ receipt }) {
  return (
    <Choose>
      <Choose.When condition={receipt.is_closed}>
        <Tag round={true} intent={Intent.SUCCESS}>
          <T id={'closed'} />
        </Tag>
      </Choose.When>

      <Choose.Otherwise>
        <Tag intent={Intent.WARNING} round={true}>
          <T id={'draft'} />
        </Tag>
      </Choose.Otherwise>
    </Choose>
  );
}
