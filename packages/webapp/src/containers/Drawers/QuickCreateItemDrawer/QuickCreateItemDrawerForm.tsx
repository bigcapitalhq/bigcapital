import * as FF from 'fp-ts/function';
import React from 'react';
import styled from 'styled-components';
import { ItemFormFormik } from '../../Items/ItemFormFormik';
import {
  ItemFormProvider,
  useItemFormContext,
} from '../../Items/ItemFormProvider';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { Card, DrawerLoading } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

interface QuickCreateItemDrawerFormProps extends WithDrawerActionsProps {
  itemId?: number;
  itemName?: string;
}

function QuickCreateItemDrawerFormInner({
  itemId,
  itemName,
  closeDrawer,
}: QuickCreateItemDrawerFormProps): React.ReactElement {
  const handleSubmitSuccess = (
    _values: unknown,
    _form: unknown,
    submitPayload: { redirect?: boolean },
  ) => {
    if (submitPayload.redirect) {
      closeDrawer(DRAWERS.QUICK_CREATE_ITEM);
    }
    // The SDK's `createItem` returns void, so no created-item id is available
    // here and the quick-action event cannot be recorded.
  };

  return (
    <ItemFormProvider itemId={itemId}>
      <DrawerItemFormLoading>
        <ItemFormCard>
          <ItemFormFormik
            initialValues={{ name: itemName }}
            onSubmitSuccess={handleSubmitSuccess}
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

export const QuickCreateItemDrawerForm = FF.pipe(
  QuickCreateItemDrawerFormInner,
  withDrawerActions,
);

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
