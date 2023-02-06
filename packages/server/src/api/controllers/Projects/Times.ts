import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query } from 'express-validator';
import { Service, Inject } from 'typedi';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseController from '@/api/controllers/BaseController';
import { AbilitySubject, AccountAction } from '@/interfaces';
import { ServiceError } from '@/exceptions';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { TimesApplication } from '@/services/Projects/Times/TimesApplication';

@Service()
export class ProjectTimesController extends BaseController {
  @Inject()
  private timesApplication: TimesApplication;

  /**
   * Router constructor method.
   */
  router() {
    const router = Router();

    router.post(
      '/projects/tasks/:taskId/times',
      CheckPolicies(AccountAction.CREATE, AbilitySubject.Project),
      [
        param('taskId').exists().isInt().toInt(),
        check('duration').exists().isDecimal(),
        check('description').exists().trim(),
        check('date').exists().isISO8601(),
      ],
      this.validationResult,
      asyncMiddleware(this.createTime.bind(this)),
      this.catchServiceErrors
    );
    router.post(
      '/projects/times/:timeId',
      CheckPolicies(AccountAction.EDIT, AbilitySubject.Project),
      [
        param('timeId').exists().isInt().toInt(),
        check('duration').exists().isDecimal(),
        check('description').exists().trim(),
        check('date').exists().isISO8601(),
      ],
      this.validationResult,
      asyncMiddleware(this.editTime.bind(this)),
      this.catchServiceErrors
    );
    router.get(
      '/projects/times/:timeId',
      CheckPolicies(AccountAction.VIEW, AbilitySubject.Project),
      [
        param('timeId').exists().isInt().toInt(),
      ],
      this.validationResult,
      asyncMiddleware(this.getTime.bind(this)),
      this.catchServiceErrors
    );
    router.get(
      '/projects/:projectId/times',
      CheckPolicies(AccountAction.VIEW, AbilitySubject.Project),
      [
        param('projectId').exists().isInt().toInt(),
      ],
      this.validationResult,
      asyncMiddleware(this.getTimeline.bind(this)),
      this.catchServiceErrors
    );
    router.delete(
      '/projects/times/:timeId',
      CheckPolicies(AccountAction.DELETE, AbilitySubject.Project),
      [
        param('timeId').exists().isInt().toInt(),
      ],
      this.validationResult,
      asyncMiddleware(this.deleteTime.bind(this)),
      this.catchServiceErrors
    );
    return router;
  }

  /**
   * Project create DTO Schema validation.
   */
  get createTimeDTOSchema() {
    return [];
  }

  /**
   * Project edit DTO Schema validation.
   */
  get editProjectDTOSchema() {
    return [
      check('contact_id').exists(),
      check('name').exists().trim(),
      check('deadline').exists({ nullable: true }).isISO8601(),
      check('cost_estimate').exists().isDecimal(),
    ];
  }

  get accountParamSchema() {
    return [param('id').exists().isNumeric().toInt()];
  }

  /**
   * Accounts list validation schema.
   */
  get accountsListSchema() {
    return [
      query('view_slug').optional({ nullable: true }).isString().trim(),
      query('stringified_filter_roles').optional().isJSON(),

      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),

      query('inactive_mode').optional().isBoolean().toBoolean(),
      query('search_keyword').optional({ nullable: true }).isString().trim(),
    ];
  }

  /**
   * Creates a new project.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  async createTime(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { taskId } = req.params;
    const taskDTO = this.matchedBodyData(req);

    try {
      const task = await this.timesApplication.createTime(
        tenantId,
        taskId,
        taskDTO
      );
      return res.status(200).send({
        id: task.id,
        message: 'The time entry has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Edit project details.
   * @param  {Request} req
   * @param  {Response} res
   * @return {Response}
   */
  async editTime(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { timeId } = req.params;

    const editTaskDTO = this.matchedBodyData(req);

    try {
      const task = await this.timesApplication.editTime(
        tenantId,
        timeId,
        editTaskDTO
      );
      return res.status(200).send({
        id: task.id,
        message: 'The task has been edited successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get details of the given task.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  async getTime(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { timeId } = req.params;

    try {
      const timeEntry = await this.timesApplication.getTime(tenantId, timeId);

      return res.status(200).send({ timeEntry });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete the given task.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  async deleteTime(req: Request, res: Response, next: NextFunction) {
    const { timeId } = req.params;
    const { tenantId } = req;

    try {
      await this.timesApplication.deleteTime(tenantId, timeId);

      return res.status(200).send({
        id: timeId,
        message: 'The deleted task has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve accounts datatable list.
   * @param {Request} req
   * @param {Response} res
   * @param {Response}
   */
  public async getTimeline(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { projectId } = req.params;

    try {
      const timeline = await this.timesApplication.getTimeline(
        tenantId,
        projectId
      );

      return res.status(200).send({ timeline });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Transforms service errors to response.
   * @param {Error}
   * @param {Request} req
   * @param {Response} res
   * @param {ServiceError} error
   */
  private catchServiceErrors(
    error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
    }
    next(error);
  }
}
