// @ts-nocheck
import React from 'react';
import { Card, DetailItem, DetailsMenu } from '@/components';
import { useTaxRateDetailsContext } from './TaxRateDetailsContentBoot';
import { Intent, Tag } from '@blueprintjs/core';
import styled from 'styled-components';

export default function TaxRateDetailsContentDetails() {
  const { taxRate } = useTaxRateDetailsContext();

  return (
    <Card>
      <div>
        <TaxRateHeader>
          <TaxRateAmount>{taxRate.rate}%</TaxRateAmount>
          {taxRate.active ? (
            <TaxRateActiveTag round={false} intent={Intent.SUCCESS} minimal>
              Active
            </TaxRateActiveTag>
          ) : (
            <TaxRateActiveTag round={false} intent={Intent.NONE} minimal>
              Inactive
            </TaxRateActiveTag>
          )}
        </TaxRateHeader>
        <DetailsMenu direction={'horizantal'} minLabelSize={200}>
          <DetailItem label={'Tax Rate Name'} children={taxRate.name} />
          <DetailItem label={'Code'} children={taxRate.code} />
          <DetailItem
            label={'Description'}
            children={taxRate.description || '-'}
          />
          <DetailItem
            label={'Non Recoverable'}
            children={
              taxRate.is_non_recoverable ? (
                <Tag round={false} intent={Intent.SUCCESS} minimal>
                  Enabled
                </Tag>
              ) : (
                <Tag round={false} intent={Intent.NONE} minimal>
                  Disabled
                </Tag>
              )
            }
          />
          <DetailItem
            label={'Compound'}
            children={
              taxRate.is_compound ? (
                <Tag round={false} intent={Intent.SUCCESS} minimal>
                  Enabled
                </Tag>
              ) : (
                <Tag round={false} intent={Intent.NONE} minimal>
                  Disabled
                </Tag>
              )
            }
          />
        </DetailsMenu>
      </div>
    </Card>
  );
}

const TaxRateHeader = styled(`div`)`
  margin-bottom: 1.25rem;
  display: flex;
  align-items: flex-start;
  margin-top: 0.25rem;
`;

const TaxRateAmount = styled('div')`
  line-height: 1;
  font-size: 30px;
  color: #565b71;
  font-weight: 600;
  display: inline-block;
`;

const TaxRateActiveTag = styled(Tag)`
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 1rem;
`;
