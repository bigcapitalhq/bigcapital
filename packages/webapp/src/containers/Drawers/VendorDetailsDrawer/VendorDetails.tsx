import clsx from 'classnames';
import { VendorDetailsActionsBar } from './VendorDetailsActionsBar';
import Style from './VendorDetailsDrawer.module.scss';
import { VendorDetailsHeader } from './VendorDetailsHeader';
import { Card } from '@/components';

/**
 * contact detail.
 */
export function VendorDetails() {
  return (
    <div className={clsx(Style.root)}>
      <VendorDetailsActionsBar />

      <Card>
        <VendorDetailsHeader />
      </Card>
    </div>
  );
}
