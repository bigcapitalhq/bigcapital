import styled from 'styled-components';
import { Box } from '@/components';
import { NS } from '@/constants/classes';

export const EntriesActionsBar = styled(Box)`
  padding-bottom: 12px;
  display: flex;

  .${NS}-form-group {
    margin-bottom: 0;

    label.${NS}-label {
      opacity: 0.6;
      margin-right: 8px;
    }
  }
`;
