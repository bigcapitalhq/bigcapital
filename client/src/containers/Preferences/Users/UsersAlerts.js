import React from 'react';
import UserDeleteAlert from 'containers/Alerts/Users/UserDeleteAlert';
import UserInactivateAlert from 'containers/Alerts/Users/UserInactivateAlert';
import UserActivateAlert from 'containers/Alerts/Users/UserActivateAlert';

export default function UsersAlerts() {
  return (
    <>
      <UserDeleteAlert name={'user-delete'} />
      <UserInactivateAlert name={'user-inactivate'} />
      <UserActivateAlert name={'user-activate'} />
    </>
  );
}
