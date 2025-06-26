import { QueryBuilder, Model } from 'objection';

interface PaginationResult<M extends Model> {
  results: M[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export type PaginationQueryBuilderType<M extends Model> = QueryBuilder<
  M,
  PaginationResult<M>
>;

export class PaginationQueryBuilder<
  M extends Model,
  R = M[],
> extends QueryBuilder<M, R> {
  pagination(page: number, pageSize: number): PaginationQueryBuilderType<M> {
    const query = super.page(page, pageSize);

    return query.runAfter(({ results, total }) => {
      return {
        results,
        pagination: {
          total,
          page: page + 1,
          pageSize,
        },
      };
    }) as unknown as PaginationQueryBuilderType<M>;
  }
}

// New BaseQueryBuilder extending PaginationQueryBuilder
export class BaseQueryBuilder<
  M extends Model,
  R = M[],
> extends PaginationQueryBuilder<M, R> {
  // You can add more shared query methods here in the future

  changeAmount(whereAttributes, attribute, amount) {
    const changeMethod = amount > 0 ? 'increment' : 'decrement';

    return this.where(whereAttributes)[changeMethod](
      attribute,
      Math.abs(amount),
    );
  }
}

export class BaseModel extends Model {
  public readonly id: number;
  public readonly tableName: string;

  QueryBuilderType!: BaseQueryBuilder<this>;
  static QueryBuilder = BaseQueryBuilder;
}
