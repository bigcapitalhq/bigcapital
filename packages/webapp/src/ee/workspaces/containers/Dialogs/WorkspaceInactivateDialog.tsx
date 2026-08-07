// @ts-nocheck
import { Button, Classes, Dialog, Intent, Callout } from '@blueprintjs/core';
import { x } from '@xstyled/emotion';
import React from 'react';
import intl from 'react-intl-universal';
import { FormattedMessage as T, AppToaster } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import {
  useInactivateWorkspace,
  useActivateWorkspace,
} from '@/ee/workspaces/hooks/query';
import { compose } from '@/utils';

function WorkspaceInactivateDialog({
  dialogName,
  isOpen,
  payload: { organizationId, workspaceName, isActive } = {},

  // #withDialogActions
  closeDialog,
}) {
  const { mutateAsync: inactivateWorkspace, isLoading: isInactivating } =
    useInactivateWorkspace();
  const { mutateAsync: activateWorkspace, isLoading: isActivating } =
    useActivateWorkspace();

  const isLoading = isInactivating || isActivating;
  const isInactivateAction = isActive !== false;

  const handleCancel = () => {
    closeDialog(dialogName);
  };

  const handleConfirm = () => {
    const action = isInactivateAction ? inactivateWorkspace : activateWorkspace;
    const successMessage = isInactivateAction
      ? intl.get('workspaces.workspace_inactivated_successfully', {
          fallback: 'Workspace has been inactivated',
        })
      : intl.get('workspaces.workspace_activated_successfully', {
          fallback: 'Workspace has been reactivated',
        });
    const errorMessage = isInactivateAction
      ? intl.get('workspaces.cannot_inactivate_workspace', {
          fallback: 'Cannot inactivate workspace',
        })
      : intl.get('workspaces.cannot_activate_workspace', {
          fallback: 'Cannot activate workspace',
        });

    action(organizationId)
      .then(() => {
        AppToaster.show({
          message: successMessage,
          intent: Intent.SUCCESS,
        });
        closeDialog(dialogName);
      })
      .catch((error) => {
        const message =
          error?.response?.data?.errors?.[0]?.message || errorMessage;
        AppToaster.show({
          message,
          intent: Intent.DANGER,
        });
        closeDialog(dialogName);
      });
  };

  const title = isInactivateAction
    ? intl.get('workspaces.inactivate_workspace', {
        fallback: 'Inactivate Workspace',
      })
    : intl.get('workspaces.activate_workspace', {
        fallback: 'Activate Workspace',
      });

  const confirmationKey = isInactivateAction
    ? 'workspaces.inactivate_workspace_confirmation'
    : 'workspaces.activate_workspace_confirmation';

  const confirmationFallback = isInactivateAction
    ? `Are you sure you want to inactivate <b>${workspaceName || organizationId}</b>? No one will be able to sign in until it's reactivated.`
    : `Reactivate <b>${workspaceName || organizationId}</b>? Users will be able to sign in again.`;

  const intent = isInactivateAction ? Intent.WARNING : Intent.SUCCESS;
  const icon = isInactivateAction ? 'warning-sign' : 'refresh';

  return (
    <Dialog
      title={title}
      isOpen={isOpen}
      onClose={handleCancel}
      canEscapeKeyClose={!isLoading}
      canOutsideClickClose={!isLoading}
      className="workspace-inactivate-dialog"
    >
      <div className={Classes.DIALOG_BODY}>
        <Callout intent={intent} icon={icon}>
          <span
            dangerouslySetInnerHTML={{
              __html: intl.get(confirmationKey, {
                name: workspaceName || organizationId,
                fallback: confirmationFallback,
              }),
            }}
          />
        </Callout>

        {isInactivateAction && (
          <x.div pl={2} mt={4}>
            <p>
              {intl.get('workspaces.inactivate_workspace_details', {
                fallback: 'Inactivating this workspace will:',
              })}
            </p>
            <x.ul pl={8}>
              <x.li mb={1}>
                {intl.get('workspaces.inactivate_workspace_effect_1', {
                  fallback: 'Prevent all users from signing in',
                })}
              </x.li>
              <x.li mb={1}>
                {intl.get('workspaces.inactivate_workspace_effect_2', {
                  fallback: 'Preserve all data and settings',
                })}
              </x.li>
              <x.li mb={1}>
                {intl.get('workspaces.inactivate_workspace_effect_3', {
                  fallback: 'Allow reactivation at any time',
                })}
              </x.li>
            </x.ul>
          </x.div>
        )}
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={handleCancel} disabled={isLoading}>
            <T id={'cancel'} />
          </Button>

          <Button intent={intent} onClick={handleConfirm} loading={isLoading}>
            {isInactivateAction
              ? intl.get('workspaces.inactivate_workspace', {
                  fallback: 'Inactivate',
                })
              : intl.get('workspaces.activate_workspace', {
                  fallback: 'Activate',
                })}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default compose(
  withDialogRedux(),
  withDialogActions,
)(WorkspaceInactivateDialog);
