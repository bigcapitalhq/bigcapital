

export interface IMetadata {
  key: string,
  value: string|boolean|number,
  group: string,
  _markAsDeleted?: boolean,
  _markAsInserted?: boolean,
  _markAsUpdated?: boolean,
};

export interface IMetaQuery {
  key: string,
  group?: string,
};

export interface IMetableStore {
  find(query: string|IMetaQuery): IMetadata;
  all(): IMetadata[];
  get(query: string|IMetaQuery, defaultValue: any): string|number|boolean;
  remove(query: string|IMetaQuery): void;
  removeAll(): void;
  toArray(): IMetadata[];
};

export interface IMetableStoreStorage {
  save(): Promise<void>;
}