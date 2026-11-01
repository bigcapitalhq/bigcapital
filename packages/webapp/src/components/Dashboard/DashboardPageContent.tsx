import React from 'react';

interface DashboardPageContentProps {
  children: React.ReactNode;
}

export function DashboardPageContent({ children }: DashboardPageContentProps) {
  return <div className="dashboard__page-content">{children}</div>;
}
