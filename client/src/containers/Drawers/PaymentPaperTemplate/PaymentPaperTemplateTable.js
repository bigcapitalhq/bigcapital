import React from 'react';

export default function PaymentPaperTemplateTable() {
  return (
    <div className="template__table">
      <div className="template__table__rows">
        <span className="template__table__rows--cell-payment-receive ">
          Invoice number
        </span>
        <span className="template__table__rows--cell-payment-receive ">
          Invoice date
        </span>
        <span className="template__table__rows--cell-payment-receive ">
          Invoice amount
        </span>
        <span className="template__table__rows--cell-payment-receive ">
          Payment amount
        </span>
      </div>

      <div className="template__table__rows">
        <span className="template__table__rows--cell-payment-receive">
          INV-1
        </span>
        <span className="template__table__rows--cell-payment-receive">
          12 Jan 2021
        </span>
        <span className="template__table__rows--cell-payment-receive">
          50,000 USD
        </span>
        <span className="template__table__rows--cell-payment-receive">
          1000 USD
        </span>
      </div>
      <div className="template__table__rows">
        <span className="template__table__rows--cell-payment-receive">
          INV-2
        </span>
        <span className="template__table__rows--cell-payment-receive">
          12 Jan 2021
        </span>
        <span className="template__table__rows--cell-payment-receive">
          50,000 USD
        </span>
        <span className="template__table__rows--cell-payment-receive">
          1000 USD
        </span>
      </div>
    </div>
  );
}
