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
  .bp4-form-group {
    margin-bottom: 0;
  }
  .table {
    border: 1px solid #d2dce2;
    border-radius: 5px;
    background-color: #fff;

    .th,
    .td {
      border-left: 1px solid #e2e2e2;

      &:first-of-type {
        border-left: 0;
      }
    }

    .thead {
      .tr .th {
        padding: 9px 14px;
        background-color: #f2f3fb;
        font-size: 13px;
        color: #415060;
        border-bottom: 1px solid #d2dce2;

        &,
        .inner-resizer {
          border-left-color: transparent;
        }
      }
    }
    .tbody {
      .tr .td {
        border-bottom: 0;
        border-bottom: 1px solid #d8d8d8;
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
          border-color: #ffffff;
          color: #222;
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
