// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import {
  Menu,
  MenuItem,
  MenuDivider,
  Intent,
  Classes,
} from '@blueprintjs/core';

import { Icon, If } from '@/components';
import { safeCallback } from '@/utils';

const WAREHOUSES_SKELETON_N = 4;

/**
 * Warehouse grid item box context menu.
 * @returns {JSX.Element}
 */
export function WarehouseContextMenu({
  onEditClick,
  onDeleteClick,
  onMarkPrimary,
  warehouse,
}) {
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
          text={intl.get('warehouses.action.make_as_primary')}
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

/**
 * Warehouse grid item box skeleton.
 * @returns {JSX.Element}
 */
function WarehouseGridItemSkeletonBox() {
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

/**
 * Warehouse grid item box.
 * @returns {JSX.Element}
 */
export function WarehousesGridItemBox({
  title,
  code,
  city,
  country,
  email,
  phoneNumber,
  primary,
}) {
  return (
    <WarehouseBoxRoot>
      <WarehouseHeader>
        <WarehouseTitle>
          {title} {primary && <Icon icon={'star-18dp'} iconSize={16} />}
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

export function WarehousesSkeleton() {
  return [...Array(WAREHOUSES_SKELETON_N)].map((key, value) => (
    <WarehouseGridItemSkeletonBox />
  ));
}

export const WarehousesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 15px;
  height: 100%;
`;

export const WarehouseBoxRoot = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  border-radius: 5px;
  border: 1px solid #c8cad0;
  background: #fff;
  margin: 5px 5px 8px;
  width: 200px;
  height: 160px;
  transition: all 0.1s ease-in-out;
  padding: 12px;
  position: relative;

  &:hover {
    border-color: #0153cc;
  }
`;

export const WarehouseHeader = styled.div`
  position: relative;
  padding-right: 24px;
  padding-top: 2px;
`;

export const WarehouseTitle = styled.div`
  font-size: 14px;
  font-style: inherit;
  color: #000;
  white-space: nowrap;
  font-weight: 500;
  line-height: 1;

  .bp3-icon {
    margin: 0;
    margin-left: 2px;
    vertical-align: top;
    color: #e1b31d;
  }
`;

const WarehouseCode = styled.div`
  display: block;
  font-size: 11px;
  color: #6b7176;
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
  font-size: 11px;
  color: #000;
  text-overflow: ellipsis;
  overflow: hidden;

  &:not(:last-of-type) {
    margin-bottom: 5px;
  }
`;
