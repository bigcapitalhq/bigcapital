// @ts-nocheck
import * as R from 'ramda';
import { DataTable, TableSkeletonRows } from '@/components';
import { useBrandingTemplatesBoot } from './BrandingTemplatesBoot';
import { ActionsMenu } from './_components';
import { DRAWERS } from '@/constants/drawers';
import withAlertActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import { getCustomizeDrawerNameFromResource } from './_utils';
import { useBrandingTemplatesColumns } from './_hooks';
import styles from './BrandTemplates.module.scss';

interface BrandingTemplatesTableProps {}

function BrandingTemplateTableRoot({
  openAlert,
  openDrawer,
}: BrandingTemplatesTableProps) {
  // Table columns.
  const columns = useBrandingTemplatesColumns();
  const { isPdfTemplatesLoading, pdfTemplates } = useBrandingTemplatesBoot();

  const handleEditTemplate = (template) => {
    openDrawer(DRAWERS.INVOICE_CUSTOMIZE, {
      templateId: template.id,
      resource: template.resource,
    });
  };

  const handleDeleteTemplate = (template) => {
    openAlert('branding-template-delete', { templateId: template.id });
  };

  const handleCellClick = (cell, event) => {
    const templateId = cell.row.original.id;
    const resource = cell.row.original.resource;

    // Retrieves the customize drawer name from the given resource name.
    const drawerName = getCustomizeDrawerNameFromResource(resource);

    openDrawer(drawerName, { templateId, resource });
  };

  // Handle mark as default button click.
  const handleMarkDefaultTemplate = (template) => {
    openAlert('branding-template-mark-default', { templateId: template.id });
  };

  return (
    <DataTable
      columns={columns}
      data={pdfTemplates || []}
      loading={isPdfTemplatesLoading}
      progressBarLoading={isPdfTemplatesLoading}
      TableLoadingRenderer={TableSkeletonRows}
      ContextMenu={ActionsMenu}
      noInitialFetch={true}
      payload={{
        onDeleteTemplate: handleDeleteTemplate,
        onEditTemplate: handleEditTemplate,
        onMarkDefaultTemplate: handleMarkDefaultTemplate,
      }}
      rowContextMenu={ActionsMenu}
      onCellClick={handleCellClick}
      className={styles.table}
    />
  );
}

export const BrandingTemplatesTable = R.compose(
  withAlertActions,
  withDrawerActions,
)(BrandingTemplateTableRoot);
