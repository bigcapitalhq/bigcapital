import { Intent, Tag, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import intl from 'react-intl-universal';
import type { SaleEstimatesListResponse } from '@bigcapital/sdk-ts';
import type { BP_TableFeatures } from '@bigcapitalhq/blueprintjs-react-table';
import {
  FormatDate,
  FormattedMessage as T,
  Money,
  Choose,
  Icon,
  If,
  Can,
} from '@/components';
import { MoneyDisplay } from '@/components/Money/MoneyDisplay';
import { SaleEstimateAction, AbilitySubject } from '@/constants/abilityOption';
import { safeCallback } from '@/utils';

export type EstimateTableRow = NonNullable<
  SaleEstimatesListResponse['data']
>[number];

interface EstimateActionsPayload {
  onEdit: (estimate: EstimateTableRow) => void;
  onDeliver: (estimate: EstimateTableRow) => void;
  onReject: (estimate: EstimateTableRow) => void;
  onApprove: (estimate: EstimateTableRow) => void;
  onDelete: (estimate: EstimateTableRow) => void;
  onConvert: (estimate: EstimateTableRow) => void;
  onViewDetails: (estimate: EstimateTableRow) => void;
  onPrint: (estimate: EstimateTableRow) => void;
  onSendMail: (estimate: EstimateTableRow) => void;
}

interface ActionsMenuProps {
  row: { original: EstimateTableRow };
  payload: EstimateActionsPayload;
}

export const statusAccessor = (row: EstimateTableRow) => (
  <Choose>
    <Choose.When condition={!!row.isApproved}>
      <Tag intent={Intent.SUCCESS} round minimal>
        <T id={'approved'} />
      </Tag>
    </Choose.When>

    <Choose.When condition={!!row.isRejected}>
      <Tag intent={Intent.DANGER} round minimal>
        <T id={'rejected'} />
      </Tag>
    </Choose.When>

    <Choose.When condition={!!row.isExpired}>
      <Tag intent={Intent.WARNING} round minimal>
        <T id={'estimate.status.expired'} />
      </Tag>
    </Choose.When>

    <Choose.When condition={!!row.isDelivered}>
      <Tag intent={Intent.SUCCESS} round minimal>
        <T id={'delivered'} />
      </Tag>
    </Choose.When>

    <Choose.Otherwise>
      <Tag round minimal>
        <T id={'draft'} />
      </Tag>
    </Choose.Otherwise>
  </Choose>
);

export function ActionsMenu({
  row: { original },
  payload: {
    onEdit,
    onDeliver,
    onReject,
    onApprove,
    onDelete,
    onConvert,
    onViewDetails,
    onPrint,
    onSendMail,
  },
}: ActionsMenuProps) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, original)}
      />
      <Can I={SaleEstimateAction.Edit} a={AbilitySubject.Estimate}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_estimate')}
          onClick={safeCallback(onEdit, original)}
        />
        <If condition={!original.isConvertedToInvoice}>
          <MenuItem
            icon={<Icon icon="convert_to" />}
            text={intl.get('convert_to_invoice')}
            onClick={safeCallback(onConvert, original)}
          />
        </If>

        <If condition={!original.isDelivered}>
          <MenuItem
            icon={<Icon icon={'check'} iconSize={18} />}
            text={intl.get('mark_as_delivered')}
            onClick={safeCallback(onDeliver, original)}
          />
        </If>
        <Choose>
          <Choose.When
            condition={!!(original.isDelivered && original.isApproved)}
          >
            <MenuItem
              icon={<Icon icon={'close-black'} />}
              text={intl.get('mark_as_rejected')}
              onClick={safeCallback(onReject, original)}
            />
          </Choose.When>
          <Choose.When
            condition={!!(original.isDelivered && original.isRejected)}
          >
            <MenuItem
              icon={<Icon icon={'check'} iconSize={18} />}
              text={intl.get('mark_as_approved')}
              onClick={safeCallback(onApprove, original)}
            />
          </Choose.When>
          <Choose.When condition={!!original.isDelivered}>
            <MenuItem
              icon={<Icon icon={'check'} iconSize={18} />}
              text={intl.get('mark_as_approved')}
              onClick={safeCallback(onApprove, original)}
            />
            <MenuItem
              icon={<Icon icon={'close-black'} />}
              text={intl.get('mark_as_rejected')}
              onClick={safeCallback(onReject, original)}
            />
          </Choose.When>
        </Choose>
      </Can>
      <Can I={SaleEstimateAction.View} a={AbilitySubject.Estimate}>
        <MenuItem
          icon={<Icon icon={'envelope'} iconSize={16} />}
          text={'Send Mail'}
          onClick={safeCallback(onSendMail, original)}
        />
        <MenuItem
          icon={<Icon icon={'print-16'} iconSize={16} />}
          text={intl.get('print')}
          onClick={safeCallback(onPrint, original)}
        />
      </Can>
      <Can I={SaleEstimateAction.Delete} a={AbilitySubject.Estimate}>
        <MenuDivider />
        <MenuItem
          text={intl.get('delete_estimate')}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Can>
    </Menu>
  );
}

const column = createColumnHelper<BP_TableFeatures, EstimateTableRow>();

export function useEstimatesTableColumns() {
  return React.useMemo(
    () =>
      column.columns([
        column.accessor('formattedEstimateDate', {
          id: 'estimate_date',
          header: intl.get('estimate_date'),
          size: 140,
        }),
        column.accessor((row) => row.customer?.displayName, {
          id: 'customer',
          header: intl.get('customer_name'),
          size: 140,
        }),
        column.accessor('expirationDate', {
          id: 'expiration_date',
          header: intl.get('expiration_date'),
          size: 140,
          cell: ({ getValue }) => <FormatDate value={getValue()} />,
        }),
        column.accessor('estimateNumber', {
          id: 'estimate_number',
          header: intl.get('estimate_number'),
          size: 140,
        }),
        column.accessor('amount', {
          id: 'amount',
          header: intl.get('amount'),
          size: 140,
          cell: ({ getValue, row }) => (
            <MoneyDisplay>
              <Money amount={getValue()} currency={row.original.currencyCode} />
            </MoneyDisplay>
          ),
        }),
        column.accessor((row) => row, {
          id: 'status',
          header: intl.get('status'),
          size: 140,
          cell: ({ getValue }) => statusAccessor(getValue()),
        }),
        column.accessor('reference', {
          id: 'reference_no',
          header: intl.get('reference_no'),
          size: 90,
        }),
      ]),
    [],
  );
}
