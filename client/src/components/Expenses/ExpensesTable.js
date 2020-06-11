// import React from 'react';
// import {
//   GridComponent,
//   ColumnsDirective,
//   ColumnDirective,
//   Inject,
//   Sort,
  
// } from '@syncfusion/ej2-react-grids';
// import {
//   Checkbox,
//   Popover,
//   Button,
//   Menu,
//   MenuItem,
//   MenuDivider,
//   Position,
// } from '@blueprintjs/core';
// import Icon from 'components/Icon';
// import moment from 'moment';

// export default function ExpensesTable({
//   expenses,
//   onDeleteExpense,
//   onEditExpense,
// }) {
//   const onDateStateChange = () => {

//   }

//   const actionMenuList = (expense) => (
//     <Menu>
//       <MenuItem text="View Details" />
//       <MenuDivider />
//       <MenuItem text="Edit Expense" onClick={() => onEditExpense(expense)} />
//       <MenuItem text="Delete Expense" onClick={() => onDeleteExpense(expense)} />
//     </Menu>
//   );
//   const columns = [
//     {
//       headerText: '',
//       template: () => (<Checkbox />)
//     },
//     {
//       headerText: 'Date',
//       template: (row) => (<span>{ moment(row.date).format('YYYY/MM/DD') }</span>),
//     },
//     {
//       headerText: 'Expense Account',
//       template: (row) => (<span>{ row.expenseAccount.name }</span>),
//     },
//     {
//       headerText: 'Paid Through',
//       template: (row) => (<span>{ row.paymentAccount.name }</span>),
//     },
//     {
//       headerText: 'Amount',
//       field: 'amount'
//     },
//     {
//       headerText: 'Status',
//     },
//     {
//       headerText: '',
//       template: (expense) => (
//         <Popover content={actionMenuList(expense)} position={Position.RIGHT_BOTTOM}>
//           <Button icon={<Icon icon="ellipsis-h" />} />
//         </Popover>
//       )
//     }
//   ]
//   return (
//     <GridComponent
//       allowSorting={true}
//       dataSource={{ result: expenses, count: 20 }}
//       dataStateChange={onDateStateChange}>

//       <ColumnsDirective>
//         {columns.map((column) => {
//           return (<ColumnDirective
//             field={column.field}
//             headerText={column.headerText}
//             template={column.template}
//             allowSorting={true}
//             customAttributes={column.customAttributes}
//             />);
//         })}
//       </ColumnsDirective>
//       <Inject services={[Sort]} />
//     </GridComponent>
//   );
// }