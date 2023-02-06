import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query } from 'express-validator';
import { Service, Inject } from 'typedi';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseController from '@/api/controllers/BaseController';
import { AbilitySubject, AccountAction } from '@/interfaces';
import { ServiceError } from '@/exceptions';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { TasksApplication } from '@/services/Projects/Tasks/TasksApplication';
import { ProjectTaskChargeType } from '@/services/Projects/Tasks/constants';

@Service()
export class ProjectTasksController extends BaseController {
  @Inject()
  private tasksApplication: TasksApplication;

  /**
   * Router constructor method.
   */
  router() {
    const router = Router();

    router.post(
      '/projects/:projectId/tasks',
      CheckPolicies(AccountAction.CREATE, AbilitySubject.Project),
      [
        check('name').exists(),
        check('charge_type')
          .exists()
          .trim()
          .toUpperCase()
          .isIn(Object.values(ProjectTaskChargeType)),
        check('rate').exists(),
        check('estimate_hours').exists(),
      ],
      this.validationResult,
      asyncMiddleware(this.createTask.bind(this)),
      this.catchServiceErrors
    );
    router.post(
      '/tasks/:taskId',
      CheckPolicies(AccountAction.EDIT, AbilitySubject.Project),
      [
        param('taskId').exists().isInt().toInt(),
        check('name').exists(),
        check('charge_type').exists().trim(),
        check('rate').exists(),
        check('estimate_hours').exists(),
      ],
      this.validationResult,
      asyncMiddleware(this.editTask.bind(this)),
      this.catchServiceErrors
    );
    router.get(
      '/tasks/:taskId',
      CheckPolicies(AccountAction.VIEW, AbilitySubject.Project),
      [param('taskId').exists().isInt().toInt()],
      this.validationResult,
      asyncMiddleware(this.getTask.bind(this)),
      this.catchServiceErrors
    );
    router.get(
      '/projects/:projectId/tasks',
      CheckPolicies(AccountAction.VIEW, AbilitySubject.Project),
      [param('projectId').exists().isInt().toInt()],
      this.validationResult,
      asyncMiddleware(this.getTasks.bind(this)),
      this.catchServiceErrors
    );
    router.delete(
      '/tasks/:taskId',
      CheckPolicies(AccountAction.DELETE, AbilitySubject.Project),
      [param('taskId').exists().isInt().toInt()],
      this.validationResult,
      asyncMiddleware(this.deleteTask.bind(this)),
      this.catchServiceErrors
    );
    return router;
  }

  /**
   * Creates a new project.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  async createTask(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { projectId } = req.params;
    const taskDTO = this.matchedBodyData(req);

    try {
      const task = await this.tasksApplication.createTask(
        tenantId,
        projectId,
        taskDTO
      );
      return res.status(200).send({
        id: task.id,
        message: 'The task has been created successfully.',
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
  async editTask(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { taskId } = req.params;

    const editTaskDTO = this.matchedBodyData(req);

    try {
      const task = await this.tasksApplication.editTask(
        tenantId,
        taskId,
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
  async getTask(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { taskId } = req.params;

    try {
      const task = await this.tasksApplication.getTask(tenantId, taskId);

      return res.status(200).send({ task });
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
  async deleteTask(req: Request, res: Response, next: NextFunction) {
    const { taskId } = req.params;
    const { tenantId } = req;

    try {
      await this.tasksApplication.deleteTask(tenantId, taskId);

      return res.status(200).send({
        id: taskId,
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
  public async getTasks(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { projectId } = req.params;

    try {
      const tasks = await this.tasksApplication.getTasks(tenantId, projectId);

      return res.status(200).send({ tasks });
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
