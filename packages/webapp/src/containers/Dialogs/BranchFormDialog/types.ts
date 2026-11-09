import type {
  Branch,
  CreateBranchBody,
  EditBranchBody,
} from '@bigcapital/sdk-ts';

export interface BranchFormValues {
  name: string;
  code: string;
  address: string;
  city: string;
  country: string;
  website: string;
  phoneNumber: string;
  email: string;
  // SDK requires `primary`; form has no UI for it — kept as a constant false
  // default to satisfy the type without a cast (mirrors WarehouseFormValues).
  primary: boolean;
}

export type BranchFormDialogPayload = {
  branchId?: number | null;
  action?: string;
};

export type BranchFormContextValue = {
  dialogName: string;
  branch: Branch | undefined;
  branchId?: number | null;
  createBranchMutate: (values: CreateBranchBody) => Promise<unknown>;
  editBranchMutate: (
    vars: [number | string, EditBranchBody],
  ) => Promise<unknown>;
};
