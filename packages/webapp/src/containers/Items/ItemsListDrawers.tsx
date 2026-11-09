import { DRAWERS } from '@/constants/drawers';
import { index as ItemDetailDrawer } from '@/containers/Drawers/ItemDetailDrawer';

export function ItemsListDrawers() {
  return (
    <>
      <ItemDetailDrawer name={DRAWERS.ITEM_DETAILS} />
    </>
  );
}
