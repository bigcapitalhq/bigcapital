// @ts-nocheck
import { useHistory } from 'react-router-dom';
import { DashboardInsider } from '@/components';
import { ImportView } from '@/containers/Import';

export default function InvoicesImport() {
  const history = useHistory();

  const handleCancelBtnClick = () => {
    history.push('/invoices');
  };
  const handleImportSuccess = () => {
    history.push('/invoices');
  };

  return (
    <DashboardInsider name={'import-invoices'}>
      <ImportView
        resource={'sale_invoice'}
        onCancelClick={handleCancelBtnClick}
        onImportSuccess={handleImportSuccess}
      />
    </DashboardInsider>
  );
}
