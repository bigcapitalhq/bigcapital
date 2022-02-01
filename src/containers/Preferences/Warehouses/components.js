import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { Menu, MenuItem, MenuDivider, Intent } from '@blueprintjs/core';
import { If, Icon, Can } from '../../../components';
import { safeCallback } from 'utils';

/**
 * Warehouse context menu.
 */
export function WarehouseContextMenu({
  onEditClick,
  onDeleteClick,
  onPrimary,
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('warehouses.action.edit_warehouse')}
        onClick={safeCallback(onEditClick)}
      />
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('warehouses.action.make_as_parimary')}
        onClick={safeCallback(onPrimary)}
      />
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

export function WarehousesGrid({ warehouse }) {
  return (
    <WarehouseGrid>
      <WarehouseHeader>
        <WarehouseTitle>{warehouse.name}</WarehouseTitle>
        <WarehouseCode>{warehouse.code}</WarehouseCode>
      </WarehouseHeader>
      <WarehouseInfoItem>{warehouse.city}</WarehouseInfoItem>
      <WarehouseInfoItem>{warehouse.country}</WarehouseInfoItem>
      <WarehouseInfoItem>{warehouse.email}</WarehouseInfoItem>
      <WarehouseInfoItem>{warehouse.phone_number}</WarehouseInfoItem>
    </WarehouseGrid>
  );
}

const WarehouseGrid = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  width: 280px; // 453px
  height: 160px; //225px
  background: #fff;
  margin: 5px;
  padding: 16px 12px 10px;
  border: 1px solid #c8cad0; //#CFD1D6
  transition: all 0.1s ease-in-out;

  &:hover {
    border-color: #0153cc;
  }
`;

const WarehouseTitle = styled.div`
  font-size: 14px; //22px
  font-style: inherit;
  color: #000;
  white-space: nowrap;
  font-weight: 500;
  line-height: 1;
`;

const WarehouseHeader = styled.div`
  margin: 4px 0px 15px;
`;

const WarehouseCode = styled.div`
  display: inline-block;
  font-size: 11px;
  color: #6b7176;
`;

const WarehouseInfoItem = styled.div`
  display: inline-block;
  font-size: 12px;
  color: #000;
  line-height: 1.3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`;
