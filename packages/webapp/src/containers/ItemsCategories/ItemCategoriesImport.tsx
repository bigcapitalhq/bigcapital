import { useHistory } from 'react-router-dom';
import { ImportView } from '../Import/ImportView';
import { DashboardInsider } from '@/components';

export function ItemCategoriesImport() {
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
