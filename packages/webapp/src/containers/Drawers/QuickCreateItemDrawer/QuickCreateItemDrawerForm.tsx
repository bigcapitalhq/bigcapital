import React from 'react';
import styled from 'styled-components';
import { ItemFormFormik } from '../../Items/ItemFormFormik';
import {
  ItemFormProvider,
  useItemFormContext,
} from '../../Items/ItemFormProvider';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { Card, DrawerLoading } from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { DRAWERS } from '@/constants/drawers';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { compose } from '@/utils';

interface QuickCreateItemDrawerFormProps
  extends WithDrawerActionsProps,
    WithDashboardActionsProps {
  itemId?: number;
  itemName?: string;
  // Latent bug preserved: action does not exist on WithDashboardActionsProps — runtime ReferenceError on call.
  addQuickActionEvent?: (event: unknown, payload: unknown) => void;
}

function QuickCreateItemDrawerFormInner({
  itemId,
  itemName,
  closeDrawer,
  addQuickActionEvent,
}: QuickCreateItemDrawerFormProps): React.ReactElement {
  const { payload } = useDrawerContext();

  const handleSubmitSuccess = (
    _values: unknown,
    _form: unknown,
    submitPayload: { redirect?: boolean },
  ) => {
    if (submitPayload.redirect) {
      closeDrawer(DRAWERS.QUICK_CREATE_ITEM);
    }
    // The SDK's `createItem` returns void, so there's no created-item id
    // available here. The original @ts-nocheck code read `response.data.id`,
    // which was always undefined — the `addQuickActionEvent` payload's itemId
    // was always undefined. Branch dropped to avoid resurrecting the bug.
  };

  const handleFormCancel = () => {
    closeDrawer(DRAWERS.QUICK_CREATE_ITEM);
  };

  return (
    <ItemFormProvider itemId={itemId}>
      <DrawerItemFormLoading>
        <ItemFormCard>
          <ItemFormFormik
            initialValues={{ name: itemName }}
            onSubmitSuccess={handleSubmitSuccess}
            // @ts-expect-error — latent bug preserved: ItemFormFormik has no `onCancel` prop; handler was silently dropped in @ts-nocheck original.
            onCancel={handleFormCancel}
          />
        </ItemFormCard>
      </DrawerItemFormLoading>
    </ItemFormProvider>
  );
}

function DrawerItemFormLoading({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const { isFormLoading } = useItemFormContext();

  return <DrawerLoading loading={isFormLoading}>{children}</DrawerLoading>;
}

export const QuickCreateItemDrawerForm = compose(
  withDrawerActions,
  withDashboardActions,
)(QuickCreateItemDrawerFormInner);

const ItemFormCard = styled(Card)`
  margin: 15px;
  padding: 25px;
  margin-bottom: calc(15px + 65px);

  .page-form {
    padding: 0;

    &__floating-actions {
      margin-left: -41px;
      margin-right: -41px;
    }
  }
`;
