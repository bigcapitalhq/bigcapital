export class NotAllowedChangeSubscriptionPlan extends Error {
  constructor(message: string = 'Not allowed to change subscription plan.') {
    super(message);
    this.name = 'NotAllowedChangeSubscriptionPlan';
  }
}
