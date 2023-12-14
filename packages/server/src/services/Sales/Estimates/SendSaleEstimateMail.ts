import { Service } from "typedi";

@Service()
export class SendSaleEstimateMail {
  sendMail(tenantId: number, saleEstimateId: number) {}
}
