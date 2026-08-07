import type {
  CreateWarehouseBody,
  EditWarehouseBody,
  Warehouse,
} from '@bigcapital/sdk-ts';

export interface WarehouseFormValues {
  name: string;
  code: string;
  address: string;
  city: string;
  country: string;
  phoneNumber: string;
  website: string;
  email: string;
  // SDK requires `primary`; form has no UI for it — kept as a constant false
  // default to satisfy the type without a cast.
  primary: boolean;
}

export type WarehouseFormDialogPayload = {
  warehouseId?: number | null;
  action?: string;
};

export type WarehouseFormContextValue = {
  dialogName: string;
  warehouse: Warehouse | undefined;
  warehouseId?: number | null;
  createWarehouseMutate: (values: CreateWarehouseBody) => Promise<unknown>;
  editWarehouseMutate: (vars: [number, EditWarehouseBody]) => Promise<unknown>;
};
