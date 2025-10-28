// @ts-nocheck
import { useHistory } from 'react-router-dom';
import { DashboardInsider } from '@/components';
import { ImportView } from '@/containers/Import';

export default function TaxRatesImport() {
  const history = useHistory();

  const handleCancelBtnClick = () => {
    history.push('/tax-rates');
  };
  const handleImportSuccess = () => {
    history.push('/tax-rates');
  };

  return (
    <DashboardInsider name={'import-tax-rates'}>
      <ImportView
        resource={'tax-rate'}
        onCancelClick={handleCancelBtnClick}
        onImportSuccess={handleImportSuccess}
      />
    </DashboardInsider>
  );
}
