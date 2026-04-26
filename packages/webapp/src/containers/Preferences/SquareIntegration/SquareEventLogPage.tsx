// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  Button,
  Classes,
  HTMLSelect,
  HTMLTable,
  Intent,
  Spinner,
  Tag,
  Text,
  Tooltip,
} from '@blueprintjs/core';
import { Box, Group } from '@/components';
import { useChangePreferencesPageTitle } from '@/hooks/state';
import { useSquareEventLog } from '@/hooks/query/square-integration';

const STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Received', value: 'received' },
  { label: 'Processing', value: 'processing' },
  { label: 'Done', value: 'done' },
  { label: 'Failed', value: 'failed' },
  { label: 'Skipped (duplicate)', value: 'skipped_duplicate' },
];

const statusIntent = (s: string) =>
  s === 'done'
    ? Intent.SUCCESS
    : s === 'failed'
    ? Intent.DANGER
    : s === 'processing'
    ? Intent.PRIMARY
    : Intent.NONE;

/**
 * Event log for a Square connection. Shows the inbound webhook firehose
 * with filters, useful for debugging why an event didn't create records.
 * Pagination is cursor-based by descending id.
 */
export default function SquareEventLogPage() {
  const { id } = useParams<{ id: string }>();
  const connectionId = Number(id);
  const history = useHistory();
  const changePageTitle = useChangePreferencesPageTitle();
  useEffect(() => {
    changePageTitle('Square Events');
  }, [changePageTitle]);

  const [status, setStatus] = useState('');
  const [eventType, setEventType] = useState('');
  const [cursorStack, setCursorStack] = useState<Array<number | undefined>>([
    undefined,
  ]);
  const currentCursor = cursorStack[cursorStack.length - 1];

  const filters = {
    status: status || undefined,
    eventType: eventType || undefined,
    cursor: currentCursor,
    limit: 50,
  };
  const { data, isLoading } = useSquareEventLog(connectionId, filters);

  return (
    <PageRoot>
      <Group position="apart" style={{ marginBottom: 10 }}>
        <Group spacing={10}>
          <Text className={Classes.TEXT_MUTED}>Filter:</Text>
          <HTMLSelect
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCursorStack([undefined]);
            }}
            options={STATUS_OPTIONS}
          />
          <input
            type="text"
            className={Classes.INPUT}
            placeholder="Event type (e.g. payment.created)"
            value={eventType}
            onChange={(e) => {
              setEventType(e.target.value);
              setCursorStack([undefined]);
            }}
          />
        </Group>
        <Button onClick={() => history.push('/preferences/integrations/square')}>
          Back
        </Button>
      </Group>

      {isLoading && <Spinner />}
      {!isLoading && data && (
        <HTMLTable striped style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Received</th>
              <th>Type</th>
              <th>Source</th>
              <th>Status</th>
              <th>Square Event Id</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            {data.events.map((ev) => (
              <tr key={ev.id}>
                <td>
                  <Text style={{ fontSize: 12 }}>
                    {new Date(ev.receivedAt).toLocaleString()}
                  </Text>
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>
                  {ev.eventType}
                </td>
                <td>
                  <Text className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>
                    {ev.source}
                  </Text>
                </td>
                <td>
                  <Tag minimal intent={statusIntent(ev.status)}>
                    {ev.status}
                  </Tag>
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: 11 }}>
                  {ev.squareEventId}
                </td>
                <td>
                  {ev.errorText ? (
                    <Tooltip
                      content={
                        <span style={{ whiteSpace: 'pre-wrap', maxWidth: 480, display: 'block' }}>
                          {ev.errorText}
                        </span>
                      }
                      placement="top"
                    >
                      <Text
                        className={
                          ev.status === 'failed'
                            ? Classes.INTENT_DANGER
                            : Classes.TEXT_MUTED
                        }
                        style={{
                          fontSize: 12,
                          maxWidth: 320,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          cursor: 'help',
                        }}
                      >
                        {ev.errorText}
                      </Text>
                    </Tooltip>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      )}

      <Group spacing={8} style={{ marginTop: 16 }}>
        <Button
          disabled={cursorStack.length < 2}
          onClick={() => setCursorStack((s) => s.slice(0, -1))}
        >
          Previous
        </Button>
        <Button
          disabled={!data?.nextCursor}
          onClick={() => setCursorStack((s) => [...s, data!.nextCursor!])}
        >
          Next
        </Button>
      </Group>
    </PageRoot>
  );
}

const PageRoot = styled(Box)`
  width: 100%;
  max-width: 1100px;
  margin: 20px;
`;
