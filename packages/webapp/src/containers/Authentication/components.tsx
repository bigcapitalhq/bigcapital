import { ReactNode } from 'react';
import styled from 'styled-components';
import { AuthInsiderCard } from './_components';
import { Skeleton } from '@/components';

/**
 * Invite accept loading space.
 */
export function InviteAcceptLoading({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children?: ReactNode;
}) {
  return isLoading ? (
    <AuthInsiderCard>
      <Fields>
        <SkeletonField />
        <SkeletonField />
        <SkeletonField />
      </Fields>
    </AuthInsiderCard>
  ) : (
    <>{children}</>
  );
}

function SkeletonField() {
  return (
    <SkeletonFieldRoot>
      <Skeleton />
      <Skeleton minWidth={100} />
    </SkeletonFieldRoot>
  );
}

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const SkeletonFieldRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
