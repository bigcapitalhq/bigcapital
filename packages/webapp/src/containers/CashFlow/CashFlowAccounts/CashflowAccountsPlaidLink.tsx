import { LaunchLink } from '@/containers/Banking/Plaid/PlaidLanchLink';
import { useGetBankingPlaidToken } from '@/hooks/state/banking';

export function CashflowAccountsPlaidLink() {
  const plaidToken = useGetBankingPlaidToken();

  return <LaunchLink userId={3} token={plaidToken} />;
}
