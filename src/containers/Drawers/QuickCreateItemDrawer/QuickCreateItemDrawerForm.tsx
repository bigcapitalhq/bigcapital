import React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';

import { Card, DrawerLoading } from 'components';

import ItemFormFormik from '../../Items/ItemFormFormik';
import {
  ItemFormProvider,
  useItemFormContext,
} from '../../Items/ItemFormProvider';

import withDrawerActions from 'containers/Drawer/withDrawerActions';
import withDashboardActions from '../../Dashboard/withDashboardActions';

import { useDrawerContext } from 'components/Drawer/DrawerProvider';

/**
 * Drawer item form loading.
 * @returns {JSX}
 */
function DrawerItemFormLoading({ children }) {
  const { isFormLoading } = useItemFormContext();

  return <DrawerLoading loading={isFormLoading}>{children}</DrawerLoading>;
}

/**
 * Quick create/edit item drawer form.
 */
function QuickCreateItemDrawerForm({
  itemId,
  itemName,
  closeDrawer,

  // #withDashboardActions
  addQuickActionEvent,
}) {
  // Drawer context.
  const { payload } = useDrawerContext();

  // Handle the form submit request success.
  const handleSubmitSuccess = (values, form, submitPayload, response) => {
    if (submitPayload.redirect) {
      closeDrawer('quick-create-item');
    }
    if (payload.quickActionEvent) {
      addQuickActionEvent(payload.quickActionEvent, {
        itemId: response.data.id,
      });
    }
  };
  // Handle the form cancel.
  const handleFormCancel = () => {
    closeDrawer('quick-create-item');
  };

  return (
    <ItemFormProvider itemId={itemId}>
      <DrawerItemFormLoading>
        <ItemFormCard>
          <ItemFormFormik
            initialValues={{ name: itemName }}
            onSubmitSuccess={handleSubmitSuccess}
            onCancel={handleFormCancel}
          />
        </ItemFormCard>
      </DrawerItemFormLoading>
    </ItemFormProvider>
  );
}

export default R.compose(
  withDrawerActions,
  withDashboardActions,
)(QuickCreateItemDrawerForm);

const ItemFormCard = styled(Card)`
  margin: 15px;
  margin-bottom: calc(15px + 65px);

  .page-form__floating-actions {
    margin-left: -36px;
    margin-right: -36px;
  }
`;
