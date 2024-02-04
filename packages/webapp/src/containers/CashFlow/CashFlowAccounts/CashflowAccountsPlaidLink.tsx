import { LaunchLink } from '@/containers/Banking/Plaid/PlaidLanchLink';
import { useGetBankingPlaidToken } from '@/hooks/state/banking';

export function CashflowAccountsPlaidLink() {
  const plaidToken = useGetBankingPlaidToken();

  return <LaunchLink token={plaidToken} />;
}
