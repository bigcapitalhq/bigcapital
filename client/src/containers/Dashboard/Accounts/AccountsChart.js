import React from 'react';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import {
  Cell,
  Column,
  ColumnHeaderCell,
  CopyCellsMenuItem,
  IMenuContext,
  SelectionModes,
  Table,
  Utils,
} from "@blueprintjs/table";

function RecordSortableColumn() {
  return (
    <Menu>
      <MenuItem
        icon="sort-asc"
        text="Sort Wins Asc"
      />
      <MenuItem
        icon="sort-desc"
        text="Sort Wins Desc"
      />
    </Menu>
  );
};

export default function AccountsChart() {
  return (
    <DashboardActionsBar />
    <DashboardPageContent>
    
    </DashboardPageContent>
  );
}