import React from 'react';
import type { Vendor } from '@bigcapital/sdk-ts';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { useVendor } from '@/hooks/query';

/**
 * The SDK `Vendor` type is missing several backend-supplied display fields
 * (formatted_balance, formatted_opening_balance, formatted_opening_balance_at).
 * These are rendered in the drawer header/details, so we model them as
 * optional extras on top of the SDK shape.
 */
export type VendorDetails = Vendor & {
  formattedBalance?: string;
  formattedOpeningBalance?: string;
  formattedOpeningBalanceAt?: string;
};

export interface VendorDetailsDrawerContextValue {
  vendor: VendorDetails | undefined;
  vendorId: number | undefined;
  contact: VendorDetails | undefined;
  isVendorLoading: boolean;
}

interface VendorDetailsDrawerProviderProps {
  vendorId: number | undefined;
  children?: React.ReactNode;
}

const VendorDetailDrawerContext = React.createContext<
  VendorDetailsDrawerContextValue | undefined
>(undefined);

/**
 * Contact detail provider.
 */
function VendorDetailsDrawerProvider({
  vendorId,
  children,
}: VendorDetailsDrawerProviderProps) {
  // Handle fetch vendor details.
  const { data: vendor, isLoading: isVendorLoading } = useVendor(vendorId, {
    enabled: !!vendorId,
  });

  // The query returns the SDK `Vendor`, but the backend response also includes
  // several `formatted_*` display fields that aren't modelled in the SDK type.
  // Treat the payload as the wider `VendorDetails` shape.
  const vendorDetails = vendor as VendorDetails | undefined;

  // Provider.
  const provider: VendorDetailsDrawerContextValue = {
    vendor: vendorDetails,
    // Backwards-compat alias used by some consumers.
    contact: vendorDetails,
    vendorId,
    isVendorLoading,
  };

  return (
    <DrawerLoading loading={isVendorLoading}>
      <DrawerHeaderContent
        name={DRAWERS.VENDOR_DETAILS}
        title={vendor?.displayName}
      />
      <VendorDetailDrawerContext.Provider value={provider}>
        {children}
      </VendorDetailDrawerContext.Provider>
    </DrawerLoading>
  );
}

const useVendorDetailsDrawerContext = (): VendorDetailsDrawerContextValue => {
  const ctx = React.useContext(VendorDetailDrawerContext);
  if (!ctx) {
    throw new Error(
      'useVendorDetailsDrawerContext must be used within VendorDetailsDrawerProvider',
    );
  }
  return ctx;
};

export { VendorDetailsDrawerProvider, useVendorDetailsDrawerContext };
