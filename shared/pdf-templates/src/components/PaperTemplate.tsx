import React from 'react';
import clsx from 'classnames';
import { get, isFunction } from 'lodash';
import { x } from '@xstyled/emotion';
import { Box, BoxProps } from '../lib/layout/Box';
import { Group, GroupProps } from '../lib/layout/Group';

const styles = {
  root: 'root',
  bigTitle: 'bigTitle',
  logoWrap: 'logoWrap',
  logoImg: 'logoImg',
  table: 'table',
  tableBody: 'tableBody',
  totals: 'totals',
  totalsItem: 'totalsItem',
  totalBottomBordered: 'totalBottomBordered',
  totalBottomGrayBordered: 'totalBottomGrayBordered',
  totalsItemLabel: 'totalsItemLabel',
  totalsItemAmount: 'totalsItemAmount',
  addressRoot: 'addressRoot',
  paragraph: 'paragraph',
  paragraphLabel: 'paragraphLabel',
  details: 'details',
  detail: 'detail',
  detailLabel: 'detailLabel',
};

export interface PaperTemplateProps extends BoxProps {
  primaryColor?: string;
  secondaryColor?: string;
  children?: React.ReactNode;
}

export function PaperTemplate({
  primaryColor,
  secondaryColor,
  children,
  ...restProps
}: PaperTemplateProps) {
  return (
    <Box
      borderRadius="5px"
      backgroundColor="#fff"
      color="#111"
      boxShadow="inset 0 4px 0px 0 var(--invoice-primary-color), 0 10px 15px rgba(0, 0, 0, 0.05)"
      padding="30px 30px"
      fontSize="12px"
      position="relative"
      m="0 auto"
      h="1123px"
      w="794px"
      {...restProps}
      className={clsx(styles.root, restProps?.className)}
    >
      <style>{`:root { --invoice-primary-color: ${primaryColor}; --invoice-secondary-color: ${secondaryColor}; }`}</style>
      {children}
    </Box>
  );
}

interface PaperTemplateTableProps {
  columns: Array<{
    accessor: string | ((data: Record<string, any>) => JSX.Element);
    label: string;
    value?: JSX.Element;
    align?: 'left' | 'center' | 'right';
  }>;
  data: Array<Record<string, any>>;
}

interface PaperTemplateBigTitleProps {
  title: string;
}

PaperTemplate.BigTitle = ({ title }: PaperTemplateBigTitleProps) => {
  return (
    <x.h1
      style={{
        fontSize: '30px',
        margin: 0,
        lineHeight: 1,
        fontWeight: 500,
        color: '#333',
      }}
      className={styles.bigTitle}
    >
      {title}
    </x.h1>
  );
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
                {isFunction(column?.accessor)
                  ? column?.accessor(_data)
                  : get(_data, column.accessor)}
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
  return (
    <x.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 'auto',
        width: '300px',
      }}
    >
      {children}
    </x.div>);
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
    <x.div
      display={'flex'}
      padding={'4px 0'}

      className={clsx(styles.totalsItem, {
        [styles.totalBottomBordered]: border === PaperTemplateTotalBorder.Dark,
        [styles.totalBottomGrayBordered]:
          border === PaperTemplateTotalBorder.Gray,
      })}
      style={style}
    >
      <x.div min-w="160px">{label}</x.div>
      <x.div flex={'1 1 auto'} textAlign={'right'}>{amount}</x.div>
    </x.div>
  );
};

PaperTemplate.MutedText = () => { };

PaperTemplate.Text = () => { };

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
  return (
    <x.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      {children}
    </x.div>
  );
};

PaperTemplate.TermsItem = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <x.div style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
      <x.div style={{ minWidth: '120px', color: '#333' }}>{label}</x.div>
      <x.div>{children}</x.div>
    </x.div>
  );
};
