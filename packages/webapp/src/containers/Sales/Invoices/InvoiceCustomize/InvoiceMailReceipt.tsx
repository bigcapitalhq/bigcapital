import { Button, Intent } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { x } from '@xstyled/emotion';
import { lighten } from 'polished';
import { Group, Stack, StackProps } from '@/components';
import { isEmpty } from 'lodash';

export interface InvoiceMailReceiptProps extends StackProps {
  // # Company
  companyName: string;
  companyLogoUri?: string;

  // # Colors
  primaryColor?: string;

  // # Due date
  dueDate: string;
  dueDateLabel?: string;

  // # Subtotal
  subtotal: string;
  subtotalLabel?: string;

  // # Discount amount
  discount?: string;
  discountLabel?: string;

  // # Adjustment
  adjustment?: string;
  adjustmentLabel?: string;

  // # Due amount
  dueAmountLabel?: string;
  dueAmount: string;

  // # Total
  total: string;
  totalLabel?: string;

  // # Invoice number
  invoiceNumber: string;
  invoiceNumberLabel?: string;

  // # Mail message
  message: string;

  // # Invoice items
  items?: Array<{ label: string; total: string; quantity: string | number }>;

  // # View invoice button
  showViewInvoiceButton?: boolean;
  viewInvoiceButtonLabel?: string;
  viewInvoiceButtonOnClick?: () => void;
}

export function InvoiceMailReceipt({
  // # Company
  companyName,
  companyLogoUri,

  // # Colors
  primaryColor = 'rgb(0, 82, 204)',

  // # Due date
  dueDate,
  dueDateLabel = 'Due',

  // # Subtotal
  subtotal,
  subtotalLabel = 'Subtotal',

  // # Discount amount
  discount,
  discountLabel = 'Discount',

  // # Adjustment
  adjustment,
  adjustmentLabel = 'Adjustment',

  // # Total
  total,
  totalLabel = 'Total',

  // # Due amount
  dueAmountLabel = 'Due Amount',
  dueAmount,

  // # Invoice number
  invoiceNumber,
  invoiceNumberLabel = 'Invoice #',

  // # Invoice message
  message,

  // # Invoice items
  items,

  // # View invoice button
  showViewInvoiceButton = true,
  viewInvoiceButtonLabel = 'View Invoice',
  viewInvoiceButtonOnClick,
  ...restProps
}: InvoiceMailReceiptProps) {
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
    >
      <Stack spacing={16} textAlign={'center'}>
        {companyLogoUri && (
          <x.div
            h="90px"
            w="90px"
            mx="auto"
            borderRadius="3px"
            backgroundRepeat="no-repeat"
            backgroundPosition="center center"
            backgroundSize="contain"
            backgroundImage={`url("${companyLogoUri}")`}
          ></x.div>
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
            {dueDateLabel} {dueDate}
          </x.span>
        </Stack>
      </Stack>

      <x.p m={0} whiteSpace={'pre-line'} color="#252A31">
        {message}
      </x.p>

      {showViewInvoiceButton && (
        <Button
          large
          intent={Intent.PRIMARY}
          className={css`
            &.bp4-intent-primary {
              background-color: ${primaryColor};

              &:hover,
              &:focus {
                background-color: ${lighten(0.1, primaryColor)};
              }
            }
            &.bp4-large {
              min-height: 38px;
            }
          `}
          onClick={viewInvoiceButtonOnClick}
        >
          {viewInvoiceButtonLabel}
        </Button>
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

        {/*---- Subtotal ----*/}
        <Group
          h={'40px'}
          position={'apart'}
          borderBottomStyle="solid"
          borderBottomWidth={'1px'}
          borderColor={'#000'}
        >
          <x.span fontWeight={500}>{subtotalLabel}</x.span>
          <x.span fontWeight={600} fontSize={15}>
            {subtotal}
          </x.span>
        </Group>

        {/*---- Discount ----*/}
        {!isEmpty(discount) && (
          <Group
            h="40px"
            position="apart"
            borderBottomStyle="solid"
            borderBottomWidth="1px"
            borderColor="#D9D9D9"
          >
            <x.span>{discountLabel}</x.span>
            <x.span fontSize={15}>
              {discount}
            </x.span>
          </Group>
        )}

        {/*---- Adjustment ----*/}
        {!isEmpty(adjustment) && (
          <Group
            h="40px"
            position="apart"
            borderBottomStyle="solid"
            borderBottomWidth="1px"
            borderColor="#D9D9D9"
          >
            <x.span>{adjustmentLabel}</x.span>
            <x.span fontSize={15}>
              {adjustment}
            </x.span>
          </Group>
        )}

        {/*---- Total ----*/}
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

        {/*---- Due amount ----*/}
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
