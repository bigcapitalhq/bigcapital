import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query } from 'express-validator';
import { Service, Inject } from 'typedi';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseController from '@/api/controllers/BaseController';
import { AbilitySubject, IProjectStatus, ProjectAction } from '@/interfaces';
import { ServiceError } from '@/exceptions';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { ProjectsApplication } from '@/services/Projects/Projects/ProjectsApplication';

@Service()
export class ProjectsController extends BaseController {
  @Inject()
  private projectsApplication: ProjectsApplication;

  /**
   * Router constructor method.
   */
  router() {
    const router = Router();

    router.post(
      '/',
      CheckPolicies(ProjectAction.CREATE, AbilitySubject.Project),
      [
        check('contact_id').exists(),
        check('name').exists().trim(),
        check('deadline').exists().isISO8601(),
        check('cost_estimate').exists().isDecimal(),
      ],
      this.validationResult,
      asyncMiddleware(this.createProject.bind(this))
    );
    router.post(
      '/:id',
      CheckPolicies(ProjectAction.EDIT, AbilitySubject.Project),
      [
        param('id').exists().isInt().toInt(),
        check('contact_id').exists(),
        check('name').exists().trim(),
        check('deadline').exists().isISO8601(),
        check('cost_estimate').exists().isDecimal(),
      ],
      this.validationResult,
      asyncMiddleware(this.editProject.bind(this))
    );
    router.patch(
      '/:projectId/status',
      CheckPolicies(ProjectAction.EDIT, AbilitySubject.Project),
      [
        param('projectId').exists().isInt().toInt(),
        check('status')
          .exists()
          .isIn([IProjectStatus.InProgress, IProjectStatus.Closed]),
      ],
      this.validationResult,
      asyncMiddleware(this.editProject.bind(this))
    );
    router.get(
      '/:id',
      CheckPolicies(ProjectAction.VIEW, AbilitySubject.Project),
      [param('id').exists().isInt().toInt()],
      this.validationResult,
      asyncMiddleware(this.getProject.bind(this))
    );
    router.get(
      '/:projectId/billable/entries',
      CheckPolicies(ProjectAction.VIEW, AbilitySubject.Project),
      [
        param('projectId').exists().isInt().toInt(),
        query('billable_type').optional().toArray(),
        query('to_date').optional().isISO8601(),
      ],
      this.validationResult,
      asyncMiddleware(this.projectBillableEntries.bind(this))
    );
    router.get(
      '/',
      CheckPolicies(ProjectAction.VIEW, AbilitySubject.Project),
      [],
      this.validationResult,
      asyncMiddleware(this.getProjects.bind(this))
    );
    router.delete(
      '/:id',
      CheckPolicies(ProjectAction.DELETE, AbilitySubject.Project),
      [param('id').exists().isInt().toInt()],
      this.validationResult,
      asyncMiddleware(this.deleteProject.bind(this))
    );
    return router;
  }

  /**
   * Creates a new project.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private async createProject(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const projectDTO = this.matchedBodyData(req);

    try {
      const account = await this.projectsApplication.createProject(
        tenantId,
        projectDTO
      );
      return res.status(200).send({
        id: account.id,
        message: 'The project has been created successfully.',
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
  private async editProject(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { projectId } = req.params;

    const editProjectDTO = this.matchedBodyData(req);

    try {
      const account = await this.projectsApplication.editProjectStatus(
        tenantId,
        projectId,
        editProjectDTO.status
      );
      return res.status(200).send({
        id: account.id,
        message: 'The project has been edited successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get details of the given account.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  private async getProject(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: projectId } = req.params;

    try {
      const project = await this.projectsApplication.getProject(
        tenantId,
        projectId
      );
      return res.status(200).send({ project });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete the given account.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  private async deleteProject(req: Request, res: Response, next: NextFunction) {
    const { id: accountId } = req.params;
    const { tenantId } = req;

    try {
      await this.projectsApplication.deleteProject(tenantId, accountId);

      return res.status(200).send({
        id: accountId,
        message: 'The deleted project has been deleted successfully.',
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
  private async getProjects(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;

    // Filter query.
    const filter = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      inactiveMode: false,
      ...this.matchedQueryData(req),
    };

    try {
      const projects = await this.projectsApplication.getProjects(
        tenantId,
        filter
      );
      return res.status(200).send({
        projects,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves the given billable entries of the given project.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Response}
   */
  private projectBillableEntries = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { projectId } = req.params;
    const query = this.matchedQueryData(req);

    try {
      const billableEntries =
        await this.projectsApplication.getProjectBillableEntries(
          tenantId,
          projectId,
          query
        );
      return res.status(200).send({
        billableEntries,
      });
    } catch (error) {
      next(error);
    }
  };
}
