import React from 'react';
import clsx from 'classnames';
import { get } from 'lodash';
import { Stack } from '@/components';
import styles from './InvoicePaperTemplate.module.scss';

export interface PaperTemplateProps {
  primaryColor?: string;
  secondaryColor?: string;

  showCompanyLogo?: boolean;
  companyLogo?: string;

  bigtitle?: string;

  children?: React.ReactNode;
}

export function PaperTemplate({
  primaryColor,
  secondaryColor,
  showCompanyLogo,
  companyLogo,
  bigtitle = 'Invoice',
  children,
}: PaperTemplateProps) {
  return (
    <div className={styles.root}>
      <style>{`:root { --invoice-primary-color: ${primaryColor}; --invoice-secondary-color: ${secondaryColor}; }`}</style>

      <div>
        <h1 className={styles.bigTitle}>{bigtitle}</h1>

        {showCompanyLogo && (
          <div className={styles.logoWrap}>
            <img alt="" src={companyLogo} />
          </div>
        )}
      </div>

      {children}
    </div>
  );
}

interface PaperTemplateTableProps {
  columns: Array<{ accessor: string; label: string }>;
  data: Array<Record<string, any>>;
}

PaperTemplate.Table = ({ columns, data }: PaperTemplateTableProps) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index}>{col.label}</th>
          ))}
        </tr>
      </thead>

      <tbody className={styles.tableBody}>
        {data.map((_data: any) => (
          <tr>
            {columns.map((column, index) => (
              <td key={index}>{get(_data, column.accessor)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

PaperTemplate.Totals = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.totals}>{children}</div>;
};
PaperTemplate.TotalLine = ({
  label,
  amount,
}: {
  label: string;
  amount: string;
}) => {
  return (
    <div className={clsx(styles.totalsItem, styles.totalBottomGrayBordered)}>
      <div className={styles.totalsItemLabel}>{label}</div>
      <div className={styles.totalsItemAmount}>{amount}</div>
    </div>
  );
};

PaperTemplate.MutedText = () => {};

PaperTemplate.Text = () => {};

PaperTemplate.Address = ({ items }: { items: Array<string> }) => {
  return (
    <Stack spacing={0}>
      {items.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </Stack>
  );
};

PaperTemplate.Statement = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={styles.paragraph}>
      {label && <div className={styles.paragraphLabel}>{label}</div>}
      <div>{children}</div>
    </div>
  );
};

PaperTemplate.TermsList = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.details}>{children}</div>;
};

PaperTemplate.TermsItem = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={styles.detail}>
      <div className={styles.detailLabel}>{label}</div>
      <div>{children}</div>
    </div>
  );
};
