import { Classes, Tag } from '@blueprintjs/core';
import clsx from 'classnames';
import { Group } from '@/components';

export const useBrandingTemplatesColumns = () => {
  return [
    {
      Header: 'Template Name',
      accessor: (row: any) => (
        <Group spacing={10}>
          {row.templateName} {row.default && <Tag round>Default</Tag>}
        </Group>
      ),
      width: 65,
      clickable: true,
    },
    {
      Header: 'Created At',
      accessor: 'createdAtFormatted',
      width: 35,
      className: clsx(Classes.TEXT_MUTED),
      clickable: true,
    },
  ];
};
