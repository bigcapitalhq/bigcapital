import { SendViewPreviewHeader } from "../../Estimates/SendMailViewDrawer/SendMailViewPreviewHeader";

export function PaymentReceivedMailPreviewHeader() {
  return (
    <SendViewPreviewHeader
      companyName="A"
      customerName="A"
      subject={'adsfsdf'}
      from={['a.bouhuolia@gmail.com']}
      to={['a.bouhuolia@gmail.com']}
    />
  );
}
