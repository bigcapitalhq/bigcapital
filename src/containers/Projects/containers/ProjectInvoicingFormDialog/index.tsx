import React from 'react';
import styled from 'styled-components';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ProjectInvoicingDialogContent = React.lazy(
  () => import('./ProjectInvoicingFormDialogContent'),
);

/**
 * Project invoicing form dialog.
 * @returns
 */
function ProjectInvoicingFormDialog({ dialogName, payload: {}, isOpen }) {

  return (
    <ProjectInvoicingFormDialogRoot
      name={dialogName}
      title={<T id={'project_invoicing.dialog.project_invoicing'} />}
      isOpen={isOpen}
      autoFocus={true}
      canEscapeKeyClose={true}
      style={{ width: '370px' }}
    >
      <DialogSuspense>
        <ProjectInvoicingDialogContent dialogName={dialogName} />
      </DialogSuspense>
    </ProjectInvoicingFormDialogRoot>
  );
}

export default compose(withDialogRedux())(ProjectInvoicingFormDialog);

const ProjectInvoicingFormDialogRoot = styled(Dialog)`
  .bp3-dialog-body {
    .bp3-form-group {
      margin-bottom: 15px;
      margin-top: 15px;

      label.bp3-label {
        margin-bottom: 3px;
        font-size: 13px;
      }
    }

    label.bp3-control.bp3-checkbox {
      margin-top: 15px;
    }
  }
  .bp3-dialog-footer {
    padding-top: 10px;
  }
`;
