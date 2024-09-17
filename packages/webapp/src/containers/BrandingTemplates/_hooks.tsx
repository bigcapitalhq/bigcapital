import clsx from 'classnames';
import { Classes, Tag } from '@blueprintjs/core';
import { Group } from '@/components';

export const useBrandingTemplatesColumns = () => {
  return [
    {
      Header: 'Template Name',
      accessor: (row: any) => (
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
