

export default class NotAllowedChangeSubscriptionPlan extends Error{

  constructor(message: string) {
    super(message);
    this.name = "NotAllowedChangeSubscriptionPlan";
  }
}