import knex, { Knex } from 'knex';
import { DynamicFilterRoleAbstractor } from './DynamicFilterRoleAbstractor';
import { IFilterRole } from './DynamicFilter.types';

class TestDynamicFilterRoleAbstractor extends DynamicFilterRoleAbstractor {
  public buildRole(model: any, role: IFilterRole) {
    return this.buildRoleQuery(model, role);
  }
}

describe('DynamicFilterRoleAbstractor', () => {
  let db: Knex;

  beforeAll(() => {
    db = knex({ client: 'mysql2' });
  });

  afterAll(async () => {
    await db.destroy();
  });

  const buildRoleSql = (model: any, role: IFilterRole): string => {
    const filter = new TestDynamicFilterRoleAbstractor();
    filter.setModel(model);

    const builder = db('test_table');
    filter.buildRole(model, role)(builder);

    return builder.toSQL().sql;
  };

  const createModel = (filterCustomQuery?: (...args: any[]) => any) => ({
    tableName: 'test_table',
    relationMappings: {},
    getField: () => ({
      fieldType: 'enumeration',
      column: 'status',
      filterCustomQuery,
    }),
  });

  describe('custom query fields', () => {
    const model = createModel((query, role) => {
      query.where('status', role.value);
    });

    it('applies the custom query as-is for positive comparators', () => {
      const sql = buildRoleSql(model, {
        fieldKey: 'status',
        comparator: 'is',
        value: 'paid',
      });
      expect(sql).toBe('select * from `test_table` where `status` = ?');
    });

    it.each(['is_not', 'not_equal', 'not_equals'])(
      'negates the whole custom query for the %s comparator',
      (comparator) => {
        const sql = buildRoleSql(model, {
          fieldKey: 'status',
          comparator,
          value: 'paid',
        });
        expect(sql).toBe('select * from `test_table` where not (`status` = ?)');
      },
    );

    it('negates the grouped custom query conditions as a whole', () => {
      const groupedModel = createModel((query, role) => {
        query.where('status', role.value).orWhere('reference_no', role.value);
      });
      const sql = buildRoleSql(groupedModel, {
        fieldKey: 'status',
        comparator: 'is_not',
        value: 'paid',
      });
      expect(sql).toBe(
        'select * from `test_table` where not (`status` = ? or `reference_no` = ?)',
      );
    });
  });

  describe('regular fields', () => {
    it('keeps the is_not comparator behavior for fields without custom query', () => {
      const sql = buildRoleSql(createModel(), {
        fieldKey: 'status',
        comparator: 'is_not',
        value: 'paid',
      });
      expect(sql).toBe(
        'select * from `test_table` where `test_table`.`status` <> ?',
      );
    });
  });
});
