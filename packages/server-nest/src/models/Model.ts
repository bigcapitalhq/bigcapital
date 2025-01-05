import { Constructor, Model, QueryBuilderType, TransactionOrKnex } from 'objection';

export class BaseModel extends Model {
  public readonly id: number;
  public readonly tableName: string;

  static get QueryBuilder() {
    return PaginationQueryBuilder;
  }
}

class PaginationQueryBuilder<M extends Model, R = M[]> extends Model.QueryBuilder<M, R> {
  pagination(page: number, pageSize: number) {
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
