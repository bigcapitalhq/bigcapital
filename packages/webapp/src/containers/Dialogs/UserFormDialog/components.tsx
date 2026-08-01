import { Callout, Intent } from '@blueprintjs/core';
import { includes } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';

interface UserFormCalloutAlertsProps {
  calloutCodes: number[];
}

export function UserFormCalloutAlerts({
  calloutCodes,
}: UserFormCalloutAlertsProps): React.ReactElement | null {
  if (!includes(calloutCodes, 200)) return null;
  return (
    <Callout icon={null} intent={Intent.DANGER}>
      {intl.get('roles.error.you_cannot_change_your_own_role')}
    </Callout>
  );
}
