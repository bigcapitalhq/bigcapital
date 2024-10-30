import { x } from '@xstyled/emotion';
import { Box, Group, Stack } from '@/components';
import React from 'react';
import { useSendInvoiceMailSubject } from './_hooks';

export function InvoiceSendMailHeaderPreview() {
  const mailSubject = useSendInvoiceMailSubject();

  return (
    <Stack
      bg={'white'}
      borderBottom={'1px solid #dcdcdd'}
      padding={'22px 30px'}
      spacing={8}
      position={'sticky'}
      top={0}
      zIndex={1}
    >
      <Box>
        <x.h2 fontWeight={600} fontSize={16}>
          {mailSubject}
        </x.h2>
      </Box>

      <Group display="flex" gap={2}>
        <Group display="flex" alignItems="center" gap={15}>
          <x.abbr
            role="presentation"
            w={'40px'}
            h={'40px'}
            bg={'#daa3e4'}
            fill={'#daa3e4'}
            color={'#3f1946'}
            lineHeight={'40px'}
            textAlign={'center'}
            borderRadius={'40px'}
            fontSize={'14px'}
          >
            A
          </x.abbr>

          <Stack spacing={2}>
            <Group spacing={2}>
              <Box fontWeight={600}>Ahmed </Box>
              <Box color={'#738091'}>
                &lt;messaging-service@post.xero.com&gt;
              </Box>
            </Group>

            <Box fontSize={'sm'} color={'#738091'}>
              Reply to: Ahmed &lt;a.m.bouhuolia@gmail.com&gt;
            </Box>
          </Stack>
        </Group>
      </Group>
    </Stack>
  );
}

export function InvoiceSendMailPreviewWithHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box>
      <InvoiceSendMailHeaderPreview />

      <Box>{children}</Box>
    </Box>
  );
}
