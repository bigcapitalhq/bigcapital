import { useMemo } from 'react';
import { x } from '@xstyled/emotion';
import { Box, Group, Stack } from '@/components';

interface SendViewPreviewHeaderProps {
  companyName?: string;
  customerName?: string;
  subject: string;
  from?: Array<string>;
  to?: Array<string>;
}

export function SendViewPreviewHeader({
  companyName,
  subject,
  customerName,
  from,
  to,
}: SendViewPreviewHeaderProps) {
  const formatedFromAddresses = useMemo(
    () => formatAddresses(from || []),
    [from],
  );
  const formattedToAddresses = useMemo(() => formatAddresses(to || []), [to]);

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
          {subject}
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
              <Box fontWeight={600}>{companyName} </Box>
              <Box color={'#738091'}>{formatedFromAddresses}</Box>
            </Group>

            <Box fontSize={'sm'} color={'#738091'}>
              Send to: {customerName} {formattedToAddresses};
            </Box>
          </Stack>
        </Group>
      </Group>
    </Stack>
  );
}

const formatAddresses = (addresses: Array<string>) =>
  addresses?.map((email) => '<' + email + '>').join(' ');