// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import { Icon } from '@/components';

/**
 * SMS Message preview.
 */
export function SMSMessagePreview({
  message,
  iconWidth = '265px',
  iconHeight = '287px',
  iconColor = '#adadad',
}) {
  return (
    <SMSMessagePreviewBase>
      <Icon
        icon={'sms-message-preview'}
        width={iconWidth}
        height={iconHeight}
        color={iconColor}
      />
      <SMSMessageText>{message}</SMSMessageText>
    </SMSMessagePreviewBase>
  );
}

const SMSMessageText = styled.div`
  position: absolute;
  top: 60px;
  padding: 12px;
  color: #fff;
  border-radius: 12px;
  margin-left: 12px;
  margin-right: 12px;
  word-break: break-word;
  background: #2fa2e4;
  font-size: 13px;
  line-height: 1.6;
`;

const SMSMessagePreviewBase = styled.div`
  position: relative;
  width: 265px;
  margin: 0 auto;
`;
