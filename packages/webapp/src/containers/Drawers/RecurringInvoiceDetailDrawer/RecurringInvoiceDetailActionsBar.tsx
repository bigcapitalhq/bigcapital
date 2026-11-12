import {
  Alert,
  Button,
  Classes,
  Intent,
  NavbarDivider,
  NavbarGroup,
} from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React, { useState } from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { useRecurringInvoiceDetailDrawerContext } from './RecurringInvoiceDetailDrawerProvider';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import {
  AppToaster,
  Can,
  DrawerActionsBar,
  FormattedMessage as T,
  Icon,
} from '@/components';
import {
  AbilitySubject,
  RecurringInvoiceAction,
} from '@/constants/abilityOption';
import { DRAWERS } from '@/constants/drawers';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import {
  useDeleteRecurringInvoice,
  useGenerateRecurringInvoiceNow,
  usePauseRecurringInvoice,
  useResumeRecurringInvoice,
} from '@/hooks/query';

interface RecurringInvoiceDetailActionsBarInnerProps
  extends WithDrawerActionsProps {}

/**
 * Recurring invoice details action bar.
 */
function RecurringInvoiceDetailActionsBarInner({
  // #withDrawerActions
  closeDrawer,
}: RecurringInvoiceDetailActionsBarInnerProps) {
  const history = useHistory();
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const { recurringInvoiceId, recurringInvoice } =
    useRecurringInvoiceDetailDrawerContext();

  const { mutateAsync: deleteRecurringInvoice, isPending: isDeleting } =
    useDeleteRecurringInvoice();
  const { mutateAsync: generateNow, isPending: isGenerating } =
    useGenerateRecurringInvoiceNow();
  const { mutateAsync: pauseRecurringInvoice, isPending: isPausing } =
    usePauseRecurringInvoice();
  const { mutateAsync: resumeRecurringInvoice, isPending: isResuming } =
    useResumeRecurringInvoice();

  if (!recurringInvoice || !recurringInvoiceId) {
    return null;
  }

  const handleEdit = () => {
    history.push(`/recurring-invoices/${recurringInvoiceId}/edit`);
    closeDrawer(DRAWERS.RECURRING_INVOICE_DETAILS);
  };

  const handleGenerate = async () => {
    try {
      await generateNow(recurringInvoiceId);
      AppToaster.show({
        message: intl.get('recurring_invoice.generated_successfully'),
        intent: Intent.SUCCESS,
      });
    } catch (_error) {
      AppToaster.show({
        message: intl.get('something_went_wrong'),
        intent: Intent.DANGER,
      });
    }
  };

  const handlePause = async () => {
    try {
      await pauseRecurringInvoice(recurringInvoiceId);
      AppToaster.show({
        message: intl.get('recurring_invoice.paused_successfully'),
        intent: Intent.SUCCESS,
      });
    } catch (_error) {
      AppToaster.show({
        message: intl.get('something_went_wrong'),
        intent: Intent.DANGER,
      });
    }
  };

  const handleResume = async () => {
    try {
      await resumeRecurringInvoice(recurringInvoiceId);
      AppToaster.show({
        message: intl.get('recurring_invoice.resumed_successfully'),
        intent: Intent.SUCCESS,
      });
    } catch (_error) {
      AppToaster.show({
        message: intl.get('something_went_wrong'),
        intent: Intent.DANGER,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRecurringInvoice(recurringInvoiceId);
      AppToaster.show({
        message: intl.get('recurring_invoice.deleted_successfully'),
        intent: Intent.SUCCESS,
      });
      closeDrawer(DRAWERS.RECURRING_INVOICE_DETAILS);
    } catch (_error) {
      AppToaster.show({
        message: intl.get('something_went_wrong'),
        intent: Intent.DANGER,
      });
    } finally {
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <DrawerActionsBar>
        <NavbarGroup>
          <Can
            I={RecurringInvoiceAction.Edit}
            a={AbilitySubject.RecurringInvoice}
          >
            <Button
              className={Classes.MINIMAL}
              icon={<Icon icon="pen-18" />}
              text={<T id={'edit_recurring_invoice'} />}
              onClick={handleEdit}
            />
            <NavbarDivider />
            <Button
              className={Classes.MINIMAL}
              icon={<Icon icon="refresh" />}
              text={<T id={'recurring_invoice.generate_now'} />}
              onClick={handleGenerate}
              loading={isGenerating}
            />
            {recurringInvoice.status === 'active' && (
              <Button
                className={Classes.MINIMAL}
                icon={<Icon icon="pause" />}
                text={<T id={'recurring_invoice.pause'} />}
                onClick={handlePause}
                loading={isPausing}
              />
            )}
            {recurringInvoice.status === 'paused' && (
              <Button
                className={Classes.MINIMAL}
                icon={<Icon icon="play" />}
                text={<T id={'recurring_invoice.resume'} />}
                onClick={handleResume}
                loading={isResuming}
              />
            )}
          </Can>
          <Can
            I={RecurringInvoiceAction.Delete}
            a={AbilitySubject.RecurringInvoice}
          >
            <NavbarDivider />
            <Button
              className={Classes.MINIMAL}
              icon={<Icon icon={'trash-16'} iconSize={16} />}
              text={<T id={'delete'} />}
              intent={Intent.DANGER}
              onClick={() => setDeleteOpen(true)}
            />
          </Can>
        </NavbarGroup>
      </DrawerActionsBar>

      <Alert
        isOpen={isDeleteOpen}
        intent={Intent.DANGER}
        icon="trash"
        cancelButtonText={intl.get('cancel')}
        confirmButtonText={intl.get('delete')}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      >
        <p>{intl.get('recurring_invoice.delete_confirmation')}</p>
      </Alert>
    </>
  );
}

export const RecurringInvoiceDetailActionsBar = FF.pipe(
  RecurringInvoiceDetailActionsBarInner,
  withDrawerActions,
);
