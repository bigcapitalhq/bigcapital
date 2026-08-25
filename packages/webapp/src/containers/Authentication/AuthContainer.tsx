import { ReactNode } from 'react';
import styled from 'styled-components';
import { Icon } from '@/components';

interface AuthContainerProps {
  children: ReactNode;
}

export function AuthContainer({ children }: AuthContainerProps) {
  return (
    <AuthPage>
      <AuthInsider>
        <AuthLogo>
          <Icon icon="bigcapital" height={37} width={214} />
        </AuthLogo>

        {children}
      </AuthInsider>
    </AuthPage>
  );
}

const AuthPage = styled.div``;
const AuthInsider = styled.div`
  width: 384px;
  margin: 0 auto;
  margin-bottom: 40px;
  padding-top: 80px;
`;

const AuthLogo = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;
