// @ts-nocheck
import { DashboardInsider } from '@/components';
import { ImportView } from '../Import/ImportView';
import { useHistory } from 'react-router-dom';

export default function CustomersImport() {
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
