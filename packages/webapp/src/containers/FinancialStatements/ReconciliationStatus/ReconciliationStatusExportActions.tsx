import {
  AnchorButton,
  Button,
  Dialog,
  Menu,
  MenuItem,
  Popover,
} from '@blueprintjs/core';
import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import type { ReconciliationStatusReportQuery } from '@bigcapital/sdk-ts';
import {
  AppToaster,
  FormattedMessage as T,
  Icon,
  PdfDocumentPreview,
} from '@/components';
import { CLASSES } from '@/constants/classes';
import {
  useReconciliationStatusExport,
  useReconciliationStatusPdf,
} from '@/hooks/query/FinancialReports/use-reconciliation-status';

interface ExportActionsProps {
  disabled: boolean;
  query: ReconciliationStatusReportQuery;
}

export function ReconciliationStatusExportActions({
  query,
  disabled,
}: ExportActionsProps) {
  const [printQuery, setPrintQuery] =
    useState<ReconciliationStatusReportQuery | null>(null);
  const { isPending, mutate } = useReconciliationStatusExport(query);

  const exportReport = (format: 'csv' | 'xlsx') => {
    mutate(format, {
      onError: () => {
        AppToaster.show({
          intent: 'danger',
          message: intl.get('report.reconciliation_status.export_failed'),
        });
      },
    });
  };

  return (
    <>
      <Button
        minimal
        disabled={disabled}
        icon={<Icon icon="print-16" iconSize={16} />}
        text={<T id="print" />}
        onClick={() => setPrintQuery(query)}
      />
      <Popover
        minimal
        placement="bottom-start"
        disabled={disabled || isPending}
        content={
          <Menu>
            <MenuItem
              text={<T id="report.reconciliation_status.xlsx" />}
              onClick={() => exportReport('xlsx')}
            />
            <MenuItem text="CSV" onClick={() => exportReport('csv')} />
          </Menu>
        }
      >
        <Button
          minimal
          disabled={disabled}
          loading={isPending}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id="export" />}
        />
      </Popover>
      {printQuery && (
        <ReconciliationStatusPdfDialog
          query={printQuery}
          onClose={() => setPrintQuery(null)}
        />
      )}
    </>
  );
}

function ReconciliationStatusPdfDialog({
  query,
  onClose,
}: {
  query: ReconciliationStatusReportQuery;
  onClose: () => void;
}) {
  const { pdfUrl, filename, isLoaded, isError } =
    useReconciliationStatusPdf(query);

  useEffect(() => {
    if (pdfUrl) {
      return () => URL.revokeObjectURL(pdfUrl);
    }
  }, [pdfUrl]);

  return (
    <Dialog
      isOpen
      onClose={onClose}
      title={intl.get('pdf_preview.dialog.title')}
      className={CLASSES.DIALOG_PDF_PREVIEW}
      style={{ width: 'min(1000px, calc(100vw - 40px))' }}
    >
      <div className="dialog__header-actions">
        <AnchorButton
          href={pdfUrl || undefined}
          target="_blank"
          rel="noreferrer"
          disabled={!isLoaded}
          minimal
          outlined
        >
          <T id="pdf_preview.preview.button" />
        </AnchorButton>
        <AnchorButton
          href={pdfUrl || undefined}
          download={filename}
          disabled={!isLoaded}
          minimal
          outlined
        >
          <T id="pdf_preview.download.button" />
        </AnchorButton>
      </div>
      <PdfDocumentPreview
        url={pdfUrl}
        width="100%"
        height={760}
        isLoading={!isLoaded && !isError}
        isError={isError}
      />
    </Dialog>
  );
}
