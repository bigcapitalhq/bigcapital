import { Group, Stack } from '@/components';
import React from 'react';

interface SendMailViewLayoutProps {
  header?: React.ReactNode;
  fields?: React.ReactNode;
  preview?: React.ReactNode;
}

export function SendMailViewLayout({
  header,
  fields,
  preview,
}: SendMailViewLayoutProps) {
  return (
    <Stack spacing={0} flex={1} overflow="hidden">
      {header}

      <Group flex={1} overflow="auto" spacing={0} alignItems={'stretch'}>
        <Stack
          bg="white"
          flex={'1'}
          maxWidth="720px"
          maxHeight="100%"
          spacing={0}
          borderRight="1px solid #dcdcdd"
        >
          {fields}
        </Stack>

        <Stack bg="#F5F5F5" flex={'1'} maxHeight={'100%'} minWidth="850px">
          {preview}
        </Stack>
      </Group>
    </Stack>
  );
}
