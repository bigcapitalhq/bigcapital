export interface ICommonEntry {
  id?: number;
  amount: number;
}

export interface ICommonLandedCostEntry extends ICommonEntry {
  landedCost: boolean;
  allocatedCostAmount: number;
}

export interface ICommonEntryDTO {
  id?: number;
  amount: number;
}

export interface ICommonLandedCostEntryDTO extends ICommonEntryDTO {
  landedCost?: boolean;
}
