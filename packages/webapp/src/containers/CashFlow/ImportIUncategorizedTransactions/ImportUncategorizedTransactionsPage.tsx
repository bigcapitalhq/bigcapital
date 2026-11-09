import { useHistory, useParams } from 'react-router-dom';
import { DashboardInsider } from '@/components';
import { ImportView } from '@/containers/Import/ImportView';

export function ImportUncategorizedTransactions() {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const handleImportSuccess = () => {
    history.push(
      `/cashflow-accounts/${params.id}/transactions?filter=uncategorized`,
    );
  };
  const handleCnacelBtnClick = () => {
    history.push(
      `/cashflow-accounts/${params.id}/transactions?filter=uncategorized`,
    );
  };

  return (
    <DashboardInsider name={'import-uncategorized-bank-transactions'}>
      <ImportView
        resource={'uncategorized_bank_transaction'}
        params={{ accountId: params.id }}
        onImportSuccess={handleImportSuccess}
        onCancelClick={handleCnacelBtnClick}
        sampleFileName={'sample_bank_transactions'}
      />
    </DashboardInsider>
  );
}
