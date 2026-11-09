import { Button, ButtonGroup, Intent, HTMLSelect } from '@blueprintjs/core';
import { x } from '@xstyled/emotion';
import { range } from 'lodash';
import { useReducer, useEffect } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Icon, FormattedMessage as T } from '@/components';
import { useIsDarkMode } from '@/hooks/useDarkMode';

const StyledButtonGroup = styled(ButtonGroup)`
  .bp4-button {
    background: transparent;
    padding: 5px;
  }
`;

const StyledPaginationButton = styled(Button)`
  --x-button-text-color: #666666;
  --x-button-hover-background: #e6effb;
  --x-button-active-text-color: #000;
  --x-button-active-background: #e6effb;
  --x-button-active-disabled-background: #e6effb;

  .bp4-dark & {
    --x-button-text-color: rgba(255, 255, 255, 0.8);
    --x-button-hover-background: var(--color-dark-gray3);
    --x-button-active-text-color: var(--color-light-gray2);
    --x-button-active-background: var(--color-dark-gray3);
    --x-button-active-disabled-background: var(--color-dark-gray3);
  }
  min-width: 24px;
  min-height: 24px;
  border-radius: 5px;

  &:not([class*='bp4-intent-']).bp4-minimal {
    color: var(--x-button-text-color);

    &:hover {
      background-color: var(--x-button-hover-background);
    }
    .bp4-icon {
      margin-right: 4px;
      color: var(--x-button-text-color);
    }
  }
  &.is-active {
    &.bp4-intent-primary.bp4-minimal:disabled,
    &.bp4-intent-primary.bp4-minimal.bp4-disabled {
      background-color: var(--x-button-active-disabled-background);

      .bp4-button-text {
        color: var(--x-button-active-text-color);
      }
    }
  }
`;

const StyledPreviousButton = styled(StyledPaginationButton)`
  padding-left: 10px;
  padding-right: 10px;

  .bp4-icon {
    [dir='rtl'] & {
      transform: scale(-1);
    }
  }
`;

const StyledNextButton = styled(StyledPaginationButton)`
  padding-left: 10px;
  padding-right: 10px;

  .bp4-icon {
    order: 1;
    margin-right: 0;
    margin-left: 4px;
  }
`;

const StyledHTMLSelect = styled(HTMLSelect)`
  --x-html-select-text-color: #666;
  --x-html-select-border-color: #e8e8e8;

  .bp4-dark & {
    --x-html-select-text-color: rgba(255, 255, 255, 0.8);
    --x-html-select-border-color: rgba(255, 255, 255, 0.15);
  }
  &.bp4-html-select.bp4-minimal {
    margin-left: 6px;

    select {
      height: 24px;
      width: auto;
      padding: 0;
      padding-right: 14px;
      padding-left: 8px;
      border: 1px solid var(--x-html-select-border-color);
      font-size: 13px;
      border-radius: 3px;
      color: var(--x-html-select-text-color);
    }
    &::after {
      border-left-width: 3px;
      border-right-width: 3px;
      border-top-width: 4px;
      margin-right: 6px;
    }
  }
`;

const TYPE = {
  PAGE_CHANGE: 'PAGE_CHANGE',
  PAGE_SIZE_CHANGE: 'PAGE_SIZE_CHANGE',
  INITIALIZE: 'INITIALIZE',
} as const;

interface PaginationState {
  currentPage: number;
  size: number;
  total: number;
  pages: number[];
  totalPages: number;
}

interface PaginationChangePayload {
  page: number;
  pageSize: number;
}

interface PaginationProps {
  currentPage: number;
  total: number;
  size: number;
  pageSizesOption?: number[];
  onPageChange?: (payload: PaginationChangePayload) => void;
  onPageSizeChange?: (payload: PaginationChangePayload) => void;
}

