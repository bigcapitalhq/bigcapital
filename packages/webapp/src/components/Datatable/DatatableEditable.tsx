// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import { DataTable } from './DataTable';

/**
 * Editable datatable.
 */
export function DataTableEditable({
  totalRow = false,
  actions,
  name,
  ...tableProps
}) {
  return (
    <DatatableEditableRoot>
      <DataTable {...tableProps} />
    </DatatableEditableRoot>
  );
}

const DatatableEditableRoot = styled.div`
  --x-table-background: #fff;
  --x-table-border: #d2dce2;
  --x-table-head-border: #d2dce2;
  --x-table-head-background: #f2f3fb;
  --x-table-head-text: #415060;
  --x-color-table-body-input-text: #222;
  --x-color-table-cell-border: #d8d8d8;

  .bp4-dark & {
    --x-table-background: var(--color-dark-gray1);
    --x-table-border: rgba(255, 255, 255, 0.1);
    --x-table-head-background: var(--color-dark-gray2);
    --x-table-head-border: rgba(255, 255, 255, 0.1);
    --x-table-head-text: rgba(--color-light-gray1);
    --x-color-table-body-input-text: var(--color-light-gray2);
    --x-color-table-cell-border: rgba(255, 255, 255, 0.1);
  }

  .bp4-form-group {
    margin-bottom: 0;
  }
  .table {
    border: 1px solid var(--x-table-border);
    background-color: var(--x-table-background);
    border-radius: 5px;

    .th,
    .td {
      border-left: 1px solid var(--x-table-border);

      &:first-of-type {
        border-left: 0;
      }
    }
    .thead {
      .tr .th {
        padding: 9px 14px;
        background-color: var(--x-table-head-background);
        font-size: 13px;
        color: var(--x-table-head-text);
        border-bottom: 1px solid var(--x-table-head-border);

        &,
        .inner-resizer {
          border-left-color: transparent;
        }
      }
    }
    .tbody {
      .tr .td {
        border-bottom: 0;
        border-bottom: 1px solid var(--x-color-table-cell-border);
        min-height: 38px;
        padding: 4px 14px;

        &.td-field-type,
        &.td-button-type {
          padding: 2px;
        }
      }
      .tr:last-of-type .td {
        border-bottom: 0;
      }
      .tr {
        &:hover .td,
        .bp4-input {
          background-color: transparent;
        }
        .bp4-form-group:not(.bp4-intent-danger) .bp4-input,
        .form-group--select-list .bp4-button {
          border-color: transparent;
          box-shadow: 0 0 0;
          color: var(--x-color-table-body-input-text);
          border-radius: 3px;
          text-align: inherit;
        }
        .bp4-form-group:not(.bp4-intent-danger) .bp4-input {
          border-radius: 2px;
          padding-left: 14px;
          padding-right: 14px;

          &:focus {
            box-shadow: 0 0 0 2px #116cd0;
          }
        }
        .form-group--select-list .bp4-button {
          padding-left: 6px;
          padding-right: 6px;

          &:after {
            display: none;
          }
        }
        .form-group--select-list,
        .bp4-form-group {
          &.bp4-intent-danger {
            .bp4-button:not(.bp4-minimal),
            .bp4-input {
              border-color: #f7b6b6;
            }
          }
        }
        .td.actions {
          .bp4-button {
            color: #80858f;
          }
        }
      }
    }
  }
`;
