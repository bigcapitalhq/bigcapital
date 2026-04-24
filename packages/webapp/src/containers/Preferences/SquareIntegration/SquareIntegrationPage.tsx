// @ts-nocheck
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  Button,
  Classes,
  Intent,
  Menu,
  MenuItem,
  NonIdealState,
  Spinner,
  Tag,
  Text,
} from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { Box, Card, Group, Stack } from '@/components';
import { useChangePreferencesPageTitle } from '@/hooks/state';
import {
  useDisconnectSquare,
  useStartSquareOAuth,
  useSquareConnections,
} from '@/hooks/query/square-integration';

/**
 * Entry page for the Square integration. Lists existing connections and
 * exposes the "Connect Square" CTA. Each connection row deep-links into its
 * setup wizard / settings page.
 */
export default function SquareIntegrationPage() {
  const changePageTitle = useChangePreferencesPageTitle();
  useEffect(() => {
    changePageTitle('Square Integration');
  }, [changePageTitle]);

  const startOAuth = useStartSquareOAuth();
  const { data: connections, isLoading, refetch } = useSquareConnections();
  const { mutateAsync: disconnect } = useDisconnectSquare({
    onSuccess: () => refetch(),
  });

  return (
    <PageRoot>
      <Text className={Classes.TEXT_MUTED} style={{ marginBottom: 20 }}>
        Pull sales, invoices and payouts directly from Square into Bigcapital.
        Webhook-driven; set up once per Square merchant.
      </Text>

      <Group position="apart" style={{ marginBottom: 16 }}>
        <Text style={{ fontWeight: 600 }}>Connections</Text>
        <Button intent={Intent.PRIMARY} onClick={() => startOAuth()}>
          Connect Square
        </Button>
      </Group>

      {isLoading && <Spinner size={24} />}

      {!isLoading && (!connections || connections.length === 0) && (
        <NonIdealState
          icon="link"
          title="No Square connections yet"
          description="Click 'Connect Square' to start the OAuth flow. You'll return here after authorizing."
        />
      )}

      <Stack spacing={12}>
        {(connections ?? []).map((c) => (
          <Card key={c.id} style={{ margin: 0 }}>
            <Group position="apart" align="flex-start">
              <Box>
                <Group spacing={8}>
                  <Text style={{ fontWeight: 600 }}>
                    Merchant {c.merchantId}
                  </Text>
                  <StatusTag status={c.status} />
                  {c.environment === 'sandbox' && (
                    <Tag minimal intent={Intent.WARNING}>
                      Sandbox
                    </Tag>
                  )}
                </Group>
                {c.statusMessage && (
                  <Text className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>
                    {c.statusMessage}
                  </Text>
                )}
              </Box>
              <Group spacing={8}>
                <Link to={`/preferences/integrations/square/${c.id}/setup`}>
                  <Button small>
                    {c.status === 'pending' ? 'Finish Setup' : 'Settings'}
                  </Button>
                </Link>
                <Link to={`/preferences/integrations/square/${c.id}/catalog`}>
                  <Button small>Catalog</Button>
                </Link>
                <Link to={`/preferences/integrations/square/${c.id}/events`}>
                  <Button small>Events</Button>
                </Link>
                <Popover2
                  content={
                    <Menu>
                      <MenuItem
                        intent={Intent.DANGER}
                        text="Disconnect"
                        onClick={() => {
                          if (
                            window.confirm(
                              'Disconnect this Square connection? Historical records stay. Tokens will be cleared.',
                            )
                          ) {
                            disconnect(c.id);
                          }
                        }}
                      />
                    </Menu>
                  }
                  placement="bottom-end"
                >
                  <Button small minimal icon="more" />
                </Popover2>
              </Group>
            </Group>
          </Card>
        ))}
      </Stack>
    </PageRoot>
  );
}

function StatusTag({ status }: { status: string }) {
  const intent =
    status === 'active'
      ? Intent.SUCCESS
      : status === 'pending'
      ? Intent.WARNING
      : Intent.NONE;
  const label =
    status === 'active'
      ? 'Active'
      : status === 'pending'
      ? 'Setup Incomplete'
      : 'Disabled';
  return (
    <Tag minimal intent={intent}>
      {label}
    </Tag>
  );
}

const PageRoot = styled(Box)`
  width: 100%;
  max-width: 800px;
  margin: 20px;
`;
