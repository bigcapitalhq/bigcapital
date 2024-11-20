import { x } from '@xstyled/emotion';
import { Group, Stack } from '@/components';
import {
  SendMailReceipt,
  SendMailReceiptProps,
} from '../../Estimates/SendMailViewDrawer/SendMailViewReceiptPreview';

interface ReceiptSendMailReceiptProps extends SendMailReceiptProps {
  // # Company name.
  companyLogoUri?: string;
  companyName: string;

  // # Receipt number.
  receiptNumberLabel?: string;
  receiptNumber: string;

  // # Total.
  total: string;
  totalLabel?: string;

  // # Message
  message: string;

  // # Receipt items.
  items?: Array<{ label: string; total: string; quantity: string | number }>;

  // # Subtotal
  subtotal: string;
  subtotalLabel?: string;

  // # View receipt button
  showViewReceiptButton?: boolean;
  viewReceiptButtonLabel?: string;
  viewReceiptButtonOnClick?: () => void;
}

export function ReceiptSendMailReceipt({
  // # Company name.
  companyLogoUri,
  companyName,

  // # Receipt number.
  receiptNumberLabel = 'Receipt #',
  receiptNumber,

  // # Total.
  total,
  totalLabel = 'Total',

  // # Message
  message,

  // # Items
  items,
  subtotal,
  subtotalLabel = 'Subtotal',

  // # View receipt button
  showViewReceiptButton,
  viewReceiptButtonLabel,
  viewReceiptButtonOnClick,

  ...rest
}: ReceiptSendMailReceiptProps) {
  return (
    <SendMailReceipt {...rest}>
      <Stack spacing={16} textAlign={'center'}>
        {companyLogoUri && <SendMailReceipt.CompanyLogo src={companyLogoUri} />}

        <Stack spacing={8}>
          <x.h1 m={0} fontSize={'18px'} fontWeight={500} color="#404854">
            {companyName}
          </x.h1>

          <x.h3 color="#383E47" fontWeight={500}>
            {total}
          </x.h3>

          <x.span fontSize={'13px'} color="#404854">
            {receiptNumberLabel} {receiptNumber}
          </x.span>
        </Stack>

        {showViewReceiptButton && (
          <SendMailReceipt.PrimaryButton
            primaryColor={'#000'}
            onClick={viewReceiptButtonOnClick}
          >
            {viewReceiptButtonLabel}
          </SendMailReceipt.PrimaryButton>
        )}

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
            borderBottomColor={'#000'}
          >
            <x.span fontWeight={500}>{subtotalLabel}</x.span>
            <x.span fontWeight={600} fontSize={15}>
              {subtotal}
            </x.span>
          </Group>

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
        </Stack>
      </Stack>
    </SendMailReceipt>
  );
}
