export interface CreditNoteEmailProps {
  preview?: string;

  companyName?: string;
  companyLogoUri: string;

  primaryColor?: string;

  total: string;
  totalLabel?: string;

  // # Items
  items: Array<{ label: string; quantity: string; rate: string }>;

  viewEstimateButtonLabel?: string;
  viewEstimateButtonUrl?: string;
}

export const CreditNoteEmailTemplate: React.FC<
  Readonly<CreditNoteEmailProps>
> = ({
  preview,

  // # Company
  companyName,
  companyLogoUri,

  // # Colors
  primaryColor = 'rgb(0, 82, 204)',

  // # invoice total
  total,
  totalLabel = 'Total',

  // # View invoice button
  viewEstimateButtonLabel = 'View Estimate',
  viewEstimateButtonUrl,
}) => {
    return <h1>asdasd</h1>;
  };
