import { QueryBuilder, Model } from 'objection';

declare module 'objection' {
  interface QueryBuilder<M extends Model, R = M[]> {
    deleteIfNoRelations(this: QueryBuilder<M, R>, ...args: any[]): Promise<any>;
  }
}
