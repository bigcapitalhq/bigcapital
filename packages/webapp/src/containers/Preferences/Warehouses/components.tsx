import {
  Classes,
  Intent,
  Menu,
  MenuDivider,
  MenuItem,
} from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import type { Warehouse } from '@bigcapital/sdk-ts';
import { Icon, If } from '@/components';
import { safeCallback } from '@/utils';

const WAREHOUSES_SKELETON_N = 4;

interface WarehouseContextMenuProps {
  warehouse: Warehouse;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onMarkPrimary: () => void;
}

export function WarehouseContextMenu({
  onEditClick,
  onDeleteClick,
  onMarkPrimary,
  warehouse,
}: WarehouseContextMenuProps): React.ReactElement {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('warehouses.action.edit_warehouse')}
        onClick={safeCallback(onEditClick)}
      />
      <If condition={!warehouse.primary}>
        <MenuItem
          icon={<Icon icon={'check'} iconSize={18} />}
          text={intl.get('warehouses.action.make_as_parimary')}
          onClick={safeCallback(onMarkPrimary)}
        />
      </If>
      <MenuDivider />
      <MenuItem
        text={intl.get('warehouses.action.delete_warehouse')}
        icon={<Icon icon="trash-16" iconSize={16} />}
        intent={Intent.DANGER}
        onClick={safeCallback(onDeleteClick)}
      />
    </Menu>
  );
}

function WarehouseGridItemSkeletonBox(): React.ReactElement {
  return (
    <WarehouseBoxRoot>
      <WarehouseHeader>
        <WarehouseTitle className={Classes.SKELETON}>X</WarehouseTitle>
        <WarehouseCode className={Classes.SKELETON}>X</WarehouseCode>
      </WarehouseHeader>

      <WarehouseContent>
        <WarehouseItem className={Classes.SKELETON}>X</WarehouseItem>
        <WarehouseItem className={Classes.SKELETON}>X</WarehouseItem>
      </WarehouseContent>
    </WarehouseBoxRoot>
  );
}

interface WarehousesGridItemBoxProps {
  title: string;
  code: string;
  city?: string;
  country?: string;
  email?: string;
  phoneNumber?: string;
  primary?: boolean;
}

export function WarehousesGridItemBox({
  title,
  code,
  city,
  country,
  email,
  phoneNumber,
  primary,
}: WarehousesGridItemBoxProps): React.ReactElement {
  return (
    <WarehouseBoxRoot data-testId="warehouse-item">
      <WarehouseHeader>
        <WarehouseTitle>
          {title} {primary ? <Icon icon={'star-18dp'} iconSize={16} /> : null}
        </WarehouseTitle>
        <WarehouseCode>{code}</WarehouseCode>
        <WarehouseIcon>
          <Icon icon="warehouse-16" iconSize={20} />
        </WarehouseIcon>
      </WarehouseHeader>
      <WarehouseContent>
        {city && <WarehouseItem>{city}</WarehouseItem>}
        {country && <WarehouseItem>{country}</WarehouseItem>}
        {email && <WarehouseItem>{email}</WarehouseItem>}
        {phoneNumber && <WarehouseItem>{phoneNumber}</WarehouseItem>}
      </WarehouseContent>
    </WarehouseBoxRoot>
  );
}

export function WarehousesSkeleton(): React.ReactElement {
  return (
    <>
      {[...Array(WAREHOUSES_SKELETON_N)].map((_key, value) => (
        <WarehouseGridItemSkeletonBox key={value} />
      ))}
    </>
  );
}

export const WarehousesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 15px;
  height: 100%;
`;

export const WarehouseBoxRoot = styled.div`
  --x-box-border-color: #c8cad0;
  --x-box-background-color: #fff;
  --x-box-hover-border-color: #0153cc;

  .bp4-dark & {
    --x-box-border-color: rgba(255, 255, 255, 0.2);
    --x-box-background-color: var(--color-dark-gray3);
    --x-box-hover-border-color: #0153cc;
  }
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  border-radius: 5px;
  border: 1px solid var(--x-box-border-color);
  background: var(--x-box-background-color);
  margin: 5px 5px 8px;
  width: 200px;
  height: 160px;
  transition: all 0.1s ease-in-out;
  padding: 12px;
  position: relative;

  &:hover {
    border-color: var(--x-box-hover-border-color);
  }
`;

export const WarehouseHeader = styled.div`
  position: relative;
  padding-right: 24px;
  padding-top: 2px;
`;

export const WarehouseTitle = styled.div`
  --x-title-color: #000;
  --x-title-icon-color: #e1b31d;

  .bp4-dark & {
    --x-title-color: var(--color-light-gray5);
    --x-title-icon-color: #e1b31d;
  }
  font-size: 14px;
  font-style: inherit;
  color: var(--x-title-color);
  white-space: nowrap;
  font-weight: 500;
  line-height: 1;

  .bp4-icon {
    margin: 0;
    margin-left: 2px;
    vertical-align: top;
    color: var(--x-title-icon-color);
  }
`;

const WarehouseCode = styled.div`
  --x-code-color: #6b7176;

  .bp4-dark & {
    --x-code-color: var(--color-muted-text);
  }
  display: block;
  font-size: 11px;
  color: var(--x-code-color);
  margin-top: 4px;
`;

const WarehouseIcon = styled.div`
  position: absolute;
  top: 0;
  color: #abb3bb;
  right: 0;
`;

const WarehouseContent = styled.div`
  width: 100%;
  margin-top: auto;
`;

const WarehouseItem = styled.div`
  --x-item-color: #000;

  .bp4-dark & {
    --x-item-color: var(--color-light-gray1);
  }
  font-size: 11px;
  color: var(--x-item-color);
  text-overflow: ellipsis;
  overflow: hidden;

  &:not(:last-of-type) {
    margin-bottom: 5px;
  }
`;
