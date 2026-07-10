import clsx from 'classnames';
import { CustomerDetailsActionsBar } from './CustomerDetailsActionsBar';
import Style from './CustomerDetailsDrawer.module.scss';
import { CustomerDetailsHeader } from './CustomerDetailsHeader';
import { Card } from '@/components';

/**
 * contact detail.
 */
export function CustomerDetails() {
  return (
    <div className={clsx(Style.root)}>
      <CustomerDetailsActionsBar />

      <Card>
        <CustomerDetailsHeader />
      </Card>
    </div>
  );
}
