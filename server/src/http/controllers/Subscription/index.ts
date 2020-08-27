import { Router } from 'express'
import { Container, Service } from 'typedi';
import JWTAuth from '@/http/middleware/jwtAuth';
import TenancyMiddleware from '@/http/middleware/TenancyMiddleware';
import PaymentViaVoucherController from '@/http/controllers/Subscription/PaymentViaVoucher';

@Service()
export default class SubscriptionController { 
	/**
	 * Router constructor.
	 */
	router() {
		const router = Router();

		router.use(JWTAuth);
		router.use(TenancyMiddleware);

		router.use('/voucher', Container.get(PaymentViaVoucherController).router());

		return router;
	}
}
