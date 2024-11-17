import { Box } from "@/components";
import { SubscriptionPlansPeriodSwitcher } from "@/containers/Setup/SetupSubscription/SubscriptionPlansPeriodSwitcher";
import { Callout, Classes } from "@blueprintjs/core";
import { NewSubscriptionPlans } from "./NewSubscriptionPlans";


export function NewSubscriptionContent() {
  return (
    <Box className={Classes.DRAWER_BODY}>
      <Box
        maxWidth={1024}
        margin="0 auto"
        padding={'50px 20px 80px'}
      >
        <Callout style={{ marginBottom: '2rem' }} icon={null}>
          Simple plans. Simple prices. Only pay for what you really need. All
          plans come with award-winning 24/7 customer support. Prices do not
          include applicable taxes.
        </Callout>

        <SubscriptionPlansPeriodSwitcher />
        <NewSubscriptionPlans />
      </Box>
    </Box>
  )
}