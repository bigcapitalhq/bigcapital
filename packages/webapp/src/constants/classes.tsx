// @ts-nocheck
import { Classes } from '@blueprintjs/core';

export const NS = 'bp4';

export const SECTION = `${NS}-section`;
export const SECTION_COLLAPSED = `${SECTION}-collapsed`;
export const SECTION_HEADER = `${SECTION}-header`;
export const SECTION_HEADER_LEFT = `${SECTION_HEADER}-left`;
export const SECTION_HEADER_TITLE = `${SECTION_HEADER}-title`;
export const SECTION_HEADER_SUB_TITLE = `${SECTION_HEADER}-sub-title`;
export const SECTION_HEADER_DIVIDER = `${SECTION_HEADER}-divider`;
export const SECTION_HEADER_TABS = `${SECTION_HEADER}-tabs`;
export const SECTION_HEADER_RIGHT = `${SECTION_HEADER}-right`;
export const SECTION_CARD = `${SECTION}-card`;

export const PADDED = `${NS}-padded`;

const CLASSES = {
  DASHBOARD_PAGE: 'dashboard__page',
  DASHBOARD_DATATABLE: 'dashboard__datatable',
  DASHBOARD_CARD: 'dashboard__card',
  DASHBOARD_CARD_PAGE: 'dashboard__card--page',

  DATATABLE_EDITOR: 'datatable-editor',
  DATATABLE_EDITOR_ACTIONS: 'datatable-editor__actions',
  DATATABLE_EDITOR_ITEMS_ENTRIES: 'items-entries-table',
  DATATABLE_EDITOR_HAS_TOTAL_ROW: 'has-total-row',

  DASHBOARD_CONTENT: 'dashboard-content',
  DASHBOARD_CONTENT_PREFERENCES: 'dashboard-content--preferences',
  DASHBOARD_CONTENT_PANE: 'Pane2',
  DASHBOARD_CENTERED_EMPTY_STATUS: 'dashboard__centered-empty-status',

  PAGE_FORM: 'page-form',
  PAGE_FORM_HEADER: 'page-form__header',
  PAGE_FORM_HEADER_PRIMARY: 'page-form__primary-section',
  PAGE_FORM_HEADER_FIELDS: 'page-form__header-fields',
  PAGE_FORM_HEADER_BIG_NUMBERS: 'page-form__big-numbers',
  PAGE_FORM_TABS: 'page-form__tabs',
  PAGE_FORM_BODY: 'page-form__body',
  PAGE_FORM_STRIP_STYLE: 'page-form--strip',

  PAGE_FORM_FOOTER: 'page-form__footer',
  PAGE_FORM_FLOATING_ACTIONS: 'page-form__floating-actions',

  PAGE_FORM_BILL: 'page-form--bill',
  PAGE_FORM_ESTIMATE: 'page-form--estimate',
  PAGE_FORM_INVOICE: 'page-form--invoice',
  PAGE_FORM_RECEIPT: 'page-form--receipt',
  PAGE_FORM_PAYMENT_MADE: 'page-form--payment-made',
  PAGE_FORM_PAYMENT_RECEIVE: 'page-form--payment-receive',
  PAGE_FORM_CUSTOMER: 'page-form--customer',
  PAGE_FORM_VENDOR: 'page-form--vendor',
  PAGE_FORM_ITEM: 'page-form--item',
  PAGE_FORM_MAKE_JOURNAL: 'page-form--make-journal-entries',
  PAGE_FORM_EXPENSE: 'page-form--expense',
  PAGE_FORM_CREDIT_NOTE: 'page-form--credit-note',
  PAGE_FORM_VENDOR_CREDIT_NOTE: 'page-form--vendor-credit-note',
  PAGE_FORM_WAREHOUSE_TRANSFER: 'page-form--warehouse-transfer',

  FORM_GROUP_LIST_SELECT: 'form-group--select-list',

  CLOUD_SPINNER: 'cloud-spinner',
  IS_LOADING: 'is-loading',

  DATATABLE_EMPTY_STATUS: 'datatable-empty-status',
  DATATABLE_EMPTY_STATUS_TITLE: 'datatable-empty-status__title',
  DATATABLE_EMPTY_STATUS_DESC: 'datatable-empty-status__desc',
  DATATABLE_EMPTY_STATUS_ACTIONS: 'datatable-empty-status__actions',

  SELECT_LIST_FILL_POPOVER: 'select-list--fill-popover',

  PREFERENCES_PAGE: 'preferences-page',
  PREFERENCES_PAGE_SIDEBAR: 'preferences-page__sidebar',
  PREFERENCES_PAGE_TOPBAR: 'preferences-page__topbar',
  PREFERENCES_PAGE_CONTENT: 'preferences-page__content',
  PREFERENCES_PAGE_TABS: 'preferences-page__tabs',

  PREFERENCES_SIDEBAR: 'preferences-sidebar',
  PREFERENCES_TOPBAR: 'preferences-topbar',

  PREFERENCES_PAGE_INSIDE_CONTENT: 'preferences-page__inside-content',
  PREFERENCES_PAGE_INSIDE_CONTENT_GENERAL:
    'preferences-page__inside-content--general',
  PREFERENCES_PAGE_INSIDE_CONTENT_USERS:
    'preferences-page__inside-content--users',
  PREFERENCES_PAGE_INSIDE_CONTENT_CURRENCIES:
    'preferences-page__inside-content--currencies',
  PREFERENCES_PAGE_INSIDE_CONTENT_ACCOUNTANT:
    'preferences-page__inside-content--accountant',
  PREFERENCES_PAGE_INSIDE_CONTENT_SMS_INTEGRATION:
    'preferences-page__inside-content--sms-integration',
  PREFERENCES_PAGE_INSIDE_CONTENT_ROLES_FORM:
    'preferences-page__inside-content--roles-form',
  PREFERENCES_PAGE_INSIDE_CONTENT_BRANCHES:
    'preferences-page__inside-content--branches',
  PREFERENCES_PAGE_INSIDE_CONTENT_WAREHOUSES:
    'preferences-page__inside-content--warehouses',

  FINANCIAL_REPORT_INSIDER: 'dashboard__insider--financial-report',

  UNIVERSAL_SEARCH: 'universal-search',
  UNIVERSAL_SEARCH_OMNIBAR: 'universal-search__omnibar',
  UNIVERSAL_SEARCH_OVERLAY: 'universal-search-overlay',
  UNIVERSAL_SEARCH_INPUT: 'universal-search__input',
  UNIVERSAL_SEARCH_INPUT_RIGHT_ELEMENTS:
    'universal-search-input-right-elements',
  UNIVERSAL_SEARCH_TYPE_SELECT_OVERLAY: 'universal-search__type-select-overlay',
  UNIVERSAL_SEARCH_TYPE_SELECT_BTN: 'universal-search__type-select-btn',
  UNIVERSAL_SEARCH_FOOTER: 'universal-search__footer',

  UNIVERSAL_SEARCH_ACTIONS: 'universal-search__actions',
  UNIVERSAL_SEARCH_ACTION_SELECT:
    'universal-search__action universal-search__action--select',
  UNIVERSAL_SEARCH_ACTION_CLOSE:
    'universal-search__action universal-search__action--close',
  UNIVERSAL_SEARCH_ACTION_ARROWS:
    'universal-search__action universal-search__action--arrows',

  DIALOG_PDF_PREVIEW: 'dialog--pdf-preview-dialog',

  ...Classes,
  CARD: 'card',
  ALIGN_RIGHT: 'align-right',
  FONT_BOLD: 'font-bold',

  NS,
  PADDED,
  SECTION,
  SECTION_COLLAPSED,
  SECTION_HEADER,
  SECTION_HEADER_LEFT,
  SECTION_HEADER_TITLE,
  SECTION_HEADER_SUB_TITLE,
  SECTION_HEADER_DIVIDER,
  SECTION_HEADER_TABS,
  SECTION_HEADER_RIGHT,
  SECTION_CARD,
};

export { CLASSES };
