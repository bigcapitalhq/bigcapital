import React from 'react';
import styled from 'styled-components';
import { Switch, FormGroup, Position } from '@blueprintjs/core';
import { Hint, Icon, FormattedMessage as T } from 'components';

export const TransactionLockingContent = ({ name, description, onSwitch }) => (
  <TransactionLockingWrapp>
    <TransactionsLockingcontent>
      <TransLockingIcon>
        <Icon icon="info-circle" iconSize={22} />
      </TransLockingIcon>

      <div className="block">
        <TransLockingItemTitle>
          <T id={name} />{' '}
          <Hint
            content={
              'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do'
            }
            position={Position.BOTTOM_LEFT}
          />
        </TransLockingItemTitle>
        <TransLockingItemDesc>{description}</TransLockingItemDesc>
      </div>
      <FormGroup>
        <Switch
          large={true}
          defaultChecked={false}
          minimal={true}
          className="ml2"
          onChange={onSwitch}
        />
      </FormGroup>
    </TransactionsLockingcontent>
  </TransactionLockingWrapp>
);

const TransactionLockingWrapp = styled.div`
  display: flex;
  align-items: center;
  border-radius: 6px;
  border: 1px solid #d1dee2;
  padding: 14px 18px;
  margin-bottom: 25px;
  background: #fff;

  div.block {
    flex: 1 1 0;
    margin-left: 20px;
    width: 100%;
  }
`;

const TransactionsLockingcontent = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 0;
`;

const TransLockingItemTitle = styled.h1`
  font-size: 18px;
  margin: 0 0 8px;
  line-height: 1;
  font-weight: 600;
`;
const TransLockingItemDesc = styled.p`
  margin-bottom: 0;
  opacity: 0.8;
`;

const TransLockingIcon = styled.div`
  border: 1px solid #d2dde2;
  height: 50px;
  width: 50px;
  text-align: center;
  line-height: 50px;
  border-radius: 5px;
  color: #8190ac;
`;
