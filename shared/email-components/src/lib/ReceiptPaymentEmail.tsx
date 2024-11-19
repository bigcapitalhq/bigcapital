export interface ReceiptEmailTemplateProps {
  preview?: string;

  // # Company
  companyName?: string;
  companyLogoUri: string;

  // # Colors
  primaryColor?: string;

  // # Invoice total
  total: string;
  totalLabel?: string;

  // # Items
  items: Array<{ label: string; quantity: string; rate: string }>;

  viewReceiptButtonLabel?: string;
  viewReceiptButtonUrl?: string;
}

export const ReceiptEmailTemplate: React.FC<
  Readonly<ReceiptEmailTemplateProps>
> = ({
  preview,

  // # Company
  companyName,
  companyLogoUri,

  // # Colors
  primaryColor = 'rgb(0, 82, 204)',

  // # Invoice total
  total,
  totalLabel = 'Total',

  // # View invoice button
  viewReceiptButtonLabel = 'View Estimate',
  viewReceiptButtonUrl,
}) => {
    return (
      <h1>asdasd</h1>
    )
  };
