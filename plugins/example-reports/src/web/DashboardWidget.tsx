import React from 'react';
import type { ExtensionComponentContext } from '@bigcapital/extension-sdk/web';

interface DashboardWidgetProps {
  host: ExtensionComponentContext;
}

/**
 * Example dashboard widget contributed through the `dashboard.widgets` slot.
 */
export function DashboardWidget({ host }: DashboardWidgetProps) {
  return (
    <div
      style={{
        padding: 20,
        margin: '20px 0',
        background: '#fff',
        border: '1px solid #d8e1e8',
        borderRadius: 8,
      }}
    >
      <h3 style={{ marginTop: 0 }}>Example Reports</h3>
      <p style={{ color: '#5f6b7c', marginBottom: 12 }}>
        This widget is rendered by an extension through the `dashboard.widgets`
        slot.
      </p>
      <button
        type="button"
        onClick={() => host.navigate('/ext/bigcapital.example-reports/reports')}
      >
        Open revenue report
      </button>
    </div>
  );
}
