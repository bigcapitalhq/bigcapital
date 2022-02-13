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
import clsx from 'classnames';
import { If, Icon, Can } from '../../../components';
import { safeCallback } from 'utils';

const WAREHOUSES_SKELETON_N = 9;

/**
 * Warehouse context menu.
 */
export function WarehouseContextMenu({
  onEditClick,
  onDeleteClick,
  onMarkPrimary,
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('warehouses.action.edit_warehouse')}
        onClick={safeCallback(onEditClick)}
      />
      <MenuItem
        icon={<Icon icon="check" />}
        text={intl.get('warehouses.action.make_as_parimary')}
        onClick={safeCallback(onMarkPrimary)}
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

export function WarehousesGrid({
  title,
  code,
  city,
  country,
  email,
  phone_number,
  loading,
}) {
  return (
    <WarehouseGridWrapper>
      <WarehouseHeader>
        <WarehouseTitle className={clsx({ [Classes.SKELETON]: loading })}>
          {title}
        </WarehouseTitle>
        <WarehouseCode className={clsx({ [Classes.SKELETON]: loading })}>
          {code}
        </WarehouseCode>
        <WarehouseIcon>
          {!loading && <Icon icon="warehouse-16" iconSize={20} />}
        </WarehouseIcon>
      </WarehouseHeader>
      <WarehouseContent>
        <WarehouseItem className={clsx({ [Classes.SKELETON]: loading })}>
          {city}
        </WarehouseItem>
        <WarehouseItem className={clsx({ [Classes.SKELETON]: loading })}>
          {country}
        </WarehouseItem>
        <WarehouseItem className={clsx({ [Classes.SKELETON]: loading })}>
          {email}
        </WarehouseItem>
        <WarehouseItem className={clsx({ [Classes.SKELETON]: loading })}>
          {phone_number}
        </WarehouseItem>
      </WarehouseContent>
    </WarehouseGridWrapper>
  );
}

export function WarehousesSkeleton() {
  return [...Array(WAREHOUSES_SKELETON_N)].map((key, value) => (
    <WarehousesGrid
      title={'warehouse.name'}
      code={'warehouse.code'}
      city={'warehouse.city'}
      country={'warehouse.country'}
      email={'warehouse.email'}
      phone={'warehouse.phone_number'}
      loading={true}
    />
  ));
}

export const WarehousesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 15px;
  height: 100%;
`;

export const WarehouseGridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  border-radius: 3px;
  border: 1px solid #c8cad0; //#CFD1D6
  background: #fff;
  margin: 5px 5px 8px;
  width: 300px; // 453px
  height: 160px; //225px
  transition: all 0.1s ease-in-out;
  position: relative;

  &:hover {
    border-color: #0153cc;
  }
`;

export const WarehouseHeader = styled.div`
  position: relative;
  padding: 16px 12px 10px;
`;

export const WarehouseTitle = styled.div`
  font-size: 14px; //22px
  font-style: inherit;
  color: #000;
  white-space: nowrap;
  font-weight: 500;
  line-height: 1;
`;

const WarehouseCode = styled.div`
  display: inline-block;
  font-size: 11px;
  color: #6b7176;
`;

const WarehouseIcon = styled.div`
  position: absolute;
  top: 14px;
  color: #abb3bb;
  right: 12px;
`;

const WarehouseContent = styled.div`
  display: inline-block;
  position: absolute;
  bottom: 8px;
  width: 100%;
  padding: 0 12px 0px;
`;

const WarehouseItem = styled.div`
  font-size: 11px;
  color: #000;
  margin-bottom: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
`;
