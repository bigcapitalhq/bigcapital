import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query, ValidationChain } from 'express-validator';
import { Inject, Service } from 'typedi';
import {
  AbilitySubject,
  CreditNoteAction,
  ICreditNoteEditDTO,
  ICreditNoteNewDTO,
} from '@/interfaces';
import BaseController from '@/api/controllers/BaseController';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { ServiceError } from '@/exceptions';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import CreateCreditNote from '@/services/CreditNotes/CreateCreditNote';
import EditCreditNote from '@/services/CreditNotes/EditCreditNote';
import DeleteCreditNote from '@/services/CreditNotes/DeleteCreditNote';
import GetCreditNote from '@/services/CreditNotes/GetCreditNote';
import ListCreditNotes from '@/services/CreditNotes/ListCreditNotes';
import DeleteRefundCreditNote from '@/services/CreditNotes/DeleteRefundCreditNote';
import ListCreditNoteRefunds from '@/services/CreditNotes/ListCreditNoteRefunds';
import OpenCreditNote from '@/services/CreditNotes/OpenCreditNote';
import CreateRefundCreditNote from '@/services/CreditNotes/CreateRefundCreditNote';
import CreditNoteApplyToInvoices from '@/services/CreditNotes/CreditNoteApplyToInvoices';
import DeleteCreditNoteApplyToInvoices from '@/services/CreditNotes/DeleteCreditNoteApplyToInvoices';
import GetCreditNoteAssociatedInvoicesToApply from '@/services/CreditNotes/GetCreditNoteAssociatedInvoicesToApply';
import GetCreditNoteAssociatedAppliedInvoices from '@/services/CreditNotes/GetCreditNoteAssociatedAppliedInvoices';
import GetRefundCreditTransaction from '@/services/CreditNotes/GetRefundCreditNoteTransaction';
import GetCreditNotePdf from '../../../services/CreditNotes/GetCreditNotePdf';
/**
 * Credit notes controller.
 * @service
 */
@Service()
export default class PaymentReceivesController extends BaseController {
  @Inject()
  createCreditNoteService: CreateCreditNote;

  @Inject()
  editCreditNoteService: EditCreditNote;

  @Inject()
  deleteCreditNoteService: DeleteCreditNote;

  @Inject()
  getCreditNoteService: GetCreditNote;

  @Inject()
  listCreditNotesService: ListCreditNotes;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject()
  createCreditNoteRefund: CreateRefundCreditNote;

  @Inject()
  deleteRefundCredit: DeleteRefundCreditNote;

  @Inject()
  listCreditRefunds: ListCreditNoteRefunds;

  @Inject()
  openCreditNote: OpenCreditNote;

  @Inject()
  applyCreditNoteToInvoicesService: CreditNoteApplyToInvoices;

  @Inject()
  deleteApplyCreditToInvoicesService: DeleteCreditNoteApplyToInvoices;

  @Inject()
  getCreditAssociatedInvoicesToApply: GetCreditNoteAssociatedInvoicesToApply;

  @Inject()
  getCreditAssociatedAppliedInvoices: GetCreditNoteAssociatedAppliedInvoices;

  @Inject()
  getRefundCreditService: GetRefundCreditTransaction;

