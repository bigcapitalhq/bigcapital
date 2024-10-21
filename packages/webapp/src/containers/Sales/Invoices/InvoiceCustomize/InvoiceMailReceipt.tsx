import { Button, Intent } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { x } from '@xstyled/emotion';
import { Group, Stack, StackProps } from '@/components';

export interface InvoiceMailReceiptProps extends StackProps {
  companyLogoUri?: string;
  message: string;
  companyName: string;
  invoiceNumber: string;
  dueDate: string;
  items?: Array<{ label: string; total: string; quantity: string | number }>;
  total: string;
  dueAmount: string;
  totalLabel?: string;
  dueAmountLabel?: string;
  viewInvoiceButtonLabel?: string;
  viewInvoiceButtonOnClick?: () => void;
  invoiceNumberLabel?: string;
}

export function InvoiceMailReceipt({
  companyLogoUri,
  message,
  companyName,
  total,
  invoiceNumber,
  dueDate,
  dueAmount,
  items,
  viewInvoiceButtonLabel = 'View Invoice',
  viewInvoiceButtonOnClick,
  totalLabel = 'Total',
  dueAmountLabel = 'Due Amount',
  invoiceNumberLabel = 'Invoice #',
  ...restProps
}: InvoiceMailReceiptProps) {
  return (
    <Stack
      bg="white"
      w={'100%'}
      maxWidth={'500px'}
      p={'35px 25px'}
      borderRadius={'5px'}
      boxShadow={'0 10px 15px rgba(0, 0, 0, 0.05)'}
      color={'black'}
      {...restProps}
    >
      <Stack spacing={16} textAlign={'center'}>
        {companyLogoUri && (
          <x.div h={'90px'} w={'90px'} bg="#F2F2F2" mx="auto"></x.div>
        )}
        <Stack spacing={8}>
          <x.h1 m={0} fontSize={'18px'} fontWeight={500} color="#404854">
            {companyName}
          </x.h1>

          <x.h3 color="#383E47" fontWeight={500}>
            {total}
          </x.h3>

          <x.span fontSize={'13px'} color="#404854">
            {invoiceNumberLabel} {invoiceNumber}
          </x.span>

          <x.span fontSize={'13px'} color="#404854">
            Due {dueDate}
          </x.span>
        </Stack>
      </Stack>

      <x.p m={0} whiteSpace={'pre-line'} color="#252A31">
        {message}
      </x.p>

      <Button
        large
        intent={Intent.PRIMARY}
        className={css`
          &.bp4-large {
            min-height: 38px;
          }
        `}
        onClick={viewInvoiceButtonOnClick}
      >
        {viewInvoiceButtonLabel}
      </Button>

      <Stack spacing={0}>
        {items?.map((item, key) => (
          <Group
            key={key}
            h={'40px'}
            position={'apart'}
            borderBottomStyle="solid"
            borderBottomWidth={'1px'}
            borderBottomColor={'#D9D9D9'}
            borderTopStyle="solid"
            borderTopColor={'#D9D9D9'}
            borderTopWidth={'1px'}
          >
            <x.span>{item.label}</x.span>
            <x.span>
              {item.quantity} x {item.total}
            </x.span>
          </Group>
        ))}

        <Group
          h={'40px'}
          position={'apart'}
          borderBottomStyle="solid"
          borderBottomWidth={'1px'}
          borderColor={'#000'}
        >
          <x.span fontWeight={500}>{totalLabel}</x.span>
          <x.span fontWeight={600} fontSize={15}>
            {total}
          </x.span>
        </Group>

        <Group
          h={'40px'}
          position={'apart'}
          borderBottomStyle="solid"
          borderBottomWidth={'1px'}
          borderBottomColor={'#000'}
        >
          <x.span fontWeight={500}>{dueAmountLabel}</x.span>
          <x.span fontWeight={600} fontSize={15}>
            {dueAmount}
          </x.span>
        </Group>
      </Stack>
    </Stack>
  );
}
