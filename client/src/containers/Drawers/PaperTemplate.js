import React from 'react';
import { Icon } from 'components';
import 'style/components/Drawer/DrawerTemplate.scss';

export default function PaperTemplate({ labels: propLabels }) {
  const labels = {
    name: 'Estimate',
    billedTo: 'Billed to',
    date: 'Estimate date',
    refNo: 'Estimate No.',
    billedFrom: 'Billed from',
    amount: 'Estimate amount',
    dueDate: 'Due date',
    ...propLabels,
  };

  return (
    <div id={'page-size'}>
      <div className={'template'}>
        <div className={'template__header'}>
          <div className={'template__header--title'}>
            <h1>{labels.name}</h1>
            <p>info@bigcapital.ly </p>
          </div>
          <Icon icon="bigcapital" height={30} width={200} />
        </div>

        <div className="template__content">
          <div className="template__content__info">
            <span> {labels.billedTo} </span>
            <p className={'info-paragraph'}>Joe Biden</p>
          </div>
          <div className="template__content__info">
            <span> {labels.date} </span>

            <p className={'info-paragraph'}>1/1/2022</p>
          </div>
          <div className="template__content__info">
            <span> {labels.refNo} </span>
            <p className={'info-paragraph'}>IN-2022</p>
          </div>
          <div className="template__content__info">
            <span> {labels.amount} </span>
            <p className={'info-paragraph-amount'}>6,000 LYD</p>
          </div>
          <div className="template__content__info">
            <span> {labels.billedFrom} </span>
            <p className={'info-paragraph'}>Donald Trump</p>
          </div>
          <div className="template__content__info">
            <span> {labels.dueDate} </span>
            <p className={'info-paragraph'}>25/03/2022</p>
          </div>
        </div>

        <div className="template__table">
          <div className="template__table__rows">
            <span className="template__table__rows--cell ">Description</span>
            <span className="template__table__rows--cell">Rate</span>
            <span className="template__table__rows--cell">Qty</span>
            <span className="template__table__rows--cell">Total</span>
          </div>
          <div className="template__table__rows">
            <span className="template__table__rows--cell">
              Nulla commodo magnanon dolor excepteur nisi aute laborum.
            </span>
            <span className="template__table__rows--cell">1</span>
            <span className="template__table__rows--cell">1</span>
            <span className="template__table__rows--cell">100 LYD</span>
          </div>

          <div className="template__table__rows">
            <span className="template__table__rows--cell">
              Nulla comm non dolor excepteur elit dolore eiusmod nisi aute
              laborum.
            </span>
            <span className="template__table__rows--cell">1</span>
            <span className="template__table__rows--cell">1</span>
            <span className="template__table__rows--cell">100 LYD</span>
          </div>
          <div className="template__table__rows">
            <span className="template__table__rows--cell">
              Nulla comm non dolor excepteur elit dolore eiusmod nisi aute
              laborum.
            </span>
            <span className="template__table__rows--cell">1</span>
            <span className="template__table__rows--cell">1</span>
            <span className="template__table__rows--cell">100 LYD</span>
          </div>
          <div className="template__table__rows">
            <span className="template__table__rows--cell">
              Nulla comm non dolor excepteur elit dolore eiusmod nisi aute
              laborum.
            </span>
            <span className="template__table__rows--cell">1</span>
            <span className="template__table__rows--cell">1</span>
            <span className="template__table__rows--cell">100 LYD</span>
          </div>
          <div className="template__table__rows">
            <span className="template__table__rows--cell">
              Nulla comm non dolor excepteur elit dolore eiusmod nisi aute
              laborum.
            </span>
            <span className="template__table__rows--cell">1</span>
            <span className="template__table__rows--cell">1</span>
            <span className="template__table__rows--cell">100 LYD</span>
          </div>
        </div>

        <div className="template__terms">
          <div className="template__terms__title">
            <h4>Conditions and terms</h4>
          </div>
          <ul>
            <li>Est excepteur laboris do sit dolore sit exercitation non.</li>
            <li>Lorem duis aliqua minim elit cillum.</li>
            <li>Dolor ad quis Lorem ut mollit consectetur.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
