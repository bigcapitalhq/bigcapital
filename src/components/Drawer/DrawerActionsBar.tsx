// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import { DashboardActionsBar } from '../Dashboard';

export function DrawerActionsBar({ ...props }) {
  return <DrawerActionsBarRoot {...props} />;
}

const DrawerActionsBarRoot = styled(DashboardActionsBar)`
  border-bottom: 1px solid #d9d9da;
`;
