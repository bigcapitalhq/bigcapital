import { Button, ButtonProps, Intent } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { lighten } from 'polished';
import { x } from '@xstyled/emotion';
import { Stack, StackProps } from '@/components';

export type SendMailReceiptProps = StackProps;

export function SendMailReceipt({
  ...restProps
}: SendMailReceiptProps) {
  return (
    <Stack
      bg="white"
      w={'100%'}
      maxWidth={'450px'}
      p={'35px 25px'}
      borderRadius={'5px'}
      boxShadow={'0 10px 15px rgba(0, 0, 0, 0.05)'}
      color={'black'}
      {...restProps}
    />
  );
}

interface SendMailReceiptCompanyLogoProps extends StackProps {
  src: string;
}

function SendMailReceiptCompanyLogo({
  src,
  ...props
}: SendMailReceiptCompanyLogoProps) {
  return (
    <x.div
      h="90px"
      w="90px"
      mx="auto"
      borderRadius="3px"
      backgroundRepeat="no-repeat"
      backgroundPosition="center center"
      backgroundSize="contain"
      backgroundImage={`url("${src}")`}
      {...props}
    ></x.div>
  );
}

interface SendMailReceiptTitleProps extends ButtonProps {
  primaryColor?: string;
  children: React.ReactNode;
}

function SendMailReceiptPrimaryButton({
  primaryColor,
  ...props
}: SendMailReceiptTitleProps) {
  return (
    <Button
      large
      intent={Intent.PRIMARY}
      className={css`
        &.bp4-intent-primary {
          background-color: ${primaryColor};

          &:hover,
          &:focus {
            background-color: ${lighten(0.1, primaryColor || '#000')};
          }
        }
        &.bp4-large {
          min-height: 38px;
        }
      `}
      {...props}
    />
  );
}

SendMailReceipt.PrimaryButton = SendMailReceiptPrimaryButton;
SendMailReceipt.CompanyLogo = SendMailReceiptCompanyLogo;
