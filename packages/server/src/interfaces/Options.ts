

export interface IOptionDTO {
  key: string,
  value: string|number,
  group: string,
};

export interface IOptionsDTO {
  options: IOptionDTO[],
};