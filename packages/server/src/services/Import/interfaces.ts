export interface ImportMappingAttr {
  from: string;
  to: string;
}

export interface ImportValidationError {
  index: number;
  property: string;
  constraints: Record<string, string>;
}
