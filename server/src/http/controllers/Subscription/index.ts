import { Router } from 'express'
import { Container, Service } from 'typedi';
import JWTAuth from '@/http/middleware/jwtAuth';
import TenancyMiddleware from '@/http/middleware/TenancyMiddleware';
import AttachCurrentTenantUser from '@/http/middleware/AttachCurrentTenantUser';
import PaymentViaLicenseController from '@/http/controllers/Subscription/PaymentViaLicense';

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
