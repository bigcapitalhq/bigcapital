// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { Popover2 } from '@blueprintjs/popover2';
import { Button } from '@blueprintjs/core';
import { CellType } from '@/constants';
import {
  Icon,
  FormattedMessage as T,
  ButtonLink,
  DetailsMenu,
  DetailItem,
  FormatDate,
} from '@/components';

/**
 * @return
 */
export function ProjectInvoicingCell({}) {
  const content = (
    <ProjectInvoicingContent>
      <DetailsMenu direction={'vertical'}>
        <DetailItem label={'Type'}>
          <ButtonLink>Expense</ButtonLink>
        </DetailItem>
        <DetailItem label={'Transaction No.'}>EXP-1000</DetailItem>
        <DetailItem label={'Date'}>2022-02-02</DetailItem>
        <DetailItem label={'Amount'}>$1000.00</DetailItem>
      </DetailsMenu>
    </ProjectInvoicingContent>
  );
  return (
    <Popover2 content={content}>
      <Button
        icon={<Icon icon={'info'} iconSize={14} />}
        className="m12"
        minimal={true}
      />
    </Popover2>
  );
}

ProjectInvoicingCell.cellType = CellType.Button;

const ProjectInvoicingContent = styled.div`
  width: 450px;
  padding: 7px 12px;
`;
