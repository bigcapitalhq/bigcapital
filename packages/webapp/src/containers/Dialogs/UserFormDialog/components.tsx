import { Callout, Intent } from '@blueprintjs/core';
import { includes } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { UserFormCalloutCode } from './utils';

interface UserFormCalloutAlertsProps {
  calloutCodes: number[];
}

export function UserFormCalloutAlerts({
  calloutCodes,
}: UserFormCalloutAlertsProps): React.ReactElement | null {
  if (includes(calloutCodes, UserFormCalloutCode.OwnRole)) {
    return (
      <Callout icon={null} intent={Intent.DANGER}>
        {intl.get('roles.error.you_cannot_change_your_own_role')}
      </Callout>
    );
  }
  if (includes(calloutCodes, UserFormCalloutCode.GrantRole)) {
    return (
      <Callout icon={null} intent={Intent.DANGER}>
        {intl.get('roles.error.you_cannot_grant_this_role')}
      </Callout>
    );
  }
  if (includes(calloutCodes, UserFormCalloutCode.LastAdmin)) {
    return (
      <Callout icon={null} intent={Intent.DANGER}>
        {intl.get('roles.error.you_cannot_remove_the_last_admin')}
      </Callout>
    );
  }
  return null;
}
