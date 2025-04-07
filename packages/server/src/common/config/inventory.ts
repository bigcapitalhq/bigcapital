import { registerAs } from "@nestjs/config";

export default registerAs('inventory', () => ({
  scheduleComputeItemCost: process.env.INVENTORY_SCHEDULE_COMPUTE_ITEM_COST,
}));
