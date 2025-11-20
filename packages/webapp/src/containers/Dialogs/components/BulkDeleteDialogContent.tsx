// @ts-nocheck
import React from 'react';
import { Classes, Intent, Tag } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';
import { x } from '@xstyled/emotion';

interface BulkDeleteDialogContentProps {
  totalSelected: number;
  deletableCount: number;
  undeletableCount: number;
  resourceSingularLabel: string;
  resourcePluralLabel: string;
}

function BulkDeleteDialogContent({
  totalSelected,
  deletableCount,
  undeletableCount,
  resourceSingularLabel,
  resourcePluralLabel,
}: BulkDeleteDialogContentProps) {
  return (
    <div className={Classes.DIALOG_BODY}>
      <x.p fontWeight="semibold">
        <T
          id={'bulk_delete_selected_summary'}
          values={{ count: totalSelected, resourcePlural: resourcePluralLabel }}
        />
      </x.p>

      <x.div display="flex" alignItems="center" gap={'12px'}>
        <Tag intent={Intent.DANGER} minimal>
          {deletableCount}
        </Tag>
        <x.div>
          <T
            id={'bulk_delete_delete_row_prefix'}
            values={{ resourceSingular: resourceSingularLabel }}
          />{' '}
          <x.span fontWeight="semibold" color="danger">
            <T id={'bulk_delete_delete_row_status'} />
          </x.span>
        </x.div>
      </x.div>

      <x.div display="flex" alignItems="center" gap={'12px'} mt={'8px'}>
        <Tag intent={Intent.INFO} minimal>
          {undeletableCount}
        </Tag>
        <x.div>
          <T
            id={'bulk_delete_archive_row_prefix'}
            values={{ resourceSingular: resourceSingularLabel }}
          />{' '}
          <x.span fontWeight="semibold" color="info">
            <T id={'bulk_delete_archive_row_status'} />
          </x.span>
        </x.div>
      </x.div>

      <x.p mt={'12px'}>
        <T
          id={'bulk_delete_selected_description'}
          values={{ resourcePlural: resourcePluralLabel }}
        />
      </x.p>

      <x.div
        pt={'12px'}
        mt={'16px'}
        borderTop="1px solid rgba(255, 255, 255, 0.2)"
      >
        <x.span fontWeight="bold">
          <T id={'note'} />
          {':'}
        </x.span>
        <x.p>
          <T
            id={'bulk_delete_note_description'}
            values={{ resourcePlural: resourcePluralLabel }}
          />
        </x.p>
      </x.div>
    </div>
  );
}

export default BulkDeleteDialogContent;

