// @ts-nocheck
import React, { useReducer, useEffect } from 'react';
import classNames from 'classnames';
import { Button, ButtonGroup, Intent, HTMLSelect } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';
import PropTypes from 'prop-types';
import { range } from 'lodash';
import { Icon } from '@/components';

import '@/style/components/DataTable/Pagination.scss';

const TYPE = {
  PAGE_CHANGE: 'PAGE_CHANGE',
  PAGE_SIZE_CHANGE: 'PAGE_SIZE_CHANGE',
  INITIALIZE: 'INITIALIZE',
};

const getState = ({ currentPage, size, total }) => {
  const totalPages = Math.ceil(total / size);
  const visibleItems = 5;
  const halfVisibleItems = Math.ceil(visibleItems / 2);

  // create an array of pages to ng-repeat in the pager control
  let startPage, endPage;
  if (totalPages <= visibleItems) {
    // less than {visibleItems} total pages so show
    startPage = 1;
    endPage = totalPages;
  } else {
    // more than {visibleItems} total pages so calculate start and end pages
    if (currentPage <= halfVisibleItems) {
      startPage = 1;
      endPage = visibleItems;
    } else if (currentPage + (halfVisibleItems - 1) >= totalPages) {
      startPage = totalPages - (visibleItems - 1);
      endPage = totalPages;
    } else {
      startPage = currentPage - halfVisibleItems;
      endPage = currentPage + halfVisibleItems - 1;
    }
  }
  const pages = [...Array(endPage + 1 - startPage).keys()].map(
    (i) => startPage + i,
  );

  // Too large or small currentPage
  let correctCurrentpage = currentPage;
  if (currentPage > totalPages) correctCurrentpage = totalPages;
  if (currentPage <= 0) correctCurrentpage = 1;

  return {
    currentPage: correctCurrentpage,
    size,
    total,
    pages,
    totalPages,
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case TYPE.PAGE_CHANGE:
      return getState({
        currentPage: action.page,
        size: state.size,
        total: state.total,
      });
    case TYPE.PAGE_SIZE_CHANGE:
      return getState({
        currentPage: state.currentPage,
        size: action.size,
        total: state.total,
      });
    case TYPE.INITIALIZE:
      return getState({
        currentPage: action.page,
        size: action.size,
        total: action.total,
      });
    default:
      throw new Error();
  }
};

export function Pagination({
  currentPage,
  total,
  size,
  pageSizesOptions = [20, 30, 50, 75, 100, 150],
  onPageChange,
  onPageSizeChange,
}) {
  const [state, dispatch] = useReducer(
    reducer,
    { currentPage, total, size },
    getState,
  );

  useEffect(() => {
    dispatch({
      type: TYPE.INITIALIZE,
      total,
      size,
      page: currentPage,
    });
  }, [total, size, currentPage]);

  return (
    <div class="pagination">
      <div class="pagination__buttons-group">
        <ButtonGroup>
          <Button
            disabled={state.currentPage <= 1}
            onClick={() => {
              dispatch({ type: 'PAGE_CHANGE', page: state.currentPage - 1 });

              const page = state.currentPage - 1;
              const { size: pageSize } = state;

              onPageChange({ page, pageSize });
            }}
            minimal={true}
            className={'pagination__item pagination__item--previous'}
            icon={<Icon icon={'arrow-back-24'} iconSize={12} />}
          >
            <T id="previous" />
          </Button>

          {state.pages.map((page) => (
            <Button
              key={page}
              intent={state.currentPage === page ? Intent.PRIMARY : Intent.NONE}
              disabled={state.currentPage === page}
              onClick={() => {
                dispatch({ type: 'PAGE_CHANGE', page });
                const { size: pageSize } = state;

                onPageChange({ page, pageSize });
              }}
              minimal={true}
              className={classNames(
                'pagination__item',
                'pagination__item--page',
                {
                  'is-active': state.currentPage === page,
                },
              )}
            >
              {page}
            </Button>
          ))}
          <Button
            disabled={state.currentPage === state.totalPages}
            onClick={() => {
              dispatch({
                type: 'PAGE_CHANGE',
                page: state.currentPage + 1,
              });
              const page = state.currentPage + 1;
              const { size: pageSize } = state;

              onPageChange({ page, pageSize });
            }}
            minimal={true}
            className={'pagination__item pagination__item--next'}
            icon={<Icon icon={'arrow-forward-24'} iconSize={12} />}
          >
            <T id="next" />
          </Button>
        </ButtonGroup>
      </div>

      <div class="pagination__controls">
        <div class="pagination__goto-control">
          Go to
          <HTMLSelect
            minimal={true}
            options={range(1, state.totalPages + 1)}
            value={state.currentPage}
            onChange={(event) => {
              const page = parseInt(event.currentTarget.value, 10);
              const { size: pageSize } = state;

              dispatch({ type: 'PAGE_CHANGE', page });
              onPageChange({ page, pageSize });
            }}
          />
        </div>

        <div class="pagination__pagesize-control">
          <T id={'page_size'} />
          <HTMLSelect
            minimal={true}
            options={pageSizesOptions}
            value={size}
            onChange={(event) => {
              const pageSize = parseInt(event.currentTarget.value, 10);
              dispatch({ type: 'PAGE_SIZE_CHANGE', size: pageSize });
              dispatch({ type: 'PAGE_CHANGE', page: 1 });

              onPageSizeChange({ pageSize, page: 1 });
            }}
          />
        </div>
      </div>

      <div class="pagination__info">
        {intl.get('showing_current_page_to_total', {
          currentPage: state.currentPage,
          totalPages: state.totalPages,
          total: total,
        })}
      </div>
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
};

Pagination.defaultProps = {
  currentPage: 1,
  size: 25,
};
