import { useHistory } from 'react-router-dom';
import { ImportView } from '../Import/ImportView';
import { DashboardInsider } from '@/components';

export function AccountsImport() {
  const history = useHistory();

  const handleCancelBtnClick = () => {
    history.push('/accounts');
  };
  const handleImportSuccess = () => {
    history.push('/accounts');
  };

  return (
    <DashboardInsider name={'import-accounts'}>
      <ImportView
        resource={'accounts'}
        onCancelClick={handleCancelBtnClick}
        onImportSuccess={handleImportSuccess}
      />
    </DashboardInsider>
  );
}
