import React from 'react';
import styled from 'styled-components';

function WarehousesGrid({ warehouse }) {
  return (
    <WarehouseGrid>
      <WarehouseTitle>{warehouse.title}</WarehouseTitle>
      <WarehouseCode>{warehouse.code}</WarehouseCode>
      <WarehouseInfoItem>{warehouse.city}</WarehouseInfoItem>
      <WarehouseInfoItem>{warehouse.country}</WarehouseInfoItem>
      <WarehouseInfoItem>{warehouse.email}</WarehouseInfoItem>
      <WarehouseInfoItem>{warehouse.phone}</WarehouseInfoItem>
    </WarehouseGrid>
  );
}

/**
 * Warehouse Grid.
 * @returns
 */
function WarehousesGridItems({ warehouses }) {
  return warehouses.map((warehouse) => (
    <WarehousesGrid warehouse={warehouse} />
  ));
}
export default WarehousesGridItems;

const WarehouseGrid = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  width: 300px; // 453px
  height: 160px; //225px
  background: #fff;
  margin: 5px;
  padding: 10px 12px;
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

const WarehouseCode = styled.div`
  display: inline-block;
  font-size: 11px;
  color: #6b7176;
  margin: 4px 0px 15px;
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
