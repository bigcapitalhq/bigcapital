import React from 'react';
import clsx from 'classnames';
import { get, isFunction } from 'lodash';
import { x } from '@xstyled/emotion';
import { css } from '@emotion/css';
import { Box, BoxProps } from '../lib/layout/Box';
import { Group, GroupProps } from '../lib/layout/Group';

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
      backgroundColor="#fff"
      color="#111"
      boxShadow="inset 0 4px 0px 0 var(--invoice-primary-color)"
      padding="30px 30px"
      fontSize="12px"
      position="relative"
      m="0 auto"
      h="1123px"
      w="794px"
      {...restProps}
      className={clsx(
        restProps?.className,
        css`
          @media print {
            width: auto !important;
            height: auto !important;
          }
        `
      )}
    >
      <style>{`:root { --invoice-primary-color: ${primaryColor}; --invoice-secondary-color: ${secondaryColor}; }`}</style>
      {children}
    </Box>
  );
}

interface PaperTemplateBigTitleProps {
  title: string;
}

PaperTemplate.BigTitle = ({ title }: PaperTemplateBigTitleProps) => {
  return (
    <x.h1
      fontSize={'30px'}
      margin={0}
      lineHeight={1}
      fontWeight={500}
      color={'#333'}
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
    <x.div overflow={'hidden'}>
      <x.img
        width={'100%'}
        height={'100%'}
        maxWidth={'260px'}
        maxHeight={'100px'}
        alt=""
        src={logoUri}
      />
    </x.div>
  );
};

interface PaperTemplateTableProps {
  columns: Array<{
    accessor: string | ((data: Record<string, any>) => JSX.Element);
    label: string;
    value?: JSX.Element;
    align?: 'left' | 'center' | 'right';
    thStyle?: React.CSSProperties;
    visible?: boolean;
  }>;
  data: Array<Record<string, any>>;
}

PaperTemplate.Table = ({ columns, data }: PaperTemplateTableProps) => {
  const filteredColumns = columns.filter((col) => col.visible !== false);

  return (
    <table
      className={css`
        width: 100%;
        border-collapse: collapse;
        text-align: left;

        thead th {
          font-weight: 400;
          border-bottom: 1px solid #000;
          padding: 2px 10px;
          color: #333;

          &.rate,
          &.total {
            text-align: right;
          }
          &:first-of-type {
            padding-left: 0;
          }
          &:last-of-type {
            padding-right: 0;
          }
        }
        tbody {
          td {
            border-bottom: 1px solid #f6f6f6;
            padding: 12px 10px;

            &:first-of-type {
              padding-left: 0;
            }
            &:last-of-type {
              padding-right: 0;
            }
            &.rate,
            &.total {
              text-align: right;
            }
          }
        }
      `}
    >
      <thead>
        <tr>
          {filteredColumns.map((col, index) => (
            <x.th key={index} textAlign={col.align} style={col.thStyle}>
              {col.label}
            </x.th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((_data: any) => (
          <tr>
            {filteredColumns.map((column, index) => (
              <x.td textAlign={column.align} key={index}>
                {isFunction(column?.accessor)
                  ? column?.accessor(_data)
                  : get(_data, column.accessor)}
              </x.td>
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
    </x.div>
  );
};

const totalBottomBordered = css`
  border-bottom: 1px solid #000;
`;
const totalBottomGrayBordered = css`
  border-bottom: 1px solid #dadada;
`;

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
      className={clsx({
        [totalBottomBordered]: border === PaperTemplateTotalBorder.Dark,
        [totalBottomGrayBordered]: border === PaperTemplateTotalBorder.Gray,
      })}
      style={style}
    >
      <x.div min-w="160px">{label}</x.div>
      <x.div flex={'1 1 auto'} textAlign={'right'}>
        {amount}
      </x.div>
    </x.div>
  );
};

PaperTemplate.AddressesGroup = (props: GroupProps) => {
  return (
    <Group
      spacing={10}
      align={'flex-start'}
      {...props}
      className={css`
        > div {
          flex: 1;
        }
      `}
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
    <x.div mb={'20px'}>
      {label && <x.div color={'#666'}>{label}</x.div>}
      <x.div>{children}</x.div>
    </x.div>
  );
};

PaperTemplate.TermsList = ({ children }: { children: React.ReactNode }) => {
  return (
    <x.div display={'flex'} flexDirection={'column'} gap={'4px'}>
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
    <Group spacing={12}>
      <x.div minWidth={'120px'} color={'#333'}>
        {label}
      </x.div>
      <x.div>{children}</x.div>
    </Group>
  );
};
