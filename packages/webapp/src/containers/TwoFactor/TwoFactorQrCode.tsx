import { QRCodeSVG } from 'qrcode.react';
import React from 'react';
import styled from 'styled-components';

interface TwoFactorQrCodeProps {
  otpauthUrl: string;
}

/**
 * QR code of the otpauth:// URI, rendered in the browser (the secret never
 * goes to a third-party service). Always black on white, also in dark mode.
 */
export function TwoFactorQrCode({ otpauthUrl }: TwoFactorQrCodeProps) {
  return (
    <QrCodeRoot data-testId="two-factor-qr-code">
      <QRCodeSVG
        value={otpauthUrl}
        size={176}
        level="M"
        marginSize={2}
        bgColor="#ffffff"
        fgColor="#000000"
        title="QR code for the authenticator app"
      />
    </QrCodeRoot>
  );
}

const QrCodeRoot = styled.div`
  display: inline-flex;
  padding: 4px;
  background: #ffffff;
  border: 1px solid #d5d5d5;
  border-radius: 3px;
`;
