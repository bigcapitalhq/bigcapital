export class ModelHasRelationsError extends Error {
  type: string;

  constructor(type: string = 'ModelHasRelations', message?: string) {
    message = message || `Entity has relations`;
    super(message);
    this.type = type;
  }
}
