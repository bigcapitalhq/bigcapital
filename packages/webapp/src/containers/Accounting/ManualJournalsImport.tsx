// @ts-nocheck
import { useHistory } from 'react-router-dom';
import { ImportView } from '../Import/ImportView';
import { DashboardInsider } from '@/components';

export function ManualJournalsImport() {
  const history = useHistory();

  const handleCancelBtnClick = () => {
    history.push('/manual-journals');
  };
  const handleImportSuccess = () => {
    history.push('/manual-journals');
  };

  return (
    <DashboardInsider name={'import-manual-journals'}>
      <ImportView
        resource={'manual-journals'}
        onCancelClick={handleCancelBtnClick}
        onImportSuccess={handleImportSuccess}
      />
    </DashboardInsider>
  );
}
