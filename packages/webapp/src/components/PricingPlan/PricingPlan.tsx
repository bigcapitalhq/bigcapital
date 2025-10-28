import {
  Button,
  ButtonProps,
  Intent,
  Position,
  Text,
  Tooltip,
} from '@blueprintjs/core';
import clsx from 'classnames';
import { Box, Group, Stack } from '../Layout';
import styles from './PricingPlan.module.scss';
import { CheckCircled } from '@/icons/CheckCircled';

export interface PricingPlanProps {
  featured?: boolean;
  children: React.ReactNode;
}

/**
 * Displays a pricing plan.
 * @param featured - Whether the plan is featured.
 * @param children - The content of the plan.
 */
export const PricingPlan = ({ featured, children }: PricingPlanProps) => {
  return (
    <Stack
      spacing={8}
      className={clsx(styles.root, { [styles.isFeatured]: featured })}
    >
      <>{children}</>
    </Stack>
  );
};

/**
 * Displays a featured section within a pricing plan.
 * @param children - The content of the featured section.
 */
PricingPlan.Featured = ({ children }: { children: React.ReactNode }) => {
  return <Box className={styles.featuredBox}>{children}</Box>;
};

export interface PricingHeaderProps {
  label: string;
  description: string;
}

/**
 * Displays the header of a pricing plan.
 * @param label - The label of the plan.
 * @param description - The description of the plan.
 */
PricingPlan.Header = ({ label, description }: PricingHeaderProps) => {
  return (
    <Stack spacing={4}>
      <h4 className={styles.label}>{label}</h4>
      {description && <p className={styles.description}>{description}</p>}
    </Stack>
  );
};

export interface PricingPriceProps {
  price: string;
  subPrice: string;
}

/**
 * Displays the price of a pricing plan.
 * @param price - The main price of the plan.
 * @param subPrice - The sub-price of the plan.
 */
PricingPlan.Price = ({ price, subPrice }: PricingPriceProps) => {
  return (
    <Stack spacing={4} className={styles.priceRoot}>
      <h4 className={styles.price}>{price}</h4>
      <span className={styles.pricePer}>{subPrice}</span>
    </Stack>
  );
};

export interface PricingBuyButtonProps extends ButtonProps {}

/**
 * Displays a buy button within a pricing plan.
 * @param children - The content of the button.
 * @param props - Additional button props.
 */
PricingPlan.BuyButton = ({ children, ...props }: PricingBuyButtonProps) => {
  return (
    <Button
      intent={Intent.PRIMARY}
      {...props}
      fill={true}
      className={styles.buttonCTA}
    >
      {children}
    </Button>
  );
};

export interface PricingFeaturesProps {
  children: React.ReactNode;
}

/**
 * Displays a list of features within a pricing plan.
 * @param children - The list of features.
 */
PricingPlan.Features = ({ children }: PricingFeaturesProps) => {
  return (
    <Stack spacing={14} className={styles.features}>
      {children}
    </Stack>
  );
};

export interface PricingFeatureLineProps {
  children: React.ReactNode;
  hintContent?: string;
  hintLabel?: string;
}

/**
 * Displays a single feature line within a list of features.
 * @param children - The content of the feature line.
 */
PricingPlan.FeatureLine = ({
  children,
  hintContent,
  hintLabel,
}: PricingFeatureLineProps) => {
  return hintContent ? (
    <Tooltip
      content={
        <Stack spacing={5}>
          {hintLabel && (
            <Text className={styles.featurePopoverLabel}>{hintLabel}</Text>
          )}
          <Text className={styles.featurePopoverContent}>{hintContent}</Text>
        </Stack>
      }
      position={Position.TOP_LEFT}
      popoverClassName={styles.featurePopover}
      modifiers={{ offset: { enabled: true, offset: '0,10' } }}
      minimal
    >
      <Group noWrap spacing={8} style={{ cursor: 'help' }}>
        <CheckCircled height={12} width={12} />
        <Box className={styles.featureItem}>{children}</Box>
      </Group>
    </Tooltip>
  ) : (
    <Group noWrap spacing={8}>
      <CheckCircled height={12} width={12} />
      <Box className={styles.featureItem}>{children}</Box>
    </Group>
  );
};
