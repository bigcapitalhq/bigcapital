import type { UniversalSearchItem } from '@/components/UniversalSearch/UniversalSearch';
import type { IItemRendererProps } from '@blueprintjs/select';
import type { ComponentType } from 'react';

export interface UniversalSearchSelectActionProps {
  resourceType: string;
  resourceId: number;
  onAction?: () => void;
}

export interface UniversalSearchPermission {
  ability: string;
  subject: string;
}

export interface UniversalSearchBind {
  resourceType: string;
  optionItemLabel: string;
  selectItemAction?: ComponentType<UniversalSearchSelectActionProps>;
  itemRenderer?(
    item: UniversalSearchItem,
    modifiers: IItemRendererProps,
  ): React.ReactElement | null;
  itemSelect?(item: unknown): UniversalSearchItem;
  permission?: UniversalSearchPermission;
}
