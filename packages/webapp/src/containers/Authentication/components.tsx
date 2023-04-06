// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { AuthInsiderCard } from './_components';
import { Skeleton } from '@/components';

/**
 * Invite accept loading space.
 */
export function InviteAcceptLoading({ isLoading, children }) {
  return isLoading ? (
    <AuthInsiderCard>
      <Fields>
        <SkeletonField />
        <SkeletonField />
        <SkeletonField />
      </Fields>
    </AuthInsiderCard>
  ) : (
    children
  );
}

function SkeletonField() {
  return (
    <SkeletonFieldRoot>
      <Skeleton>XXXX XXXX</Skeleton>
      <Skeleton minWidth={100}>XXXX XXXX XXXX XXXX</Skeleton>
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
