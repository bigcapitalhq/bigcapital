import React from 'react';
import { Intent, Tag } from '@blueprintjs/core';
import { Choose, If } from 'components';
import { FormattedMessage as T, useIntl } from 'react-intl';

export const statusAccessor = (row) => (
  <Choose>
    <Choose.When condition={row.is_delivered && row.is_approved}>
      <Tag minimal={true} intent={Intent.SUCCESS}>
        <T id={'approved'} />
      </Tag>
    </Choose.When>
    <Choose.When condition={row.is_delivered && row.is_rejected}>
      <Tag minimal={true} intent={Intent.DANGER}>
        <T id={'rejected'} />
      </Tag>
    </Choose.When>
    <Choose.When
      condition={row.is_delivered && !row.is_rejected && !row.is_approved}
    >
      <Tag minimal={true} intent={Intent.SUCCESS}>
        <T id={'delivered'} />
      </Tag>
    </Choose.When>
    <Choose.Otherwise>
      <Tag minimal={true}>
        <T id={'draft'} />
      </Tag>
    </Choose.Otherwise>
  </Choose>
);
