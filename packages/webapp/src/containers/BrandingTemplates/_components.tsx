import { Intent, Menu, MenuDivider, MenuItem } from '@blueprintjs/core';
import type { PdfTemplateResponse } from '@bigcapital/sdk-ts';
import { safeCallback } from '@/utils';

/** PDF template row as returned by the templates list endpoint. */
export interface BrandingTemplateRow extends PdfTemplateResponse {
  resource: string;
  createdAtFormatted?: string;
}

export interface BrandingTemplateActionsMenuPayload {
  onDeleteTemplate: (template: BrandingTemplateRow) => void;
  onEditTemplate: (template: BrandingTemplateRow) => void;
  onMarkDefaultTemplate: (template: BrandingTemplateRow) => void;
}

interface ActionsMenuProps {
  row: { original: BrandingTemplateRow };
  payload: BrandingTemplateActionsMenuPayload;
}

/**
 * Templates table actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: { onDeleteTemplate, onEditTemplate, onMarkDefaultTemplate },
}: ActionsMenuProps) {
  return (
    <Menu>
      {!original.default && (
        <>
          <MenuItem
            text={'Mark as Default'}
            onClick={safeCallback(onMarkDefaultTemplate, original)}
          />
          <MenuDivider />
        </>
      )}
      <MenuItem
        text={'Edit Template'}
        onClick={safeCallback(onEditTemplate, original)}
      />
      <MenuDivider />
      <MenuItem
        text={'Delete Template'}
        intent={Intent.DANGER}
        onClick={safeCallback(onDeleteTemplate, original)}
      />
    </Menu>
  );
}
