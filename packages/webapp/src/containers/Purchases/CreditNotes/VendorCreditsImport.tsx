// @ts-nocheck
import { useHistory } from 'react-router-dom';
import { DashboardInsider } from '@/components';
import { ImportView } from '@/containers/Import';

export function VendorCreditsImport() {
  const history = useHistory();

  const handleCancelBtnClick = () => {
    history.push('/vendor-credits');
  };
  const handleImportSuccess = () => {
    history.push('/vendor-credits');
  };

  return (
    <DashboardInsider name={'import-vendor-credit'}>
      <ImportView
        resource={'vendor_credit'}
        onCancelClick={handleCancelBtnClick}
        onImportSuccess={handleImportSuccess}
      />
    </DashboardInsider>
  );
}
