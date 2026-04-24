// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  Button,
  Classes,
  HTMLTable,
  Intent,
  Spinner,
  Text,
} from '@blueprintjs/core';
import { AppToaster, Box, Group } from '@/components';
import { ItemsSuggestField } from '@/components/Items/ItemsSuggestField';
import { useItems } from '@/hooks/query/items';
import { useChangePreferencesPageTitle } from '@/hooks/state';
import {
  SquareCatalogRow,
  useSquareCatalog,
  useUpsertSquareItemMapping,
} from '@/hooks/query/square-integration';

/**
 * Catalog mapping page: lists Square Catalog items/variations for the
 * connection, lets the user map each to a Bigcapital Item (or leave
 * unmapped = "ignore", which falls back to a default item at ingest).
 * Pagination is cursor-based; we keep a history stack so Back works.
 */
export default function SquareCatalogPage() {
  const { id } = useParams<{ id: string }>();
  const connectionId = Number(id);
  const history = useHistory();
  const changePageTitle = useChangePreferencesPageTitle();
  useEffect(() => {
    changePageTitle('Square Catalog');
  }, [changePageTitle]);

  const [cursorStack, setCursorStack] = useState<Array<string | undefined>>([
    undefined,
  ]);
  const currentCursor = cursorStack[cursorStack.length - 1];
  const { data, isLoading, refetch } = useSquareCatalog(
    connectionId,
    currentCursor,
  );
  const { data: itemsResp } = useItems();
  const items = itemsResp?.items ?? [];
  const { mutateAsync: upsert } = useUpsertSquareItemMapping(connectionId);

  const handleMap = async (row: SquareCatalogRow, itemId: number | null) => {
    try {
      await upsert({
        squareCatalogObjectId: row.squareCatalogObjectId,
        squareObjectType: row.squareObjectType,
        squareName: row.squareName,
        squareSku: row.squareSku ?? undefined,
        itemId,
      });
      AppToaster.show({
        message: itemId ? 'Mapping saved.' : 'Marked as ignore.',
        intent: Intent.SUCCESS,
      });
      refetch();
    } catch (err: any) {
      AppToaster.show({
        message: err?.message ?? 'Failed to save mapping.',
        intent: Intent.DANGER,
      });
    }
  };

  return (
    <PageRoot>
      <Group position="apart" style={{ marginBottom: 10 }}>
        <Text className={Classes.TEXT_MUTED}>
          Map each Square Catalog item to a Bigcapital item. Unmapped items
          fall back to a default at ingest time. Select "None" to ignore.
        </Text>
        <Button
          onClick={() =>
            history.push('/preferences/integrations/square')
          }
        >
          Back
        </Button>
      </Group>

      {isLoading && <Spinner />}
      {!isLoading && data && (
        <HTMLTable striped style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Square Name</th>
              <th>Type</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Mapped Item</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((row) => (
              <tr key={row.squareCatalogObjectId}>
                <td>
                  <Text>{row.squareName}</Text>
                  <Text
                    className={Classes.TEXT_MUTED}
                    style={{ fontSize: 11, fontFamily: 'monospace' }}
                  >
                    {row.squareCatalogObjectId}
                  </Text>
                </td>
                <td>
                  <Text className={Classes.TEXT_MUTED}>
                    {row.squareObjectType}
                  </Text>
                </td>
                <td>{row.squareSku ?? '—'}</td>
                <td>
                  {row.itemVariationPrice != null
                    ? `${row.itemVariationPrice.toFixed(2)} ${row.itemVariationCurrency ?? ''}`
                    : '—'}
                </td>
                <td style={{ minWidth: 280 }}>
                  <ItemsSuggestField
                    items={items}
                    selectedItemId={row.mappedItemId}
                    onItemSelected={(it) => handleMap(row, it?.id ?? null)}
                    defaultText={row.mappedItemId ? undefined : 'Unmapped (ignore)'}
                    allowCreate={false}
                    popoverFill
                  />
                  {row.mappedItemId != null && (
                    <Button
                      small
                      minimal
                      intent={Intent.DANGER}
                      onClick={() => handleMap(row, null)}
                      style={{ marginLeft: 6 }}
                    >
                      Clear
                    </Button>
                  )}
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
  max-width: 1000px;
  margin: 20px;
`;
