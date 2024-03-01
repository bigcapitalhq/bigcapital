import styled from 'styled-components';
import { Group } from '@/components';

const BankServiceIcon = styled('div')`
  height: 40px;
  width: 40px;
  border: 1px solid #c8cad0;
  border-radius: 3px;
  display: flex;

  svg {
    margin: auto;
  }
`;
const BankServiceContent = styled(`div`)`
  flex: 1 0;
`;
const BankServiceCardRoot = styled('button')`
  border-radius: 3px;
  border: 1px solid #c8cad0;
  transition: all 0.1s ease-in-out;
  background: transparent;
  text-align: inherit;
  padding: 14px;

  &:not(:disabled) {
    cursor: pointer;
  }
  &:hover:not(:disabled) {
    border-color: #0153cc;
  }
  &:disabled {
    background: #f9fdff;
  }
`;
const BankServiceTitle = styled(`h3`)`
  font-weight: 600;
  font-size: 14px;
  color: #2d333d;
`;
const BankServiceDesc = styled('p')`
  margin-top: 4px;
  margin-bottom: 6px;
  font-size: 13px;
  color: #738091;
`;

interface BankServiceCardProps {
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
  icon: React.ReactNode;
}

export function BankServiceCard({
  title,
  children,
  icon,
  disabled,
}: BankServiceCardProps) {
  return (
    <BankServiceCardRoot disabled={disabled}>
      <Group>
        <BankServiceIcon>{icon}</BankServiceIcon>
        <BankServiceContent>
          <BankServiceTitle>{title}</BankServiceTitle>
          <BankServiceDesc>{children}</BankServiceDesc>
        </BankServiceContent>
      </Group>
    </BankServiceCardRoot>
  );
}
