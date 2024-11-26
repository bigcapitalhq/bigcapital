import { x } from '@xstyled/emotion';
import { Group, Stack } from '@/components';
import {
  SendMailReceipt,
  SendMailReceiptProps,
} from '../../Estimates/SendMailViewDrawer/SendMailViewReceiptPreview';

export interface PaymentReceivedMailReceiptProps extends SendMailReceiptProps {
  // # Company
  companyName: string;
  companyLogoUri?: string;

  // # Colors
  primaryColor?: string;

  // # Payment date
  paymentDate: string;
  paymentDateLabel?: string;

  // # Total
  total: string;
  totalLabel?: string;

  // # Subtotal
  subtotal: string;
  subtotalLabel?: string;

  // # Invoice number
  paymentNumber: string;
  paymentNumberLabel?: string;

  // # Mail message
  message: string;

  // # Paid Invoices
  items?: Array<{ label: string; total: string }>;
}

export function PaymentReceivedMailReceipt({
  // # Company
  companyName,
  companyLogoUri,

  // # Colors
  primaryColor = 'rgb(0, 82, 204)',

  // # Payment date
  paymentDate,
  paymentDateLabel = 'Payment Date',

  // # Total
  total,
  totalLabel = 'Total',

  // # Payment number
  paymentNumber,
  paymentNumberLabel = 'Payment #',

  // # Mail message
  message,

  // # Subtotal
  subtotal,
  subtotalLabel = 'Subtotal',

  // # Paid Invoices
  items = [],

  ...restProps
}: PaymentReceivedMailReceiptProps) {
  return (
    <SendMailReceipt {...restProps}>
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
            {paymentNumberLabel} {paymentNumber}
          </x.span>

          <x.span fontSize={'13px'} color="#404854">
            {paymentDateLabel} {paymentDate}
          </x.span>
        </Stack>
      </Stack>

      <x.p m={0} whiteSpace={'pre-line'} color="#252A31">
        {message}
      </x.p>

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
            <x.span>{item.total}</x.span>
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
    </SendMailReceipt>
  );
}
