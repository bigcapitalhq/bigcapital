// @ts-nocheck
import { DashboardInsider } from '@/components';
import { ImportView } from '../Import/ImportView';
import { useHistory } from 'react-router-dom';

export default function ItemCategoriesImport() {
  const history = useHistory();

  const handleImportSuccess = () => {
    history.push('/items/categories');
  };
  const handleCancelBtnClick = () => {
    history.push('/items/categories');
  };
  return (
    <DashboardInsider name={'import-item-categories'}>
      <ImportView
        resource={'item_category'}
        onImportSuccess={handleImportSuccess}
        onCancelClick={handleCancelBtnClick}
        exampleTitle="Item Categories Example"
        />
    </DashboardInsider>
  );
}
