import React from 'react';
import { Icon } from 'components';
import 'style/components/Drawer/DrawerTemplate.scss';

export default function PaymentPaperTemplate({ labels: propLabels }) {
  const labels = {
    title: 'Payment receive',
    billedTo: 'Billed to',
    paymentDate: 'Payment date',
    paymentNo: 'Payment No.',
    billedFrom: 'Billed from',
    referenceNo: 'Reference No',
    amountReceived: 'Amount received',
    ...propLabels,
  };

  return (
    <div id={'page-size'}>
      <div className={'template'}>
        <div className={'template__header'}>
          <div className={'template__header--title'}>
            <h1>{labels.title}</h1>
            <p>info@bigcapital.ly </p>
          </div>
          <Icon icon="bigcapital" height={30} width={200} />
        </div>

        <div className="template__content">
          <div className="template__content__info">
            <span> {labels.billedTo} </span>
            <p className={'info-paragraph'}>Step Currency</p>
          </div>
          <div className="template__content__info">
            <span> {labels.paymentDate} </span>
            <p className={'info-paragraph'}>1/1/2022</p>
          </div>
          <div className="template__content__info">
            <span> {labels.paymentNo} </span>
            <p className={'info-paragraph'}>IN-2022</p>
          </div>
          <div className="template__content__info">
            <span> {labels.amountReceived} </span>
            <p className={'info-paragraph-amount'}>60,000 USD</p>
          </div>
          <div className="template__content__info">
            <span> {labels.billedFrom} </span>
            <p className={'info-paragraph'}> Klay Thompson</p>
          </div>
          <div className="template__content__info">
            <span> {labels.referenceNo} </span>
            <p className={'info-paragraph'}></p>
          </div>
        </div>
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
              INV-2{' '}
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
      </div>
    </div>
  );
}
