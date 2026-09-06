import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
  Alignment,
} from '@blueprintjs/core';
import { isEmpty } from 'lodash';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useBulkDeleteManualJournalsDialog } from './hooks/use-bulk-delete-manual-journals-dialog';
import { useManualJournalsContext } from './ManualJournalsListProvider';
import { withManualJournals } from './withManualJournals';
import { withManualJournalsActions } from './withManualJournalsActions';
import type { WithManualJournalsProps } from './withManualJournals';
import type { WithManualJournalsActionsProps } from './withManualJournalsActions';
import type { IFilterRole } from '@/components/AdvancedFilter/interfaces';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  Icon,
  AdvancedFilterPopover,
  DashboardFilterButton,
  DashboardRowsHeightButton,
  FormattedMessage as T,
  Can,
  If,
  DashboardActionViewsList,
  DashboardActionsBar,
} from '@/components';
import { ManualJournalAction, AbilitySubject } from '@/constants/abilityOption';
import { DialogsName } from '@/constants/dialogs';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useSaveSettings } from '@/hooks/query';
import { useDownloadExportPdf } from '@/hooks/query/FinancialReports/use-export-pdf';
import { useRefreshJournals } from '@/hooks/query/manual-journals';
import { compose } from '@/utils';

interface ManualJournalActionsBarInnerProps
  extends Pick<WithManualJournalsProps, 'manualJournalsSelectedRows'>,
    WithManualJournalsActionsProps,
    WithDialogActionsProps {
  manualJournalsFilterConditions: IFilterRole[];
}

/**
 * Manual journal actions bar.
 */
function ManualJournalActionsBarInner({
  // #withManualJournalsActions
  setManualJournalsTableState,

  // #withManualJournals
  manualJournalsFilterConditions,
  manualJournalsSelectedRows = [],

  // #withDialogActions
  openDialog,
}: ManualJournalActionsBarInnerProps) {
  const { mutateAsync: saveSettings } = useSaveSettings();

  // History context.
  const history = useHistory();

  // Manual journals context.
  const { journalsViews, fields, manualJournalsSettings } =
    useManualJournalsContext();
  const manualJournalsTableSize = manualJournalsSettings?.tableSize as
    | string
    | undefined;

  // Exports pdf document.
  const { downloadAsync: downloadExportPdf } = useDownloadExportPdf();

  // Manual journals refresh action.
  const { refresh } = useRefreshJournals();

  // Handle click a new manual journal.
  const onClickNewManualJournal = () => {
    history.push('/make-journal-entry');
  };
  const { openBulkDeleteDialog, isValidatingBulkDeleteManualJournals } =
    useBulkDeleteManualJournalsDialog();

  const handleBulkDelete = () => {
    openBulkDeleteDialog(manualJournalsSelectedRows as number[]);
  };

  // Handle tab change.
  const handleTabChange = (view?: { slig?: string }) => {
    setManualJournalsTableState({ viewSlug: view ? view.slig : null });
  };
  // Handle click a refresh Journals
  const handleRefreshBtnClick = () => {
    refresh();
  };
  // Handle import button click.
  const handleImportBtnClick = () => {
    history.push('/manual-journals/import');
  };

  // Handle table row size change.
  const handleTableRowSizeChange = (size: string) => {
    saveSettings({
      options: [{ group: 'manualJournals', key: 'tableSize', value: size }],
    });
  };

  // Handle the export button click.
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'manual_journal' });
  };

  // Handle the pdf print button click.
  const handlePdfPrintBtnSubmit = () => {
    downloadExportPdf({ resource: 'ManualJournal' });
  };

  if (!isEmpty(manualJournalsSelectedRows)) {
    return (
      <DashboardActionsBar>
        <NavbarGroup>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleBulkDelete}
            disabled={isValidatingBulkDeleteManualJournals}
          />
        </NavbarGroup>
      </DashboardActionsBar>
    );
  }

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'manual-journals'}
          allMenuItem={true}
          views={journalsViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can I={ManualJournalAction.Create} a={AbilitySubject.ManualJournal}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="plus" />}
            text={<T id={'journal_entry'} />}
            onClick={onClickNewManualJournal}
          />
        </Can>
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: manualJournalsFilterConditions,
            defaultFieldKey: 'journal_number',
            fields,
            onFilterChange: (filterConditions: IFilterRole[]) => {
              setManualJournalsTableState({
                filterRoles: filterConditions,
              });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={manualJournalsFilterConditions.length}
          />
        </AdvancedFilterPopover>

        <If condition={false}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleBulkDelete}
          />
        </If>

        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
          onClick={handlePdfPrintBtnSubmit}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-import-16" iconSize={16} />}
          text={<T id={'import'} />}
          onClick={handleImportBtnClick}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
          onClick={handleExportBtnClick}
        />
        <NavbarDivider />
        <DashboardRowsHeightButton
          initialValue={manualJournalsTableSize}
          onChange={handleTableRowSizeChange}
        />
        <NavbarDivider />
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="refresh-16" iconSize={14} />}
          onClick={handleRefreshBtnClick}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export const ManualJournalActionsBar = compose(
  withDialogActions,
  withManualJournalsActions,
  withManualJournals(
    ({ manualJournalsTableState, manualJournalsSelectedRows }) => ({
      manualJournalsFilterConditions: manualJournalsTableState.filterRoles,
      manualJournalsSelectedRows,
    }),
  ),
)(ManualJournalActionsBarInner);
