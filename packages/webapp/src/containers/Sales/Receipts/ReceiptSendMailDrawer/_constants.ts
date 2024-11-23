export const defaultReceiptMailProps = {
  companyLogoUri: 'https://via.placeholder.com/150',
  companyName: 'Company Name',
  receiptNumber: '1234',
  total: '1000',
  message: 'Thank you for your business!',
  items: [
    { label: 'Item 1', quantity: 1, total: '500' },
    { label: 'Item 2', quantity: 2, total: '500' },
  ],
  subtotal: '1000',
  showViewReceiptButton: true,
  viewReceiptButtonLabel: 'View Receipt',
};
