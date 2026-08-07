import { useHistory } from 'react-router-dom';
import { ImportView } from '../Import/ImportView';
import { DashboardInsider } from '@/components';

export function CustomersImport() {
  const history = useHistory();

  const handleImportSuccess = () => {
    history.push('/customers');
  };
  const handleCancelBtnClick = () => {
    history.push('/customers');
  };
  return (
    <DashboardInsider name={'import-customers'}>
      <ImportView
        resource={'customers'}
        onImportSuccess={handleImportSuccess}
        onCancelClick={handleCancelBtnClick}
        exampleTitle="Customers Example"
      />
    </DashboardInsider>
  );
}
