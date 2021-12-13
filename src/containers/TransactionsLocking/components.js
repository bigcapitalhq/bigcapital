import React from 'react';
import styled from 'styled-components';
import {
  Button,
  Position,
  MenuItem,
  Menu,
  Intent,
  Divider,
  Classes,
  Tag,
} from '@blueprintjs/core';
import { Hint, Icon, If, FormattedMessage as T } from 'components';
import { Popover2 } from '@blueprintjs/popover2';
import { safeInvoke } from 'utils';

export const TransactionLockingItemLoading = ({}) => {
  return (
    <TransactionLockingWrapp>
      <TransLockingInner>
        <TransLockingIcon>
          <Icon icon="lock" iconSize={24} />
        </TransLockingIcon>

        <TransLockingContent>
          <TransLockingItemTitle className={Classes.SKELETON}>
            XXXX
          </TransLockingItemTitle>

          <TransLockingItemDesc className={Classes.SKELETON}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </TransLockingItemDesc>
        </TransLockingContent>
      </TransLockingInner>
    </TransactionLockingWrapp>
  );
};

export const TransactionLockingContent = ({
  name,
  description,
  module,
  isEnabled,
  isPartialUnlock,
  onLock,
  onEditLock,
  onUnlockFull,
  onUnlockPartial,
  onCancle,
}) => {
  const handleLockClick = (event) => {
    safeInvoke(onLock, module, event);
  };
  const handleEditBtn = (event) => {
    safeInvoke(onEditLock, module, event);
  };
  const handleUnlockPartial = (event) => {
    safeInvoke(onUnlockPartial, module, event);
  };

  const handleUnlockFull = (event) => {
    safeInvoke(onUnlockFull, module, event);
  };
  const handleCanclel = (event) => {
    safeInvoke(onCancle, module, event);
  };

  return (
    <TransactionLockingWrapp isEnabled={isEnabled}>
      <TransLockingInner>
        <TransLockingIcon>
          <Icon icon="lock" iconSize={24} />
        </TransLockingIcon>

        <TransLockingContent>
          <TransLockingItemTitle>
            {name}
            <Hint content={description} position={Position.BOTTOM_LEFT} />

            {isPartialUnlock && (
              <Tag small={true} minimal={true} intent={Intent.PRIMARY}>
                Partial unlocked
              </Tag>
            )}
          </TransLockingItemTitle>
          <TransLockingItemDesc>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </TransLockingItemDesc>
        </TransLockingContent>

        <TransLockingActions>
          <If condition={!isEnabled && !isPartialUnlock}>
            <Button
              small={true}
              minimal={true}
              intent={Intent.PRIMARY}
              onClick={handleLockClick}
            >
              Lock
            </Button>
          </If>

          <If condition={isEnabled && !isPartialUnlock}>
            <Button
              small={true}
              minimal={true}
              intent={Intent.PRIMARY}
              onClick={handleEditBtn}
            >
              Edit
            </Button>
            <Divider />
            <Popover2
              content={
                <Menu>
                  <MenuItem text="Full unlock" onClick={handleUnlockFull} />

                  <MenuItem
                    text="Partial unlock"
                    onClick={handleUnlockPartial}
                  />
                </Menu>
              }
              placement={'bottom-start'}
              minimal={true}
            >
              <Button small={true} minimal={true} intent={Intent.PRIMARY}>
                Unlock
              </Button>
            </Popover2>
          </If>

          <If condition={isPartialUnlock}>
            <Button
              small={true}
              minimal={true}
              intent={Intent.PRIMARY}
              onClick={handleCanclel}
            >
              Cancel
            </Button>
          </If>
        </TransLockingActions>
      </TransLockingInner>
    </TransactionLockingWrapp>
  );
};

const TransactionLockingWrapp = styled.div`
  display: flex;
  align-items: center;
  border-radius: 6px;
  border: 1px solid #d1dee2;
  padding: 16px 18px;
  margin-bottom: 25px;
  background: #fff;
  box-shadow: 0 4px 20px -5px rgb(0 8 36 / 5%);

  ${(props) =>
    props.isEnabled &&
    `
    border-color: #fe9f9e; 

    ${TransLockingIcon} {
      color: #ff8282;
    }
  `}
`;

const TransLockingInner = styled.div`
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
  opacity: 0.9;
`;

const TransLockingIcon = styled.div`
  border: 1px solid #d2dde2;
  height: 45px;
  width: 45px;
  text-align: center;
  line-height: 45px;
  border-radius: 8px;
  color: #93a1ba;

  .bp3-icon {
    position: relative;
    top: 1px;
  }
`;

export const TransLockingActions = styled.div`
  display: flex;

  .bp3-divider {
    margin: 2px;
  }
`;

export const TransLockingContent = styled.div`
  flex: 1 1 0;
  margin-left: 20px;
  width: 100%;
`;
