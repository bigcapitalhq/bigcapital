// @ts-nocheck
import * as R from 'ramda';
import { Classes, Tag } from '@blueprintjs/core';
import clsx from 'classnames';
import { DataTable, Group, TableSkeletonRows } from '@/components';
import { useBrandingTemplatesBoot } from './BrandingTemplatesBoot';
import { ActionsMenu } from './_components';
import { DRAWERS } from '@/constants/drawers';
import withAlertActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import styles from './BrandTemplates.module.scss';
import { getCustomizeDrawerNameFromResource } from './_utils';

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

const useBrandingTemplatesColumns = () => {
  return [
    {
      Header: 'Template Name',
      accessor: (row) => (
        <Group spacing={10}>
          {row.template_name} {row.default && <Tag round>Default</Tag>}
        </Group>
      ),
      width: 65,
      clickable: true,
    },
    {
      Header: 'Created At',
      accessor: 'created_at_formatted',
      width: 35,
      className: clsx(Classes.TEXT_MUTED),
      clickable: true,
    },
  ];
};
