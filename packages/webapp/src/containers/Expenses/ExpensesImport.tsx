// @ts-nocheck
import { useHistory } from 'react-router-dom';
import { ImportView } from '../Import/ImportView';
import { DashboardInsider } from '@/components';

export function ExpensesImport() {
  const history = useHistory();

  const handleCancelBtnClick = () => {
    history.push('/expenses');
  };
  const handleImportSuccess = () => {
    history.push('/expenses');
  };

  return (
    <DashboardInsider name={'import-expenses'}>
      <ImportView
        resource={'expenses'}
        onCancelClick={handleCancelBtnClick}
        onImportSuccess={handleImportSuccess}
      />
    </DashboardInsider>
  );
}
