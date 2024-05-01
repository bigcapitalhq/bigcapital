// @ts-nocheck
import { DashboardInsider } from '@/components';
import { ImportView } from '@/containers/Import';
import { useHistory } from 'react-router-dom';

export default function VendorCreditsImport() {
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
