import React from 'react';
import { Icon } from 'components';

export default function PaymentPaperTemplateHeader({ defaultLabels }) {
  return (
    <>
      <div className={'template__header'}>
        <div className={'template__header--title'}>
          <h1>{defaultLabels.title}</h1>
          <p>info@bigcapital.ly </p>
        </div>
        <Icon icon="bigcapital" height={30} width={200} />
      </div>

      <div className="template__content">
        <div className="template__content__info">
          <span> {defaultLabels.billedTo} </span>
          <p className={'info-paragraph'}>Step Currency</p>
        </div>
        <div className="template__content__info">
          <span> {defaultLabels.paymentDate} </span>
          <p className={'info-paragraph'}>1/1/2022</p>
        </div>
        <div className="template__content__info">
          <span> {defaultLabels.paymentNo} </span>
          <p className={'info-paragraph'}>IN-2022</p>
        </div>
        <div className="template__content__info">
          <span> {defaultLabels.amountReceived} </span>
          <p className={'info-paragraph-amount'}>60,000 USD</p>
        </div>
        <div className="template__content__info">
          <span> {defaultLabels.billedFrom} </span>
          <p className={'info-paragraph'}> Klay Thompson</p>
        </div>
        <div className="template__content__info">
          <span> {defaultLabels.referenceNo} </span>
          <p className={'info-paragraph'}></p>
        </div>
      </div>
    </>
  );
}
