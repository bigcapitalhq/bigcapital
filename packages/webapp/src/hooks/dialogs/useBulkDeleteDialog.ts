// @ts-nocheck
import { useCallback } from 'react';
import { DialogsName } from '@/constants/dialogs';
import { useDialogActions } from '@/hooks/state';

export const useBulkDeleteDialog = (
  dialogName: DialogsName,
  validateBulkDeleteMutation,
) => {
  const { openDialog, closeDialog } = useDialogActions();
  const { mutateAsync: validateBulkDelete, isLoading } =
    validateBulkDeleteMutation;

  const openBulkDeleteDialog = useCallback(
    async (ids: number[]) => {
      if (!ids?.length) {
        return;
      }

      const { deletableCount = 0, nonDeletableCount = 0 } =
        await validateBulkDelete(ids);

      const totalSelected = deletableCount + nonDeletableCount || ids.length;

      openDialog(dialogName, {
        ids,
        deletableCount,
        undeletableCount: nonDeletableCount,
        totalSelected,
      });
    },
    [dialogName, openDialog, validateBulkDelete],
  );

  const closeBulkDeleteDialog = useCallback(() => {
    closeDialog(dialogName);
  }, [closeDialog, dialogName]);

  return {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDelete: isLoading,
  };
};
