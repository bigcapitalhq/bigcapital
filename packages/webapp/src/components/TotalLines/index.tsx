// @ts-nocheck
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

export function TotalLines({
  children,
  amountColWidth,
  labelColWidth,
  className,
}) {
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

export function TotalLine({ title, value, borderStyle, textStyle, className }) {
  return (
    <TotalLineRoot
      borderStyle={borderStyle}
      textStyle={textStyle}
      className={className}
    >
      <div class="title">{title}</div>
      <div class="amount">{value}</div>
    </TotalLineRoot>
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

export const TotalLineRoot = styled.div`
  display: table-row;

  .amount,
  .title {
    display: table-cell;
    padding: 8px;
    border-bottom: 1px solid #d2dde2;

    ${(props) =>
      props.borderStyle === TotalLineBorderStyle.DoubleDark &&
      `
      border-bottom: 3px double #000;
    `}
    ${(props) =>
      props.borderStyle === TotalLineBorderStyle.SingleDark &&
      `
      border-bottom: 1px double #000;
    `}
    ${(props) =>
      props.borderStyle === TotalLineBorderStyle.None &&
      `
      border-bottom-color: transparent;
    `}
    ${(props) =>
      props.textStyle === TotalLineTextStyle.Bold &&
      `
      font-weight: 600;
    `}
  }

  .amount {
    text-align: right;
  }
`;
