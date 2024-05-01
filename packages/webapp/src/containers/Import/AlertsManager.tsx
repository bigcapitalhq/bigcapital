import type { ReactNode } from 'react';
import { useState, createContext, useContext } from 'react';

interface AlertsManagerContextValue {
  alerts: (string | number)[];
  showAlert: (alert: string | number) => void;
  hideAlert: (alert: string | number) => void;

  hideAlerts: () => void;
  isAlertActive: (alert: string | number) => boolean;
  findAlert: (alert: string | number) => string | number | undefined;
}

const AlertsManagerContext = createContext<AlertsManagerContextValue>(
  {} as AlertsManagerContextValue,
);

export function AlertsManager({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<(string | number)[]>([]);

  const showAlert = (type: string | number): void => {
    setAlerts([...alerts, type]);
  };
  const hideAlert = (type: string | number): void => {
    alerts.filter((t) => t !== type);
  };
  const hideAlerts = (): void => {
    setAlerts([]);
  };
  const isAlertActive = (type: string | number): boolean => {
    return alerts.some((t) => t === type);
  };
  const findAlert = (type: string | number): number | string | undefined => {
    return alerts.find((t) => t === type);
  };

  return (
    <AlertsManagerContext.Provider
      value={{
        alerts,
        showAlert,
        hideAlert,
        hideAlerts,
        isAlertActive,
        findAlert,
      }}
    >
      {children}
    </AlertsManagerContext.Provider>
  );
}

export const useAlertsManager = () => useContext(AlertsManagerContext);
