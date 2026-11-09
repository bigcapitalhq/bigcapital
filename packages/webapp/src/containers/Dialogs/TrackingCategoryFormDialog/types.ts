import type { TrackingCategoryModule } from '@/constants';
import type {
  CreateTrackingCategoryBody,
  EditTrackingCategoryBody,
  TrackingCategory,
} from '@bigcapital/sdk-ts';

export interface TrackingCategoryFormOption {
  id?: number;
  name: string;
  active: boolean;
}

export interface TrackingCategoryFormValues {
  name: string;
  description: string;
  modules: TrackingCategoryModule[];
  options: TrackingCategoryFormOption[];
}

export type TrackingCategoryFormDialogPayload = {
  categoryId?: number | null;
  action?: string;
};

export type TrackingCategoryFormContextValue = {
  dialogName: string;
  category: TrackingCategory | undefined;
  categoryId?: number | null;
  createTrackingCategoryMutate: (
    values: CreateTrackingCategoryBody,
  ) => Promise<unknown>;
  editTrackingCategoryMutate: (
    vars: [number | string, EditTrackingCategoryBody],
  ) => Promise<unknown>;
};