const getState = ({
  currentPage,
  size,
  total,
}: {
  currentPage: number;
  size: number;
  total: number;
}): PaginationState => {
  const totalPages = Math.ceil(total / size);
  const visibleItems = 5;
  const halfVisibleItems = Math.ceil(visibleItems / 2);

  let startPage: number, endPage: number;
  if (totalPages <= visibleItems) {
    startPage = 1;
    endPage = totalPages;
  } else {
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

type PaginationAction =
  | { type: 'PAGE_CHANGE'; page: number }
  | { type: 'PAGE_SIZE_CHANGE'; size: number }
  | { type: 'INITIALIZE'; page: number; size: number; total: number };

const reducer = (state: PaginationState, action: PaginationAction) => {
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
  pageSizesOption = [20, 30, 50, 75, 100, 150],
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const isDark = useIsDarkMode();
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
    <x.div display="flex" p="20px 14px" fontSize="13px">
      <x.div>
        <StyledButtonGroup>
          <StyledPreviousButton
            disabled={state.currentPage <= 1}
            onClick={() => {
              dispatch({ type: 'PAGE_CHANGE', page: state.currentPage - 1 });

              const page = state.currentPage - 1;
              const { size: pageSize } = state;

              onPageChange?.({ page, pageSize });
            }}
            minimal={true}
            icon={<Icon icon={'arrow-back-24'} iconSize={12} />}
          >
            <T id="previous" />
          </StyledPreviousButton>

          {state.pages.map((page) => (
            <StyledPaginationButton
              key={page}
              intent={state.currentPage === page ? Intent.PRIMARY : Intent.NONE}
              disabled={state.currentPage === page}
              onClick={() => {
                dispatch({ type: 'PAGE_CHANGE', page });
                const { size: pageSize } = state;

                onPageChange?.({ page, pageSize });
              }}
              minimal={true}
              className={state.currentPage === page ? 'is-active' : ''}
            >
              {page}
            </StyledPaginationButton>
          ))}
          <StyledNextButton
            disabled={state.currentPage === state.totalPages}
            onClick={() => {
              dispatch({
                type: 'PAGE_CHANGE',
                page: state.currentPage + 1,
              });
              const page = state.currentPage + 1;
              const { size: pageSize } = state;

              onPageChange?.({ page, pageSize });
            }}
            minimal={true}
            icon={<Icon icon={'arrow-forward-24'} iconSize={12} />}
          >
            <T id="next" />
          </StyledNextButton>
        </StyledButtonGroup>
      </x.div>

      <x.div display="flex" alignItems="center" ml="auto">
        <x.div display="none">
          Go to
          <StyledHTMLSelect
            minimal={true}
            options={range(1, state.totalPages + 1)}
            value={state.currentPage}
            onChange={(event) => {
              const page = parseInt(event.currentTarget.value, 10);
              const { size: pageSize } = state;

              dispatch({ type: 'PAGE_CHANGE', page });
              onPageChange?.({ page, pageSize });
            }}
          />
        </x.div>

        <x.div ml="12px" color={isDark ? 'rgba(255, 255, 255, 0.6)' : '#666'}>
          <T id={'page_size'} />
          <StyledHTMLSelect
            minimal={true}
            options={pageSizesOption}
            value={size}
            onChange={(event) => {
              const pageSize = parseInt(event.currentTarget.value, 10);
              dispatch({ type: 'PAGE_SIZE_CHANGE', size: pageSize });
              dispatch({ type: 'PAGE_CHANGE', page: 1 });

              onPageSizeChange?.({ pageSize, page: 1 });
            }}
          />
        </x.div>
      </x.div>

      <x.div
        color={isDark ? 'rgba(255, 255, 255, 0.6)' : '#666'}
        ml="12px"
        display="flex"
        alignItems="center"
      >
        {intl.get('showing_current_page_to_total', {
          currentPage: state.currentPage,
          totalPages: state.totalPages,
          total: total,
        })}
      </x.div>
    </x.div>
  );
}
