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
        Contrary to popular belief, Lorem Ipsum is not simply random text. It
        has roots in a piece of classical Latin literature
      </TopDesc>

      <Stack>
        <BankServiceCard
          title={'Plaid (US, UK & Austrial)'}
          icon={<PlaidIcon />}
        >
          Contrary to popular belief, Lorem Ipsum is not simply random text. It
          has roots in a piece of classical Latin literature.
        </BankServiceCard>

        <BankServiceCard
          title={'Teller (US, UK & Austrial) — Soon'}
          icon={<TellerIcon />}
          disabled
        >
          Contrary to popular belief, Lorem Ipsum is not simply random text. It
          has roots in a piece of classical Latin literature.
        </BankServiceCard>

        <BankServiceCard
          title={'Yodlee (US, UK & Austrial) — Soon'}
          icon={<YodleeIcon />}
          disabled
        >
          Contrary to popular belief, Lorem Ipsum is not simply random text. It
          has roots in a piece of classical Latin literature.
        </BankServiceCard>
      </Stack>
    </div>
  );
}
