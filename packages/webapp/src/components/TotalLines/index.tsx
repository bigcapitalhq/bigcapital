// @ts-nocheck
import { x } from '@xstyled/emotion';
import React from 'react';
import styled from 'styled-components';
export const TotalLineBorderStyle = {
  None: 'None',
  SingleDark: 'SingleDark',
  DoubleDark: 'DoubleDark',
};

export const TotalLineTextStyle = {
  Regular: 'Regular',
  Bold: 'Bold',
};

interface TotalLinesProps {
  children?: React.ReactNode;
  amountColWidth?: string | number;
  labelColWidth?: string | number;
  className?: string;
}

export function TotalLines({
  children,
  amountColWidth,
  labelColWidth,
  className,
}: TotalLinesProps) {
  return (
    <TotalLinesRoot
      className={className}
      amountColWidth={amountColWidth}
      labelColWidth={labelColWidth}
    >
      {children}
    </TotalLinesRoot>
  );
}

interface TotalLineProps {
  title?: React.ReactNode;
  value?: React.ReactNode;
  borderStyle?: string;
  textStyle?: string;
  className?: string;
}

export function TotalLine({
  title,
  value,
  borderStyle,
  textStyle,
  className,
}: TotalLineProps) {
  return (
    <TotalLinePrimitive
      borderStyle={borderStyle}
      textStyle={textStyle}
      className={className}
    >
      <div class="title">{title}</div>
      <div class="amount">{value}</div>
    </TotalLinePrimitive>
  );
}

export const TotalLinesRoot = styled.div`
  display: table;

  ${(props) =>
    props.amountColWidth &&
    `
    .amount{
      width: ${props.amountColWidth}
    }
  `}

  ${(props) =>
    props.labelColWidth &&
    `
    .title{
      width: ${props.labelColWidth}
    }
  `}
`;

const TotalLinePrimitiveBase = styled.div`
  --x-color-divider: #d2dde2;
  --x-color-divider-dark: #000;

  --x-color-divider: rgba(255, 255, 255, 0.1);
  --x-color-divider-dark: rgba(255, 255, 255, 0.2);

  display: table-row;

  .amount,
  .title {
    display: table-cell;
    padding: 8px;
    border-bottom: 1px solid var(--x-color-divider);

    ${(props) =>
      props.borderStyle === TotalLineBorderStyle.DoubleDark &&
      `
      border-bottom: 3px double var(--x-color-divider-dark);
    `}
    ${(props) =>
      props.borderStyle === TotalLineBorderStyle.SingleDark &&
      `
      border-bottom: 1px double var(--x-color-divider-dark);
    `}
    ${(props) =>
      props.borderStyle === TotalLineBorderStyle.None &&
      `
      border-bottom-color: transparent;
    `}
    ${(props) =>
      props.textStyle === TotalLineBorderStyle.Bold &&
      `
      font-weight: 600;
    `}
  }

  .amount {
    text-align: right;
    width: 25%;
  }
`;

const TotalLineAmount = (props) => {
  return (
    <x.div
      display={'table-cell'}
      padding={'8px'}
      textAlign={'right'}
      {...props}
    />
  );
};

const TotalLineTitle = (props) => {
  return <x.div display={'table-cell'} padding={'8px'} {...props} />;
};

export const TotalLinePrimitive = Object.assign(TotalLinePrimitiveBase, {
  Amount: TotalLineAmount,
  Title: TotalLineTitle,
});
