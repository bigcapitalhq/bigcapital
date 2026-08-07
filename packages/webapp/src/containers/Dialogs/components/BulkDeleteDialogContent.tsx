import { Classes, Intent, Tag } from '@blueprintjs/core';
import { x } from '@xstyled/emotion';
import React from 'react';
import { FormattedMessage as T } from '@/components';

interface BulkDeleteDialogContentProps {
  totalSelected: number;
  deletableCount: number;
  undeletableCount: number;
  resourceSingularLabel: string;
  resourcePluralLabel: string;
}

export function BulkDeleteDialogContent({
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
            id={'bulk_delete_will_be_deleted'}
            values={{ resourceSingular: resourceSingularLabel }}
          />{' '}
        </x.div>
      </x.div>

      <x.div display="flex" alignItems="center" gap={'12px'} mt={'8px'}>
        {/* `Intent.INFO` was removed in Blueprint v5; using PRIMARY as the
            nearest equivalent for the "cannot be deleted" tag. */}
        <Tag intent={Intent.PRIMARY} minimal>
          {undeletableCount}
        </Tag>
        <x.div>
          <T
            id={'bulk_delete_cannot_be_deleted'}
            values={{ resourceSingular: resourceSingularLabel }}
          />{' '}
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
