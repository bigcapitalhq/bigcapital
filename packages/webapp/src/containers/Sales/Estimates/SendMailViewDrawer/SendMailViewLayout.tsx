import { Group, Stack } from '@/components';
import { useIsDarkMode } from '@/hooks/useDarkMode';
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
  const isDarkMode = useIsDarkMode();

  return (
    <Stack spacing={0} flex={1} overflow="hidden">
      {header}

      <Group flex={1} overflow="auto" spacing={0} alignItems={'stretch'}>
        <Stack
          bg={isDarkMode ? "var(--color-dark-gray2)" : "white"}
          flex={'1'}
          maxWidth="720px"
          maxHeight="100%"
          spacing={0}
          borderRightWidth={1}
          borderRightStyle="solid"
          borderRightColor={isDarkMode ? "rgba(255, 255, 255, 0.2)" : "#dcdcdd"}
        >
          {fields}
        </Stack>

        <Stack
          bg={isDarkMode ? "var(--color-dark-gray2)" : "#F5F5F5"}
          flex={'1'}
          maxHeight={'100%'}
          minWidth="850px"
        >
          {preview}
        </Stack>
      </Group>
    </Stack>
  );
}
