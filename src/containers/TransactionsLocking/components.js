import React from 'react';
import styled from 'styled-components';
import {  Switch, FormGroup, Intent } from '@blueprintjs/core';
import { Icon,  FormattedMessage as T } from 'components';

export const TransactionLockingContent = ({ name, description, onSwitch }) => (
  <TransactionLockingWrapp>
    <TransactionsLockingcontent>
      <Icon icon="info-circle" iconSize={22} />

      <div className="block">
        <h3>
          <T id={name} />
        </h3>

        <p>{description}</p>
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
  border: 1px solid #d2dce2;
  max-width: 610px;
  padding: 22px 15px;
  margin-top: 25px;

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
