import React from 'react';
import clsx from 'classnames';
import { get } from 'lodash';
import { Box, Group, GroupProps } from '@/components';
import styles from './InvoicePaperTemplate.module.scss';

export interface PaperTemplateProps {
  primaryColor?: string;
  secondaryColor?: string;
  children?: React.ReactNode;
}

export function PaperTemplate({
  primaryColor,
  secondaryColor,
  children,
}: PaperTemplateProps) {
  return (
    <div className={styles.root}>
      <style>{`:root { --invoice-primary-color: ${primaryColor}; --invoice-secondary-color: ${secondaryColor}; }`}</style>

      {children}
    </div>
  );
}

interface PaperTemplateTableProps {
  columns: Array<{
    accessor: string;
    label: string;
    align?: 'left' | 'center' | 'right';
  }>;
  data: Array<Record<string, any>>;
}

interface PaperTemplateBigTitleProps {
  title: string;
}

PaperTemplate.BigTitle = ({ title }: PaperTemplateBigTitleProps) => {
  return <h1 className={styles.bigTitle}>{title}</h1>;
};

interface PaperTemplateLogoProps {
  logoUri: string;
}

PaperTemplate.Logo = ({ logoUri }: PaperTemplateLogoProps) => {
  return (
    <div className={styles.logoWrap}>
      <img className={styles.logoImg} alt="" src={logoUri} />
    </div>
  );
};

PaperTemplate.Table = ({ columns, data }: PaperTemplateTableProps) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index} align={col.align}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className={styles.tableBody}>
        {data.map((_data: any) => (
          <tr>
            {columns.map((column, index) => (
              <td align={column.align} key={index}>
                {get(_data, column.accessor)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export enum PaperTemplateTotalBorder {
  Gray = 'gray',
  Dark = 'dark',
}

PaperTemplate.Totals = ({ children }: { children: React.ReactNode }) => {
  return <div className={clsx(styles.totals)}>{children}</div>;
};
PaperTemplate.TotalLine = ({
  label,
  amount,
  border,
  style,
}: {
  label: string;
  amount: string;
  border?: PaperTemplateTotalBorder;
  style?: any;
}) => {
  return (
    <div
      className={clsx(styles.totalsItem, {
        [styles.totalBottomBordered]: border === PaperTemplateTotalBorder.Dark,
        [styles.totalBottomGrayBordered]:
          border === PaperTemplateTotalBorder.Gray,
      })}
      style={style}
    >
      <div className={styles.totalsItemLabel}>{label}</div>
      <div className={styles.totalsItemAmount}>{amount}</div>
    </div>
  );
};

PaperTemplate.MutedText = () => {};

PaperTemplate.Text = () => {};

PaperTemplate.AddressesGroup = (props: GroupProps) => {
  return (
    <Group
      spacing={10}
      align={'flex-start'}
      {...props}
      className={styles.addressRoot}
    />
  );
};
PaperTemplate.Address = ({ children }: { children: React.ReactNode }) => {
  return <Box>{children}</Box>;
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
