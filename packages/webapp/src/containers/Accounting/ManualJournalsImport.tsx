// @ts-nocheck
import { DashboardInsider } from '@/components';
import { ImportView } from '../Import/ImportView';
import { useHistory } from 'react-router-dom';

export default function ManualJournalsImport() {
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
