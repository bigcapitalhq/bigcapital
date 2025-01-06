import { QueryBuilder } from 'objection';
import Objection, { Model, Page } from 'objection';

interface PaginationResult<M extends Model> {
  results: M[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
  };
}

class PaginationQueryBuilder<
  M extends Model,
  R = M[],
> extends Model.QueryBuilder<M, R> {
  pagination(page: number, pageSize: number): QueryBuilder<M, PaginationResult<M>> {
    // @ts-ignore
    return super.page(page, pageSize).runAfter(({ results, total }) => {
      return {
        results,
        pagination: {
          total,
          page: page + 1,
          pageSize,
        },
      };
    });
  }
}

export class BaseModel extends Model {
  public readonly id: number;
  public readonly tableName: string;

  QueryBuilderType!: PaginationQueryBuilder<this>;
  static QueryBuilder = PaginationQueryBuilder;
}
