import React from 'react';
import { Intent, Tag } from '@blueprintjs/core';

import { T, Choose } from 'components';

/**
 * Estimate details status.
 * @return {React.JSX}
 */
export function EstimateDetailsStatus({ estimate }) {
  return (
    <Choose>
      <Choose.When condition={estimate.is_delivered && estimate.is_approved}>
        <Tag intent={Intent.SUCCESS} round={true}>
          <T id={'approved'} />
        </Tag>
      </Choose.When>
      <Choose.When condition={estimate.is_delivered && estimate.is_rejected}>
        <Tag intent={Intent.DANGER} round={true}>
          <T id={'rejected'} />
        </Tag>
      </Choose.When>
      <Choose.When
        condition={
          estimate.is_delivered &&
          !estimate.is_rejected &&
          !estimate.is_approved
        }
      >
        <Tag intent={Intent.SUCCESS} round={true}>
          <T id={'delivered'} />
        </Tag>
      </Choose.When>
      <Choose.Otherwise>
        <Tag round={true} minimal={true}>
          <T id={'draft'} />
        </Tag>
      </Choose.Otherwise>
    </Choose>
  );
}
