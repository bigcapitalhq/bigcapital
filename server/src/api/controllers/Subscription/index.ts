import { Router, Request, Response, NextFunction } from 'express'
import { Container, Service, Inject } from 'typedi';
import JWTAuth from 'api/middleware/jwtAuth';
import TenancyMiddleware from 'api/middleware/TenancyMiddleware';
import AttachCurrentTenantUser from 'api/middleware/AttachCurrentTenantUser';
import PaymentViaLicenseController from 'api/controllers/Subscription/PaymentViaLicense';
import SubscriptionService from 'services/Subscription/SubscriptionService';
import asyncMiddleware from 'api/middleware/asyncMiddleware';

@Service()
export default class SubscriptionController {
	@Inject()
	subscriptionService: SubscriptionService;

	/**
	 * Router constructor.
	 */
	router() {
		const router = Router();

		router.use(JWTAuth);
		router.use(AttachCurrentTenantUser);
		router.use(TenancyMiddleware);

		router.use('/license', Container.get(PaymentViaLicenseController).router());

		router.get('/',
			asyncMiddleware(this.getSubscriptions.bind(this))
		);
		return router;
	}

	/**
	 * Retrieve all subscriptions of the authenticated user's tenant.
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {NextFunction} next 
	 */
	async getSubscriptions(req: Request, res: Response, next: NextFunction) {
		const { tenantId } = req;

		try {
			const subscriptions = await this.subscriptionService.getSubscriptions(tenantId);
			return res.status(200).send({ subscriptions });
		} catch (error) {
			next(error);
		}
	}
}
