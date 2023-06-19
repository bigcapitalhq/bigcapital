import { Service, Inject } from 'typedi';
import { Request, Response, Router, NextFunction } from 'express';
import { check, param } from 'express-validator';
import BaseController from '@/api/controllers/BaseController';
import { Features, ICreateBranchDTO, IEditBranchDTO } from '@/interfaces';
import { BranchesApplication } from '@/services/Branches/BranchesApplication';
import { ServiceError } from '@/exceptions';
import { FeatureActivationGuard } from '@/api/middleware/FeatureActivationGuard';

@Service()
export class BranchesController extends BaseController {
  @Inject()
  branchesApplication: BranchesApplication;

  /**
   * Branches routes.
   * @returns {Router}
   */
  router() {
    const router = Router();

    router.post(
      '/activate',
      [],
      this.validationResult,
      this.asyncMiddleware(this.activateBranches),
      this.handlerServiceErrors
    );
    router.post(
      '/',
      FeatureActivationGuard(Features.BRANCHES),
      [
        check('name').exists(),
        check('code').optional({ nullable: true }),

        check('address').optional({ nullable: true }),
        check('city').optional({ nullable: true }),
        check('country').optional({ nullable: true }),

        check('phone_number').optional({ nullable: true }),
        check('email').optional({ nullable: true }).isEmail(),
        check('website').optional({ nullable: true }).isURL(),
      ],
      this.validationResult,
      this.asyncMiddleware(this.createBranch),
      this.handlerServiceErrors
    );
    router.post(
      '/:id',
      FeatureActivationGuard(Features.BRANCHES),
      [
        param('id').exists().isInt().toInt(),
        check('name').exists(),
        check('code').optional({ nullable: true }),

        check('address').optional({ nullable: true }),
        check('city').optional({ nullable: true }),
        check('country').optional({ nullable: true }),

        check('phone_number').optional({ nullable: true }),
        check('email').optional({ nullable: true }).isEmail(),
        check('website').optional({ nullable: true }).isURL(),
      ],
      this.validationResult,
      this.asyncMiddleware(this.editBranch),
      this.handlerServiceErrors
    );
    router.post(
      '/:id/mark-primary',
      FeatureActivationGuard(Features.BRANCHES),
      [],
      this.validationResult,
      this.asyncMiddleware(this.markBranchAsPrimary),
      this.handlerServiceErrors
    );
    router.delete(
      '/:id',
      FeatureActivationGuard(Features.BRANCHES),
      [param('id').exists().isInt().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.deleteBranch),
      this.handlerServiceErrors
    );
    router.get(
      '/:id',
      FeatureActivationGuard(Features.BRANCHES),
      [param('id').exists().isInt().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.getBranch),
      this.handlerServiceErrors
    );
    router.get(
      '/',
      FeatureActivationGuard(Features.BRANCHES),
      [],
      this.validationResult,
      this.asyncMiddleware(this.getBranches),
      this.handlerServiceErrors
    );
    return router;
  }

  /**
   * Creates a new branch.
   * @param   {Request} req
   * @param   {Response} res
   * @param   {NextFunction} next
   * @returns {Response}
   */
  public createBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const createBranchDTO: ICreateBranchDTO = this.matchedBodyData(req);

    try {
      const branch = await this.branchesApplication.createBranch(
        tenantId,
        createBranchDTO
      );
      return res.status(200).send({
        id: branch.id,
        message: 'The branch has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Edits the given branch.
   * @param   {Request} req
   * @param   {Response} res
   * @param   {NextFunction} next
   * @returns {Response}
   */
  public editBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: branchId } = req.params;
    const editBranchDTO: IEditBranchDTO = this.matchedBodyData(req);

    try {
      const branch = await this.branchesApplication.editBranch(
        tenantId,
        branchId,
        editBranchDTO
      );
      return res.status(200).send({
        id: branch.id,
        message: 'The branch has been edited successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deletes the given branch.
   * @param   {Request} req
   * @param   {Response} res
   * @param   {NextFunction} next
   * @returns {Response}
   */
  public deleteBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: branchId } = req.params;

    try {
      await this.branchesApplication.deleteBranch(tenantId, branchId);

      return res.status(200).send({
        id: branchId,
        message: 'The branch has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieves specific branch.
   * @param   {Request} req
   * @param   {Response} res
   * @param   {NextFunction} next
   * @returns {Response}
   */
  public getBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: branchId } = req.params;

    try {
      const branch = await this.branchesApplication.getBranch(
        tenantId,
        branchId
      );
      return res.status(200).send({ branch });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieves branches list.
   * @param   {Request} req
   * @param   {Response} res
   * @param   {NextFunction} next
   * @returns {Response}
   */
  public getBranches = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;

    try {
      const branches = await this.branchesApplication.getBranches(tenantId);

      return res.status(200).send({ branches });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Activates the multi-branches feature.
   * @param   {Request} req
   * @param   {Response} res
   * @param   {NextFunction} next
   * @returns {Response}
   */
  public activateBranches = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;

    try {
      await this.branchesApplication.activateBranches(tenantId);

      return res.status(200).send({
        message: 'Multi-branches feature has been activated successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Marks the given branch as primary.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   * @returns {Response}
   */
  public markBranchAsPrimary = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: branchId } = req.params;

    try {
      await this.branchesApplication.markBranchAsPrimary(tenantId, branchId);

      return res.status(200).send({
        id: branchId,
        message: 'The branch has been marked as primary.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles service errors.
   * @param {Error} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private handlerServiceErrors(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'BRANCH_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'BRANCH_NOT_FOUND', code: 100 }],
        });
      }
      if (error.errorType === 'MULTI_BRANCHES_ALREADY_ACTIVATED') {
        return res.status(400).send({
          errors: [{ type: 'MULTI_BRANCHES_ALREADY_ACTIVATED', code: 100 }],
        });
      }
      if (error.errorType === 'COULD_NOT_DELETE_ONLY_BRANCH') {
        return res.status(400).send({
          errors: [{ type: 'COULD_NOT_DELETE_ONLY_BRANCH', code: 300 }],
        });
      }
      if (error.errorType === 'BRANCH_CODE_NOT_UNIQUE') {
        return res.status(400).send({
          errors: [{ type: 'BRANCH_CODE_NOT_UNIQUE', code: 400 }],
        });
      }
      if (error.errorType === 'BRANCH_HAS_ASSOCIATED_TRANSACTIONS') {
        return res.status(400).send({
          errors: [
            { type: 'BRANCH_HAS_ASSOCIATED_TRANSACTIONS', code: 500 },
          ],
        });
      }
    }
    next(error);
  }
}
