import styled from 'styled-components';

/**
 * Shared theme tokens for the bank reconciliation UI.
 */
export const ReconciliationTheme = styled.div`
  --x-recon-surface: var(--color-card-background);
  --x-recon-border: #e1e8ed;
  --x-recon-border-light: #eef1f4;
  --x-recon-text: #1c2127;
  --x-recon-text-muted: #738091;
  --x-recon-table-header-background: #f6f7f9;
  --x-recon-table-row-hover: #f6f8fa;
  --x-recon-table-row-selected: #f1f8ff;
  --x-recon-success: #3dcc91;
  --x-recon-warning: #ffb366;

  .bp6-dark & {
    --x-recon-border: var(--color-dark-gray4);
    --x-recon-border-light: var(--color-dark-gray4);
    --x-recon-text: var(--color-light-gray5);
    --x-recon-text-muted: rgba(255, 255, 255, 0.6);
    --x-recon-table-header-background: var(--color-dark-gray3);
    --x-recon-table-row-hover: var(--color-dark-gray3);
    --x-recon-table-row-selected: rgba(138, 187, 255, 0.15);
    --x-recon-success: var(--color-green-400);
    --x-recon-warning: var(--color-orange-400);
  }
`;
