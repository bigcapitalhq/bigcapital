import { useHistory } from 'react-router-dom';
import { ImportView } from '../Import/ImportView';
import { DashboardInsider } from '@/components';

export function VendorsImport() {
  const history = useHistory();

  const handleImportSuccess = () => {
    history.push('/vendors');
  };
  const handleImportBtnClick = () => {
    history.push('/vendors');
  };

  return (
    <DashboardInsider name={'import-vendors'}>
      <ImportView
        resource={'vendors'}
        onImportSuccess={handleImportSuccess}
        onCancelClick={handleImportBtnClick}
        exampleTitle="Vendors Example"
      />
    </DashboardInsider>
  );
}
