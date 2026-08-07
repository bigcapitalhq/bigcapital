// @ts-nocheck
import { useHistory } from 'react-router-dom';
import { DashboardInsider } from '@/components';
import { ImportView } from '@/containers/Import';

export function CreditNotesImport() {
  const history = useHistory();

  const handleCancelBtnClick = () => {
    history.push('/credit-notes');
  };
  const handleImportSuccess = () => {
    history.push('/credit-notes');
  };

  return (
    <DashboardInsider name={'import-credit-notes'}>
      <ImportView
        resource={'credit_note'}
        onCancelClick={handleCancelBtnClick}
        onImportSuccess={handleImportSuccess}
      />
    </DashboardInsider>
  );
}
