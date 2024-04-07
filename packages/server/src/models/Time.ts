import TenantModel from 'models/TenantModel';
import { Model, mixin } from 'objection';
import CustomViewBaseModel from './CustomViewBaseModel';
import ModelSearchable from './ModelSearchable';
import ModelSetting from './ModelSetting';

export default class Time extends mixin(TenantModel, [ModelSetting, CustomViewBaseModel, ModelSearchable]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'times';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['created_at', 'updated_at'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return [];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Task = require('models/Task');
    const Project = require('models/Project');

    return {
      /**
       * Project may has many associated tasks.
       */
      task: {
        relation: Model.BelongsToOneRelation,
        modelClass: Task.default,
        join: {
          from: 'times.taskId',
          to: 'tasks.id',
        },
      },

      /**
       * Project may has many associated times.
       */
      project: {
        relation: Model.BelongsToOneRelation,
        modelClass: Project.default,
        join: {
          from: 'times.projectId',
          to: 'projects.id',
        },
      },
    };
  }
}
