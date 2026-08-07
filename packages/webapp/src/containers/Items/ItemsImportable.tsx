import { ImportView } from '../Import/ImportView';
import { DashboardInsider } from '@/components';

export function ItemsImport() {
  return (
    <DashboardInsider name={'import-items'}>
      <ImportView resource={'items'} />
    </DashboardInsider>
  );
}
