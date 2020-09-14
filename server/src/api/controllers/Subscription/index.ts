import { Router } from 'express'
import { Container, Service } from 'typedi';
import JWTAuth from 'api/middleware/jwtAuth';
import TenancyMiddleware from 'api/middleware/TenancyMiddleware';
import AttachCurrentTenantUser from 'api/middleware/AttachCurrentTenantUser';
import PaymentViaLicenseController from 'api/controllers/Subscription/PaymentViaLicense';

@Service()
export default class SubscriptionController { 
	/**
	 * Router constructor.
	 */
	router() {
		const router = Router();

		router.use(JWTAuth);
		router.use(AttachCurrentTenantUser);
		router.use(TenancyMiddleware);

		router.use('/license', Container.get(PaymentViaLicenseController).router());

		return router;
	}
}
