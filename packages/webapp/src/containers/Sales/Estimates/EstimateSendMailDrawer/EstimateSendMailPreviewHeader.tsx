import { SendViewPreviewHeader } from '../SendMailViewDrawer/SendMailViewPreviewHeader';

export function EstimateSendMailPreviewHeader() {
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
