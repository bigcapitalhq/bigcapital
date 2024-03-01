// @ts-nocheck
import styled from 'styled-components';
import { Stack } from '@/components';
import { TellerIcon } from '../Icons/TellerIcon';
import { YodleeIcon } from '../Icons/YodleeIcon';
import { PlaidIcon } from '../Icons/PlaidIcon';
import { BankServiceCard } from './ConnectBankServiceCard';

const TopDesc = styled('p')`
  margin-bottom: 20px;
  color: #5f6b7c;
`;

export function ConnectBankDialogContent() {
  return (
    <div>
      <TopDesc>
        Connect your bank accounts and fetch the bank transactions using
        one of our supported third-party service providers.
      </TopDesc>

      <Stack>
        <BankServiceCard
          title={'Plaid (US, UK & Canada)'}
          icon={<PlaidIcon />}
        >
          Plaid gives the connection to 12,000 financial institutions across US, UK and Canada.
        </BankServiceCard>

        <BankServiceCard
          title={'Teller (US) — Soon'}
          icon={<TellerIcon />}
          disabled
        >
          Connect instantly with more than 5,000 financial institutions across US.
        </BankServiceCard>

        <BankServiceCard
          title={'Yodlee (Global) — Soon'}
          icon={<YodleeIcon />}
          disabled
        >
          Connect instantly with a global network of financial institutions.
        </BankServiceCard>
      </Stack>
    </div>
  );
}
