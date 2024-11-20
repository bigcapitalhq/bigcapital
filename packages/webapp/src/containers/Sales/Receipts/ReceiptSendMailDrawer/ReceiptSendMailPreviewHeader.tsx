import { SendViewPreviewHeader } from '../../Estimates/SendMailViewDrawer/SendMailViewPreviewHeader';

export function ReceiptSendMailPreviewHeader() {
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