  @Inject()
  creditNotePdf: GetCreditNotePdf;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    // Edit credit note.
    router.post(
      '/:id',
      CheckPolicies(CreditNoteAction.Edit, AbilitySubject.CreditNote),
      this.editCreditNoteDTOShema,
      this.validationResult,
      this.asyncMiddleware(this.editCreditNote),
      this.handleServiceErrors
    );
    // New credit note.
    router.post(
      '/',
      CheckPolicies(CreditNoteAction.Create, AbilitySubject.CreditNote),
      [...this.newCreditNoteDTOSchema],
      this.validationResult,
      this.asyncMiddleware(this.newCreditNote),
      this.handleServiceErrors
    );
    // Get specific credit note.
    router.get(
      '/:id',
      CheckPolicies(CreditNoteAction.View, AbilitySubject.CreditNote),
      this.getCreditNoteSchema,
      this.asyncMiddleware(this.getCreditNote),
      this.handleServiceErrors
    );
    // Get credit note list.
    router.get(
      '/',
      CheckPolicies(CreditNoteAction.View, AbilitySubject.CreditNote),
      this.validatePaymentReceiveList,
      this.validationResult,
      this.asyncMiddleware(this.getCreditNotesList),
      this.handleServiceErrors,
      this.dynamicListService.handlerErrorsToResponse
    );
    // Get specific credit note.
    router.delete(
      '/:id',
      CheckPolicies(CreditNoteAction.Delete, AbilitySubject.CreditNote),
      this.deleteCreditNoteSchema,
      this.validationResult,
      this.asyncMiddleware(this.deleteCreditNote),
      this.handleServiceErrors
    );
    router.post(
      '/:id/open',
      [param('id').exists().isNumeric().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.openCreditNoteTransaction),
      this.handleServiceErrors
    );
    router.get(
      '/:id/refund',
      [param('id').exists().isNumeric().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.creditNoteRefundTransactions),
      this.handleServiceErrors
    );
    router.post(
      '/:id/refund',
      CheckPolicies(CreditNoteAction.Refund, AbilitySubject.CreditNote),
      this.creditNoteRefundSchema,
      this.validationResult,
      this.asyncMiddleware(this.refundCreditNote),
      this.handleServiceErrors
    );
    router.post(
      '/:id/apply-to-invoices',
      this.creditNoteApplyToInvoices,
      this.validationResult,
      this.asyncMiddleware(this.applyCreditNoteToInvoices),
      this.handleServiceErrors
    );
    router.delete(
      '/refunds/:refundId',
      this.deleteRefundCreditSchema,
      this.validationResult,
      this.asyncMiddleware(this.deleteCreditNoteRefund),
      this.handleServiceErrors
    );
    router.get(
      '/refunds/:refundId',
      this.getRefundCreditTransactionSchema,
      this.validationResult,
      this.asyncMiddleware(this.getRefundCreditTransaction),
      this.handleServiceErrors
    );
    router.delete(
      '/applied-to-invoices/:applyId',
      [param('applyId').exists().isNumeric().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.deleteApplyCreditToInvoices),
      this.handleServiceErrors
    );
    router.get(
      '/:id/apply-to-invoices',
      [param('id').exists().isNumeric().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.getCreditNoteInvoicesToApply),
      this.handleServiceErrors
    );
    router.get(
      '/:id/applied-invoices',
      [param('id').exists().isNumeric().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.getCreditNoteAppliedInvoices),
      this.handleServiceErrors
    );
    return router;
  }

  /**
   * Payment receive schema.
   * @return {Array}
   */
  get creditNoteDTOSchema(): ValidationChain[] {
    return [
      check('customer_id').exists().isNumeric().toInt(),
      check('exchange_rate').optional().isFloat({ gt: 0 }).toFloat(),

      check('credit_note_date').exists().isISO8601().toDate(),
      check('reference_no').optional(),
      check('credit_note_number').optional({ nullable: true }).trim().escape(),
      check('note').optional().trim().escape(),
      check('terms_conditions').optional().trim().escape(),
      check('open').default(false).isBoolean().toBoolean(),

      check('warehouse_id').optional({ nullable: true }).isNumeric().toInt(),
      check('branch_id').optional({ nullable: true }).isNumeric().toInt(),

      check('entries').isArray({ min: 1 }),

      check('entries.*.index').exists().isNumeric().toInt(),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toFloat(),
      check('entries.*.quantity').exists().isNumeric().toFloat(),
      check('entries.*.discount')
        .optional({ nullable: true })
        .isNumeric()
        .toFloat(),
      check('entries.*.description')
        .optional({ nullable: true })
        .trim()
        .escape(),
      check('entries.*.warehouse_id')
        .optional({ nullable: true })
        .isNumeric()
        .toInt(),
    ];
  }

  /**
   * Payment receive list validation schema.
   */
  get validatePaymentReceiveList(): ValidationChain[] {
    return [
      query('stringified_filter_roles').optional().isJSON(),

      query('view_slug').optional({ nullable: true }).isString().trim(),

      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),

      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),

      query('search_keyword').optional({ nullable: true }).isString().trim(),
    ];
  }

  /**
   * Validate payment receive parameters.
   */
  get deleteCreditNoteSchema() {
    return [param('id').exists().isNumeric().toInt()];
  }

  /**
   * New credit note DTO validation schema.
   * @return {Array}
   */
  get newCreditNoteDTOSchema() {
    return [...this.creditNoteDTOSchema];
  }

  /**
   * Geet credit note validation schema.
   */
  get getCreditNoteSchema() {
    return [param('id').exists().isNumeric().toInt()];
  }

  /**
   * Edit credit note DTO validation schema.
   */
  get editCreditNoteDTOShema() {
    return [
      param('id').exists().isNumeric().toInt(),
      ...this.creditNoteDTOSchema,
    ];
  }

  get creditNoteRefundSchema() {
    return [
      check('from_account_id').exists().isNumeric().toInt(),
      check('description').optional(),
      
      check('amount').exists().isNumeric().toFloat(),
      check('exchange_rate').optional().isFloat({ gt: 0 }).toFloat(),

      check('reference_no').optional(),
      check('date').exists().isISO8601().toDate(),

      check('branch_id').optional({ nullable: true }).isNumeric().toInt(),
    ];
  }

  get creditNoteApplyToInvoices() {
    return [
      check('entries').isArray({ min: 1 }),
      check('entries.*.invoice_id').exists().isInt().toInt(),
      check('entries.*.amount').exists().isNumeric().toFloat(),
    ];
  }

  get deleteRefundCreditSchema() {
    return [check('refundId').exists().isNumeric().toInt()];
  }

  get getRefundCreditTransactionSchema() {
    return [check('refundId').exists().isNumeric().toInt()];
  }

  /**
   * Records payment receive to the given customer with associated invoices.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  private newCreditNote = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId, user } = req;
    const creditNoteDTO: ICreditNoteNewDTO = this.matchedBodyData(req);

    try {
      const creditNote = await this.createCreditNoteService.newCreditNote(
        tenantId,
        creditNoteDTO,
        user
      );
      return res.status(200).send({
        id: creditNote.id,
        message: 'The credit note has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Edit the given payment receive.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  private editCreditNote = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: creditNoteId } = req.params;

    const creditNoteDTO: ICreditNoteEditDTO = this.matchedBodyData(req);

    try {
      await this.editCreditNoteService.editCreditNote(
        tenantId,
        creditNoteId,
        creditNoteDTO
      );
      return res.status(200).send({
        id: creditNoteId,
        message: 'The credit note has been edited successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delets the given payment receive id.
   * @param {Request} req
   * @param {Response} res
   */
  private deleteCreditNote = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId, user } = req;
    const { id: creditNoteId } = req.params;

    try {
      await this.deleteCreditNoteService.deleteCreditNote(
        tenantId,
        creditNoteId
      );
      return res.status(200).send({
        id: creditNoteId,
        message: 'The credit note has been deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve payment receive list with pagination metadata.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  private getCreditNotesList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const filter = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...this.matchedQueryData(req),
    };

    try {
      const { creditNotes, pagination, filterMeta } =
        await this.listCreditNotesService.getCreditNotesList(tenantId, filter);

      return res.status(200).send({ creditNotes, pagination, filterMeta });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve the payment receive details.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private getCreditNote = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: creditNoteId } = req.params;

    try {
      const creditNote = await this.getCreditNoteService.getCreditNote(
        tenantId,
        creditNoteId
      );
      const ACCEPT_TYPE = {
        APPLICATION_PDF: 'application/pdf',
        APPLICATION_JSON: 'application/json',
      };
      // Response formatter.
      res.format({
        // Json content type.
        [ACCEPT_TYPE.APPLICATION_JSON]: () => {
          return res
            .status(200)
            .send({ credit_note: this.transfromToResponse(creditNote) });
        },
        // Pdf content type.
        [ACCEPT_TYPE.APPLICATION_PDF]: async () => {
          const pdfContent = await this.creditNotePdf.getCreditNotePdf(
            tenantId,
            creditNote
          );
          res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfContent.length,
          });
          res.send(pdfContent);
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Refunds the credit note.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns
   */
  private refundCreditNote = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: creditNoteId } = req.params;
    const creditNoteRefundDTO = this.matchedBodyData(req);

    try {
      const creditNoteRefund =
        await this.createCreditNoteRefund.createCreditNoteRefund(
          tenantId,
          creditNoteId,
          creditNoteRefundDTO
        );
      return res.status(200).send({
        id: creditNoteRefund.id,
        message:
          'The customer credit note refund has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Apply credit note to the given invoices.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private applyCreditNoteToInvoices = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: creditNoteId } = req.params;
    const applyCreditNoteToInvoicesDTO = this.matchedBodyData(req);

    try {
      await this.applyCreditNoteToInvoicesService.applyCreditNoteToInvoices(
        tenantId,
        creditNoteId,
        applyCreditNoteToInvoicesDTO
      );
      return res.status(200).send({
        id: creditNoteId,
        message:
          'The credit note has been applied the given invoices successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deletes the credit note refund transaction.
   * @param req
   * @param res
   * @param next
   * @returns
   */
  private deleteCreditNoteRefund = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { refundId: creditRefundId } = req.params;

    try {
      await this.deleteRefundCredit.deleteCreditNoteRefund(
        tenantId,
        creditRefundId
      );
      return res.status(200).send({
        id: creditRefundId,
        message: 'The credit note refund has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve get refund credit note transaction.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response>}
   */
  private getRefundCreditTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { refundId: creditRefundId } = req.params;

    try {
      const refundCredit =
        await this.getRefundCreditService.getRefundCreditTransaction(
          tenantId,
          creditRefundId
        );
      return res.status(200).send({ refundCredit });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve refund transactions associated to the given credit note.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private creditNoteRefundTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id: creditNoteId } = req.params;
    const { tenantId } = req;

    try {
      const transactions = await this.listCreditRefunds.getCreditNoteRefunds(
        tenantId,
        creditNoteId
      );
      return res.status(200).send({ data: transactions });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   * @returns
   */
  private openCreditNoteTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id: creditNoteId } = req.params;
    const { tenantId } = req;

    try {
      const creditNote = await this.openCreditNote.openCreditNote(
        tenantId,
        creditNoteId
      );
      return res.status(200).send({
        message: 'The credit note has been opened successfully',
        id: creditNote.id,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   * @returns
   */
  private deleteApplyCreditToInvoices = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { applyId: creditAppliedToInvoicesId } = req.params;

    try {
      await this.deleteApplyCreditToInvoicesService.deleteApplyCreditNoteToInvoices(
        tenantId,
        creditAppliedToInvoicesId
      );
      return res.status(200).send({
        id: creditAppliedToInvoicesId,
        message:
          'The applied credit to invoices has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve the credit note associated invoices to apply.
   * @param req
   * @param res
   * @param next
   */
  private getCreditNoteInvoicesToApply = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: creditNoteId } = req.params;

    try {
      const saleInvoices =
        await this.getCreditAssociatedInvoicesToApply.getCreditAssociatedInvoicesToApply(
          tenantId,
          creditNoteId
        );
      return res.status(200).send({ data: saleInvoices });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   * @returns
   */
  private getCreditNoteAppliedInvoices = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: creditNoteId } = req.params;

    try {
      const appliedInvoices =
        await this.getCreditAssociatedAppliedInvoices.getCreditAssociatedAppliedInvoices(
          tenantId,
          creditNoteId
        );
      return res.status(200).send({ data: appliedInvoices });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles service errors.
   * @param {Error} error
   * @param {Request} req
   * @param {Response} res
   * @param next
   */
  handleServiceErrors(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'ENTRIES_ITEMS_IDS_NOT_EXISTS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ENTRIES_ITEMS_IDS_NOT_EXISTS', code: 100 }],
        });
      }
      if (error.errorType === 'ENTRIES_IDS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ENTRIES_IDS_NOT_FOUND', code: 200 }],
        });
      }
      if (error.errorType === 'contact_not_found') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMER_NOT_FOUND', code: 300 }],
        });
      }
      if (error.errorType === 'ITEMS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ITEMS_NOT_FOUND', code: 400 }],
        });
      }
      if (error.errorType === 'CREDIT_NOTE_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CREDIT_NOTE_NOT_FOUND', code: 500 }],
        });
      }
      if (error.errorType === 'CREDIT_NOTE_ALREADY_OPENED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CREDIT_NOTE_ALREADY_OPENED', code: 600 }],
        });
      }
      if (
        error.errorType === 'INVOICES_IDS_NOT_FOUND' ||
        error.errorType === 'INVOICES_NOT_DELIVERED_YET'
      ) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'APPLIED_INVOICES_IDS_NOT_FOUND', code: 700 }],
        });
      }
      if (error.errorType === 'CREDIT_NOTE_HAS_NO_REMAINING_AMOUNT') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CREDIT_NOTE_HAS_NO_REMAINING_AMOUNT', code: 800 }],
        });
      }
      if (error.errorType === 'CREDIT_NOTE_APPLY_TO_INVOICES_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [
            { type: 'CREDIT_NOTE_APPLY_TO_INVOICES_NOT_FOUND', code: 900 },
          ],
        });
      }
      if (error.errorType === 'INVOICES_HAS_NO_REMAINING_AMOUNT') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'INVOICES_HAS_NO_REMAINING_AMOUNT', code: 1000 }],
        });
      }
      if (error.errorType === 'CREDIT_NOTE_HAS_REFUNDS_TRANSACTIONS') {
        return res.boom.badRequest(null, {
          errors: [
            { type: 'CREDIT_NOTE_HAS_REFUNDS_TRANSACTIONS', code: 1100 },
          ],
        });
      }
      if (error.errorType === 'CREDIT_NOTE_HAS_APPLIED_INVOICES') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CREDIT_NOTE_HAS_APPLIED_INVOICES', code: 1200 }],
        });
      }
      if (error.errorType === 'REFUND_CREDIT_NOTE_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'REFUND_CREDIT_NOTE_NOT_FOUND', code: 1300 }],
        });
      }
      if (error.errorType === 'TRANSACTIONS_DATE_LOCKED') {
        return res.boom.badRequest(null, {
          errors: [
            {
              type: 'TRANSACTIONS_DATE_LOCKED',
              code: 4900,
              data: { ...error.payload },
            },
          ],
        });
      }
    }
    next(error);
  }
}
