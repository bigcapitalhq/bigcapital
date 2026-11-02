import React, { useEffect, useState } from 'react';
import type { ReportResult } from '@bigcapital/extension-sdk/bridges';
import type { ExtensionComponentContext } from '@bigcapital/extension-sdk/web';

interface ReportsPageProps {
  host: ExtensionComponentContext;
}

/**
 * Example report page.
 *
 * The host provides the API client and public extension settings through the
 * `host` prop.
 */
export function ReportsPage({ host }: ReportsPageProps) {
  const [result, setResult] = useState<ReportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    host.api
      .get<ReportResult>('/reports/default/revenue-by-customer')
      .then((data) => {
        if (!cancelled) {
          setResult(data);
        }
      })
      .catch((requestError: Error) => {
        if (!cancelled) {
          setError(requestError.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [host]);

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginTop: 0 }}>Revenue by Customer</h2>
      <p style={{ color: '#5f6b7c' }}>
        This report is provided by an extension and runs through the generic
        extension report endpoint.
      </p>

      {error && (
        <div style={{ color: '#db3737', marginBottom: 16 }}>{error}</div>
      )}

      {!result && !error && <div>Loading report…</div>}

      {result && (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: '#fff',
          }}
        >
          <thead>
            <tr>
              {result.columns.map((column) => (
                <th
                  key={column.key}
                  style={{
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderBottom: '1px solid #d8e1e8',
                  }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, index) => (
              <tr key={index}>
                {result.columns.map((column) => (
                  <td
                    key={column.key}
                    style={{
                      padding: '8px 12px',
                      borderBottom: '1px solid #edf1f5',
                    }}
                  >
                    {String(row[column.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
            {result.rows.length === 0 && (
              <tr>
                <td
                  colSpan={result.columns.length}
                  style={{ padding: 16, color: '#5f6b7c' }}
                >
                  No revenue found for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
