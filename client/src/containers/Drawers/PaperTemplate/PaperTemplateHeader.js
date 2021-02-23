import React from 'react';
import { Icon } from 'components';

export default function PaperTemplateHeader({ defaultLabels }) {
  return (
    <>
      <div className={'template__header'}>
        <div className={'template__header--title'}>
          <h1>{defaultLabels.name}</h1>
          <p>info@bigcapital.ly </p>
        </div>
        <Icon icon="bigcapital" height={30} width={200} />
      </div>

      <div className="template__content">
        <div className="template__content__info">
          <span> {defaultLabels.billedTo} </span>
          <p className={'info-paragraph'}>Joe Biden</p>
        </div>
        <div className="template__content__info">
          <span> {defaultLabels.date} </span>

          <p className={'info-paragraph'}>1/1/2022</p>
        </div>
        <div className="template__content__info">
          <span> {defaultLabels.refNo} </span>
          <p className={'info-paragraph'}>IN-2022</p>
        </div>
        <div className="template__content__info">
          <span> {defaultLabels.amount} </span>
          <p className={'info-paragraph-amount'}>6,000 LYD</p>
        </div>
        <div className="template__content__info">
          <span> {defaultLabels.billedFrom} </span>
          <p className={'info-paragraph'}>Donald Trump</p>
        </div>
        <div className="template__content__info">
          <span> {defaultLabels.dueDate} </span>
          <p className={'info-paragraph'}>25/03/2022</p>
        </div>
      </div>
    </>
  );
}
