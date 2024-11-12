import { Model } from 'objection';

export class BaseModel extends Model {
  public readonly id: number;
}