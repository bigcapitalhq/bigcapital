// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
} from '@blueprintjs/core';

import { useContactDetailDrawerContext } from './ContactDetailDrawerProvider';

import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { DashboardActionsBar, Icon, FormattedMessage as T } from '@/components';

import { safeCallback, compose } from '@/utils';

function ContactDetailActionsBar({
  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const { contact, contactId } = useContactDetailDrawerContext();
  const history = useHistory();

  // Handle edit contact.
  const onEditContact = () => {
    return contactId
      ? (history.push(`/${contact?.contact_service}s/${contactId}/edit`),
        closeDrawer('contact-detail-drawer'))
      : null;
  };

  // Handle delete contact.
  const onDeleteContact = () => {
    return contactId
      ? (openAlert(`${contact?.contact_service}-delete`, { contactId }),
        closeDrawer('contact-detail-drawer'))
      : null;
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_contact', { name: contact?.contact_service })}
          onClick={safeCallback(onEditContact)}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'trash-16'} iconSize={16} />}
          text={<T id={'delete'} />}
          intent={Intent.DANGER}
          onClick={safeCallback(onDeleteContact)}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDrawerActions,
  withAlertsActions,
)(ContactDetailActionsBar);
