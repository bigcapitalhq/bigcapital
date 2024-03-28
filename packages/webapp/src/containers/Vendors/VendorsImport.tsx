// @ts-nocheck
import { useHistory } from 'react-router-dom';
import { DashboardInsider } from '@/components';
import { ImportView } from '../Import/ImportView';

export default function VendorsImport() {
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
        exampleTitle='Vendors Example'
      />
    </DashboardInsider>
  );
}
