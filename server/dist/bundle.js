/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./config/index.js":
/*!*************************!*\
  !*** ./config/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dotenv */ "dotenv");
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_1__);



dotenv__WEBPACK_IMPORTED_MODULE_1___default.a.config({
  path: path__WEBPACK_IMPORTED_MODULE_0___default.a.resolve(process.cwd(), '.env.test') });

/***/ }),

/***/ "./knexfile.js":
/*!*********************!*\
  !*** ./knexfile.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! dotenv */ "dotenv").config();

var MIGRATIONS_DIR = './src/database/migrations';
var SEEDS_DIR = './src/database/seeds';

module.exports = {
  test: {
    client: process.env.DB_CLIENT,
    migrations: {
      directory: MIGRATIONS_DIR },

    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8' } },


  development: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8' },

    migrations: {
      directory: MIGRATIONS_DIR },

    seeds: {
      directory: SEEDS_DIR } },


  production: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8' },

    migrations: {
      directory: MIGRATIONS_DIR },

    seeds: {
      directory: SEEDS_DIR } } };

/***/ }),

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var helmet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! helmet */ "helmet");
/* harmony import */ var helmet__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(helmet__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var express_boom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! express-boom */ "express-boom");
/* harmony import */ var express_boom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(express_boom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config */ "./config/index.js");
/* harmony import */ var _http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/http */ "./src/http/index.js");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/models */ "./src/models/index.js");







var app = express__WEBPACK_IMPORTED_MODULE_0___default()();

// Express configuration
app.set('port', process.env.PORT || 3000);

app.use(helmet__WEBPACK_IMPORTED_MODULE_1___default()());
app.use(express_boom__WEBPACK_IMPORTED_MODULE_2___default()());
app.use(express__WEBPACK_IMPORTED_MODULE_0___default.a.json());

Object(_http__WEBPACK_IMPORTED_MODULE_4__["default"])(app);

/* harmony default export */ __webpack_exports__["default"] = (app);

/***/ }),

/***/ "./src/collection/BudgetEntriesSet.js":
/*!********************************************!*\
  !*** ./src/collection/BudgetEntriesSet.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BudgetEntriesSet; });
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "@babel/runtime/helpers/toConsumableArray");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__);
var

BudgetEntriesSet = /*#__PURE__*/function () {

  function BudgetEntriesSet() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, BudgetEntriesSet);
    this.accounts = {};
    this.totalSummary = {};
    this.orderSize = null;
  }_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(BudgetEntriesSet, [{ key: "setZeroPlaceholder", value: function setZeroPlaceholder()

    {var _this = this;
      if (!this.orderSize) {return;}

      Object.values(this.accounts).forEach(function (account) {

        for (var i = 0; i <= _this.orderSize.length; i++) {
          if (typeof account[i] === 'undefined') {
            account[i] = { amount: 0 };
          }
        }
      });
    } }, { key: "toArray", value: function toArray()















    {var _this2 = this;
      var output = [];

      Object.key(this.accounts).forEach(function (accountId) {
        var entries = _this2.accounts[accountId];
        output.push({
          account_id: accountId,
          entries: _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(
          Object.key(entries).map(function (order) {
            var entry = entries[order];
            return {
              order: order,
              amount: entry.amount };

          })) });


      });
    } }, { key: "calcTotalSummary", value: function calcTotalSummary()

    {var _this3 = this;
      var totalSummary = {};var _loop = function _loop(

      i) {
        Object.value(_this3.accounts).forEach(function (account) {
          if (typeof totalSummary[i] !== 'undefined') {
            totalSummary[i] = { amount: 0, order: i };
          }
          totalSummary[i].amount += account[i].amount;
        });};for (var i = 0; i < this.orderSize.length; i++) {_loop(i);
      }
      this.totalSummary = totalSummary;
    } }, { key: "toArrayTotalSummary", value: function toArrayTotalSummary()

    {
      return Object.values(this.totalSummary);
    } }], [{ key: "from", value: function from(accounts, configs) {var _this4 = this;var collection = new this(configs);accounts.forEach(function (entry) {if (typeof _this4.accounts[entry.accountId] === 'undefined') {collection.accounts[entry.accountId] = {};}if (entry.order) {collection.accounts[entry.accountId][entry.order] = entry;}});return collection;} }]);return BudgetEntriesSet;}();

/***/ }),

/***/ "./src/collection/NestedSet/index.js":
/*!*******************************************!*\
  !*** ./src/collection/NestedSet/index.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return NestedSet; });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__);
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}var
NestedSet = /*#__PURE__*/function () {
  /**
                                       * Constructor method.
                                       * @param {Object} options -
                                       */
  function NestedSet(items, options) {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, NestedSet);
    this.options = _objectSpread({
      parentId: 'parent_id',
      id: 'id' },
    options);

    this.items = items;
    this.collection = {};
    this.toTree();

    return this.collection;
  }

  /**
     * Link nodes children.
     */_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(NestedSet, [{ key: "linkChildren", value: function linkChildren()
    {var _this = this;
      if (this.items.length <= 0) return false;

      var map = {};
      this.items.forEach(function (item) {
        map[item.id] = item;
        map[item.id].children = [];
      });

      this.items.forEach(function (item) {
        var parentNodeId = item[_this.options.parentId];
        if (parentNodeId) {
          map[parentNodeId].children.push(item);
        }
      });
      return map;
    } }, { key: "toTree", value: function toTree()

    {var _this2 = this;
      var map = this.linkChildren();
      var tree = {};

      this.items.forEach(function (item) {
        var parentNodeId = item[_this2.options.parentId];
        if (!parentNodeId) {
          tree[item.id] = map[item.id];
        }
      });
      this.collection = Object.values(tree);
    } }, { key: "toArray", value: function toArray()

    {

    } }]);return NestedSet;}();

/***/ }),

/***/ "./src/database/knex.js":
/*!******************************!*\
  !*** ./src/database/knex.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var knex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! knex */ "knex");
/* harmony import */ var knex__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(knex__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! objection */ "objection");
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(objection__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _knexfile__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/../knexfile */ "./knexfile.js");
/* harmony import */ var _knexfile__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_knexfile__WEBPACK_IMPORTED_MODULE_3__);
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}



var config = _knexfile__WEBPACK_IMPORTED_MODULE_3___default.a["development"];
var knex = knex__WEBPACK_IMPORTED_MODULE_1___default()(_objectSpread({},
config, {},
Object(objection__WEBPACK_IMPORTED_MODULE_2__["knexSnakeCaseMappers"])({ upperCase: true })));


/* harmony default export */ __webpack_exports__["default"] = (knex);

/***/ }),

/***/ "./src/http/controllers/AccountOpeningBalance.js":
/*!*******************************************************!*\
  !*** ./src/http/controllers/AccountOpeningBalance.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! express-validator */ "express-validator");
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(express_validator__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
/* harmony import */ var _models_Account__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/models/Account */ "./src/models/Account.js");
/* harmony import */ var _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/services/Accounting/JournalPoster */ "./src/services/Accounting/JournalPoster.js");
/* harmony import */ var _services_Accounting_JournalEntry__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/services/Accounting/JournalEntry */ "./src/services/Accounting/JournalEntry.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}







/* harmony default export */ __webpack_exports__["default"] = ({
  /**
                  * Router constructor.
                  */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_3___default.a.Router();

    router.post('/',
    this.openingBalnace.validation,
    Object(_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.openingBalnace.handler));

    return router;
  },

  /**
      * Opening balance to the given account.
      * @param {Request} req -
      * @param {Response} res -
      */
  openingBalnace: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('accounts').isArray({ min: 1 }),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('accounts.*.id').exists().isInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["oneOf"])([
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('accounts.*.debit').isNumeric().toFloat(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('accounts.*.credit').isNumeric().toFloat()])],


    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(req, res) {var validationErrors, accounts, accountsIds, accountsCollection, accountsStoredIds, notFoundAccountsIds, errorReasons, ids, sharedJournalDetails, journalEntries;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context.next = 3;break;}return _context.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:



                accounts = req.body.accounts;
                accountsIds = accounts.map(function (account) {return account.id;});_context.next = 7;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_7__["default"].query().
                  select(['id']).
                  whereIn('id', accountsIds));case 7:accountsCollection = _context.sent;

                // Get the stored accounts Ids and difference with submit accounts.
                accountsStoredIds = accountsCollection.map(function (account) {return account.id;});
                notFoundAccountsIds = Object(lodash__WEBPACK_IMPORTED_MODULE_5__["difference"])(accountsIds, accountsStoredIds);
                errorReasons = [];

                if (notFoundAccountsIds.length > 0) {
                  ids = notFoundAccountsIds.map(function (a) {return parseInt(a, 10);});
                  errorReasons.push({ type: 'NOT_FOUND_ACCOUNT', code: 100, ids: ids });
                }if (!(
                errorReasons.length > 0)) {_context.next = 14;break;}return _context.abrupt("return",
                res.boom.badData(null, { errors: errorReasons }));case 14:


                sharedJournalDetails = new _services_Accounting_JournalEntry__WEBPACK_IMPORTED_MODULE_9__["default"]({
                  referenceType: 'OpeningBalance',
                  referenceId: 1 });

                journalEntries = new _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_8__["default"](sharedJournalDetails);

                accounts.forEach(function (account) {
                  var entry = new _services_Accounting_JournalEntry__WEBPACK_IMPORTED_MODULE_9__["default"]({
                    account: account.id,
                    accountNormal: account.type.normal });


                  if (account.credit) {
                    entry.credit = account.credit;
                    journalEntries.credit(entry);
                  } else if (account.debit) {
                    entry.debit = account.debit;
                    journalEntries.debit(entry);
                  }
                });_context.next = 19;return (

                  Promise.all([
                  journalEntries.saveEntries(),
                  journalEntries.saveBalance()]));case 19:return _context.abrupt("return",

                res.status(200).send());case 20:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() } });

/***/ }),

/***/ "./src/http/controllers/Accounting.js":
/*!********************************************!*\
  !*** ./src/http/controllers/Accounting.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! express-validator */ "express-validator");
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(express_validator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _models_Account__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/models/Account */ "./src/models/Account.js");
/* harmony import */ var _http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/http/middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
/* harmony import */ var _http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/http/middleware/jwtAuth */ "./src/http/middleware/jwtAuth.js");
/* harmony import */ var _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/services/Accounting/JournalPoster */ "./src/services/Accounting/JournalPoster.js");
/* harmony import */ var _services_Accounting_JournalEntry__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/services/Accounting/JournalEntry */ "./src/services/Accounting/JournalEntry.js");
/* harmony import */ var _models_JournalEntry__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/models/JournalEntry */ "./src/models/JournalEntry.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}









/* harmony default export */ __webpack_exports__["default"] = ({
  /**
                  * Router constructor.
                  */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_4___default.a.Router();
    router.use(_http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_8__["default"]);

    router.post('/make-journal-entries',
    this.makeJournalEntries.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(this.makeJournalEntries.handler));

    router.post('/recurring-journal-entries',
    this.recurringJournalEntries.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(this.recurringJournalEntries.handler));

    router.post('quick-journal-entries',
    this.quickJournalEntries.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(this.quickJournalEntries.handler));

    return router;
  },

  /**
      * Make journal entrires.
      */
  makeJournalEntries: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["check"])('date').isISO8601(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["check"])('reference').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["check"])('entries').isArray({ min: 1 }),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["check"])('entries.*.credit').isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["check"])('entries.*.debit').isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["check"])('entries.*.account_id').isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["check"])('entries.*.note').optional()],

    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(req, res) {var validationErrors, form, errorReasons, totalCredit, totalDebit, accountsIds, accounts, storedAccountsIds, journalReference, journalPoster;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context.next = 3;break;}return _context.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                form = _objectSpread({}, req.body);
                errorReasons = [];
                totalCredit = 0;
                totalDebit = 0;

                form.entries.forEach(function (entry) {
                  if (entry.credit > 0) {
                    totalCredit += entry.credit;
                  }
                  if (entry.debit > 0) {
                    totalDebit += entry.debit;
                  }
                });
                if (totalCredit <= 0 || totalDebit <= 0) {
                  errorReasons.push({
                    type: 'CREDIT.DEBIT.SUMATION.SHOULD.NOT.EQUAL.ZERO',
                    code: 400 });

                }
                if (totalCredit !== totalDebit) {
                  errorReasons.push({ type: 'CREDIT.DEBIT.NOT.EQUALS', code: 100 });
                }
                accountsIds = form.entries.map(function (entry) {return entry.account_id;});_context.next = 13;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_6__["default"].query().whereIn('id', accountsIds).
                  withGraphFetched('type'));case 13:accounts = _context.sent;

                storedAccountsIds = accounts.map(function (account) {return account.id;});

                if (Object(lodash__WEBPACK_IMPORTED_MODULE_5__["difference"])(accountsIds, storedAccountsIds).length > 0) {
                  errorReasons.push({ type: 'ACCOUNTS.IDS.NOT.FOUND', code: 200 });
                }_context.next = 18;return (

                  _models_JournalEntry__WEBPACK_IMPORTED_MODULE_11__["default"].query().where('reference', form.reference));case 18:journalReference = _context.sent;

                if (journalReference.length > 0) {
                  errorReasons.push({ type: 'REFERENCE.ALREADY.EXISTS', code: 300 });
                }if (!(
                errorReasons.length > 0)) {_context.next = 22;break;}return _context.abrupt("return",
                res.status(400).send({ errors: errorReasons }));case 22:

                journalPoster = new _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_9__["default"]();

                form.entries.forEach(function (entry) {
                  var account = accounts.find(function (a) {return a.id === entry.account_id;});

                  var jouranlEntry = new _services_Accounting_JournalEntry__WEBPACK_IMPORTED_MODULE_10__["default"]({
                    debit: entry.debit,
                    credit: entry.credit,
                    account: account.id,
                    accountNormal: account.type.normal,
                    note: entry.note });

                  if (entry.debit) {
                    journalPoster.debit(jouranlEntry);
                  } else {
                    journalPoster.credit(jouranlEntry);
                  }
                });

                // Saves the journal entries and accounts balance changes.
                _context.next = 26;return Promise.all([
                journalPoster.saveEntries(),
                journalPoster.saveBalance()]);case 26:return _context.abrupt("return",

                res.status(200).send());case 27:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                              * Saves recurring journal entries template.
                                                                                                                                                                                              */
  recurringJournalEntries: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["check"])('template_name').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["check"])('recurrence').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["check"])('active').optional().isBoolean().toBoolean(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["check"])('entries').isArray({ min: 1 }),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["check"])('entries.*.credit').isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["check"])('entries.*.debit').isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["check"])('entries.*.account_id').isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["check"])('entries.*.note').optional()],

    handler: function () {var _handler2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(req, res) {var validationErrors;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context2.next = 3;break;}return _context2.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:case "end":return _context2.stop();}}}, _callee2);}));function handler(_x3, _x4) {return _handler2.apply(this, arguments);}return handler;}() },






  recurringJournalsList: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["query"])('page').optional().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["query"])('page_size').optional().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["query"])('template_name').optional()],

    handler: function () {var _handler3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(req, res) {var validationErrors;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context3.next = 3;break;}return _context3.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:case "end":return _context3.stop();}}}, _callee3);}));function handler(_x5, _x6) {return _handler3.apply(this, arguments);}return handler;}() },





  quickJournalEntries: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["check"])('date').exists().isISO8601(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["check"])('amount').exists().isNumeric().toFloat(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["check"])('credit_account_id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["check"])('debit_account_id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["check"])('transaction_type').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["check"])('note').optional()],

    handler: function () {var _handler4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(req, res) {var validationErrors, errorReasons, form, foundAccounts, creditAccount, debitAccount;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context4.next = 3;break;}return _context4.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                errorReasons = [];
                form = _objectSpread({}, req.body);_context4.next = 7;return (

                  _models_Account__WEBPACK_IMPORTED_MODULE_6__["default"].query().
                  where('id', form.credit_account_id).
                  orWhere('id', form.debit_account_id));case 7:foundAccounts = _context4.sent;

                creditAccount = foundAccounts.find(function (a) {return a.id === form.credit_account_id;});
                debitAccount = foundAccounts.find(function (a) {return a.id === form.debit_account_id;});

                if (!creditAccount) {
                  errorReasons.push({ type: 'CREDIT_ACCOUNT.NOT.EXIST', code: 100 });
                }
                if (!debitAccount) {
                  errorReasons.push({ type: 'DEBIT_ACCOUNT.NOT.EXIST', code: 200 });
                }if (!(
                errorReasons.length > 0)) {_context4.next = 14;break;}return _context4.abrupt("return",
                res.status(400).send({ errors: errorReasons }));case 14:return _context4.abrupt("return",









                res.status(200).send());case 15:case "end":return _context4.stop();}}}, _callee4);}));function handler(_x7, _x8) {return _handler4.apply(this, arguments);}return handler;}() } });

/***/ }),

/***/ "./src/http/controllers/Accounts.js":
/*!******************************************!*\
  !*** ./src/http/controllers/Accounts.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "@babel/runtime/helpers/slicedToArray");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! express-validator */ "express-validator");
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(express_validator__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/http/middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
/* harmony import */ var _models_Account__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/models/Account */ "./src/models/Account.js");
/* harmony import */ var _models_AccountType__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/models/AccountType */ "./src/models/AccountType.js");
/* harmony import */ var _models_AccountTransaction__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/models/AccountTransaction */ "./src/models/AccountTransaction.js");
/* harmony import */ var _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/services/Accounting/JournalPoster */ "./src/services/Accounting/JournalPoster.js");
/* harmony import */ var _models_AccountBalance__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/models/AccountBalance */ "./src/models/AccountBalance.js");
/* harmony import */ var _http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @/http/middleware/jwtAuth */ "./src/http/middleware/jwtAuth.js");
/* harmony import */ var _collection_NestedSet__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../collection/NestedSet */ "./src/collection/NestedSet/index.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}










/* harmony default export */ __webpack_exports__["default"] = ({
  /**
                  * Router constructor method.
                  */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_4___default.a.Router();

    router.use(_http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_12__["default"]);
    router.post('/',
    this.newAccount.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.newAccount.handler));

    router.post('/:id',
    this.editAccount.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.editAccount.handler));

    router.get('/:id',
    this.getAccount.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.getAccount.handler));

    router.get('/',
    this.getAccountsList.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.getAccountsList.handler));

    router["delete"]('/:id',
    this.deleteAccount.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.deleteAccount.handler));

    router.post('/:id/active',
    this.activeAccount.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.activeAccount.handler));

    router.post('/:id/inactive',
    this.inactiveAccount.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.inactiveAccount.handler));

    router.post('/:id/recalculate-balance',
    this.recalcualteBalanace.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.recalcualteBalanace.handler));

    router.post('/:id/transfer_account/:toAccount',
    this.transferToAnotherAccount.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.transferToAnotherAccount.handler));

    return router;
  },

  /**
      * Creates a new account.
      */
  newAccount: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('name').exists().isLength({ min: 3 }).trim().escape(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('code').exists().isLength({ max: 10 }).trim().escape(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('account_type_id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('description').optional().trim().escape()],

    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(req, res) {var validationErrors, form, foundAccountCodePromise, foundAccountTypePromise, _ref, _ref2, foundAccountCode, foundAccountType;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context.next = 3;break;}return _context.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                form = _objectSpread({}, req.body);

                foundAccountCodePromise = form.code ?
                _models_Account__WEBPACK_IMPORTED_MODULE_7__["default"].query().where('code', form.code) : null;

                foundAccountTypePromise = _models_AccountType__WEBPACK_IMPORTED_MODULE_8__["default"].query().
                findById(form.account_type_id);_context.next = 8;return (

                  Promise.all([
                  foundAccountCodePromise, foundAccountTypePromise]));case 8:_ref = _context.sent;_ref2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_ref, 2);foundAccountCode = _ref2[0];foundAccountType = _ref2[1];if (!(


                foundAccountCodePromise && foundAccountCode.length > 0)) {_context.next = 14;break;}return _context.abrupt("return",
                res.boom.badRequest(null, {
                  errors: [{ type: 'NOT_UNIQUE_CODE', code: 100 }] }));case 14:if (


                foundAccountType) {_context.next = 16;break;}return _context.abrupt("return",
                res.boom.badRequest(null, {
                  errors: [{ type: 'NOT_EXIST_ACCOUNT_TYPE', code: 200 }] }));case 16:_context.next = 18;return (


                  _models_Account__WEBPACK_IMPORTED_MODULE_7__["default"].query().insert(_objectSpread({}, form)));case 18:return _context.abrupt("return",

                res.status(200).send({ item: {} }));case 19:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                          * Edit the given account details.
                                                                                                                                                                                                          */
  editAccount: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["param"])('id').exists().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('name').exists().isLength({ min: 3 }).trim().escape(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('code').exists().isLength({ max: 10 }).trim().escape(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('account_type_id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('description').optional().trim().escape()],

    handler: function () {var _handler2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(req, res) {var id, validationErrors, form, account, foundAccountCodePromise, foundAccountTypePromise, _ref3, _ref4, foundAccountCode, foundAccountType;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                id = req.params.id;
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context2.next = 4;break;}return _context2.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 4:


                form = _objectSpread({}, req.body);_context2.next = 7;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_7__["default"].query().findById(id));case 7:account = _context2.sent;if (

                account) {_context2.next = 10;break;}return _context2.abrupt("return",
                res.boom.notFound());case 10:

                foundAccountCodePromise = form.code && form.code !== account.code ?
                _models_Account__WEBPACK_IMPORTED_MODULE_7__["default"].query().where('code', form.code).whereNot('id', account.id) : null;

                foundAccountTypePromise = form.account_type_id !== account.account_type_id ?
                _models_AccountType__WEBPACK_IMPORTED_MODULE_8__["default"].query().where('id', form.account_type_id) : null;_context2.next = 14;return (

                  Promise.all([
                  foundAccountCodePromise, foundAccountTypePromise]));case 14:_ref3 = _context2.sent;_ref4 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_ref3, 2);foundAccountCode = _ref4[0];foundAccountType = _ref4[1];if (!(

                foundAccountCode.length > 0 && foundAccountCodePromise)) {_context2.next = 20;break;}return _context2.abrupt("return",
                res.boom.badRequest(null, {
                  errors: [{ type: 'NOT_UNIQUE_CODE', code: 100 }] }));case 20:if (!(


                foundAccountType.length <= 0 && foundAccountTypePromise)) {_context2.next = 22;break;}return _context2.abrupt("return",
                res.boom.badRequest(null, {
                  errors: [{ type: 'NOT_EXIST_ACCOUNT_TYPE', code: 110 }] }));case 22:_context2.next = 24;return (


                  account.patch(_objectSpread({}, form)));case 24:return _context2.abrupt("return",

                res.status(200).send());case 25:case "end":return _context2.stop();}}}, _callee2);}));function handler(_x3, _x4) {return _handler2.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                  * Get details of the given account.
                                                                                                                                                                                                  */
  getAccount: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["param"])('id').toInt()],

    handler: function () {var _handler3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(req, res) {var id, account;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                id = req.params.id;_context3.next = 3;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_7__["default"].where('id', id).fetch());case 3:account = _context3.sent;if (

                account) {_context3.next = 6;break;}return _context3.abrupt("return",
                res.boom.notFound());case 6:return _context3.abrupt("return",

                res.status(200).send({ item: _objectSpread({}, account.attributes) }));case 7:case "end":return _context3.stop();}}}, _callee3);}));function handler(_x5, _x6) {return _handler3.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                                                * Delete the given account.
                                                                                                                                                                                                                                                */
  deleteAccount: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["param"])('id').toInt()],

    handler: function () {var _handler4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(req, res) {var id, account, accountTransactions;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                id = req.params.id;_context4.next = 3;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_7__["default"].query().findById(id));case 3:account = _context4.sent;if (

                account) {_context4.next = 6;break;}return _context4.abrupt("return",
                res.boom.notFound());case 6:_context4.next = 8;return (

                  _models_AccountTransaction__WEBPACK_IMPORTED_MODULE_9__["default"].query().
                  where('account_id', account.id));case 8:accountTransactions = _context4.sent;if (!(

                accountTransactions.length > 0)) {_context4.next = 11;break;}return _context4.abrupt("return",
                res.boom.badRequest(null, {
                  errors: [{ type: 'ACCOUNT.HAS.ASSOCIATED.TRANSACTIONS', code: 100 }] }));case 11:_context4.next = 13;return (


                  _models_Account__WEBPACK_IMPORTED_MODULE_7__["default"].query().deleteById(account.id));case 13:return _context4.abrupt("return",

                res.status(200).send());case 14:case "end":return _context4.stop();}}}, _callee4);}));function handler(_x7, _x8) {return _handler4.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                  * Retrieve accounts list.
                                                                                                                                                                                                  */
  getAccountsList: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('account_types').optional().isArray(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('account_types.*').optional().isNumeric().toInt()],

    handler: function () {var _handler5 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee5(req, res) {var validationErrors, form, accounts, accountsNestedSet;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context5.next = 3;break;}return _context5.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:



                form = _objectSpread({
                  account_types: [] },
                req.body);_context5.next = 6;return (

                  _models_Account__WEBPACK_IMPORTED_MODULE_7__["default"].query().
                  modify('filterAccountTypes', form.account_types));case 6:accounts = _context5.sent;

                accountsNestedSet = new _collection_NestedSet__WEBPACK_IMPORTED_MODULE_13__["default"](accounts, {
                  parentId: 'parentAccountId' });return _context5.abrupt("return",


                res.status(200).send({
                  // ...accountsNestedSet.toArray(),
                }));case 9:case "end":return _context5.stop();}}}, _callee5);}));function handler(_x9, _x10) {return _handler5.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                              * Re-calculates balance of the given account.
                                                                                                                                                                              */
  recalcualteBalanace: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["param"])('id').isNumeric().toInt()],

    handler: function () {var _handler6 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee6(req, res) {var id, account, accountTransactions, journalEntries;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:
                id = req.params.id;_context6.next = 3;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_7__["default"].findById(id));case 3:account = _context6.sent;if (

                account) {_context6.next = 6;break;}return _context6.abrupt("return",
                res.status(400).send({
                  errors: [{ type: 'ACCOUNT.NOT.FOUND', code: 100 }] }));case 6:


                accountTransactions = _models_AccountTransaction__WEBPACK_IMPORTED_MODULE_9__["default"].query().
                where('account_id', account.id);

                journalEntries = new _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_10__["default"]();
                journalEntries.loadFromCollection(accountTransactions);

                // Delete the balance of the given account id.
                _context6.next = 11;return _models_AccountBalance__WEBPACK_IMPORTED_MODULE_11__["default"].query().where('account_id', account.id)["delete"]();case 11:_context6.next = 13;return (


                  journalEntries.saveBalance());case 13:return _context6.abrupt("return",

                res.status(200).send());case 14:case "end":return _context6.stop();}}}, _callee6);}));function handler(_x11, _x12) {return _handler6.apply(this, arguments);}return handler;}() },




  activeAccount: {
    validation: [],


    handler: function () {var _handler7 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee7(req, res) {return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:case "end":return _context7.stop();}}}, _callee7);}));function handler(_x13, _x14) {return _handler7.apply(this, arguments);}return handler;}() },




  inactiveAccount: {
    validation: [],
    handler: function () {var _handler8 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee8(req, res) {return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee8$(_context8) {while (1) {switch (_context8.prev = _context8.next) {case 0:case "end":return _context8.stop();}}}, _callee8);}));function handler(_x15, _x16) {return _handler8.apply(this, arguments);}return handler;}() },




  transferToAnotherAccount: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["param"])('id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["param"])('toAccount').exists().isNumeric().toInt()],

    handler: function () {var _handler9 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee9(req, res) {return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee9$(_context9) {while (1) {switch (_context9.prev = _context9.next) {case 0:case "end":return _context9.stop();}}}, _callee9);}));function handler(_x17, _x18) {return _handler9.apply(this, arguments);}return handler;}() } });

/***/ }),

/***/ "./src/http/controllers/Authentication.js":
/*!************************************************!*\
  !*** ./src/http/controllers/Authentication.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! express-validator */ "express-validator");
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(express_validator__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var mustache__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! mustache */ "mustache");
/* harmony import */ var mustache__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(mustache__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
/* harmony import */ var _models_User__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/models/User */ "./src/models/User.js");
/* harmony import */ var _models_PasswordReset__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/models/PasswordReset */ "./src/models/PasswordReset.js");
/* harmony import */ var _services_mail__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @/services/mail */ "./src/services/mail.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @/utils */ "./src/utils/index.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}












/* harmony default export */ __webpack_exports__["default"] = ({
  /**
                  * Constructor method.
                  */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_3___default.a.Router();

    router.post('/login',
    this.login.validation,
    Object(_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_9__["default"])(this.login.handler));

    router.post('/send_reset_password',
    this.sendResetPassword.validation,
    Object(_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_9__["default"])(this.sendResetPassword.handler));

    router.post('/reset/:token',
    this.resetPassword.validation,
    Object(_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_9__["default"])(this.resetPassword.handler));

    return router;
  },

  /**
      * User login authentication request.
      */
  login: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('crediential').exists().isEmail(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('password').exists().isLength({ min: 5 })],

    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(req, res) {var validationErrors, _req$body, crediential, password, JWT_SECRET_KEY, user, token;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context.next = 3;break;}return _context.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:_req$body =


                req.body, crediential = _req$body.crediential, password = _req$body.password;
                JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;_context.next = 7;return (

                  _models_User__WEBPACK_IMPORTED_MODULE_10__["default"].query().
                  where('email', crediential).
                  orWhere('phone_number', crediential).
                  first());case 7:user = _context.sent;if (

                user) {_context.next = 10;break;}return _context.abrupt("return",
                res.boom.badRequest(null, {
                  errors: [{ type: 'INVALID_DETAILS', code: 100 }] }));case 10:if (


                user.verifyPassword(password)) {_context.next = 12;break;}return _context.abrupt("return",
                res.boom.badRequest(null, {
                  errors: [{ type: 'INCORRECT_PASSWORD', code: 110 }] }));case 12:if (


                user.active) {_context.next = 14;break;}return _context.abrupt("return",
                res.boom.badRequest(null, {
                  errors: [{ type: 'USER_INACTIVE', code: 120 }] }));case 14:


                // user.update({ last_login_at: new Date() });

                token = jsonwebtoken__WEBPACK_IMPORTED_MODULE_8___default.a.sign({
                  email: user.email,
                  _id: user.id },
                JWT_SECRET_KEY, {
                  expiresIn: '1d' });return _context.abrupt("return",

                res.status(200).send({ token: token }));case 16:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                              * Send reset password link via email or SMS.
                                                                                                                                                                                                              */
  sendResetPassword: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('email').exists().isEmail()],

    // eslint-disable-next-line consistent-return
    handler: function () {var _handler2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(req, res) {var validationErrors, email, user, passwordReset, filePath, template, rendered, mailOptions;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context2.next = 3;break;}return _context2.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                email = req.body.email;_context2.next = 6;return (
                  _models_User__WEBPACK_IMPORTED_MODULE_10__["default"].where('email', email).fetch());case 6:user = _context2.sent;if (

                user) {_context2.next = 9;break;}return _context2.abrupt("return",
                res.status(422).send());case 9:_context2.next = 11;return (


                  _models_PasswordReset__WEBPACK_IMPORTED_MODULE_11__["default"].where({ email: email }).destroy({ require: false }));case 11:

                passwordReset = _models_PasswordReset__WEBPACK_IMPORTED_MODULE_11__["default"].forge({
                  email: email,
                  token: '123123' });_context2.next = 14;return (

                  passwordReset.save());case 14:

                filePath = path__WEBPACK_IMPORTED_MODULE_5___default.a.join(__dirname, '../../views/mail/ResetPassword.html');
                template = fs__WEBPACK_IMPORTED_MODULE_6___default.a.readFileSync(filePath, 'utf8');
                rendered = mustache__WEBPACK_IMPORTED_MODULE_7___default.a.render(template, {
                  url: "".concat(req.protocol, "://").concat(req.hostname, "/reset/").concat(passwordReset.attributes.token),
                  first_name: user.attributes.first_name,
                  last_name: user.attributes.last_name,
                  contact_us_email: process.env.CONTACT_US_EMAIL });


                mailOptions = {
                  to: user.attributes.email,
                  from: "".concat(process.env.MAIL_FROM_NAME, " ").concat(process.env.MAIL_FROM_ADDRESS),
                  subject: 'Ratteb Password Reset',
                  html: rendered };


                // eslint-disable-next-line consistent-return
                _services_mail__WEBPACK_IMPORTED_MODULE_12__["default"].sendMail(mailOptions, function (error) {
                  if (error) {
                    return res.status(400).send();
                  }
                  res.status(200).send({ data: { email: passwordReset.attributes.email } });
                });case 19:case "end":return _context2.stop();}}}, _callee2);}));function handler(_x3, _x4) {return _handler2.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                             * Reset password.
                                                                                                                                                                             */
  resetPassword: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('password').exists().isLength({ min: 5 }).custom(function (value, _ref) {var req = _ref.req;
      if (value !== req.body.confirm_password) {
        throw new Error("Passwords don't match");
      } else {
        return value;
      }
    })],

    handler: function () {var _handler3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(req, res) {var validationErrors, token, password, tokenModel, user, hashedPassword;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context3.next = 3;break;}return _context3.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'VALIDATION_ERROR' }, validationErrors)));case 3:


                token = req.params.token;
                password = req.body.password;_context3.next = 7;return (

                  _models_PasswordReset__WEBPACK_IMPORTED_MODULE_11__["default"].query().
                  where('token', token).
                  where('created_at', '>=', Date.now() - 3600000).
                  first());case 7:tokenModel = _context3.sent;if (

                tokenModel) {_context3.next = 10;break;}return _context3.abrupt("return",
                res.boom.badRequest(null, {
                  errors: [{ type: 'TOKEN_INVALID', code: 100 }] }));case 10:_context3.next = 12;return (


                  _models_User__WEBPACK_IMPORTED_MODULE_10__["default"].where({
                    email: tokenModel.email }));case 12:user = _context3.sent;if (

                user) {_context3.next = 15;break;}return _context3.abrupt("return",
                res.boom.badRequest(null, {
                  errors: [{ type: 'USER_NOT_FOUND', code: 120 }] }));case 15:_context3.next = 17;return (


                  Object(_utils__WEBPACK_IMPORTED_MODULE_13__["hashPassword"])(password));case 17:hashedPassword = _context3.sent;

                user.password = hashedPassword;_context3.next = 21;return (
                  user.save());case 21:_context3.next = 23;return (

                  _models_PasswordReset__WEBPACK_IMPORTED_MODULE_11__["default"].where('email', user.get('email')).destroy({ require: false }));case 23:return _context3.abrupt("return",

                res.status(200).send({}));case 24:case "end":return _context3.stop();}}}, _callee3);}));function handler(_x5, _x6) {return _handler3.apply(this, arguments);}return handler;}() } });
/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./src/http/controllers/Bills.js":
/*!***************************************!*\
  !*** ./src/http/controllers/Bills.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);


/* harmony default export */ __webpack_exports__["default"] = ({

  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();

    return router;
  } });

/***/ }),

/***/ "./src/http/controllers/Budget.js":
/*!****************************************!*\
  !*** ./src/http/controllers/Budget.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "@babel/runtime/helpers/slicedToArray");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! express-validator */ "express-validator");
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(express_validator__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/http/middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
/* harmony import */ var _http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/http/middleware/jwtAuth */ "./src/http/middleware/jwtAuth.js");
/* harmony import */ var _models_Budget__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/models/Budget */ "./src/models/Budget.js");
/* harmony import */ var _models_BudgetEntry__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/models/BudgetEntry */ "./src/models/BudgetEntry.js");
/* harmony import */ var _models_Account__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/models/Account */ "./src/models/Account.js");
/* harmony import */ var _services_Moment__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @/services/Moment */ "./src/services/Moment/index.js");
/* harmony import */ var _collection_BudgetEntriesSet__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @/collection/BudgetEntriesSet */ "./src/collection/BudgetEntriesSet.js");
/* harmony import */ var _models_AccountType__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @/models/AccountType */ "./src/models/AccountType.js");
/* harmony import */ var _collection_NestedSet__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @/collection/NestedSet */ "./src/collection/NestedSet/index.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}












var formatParse = function formatParse(rangeType) {
  switch (rangeType) {
    case 'year':
      return 'YYYY';
    case 'month':
    case 'quarter':
    default:
      return 'YYYY-MM';}

};

/* harmony default export */ __webpack_exports__["default"] = ({
  /**
                  * Router constructor.
                  */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_4___default.a.Router();

    router.use(_http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_8__["default"]);

    router.post('/',
    this.newBudget.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(this.newBudget.handler));

    router.get('/:id',
    this.getBudget.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(this.getBudget.handler));

    router.get('/:id',
    this.deleteBudget.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(this.deleteBudget.handler));

    router.get('/',
    this.listBudgets.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(this.listBudgets.handler));

    return router;
  },

  /**
      * Retrieve budget details of the given id.
      */
  getBudget: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["param"])('id').exists().isNumeric().toInt()],

    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(req, res) {var validationErrors, id, budget, accountTypes, _ref, _ref2, budgetEntries, accounts, accountsNestedSet, columns, fromDate, toDate, dateRange, dateRangeCollection, budgetEntriesSet;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context.next = 3;break;}return _context.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                id = req.params.id;_context.next = 6;return (
                  _models_Budget__WEBPACK_IMPORTED_MODULE_9__["default"].query().findById(id));case 6:budget = _context.sent;if (

                budget) {_context.next = 9;break;}return _context.abrupt("return",
                res.status(404).send({
                  errors: [{ type: 'budget.not.found', code: 100 }] }));case 9:_context.next = 11;return (



                  _models_AccountType__WEBPACK_IMPORTED_MODULE_14__["default"].query().where('balance_sheet', true));case 11:accountTypes = _context.sent;_context.next = 14;return (

                  Promise.all([
                  _models_BudgetEntry__WEBPACK_IMPORTED_MODULE_10__["default"].query().where('budget_id', budget.id),
                  _models_Account__WEBPACK_IMPORTED_MODULE_11__["default"].query().whereIn('account_type_id', accountTypes.map(function (a) {return a.id;}))]));case 14:_ref = _context.sent;_ref2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_ref, 2);budgetEntries = _ref2[0];accounts = _ref2[1];


                accountsNestedSet = new _collection_NestedSet__WEBPACK_IMPORTED_MODULE_15__["default"](accounts);

                columns = [];
                fromDate = Object(_services_Moment__WEBPACK_IMPORTED_MODULE_12__["default"])(budget.year).startOf('year').
                add(budget.rangeOffset, budget.rangeBy).toDate();

                toDate = Object(_services_Moment__WEBPACK_IMPORTED_MODULE_12__["default"])(budget.year).endOf('year').toDate();

                dateRange = _services_Moment__WEBPACK_IMPORTED_MODULE_12__["default"].range(fromDate, toDate);
                dateRangeCollection = Array.from(dateRange.by(budget.rangeBy, {
                  step: budget.rangeIncrement, excludeEnd: false, excludeStart: false }));


                dateRangeCollection.forEach(function (date) {
                  columns.push(date.format(formatParse(budget.rangeBy)));
                });
                budgetEntriesSet = _collection_BudgetEntriesSet__WEBPACK_IMPORTED_MODULE_13__["default"].from(budgetEntries, {
                  orderSize: columns.length });

                budgetEntriesSet.setZeroPlaceholder();
                budgetEntriesSet.calcTotalSummary();return _context.abrupt("return",

                res.status(200).send({
                  columns: columns,
                  accounts: budgetEntriesSet.toArray(),
                  total: budgetEntriesSet.toArrayTotalSummary() }));case 29:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },




  /**
                                                                                                                                                                                                                          * Delete the given budget.
                                                                                                                                                                                                                          */
  deleteBudget: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["param"])('id').exists()],

    handler: function () {var _handler2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(req, res) {var validationErrors, id, budget;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context2.next = 3;break;}return _context2.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:



                id = req.params.id;_context2.next = 6;return (
                  _models_Budget__WEBPACK_IMPORTED_MODULE_9__["default"].query().findById(id));case 6:budget = _context2.sent;if (

                budget) {_context2.next = 9;break;}return _context2.abrupt("return",
                res.status(404).send({
                  errors: [{ type: 'budget.not.found', code: 100 }] }));case 9:_context2.next = 11;return (


                  _models_BudgetEntry__WEBPACK_IMPORTED_MODULE_10__["default"].query().where('budget_id', budget.id)["delete"]());case 11:_context2.next = 13;return (
                  budget["delete"]());case 13:return _context2.abrupt("return",

                res.status(200).send());case 14:case "end":return _context2.stop();}}}, _callee2);}));function handler(_x3, _x4) {return _handler2.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                  * Saves the new budget.
                                                                                                                                                                                                  */
  newBudget: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('name').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('fiscal_year').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('period').exists().isIn(['year', 'month', 'quarter', 'half-year']),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('accounts_type').exists().isIn(['balance_sheet', 'profit_loss']),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('accounts').isArray(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('accounts.*.account_id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('accounts.*.entries').exists().isArray(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('accounts.*.entries.*.amount').exists().isNumeric().toFloat(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('accounts.*.entries.*.order').exists().isNumeric().toInt()],

    handler: function () {var _handler3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(req, res) {var validationErrors, form, submitAccountsIds, storedAccounts, storedAccountsIds, errorReasons, notFoundAccountsIds, budget, promiseOpers;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context3.next = 3;break;}return _context3.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:



                form = _objectSpread({}, req.body);
                submitAccountsIds = form.accounts.map(function (a) {return a.account_id;});_context3.next = 7;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_11__["default"].query().whereIn('id', submitAccountsIds));case 7:storedAccounts = _context3.sent;
                storedAccountsIds = storedAccounts.map(function (a) {return a.id;});

                errorReasons = [];
                notFoundAccountsIds = Object(lodash__WEBPACK_IMPORTED_MODULE_6__["difference"])(submitAccountsIds, storedAccountsIds);

                if (notFoundAccountsIds.length > 0) {
                  errorReasons.push({
                    type: 'ACCOUNT.NOT.FOUND', code: 200, accounts: notFoundAccountsIds });

                }if (!(
                errorReasons.length > 0)) {_context3.next = 14;break;}return _context3.abrupt("return",
                res.status(400).send({ errors: errorReasons }));case 14:_context3.next = 16;return (


                  _models_Budget__WEBPACK_IMPORTED_MODULE_9__["default"].query().insert(_objectSpread({},
                  Object(lodash__WEBPACK_IMPORTED_MODULE_6__["pick"])(form, ['name', 'fiscal_year', 'period', 'accounts_type']))));case 16:budget = _context3.sent;


                promiseOpers = [];

                form.accounts.forEach(function (account) {
                  account.entries.forEach(function (entry) {
                    var budgetEntry = _models_BudgetEntry__WEBPACK_IMPORTED_MODULE_10__["default"].query().insert({
                      account_id: account.account_id,
                      amount: entry.amount,
                      order: entry.order });

                    promiseOpers.push(budgetEntry);
                  });
                });_context3.next = 21;return (
                  Promise.all(promiseOpers));case 21:return _context3.abrupt("return",

                res.status(200).send({ id: budget.id }));case 22:case "end":return _context3.stop();}}}, _callee3);}));function handler(_x5, _x6) {return _handler3.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                   * List of paginated budgets items.
                                                                                                                                                                                                                   */
  listBudgets: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('year').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('income_statement').optional().isBoolean().toBoolean(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('profit_loss').optional().isBoolean().toBoolean(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('page').isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('page_size').isNumeric().toInt()],

    handler: function () {var _handler4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(req, res) {var validationErrors, filter, budgets;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context4.next = 3;break;}return _context4.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:



                filter = _objectSpread({
                  page_size: 10,
                  page: 1 },
                req.query);_context4.next = 6;return (

                  _models_Budget__WEBPACK_IMPORTED_MODULE_9__["default"].query().
                  modify('filterByYear', filter.year).
                  modify('filterByIncomeStatement', filter.income_statement).
                  modify('filterByProfitLoss', filter.profit_loss).
                  page(filter.page, filter.page_size));case 6:budgets = _context4.sent;return _context4.abrupt("return",

                res.status(200).send({
                  items: budgets.items }));case 8:case "end":return _context4.stop();}}}, _callee4);}));function handler(_x7, _x8) {return _handler4.apply(this, arguments);}return handler;}() } });

/***/ }),

/***/ "./src/http/controllers/CurrencyAdjustment.js":
/*!****************************************************!*\
  !*** ./src/http/controllers/CurrencyAdjustment.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);

/* harmony default export */ __webpack_exports__["default"] = ({

  addExchangePrice: {
    validation: {},


    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(req, res) {return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() } });

/***/ }),

/***/ "./src/http/controllers/Customers.js":
/*!*******************************************!*\
  !*** ./src/http/controllers/Customers.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);


/* harmony default export */ __webpack_exports__["default"] = ({

  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();

    return router;
  } });

/***/ }),

/***/ "./src/http/controllers/Expenses.js":
/*!******************************************!*\
  !*** ./src/http/controllers/Expenses.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "@babel/runtime/helpers/slicedToArray");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! express-validator */ "express-validator");
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(express_validator__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/http/middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
/* harmony import */ var _models_Expense__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/models/Expense */ "./src/models/Expense.js");
/* harmony import */ var _models_Account__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/models/Account */ "./src/models/Account.js");
/* harmony import */ var _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/services/Accounting/JournalPoster */ "./src/services/Accounting/JournalPoster.js");
/* harmony import */ var _services_Accounting_JournalEntry__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @/services/Accounting/JournalEntry */ "./src/services/Accounting/JournalEntry.js");
/* harmony import */ var _http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @/http/middleware/jwtAuth */ "./src/http/middleware/jwtAuth.js");
/* harmony import */ var _models_AccountTransaction__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @/models/AccountTransaction */ "./src/models/AccountTransaction.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}











/* harmony default export */ __webpack_exports__["default"] = ({
  /**
                  * Router constructor.
                  */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_4___default.a.Router();
    router.use(_http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_13__["default"]);

    router.post('/',
    this.newExpense.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_8__["default"])(this.newExpense.handler));

    router["delete"]('/:id',
    this.deleteExpense.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_8__["default"])(this.deleteExpense.handler));

    router.post('/bulk',
    this.bulkAddExpenses.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_8__["default"])(this.bulkAddExpenses.handler));

    router.post('/:id',
    this.updateExpense.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_8__["default"])(this.updateExpense.handler));

    return router;
  },

  /**
      * Saves a new expense.
      */
  newExpense: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('date').optional().isISO8601(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('payment_account_id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('expense_account_id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('description').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('amount').exists().isNumeric().toFloat(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('currency_code').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('exchange_rate').optional().isNumeric().toFloat()],

    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee(req, res) {var validationErrors, form, errorReasons, paymentAccount, expenseAccount, expenseTransaction, journalEntries, creditEntry, debitEntry;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context.next = 3;break;}return _context.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                form = _objectSpread({
                  date: new Date() },
                req.body);

                // Convert the date to the general format.
                form.date = moment__WEBPACK_IMPORTED_MODULE_6___default()(form.date).format('YYYY-MM-DD');

                errorReasons = [];_context.next = 8;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_10__["default"].query().
                  findById(form.payment_account_id).first());case 8:paymentAccount = _context.sent;

                if (!paymentAccount) {
                  errorReasons.push({ type: 'PAYMENT.ACCOUNT.NOT.FOUND', code: 100 });
                }_context.next = 12;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_10__["default"].query().
                  findById(form.expense_account_id).first());case 12:expenseAccount = _context.sent;

                if (!expenseAccount) {
                  errorReasons.push({ type: 'EXPENSE.ACCOUNT.NOT.FOUND', code: 200 });
                }if (!(
                errorReasons.length > 0)) {_context.next = 16;break;}return _context.abrupt("return",
                res.status(400).send({ errors: errorReasons }));case 16:_context.next = 18;return (

                  _models_Expense__WEBPACK_IMPORTED_MODULE_9__["default"].query().insert(_objectSpread({}, form)));case 18:expenseTransaction = _context.sent;

                journalEntries = new _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_11__["default"]();
                creditEntry = new _services_Accounting_JournalEntry__WEBPACK_IMPORTED_MODULE_12__["default"]({
                  credit: form.amount,
                  referenceId: expenseTransaction.id,
                  referenceType: _models_Expense__WEBPACK_IMPORTED_MODULE_9__["default"].referenceType,
                  date: form.date,
                  account: expenseAccount.id,
                  accountNormal: 'debit' });

                debitEntry = new _services_Accounting_JournalEntry__WEBPACK_IMPORTED_MODULE_12__["default"]({
                  debit: form.amount,
                  referenceId: expenseTransaction.id,
                  referenceType: _models_Expense__WEBPACK_IMPORTED_MODULE_9__["default"].referenceType,
                  date: form.date,
                  account: paymentAccount.id,
                  accountNormal: 'debit' });

                journalEntries.credit(creditEntry);
                journalEntries.debit(debitEntry);_context.next = 26;return (

                  Promise.all([
                  journalEntries.saveEntries(),
                  journalEntries.saveBalance()]));case 26:return _context.abrupt("return",

                res.status(200).send({ id: expenseTransaction.id }));case 27:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                           * Bulk add expneses to the given accounts.
                                                                                                                                                                                                                           */
  bulkAddExpenses: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('expenses').exists().isArray({ min: 1 }),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('expenses.*.date').optional().isISO8601(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('expenses.*.payment_account_id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('expenses.*.expense_account_id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('expenses.*.description').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('expenses.*.amount').exists().isNumeric().toFloat(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('expenses.*.currency_code').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('expenses.*.exchange_rate').optional().isNumeric().toFloat()],

    handler: function () {var _handler2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee3(req, res) {var validationErrors, form, errorReasons, paymentAccountsIds, expenseAccountsIds, _ref, _ref2, expensesAccounts, paymentAccounts, storedExpensesAccountsIds, storedPaymentAccountsIds, notFoundPaymentAccountsIds, notFoundExpenseAccountsIds, expenseSaveOpers, journalPoster, savedExpenseTransactions;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context3.next = 3;break;}return _context3.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                form = _objectSpread({}, req.body);
                errorReasons = [];

                paymentAccountsIds = Object(lodash__WEBPACK_IMPORTED_MODULE_7__["chain"])(form.expenses).
                map(function (e) {return e.payment_account_id;}).uniq().value();
                expenseAccountsIds = Object(lodash__WEBPACK_IMPORTED_MODULE_7__["chain"])(form.expenses).
                map(function (e) {return e.expense_account_id;}).uniq().value();_context3.next = 9;return (

                  Promise.all([
                  _models_Account__WEBPACK_IMPORTED_MODULE_10__["default"].query().whereIn('id', expenseAccountsIds),
                  _models_Account__WEBPACK_IMPORTED_MODULE_10__["default"].query().whereIn('id', paymentAccountsIds)]));case 9:_ref = _context3.sent;_ref2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_ref, 2);expensesAccounts = _ref2[0];paymentAccounts = _ref2[1];

                storedExpensesAccountsIds = expensesAccounts.map(function (a) {return a.id;});
                storedPaymentAccountsIds = paymentAccounts.map(function (a) {return a.id;});

                notFoundPaymentAccountsIds = Object(lodash__WEBPACK_IMPORTED_MODULE_7__["difference"])(expenseAccountsIds, storedExpensesAccountsIds);
                notFoundExpenseAccountsIds = Object(lodash__WEBPACK_IMPORTED_MODULE_7__["difference"])(paymentAccountsIds, storedPaymentAccountsIds);

                if (notFoundPaymentAccountsIds.length > 0) {
                  errorReasons.push({
                    type: 'PAYMENY.ACCOUNTS.NOT.FOUND',
                    code: 100,
                    accounts: notFoundPaymentAccountsIds });

                }
                if (notFoundExpenseAccountsIds.length > 0) {
                  errorReasons.push({
                    type: 'EXPENSE.ACCOUNTS.NOT.FOUND',
                    code: 200,
                    accounts: notFoundExpenseAccountsIds });

                }if (!(
                errorReasons.length > 0)) {_context3.next = 21;break;}return _context3.abrupt("return",
                res.boom.badRequest(null, { reasons: errorReasons }));case 21:

                expenseSaveOpers = [];
                journalPoster = new _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_11__["default"]();

                form.expenses.forEach( /*#__PURE__*/function () {var _ref3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee2(expense) {var expenseSaveOper;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                            expenseSaveOper = _models_Expense__WEBPACK_IMPORTED_MODULE_9__["default"].query().insert(_objectSpread({}, expense));
                            expenseSaveOpers.push(expenseSaveOper);case 2:case "end":return _context2.stop();}}}, _callee2);}));return function (_x5) {return _ref3.apply(this, arguments);};}());

                // Wait unit save all expense transactions.
                _context3.next = 26;return Promise.all(expenseSaveOpers);case 26:savedExpenseTransactions = _context3.sent;

                savedExpenseTransactions.forEach(function (expense) {
                  var date = moment__WEBPACK_IMPORTED_MODULE_6___default()(expense.date).format('YYYY-DD-MM');

                  var debit = new _services_Accounting_JournalEntry__WEBPACK_IMPORTED_MODULE_12__["default"]({
                    debit: expense.amount,
                    referenceId: expense.id,
                    referenceType: _models_Expense__WEBPACK_IMPORTED_MODULE_9__["default"].referenceType,
                    account: expense.payment_account_id,
                    accountNormal: 'debit',
                    date: date });

                  var credit = new _services_Accounting_JournalEntry__WEBPACK_IMPORTED_MODULE_12__["default"]({
                    credit: expense.amount,
                    referenceId: expense.id,
                    referenceType: _models_Expense__WEBPACK_IMPORTED_MODULE_9__["default"].referenceId,
                    account: expense.expense_account_id,
                    accountNormal: 'debit',
                    date: date });

                  journalPoster.credit(credit);
                  journalPoster.debit(debit);
                });

                // Save expense journal entries and balance change.
                _context3.next = 30;return Promise.all([
                journalPoster.saveEntries(),
                journalPoster.saveBalance()]);case 30:return _context3.abrupt("return",

                res.status(200).send());case 31:case "end":return _context3.stop();}}}, _callee3);}));function handler(_x3, _x4) {return _handler2.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                  * Retrieve paginated expenses list.
                                                                                                                                                                                                  */
  listExpenses: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('expense_account_id').optional().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('payment_account_id').optional().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('note').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('range_from').optional().isNumeric().toFloat(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('range_to').optional().isNumeric().toFloat(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('date_from').optional().isISO8601(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('date_to').optional().isISO8601(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('column_sort_order').optional().isIn(['created_at', 'date', 'amount']),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('sort_order').optional().isIn(['desc', 'asc']),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('page').optional().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('page_size').optional().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('custom_view_id').optional().isNumeric().toInt()],

    handler: function () {var _handler3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee4(req, res) {var validationErrors, filter, expenses;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context4.next = 3;break;}return _context4.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                filter = _objectSpread({
                  page_size: 10,
                  page: 1 },
                req.query);_context4.next = 6;return (


                  _models_Expense__WEBPACK_IMPORTED_MODULE_9__["default"].query().
                  modify('filterByAmountRange', filter.range_from, filter.to_range).
                  modify('filterByDateRange', filter.date_from, filter.date_to).
                  modify('filterByExpenseAccount', filter.expense_account_id).
                  modify('filterByPaymentAccount', filter.payment_account_id).
                  modify('orderBy', filter.column_sort_order, filter.sort_order).
                  page(filter.page, filter.page_size));case 6:expenses = _context4.sent;case 7:case "end":return _context4.stop();}}}, _callee4);}));function handler(_x6, _x7) {return _handler3.apply(this, arguments);}return handler;}() },




  /**
                                                                                                                                                                                                                                                 * Delete the given account.
                                                                                                                                                                                                                                                 */
  deleteExpense: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["param"])('id').isNumeric().toInt()],

    handler: function () {var _handler4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee5(req, res) {var validationErrors, id, expenseTransaction, expenseEntries, expenseEntriesCollect;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context5.next = 3;break;}return _context5.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                id = req.params.id;_context5.next = 6;return (
                  _models_Expense__WEBPACK_IMPORTED_MODULE_9__["default"].query().findById(id));case 6:expenseTransaction = _context5.sent;if (

                expenseTransaction) {_context5.next = 9;break;}return _context5.abrupt("return",
                res.status(404).send({
                  errors: [{ type: 'EXPENSE.TRANSACTION.NOT.FOUND', code: 100 }] }));case 9:_context5.next = 11;return (


                  _models_AccountTransaction__WEBPACK_IMPORTED_MODULE_14__["default"].query().
                  where('reference_type', 'Expense').
                  where('reference_id', expenseTransaction.id));case 11:expenseEntries = _context5.sent;

                expenseEntriesCollect = new _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_11__["default"]();
                expenseEntriesCollect.loadEntries(expenseEntries);
                expenseEntriesCollect.reverseEntries();_context5.next = 17;return (

                  Promise.all([
                  expenseTransaction["delete"](),
                  expenseEntriesCollect.deleteEntries(),
                  expenseEntriesCollect.saveBalance()]));case 17:return _context5.abrupt("return",

                res.status(200).send());case 18:case "end":return _context5.stop();}}}, _callee5);}));function handler(_x8, _x9) {return _handler4.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                  * Update details of the given account.
                                                                                                                                                                                                  */
  updateExpense: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["param"])('id').isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('date').optional().isISO8601(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('payment_account_id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('expense_account_id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('description').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('amount').exists().isNumeric().toFloat(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('currency_code').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('exchange_rate').optional().isNumeric().toFloat()],

    handler: function () {var _handler5 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee6(req, res) {var validationErrors, id, expenseTransaction;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context6.next = 3;break;}return _context6.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                id = req.params.id;_context6.next = 6;return (
                  _models_Expense__WEBPACK_IMPORTED_MODULE_9__["default"].query().findById(id));case 6:expenseTransaction = _context6.sent;if (

                expenseTransaction) {_context6.next = 9;break;}return _context6.abrupt("return",
                res.status(404).send({
                  errors: [{ type: 'EXPENSE.TRANSACTION.NOT.FOUND', code: 100 }] }));case 9:case "end":return _context6.stop();}}}, _callee6);}));function handler(_x10, _x11) {return _handler5.apply(this, arguments);}return handler;}() } });

/***/ }),

/***/ "./src/http/controllers/Fields.js":
/*!****************************************!*\
  !*** ./src/http/controllers/Fields.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "@babel/runtime/helpers/toConsumableArray");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "@babel/runtime/helpers/typeof");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! express-validator */ "express-validator");
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(express_validator__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _models_ResourceField__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/models/ResourceField */ "./src/models/ResourceField.js");
/* harmony import */ var _models_Resource__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/models/Resource */ "./src/models/Resource.js");
/* harmony import */ var _middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}





/**
                                                              * Types of the custom fields.
                                                              */
var TYPES = ['text', 'email', 'number', 'url', 'percentage', 'checkbox', 'radio', 'textarea'];

/* harmony default export */ __webpack_exports__["default"] = ({
  /**
                  * Router constructor method.
                  */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_5___default.a.Router();

    router.post('/resource/:resource_id',
    this.addNewField.validation,
    Object(_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_9__["default"])(this.addNewField.handler));

    router.post('/:field_id',
    this.editField.validation,
    Object(_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_9__["default"])(this.editField.handler));

    router.post('/status/:field_id',
    this.changeStatus.validation,
    Object(_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_9__["default"])(this.changeStatus.handler));

    router.get('/:field_id',
    Object(_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_9__["default"])(this.getField.handler));

    router["delete"]('/:field_id',
    Object(_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_9__["default"])(this.deleteField.handler));

    return router;
  },

  /**
      * Adds a new field control to the given resource.
      * @param {Request} req -
      * @param {Response} res -
      */
  addNewField: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["param"])('resource_id').toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('label').exists().escape().trim(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('data_type').exists().isIn(TYPES),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('help_text').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('default').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('options').optional().isArray()],

    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee(req, res) {var resourceId, validationErrors, resource, _req$body, label, dataType, helpText, _req$body2, defaultValue, options, choices, field;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                resourceId = req.params.resource_id;
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context.next = 4;break;}return _context.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'VALIDATION_ERROR' }, validationErrors)));case 4:_context.next = 6;return (


                  _models_Resource__WEBPACK_IMPORTED_MODULE_8__["default"].where('id', resourceId).fetch());case 6:resource = _context.sent;if (

                resource) {_context.next = 9;break;}return _context.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'RESOURCE_NOT_FOUND', code: 100 }] }));case 9:_req$body =



                req.body, label = _req$body.label, dataType = _req$body.data_type, helpText = _req$body.help_text;_req$body2 =
                req.body, defaultValue = _req$body2["default"], options = _req$body2.options;

                choices = options.map(function (option, index) {return { key: index + 1, value: option };});

                field = _models_ResourceField__WEBPACK_IMPORTED_MODULE_7__["default"].forge({
                  data_type: dataType,
                  label_name: label,
                  help_text: helpText,
                  "default": defaultValue,
                  resource_id: resource.id,
                  options: choices });_context.next = 15;return (


                  field.save());case 15:return _context.abrupt("return",

                res.status(200).send());case 16:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                              * Edit details of the given field.
                                                                                                                                                                                              */
  editField: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["param"])('field_id').toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('label').exists().escape().trim(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('data_type').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('help_text').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('default').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('options').optional().isArray()],

    handler: function () {var _handler2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee2(req, res) {var fieldId, validationErrors, field, form, label, dataType, helpText, defaultValue, options, storedFieldOptions, lastChoiceIndex, savedOptionKeys, notSavedOptionsKeys, choices;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                fieldId = req.params.field_id;
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context2.next = 4;break;}return _context2.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'VALIDATION_ERROR' }, validationErrors)));case 4:_context2.next = 6;return (



                  _models_ResourceField__WEBPACK_IMPORTED_MODULE_7__["default"].where('id', fieldId).fetch());case 6:field = _context2.sent;if (

                field) {_context2.next = 9;break;}return _context2.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'FIELD_NOT_FOUND', code: 100 }] }));case 9:



                // Sets the default value of optional fields.
                form = _objectSpread({ options: [] }, req.body);

                label = form.label, dataType = form.data_type, helpText = form.help_text;
                defaultValue = form["default"], options = form.options;

                storedFieldOptions = field.attributes.options || [];
                lastChoiceIndex = 0;
                storedFieldOptions.forEach(function (option) {
                  var key = parseInt(option.key, 10);
                  if (key > lastChoiceIndex) {
                    lastChoiceIndex = key;
                  }
                });
                savedOptionKeys = options.filter(function (op) {return _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1___default()(op) === 'object';});
                notSavedOptionsKeys = options.filter(function (op) {return _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1___default()(op) !== 'object';});

                choices = [].concat(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(
                savedOptionKeys), _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(
                notSavedOptionsKeys.map(function (option) {
                  lastChoiceIndex += 1;
                  return { key: lastChoiceIndex, value: option };
                })));_context2.next = 20;return (


                  field.save({
                    data_type: dataType,
                    label_name: label,
                    help_text: helpText,
                    "default": defaultValue,
                    options: choices }));case 20:return _context2.abrupt("return",


                res.status(200).send({ id: field.get('id') }));case 21:case "end":return _context2.stop();}}}, _callee2);}));function handler(_x3, _x4) {return _handler2.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                         * Retrieve the fields list of the given resource.
                                                                                                                                                                                                                         * @param {Request} req -
                                                                                                                                                                                                                         * @param {Response} res -
                                                                                                                                                                                                                         */
  fieldsList: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["param"])('resource_id').toInt()],

    handler: function () {var _handler3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee3(req, res) {var resourceId, fields;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                resourceId = req.params.resource_id;_context3.next = 3;return (
                  _models_ResourceField__WEBPACK_IMPORTED_MODULE_7__["default"].where('resource_id', resourceId).fetchAll());case 3:fields = _context3.sent;return _context3.abrupt("return",

                res.status(200).send({ fields: fields.toJSON() }));case 5:case "end":return _context3.stop();}}}, _callee3);}));function handler(_x5, _x6) {return _handler3.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                            * Change status of the given field.
                                                                                                                                                                                                                            */
  changeStatus: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["param"])('field_id').toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('active').isBoolean().toBoolean()],

    handler: function () {var _handler4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee4(req, res) {var fieldId, field, active;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                fieldId = req.params.field_id;_context4.next = 3;return (
                  _models_ResourceField__WEBPACK_IMPORTED_MODULE_7__["default"].where('id', fieldId).fetch());case 3:field = _context4.sent;if (

                field) {_context4.next = 6;break;}return _context4.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'NOT_FOUND_FIELD', code: 100 }] }));case 6:



                active = req.body.active;_context4.next = 9;return (
                  field.save({ active: active }));case 9:return _context4.abrupt("return",

                res.status(200).send({ id: field.get('id') }));case 10:case "end":return _context4.stop();}}}, _callee4);}));function handler(_x7, _x8) {return _handler4.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                         * Retrieve details of the given field.
                                                                                                                                                                                                                         */
  getField: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["param"])('field_id').toInt()],

    handler: function () {var _handler5 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee5(req, res) {var id, field;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
                id = req.params.field_id;_context5.next = 3;return (
                  _models_ResourceField__WEBPACK_IMPORTED_MODULE_7__["default"].where('id', id).fetch());case 3:field = _context5.sent;if (

                field) {_context5.next = 6;break;}return _context5.abrupt("return",
                res.boom.notFound());case 6:return _context5.abrupt("return",


                res.status(200).send({
                  field: field.toJSON() }));case 7:case "end":return _context5.stop();}}}, _callee5);}));function handler(_x9, _x10) {return _handler5.apply(this, arguments);}return handler;}() },




  /**
                                                                                                                                                                                                      * Delete the given field.
                                                                                                                                                                                                      */
  deleteField: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["param"])('field_id').toInt()],

    handler: function () {var _handler6 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee6(req, res) {var id, field;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:
                id = req.params.field_id;_context6.next = 3;return (
                  _models_ResourceField__WEBPACK_IMPORTED_MODULE_7__["default"].where('id', id).fetch());case 3:field = _context6.sent;if (

                field) {_context6.next = 6;break;}return _context6.abrupt("return",
                res.boom.notFound());case 6:if (!

                field.attributes.predefined) {_context6.next = 8;break;}return _context6.abrupt("return",
                res.boom.badRequest(null, {
                  errors: [{ type: 'PREDEFINED_FIELD', code: 100 }] }));case 8:_context6.next = 10;return (



                  field.destroy());case 10:return _context6.abrupt("return",

                res.status(200).send({ id: field.get('id') }));case 11:case "end":return _context6.stop();}}}, _callee6);}));function handler(_x11, _x12) {return _handler6.apply(this, arguments);}return handler;}() } });

/***/ }),

/***/ "./src/http/controllers/FinancialStatements.js":
/*!*****************************************************!*\
  !*** ./src/http/controllers/FinancialStatements.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "@babel/runtime/helpers/toConsumableArray");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! express-validator */ "express-validator");
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(express_validator__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/http/middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
/* harmony import */ var _models_AccountTransaction__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/models/AccountTransaction */ "./src/models/AccountTransaction.js");
/* harmony import */ var _http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/http/middleware/jwtAuth */ "./src/http/middleware/jwtAuth.js");
/* harmony import */ var _models_AccountType__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/models/AccountType */ "./src/models/AccountType.js");
/* harmony import */ var _models_Account__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @/models/Account */ "./src/models/Account.js");
/* harmony import */ var _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @/services/Accounting/JournalPoster */ "./src/services/Accounting/JournalPoster.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @/utils */ "./src/utils/index.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}











var formatNumberClosure = function formatNumberClosure(filter) {return function (balance) {
    var formattedBalance = parseFloat(balance);

    if (filter.no_cents) {
      formattedBalance = parseInt(formattedBalance, 10);
    }
    if (filter.divide_1000) {
      formattedBalance /= 1000;
    }
    return formattedBalance;
  };};

/* harmony default export */ __webpack_exports__["default"] = ({
  /**
                  * Router constructor.
                  */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_4___default.a.Router();
    router.use(_http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_10__["default"]);

    router.get('/ledger',
    this.ledger.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_8__["default"])(this.ledger.handler));

    router.get('/general_ledger',
    this.generalLedger.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_8__["default"])(this.generalLedger.handler));

    router.get('/balance_sheet',
    this.balanceSheet.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_8__["default"])(this.balanceSheet.handler));

    router.get('/trial_balance_sheet',
    this.trialBalanceSheet.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_8__["default"])(this.trialBalanceSheet.handler));

    router.get('/profit_loss_sheet',
    this.profitLossSheet.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_8__["default"])(this.profitLossSheet.handler));

    // router.get('/cash_flow_statement',
    //   this.cashFlowStatement.validation,
    //   asyncMiddleware(this.cashFlowStatement.handler));

    // router.get('/badget_verses_actual',
    //   this.badgetVersesActuals.validation,
    //   asyncMiddleware(this.badgetVersesActuals.handler));

    return router;
  },

  /**
      * Retrieve the ledger report of the given account.
      */
  ledger: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('from_date').optional().isISO8601(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('to_date').optional().isISO8601(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('transaction_types').optional().isArray({ min: 1 }),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('account_ids').optional().isArray({ min: 1 }),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('account_ids.*').optional().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('from_range').optional().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('to_range').optional().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('number_format.no_cents').optional().isBoolean().toBoolean(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('number_format.divide_1000').optional().isBoolean().toBoolean()],

    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee(req, res) {var validationErrors, filter, accountsJournalEntries, formatNumber;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context.next = 3;break;}return _context.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                filter = _objectSpread({
                  from_range: null,
                  to_range: null,
                  account_ids: [],
                  transaction_types: [],
                  number_format: {
                    no_cents: false,
                    divide_1000: false } },

                req.query);_context.next = 6;return (

                  _models_AccountTransaction__WEBPACK_IMPORTED_MODULE_9__["default"].query().
                  modify('filterDateRange', filter.from_date, filter.to_date).
                  modify('filterAccounts', filter.account_ids).
                  modify('filterTransactionTypes', filter.transaction_types).
                  modify('filterAmountRange', filter.from_range, filter.to_range).
                  withGraphFetched('account'));case 6:accountsJournalEntries = _context.sent;

                formatNumber = formatNumberClosure(filter.number_format);return _context.abrupt("return",

                res.status(200).send({
                  meta: _objectSpread({}, filter),
                  items: accountsJournalEntries.map(function (entry) {return _objectSpread({},
                    entry, {
                      credit: formatNumber(entry.credit),
                      debit: formatNumber(entry.debit) });}) }));case 9:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },





  /**
                                                                                                                                                                                                                      * Retrieve the general ledger financial statement.
                                                                                                                                                                                                                      */
  generalLedger: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('from_date').optional().isISO8601(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('to_date').optional().isISO8601(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('basis').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('number_format.no_cents').optional().isBoolean().toBoolean(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('number_format.divide_1000').optional().isBoolean().toBoolean(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('none_zero').optional().isBoolean().toBoolean()],

    handler: function () {var _handler2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee2(req, res) {var validationErrors, filter, accounts, openingBalanceTransactions, closingBalanceTransactions, opeingBalanceCollection, closingBalanceCollection, formatNumber, items;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context2.next = 3;break;}return _context2.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                filter = _objectSpread({
                  from_date: moment__WEBPACK_IMPORTED_MODULE_6___default()().startOf('year').format('YYYY-MM-DD'),
                  to_date: moment__WEBPACK_IMPORTED_MODULE_6___default()().endOf('year').format('YYYY-MM-DD'),
                  number_format: {
                    no_cents: false,
                    divide_1000: false },

                  none_zero: false },
                req.query);_context2.next = 6;return (

                  _models_Account__WEBPACK_IMPORTED_MODULE_12__["default"].query().
                  orderBy('index', 'DESC').
                  withGraphFetched('transactions').
                  modifyGraph('transactions', function (builder) {
                    builder.modify('filterDateRange', filter.from_date, filter.to_date);
                  }));case 6:accounts = _context2.sent;_context2.next = 9;return (

                  _models_AccountTransaction__WEBPACK_IMPORTED_MODULE_9__["default"].query().
                  modify('filterDateRange', null, filter.from_date).
                  modify('sumationCreditDebit').
                  withGraphFetched('account.type'));case 9:openingBalanceTransactions = _context2.sent;_context2.next = 12;return (

                  _models_AccountTransaction__WEBPACK_IMPORTED_MODULE_9__["default"].query().
                  modify('filterDateRange', null, filter.to_date).
                  modify('sumationCreditDebit').
                  withGraphFetched('account.type'));case 12:closingBalanceTransactions = _context2.sent;

                opeingBalanceCollection = new _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_13__["default"]();
                closingBalanceCollection = new _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_13__["default"]();

                opeingBalanceCollection.loadEntries(openingBalanceTransactions);
                closingBalanceCollection.loadEntries(closingBalanceTransactions);

                // Transaction amount formatter based on the given query.
                formatNumber = formatNumberClosure(filter.number_format);

                items = _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(
                accounts.
                filter(function (account) {return (
                    account.transactions.length > 0 || !filter.none_zero);}).

                map(function (account) {return _objectSpread({},
                  Object(lodash__WEBPACK_IMPORTED_MODULE_7__["pick"])(account, ['id', 'name', 'code', 'index']), {
                    transactions: _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(
                    account.transactions.map(function (transaction) {return _objectSpread({},
                      transaction, {
                        credit: formatNumber(transaction.credit),
                        debit: formatNumber(transaction.debit) });})),


                    opening: {
                      date: filter.from_date,
                      balance: opeingBalanceCollection.getClosingBalance(account.id) },

                    closing: {
                      date: filter.to_date,
                      balance: closingBalanceCollection.getClosingBalance(account.id) } });}));return _context2.abrupt("return",



                res.status(200).send({
                  meta: _objectSpread({}, filter),
                  items: items }));case 20:case "end":return _context2.stop();}}}, _callee2);}));function handler(_x3, _x4) {return _handler2.apply(this, arguments);}return handler;}() },




  /**
                                                                                                                                                                                             * Retrieve the balance sheet.
                                                                                                                                                                                             */
  balanceSheet: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('accounting_method').optional().isIn(['cash', 'accural']),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('from_date').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('to_date').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('display_columns_by').optional().isIn(['year', 'month', 'week', 'day', 'quarter']),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('number_format.no_cents').optional().isBoolean().toBoolean(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('number_format.divide_1000').optional().isBoolean().toBoolean(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('none_zero').optional().isBoolean().toBoolean()],

    handler: function () {var _handler3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee3(req, res) {var validationErrors, filter, balanceSheetTypes, accounts, journalEntriesCollected, journalEntries, balanceFormatter, dateRangeSet, assets, liabilitiesEquity;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context3.next = 3;break;}return _context3.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                filter = _objectSpread({
                  display_columns_by: 'year',
                  from_date: moment__WEBPACK_IMPORTED_MODULE_6___default()().startOf('year').format('YYYY-MM-DD'),
                  to_date: moment__WEBPACK_IMPORTED_MODULE_6___default()().endOf('year').format('YYYY-MM-DD'),
                  number_format: {
                    no_cents: false,
                    divide_1000: false },

                  none_zero: false },
                req.query);_context3.next = 6;return (


                  _models_AccountType__WEBPACK_IMPORTED_MODULE_11__["default"].query().
                  where('balance_sheet', true));case 6:balanceSheetTypes = _context3.sent;_context3.next = 9;return (


                  _models_Account__WEBPACK_IMPORTED_MODULE_12__["default"].query().
                  whereIn('account_type_id', balanceSheetTypes.map(function (a) {return a.id;})).
                  withGraphFetched('type').
                  withGraphFetched('transactions').
                  modifyGraph('transactions', function (builder) {
                    builder.modify('filterDateRange', null, filter.to_date);
                  }));case 9:accounts = _context3.sent;

                journalEntriesCollected = _models_Account__WEBPACK_IMPORTED_MODULE_12__["default"].collectJournalEntries(accounts);
                journalEntries = new _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_13__["default"]();
                journalEntries.loadEntries(journalEntriesCollected);

                // Account balance formmatter based on the given query.
                balanceFormatter = formatNumberClosure(filter.number_format);

                // Gets the date range set from start to end date.
                dateRangeSet = Object(_utils__WEBPACK_IMPORTED_MODULE_14__["dateRangeCollection"])(
                filter.from_date,
                filter.to_date,
                filter.display_columns_by);

                // Retrieve the asset balance sheet.
                assets = _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(
                accounts.
                filter(function (account) {return (
                    account.type.normal === 'debit' && (
                    account.transactions.length > 0 || !filter.none_zero));}).

                map(function (account) {return _objectSpread({},
                  Object(lodash__WEBPACK_IMPORTED_MODULE_7__["pick"])(account, ['id', 'index', 'name', 'code']), {
                    transactions: dateRangeSet.map(function (date) {
                      var type = filter.display_columns_by;
                      var balance = journalEntries.getClosingBalance(account.id, date, type);
                      return { date: date, balance: balanceFormatter(balance) };
                    }) });}));


                // Retrieve liabilities and equity balance sheet.
                liabilitiesEquity = _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(
                accounts.
                filter(function (account) {return (
                    account.type.normal === 'credit' && (
                    account.transactions.length > 0 || !filter.none_zero));}).

                map(function (account) {return _objectSpread({},
                  Object(lodash__WEBPACK_IMPORTED_MODULE_7__["pick"])(account, ['id', 'index', 'name', 'code']), {
                    transactions: dateRangeSet.map(function (date) {
                      var type = filter.display_columns_by;
                      var balance = journalEntries.getClosingBalance(account.id, date, type);
                      return { date: date, balance: balanceFormatter(balance) };
                    }) });}));return _context3.abrupt("return",


                res.status(200).send({
                  columns: _objectSpread({}, dateRangeSet),
                  balance_sheet: {
                    assets: assets,
                    liabilities_equity: liabilitiesEquity } }));case 18:case "end":return _context3.stop();}}}, _callee3);}));function handler(_x5, _x6) {return _handler3.apply(this, arguments);}return handler;}() },





  /**
                                                                                                                                                                                                                          * Retrieve the trial balance sheet.
                                                                                                                                                                                                                          */
  trialBalanceSheet: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('basis').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('from_date').optional().isISO8601(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('to_date').optional().isISO8601(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('number_format.no_cents').optional().isBoolean(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('number_format.1000_divide').optional().isBoolean(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('basis').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('none_zero').optional()],

    handler: function () {var _handler4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee4(req, res) {var validationErrors, filter, accounts, journalEntriesCollect, journalEntries, balanceFormatter, items;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context4.next = 3;break;}return _context4.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                filter = _objectSpread({
                  from_date: moment__WEBPACK_IMPORTED_MODULE_6___default()().startOf('year').format('YYYY-MM-DD'),
                  to_date: moment__WEBPACK_IMPORTED_MODULE_6___default()().endOf('year').format('YYYY-MM-DD'),
                  number_format: {
                    no_cents: false,
                    divide_1000: false },

                  basis: 'accural',
                  none_zero: false },
                req.query);_context4.next = 6;return (


                  _models_Account__WEBPACK_IMPORTED_MODULE_12__["default"].query().
                  withGraphFetched('type').
                  withGraphFetched('transactions').
                  modifyGraph('transactions', function (builder) {
                    builder.modify('sumationCreditDebit');
                    builder.modify('filterDateRange', filter.from_date, filter.to_date);
                  }));case 6:accounts = _context4.sent;

                journalEntriesCollect = _models_Account__WEBPACK_IMPORTED_MODULE_12__["default"].collectJournalEntries(accounts);
                journalEntries = new _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_13__["default"]();
                journalEntries.loadEntries(journalEntriesCollect);

                // Account balance formmatter based on the given query.
                balanceFormatter = formatNumberClosure(filter.number_format);

                items = accounts.
                filter(function (account) {return (
                    account.transactions.length > 0 || !filter.none_zero);}).

                map(function (account) {
                  var trial = journalEntries.getTrialBalance(account.id);
                  return {
                    account_id: account.id,
                    code: account.code,
                    accountNormal: account.type.normal,
                    credit: balanceFormatter(trial.credit),
                    debit: balanceFormatter(trial.debit),
                    balance: balanceFormatter(trial.balance) };

                });return _context4.abrupt("return",
                res.status(200).send({
                  meta: _objectSpread({}, filter),
                  items: _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(items) }));case 13:case "end":return _context4.stop();}}}, _callee4);}));function handler(_x7, _x8) {return _handler4.apply(this, arguments);}return handler;}() },




  /**
                                                                                                                                                                                                                 * Retrieve profit/loss financial statement.
                                                                                                                                                                                                                 */
  profitLossSheet: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('basis').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('from_date').optional().isISO8601(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('to_date').optional().isISO8601(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('number_format.no_cents').optional().isBoolean(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('number_format.divide_1000').optional().isBoolean(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('basis').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('none_zero').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('display_columns_by').optional().isIn(['year', 'month', 'week', 'day', 'quarter']),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('accounts').optional().isArray()],

    handler: function () {var _handler5 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee5(req, res) {var validationErrors, filter, incomeStatementTypes, accounts, filteredAccounts, journalEntriesCollected, journalEntries, numberFormatter, dateRangeSet, accountsIncome, accountsExpenses, totalAccountsIncome, totalAccountsExpenses, netIncome;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context5.next = 3;break;}return _context5.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                filter = _objectSpread({
                  from_date: moment__WEBPACK_IMPORTED_MODULE_6___default()().startOf('year').format('YYYY-MM-DD'),
                  to_date: moment__WEBPACK_IMPORTED_MODULE_6___default()().endOf('year').format('YYYY-MM-DD'),
                  number_format: {
                    no_cents: false,
                    divide_1000: false },

                  basis: 'accural',
                  none_zero: false,
                  display_columns_by: 'month' },
                req.query);_context5.next = 6;return (

                  _models_AccountType__WEBPACK_IMPORTED_MODULE_11__["default"].query().where('income_sheet', true));case 6:incomeStatementTypes = _context5.sent;_context5.next = 9;return (

                  _models_Account__WEBPACK_IMPORTED_MODULE_12__["default"].query().
                  whereIn('account_type_id', incomeStatementTypes.map(function (t) {return t.id;})).
                  withGraphFetched('type').
                  withGraphFetched('transactions'));case 9:accounts = _context5.sent;

                filteredAccounts = accounts.filter(function (account) {
                  return account.transactions.length > 0 || !filter.none_zero;
                });
                journalEntriesCollected = _models_Account__WEBPACK_IMPORTED_MODULE_12__["default"].collectJournalEntries(accounts);
                journalEntries = new _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_13__["default"]();
                journalEntries.loadEntries(journalEntriesCollected);

                // Account balance formmatter based on the given query.
                numberFormatter = formatNumberClosure(filter.number_format);

                // Gets the date range set from start to end date.
                dateRangeSet = Object(_utils__WEBPACK_IMPORTED_MODULE_14__["dateRangeCollection"])(
                filter.from_date,
                filter.to_date,
                filter.display_columns_by);

                accountsIncome = filteredAccounts.
                filter(function (account) {return account.type.normal === 'credit';}).
                map(function (account) {return _objectSpread({},
                  Object(lodash__WEBPACK_IMPORTED_MODULE_7__["pick"])(account, ['id', 'index', 'name', 'code']), {
                    dates: dateRangeSet.map(function (date) {
                      var type = filter.display_columns_by;
                      var amount = journalEntries.getClosingBalance(account.id, date, type);

                      return { date: date, rawAmount: amount, amount: numberFormatter(amount) };
                    }) });});


                accountsExpenses = filteredAccounts.
                filter(function (account) {return account.type.normal === 'debit';}).
                map(function (account) {return _objectSpread({},
                  Object(lodash__WEBPACK_IMPORTED_MODULE_7__["pick"])(account, ['id', 'index', 'name', 'code']), {
                    dates: dateRangeSet.map(function (date) {
                      var type = filter.display_columns_by;
                      var amount = journalEntries.getClosingBalance(account.id, date, type);

                      return { date: date, rawAmount: amount, amount: numberFormatter(amount) };
                    }) });});


                // Calculates the total income of income accounts.
                totalAccountsIncome = dateRangeSet.reduce(function (acc, date, index) {
                  var amount = 0;
                  accountsIncome.forEach(function (account) {
                    var currentDate = account.dates[index];
                    amount += currentDate.rawAmount || 0;
                  });
                  acc[date] = { date: date, rawAmount: amount, amount: numberFormatter(amount) };
                  return acc;
                }, {});

                // Calculates the total expenses of expenses accounts.
                totalAccountsExpenses = dateRangeSet.reduce(function (acc, date, index) {
                  var amount = 0;
                  accountsExpenses.forEach(function (account) {
                    var currentDate = account.dates[index];
                    amount += currentDate.rawAmount || 0;
                  });
                  acc[date] = { date: date, rawAmount: amount, amount: numberFormatter(amount) };
                  return acc;
                }, {});

                // Total income(date) - Total expenses(date) = Net income(date)
                netIncome = dateRangeSet.map(function (date) {
                  var totalIncome = totalAccountsIncome[date];
                  var totalExpenses = totalAccountsExpenses[date];

                  var amount = totalIncome.rawAmount || 0;
                  amount -= totalExpenses.rawAmount || 0;
                  return { date: date, rawAmount: amount, amount: numberFormatter(amount) };
                });return _context5.abrupt("return",

                res.status(200).send({
                  meta: _objectSpread({}, filter),
                  income: {
                    entry_normal: 'credit',
                    accounts: accountsIncome },

                  expenses: {
                    entry_normal: 'debit',
                    accounts: accountsExpenses },

                  total_income: Object.values(totalAccountsIncome),
                  total_expenses: Object.values(totalAccountsExpenses),
                  total_net_income: netIncome }));case 22:case "end":return _context5.stop();}}}, _callee5);}));function handler(_x9, _x10) {return _handler5.apply(this, arguments);}return handler;}() },




  cashFlowStatement: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('date_from').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('date_to').optional()],

    handler: function () {var _handler6 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee6(req, res) {return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:return _context6.abrupt("return",

                res.status(200).send());case 1:case "end":return _context6.stop();}}}, _callee6);}));function handler(_x11, _x12) {return _handler6.apply(this, arguments);}return handler;}() },




  badgetVersesActuals: {
    validation: [],


    handler: function () {var _handler7 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee7(req, res) {return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:case "end":return _context7.stop();}}}, _callee7);}));function handler(_x13, _x14) {return _handler7.apply(this, arguments);}return handler;}() } });

/***/ }),

/***/ "./src/http/controllers/ItemCategories.js":
/*!************************************************!*\
  !*** ./src/http/controllers/ItemCategories.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! express-validator */ "express-validator");
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(express_validator__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
/* harmony import */ var _models_ItemCategory__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/models/ItemCategory */ "./src/models/ItemCategory.js");
/* harmony import */ var _http_middleware_authorization__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/http/middleware/authorization */ "./src/http/middleware/authorization.js");
/* harmony import */ var _http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/http/middleware/jwtAuth */ "./src/http/middleware/jwtAuth.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}






/* harmony default export */ __webpack_exports__["default"] = ({
  /**
                  * Router constructor method.
                  */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_3___default.a.Router();
    var permit = Object(_http_middleware_authorization__WEBPACK_IMPORTED_MODULE_7__["default"])('items_categories');

    router.use(_http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_8__["default"]);

    router.post('/:id',
    permit('create', 'edit'),
    this.editCategory.validation,
    Object(_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_5__["default"])(this.editCategory.handler));

    router.post('/',
    permit('create'),
    this.newCategory.validation,
    Object(_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_5__["default"])(this.newCategory.handler));

    router["delete"]('/:id',
    permit('create', 'edit', 'delete'),
    this.deleteItem.validation,
    Object(_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_5__["default"])(this.deleteItem.handler));

    router.get('/:id',
    permit('view'),
    this.getCategory.validation,
    Object(_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_5__["default"])(this.getCategory.handler));

    router.get('/',
    permit('view'),
    this.getList.validation,
    Object(_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_5__["default"])(this.getList.validation));

    return router;
  },

  /**
      * Creates a new item category.
      */
  newCategory: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('name').exists({ checkFalsy: true }).trim().escape(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('parent_category_id').optional().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('description').optional().trim().escape()],

    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(req, res) {var validationErrors, _req$body, name, parentCategoryId, description, foundParentCategory, category;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context.next = 3;break;}return _context.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:_req$body =



                req.body, name = _req$body.name, parentCategoryId = _req$body.parent_category_id, description = _req$body.description;if (!

                parentCategoryId) {_context.next = 10;break;}_context.next = 7;return (
                  _models_ItemCategory__WEBPACK_IMPORTED_MODULE_6__["default"].where('id', parentCategoryId).fetch());case 7:foundParentCategory = _context.sent;if (

                foundParentCategory) {_context.next = 10;break;}return _context.abrupt("return",
                res.boom.notFound('The parent category ID is not found.', {
                  errors: [{ type: 'PARENT_CATEGORY_NOT_FOUND', code: 100 }] }));case 10:_context.next = 12;return (



                  _models_ItemCategory__WEBPACK_IMPORTED_MODULE_6__["default"].forge({
                    label: name,
                    parent_category_id: parentCategoryId,
                    description: description }));case 12:category = _context.sent;_context.next = 15;return (


                  category.save());case 15:return _context.abrupt("return",
                res.status(200).send({ id: category.get('id') }));case 16:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                        * Edit details of the given category item.
                                                                                                                                                                                                                        */
  editCategory: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["param"])('id').toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('name').exists({ checkFalsy: true }).trim().escape(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('parent_category_id').optional().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('description').optional().trim().escape()],

    handler: function () {var _handler2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(req, res) {var id, validationErrors, _req$body2, name, parentCategoryId, description, itemCategory, foundParentCategory;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                id = req.params.id;
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context2.next = 4;break;}return _context2.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 4:_req$body2 =


                req.body, name = _req$body2.name, parentCategoryId = _req$body2.parent_category_id, description = _req$body2.description;_context2.next = 7;return (
                  _models_ItemCategory__WEBPACK_IMPORTED_MODULE_6__["default"].where('id', id).fetch());case 7:itemCategory = _context2.sent;if (

                itemCategory) {_context2.next = 10;break;}return _context2.abrupt("return",
                res.boom.notFound());case 10:if (!(

                parentCategoryId && parentCategoryId !== itemCategory.attributes.parent_category_id)) {_context2.next = 16;break;}_context2.next = 13;return (
                  _models_ItemCategory__WEBPACK_IMPORTED_MODULE_6__["default"].where('id', parentCategoryId).fetch());case 13:foundParentCategory = _context2.sent;if (

                foundParentCategory) {_context2.next = 16;break;}return _context2.abrupt("return",
                res.boom.notFound('The parent category ID is not found.', {
                  errors: [{ type: 'PARENT_CATEGORY_NOT_FOUND', code: 100 }] }));case 16:_context2.next = 18;return (



                  itemCategory.save({
                    label: name,
                    description: description,
                    parent_category_id: parentCategoryId }));case 18:return _context2.abrupt("return",


                res.status(200).send({ id: itemCategory.id }));case 19:case "end":return _context2.stop();}}}, _callee2);}));function handler(_x3, _x4) {return _handler2.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                         * Delete the give item category.
                                                                                                                                                                                                                         */
  deleteItem: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["param"])('id').toInt()],

    handler: function () {var _handler3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(req, res) {var id, itemCategory;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                id = req.params.id;_context3.next = 3;return (
                  _models_ItemCategory__WEBPACK_IMPORTED_MODULE_6__["default"].where('id', id).fetch());case 3:itemCategory = _context3.sent;if (

                itemCategory) {_context3.next = 6;break;}return _context3.abrupt("return",
                res.boom.notFound());case 6:_context3.next = 8;return (

                  itemCategory.destroy());case 8:return _context3.abrupt("return",
                res.status(200).send());case 9:case "end":return _context3.stop();}}}, _callee3);}));function handler(_x5, _x6) {return _handler3.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                 * Retrieve the list of items.
                                                                                                                                                                                                 */
  getList: {
    validation: [],
    handler: function () {var _handler4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(req, res) {var items;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:_context4.next = 2;return (
                  _models_ItemCategory__WEBPACK_IMPORTED_MODULE_6__["default"].fetch());case 2:items = _context4.sent;if (

                items) {_context4.next = 5;break;}return _context4.abrupt("return",
                res.boom.notFound());case 5:return _context4.abrupt("return",

                res.status(200).send({ items: items.toJSON() }));case 6:case "end":return _context4.stop();}}}, _callee4);}));function handler(_x7, _x8) {return _handler4.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                          * Retrieve details of the given category.
                                                                                                                                                                                                                          */
  getCategory: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["param"])('category_id').toInt()],

    handler: function () {var _handler5 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee5(req, res) {var categoryId, item;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
                categoryId = req.params.category_id;_context5.next = 3;return (
                  _models_ItemCategory__WEBPACK_IMPORTED_MODULE_6__["default"].where('id', categoryId).fetch());case 3:item = _context5.sent;if (

                item) {_context5.next = 6;break;}return _context5.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'CATEGORY_NOT_FOUND', code: 100 }] }));case 6:return _context5.abrupt("return",



                res.status(200).send({ category: item.toJSON() }));case 7:case "end":return _context5.stop();}}}, _callee5);}));function handler(_x9, _x10) {return _handler5.apply(this, arguments);}return handler;}() } });

/***/ }),

/***/ "./src/http/controllers/Items.js":
/*!***************************************!*\
  !*** ./src/http/controllers/Items.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "@babel/runtime/helpers/slicedToArray");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! express-validator */ "express-validator");
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(express_validator__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/http/middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
/* harmony import */ var _http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/http/middleware/jwtAuth */ "./src/http/middleware/jwtAuth.js");
/* harmony import */ var _models_Item__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/models/Item */ "./src/models/Item.js");
/* harmony import */ var _models_Account__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/models/Account */ "./src/models/Account.js");
/* harmony import */ var _models_ItemCategory__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @/models/ItemCategory */ "./src/models/ItemCategory.js");
/* harmony import */ var _models_Resource__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @/models/Resource */ "./src/models/Resource.js");
/* harmony import */ var _models_ResourceField__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @/models/ResourceField */ "./src/models/ResourceField.js");
/* harmony import */ var _http_middleware_authorization__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @/http/middleware/authorization */ "./src/http/middleware/authorization.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}












/* harmony default export */ __webpack_exports__["default"] = ({

  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_4___default.a.Router();
    var permit = Object(_http_middleware_authorization__WEBPACK_IMPORTED_MODULE_15__["default"])('items');

    router.use(_http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_9__["default"]);

    // router.post('/:id',
    //   this.editItem.validation,
    //   asyncMiddleware(this.editCategory.handler));

    router.post('/',
    permit('create'),
    this.newItem.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_8__["default"])(this.newItem.handler));

    // router.delete('/:id',
    //   this.deleteItem.validation,
    //   asyncMiddleware(this.deleteItem.handler));

    // router.get('/:id',
    //   this.getCategory.validation,
    //   asyncMiddleware(this.getCategory.handler));

    // router.get('/',
    //   this.categoriesList.validation,
    //   asyncMiddleware(this.categoriesList.validation));

    return router;
  },

  /**
      * Creates a new item.
      */
  newItem: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('name').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('type_id').exists().isInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('buy_price').exists().isNumeric(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('cost_price').exists().isNumeric(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('cost_account_id').exists().isInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('sell_account_id').exists().isInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('category_id').optional().isInt(),

    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('custom_fields').isArray({ min: 1 }),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('custom_fields.*.key').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('custom_fields.*.value').exists(),

    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('note').optional()],

    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(req, res) {var validationErrors, form, errorReasons, costAccountPromise, sellAccountPromise, itemCategoryPromise, customFieldsKeys, resource, fields, storedFieldsKey, notFoundFields, _ref, _ref2, costAccount, sellAccount, itemCategory, item;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context.next = 3;break;}return _context.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                form = _objectSpread({}, req.body);
                errorReasons = [];

                costAccountPromise = _models_Account__WEBPACK_IMPORTED_MODULE_11__["default"].where('id', form.cost_account_id).fetch();
                sellAccountPromise = _models_Account__WEBPACK_IMPORTED_MODULE_11__["default"].where('id', form.sell_account_id).fetch();
                itemCategoryPromise = form.category_id ?
                _models_ItemCategory__WEBPACK_IMPORTED_MODULE_12__["default"].where('id', form.category_id).fetch() : null;

                // Validate the custom fields key and value type.
                if (!(form.custom_fields.length > 0)) {_context.next = 19;break;}
                customFieldsKeys = form.custom_fields.map(function (field) {return field.key;});

                // Get resource id than get all resource fields.
                _context.next = 12;return _models_Resource__WEBPACK_IMPORTED_MODULE_13__["default"].where('name', 'items').fetch();case 12:resource = _context.sent;_context.next = 15;return (
                  _models_ResourceField__WEBPACK_IMPORTED_MODULE_14__["default"].query(function (query) {
                    query.where('resource_id', resource.id);
                    query.whereIn('key', customFieldsKeys);
                  }).fetchAll());case 15:fields = _context.sent;

                storedFieldsKey = fields.map(function (f) {return f.attributes.key;});

                // Get all not defined resource fields.
                notFoundFields = Object(lodash__WEBPACK_IMPORTED_MODULE_7__["difference"])(customFieldsKeys, storedFieldsKey);

                if (notFoundFields.length > 0) {
                  errorReasons.push({ type: 'FIELD_KEY_NOT_FOUND', code: 150, fields: notFoundFields });
                }case 19:_context.next = 21;return (


                  Promise.all([
                  costAccountPromise, sellAccountPromise, itemCategoryPromise]));case 21:_ref = _context.sent;_ref2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_ref, 3);costAccount = _ref2[0];sellAccount = _ref2[1];itemCategory = _ref2[2];

                if (!costAccount) {
                  errorReasons.push({ type: 'COST_ACCOUNT_NOT_FOUND', code: 100 });
                }
                if (!sellAccount) {
                  errorReasons.push({ type: 'SELL_ACCOUNT_NOT_FOUND', code: 120 });
                }
                if (!itemCategory && form.category_id) {
                  errorReasons.push({ type: 'ITEM_CATEGORY_NOT_FOUND', code: 140 });
                }if (!(
                errorReasons.length > 0)) {_context.next = 31;break;}return _context.abrupt("return",
                res.boom.badRequest(null, { errors: errorReasons }));case 31:

                item = _models_Item__WEBPACK_IMPORTED_MODULE_10__["default"].forge({
                  name: req.body.name,
                  type_id: 1,
                  buy_price: req.body.buy_price,
                  sell_price: req.body.sell_price,
                  currency_code: req.body.currency_code,
                  note: req.body.note });_context.next = 34;return (

                  item.save());case 34:return _context.abrupt("return",

                res.status(200).send());case 35:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                              * Edit the given item.
                                                                                                                                                                                              */
  editItem: {
    validation: [],
    handler: function () {var _handler2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(req, res) {var id, validationErrors, item;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                id = req.params.id;
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context2.next = 4;break;}return _context2.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 4:_context2.next = 6;return (



                  _models_Item__WEBPACK_IMPORTED_MODULE_10__["default"].where('id', id).fetch());case 6:item = _context2.sent;if (

                item) {_context2.next = 9;break;}return _context2.abrupt("return",
                res.boom.notFound());case 9:return _context2.abrupt("return",

                res.status(200).send());case 10:case "end":return _context2.stop();}}}, _callee2);}));function handler(_x3, _x4) {return _handler2.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                  * Delete the given item from the storage.
                                                                                                                                                                                                  */
  deleteItem: {
    validation: [],
    handler: function () {var _handler3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(req, res) {var id, item;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                id = req.params.id;_context3.next = 3;return (
                  _models_Item__WEBPACK_IMPORTED_MODULE_10__["default"].where('id', id).fetch());case 3:item = _context3.sent;if (

                item) {_context3.next = 6;break;}return _context3.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'ITEM_NOT_FOUND', code: 100 }] }));case 6:_context3.next = 8;return (



                  item.destroy());case 8:return _context3.abrupt("return",
                res.status(200).send());case 9:case "end":return _context3.stop();}}}, _callee3);}));function handler(_x5, _x6) {return _handler3.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                 * Retrive the list items with pagination meta.
                                                                                                                                                                                                 */
  listItems: {
    validation: [],
    handler: function () {var _handler4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(req, res) {var filter, items;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                filter = _objectSpread({
                  name: '',
                  description: '',
                  SKU: '',
                  account_id: null,
                  page_size: 10,
                  page: 1,
                  start_date: null,
                  end_date: null },
                req.query);_context4.next = 3;return (


                  _models_Item__WEBPACK_IMPORTED_MODULE_10__["default"].query(function (query) {
                    if (filter.description) {
                      query.where('description', 'like', "%".concat(filter.description, "%"));
                    }
                    if (filter.description) {
                      query.where('SKU', filter.SKY);
                    }
                    if (filter.name) {
                      query.where('name', filter.name);
                    }
                    if (filter.start_date) {
                      var startDateFormatted = moment__WEBPACK_IMPORTED_MODULE_6___default()(filter.start_date).format('YYYY-MM-DD HH:mm:SS');
                      query.where('created_at', '>=', startDateFormatted);
                    }
                    if (filter.end_date) {
                      var endDateFormatted = moment__WEBPACK_IMPORTED_MODULE_6___default()(filter.end_date).format('YYYY-MM-DD HH:mm:SS');
                      query.where('created_at', '<=', endDateFormatted);
                    }
                  }).fetchPage({
                    page_size: filter.page_size,
                    page: filter.page }));case 3:items = _context4.sent;return _context4.abrupt("return",


                res.status(200).send({
                  items: items.toJSON(),
                  pagination: items.pagination }));case 5:case "end":return _context4.stop();}}}, _callee4);}));function handler(_x7, _x8) {return _handler4.apply(this, arguments);}return handler;}() } });

/***/ }),

/***/ "./src/http/controllers/Options.js":
/*!*****************************************!*\
  !*** ./src/http/controllers/Options.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! express-validator */ "express-validator");
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(express_validator__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/http/middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
/* harmony import */ var _models_Option__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/models/Option */ "./src/models/Option.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}




/* harmony default export */ __webpack_exports__["default"] = ({
  /**
                  * Router constructor.
                  */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_3___default.a.Router();

    router.post('/',
    this.saveOptions.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_5__["default"])(this.saveOptions.handler));

    router.get('/',
    this.getOptions.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_5__["default"])(this.getSettings));

    return router;
  },

  /**
      * Saves the given options to the storage.
      */
  saveOptions: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["body"])('options').isArray(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["body"])('options.*.key').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["body"])('options.*.value').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["body"])('options.*.group').exists()],

    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(req, res) {var validationErrors, form, optionsCollections;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context.next = 3;break;}return _context.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'VALIDATION_ERROR' }, validationErrors)));case 3:


                form = _objectSpread({}, req.body);_context.next = 6;return (
                  _models_Option__WEBPACK_IMPORTED_MODULE_6__["default"].query());case 6:optionsCollections = _context.sent;

                form.options.forEach(function (option) {
                  optionsCollections.setMeta(option.key, option.value, option.group);
                });_context.next = 10;return (
                  optionsCollections.saveMeta());case 10:return _context.abrupt("return",

                res.status(200).send());case 11:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                              * Retrieve the application options from the storage.
                                                                                                                                                                                              */
  getOptions: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["query"])('key').optional()],

    handler: function () {var _handler2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(req, res) {var validationErrors, options;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context2.next = 3;break;}return _context2.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'VALIDATION_ERROR' }, validationErrors)));case 3:_context2.next = 5;return (


                  _models_Option__WEBPACK_IMPORTED_MODULE_6__["default"].query());case 5:options = _context2.sent;return _context2.abrupt("return",

                res.status(200).sends({
                  options: options.toArray() }));case 7:case "end":return _context2.stop();}}}, _callee2);}));function handler(_x3, _x4) {return _handler2.apply(this, arguments);}return handler;}() } });

/***/ }),

/***/ "./src/http/controllers/Roles.js":
/*!***************************************!*\
  !*** ./src/http/controllers/Roles.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "@babel/runtime/helpers/toConsumableArray");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "@babel/runtime/helpers/slicedToArray");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! express-validator */ "express-validator");
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(express_validator__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/http/middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
/* harmony import */ var _models_Role__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/models/Role */ "./src/models/Role.js");
/* harmony import */ var _models_Permission__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/models/Permission */ "./src/models/Permission.js");
/* harmony import */ var _models_Resource__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/models/Resource */ "./src/models/Resource.js");
/* harmony import */ var _database_knex__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @/database/knex */ "./src/database/knex.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;} /* eslint-disable no-unused-vars */









var AccessControllSchema = [
{
  resource: 'items',
  label: 'products_services',
  permissions: ['create', 'edit', 'delete', 'view'],
  fullAccess: true,
  ownControl: true }];



var getResourceSchema = function getResourceSchema(resource) {return AccessControllSchema.
  find(function (schema) {return schema.resource === resource;});};

var getResourcePermissions = function getResourcePermissions(resource) {
  var foundResource = getResourceSchema(resource);
  return foundResource ? foundResource.permissions : [];
};

var findNotFoundResources = function findNotFoundResources(resourcesSlugs) {
  var schemaResourcesSlugs = AccessControllSchema.map(function (s) {return s.resource;});
  return Object(lodash__WEBPACK_IMPORTED_MODULE_7__["difference"])(resourcesSlugs, schemaResourcesSlugs);
};

var findNotFoundPermissions = function findNotFoundPermissions(permissions, resourceSlug) {
  var schemaPermissions = getResourcePermissions(resourceSlug);
  return Object(lodash__WEBPACK_IMPORTED_MODULE_7__["difference"])(permissions, schemaPermissions);
};

/* harmony default export */ __webpack_exports__["default"] = ({
  /**
                  * Router constructor method.
                  */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_5___default.a.Router();

    router.post('/',
    this.newRole.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_8__["default"])(this.newRole.handler));

    router.post('/:id',
    this.editRole.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_8__["default"])(this.editRole.handler.bind(this)));

    router["delete"]('/:id',
    this.deleteRole.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_8__["default"])(this.deleteRole.handler));

    return router;
  },

  /**
      * Creates a new role.
      */
  newRole: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('name').exists().trim().escape(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('description').optional().trim().escape(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('permissions').isArray({ min: 0 }),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('permissions.*.resource_slug').exists().whitelist('^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('permissions.*.permissions').isArray({ min: 1 })],

    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(req, res) {var validationErrors, _req$body, name, description, permissions, resourcesSlugs, permissionsSlugs, resourcesNotFound, errorReasons, notFoundPermissions, _ref, _ref2, resourcesCollection, permsCollection, notStoredResources, notStoredPermissions, insertThread, _ref3, _ref4, storedPermissions, storedResources, storedResourcesSet, storedPermissionsSet, role, roleHasPerms;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context.next = 3;break;}return _context.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:_req$body =


                req.body, name = _req$body.name, description = _req$body.description, permissions = _req$body.permissions;

                resourcesSlugs = permissions.map(function (perm) {return perm.resource_slug;});
                permissionsSlugs = [];
                resourcesNotFound = findNotFoundResources(resourcesSlugs);

                errorReasons = [];
                notFoundPermissions = [];

                if (resourcesNotFound.length > 0) {
                  errorReasons.push({
                    type: 'RESOURCE_SLUG_NOT_FOUND', code: 100, resources: resourcesNotFound });

                }
                permissions.forEach(function (perm) {
                  var abilities = perm.permissions.map(function (ability) {return ability;});

                  // Gets the not found permissions in the schema.
                  var notFoundAbilities = findNotFoundPermissions(abilities, perm.resource_slug);

                  if (notFoundAbilities.length > 0) {
                    notFoundPermissions.push({
                      resource_slug: perm.resource_slug,
                      permissions: notFoundAbilities });

                  } else {
                    var perms = perm.permissions || [];
                    perms.forEach(function (permission) {
                      if (perms.indexOf(permission) !== -1) {
                        permissionsSlugs.push(permission);
                      }
                    });
                  }
                });
                if (notFoundPermissions.length > 0) {
                  errorReasons.push({
                    type: 'PERMISSIONS_SLUG_NOT_FOUND',
                    code: 200,
                    permissions: notFoundPermissions });

                }if (!(
                errorReasons.length > 0)) {_context.next = 14;break;}return _context.abrupt("return",
                res.boom.badRequest(null, { errors: errorReasons }));case 14:_context.next = 16;return (


                  Promise.all([
                  _models_Resource__WEBPACK_IMPORTED_MODULE_11__["default"].query(function (query) {query.whereIn('name', resourcesSlugs);}).fetchAll(),
                  _models_Permission__WEBPACK_IMPORTED_MODULE_10__["default"].query(function (query) {query.whereIn('name', permissionsSlugs);}).fetchAll()]));case 16:_ref = _context.sent;_ref2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2___default()(_ref, 2);resourcesCollection = _ref2[0];permsCollection = _ref2[1];


                notStoredResources = Object(lodash__WEBPACK_IMPORTED_MODULE_7__["difference"])(
                resourcesSlugs, resourcesCollection.map(function (s) {return s.name;}));

                notStoredPermissions = Object(lodash__WEBPACK_IMPORTED_MODULE_7__["difference"])(
                permissionsSlugs, permsCollection.map(function (perm) {return perm.slug;}));


                insertThread = [];

                if (notStoredResources.length > 0) {
                  insertThread.push(Object(_database_knex__WEBPACK_IMPORTED_MODULE_12__["default"])('resources').insert(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1___default()(
                  notStoredResources.map(function (resource) {return { name: resource };}))));

                }
                if (notStoredPermissions.length > 0) {
                  insertThread.push(Object(_database_knex__WEBPACK_IMPORTED_MODULE_12__["default"])('permissions').insert(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1___default()(
                  notStoredPermissions.map(function (permission) {return { name: permission };}))));

                }_context.next = 27;return (

                  Promise.all(insertThread));case 27:_context.next = 29;return (

                  Promise.all([
                  _models_Permission__WEBPACK_IMPORTED_MODULE_10__["default"].query(function (q) {q.whereIn('name', permissionsSlugs);}).fetchAll(),
                  _models_Resource__WEBPACK_IMPORTED_MODULE_11__["default"].query(function (q) {q.whereIn('name', resourcesSlugs);}).fetchAll()]));case 29:_ref3 = _context.sent;_ref4 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2___default()(_ref3, 2);storedPermissions = _ref4[0];storedResources = _ref4[1];


                storedResourcesSet = new Map(storedResources.map(function (resource) {return [
                  resource.attributes.name, resource.attributes.id];}));

                storedPermissionsSet = new Map(storedPermissions.map(function (perm) {return [
                  perm.attributes.name, perm.attributes.id];}));

                role = _models_Role__WEBPACK_IMPORTED_MODULE_9__["default"].forge({ name: name, description: description });_context.next = 38;return (

                  role.save());case 38:

                roleHasPerms = permissions.map(function (resource) {return resource.permissions.map(function (perm) {return {
                      role_id: role.id,
                      resource_id: storedResourcesSet.get(resource.resource_slug),
                      permission_id: storedPermissionsSet.get(perm) };});});if (!(


                roleHasPerms.length > 0)) {_context.next = 42;break;}_context.next = 42;return (
                  Object(_database_knex__WEBPACK_IMPORTED_MODULE_12__["default"])('role_has_permissions').insert(roleHasPerms[0]));case 42:return _context.abrupt("return",

                res.status(200).send({ id: role.get('id') }));case 43:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                    * Edit the give role.
                                                                                                                                                                                                                    */
  editRole: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('name').exists().trim().escape(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('description').optional().trim().escape(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('permissions').isArray({ min: 0 }),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('permissions.*.resource_slug').exists().whitelist('^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('permissions.*.permissions').isArray({ min: 1 })],

    handler: function () {var _handler2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(req, res) {var validationErrors, id, role, permissions, errorReasons, permissionsSlugs, notFoundPermissions, resourcesSlugs, resourcesNotFound, _ref5, _ref6, resourcesCollection, permsCollection, notStoredResources, notStoredPermissions, insertThread, _ref7, _ref8, storedPermissions, storedResources, storedResourcesSet, storedPermissionsSet, savedRoleHasPerms;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context2.next = 3;break;}return _context2.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:



                id = req.params.id;_context2.next = 6;return (
                  _models_Role__WEBPACK_IMPORTED_MODULE_9__["default"].where('id', id).fetch());case 6:role = _context2.sent;if (

                role) {_context2.next = 9;break;}return _context2.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'ROLE_NOT_FOUND', code: 100 }] }));case 9:



                permissions = req.body.permissions;
                errorReasons = [];
                permissionsSlugs = [];
                notFoundPermissions = [];

                resourcesSlugs = permissions.map(function (perm) {return perm.resource_slug;});
                resourcesNotFound = findNotFoundResources(resourcesSlugs);

                if (resourcesNotFound.length > 0) {
                  errorReasons.push({
                    type: 'RESOURCE_SLUG_NOT_FOUND',
                    code: 100,
                    resources: resourcesNotFound });

                }

                permissions.forEach(function (perm) {
                  var abilities = perm.permissions.map(function (ability) {return ability;});
                  // Gets the not found permissions in the schema.
                  var notFoundAbilities = findNotFoundPermissions(abilities, perm.resource_slug);

                  if (notFoundAbilities.length > 0) {
                    notFoundPermissions.push({
                      resource_slug: perm.resource_slug, permissions: notFoundAbilities });

                  } else {
                    var perms = perm.permissions || [];
                    perms.forEach(function (permission) {
                      if (perms.indexOf(permission) !== -1) {
                        permissionsSlugs.push(permission);
                      }
                    });
                  }
                });

                if (notFoundPermissions.length > 0) {
                  errorReasons.push({
                    type: 'PERMISSIONS_SLUG_NOT_FOUND',
                    code: 200,
                    permissions: notFoundPermissions });

                }if (!(
                errorReasons.length > 0)) {_context2.next = 20;break;}return _context2.abrupt("return",
                res.boom.badRequest(null, { errors: errorReasons }));case 20:_context2.next = 22;return (



                  Promise.all([
                  _models_Resource__WEBPACK_IMPORTED_MODULE_11__["default"].query(function (query) {query.whereIn('name', resourcesSlugs);}).fetchAll(),
                  _models_Permission__WEBPACK_IMPORTED_MODULE_10__["default"].query(function (query) {query.whereIn('name', permissionsSlugs);}).fetchAll()]));case 22:_ref5 = _context2.sent;_ref6 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2___default()(_ref5, 2);resourcesCollection = _ref6[0];permsCollection = _ref6[1];


                notStoredResources = Object(lodash__WEBPACK_IMPORTED_MODULE_7__["difference"])(
                resourcesSlugs, resourcesCollection.map(function (s) {return s.name;}));

                notStoredPermissions = Object(lodash__WEBPACK_IMPORTED_MODULE_7__["difference"])(
                permissionsSlugs, permsCollection.map(function (perm) {return perm.slug;}));

                insertThread = [];

                if (notStoredResources.length > 0) {
                  insertThread.push(Object(_database_knex__WEBPACK_IMPORTED_MODULE_12__["default"])('resources').insert(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1___default()(
                  notStoredResources.map(function (resource) {return { name: resource };}))));

                }
                if (notStoredPermissions.length > 0) {
                  insertThread.push(Object(_database_knex__WEBPACK_IMPORTED_MODULE_12__["default"])('permissions').insert(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1___default()(
                  notStoredPermissions.map(function (permission) {return { name: permission };}))));

                }_context2.next = 33;return (

                  Promise.all(insertThread));case 33:_context2.next = 35;return (

                  Promise.all([
                  _models_Permission__WEBPACK_IMPORTED_MODULE_10__["default"].query(function (q) {q.whereIn('name', permissionsSlugs);}).fetchAll(),
                  _models_Resource__WEBPACK_IMPORTED_MODULE_11__["default"].query(function (q) {q.whereIn('name', resourcesSlugs);}).fetchAll()]));case 35:_ref7 = _context2.sent;_ref8 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2___default()(_ref7, 2);storedPermissions = _ref8[0];storedResources = _ref8[1];


                storedResourcesSet = new Map(storedResources.map(function (resource) {return [
                  resource.attributes.name, resource.attributes.id];}));

                storedPermissionsSet = new Map(storedPermissions.map(function (perm) {return [
                  perm.attributes.name, perm.attributes.id];}));_context2.next = 43;return (


                  role.save());case 43:_context2.next = 45;return (


                  Object(_database_knex__WEBPACK_IMPORTED_MODULE_12__["default"])('role_has_permissions').where({
                    role_id: role.id }));case 45:savedRoleHasPerms = _context2.sent;


                console.log(savedRoleHasPerms);

                // const roleHasPerms = permissions.map((resource) => resource.permissions.map((perm) => ({
                //   role_id: role.id,
                //   resource_id: storedResourcesSet.get(resource.resource_slug),
                //   permission_id: storedPermissionsSet.get(perm),
                // })));

                // if (roleHasPerms.length > 0) {
                //   await knex('role_has_permissions').insert(roleHasPerms[0]);
                // }
                return _context2.abrupt("return", res.status(200).send({ id: role.get('id') }));case 48:case "end":return _context2.stop();}}}, _callee2);}));function handler(_x3, _x4) {return _handler2.apply(this, arguments);}return handler;}() },



  deleteRole: {
    validation: [],
    handler: function () {var _handler3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(req, res) {var id, role;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                id = req.params.id;_context3.next = 3;return (
                  _models_Role__WEBPACK_IMPORTED_MODULE_9__["default"].where('id', id).fetch());case 3:role = _context3.sent;if (

                role) {_context3.next = 6;break;}return _context3.abrupt("return",
                res.boom.notFound());case 6:if (!

                role.attributes.predefined) {_context3.next = 8;break;}return _context3.abrupt("return",
                res.boom.badRequest(null, {
                  errors: [{ type: 'ROLE_PREDEFINED', code: 100 }] }));case 8:_context3.next = 10;return (



                  Object(_database_knex__WEBPACK_IMPORTED_MODULE_12__["default"])('role_has_permissions').
                  where('role_id', role.id)["delete"]({ require: false }));case 10:_context3.next = 12;return (

                  role.destroy());case 12:return _context3.abrupt("return",

                res.status(200).send());case 13:case "end":return _context3.stop();}}}, _callee3);}));function handler(_x5, _x6) {return _handler3.apply(this, arguments);}return handler;}() },



  getRole: {
    validation: [],
    handler: function handler(req, res) {
      return res.status(200).send();
    } } });

/***/ }),

/***/ "./src/http/controllers/Suppliers.js":
/*!*******************************************!*\
  !*** ./src/http/controllers/Suppliers.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);


/* harmony default export */ __webpack_exports__["default"] = ({

  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();

    return router;
  } });

/***/ }),

/***/ "./src/http/controllers/Users.js":
/*!***************************************!*\
  !*** ./src/http/controllers/Users.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! express-validator */ "express-validator");
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(express_validator__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _models_User__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/models/User */ "./src/models/User.js");
/* harmony import */ var _http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/http/middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
/* harmony import */ var _http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/http/middleware/jwtAuth */ "./src/http/middleware/jwtAuth.js");
/* harmony import */ var _http_middleware_authorization__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/http/middleware/authorization */ "./src/http/middleware/authorization.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}






/* harmony default export */ __webpack_exports__["default"] = ({

  /**
                  * Router constructor.
                  */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_3___default.a.Router();
    var permit = Object(_http_middleware_authorization__WEBPACK_IMPORTED_MODULE_8__["default"])('users');

    router.use(_http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_7__["default"]);

    router.post('/',
    permit('create'),
    this.newUser.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.newUser.handler));

    router.post('/:id',
    permit('create', 'edit'),
    this.editUser.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.editUser.handler));

    router.get('/',
    permit('view'),
    this.listUsers.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.listUsers.handler));

    router.get('/:id',
    permit('view'),
    this.getUser.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.getUser.handler));

    router["delete"]('/:id',
    permit('create', 'edit', 'delete'),
    this.deleteUser.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.deleteUser.handler));

    return router;
  },

  /**
      * Creates a new user.
      */
  newUser: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('first_name').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('last_name').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('email').exists().isEmail(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('phone_number').optional().isMobilePhone(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('password').isLength({ min: 4 }).exists().custom(function (value, _ref) {var req = _ref.req;
      if (value !== req.body.confirm_password) {
        throw new Error("Passwords don't match");
      } else {
        return value;
      }
    }),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('status').exists().isBoolean().toBoolean()],

    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(req, res) {var validationErrors, _req$body, email, phoneNumber, foundUsers, foundUserEmail, foundUserPhone, errorReasons, user;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context.next = 3;break;}return _context.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:_req$body =


                req.body, email = _req$body.email, phoneNumber = _req$body.phone_number;_context.next = 6;return (

                  _models_User__WEBPACK_IMPORTED_MODULE_5__["default"].query(function (query) {
                    query.where('email', email);
                    query.orWhere('phone_number', phoneNumber);
                  }).fetchAll());case 6:foundUsers = _context.sent;

                foundUserEmail = foundUsers.find(function (u) {return u.attributes.email === email;});
                foundUserPhone = foundUsers.find(function (u) {return u.attributes.phone_number === phoneNumber;});

                errorReasons = [];

                if (foundUserEmail) {
                  errorReasons.push({ type: 'EMAIL_ALREADY_EXIST', code: 100 });
                }
                if (foundUserPhone) {
                  errorReasons.push({ type: 'PHONE_NUMBER_ALREADY_EXIST', code: 120 });
                }if (!(
                errorReasons.length > 0)) {_context.next = 14;break;}return _context.abrupt("return",
                res.boom.badRequest(null, { errors: errorReasons }));case 14:


                user = _models_User__WEBPACK_IMPORTED_MODULE_5__["default"].forge({
                  first_name: req.body.first_name,
                  last_name: req.body.last_name,
                  email: req.body.email,
                  phone_number: req.body.phone_number,
                  active: req.body.status });_context.next = 17;return (


                  user.save());case 17:return _context.abrupt("return",

                res.status(200).send({ id: user.get('id') }));case 18:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                    * Edit details of the given user.
                                                                                                                                                                                                                    */
  editUser: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('first_name').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('last_name').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('email').exists().isEmail(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('phone_number').optional().isMobilePhone(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('password').isLength({ min: 4 }).exists().custom(function (value, _ref2) {var req = _ref2.req;
      if (value !== req.body.confirm_password) {
        throw new Error("Passwords don't match");
      } else {
        return value;
      }
    }),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('status').exists().isBoolean().toBoolean()],

    handler: function () {var _handler2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(req, res) {var id, validationErrors, user, _req$body2, email, phoneNumber, foundUsers, foundUserEmail, foundUserPhone, errorReasons;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                id = req.params.id;
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context2.next = 4;break;}return _context2.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 4:_context2.next = 6;return (


                  _models_User__WEBPACK_IMPORTED_MODULE_5__["default"].where('id', id).fetch());case 6:user = _context2.sent;if (

                user) {_context2.next = 9;break;}return _context2.abrupt("return",
                res.boom.notFound());case 9:_req$body2 =

                req.body, email = _req$body2.email, phoneNumber = _req$body2.phone_number;_context2.next = 12;return (

                  _models_User__WEBPACK_IMPORTED_MODULE_5__["default"].query(function (query) {
                    query.whereNot('id', id);
                    query.where('email', email);
                    query.orWhere('phone_number', phoneNumber);
                  }).fetchAll());case 12:foundUsers = _context2.sent;

                foundUserEmail = foundUsers.find(function (u) {return u.attribues.email === email;});
                foundUserPhone = foundUsers.find(function (u) {return u.attribues.phone_number === phoneNumber;});

                errorReasons = [];

                if (foundUserEmail) {
                  errorReasons.push({ type: 'EMAIL_ALREADY_EXIST', code: 100 });
                }
                if (foundUserPhone) {
                  errorReasons.push({ type: 'PHONE_NUMBER_ALREADY_EXIST', code: 120 });
                }if (!(
                errorReasons.length > 0)) {_context2.next = 20;break;}return _context2.abrupt("return",
                res.badRequest(null, { errors: errorReasons }));case 20:_context2.next = 22;return (


                  user.save({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    phone_number: req.body.phone_number,
                    status: req.body.status }));case 22:return _context2.abrupt("return",


                res.status(200).send());case 23:case "end":return _context2.stop();}}}, _callee2);}));function handler(_x3, _x4) {return _handler2.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                  * Soft deleting the given user.
                                                                                                                                                                                                  */
  deleteUser: {
    validation: [],
    handler: function () {var _handler3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(req, res) {var id, user;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                id = req.params.id;_context3.next = 3;return (
                  _models_User__WEBPACK_IMPORTED_MODULE_5__["default"].where('id', id).fetch());case 3:user = _context3.sent;if (

                user) {_context3.next = 6;break;}return _context3.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'USER_NOT_FOUND', code: 100 }] }));case 6:_context3.next = 8;return (



                  user.destroy());case 8:return _context3.abrupt("return",
                res.status(200).send());case 9:case "end":return _context3.stop();}}}, _callee3);}));function handler(_x5, _x6) {return _handler3.apply(this, arguments);}return handler;}() },



  getUser: {
    validation: [],
    handler: function () {var _handler4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(req, res) {var id, user;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                id = req.params.id;_context4.next = 3;return (
                  _models_User__WEBPACK_IMPORTED_MODULE_5__["default"].where('id', id).fetch());case 3:user = _context4.sent;if (

                user) {_context4.next = 6;break;}return _context4.abrupt("return",
                res.boom.notFound());case 6:return _context4.abrupt("return",


                res.status(200).send({ item: user.toJSON() }));case 7:case "end":return _context4.stop();}}}, _callee4);}));function handler(_x7, _x8) {return _handler4.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                        * Retrieve the list of users.
                                                                                                                                                                                                                        */
  listUsers: {
    validation: [],
    handler: function handler(req, res) {
      var filter = _objectSpread({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',

        page_size: 10,
        page: 1 },
      req.query);


      var users = _models_User__WEBPACK_IMPORTED_MODULE_5__["default"].query(function (query) {
        if (filter.first_name) {
          query.where('first_name', filter.first_name);
        }
        if (filter.last_name) {
          query.where('last_name', filter.last_name);
        }
        if (filter.email) {
          query.where('email', filter.email);
        }
        if (filter.phone_number) {
          query.where('phone_number', filter.phone_number);
        }
      }).fetchPage({
        page_size: filter.page_size,
        page: filter.page });


      return res.status(200).send({
        items: users.toJSON(),
        pagination: users.pagination });

    } } });

/***/ }),

/***/ "./src/http/controllers/Views.js":
/*!***************************************!*\
  !*** ./src/http/controllers/Views.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! express-validator */ "express-validator");
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(express_validator__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/http/middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
/* harmony import */ var _models_Resource__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/models/Resource */ "./src/models/Resource.js");
/* harmony import */ var _models_View__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../models/View */ "./src/models/View.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}






/* harmony default export */ __webpack_exports__["default"] = ({
  resource: 'items',

  /**
                      * Router constructor.
                      */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_4___default.a.Router();

    router.post('/',
    this.createView.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.createView.handler));

    router.post('/:view_id',
    this.editView.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.editView.handler));

    router["delete"]('/:view_id',
    this.deleteView.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.deleteView.handler));

    router.get('/:view_id',
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.getView.handler));

    return router;
  },

  /**
      * List all views that associated with the given resource.
      */
  listViews: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('resource_name').optional().trim().escape()],

    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee(req, res) {var resourceId, views;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                resourceId = req.params.resource_id;_context.next = 3;return (
                  _models_View__WEBPACK_IMPORTED_MODULE_8__["default"].where('resource_id', resourceId).fetchAll());case 3:views = _context.sent;return _context.abrupt("return",

                res.status(200).send({ views: views.toJSON() }));case 5:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },



  getView: {
    handler: function () {var _handler2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee2(req, res) {var viewId, view;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                viewId = req.params.view_id;_context2.next = 3;return (
                  _models_View__WEBPACK_IMPORTED_MODULE_8__["default"].where('id', viewId).fetch({
                    withRelated: ['resource', 'columns', 'viewRoles'] }));case 3:view = _context2.sent;if (


                view) {_context2.next = 6;break;}return _context2.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'ROLE_NOT_FOUND', code: 100 }] }));case 6:return _context2.abrupt("return",


                res.status(200).send(_objectSpread({}, view.toJSON())));case 7:case "end":return _context2.stop();}}}, _callee2);}));function handler(_x3, _x4) {return _handler2.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                                 * Delete the given view of the resource.
                                                                                                                                                                                                                                 */
  deleteView: {
    validation: [],
    handler: function () {var _handler3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee3(req, res) {var viewId, view;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                viewId = req.params.view_id;_context3.next = 3;return (
                  _models_View__WEBPACK_IMPORTED_MODULE_8__["default"].where('id', viewId).fetch({
                    withRelated: ['viewRoles', 'columns'] }));case 3:view = _context3.sent;if (


                view) {_context3.next = 6;break;}return _context3.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'VIEW_NOT_FOUND', code: 100 }] }));case 6:if (!


                view.attributes.predefined) {_context3.next = 8;break;}return _context3.abrupt("return",
                res.boom.badRequest(null, {
                  errors: [{ type: 'PREDEFINED_VIEW', code: 200 }] }));case 8:_context3.next = 10;return (



                  view.destroy());case 10:return _context3.abrupt("return",



                res.status(200).send({ id: view.get('id') }));case 11:case "end":return _context3.stop();}}}, _callee3);}));function handler(_x5, _x6) {return _handler3.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                        * Creates a new view.
                                                                                                                                                                                                                        */
  createView: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('resource_name').exists().escape().trim(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('label').exists().escape().trim(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('columns').isArray({ min: 3 }),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles').isArray(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles.*.field').exists().escape().trim(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles.*.comparator').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles.*.value').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles.*.index').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('columns').exists().isArray(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('columns.*').exists().escape().trim()],

    handler: function () {var _handler4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee4(req, res) {var validationErrors, form, resource, errorReasons, fieldsSlugs, resourceFields, resourceFieldsKeys, notFoundFields, notFoundColumns, view;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context4.next = 3;break;}return _context4.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:



                form = _objectSpread({}, req.body);_context4.next = 6;return (
                  _models_Resource__WEBPACK_IMPORTED_MODULE_7__["default"].query().where('name', form.resource_name).first());case 6:resource = _context4.sent;if (

                resource) {_context4.next = 9;break;}return _context4.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'RESOURCE_NOT_FOUND', code: 100 }] }));case 9:


                errorReasons = [];
                fieldsSlugs = form.roles.map(function (role) {return role.field;});_context4.next = 13;return (

                  resource.fields().fetch());case 13:resourceFields = _context4.sent;
                resourceFieldsKeys = resourceFields.map(function (f) {return f.get('key');});
                notFoundFields = Object(lodash__WEBPACK_IMPORTED_MODULE_3__["difference"])(fieldsSlugs, resourceFieldsKeys);

                if (notFoundFields.length > 0) {
                  errorReasons.push({ type: 'RESOURCE_FIELDS_NOT_EXIST', code: 100, fields: notFoundFields });
                }
                notFoundColumns = Object(lodash__WEBPACK_IMPORTED_MODULE_3__["difference"])(form.columns, resourceFieldsKeys);

                if (notFoundColumns.length > 0) {
                  errorReasons.push({ type: 'COLUMNS_NOT_EXIST', code: 200, fields: notFoundColumns });
                }if (!(
                errorReasons.length > 0)) {_context4.next = 21;break;}return _context4.abrupt("return",
                res.boom.badRequest(null, { errors: errorReasons }));case 21:_context4.next = 23;return (


                  _models_View__WEBPACK_IMPORTED_MODULE_8__["default"].query().insert({
                    name: form.label,
                    predefined: false }));case 23:view = _context4.sent;_context4.next = 26;return (



                  view.save());case 26:return _context4.abrupt("return",






                res.status(200).send());case 27:case "end":return _context4.stop();}}}, _callee4);}));function handler(_x7, _x8) {return _handler4.apply(this, arguments);}return handler;}() },




  editView: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('label').exists().escape().trim(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('columns').isArray({ min: 3 }),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles').isArray(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles.*.field').exists().escape().trim(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles.*.comparator').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles.*.value').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles.*.index').exists().isNumeric().toInt()],

    handler: function () {var _handler5 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee5(req, res) {var viewId, validationErrors, view;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
                viewId = req.params.view_id;
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context5.next = 4;break;}return _context5.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 4:_context5.next = 6;return (


                  _models_View__WEBPACK_IMPORTED_MODULE_8__["default"].where('id', viewId).fetch());case 6:view = _context5.sent;if (

                view) {_context5.next = 9;break;}return _context5.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'ROLE_NOT_FOUND', code: 100 }] }));case 9:return _context5.abrupt("return",



                res.status(200).send());case 10:case "end":return _context5.stop();}}}, _callee5);}));function handler(_x9, _x10) {return _handler5.apply(this, arguments);}return handler;}() } });

/***/ }),

/***/ "./src/http/index.js":
/*!***************************!*\
  !*** ./src/http/index.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _http_controllers_Authentication__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/http/controllers/Authentication */ "./src/http/controllers/Authentication.js");
/* harmony import */ var _http_controllers_Users__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/http/controllers/Users */ "./src/http/controllers/Users.js");
/* harmony import */ var _http_controllers_Roles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/http/controllers/Roles */ "./src/http/controllers/Roles.js");
/* harmony import */ var _http_controllers_Items__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/http/controllers/Items */ "./src/http/controllers/Items.js");
/* harmony import */ var _http_controllers_ItemCategories__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/http/controllers/ItemCategories */ "./src/http/controllers/ItemCategories.js");
/* harmony import */ var _http_controllers_Accounts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/http/controllers/Accounts */ "./src/http/controllers/Accounts.js");
/* harmony import */ var _http_controllers_AccountOpeningBalance__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/http/controllers/AccountOpeningBalance */ "./src/http/controllers/AccountOpeningBalance.js");
/* harmony import */ var _http_controllers_Views__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/http/controllers/Views */ "./src/http/controllers/Views.js");
/* harmony import */ var _http_controllers_Fields__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/http/controllers/Fields */ "./src/http/controllers/Fields.js");
/* harmony import */ var _http_controllers_Accounting__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/http/controllers/Accounting */ "./src/http/controllers/Accounting.js");
/* harmony import */ var _http_controllers_FinancialStatements__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/http/controllers/FinancialStatements */ "./src/http/controllers/FinancialStatements.js");
/* harmony import */ var _http_controllers_Expenses__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/http/controllers/Expenses */ "./src/http/controllers/Expenses.js");
/* harmony import */ var _http_controllers_Options__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @/http/controllers/Options */ "./src/http/controllers/Options.js");
/* harmony import */ var _http_controllers_Budget__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @/http/controllers/Budget */ "./src/http/controllers/Budget.js");
/* harmony import */ var _http_controllers_Customers__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @/http/controllers/Customers */ "./src/http/controllers/Customers.js");
/* harmony import */ var _http_controllers_Suppliers__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @/http/controllers/Suppliers */ "./src/http/controllers/Suppliers.js");
/* harmony import */ var _http_controllers_Bills__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @/http/controllers/Bills */ "./src/http/controllers/Bills.js");
/* harmony import */ var _controllers_CurrencyAdjustment__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./controllers/CurrencyAdjustment */ "./src/http/controllers/CurrencyAdjustment.js");
// import OAuth2 from '@/http/controllers/OAuth2';


















// import SalesReports from '@/http/controllers/SalesReports';
// import PurchasesReports from '@/http/controllers/PurchasesReports';

/* harmony default export */ __webpack_exports__["default"] = (function (app) {
  // app.use('/api/oauth2', OAuth2.router());
  app.use('/api/auth', _http_controllers_Authentication__WEBPACK_IMPORTED_MODULE_0__["default"].router());
  app.use('/api/users', _http_controllers_Users__WEBPACK_IMPORTED_MODULE_1__["default"].router());
  app.use('/api/roles', _http_controllers_Roles__WEBPACK_IMPORTED_MODULE_2__["default"].router());
  app.use('/api/accounts', _http_controllers_Accounts__WEBPACK_IMPORTED_MODULE_5__["default"].router());
  app.use('/api/accounting', _http_controllers_Accounting__WEBPACK_IMPORTED_MODULE_9__["default"].router());
  app.use('/api/accounts_opeing_balance', _http_controllers_AccountOpeningBalance__WEBPACK_IMPORTED_MODULE_6__["default"].router());
  app.use('/api/views', _http_controllers_Views__WEBPACK_IMPORTED_MODULE_7__["default"].router());
  app.use('/api/fields', _http_controllers_Fields__WEBPACK_IMPORTED_MODULE_8__["default"].router());
  app.use('/api/items', _http_controllers_Items__WEBPACK_IMPORTED_MODULE_3__["default"].router());
  app.use('/api/item_categories', _http_controllers_ItemCategories__WEBPACK_IMPORTED_MODULE_4__["default"].router());
  app.use('/api/expenses', _http_controllers_Expenses__WEBPACK_IMPORTED_MODULE_11__["default"].router());
  app.use('/api/financial_statements', _http_controllers_FinancialStatements__WEBPACK_IMPORTED_MODULE_10__["default"].router());
  app.use('/api/options', _http_controllers_Options__WEBPACK_IMPORTED_MODULE_12__["default"].router());
  // app.use('/api/customers', Customers.router());
  // app.use('/api/suppliers', Suppliers.router());
  // app.use('/api/bills', Bills.router());
  app.use('/api/budget', _http_controllers_Budget__WEBPACK_IMPORTED_MODULE_13__["default"].router());
  // app.use('/api/currency_adjustment', CurrencyAdjustment.router());
  // app.use('/api/reports/sales', SalesReports.router());
  // app.use('/api/reports/purchases', PurchasesReports.router());
});

/***/ }),

/***/ "./src/http/middleware/asyncMiddleware.js":
/*!************************************************!*\
  !*** ./src/http/middleware/asyncMiddleware.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var asyncMiddleware = function asyncMiddleware(fn) {return function (req, res, next) {
    Promise.resolve(fn(req, res, next))["catch"](
    function (error) {
      console.log(error);
      next(error);
    });
  };};

/* harmony default export */ __webpack_exports__["default"] = (asyncMiddleware);

/***/ }),

/***/ "./src/http/middleware/authorization.js":
/*!**********************************************!*\
  !*** ./src/http/middleware/authorization.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* eslint-disable consistent-return */
var authorization = function authorization(resourceName) {return function () {for (var _len = arguments.length, permissions = new Array(_len), _key = 0; _key < _len; _key++) {permissions[_key] = arguments[_key];}return function (req, res, next) {var
      user = req.user;
      var onError = function onError() {
        res.boom.unauthorized();
      };
      user.hasPermissions(resourceName, permissions).
      then(function (authorized) {
        if (!authorized) {
          return onError();
        }
        next();
      })["catch"](onError);
    };};};

/* harmony default export */ __webpack_exports__["default"] = (authorization);

/***/ }),

/***/ "./src/http/middleware/jwtAuth.js":
/*!****************************************!*\
  !*** ./src/http/middleware/jwtAuth.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _models_User__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/models/User */ "./src/models/User.js");
 /* eslint-disable consistent-return */


// import Auth from '@/models/Auth';

var authMiddleware = function authMiddleware(req, res, next) {var
  JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  var token = req.headers['x-access-token'] || req.query.token;

  var onError = function onError() {
    // Auth.loggedOut();
    res.status(401).send({
      success: false,
      message: 'unauthorized' });

  };

  if (!token) {
    return onError();
  }

  var verify = new Promise(function (resolve, reject) {
    jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default.a.verify(token, JWT_SECRET_KEY, /*#__PURE__*/function () {var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(error, decoded) {return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (!
                error) {_context.next = 4;break;}
                reject(error);_context.next = 10;break;case 4:_context.next = 6;return (


                  _models_User__WEBPACK_IMPORTED_MODULE_3__["default"].query().findById(decoded._id));case 6:req.user = _context.sent;if (


                req.user) {_context.next = 9;break;}return _context.abrupt("return",
                onError());case 9:

                resolve(decoded);case 10:case "end":return _context.stop();}}}, _callee);}));return function (_x, _x2) {return _ref.apply(this, arguments);};}());


  });

  verify.then(function () {next();})["catch"](onError);
};
/* harmony default export */ __webpack_exports__["default"] = (authMiddleware);

/***/ }),

/***/ "./src/lib/Metable/MetableCollection.js":
/*!**********************************************!*\
  !*** ./src/lib/Metable/MetableCollection.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MetableCollection; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__);
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}var
MetableCollection = /*#__PURE__*/function () {
  function MetableCollection() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default()(this, MetableCollection);
    this.metadata = [];
    this.KEY_COLUMN = 'key';
    this.VALUE_COLUMN = 'value';
    this.TYPE_COLUMN = 'type';
    this.model = null;
  }

  /**
     * Set model of this metadata collection.
     * @param {Object} model -
     */_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(MetableCollection, [{ key: "setModel", value: function setModel(
    model) {
      this.model = model;
    }

    /**
       * Find the given metadata key.
       * @param {String} key -
       * @return {object} - Metadata object.
       */ }, { key: "findMeta", value: function findMeta(
    key) {
      return this.allMetadata().find(function (meta) {return meta.key === key;});
    }

    /**
       * Retrieve all metadata.
       */ }, { key: "allMetadata", value: function allMetadata()
    {
      return this.metadata.filter(function (meta) {return !meta.markAsDeleted;});
    }

    /**
       * Retrieve metadata of the given key.
       * @param {String} key -
       * @param {Mixied} defaultValue -
       */ }, { key: "getMeta", value: function getMeta(
    key, defaultValue) {
      var metadata = this.findMeta(key);
      return metadata ? metadata.value : defaultValue || false;
    }

    /**
       * Markes the metadata to should be deleted.
       * @param {String} key -
       */ }, { key: "removeMeta", value: function removeMeta(
    key) {
      var metadata = this.findMeta(key);

      if (metadata) {
        metadata.markAsDeleted = true;
      }
    }

    /**
       * Remove all meta data of the given group.
       * @param {*} group
       */ }, { key: "removeAllMeta", value: function removeAllMeta()
    {var group = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
      this.metadata.forEach(function (meta) {
        meta.markAsDeleted = true;
      });
    }

    /**
       * Set the meta data to the stack.
       * @param {String} key -
       * @param {String} value -
       */ }, { key: "setMeta", value: function setMeta(
    key, value, payload) {var _this = this;
      if (Array.isArray(key)) {
        var _metadata = key;

        _metadata.forEach(function (meta) {
          _this.setMeta(meta.key, meta.value);
        });
        return;
      }
      var metadata = this.findMeta(key);

      if (metadata) {
        metadata.value = value;
        metadata.markAsUpdated = true;
      } else {
        this.metadata.push(_objectSpread({
          value: value, key: key }, payload, { markAsInserted: true }));

      }
    }

    /**
       * Saved the modified/deleted and inserted metadata.
       */ }, { key: "saveMeta", value: function () {var _saveMeta = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {var _this2 = this;var inserted, updated, deleted, opers, deleteOper;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:

                inserted = this.metadata.filter(function (m) {return m.markAsInserted === true;});
                updated = this.metadata.filter(function (m) {return m.markAsUpdated === true;});
                deleted = this.metadata.filter(function (m) {return m.markAsDeleted === true;});
                opers = [];

                if (deleted.length > 0) {
                  deleteOper = this.model.query().
                  whereIn('key', deleted.map(function (meta) {return meta.key;}))["delete"]();

                  opers.push(deleteOper);
                }
                inserted.forEach(function (meta) {var _this2$model$query$in;
                  var insertOper = _this2.model.query().insert((_this2$model$query$in = {}, _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(_this2$model$query$in,
                  _this2.KEY_COLUMN, meta.key), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(_this2$model$query$in,
                  _this2.VALUE_COLUMN, meta.value), _this2$model$query$in));

                  opers.push(insertOper);
                });_context.next = 8;return (
                  Promise.all(opers));case 8:case "end":return _context.stop();}}}, _callee, this);}));function saveMeta() {return _saveMeta.apply(this, arguments);}return saveMeta;}()


    /**
                                                                                                                                                                                          * Loads the metadata from the storage.
                                                                                                                                                                                          * @param {String|Array} key -
                                                                                                                                                                                          * @param {Boolean} force -
                                                                                                                                                                                          */ }, { key: "load", value: function () {var _load = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2() {var _this3 = this;var metadata, metadataArray;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (

                  this.query());case 2:metadata = _context2.sent;

                metadataArray = this.mapMetadataCollection(metadata);
                metadataArray.forEach(function (meta) {
                  _this3.metadata.push(meta);
                });case 5:case "end":return _context2.stop();}}}, _callee2, this);}));function load() {return _load.apply(this, arguments);}return load;}()


    /**
                                                                                                                                                             * Format the metadata before saving to the database.
                                                                                                                                                             * @param {String|Number|Boolean} value -
                                                                                                                                                             * @param {String} valueType -
                                                                                                                                                             * @return {String|Number|Boolean} -
                                                                                                                                                             */ }, { key: "mapMetadata",




















    /**
                                                                                                                                                                                          * Mapping and parse metadata to collection entries.
                                                                                                                                                                                          * @param {Meta} attr -
                                                                                                                                                                                          * @param {String} parseType -
                                                                                                                                                                                          */value: function mapMetadata(
    attr) {var parseType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'parse';
      return _objectSpread({
        key: attr[this.KEY_COLUMN],
        value: parseType === 'parse' ?
        MetableCollection.parseMetaValue(
        attr[this.VALUE_COLUMN],
        this.TYPE_COLUMN ? attr[this.TYPE_COLUMN] : false) :

        MetableCollection.formatMetaValue(
        attr[this.VALUE_COLUMN],
        this.TYPE_COLUMN ? attr[this.TYPE_COLUMN] : false) },

      this.extraColumns.map(function (extraCol) {return _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()({},
        extraCol, attr[extraCol] || null);}));


    }

    /**
       * Parse the metadata to the collection.
       * @param {Array} collection -
       */ }, { key: "mapMetadataToCollection", value: function mapMetadataToCollection(
    metadata) {var _this4 = this;var parseType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'parse';
      return metadata.map(function (model) {return _this4.mapMetadataToCollection(model, parseType);});
    }

    /**
       * Load metadata to the metable collection.
       * @param {Array} meta -
       */ }, { key: "from", value: function from(
    meta) {var _this5 = this;
      if (Array.isArray(meta)) {
        meta.forEach(function (m) {_this5.from(m);});
        return;
      }
      this.metadata.push(meta);
    }

    /**
       * Static method to load metadata to the collection.
       * @param {Array} meta 
       */ }], [{ key: "formatMetaValue", value: function formatMetaValue(value, valueType) {var parsedValue;switch (valueType) {case 'number':parsedValue = "".concat(value);break;case 'boolean':parsedValue = value ? '1' : '0';break;case 'json':parsedValue = JSON.stringify(parsedValue);break;default:parsedValue = value;break;}return parsedValue;} }, { key: "from", value: function from(
    meta) {
      var collection = new MetableCollection();
      collection.from(meta);

      return collection;
    } }]);return MetableCollection;}();

/***/ }),

/***/ "./src/models/Account.js":
/*!*******************************!*\
  !*** ./src/models/Account.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Account; });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "@babel/runtime/helpers/possibleConstructorReturn");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "@babel/runtime/helpers/getPrototypeOf");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "@babel/runtime/helpers/inherits");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! objection */ "objection");
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(objection__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _models_Model__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/models/Model */ "./src/models/Model.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;} /* eslint-disable global-require */


var

Account = /*#__PURE__*/function (_BaseModel) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(Account, _BaseModel);function Account() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, Account);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(Account).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(Account, null, [{ key: "collectJournalEntries", value: function collectJournalEntries(



































































    accounts) {
      return Object(lodash__WEBPACK_IMPORTED_MODULE_7__["flatten"])(accounts.map(function (account) {return account.transactions.map(function (transaction) {return _objectSpread({
            accountId: account.id },
          transaction, {
            accountNormal: account.type.normal });});}));

    } }, { key: "tableName", /**
                              * Table name
                              */get: function get() {return 'accounts';} /**
                                                                          * Model modifiers.
                                                                          */ }, { key: "modifiers", get: function get() {return { filterAccountTypes: function filterAccountTypes(query, typesIds) {if (typesIds.length > 0) {query.whereIn('accoun_type_id', typesIds);}} };} /**
                                                                                                                                                                                                                                                                                * Relationship mapping.
                                                                                                                                                                                                                                                                                */ }, { key: "relationMappings", get: function get() {var AccountType = __webpack_require__(/*! @/models/AccountType */ "./src/models/AccountType.js");var AccountBalance = __webpack_require__(/*! @/models/AccountBalance */ "./src/models/AccountBalance.js");var AccountTransaction = __webpack_require__(/*! @/models/AccountTransaction */ "./src/models/AccountTransaction.js");return { /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Account model may belongs to account type.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */type: { relation: objection__WEBPACK_IMPORTED_MODULE_6__["Model"].BelongsToOneRelation, modelClass: AccountType["default"], join: { from: 'accounts.accountTypeId', to: 'account_types.id' } }, /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Account model may has many balances accounts.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   */balance: { relation: objection__WEBPACK_IMPORTED_MODULE_6__["Model"].HasOneRelation, modelClass: AccountBalance["default"], join: { from: 'accounts.id', to: 'account_balance.accountId' } }, /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Account model may has many transactions.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */transactions: { relation: objection__WEBPACK_IMPORTED_MODULE_6__["Model"].HasManyRelation, modelClass: AccountTransaction["default"], join: { from: 'accounts.id', to: 'accounts_transactions.accountId' } } };} }]);return Account;}(_models_Model__WEBPACK_IMPORTED_MODULE_8__["default"]);

/***/ }),

/***/ "./src/models/AccountBalance.js":
/*!**************************************!*\
  !*** ./src/models/AccountBalance.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return AccountBalance; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "@babel/runtime/helpers/possibleConstructorReturn");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "@babel/runtime/helpers/getPrototypeOf");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "@babel/runtime/helpers/inherits");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! objection */ "objection");
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(objection__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _models_Model__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/models/Model */ "./src/models/Model.js");

var

AccountBalance = /*#__PURE__*/function (_BaseModel) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(AccountBalance, _BaseModel);function AccountBalance() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, AccountBalance);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(AccountBalance).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(AccountBalance, null, [{ key: "tableName",
    /**
                                                                                                                                                                                                                                                                                                                      * Table name
                                                                                                                                                                                                                                                                                                                      */get: function get()
    {
      return 'account_balance';
    }

    /**
       * Relationship mapping.
       */ }, { key: "relationMappings", get: function get()
    {
      var Account = __webpack_require__(/*! @/models/Account */ "./src/models/Account.js");

      return {
        account: {
          relation: objection__WEBPACK_IMPORTED_MODULE_5__["Model"].BelongsToOneRelation,
          modelClass: Account["default"],
          join: {
            from: 'account_balance.account_id',
            to: 'accounts.id' } } };



    } }]);return AccountBalance;}(_models_Model__WEBPACK_IMPORTED_MODULE_6__["default"]);

/***/ }),

/***/ "./src/models/AccountTransaction.js":
/*!******************************************!*\
  !*** ./src/models/AccountTransaction.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return AccountTransaction; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "@babel/runtime/helpers/possibleConstructorReturn");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "@babel/runtime/helpers/getPrototypeOf");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "@babel/runtime/helpers/inherits");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! objection */ "objection");
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(objection__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _models_Model__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/models/Model */ "./src/models/Model.js");


var

AccountTransaction = /*#__PURE__*/function (_BaseModel) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(AccountTransaction, _BaseModel);function AccountTransaction() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, AccountTransaction);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(AccountTransaction).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(AccountTransaction, null, [{ key: "tableName",
    /**
                                                                                                                                                                                                                                                                                                                                              * Table name
                                                                                                                                                                                                                                                                                                                                              */get: function get()
    {
      return 'accounts_transactions';
    }

    /**
       * Model modifiers.
       */ }, { key: "modifiers", get: function get()
    {
      return {
        filterAccounts: function filterAccounts(query, accountsIds) {
          if (accountsIds.length > 0) {
            query.whereIn('account_id', accountsIds);
          }
        },
        filterTransactionTypes: function filterTransactionTypes(query, types) {
          if (Array.isArray(types) && types.length > 0) {
            query.whereIn('reference_type', types);
          } else if (typeof types === 'string') {
            query.where('reference_type', types);
          }
        },
        filterDateRange: function filterDateRange(query, startDate, endDate) {var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'day';
          var dateFormat = 'YYYY-MM-DD HH:mm:ss';
          var fromDate = moment__WEBPACK_IMPORTED_MODULE_6___default()(startDate).startOf(type).format(dateFormat);
          var toDate = moment__WEBPACK_IMPORTED_MODULE_6___default()(endDate).endOf(type).format(dateFormat);

          if (startDate) {
            query.where('date', '>=', fromDate);
          }
          if (endDate) {
            query.where('date', '<=', toDate);
          }
        },
        filterAmountRange: function filterAmountRange(query, fromAmount, toAmount) {
          if (fromAmount) {
            query.andWhere(function (q) {
              q.where('credit', '>=', fromAmount);
              q.orWhere('debit', '>=', fromAmount);
            });
          }
          if (toAmount) {
            query.andWhere(function (q) {
              q.where('credit', '<=', toAmount);
              q.orWhere('debit', '<=', toAmount);
            });
          }
        },
        sumationCreditDebit: function sumationCreditDebit(query) {
          query.sum('credit as credit');
          query.sum('debit as debit');
          query.groupBy('account_id');
        } };

    }

    /**
       * Relationship mapping.
       */ }, { key: "relationMappings", get: function get()
    {
      var Account = __webpack_require__(/*! @/models/Account */ "./src/models/Account.js");

      return {
        account: {
          relation: objection__WEBPACK_IMPORTED_MODULE_5__["Model"].BelongsToOneRelation,
          modelClass: Account["default"],
          join: {
            from: 'accounts_transactions.accountId',
            to: 'accounts.id' } } };



    } }]);return AccountTransaction;}(_models_Model__WEBPACK_IMPORTED_MODULE_7__["default"]);

/***/ }),

/***/ "./src/models/AccountType.js":
/*!***********************************!*\
  !*** ./src/models/AccountType.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return AccountType; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "@babel/runtime/helpers/possibleConstructorReturn");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "@babel/runtime/helpers/getPrototypeOf");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "@babel/runtime/helpers/inherits");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! objection */ "objection");
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(objection__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _models_Model__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/models/Model */ "./src/models/Model.js");
 // import path from 'path';

var

AccountType = /*#__PURE__*/function (_BaseModel) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(AccountType, _BaseModel);function AccountType() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, AccountType);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(AccountType).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(AccountType, null, [{ key: "tableName",
    /**
                                                                                                                                                                                                                                                                                                    * Table name
                                                                                                                                                                                                                                                                                                    */get: function get()
    {
      return 'account_types';
    }

    /**
       * Relationship mapping.
       */ }, { key: "relationMappings", get: function get()
    {
      var Account = __webpack_require__(/*! @/models/Account */ "./src/models/Account.js");

      return {
        /**
                * Account type may has many associated accounts.
                */
        accounts: {
          relation: objection__WEBPACK_IMPORTED_MODULE_5__["Model"].HasManyRelation,
          modelClass: Account["default"],
          join: {
            from: 'account_types.id',
            to: 'accounts.accountTypeId' } } };



    } }]);return AccountType;}(_models_Model__WEBPACK_IMPORTED_MODULE_6__["default"]);

/***/ }),

/***/ "./src/models/Budget.js":
/*!******************************!*\
  !*** ./src/models/Budget.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Budget; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "@babel/runtime/helpers/possibleConstructorReturn");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "@babel/runtime/helpers/getPrototypeOf");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "@babel/runtime/helpers/inherits");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _models_Model__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/models/Model */ "./src/models/Model.js");
var

Budget = /*#__PURE__*/function (_BaseModel) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(Budget, _BaseModel);function Budget() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Budget);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(Budget).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Budget, [{ key: "rangeBy", get: function get()











    {
      switch (this.period) {
        case 'half-year':
        case 'quarter':
          return 'month';
        default:
          return this.period;}

    } }, { key: "rangeIncrement", get: function get()

    {
      switch (this.period) {
        case 'half-year':
          return 6;

        case 'quarter':
          return 3;
        default:
          return 1;}

    } }, { key: "rangeOffset", get: function get()

    {
      switch (this.period) {
        case 'half-year':return 5;
        case 'quarter':return 2;
        default:return 0;}

    } }], [{ key: "tableName", /**
                                * Table name
                                */get: function get() {return 'budgets';} }, { key: "virtualAttributes", get: function get() {return ['rangeBy', 'rangeIncrement'];} }]);return Budget;}(_models_Model__WEBPACK_IMPORTED_MODULE_5__["default"]);

/***/ }),

/***/ "./src/models/BudgetEntry.js":
/*!***********************************!*\
  !*** ./src/models/BudgetEntry.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Budget; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "@babel/runtime/helpers/possibleConstructorReturn");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "@babel/runtime/helpers/getPrototypeOf");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "@babel/runtime/helpers/inherits");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _models_Model__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/models/Model */ "./src/models/Model.js");
var

Budget = /*#__PURE__*/function (_BaseModel) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(Budget, _BaseModel);function Budget() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Budget);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(Budget).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Budget, null, [{ key: "tableName",
    /**
                                                                                                                                                                                                                                                                      * Table name
                                                                                                                                                                                                                                                                      */get: function get()
    {
      return 'budget_entries';
    } }]);return Budget;}(_models_Model__WEBPACK_IMPORTED_MODULE_5__["default"]);

/***/ }),

/***/ "./src/models/Expense.js":
/*!*******************************!*\
  !*** ./src/models/Expense.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Expense; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "@babel/runtime/helpers/possibleConstructorReturn");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "@babel/runtime/helpers/getPrototypeOf");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "@babel/runtime/helpers/inherits");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! objection */ "objection");
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(objection__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _models_Model__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/models/Model */ "./src/models/Model.js");

var

Expense = /*#__PURE__*/function (_BaseModel) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(Expense, _BaseModel);function Expense() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Expense);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(Expense).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Expense, null, [{ key: "tableName",
    /**
                                                                                                                                                                                                                                                                            * Table name
                                                                                                                                                                                                                                                                            */get: function get()
    {
      return 'expenses';
    } }, { key: "referenceType", get: function get()

    {
      return 'Expense';
    }

    /**
       * Model modifiers.
       */ }, { key: "modifiers", get: function get()
    {
      return {
        filterByDateRange: function filterByDateRange(query, startDate, endDate) {
          if (startDate) {
            query.where('date', '>=', startDate);
          }
          if (endDate) {
            query.where('date', '<=', endDate);
          }
        },
        filterByAmountRange: function filterByAmountRange(query, from, to) {
          if (from) {
            query.where('amount', '>=', from);
          }
          if (to) {
            query.where('amount', '<=', to);
          }
        },
        filterByExpenseAccount: function filterByExpenseAccount(query, accountId) {
          if (accountId) {
            query.where('expense_account_id', accountId);
          }
        },
        filterByPaymentAccount: function filterByPaymentAccount(query, accountId) {
          if (accountId) {
            query.where('payment_account_id', accountId);
          }
        } };

    }

    /**
       * Relationship mapping.
       */ }, { key: "relationMappings", get: function get()
    {
      var Account = __webpack_require__(/*! @/models/Account */ "./src/models/Account.js");
      var User = __webpack_require__(/*! @/models/User */ "./src/models/User.js");

      return {
        paymentAccount: {
          relation: objection__WEBPACK_IMPORTED_MODULE_5__["Model"].BelongsToOneRelation,
          modelClass: Account["default"],
          join: {
            from: 'expenses.paymentAccountId',
            to: 'accounts.id' } },



        expenseAccount: {
          relation: objection__WEBPACK_IMPORTED_MODULE_5__["Model"].BelongsToOneRelation,
          modelClass: Account["default"],
          join: {
            from: 'expenses.expenseAccountId',
            to: 'accounts.id' } },



        user: {
          relation: objection__WEBPACK_IMPORTED_MODULE_5__["Model"].BelongsToOneRelation,
          modelClass: User["default"],
          join: {
            from: 'expenses.userId',
            to: 'users.id' } } };



    } }]);return Expense;}(_models_Model__WEBPACK_IMPORTED_MODULE_6__["default"]);

/***/ }),

/***/ "./src/models/Item.js":
/*!****************************!*\
  !*** ./src/models/Item.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Item; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "@babel/runtime/helpers/possibleConstructorReturn");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "@babel/runtime/helpers/getPrototypeOf");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "@babel/runtime/helpers/inherits");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! objection */ "objection");
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(objection__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _models_Model__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/models/Model */ "./src/models/Model.js");


var

Item = /*#__PURE__*/function (_BaseModel) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(Item, _BaseModel);function Item() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Item);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(Item).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Item, null, [{ key: "tableName",
    /**
                                                                                                                                                                                                                                                          * Table name
                                                                                                                                                                                                                                                          */get: function get()
    {
      return 'items';
    }

    /**
       * Relationship mapping.
       */ }, { key: "relationMappings", get: function get()
    {
      return {
        /**
                * Item may has many meta data.
                */
        metadata: {
          relation: objection__WEBPACK_IMPORTED_MODULE_5__["Model"].HasManyRelation,
          modelBase: path__WEBPACK_IMPORTED_MODULE_6___default.a.join(__dirname, 'ItemMetadata'),
          join: {
            from: 'items.id',
            to: 'items_metadata.item_id' } },



        /**
                                               * Item may belongs to cateogory model.
                                               */
        category: {
          relation: objection__WEBPACK_IMPORTED_MODULE_5__["Model"].BelongsToOneRelation,
          modelBase: path__WEBPACK_IMPORTED_MODULE_6___default.a.join(__dirname, 'ItemCategory'),
          join: {
            from: 'items.categoryId',
            to: 'items_categories.id' } } };



    } }]);return Item;}(_models_Model__WEBPACK_IMPORTED_MODULE_7__["default"]);
/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./src/models/ItemCategory.js":
/*!************************************!*\
  !*** ./src/models/ItemCategory.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ItemCategory; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "@babel/runtime/helpers/possibleConstructorReturn");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "@babel/runtime/helpers/getPrototypeOf");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "@babel/runtime/helpers/inherits");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! objection */ "objection");
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(objection__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _models_Model__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/models/Model */ "./src/models/Model.js");


var

ItemCategory = /*#__PURE__*/function (_BaseModel) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(ItemCategory, _BaseModel);function ItemCategory() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, ItemCategory);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(ItemCategory).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(ItemCategory, null, [{ key: "tableName",
    /**
                                                                                                                                                                                                                                                                                                          * Table name.
                                                                                                                                                                                                                                                                                                          */get: function get()
    {
      return 'items_categories';
    }

    /**
       * Relationship mapping.
       */ }, { key: "relationMappings", get: function get()
    {
      return {
        /**
                * Item category may has many items.
                */
        items: {
          relation: objection__WEBPACK_IMPORTED_MODULE_6__["Model"].HasManyRelation,
          modelBase: path__WEBPACK_IMPORTED_MODULE_5___default.a.join(__dirname, 'Item'),
          join: {
            from: 'items_categories.item_id',
            to: 'items.id' } } };



    } }]);return ItemCategory;}(_models_Model__WEBPACK_IMPORTED_MODULE_7__["default"]);
/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./src/models/JournalEntry.js":
/*!************************************!*\
  !*** ./src/models/JournalEntry.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return JournalEntry; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "@babel/runtime/helpers/possibleConstructorReturn");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "@babel/runtime/helpers/getPrototypeOf");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "@babel/runtime/helpers/inherits");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _models_Model__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/models/Model */ "./src/models/Model.js");
var

JournalEntry = /*#__PURE__*/function (_BaseModel) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(JournalEntry, _BaseModel);function JournalEntry() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, JournalEntry);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(JournalEntry).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(JournalEntry, null, [{ key: "tableName",
    /**
                                                                                                                                                                                                                                                                                                          * Table name.
                                                                                                                                                                                                                                                                                                          */get: function get()
    {
      return 'manual_journals';
    } }]);return JournalEntry;}(_models_Model__WEBPACK_IMPORTED_MODULE_5__["default"]);

/***/ }),

/***/ "./src/models/Model.js":
/*!*****************************!*\
  !*** ./src/models/Model.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ModelBase; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "@babel/runtime/helpers/possibleConstructorReturn");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "@babel/runtime/helpers/getPrototypeOf");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/get */ "@babel/runtime/helpers/get");
/* harmony import */ var _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "@babel/runtime/helpers/inherits");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! objection */ "objection");
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(objection__WEBPACK_IMPORTED_MODULE_6__);
var

ModelBase = /*#__PURE__*/function (_Model) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(ModelBase, _Model);function ModelBase() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, ModelBase);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(ModelBase).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(ModelBase, null, [{ key: "query", value: function query()





    {var _get2,_this = this;for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
      return (_get2 = _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_4___default()(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(ModelBase), "query", this)).call.apply(_get2, [this].concat(args)).runAfter(function (result) {
        return _this.collection.from(result);
      });
    } }, { key: "collection", get: function get() {return Array;} }]);return ModelBase;}(objection__WEBPACK_IMPORTED_MODULE_6__["Model"]);

/***/ }),

/***/ "./src/models/Option.js":
/*!******************************!*\
  !*** ./src/models/Option.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Option; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "@babel/runtime/helpers/possibleConstructorReturn");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "@babel/runtime/helpers/getPrototypeOf");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "@babel/runtime/helpers/inherits");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! objection */ "objection");
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(objection__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _models_Model__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/models/Model */ "./src/models/Model.js");
/* harmony import */ var _lib_Metable_MetableCollection__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/lib/Metable/MetableCollection */ "./src/lib/Metable/MetableCollection.js");


var

Option = /*#__PURE__*/function (_mixin) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(Option, _mixin);function Option() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Option);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(Option).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Option, null, [{ key: "tableName",
    /**
                                                                                                                                                                                                                                                              * Table name.
                                                                                                                                                                                                                                                              */get: function get()
    {
      return 'options';
    } }, { key: "collection", get: function get()

    {
      return _lib_Metable_MetableCollection__WEBPACK_IMPORTED_MODULE_7__["default"];
    } }]);return Option;}(Object(objection__WEBPACK_IMPORTED_MODULE_5__["mixin"])(_models_Model__WEBPACK_IMPORTED_MODULE_6__["default"], [objection__WEBPACK_IMPORTED_MODULE_5__["mixin"]]));

/***/ }),

/***/ "./src/models/PasswordReset.js":
/*!*************************************!*\
  !*** ./src/models/PasswordReset.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PasswordResets; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "@babel/runtime/helpers/possibleConstructorReturn");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "@babel/runtime/helpers/getPrototypeOf");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "@babel/runtime/helpers/inherits");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _models_Model__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/models/Model */ "./src/models/Model.js");
var

PasswordResets = /*#__PURE__*/function (_Model) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(PasswordResets, _Model);function PasswordResets() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, PasswordResets);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(PasswordResets).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(PasswordResets, null, [{ key: "tableName",
    /**
                                                                                                                                                                                                                                                                                                              * Table name
                                                                                                                                                                                                                                                                                                              */get: function get()
    {
      return 'password_resets';
    } }]);return PasswordResets;}(_models_Model__WEBPACK_IMPORTED_MODULE_5__["default"]);

/***/ }),

/***/ "./src/models/Permission.js":
/*!**********************************!*\
  !*** ./src/models/Permission.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Permission; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "@babel/runtime/helpers/possibleConstructorReturn");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "@babel/runtime/helpers/getPrototypeOf");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "@babel/runtime/helpers/inherits");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! objection */ "objection");
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(objection__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _models_Model__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/models/Model */ "./src/models/Model.js");


var

Permission = /*#__PURE__*/function (_BaseModel) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(Permission, _BaseModel);function Permission() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Permission);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(Permission).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Permission, null, [{ key: "tableName",
    /**
                                                                                                                                                                                                                                                                                              * Table name of Role model.
                                                                                                                                                                                                                                                                                              * @type {String}
                                                                                                                                                                                                                                                                                              */get: function get()
    {
      return 'permissions';
    }

    /**
       * Relationship mapping.
       */ }, { key: "relationMappings", get: function get()
    {
      return {
        /**
                * Permission model may belongs to role model.
                */
        role: {
          relation: objection__WEBPACK_IMPORTED_MODULE_5__["Model"].BelongsToOneRelation,
          modelBase: path__WEBPACK_IMPORTED_MODULE_6___default.a.join(__dirname, 'Role'),
          join: {
            from: 'permissions.role_id',
            to: 'roles.id' } }



        // resource: {
        //   relation: Model.BelongsToOneRelation,
        //   modelBase: path.join(__dirname, 'Resource'),
        //   join: {
        //     from: 'permissions.',
        //     to: '',
        //   }
        // }
      };
    } }]);return Permission;}(_models_Model__WEBPACK_IMPORTED_MODULE_7__["default"]);
/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./src/models/Resource.js":
/*!********************************!*\
  !*** ./src/models/Resource.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Resource; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "@babel/runtime/helpers/possibleConstructorReturn");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "@babel/runtime/helpers/getPrototypeOf");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "@babel/runtime/helpers/inherits");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! objection */ "objection");
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(objection__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _models_Model__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/models/Model */ "./src/models/Model.js");


var

Resource = /*#__PURE__*/function (_BaseModel) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(Resource, _BaseModel);function Resource() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Resource);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(Resource).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Resource, null, [{ key: "tableName",
    /**
                                                                                                                                                                                                                                                                                  * Table name.
                                                                                                                                                                                                                                                                                  */get: function get()
    {
      return 'resources';
    }

    /**
       * Timestamp columns.
       */ }, { key: "hasTimestamps", get: function get()
    {
      return false;
    }

    /**
       * Relationship mapping.
       */ }, { key: "relationMappings", get: function get()
    {
      return {
        /**
                * Resource model may has many views.
                */
        views: {
          relation: objection__WEBPACK_IMPORTED_MODULE_6__["Model"].HasManyRelation,
          modelBase: path__WEBPACK_IMPORTED_MODULE_5___default.a.join(__dirname, 'View'),
          join: {
            from: 'resources.id',
            to: 'views.resource_id' } },



        /**
                                          * Resource model may has many fields.
                                          */
        fields: {
          relation: objection__WEBPACK_IMPORTED_MODULE_6__["Model"].HasManyRelation,
          modelBase: path__WEBPACK_IMPORTED_MODULE_5___default.a.join(__dirname, 'ResourceField'),
          join: {
            from: 'resources.id',
            to: 'views.resource_id' } },



        /**
                                          * Resource model may has many associated permissions.
                                          */
        permissions: {
          relation: objection__WEBPACK_IMPORTED_MODULE_6__["Model"].ManyToManyRelation,
          modelBase: path__WEBPACK_IMPORTED_MODULE_5___default.a.join(__dirname, 'Permission'),
          join: {
            from: 'resources.id',
            through: {
              from: 'role_has_permissions.resource_id',
              to: 'role_has_permissions.permission_id' },

            to: 'permissions.id' } } };



    } }]);return Resource;}(_models_Model__WEBPACK_IMPORTED_MODULE_7__["default"]);
/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./src/models/ResourceField.js":
/*!*************************************!*\
  !*** ./src/models/ResourceField.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ResourceField; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "@babel/runtime/helpers/possibleConstructorReturn");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "@babel/runtime/helpers/getPrototypeOf");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "@babel/runtime/helpers/inherits");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! objection */ "objection");
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(objection__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _models_Model__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/models/Model */ "./src/models/Model.js");



var

ResourceField = /*#__PURE__*/function (_BaseModel) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(ResourceField, _BaseModel);function ResourceField() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, ResourceField);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(ResourceField).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(ResourceField, [{ key: "key",





















    /**
                                                                                                                                                                                                                                                                                                    * Resource field key.
                                                                                                                                                                                                                                                                                                    */value: function key()
    {
      return Object(lodash__WEBPACK_IMPORTED_MODULE_5__["snakeCase"])(this.labelName);
    }

    /**
       * Relationship mapping.
       */ }], [{ key: "tableName", /**
                                    * Table name.
                                    */get: function get() {return 'resource_fields';} /**
                                                                                       * Timestamp columns.
                                                                                       */ }, { key: "hasTimestamps", get: function get() {return false;} /**
                                                                                                                                                          * Virtual attributes.
                                                                                                                                                          */ }, { key: "virtualAttributes", get: function get() {return ['key'];} }, { key: "relationMappings", get: function get() {return { /**
                                                                                                                                                                                                                                                                                               * Resource field may belongs to resource model.
                                                                                                                                                                                                                                                                                               */resource: { relation: objection__WEBPACK_IMPORTED_MODULE_6__["Model"].BelongsToOneRelation, modelBase: path__WEBPACK_IMPORTED_MODULE_7___default.a.join(__dirname, 'Resource'),
          join: {
            from: 'resource_fields.resource_id',
            to: 'resources.id' } } };



    } }]);return ResourceField;}(_models_Model__WEBPACK_IMPORTED_MODULE_8__["default"]);
/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./src/models/Role.js":
/*!****************************!*\
  !*** ./src/models/Role.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Role; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "@babel/runtime/helpers/possibleConstructorReturn");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "@babel/runtime/helpers/getPrototypeOf");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "@babel/runtime/helpers/inherits");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! objection */ "objection");
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(objection__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _models_Model__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/models/Model */ "./src/models/Model.js");

var

Role = /*#__PURE__*/function (_BaseModel) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(Role, _BaseModel);function Role() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Role);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(Role).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Role, null, [{ key: "tableName",
    /**
                                                                                                                                                                                                                                                          * Table name of Role model.
                                                                                                                                                                                                                                                          * @type {String}
                                                                                                                                                                                                                                                          */get: function get()
    {
      return 'roles';
    }

    /**
       * Timestamp columns.
       */ }, { key: "hasTimestamps", get: function get()
    {
      return false;
    }

    /**
       * Relationship mapping.
       */ }, { key: "relationMappings", get: function get()
    {
      var Permission = __webpack_require__(/*! @/models/Permission */ "./src/models/Permission.js");
      var Resource = __webpack_require__(/*! @/models/Resource */ "./src/models/Resource.js");
      var User = __webpack_require__(/*! @/models/User */ "./src/models/User.js");

      return {
        /**
                * Role may has many permissions.
                */
        permissions: {
          relation: objection__WEBPACK_IMPORTED_MODULE_5__["Model"].ManyToManyRelation,
          modelClass: Permission["default"],
          join: {
            from: 'roles.id',
            through: {
              from: 'role_has_permissions.roleId',
              to: 'role_has_permissions.permissionId' },

            to: 'permissions.id' } },



        /**
                                       * Role may has many resources.
                                       */
        resources: {
          relation: objection__WEBPACK_IMPORTED_MODULE_5__["Model"].ManyToManyRelation,
          modelClass: Resource["default"],
          join: {
            from: 'roles.id',
            through: {
              from: 'role_has_permissions.roleId',
              to: 'role_has_permissions.resourceId' },

            to: 'resources.id' } },



        /**
                                     * Role may has many associated users.
                                     */
        users: {
          relation: objection__WEBPACK_IMPORTED_MODULE_5__["Model"].ManyToManyRelation,
          modelClass: User["default"],
          join: {
            from: 'roles.id',
            through: {
              from: 'user_has_roles.roleId',
              to: 'user_has_roles.userId' },

            to: 'users.id' } } };



    } }]);return Role;}(_models_Model__WEBPACK_IMPORTED_MODULE_6__["default"]);

/***/ }),

/***/ "./src/models/User.js":
/*!****************************!*\
  !*** ./src/models/User.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return User; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "@babel/runtime/helpers/possibleConstructorReturn");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "@babel/runtime/helpers/getPrototypeOf");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "@babel/runtime/helpers/inherits");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! bcryptjs */ "bcryptjs");
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! objection */ "objection");
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(objection__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _models_Model__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/models/Model */ "./src/models/Model.js");



// import PermissionsService from '@/services/PermissionsService';
var
User = /*#__PURE__*/function (_BaseModel) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(User, _BaseModel);function User() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, User);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(User).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(User, [{ key: "verifyPassword",































    /**
                                                                                                                                                                                                                                                         * Verify the password of the user.
                                                                                                                                                                                                                                                         * @param  {String} password - The given password.
                                                                                                                                                                                                                                                         * @return {Boolean}
                                                                                                                                                                                                                                                         */value: function verifyPassword(
    password) {
      return bcryptjs__WEBPACK_IMPORTED_MODULE_5___default.a.compareSync(password, this.password);
    } }], [{ key: "tableName", // ...PermissionsService
    /**
     * Table name
     */get: function get() {return 'users';} /**
                                              * Relationship mapping.
                                              */ }, { key: "relationMappings", get: function get() {var Role = __webpack_require__(/*! @/models/Role */ "./src/models/Role.js");return { roles: { relation: objection__WEBPACK_IMPORTED_MODULE_6__["Model"].ManyToManyRelation, modelClass: Role["default"], join: { from: 'users.id', through: { from: 'user_has_roles.userId', to: 'user_has_roles.roleId' }, to: 'roles.id' } } };} }]);return User;}(_models_Model__WEBPACK_IMPORTED_MODULE_7__["default"]);

/***/ }),

/***/ "./src/models/View.js":
/*!****************************!*\
  !*** ./src/models/View.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return View; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "@babel/runtime/helpers/possibleConstructorReturn");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "@babel/runtime/helpers/getPrototypeOf");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "@babel/runtime/helpers/inherits");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! objection */ "objection");
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(objection__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _models_Model__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/models/Model */ "./src/models/Model.js");


var

View = /*#__PURE__*/function (_BaseModel) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(View, _BaseModel);function View() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, View);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(View).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(View, null, [{ key: "tableName",
    /**
                                                                                                                                                                                                                                                          * Table name.
                                                                                                                                                                                                                                                          */get: function get()
    {
      return 'views';
    }

    /**
       * Relationship mapping.
       */ }, { key: "relationMappings", get: function get()
    {
      return {
        /**
                * View model belongs to resource model.
                */
        resource: {
          relation: objection__WEBPACK_IMPORTED_MODULE_6__["Model"].BelongsToOneRelation,
          modelBase: path__WEBPACK_IMPORTED_MODULE_5___default.a.join(__dirname, 'Resource'),
          join: {
            from: 'views.resource_id',
            to: 'resources.id' } },



        /**
                                     * View model may has many columns.
                                     */
        // columns: {
        //   relation: Model.ManyToManyRelation,
        //   modelBase: path.join(__dirname, 'ResourceField'),
        //   join: {
        //     from: 'id',
        //     through: {
        //       from: 'view_has_columns.view_id',
        //       to: 'view_has_columns.field_id',
        //     },
        //     to: 'resource_fields.view_id',
        //   }
        // }

        /**
         * View model may has many view roles.
         */
        viewRoles: {
          relation: objection__WEBPACK_IMPORTED_MODULE_6__["Model"].HasManyRelation,
          modelBase: path__WEBPACK_IMPORTED_MODULE_5___default.a.join(__dirname, 'ViewRole'),
          join: {
            from: 'views.id',
            to: 'view_id' } } };



    }

    // columns() {
    //   return this.belongsToMany('ResourceField', 'view_has_columns', 'view_id', 'field_id');
    // },

    // viewRoles() {
    //   return this.hasMany('ViewRole', 'view_id');
    // },
  }]);return View;}(_models_Model__WEBPACK_IMPORTED_MODULE_7__["default"]);
/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./src/models/index.js":
/*!*****************************!*\
  !*** ./src/models/index.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! objection */ "objection");
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(objection__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _database_knex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/database/knex */ "./src/database/knex.js");



// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex() method.
objection__WEBPACK_IMPORTED_MODULE_0__["Model"].knex(_database_knex__WEBPACK_IMPORTED_MODULE_1__["default"]);

/***/ }),

/***/ "./src/server.js":
/*!***********************!*\
  !*** ./src/server.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var errorhandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! errorhandler */ "errorhandler");
/* harmony import */ var errorhandler__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(errorhandler__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/app */ "./src/app.js");



_app__WEBPACK_IMPORTED_MODULE_1__["default"].use(errorhandler__WEBPACK_IMPORTED_MODULE_0___default.a);

var server = _app__WEBPACK_IMPORTED_MODULE_1__["default"].listen(_app__WEBPACK_IMPORTED_MODULE_1__["default"].get('port'), function () {
  console.log(
  '  App is running at http://localhost:%d in %s mode',
  _app__WEBPACK_IMPORTED_MODULE_1__["default"].get('port'),
  _app__WEBPACK_IMPORTED_MODULE_1__["default"].get('env'));

  console.log('  Press CTRL-C to stop');
});

/* harmony default export */ __webpack_exports__["default"] = (server);

/***/ }),

/***/ "./src/services/Accounting/JournalEntry.js":
/*!*************************************************!*\
  !*** ./src/services/Accounting/JournalEntry.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return JournalEntry; });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}var
JournalEntry =
function JournalEntry(entry) {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, JournalEntry);
  var defaults = {
    credit: 0,
    debit: 0 };

  this.entry = _objectSpread({}, defaults, {}, entry);
};

/***/ }),

/***/ "./src/services/Accounting/JournalPoster.js":
/*!**************************************************!*\
  !*** ./src/services/Accounting/JournalPoster.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return JournalPoster; });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _services_Accounting_JournalEntry__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/services/Accounting/JournalEntry */ "./src/services/Accounting/JournalEntry.js");
/* harmony import */ var _models_AccountTransaction__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/models/AccountTransaction */ "./src/models/AccountTransaction.js");
/* harmony import */ var _models_AccountBalance__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/models/AccountBalance */ "./src/models/AccountBalance.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}



var

JournalPoster = /*#__PURE__*/function () {
  /**
                                           * Journal poster constructor.
                                           */
  function JournalPoster() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default()(this, JournalPoster);
    this.entries = [];
    this.balancesChange = {};
  }

  /**
     * Writes the credit entry for the given account.
     * @param {JournalEntry} entry -
     */_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(JournalPoster, [{ key: "credit", value: function credit(
    entryModel) {
      if (entryModel instanceof _services_Accounting_JournalEntry__WEBPACK_IMPORTED_MODULE_7__["default"] === false) {
        throw new Error('The entry is not instance of JournalEntry.');
      }
      this.entries.push(entryModel.entry);
      this.setAccountBalanceChange(entryModel.entry, 'credit');
    }

    /**
       * Writes the debit entry for the given account.
       * @param {JournalEntry} entry -
       */ }, { key: "debit", value: function debit(
    entryModel) {
      if (entryModel instanceof _services_Accounting_JournalEntry__WEBPACK_IMPORTED_MODULE_7__["default"] === false) {
        throw new Error('The entry is not instance of JournalEntry.');
      }
      this.entries.push(entryModel.entry);
      this.setAccountBalanceChange(entryModel.entry, 'debit');
    }

    /**
       * Sets account balance change.
       * @param {JournalEntry} entry
       * @param {String} type
       */ }, { key: "setAccountBalanceChange", value: function setAccountBalanceChange(
    entry, type) {
      if (!this.balancesChange[entry.account]) {
        this.balancesChange[entry.account] = 0;
      }
      var change = 0;

      if (entry.accountNormal === 'credit') {
        change = type === 'credit' ? entry.credit : -1 * entry.debit;
      } else if (entry.accountNormal === 'debit') {
        change = type === 'debit' ? entry.debit : -1 * entry.credit;
      }
      this.balancesChange[entry.account] += change;
    }

    /**
       * Mapping the balance change to list.
       */ }, { key: "mapBalanceChangesToList", value: function mapBalanceChangesToList()
    {var _this = this;
      var mappedList = [];

      Object.keys(this.balancesChange).forEach(function (accountId) {
        var balance = _this.balancesChange[accountId];

        mappedList.push({
          account_id: accountId,
          amount: balance });

      });
      return mappedList;
    }

    /**
       * Saves the balance change of journal entries.
       */ }, { key: "saveBalance", value: function () {var _saveBalance = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee() {var balancesList, balanceUpdateOpers, balanceInsertOpers, balanceFindOneOpers, balanceAccounts;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:

                balancesList = this.mapBalanceChangesToList();
                balanceUpdateOpers = [];
                balanceInsertOpers = [];
                balanceFindOneOpers = [];
                balanceAccounts = [];

                balancesList.forEach(function (balance) {
                  var oper = _models_AccountBalance__WEBPACK_IMPORTED_MODULE_9__["default"].query().findOne('account_id', balance.account_id);
                  balanceFindOneOpers.push(oper);
                });_context.next = 8;return (
                  Promise.all(balanceFindOneOpers));case 8:balanceAccounts = _context.sent;

                balancesList.forEach(function (balance) {
                  var method = balance.amount < 0 ? 'decrement' : 'increment';

                  // Detarmine if the account balance is already exists or not.
                  var foundAccBalance = balanceAccounts.some(function (account) {return (
                      account && account.account_id === balance.account_id);});

                  if (foundAccBalance) {
                    var query = _models_AccountBalance__WEBPACK_IMPORTED_MODULE_9__["default"].
                    query()[method]('amount', Math.abs(balance.amount)).
                    where('account_id', balance.account_id);

                    balanceUpdateOpers.push(query);
                  } else {
                    var _query = _models_AccountBalance__WEBPACK_IMPORTED_MODULE_9__["default"].query().insert({
                      account_id: balance.account_id,
                      amount: balance.amount,
                      currency_code: 'USD' });

                    balanceInsertOpers.push(_query);
                  }
                });_context.next = 12;return (
                  Promise.all([].concat(
                  balanceUpdateOpers, balanceInsertOpers)));case 12:case "end":return _context.stop();}}}, _callee, this);}));function saveBalance() {return _saveBalance.apply(this, arguments);}return saveBalance;}()



    /**
                                                                                                                                                                                                                          * Saves the stacked journal entries to the storage.
                                                                                                                                                                                                                          */ }, { key: "saveEntries", value: function () {var _saveEntries = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee2() {var saveOperations;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:

                saveOperations = [];

                this.entries.forEach(function (entry) {
                  var oper = _models_AccountTransaction__WEBPACK_IMPORTED_MODULE_8__["default"].query().insert(_objectSpread({
                    accountId: entry.account },
                  Object(lodash__WEBPACK_IMPORTED_MODULE_5__["pick"])(entry, ['credit', 'debit', 'transactionType',
                  'referenceType', 'referenceId', 'note'])));

                  saveOperations.push(oper);
                });_context2.next = 4;return (
                  Promise.all(saveOperations));case 4:case "end":return _context2.stop();}}}, _callee2, this);}));function saveEntries() {return _saveEntries.apply(this, arguments);}return saveEntries;}()


    /**
                                                                                                                                                                                                              * Reverses the stacked journal entries.
                                                                                                                                                                                                              */ }, { key: "reverseEntries", value: function reverseEntries()
    {
      var reverseEntries = [];

      this.entries.forEach(function (entry) {
        var reverseEntry = _objectSpread({}, entry);

        if (entry.credit) {
          reverseEntry.debit = entry.credit;
        }
        if (entry.debit) {
          reverseEntry.credit = entry.debit;
        }
        reverseEntries.push(reverseEntry);
      });
      this.entries = reverseEntries;
    }

    /**
       * Delete the given or all stacked entries.
       * @param {Array} ids -
       */ }, { key: "deleteEntries", value: function () {var _deleteEntries = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee3(
      ids) {var entriesIds;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                entriesIds = ids || this.entries.map(function (e) {return e.id;});if (!(

                entriesIds.length > 0)) {_context3.next = 4;break;}_context3.next = 4;return (
                  _models_AccountTransaction__WEBPACK_IMPORTED_MODULE_8__["default"].query().whereIn('id', entriesIds)["delete"]());case 4:case "end":return _context3.stop();}}}, _callee3, this);}));function deleteEntries(_x) {return _deleteEntries.apply(this, arguments);}return deleteEntries;}()



    /**
                                                                                                                                                                                                                                                           * Retrieve the closing balance for the given account and closing date.
                                                                                                                                                                                                                                                           * @param {Number} accountId -
                                                                                                                                                                                                                                                           * @param {Date} closingDate -
                                                                                                                                                                                                                                                           */ }, { key: "getClosingBalance", value: function getClosingBalance(
    accountId, closingDate) {var dateType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'day';
      var closingBalance = 0;
      var momentClosingDate = moment__WEBPACK_IMPORTED_MODULE_6___default()(closingDate);

      this.entries.forEach(function (entry) {
        // Can not continue if not before or event same closing date.
        if (!momentClosingDate.isAfter(entry.date, dateType) &&
        !momentClosingDate.isSame(entry.date, dateType) ||
        entry.account !== accountId && accountId) {
          return;
        }
        if (entry.accountNormal === 'credit') {
          closingBalance += entry.credit ? entry.credit : -1 * entry.debit;
        } else if (entry.accountNormal === 'debit') {
          closingBalance += entry.debit ? entry.debit : -1 * entry.credit;
        }
      });
      return closingBalance;
    }

    /**
       * Retrieve the credit/debit sumation for the given account and date.
       * @param {Number} account -
       * @param {Date|String} closingDate -
       */ }, { key: "getTrialBalance", value: function getTrialBalance(
    accountId, closingDate, dateType) {
      var momentClosingDate = moment__WEBPACK_IMPORTED_MODULE_6___default()(closingDate);
      var result = {
        credit: 0,
        debit: 0,
        balance: 0 };

      this.entries.forEach(function (entry) {
        if (!momentClosingDate.isAfter(entry.date, dateType) &&
        !momentClosingDate.isSame(entry.date, dateType) ||
        entry.account !== accountId && accountId) {
          return;
        }
        result.credit += entry.credit;
        result.debit += entry.debit;

        if (entry.accountNormal === 'credit') {
          result.balance += entry.credit ? entry.credit : -1 * entry.debit;
        } else if (entry.accountNormal === 'debit') {
          result.balance += entry.debit ? entry.debit : -1 * entry.credit;
        }
      });
      return result;
    }

    /**
       * Load fetched accounts journal entries.
       * @param {Array} entries -
       */ }, { key: "loadEntries", value: function loadEntries(
    entries) {var _this2 = this;
      entries.forEach(function (entry) {
        _this2.entries.push(_objectSpread({},
        entry, {
          account: entry.account ? entry.account.id : entry.accountId,
          accountNormal: entry.account && entry.account.type ?
          entry.account.type.normal : entry.accountNormal }));

      });
    } }], [{ key: "loadAccounts", value: function loadAccounts()

    {

    } }]);return JournalPoster;}();

/***/ }),

/***/ "./src/services/Moment/index.js":
/*!**************************************!*\
  !*** ./src/services/Moment/index.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var moment_range__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! moment-range */ "moment-range");
/* harmony import */ var moment_range__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(moment_range__WEBPACK_IMPORTED_MODULE_1__);



var moment = Object(moment_range__WEBPACK_IMPORTED_MODULE_1__["extendMoment"])(moment__WEBPACK_IMPORTED_MODULE_0___default.a);

/* harmony default export */ __webpack_exports__["default"] = (moment);

/***/ }),

/***/ "./src/services/mail.js":
/*!******************************!*\
  !*** ./src/services/mail.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var nodemailer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! nodemailer */ "nodemailer");
/* harmony import */ var nodemailer__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(nodemailer__WEBPACK_IMPORTED_MODULE_0__);


// create reusable transporter object using the default SMTP transport
var transporter = nodemailer__WEBPACK_IMPORTED_MODULE_0___default.a.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD } });



/* harmony default export */ __webpack_exports__["default"] = (transporter);

/***/ }),

/***/ "./src/utils/index.js":
/*!****************************!*\
  !*** ./src/utils/index.js ***!
  \****************************/
/*! exports provided: hashPassword, origin, dateRangeCollection */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hashPassword", function() { return hashPassword; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "origin", function() { return origin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dateRangeCollection", function() { return dateRangeCollection; });
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bcryptjs */ "bcryptjs");
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_1__);



var hashPassword = function hashPassword(password) {return new Promise(function (resolve) {
    bcryptjs__WEBPACK_IMPORTED_MODULE_0___default.a.genSalt(10, function (error, salt) {
      bcryptjs__WEBPACK_IMPORTED_MODULE_0___default.a.hash(password, salt, function (err, hash) {resolve(hash);});
    });
  });};

var origin = function origin(request) {return "".concat(request.protocol, "://").concat(request.hostname);};

var dateRangeCollection = function dateRangeCollection(fromDate, toDate) {var addType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'day';var increment = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var collection = [];
  var momentFromDate = moment__WEBPACK_IMPORTED_MODULE_1___default()(fromDate);
  var dateFormat = '';

  switch (addType) {
    case 'day':
    default:
      dateFormat = 'YYYY-MM-DD';break;
    case 'month':
    case 'quarter':
      dateFormat = 'YYYY-MM';break;
    case 'year':
      dateFormat = 'YYYY';break;}

  for (var i = momentFromDate;
  i.isBefore(toDate, addType) || i.isSame(toDate, addType);
  i.add(increment, "".concat(addType, "s"))) {
    collection.push(i.endOf(addType).format(dateFormat));
  }
  return collection;
};



/***/ }),

/***/ 0:
/*!*********************************************************!*\
  !*** multi @babel/plugin-transform-runtime @/server.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! @babel/plugin-transform-runtime */"@babel/plugin-transform-runtime");
module.exports = __webpack_require__(/*! @/server.js */"./src/server.js");


/***/ }),

/***/ "@babel/plugin-transform-runtime":
/*!**************************************************!*\
  !*** external "@babel/plugin-transform-runtime" ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@babel/plugin-transform-runtime");

/***/ }),

/***/ "@babel/runtime/helpers/asyncToGenerator":
/*!**********************************************************!*\
  !*** external "@babel/runtime/helpers/asyncToGenerator" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime/helpers/asyncToGenerator");

/***/ }),

/***/ "@babel/runtime/helpers/classCallCheck":
/*!********************************************************!*\
  !*** external "@babel/runtime/helpers/classCallCheck" ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime/helpers/classCallCheck");

/***/ }),

/***/ "@babel/runtime/helpers/createClass":
/*!*****************************************************!*\
  !*** external "@babel/runtime/helpers/createClass" ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime/helpers/createClass");

/***/ }),

/***/ "@babel/runtime/helpers/defineProperty":
/*!********************************************************!*\
  !*** external "@babel/runtime/helpers/defineProperty" ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime/helpers/defineProperty");

/***/ }),

/***/ "@babel/runtime/helpers/get":
/*!*********************************************!*\
  !*** external "@babel/runtime/helpers/get" ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime/helpers/get");

/***/ }),

/***/ "@babel/runtime/helpers/getPrototypeOf":
/*!********************************************************!*\
  !*** external "@babel/runtime/helpers/getPrototypeOf" ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime/helpers/getPrototypeOf");

/***/ }),

/***/ "@babel/runtime/helpers/inherits":
/*!**************************************************!*\
  !*** external "@babel/runtime/helpers/inherits" ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime/helpers/inherits");

/***/ }),

/***/ "@babel/runtime/helpers/possibleConstructorReturn":
/*!*******************************************************************!*\
  !*** external "@babel/runtime/helpers/possibleConstructorReturn" ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime/helpers/possibleConstructorReturn");

/***/ }),

/***/ "@babel/runtime/helpers/slicedToArray":
/*!*******************************************************!*\
  !*** external "@babel/runtime/helpers/slicedToArray" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime/helpers/slicedToArray");

/***/ }),

/***/ "@babel/runtime/helpers/toConsumableArray":
/*!***********************************************************!*\
  !*** external "@babel/runtime/helpers/toConsumableArray" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime/helpers/toConsumableArray");

/***/ }),

/***/ "@babel/runtime/helpers/typeof":
/*!************************************************!*\
  !*** external "@babel/runtime/helpers/typeof" ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime/helpers/typeof");

/***/ }),

/***/ "@babel/runtime/regenerator":
/*!*********************************************!*\
  !*** external "@babel/runtime/regenerator" ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime/regenerator");

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("bcryptjs");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),

/***/ "errorhandler":
/*!*******************************!*\
  !*** external "errorhandler" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("errorhandler");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "express-boom":
/*!*******************************!*\
  !*** external "express-boom" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-boom");

/***/ }),

/***/ "express-validator":
/*!************************************!*\
  !*** external "express-validator" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-validator");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("helmet");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "knex":
/*!***********************!*\
  !*** external "knex" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("knex");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),

/***/ "moment-range":
/*!*******************************!*\
  !*** external "moment-range" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("moment-range");

/***/ }),

/***/ "mustache":
/*!***************************!*\
  !*** external "mustache" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mustache");

/***/ }),

/***/ "nodemailer":
/*!*****************************!*\
  !*** external "nodemailer" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("nodemailer");

/***/ }),

/***/ "objection":
/*!****************************!*\
  !*** external "objection" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("objection");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrL2Jvb3RzdHJhcCIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9jb25maWcvaW5kZXguanMiLCIvcHJpdmF0ZS92YXIvd3d3L1JhdHRlYi9zZXJ2ZXIva25leGZpbGUuanMiLCIvcHJpdmF0ZS92YXIvd3d3L1JhdHRlYi9zZXJ2ZXIvc3JjL2FwcC5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvY29sbGVjdGlvbi9CdWRnZXRFbnRyaWVzU2V0LmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9SYXR0ZWIvc2VydmVyL3NyYy9jb2xsZWN0aW9uL05lc3RlZFNldC9pbmRleC5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvZGF0YWJhc2Uva25leC5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9BY2NvdW50T3BlbmluZ0JhbGFuY2UuanMiLCIvcHJpdmF0ZS92YXIvd3d3L1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvY29udHJvbGxlcnMvQWNjb3VudGluZy5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9BY2NvdW50cy5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9BdXRoZW50aWNhdGlvbi5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9CaWxscy5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9CdWRnZXQuanMiLCIvcHJpdmF0ZS92YXIvd3d3L1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvY29udHJvbGxlcnMvQ3VycmVuY3lBZGp1c3RtZW50LmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9SYXR0ZWIvc2VydmVyL3NyYy9odHRwL2NvbnRyb2xsZXJzL0N1c3RvbWVycy5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9FeHBlbnNlcy5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9GaWVsZHMuanMiLCIvcHJpdmF0ZS92YXIvd3d3L1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvY29udHJvbGxlcnMvRmluYW5jaWFsU3RhdGVtZW50cy5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9JdGVtQ2F0ZWdvcmllcy5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9JdGVtcy5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9PcHRpb25zLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9SYXR0ZWIvc2VydmVyL3NyYy9odHRwL2NvbnRyb2xsZXJzL1JvbGVzLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9SYXR0ZWIvc2VydmVyL3NyYy9odHRwL2NvbnRyb2xsZXJzL1N1cHBsaWVycy5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9Vc2Vycy5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9WaWV3cy5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9pbmRleC5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9taWRkbGV3YXJlL2FzeW5jTWlkZGxld2FyZS5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9taWRkbGV3YXJlL2F1dGhvcml6YXRpb24uanMiLCIvcHJpdmF0ZS92YXIvd3d3L1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvbWlkZGxld2FyZS9qd3RBdXRoLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9SYXR0ZWIvc2VydmVyL3NyYy9saWIvTWV0YWJsZS9NZXRhYmxlQ29sbGVjdGlvbi5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL0FjY291bnQuanMiLCIvcHJpdmF0ZS92YXIvd3d3L1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9BY2NvdW50QmFsYW5jZS5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL0FjY291bnRUcmFuc2FjdGlvbi5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL0FjY291bnRUeXBlLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvQnVkZ2V0LmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvQnVkZ2V0RW50cnkuanMiLCIvcHJpdmF0ZS92YXIvd3d3L1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9FeHBlbnNlLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvSXRlbS5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL0l0ZW1DYXRlZ29yeS5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL0pvdXJuYWxFbnRyeS5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL01vZGVsLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvT3B0aW9uLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvUGFzc3dvcmRSZXNldC5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL1Blcm1pc3Npb24uanMiLCIvcHJpdmF0ZS92YXIvd3d3L1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9SZXNvdXJjZS5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL1Jlc291cmNlRmllbGQuanMiLCIvcHJpdmF0ZS92YXIvd3d3L1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9Sb2xlLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvVXNlci5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL1ZpZXcuanMiLCIvcHJpdmF0ZS92YXIvd3d3L1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9pbmRleC5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvc2VydmVyLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9SYXR0ZWIvc2VydmVyL3NyYy9zZXJ2aWNlcy9BY2NvdW50aW5nL0pvdXJuYWxFbnRyeS5qcyIsIi9wcml2YXRlL3Zhci93d3cvUmF0dGViL3NlcnZlci9zcmMvc2VydmljZXMvQWNjb3VudGluZy9Kb3VybmFsUG9zdGVyLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9SYXR0ZWIvc2VydmVyL3NyYy9zZXJ2aWNlcy9Nb21lbnQvaW5kZXguanMiLCIvcHJpdmF0ZS92YXIvd3d3L1JhdHRlYi9zZXJ2ZXIvc3JjL3NlcnZpY2VzL21haWwuanMiLCIvcHJpdmF0ZS92YXIvd3d3L1JhdHRlYi9zZXJ2ZXIvc3JjL3V0aWxzL2luZGV4LmpzIiwiZXh0ZXJuYWwgXCJAYmFiZWwvcGx1Z2luLXRyYW5zZm9ybS1ydW50aW1lXCIiLCJleHRlcm5hbCBcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvYXN5bmNUb0dlbmVyYXRvclwiIiwiZXh0ZXJuYWwgXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrXCIiLCJleHRlcm5hbCBcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3NcIiIsImV4dGVybmFsIFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9kZWZpbmVQcm9wZXJ0eVwiIiwiZXh0ZXJuYWwgXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2dldFwiIiwiZXh0ZXJuYWwgXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2dldFByb3RvdHlwZU9mXCIiLCJleHRlcm5hbCBcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHNcIiIsImV4dGVybmFsIFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuXCIiLCJleHRlcm5hbCBcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvc2xpY2VkVG9BcnJheVwiIiwiZXh0ZXJuYWwgXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL3RvQ29uc3VtYWJsZUFycmF5XCIiLCJleHRlcm5hbCBcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvdHlwZW9mXCIiLCJleHRlcm5hbCBcIkBiYWJlbC9ydW50aW1lL3JlZ2VuZXJhdG9yXCIiLCJleHRlcm5hbCBcImJjcnlwdGpzXCIiLCJleHRlcm5hbCBcImRvdGVudlwiIiwiZXh0ZXJuYWwgXCJlcnJvcmhhbmRsZXJcIiIsImV4dGVybmFsIFwiZXhwcmVzc1wiIiwiZXh0ZXJuYWwgXCJleHByZXNzLWJvb21cIiIsImV4dGVybmFsIFwiZXhwcmVzcy12YWxpZGF0b3JcIiIsImV4dGVybmFsIFwiZnNcIiIsImV4dGVybmFsIFwiaGVsbWV0XCIiLCJleHRlcm5hbCBcImpzb253ZWJ0b2tlblwiIiwiZXh0ZXJuYWwgXCJrbmV4XCIiLCJleHRlcm5hbCBcImxvZGFzaFwiIiwiZXh0ZXJuYWwgXCJtb21lbnRcIiIsImV4dGVybmFsIFwibW9tZW50LXJhbmdlXCIiLCJleHRlcm5hbCBcIm11c3RhY2hlXCIiLCJleHRlcm5hbCBcIm5vZGVtYWlsZXJcIiIsImV4dGVybmFsIFwib2JqZWN0aW9uXCIiLCJleHRlcm5hbCBcInBhdGhcIiJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcImRpc3QvXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcbiIsImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGRvdGVudiBmcm9tICdkb3RlbnYnO1xuXG5kb3RlbnYuY29uZmlnKHtcbiAgcGF0aDogcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICcuZW52LnRlc3QnKSxcbn0pO1xuIiwicmVxdWlyZSgnZG90ZW52JykuY29uZmlnKCk7XG5cbmNvbnN0IE1JR1JBVElPTlNfRElSID0gJy4vc3JjL2RhdGFiYXNlL21pZ3JhdGlvbnMnO1xuY29uc3QgU0VFRFNfRElSID0gJy4vc3JjL2RhdGFiYXNlL3NlZWRzJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHRlc3Q6IHtcbiAgICBjbGllbnQ6IHByb2Nlc3MuZW52LkRCX0NMSUVOVCxcbiAgICBtaWdyYXRpb25zOiB7XG4gICAgICBkaXJlY3Rvcnk6IE1JR1JBVElPTlNfRElSLFxuICAgIH0sXG4gICAgY29ubmVjdGlvbjoge1xuICAgICAgaG9zdDogcHJvY2Vzcy5lbnYuREJfSE9TVCxcbiAgICAgIHVzZXI6IHByb2Nlc3MuZW52LkRCX1VTRVIsXG4gICAgICBwYXNzd29yZDogcHJvY2Vzcy5lbnYuREJfUEFTU1dPUkQsXG4gICAgICBkYXRhYmFzZTogcHJvY2Vzcy5lbnYuREJfTkFNRSxcbiAgICAgIGNoYXJzZXQ6ICd1dGY4JyxcbiAgICB9LFxuICB9LFxuICBkZXZlbG9wbWVudDoge1xuICAgIGNsaWVudDogcHJvY2Vzcy5lbnYuREJfQ0xJRU5ULFxuICAgIGNvbm5lY3Rpb246IHtcbiAgICAgIGhvc3Q6IHByb2Nlc3MuZW52LkRCX0hPU1QsXG4gICAgICB1c2VyOiBwcm9jZXNzLmVudi5EQl9VU0VSLFxuICAgICAgcGFzc3dvcmQ6IHByb2Nlc3MuZW52LkRCX1BBU1NXT1JELFxuICAgICAgZGF0YWJhc2U6IHByb2Nlc3MuZW52LkRCX05BTUUsXG4gICAgICBjaGFyc2V0OiAndXRmOCcsXG4gICAgfSxcbiAgICBtaWdyYXRpb25zOiB7XG4gICAgICBkaXJlY3Rvcnk6IE1JR1JBVElPTlNfRElSLFxuICAgIH0sXG4gICAgc2VlZHM6IHtcbiAgICAgIGRpcmVjdG9yeTogU0VFRFNfRElSLFxuICAgIH0sXG4gIH0sXG4gIHByb2R1Y3Rpb246IHtcbiAgICBjbGllbnQ6IHByb2Nlc3MuZW52LkRCX0NMSUVOVCxcbiAgICBjb25uZWN0aW9uOiB7XG4gICAgICBob3N0OiBwcm9jZXNzLmVudi5EQl9IT1NULFxuICAgICAgdXNlcjogcHJvY2Vzcy5lbnYuREJfVVNFUixcbiAgICAgIHBhc3N3b3JkOiBwcm9jZXNzLmVudi5EQl9QQVNTV09SRCxcbiAgICAgIGRhdGFiYXNlOiBwcm9jZXNzLmVudi5EQl9OQU1FLFxuICAgICAgY2hhcnNldDogJ3V0ZjgnLFxuICAgIH0sXG4gICAgbWlncmF0aW9uczoge1xuICAgICAgZGlyZWN0b3J5OiBNSUdSQVRJT05TX0RJUixcbiAgICB9LFxuICAgIHNlZWRzOiB7XG4gICAgICBkaXJlY3Rvcnk6IFNFRURTX0RJUixcbiAgICB9LFxuICB9LFxufTtcbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IGhlbG1ldCBmcm9tICdoZWxtZXQnO1xuaW1wb3J0IGJvb20gZnJvbSAnZXhwcmVzcy1ib29tJztcbmltcG9ydCAnLi4vY29uZmlnJztcbmltcG9ydCByb3V0ZXMgZnJvbSAnQC9odHRwJztcbmltcG9ydCAnQC9tb2RlbHMnO1xuXG5jb25zdCBhcHAgPSBleHByZXNzKCk7XG5cbi8vIEV4cHJlc3MgY29uZmlndXJhdGlvblxuYXBwLnNldCgncG9ydCcsIHByb2Nlc3MuZW52LlBPUlQgfHwgMzAwMCk7XG5cbmFwcC51c2UoaGVsbWV0KCkpO1xuYXBwLnVzZShib29tKCkpO1xuYXBwLnVzZShleHByZXNzLmpzb24oKSk7XG5cbnJvdXRlcyhhcHApO1xuXG5leHBvcnQgZGVmYXVsdCBhcHA7XG4iLCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVkZ2V0RW50cmllc1NldCB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hY2NvdW50cyA9IHt9OyBcbiAgICB0aGlzLnRvdGFsU3VtbWFyeSA9IHt9XG4gICAgdGhpcy5vcmRlclNpemUgPSBudWxsO1xuICB9XG5cbiAgc2V0WmVyb1BsYWNlaG9sZGVyKCkge1xuICAgIGlmICghdGhpcy5vcmRlclNpemUpIHsgcmV0dXJuOyB9XG5cbiAgICBPYmplY3QudmFsdWVzKHRoaXMuYWNjb3VudHMpLmZvckVhY2goKGFjY291bnQpID0+IHtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gdGhpcy5vcmRlclNpemUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhY2NvdW50W2ldID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGFjY291bnRbaV0gPSB7IGFtb3VudDogMCB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZnJvbShhY2NvdW50cywgY29uZmlncykge1xuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBuZXcgdGhpcyhjb25maWdzKTtcblxuICAgIGFjY291bnRzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMuYWNjb3VudHNbZW50cnkuYWNjb3VudElkXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY29sbGVjdGlvbi5hY2NvdW50c1tlbnRyeS5hY2NvdW50SWRdID0ge307XG4gICAgICB9XG4gICAgICBpZiAoZW50cnkub3JkZXIpIHtcbiAgICAgICAgY29sbGVjdGlvbi5hY2NvdW50c1tlbnRyeS5hY2NvdW50SWRdW2VudHJ5Lm9yZGVyXSA9IGVudHJ5O1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgdG9BcnJheSgpIHtcbiAgICBjb25zdCBvdXRwdXQgPSBbXTtcblxuICAgIE9iamVjdC5rZXkodGhpcy5hY2NvdW50cykuZm9yRWFjaCgoYWNjb3VudElkKSA9PiB7XG4gICAgICBjb25zdCBlbnRyaWVzID0gdGhpcy5hY2NvdW50c1thY2NvdW50SWRdO1xuICAgICAgb3V0cHV0LnB1c2goe1xuICAgICAgICBhY2NvdW50X2lkOiBhY2NvdW50SWQsXG4gICAgICAgIGVudHJpZXM6IFtcbiAgICAgICAgICAuLi5PYmplY3Qua2V5KGVudHJpZXMpLm1hcCgob3JkZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0gZW50cmllc1tvcmRlcl07XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBvcmRlcixcbiAgICAgICAgICAgICAgYW1vdW50OiBlbnRyeS5hbW91bnQsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBjYWxjVG90YWxTdW1tYXJ5KCkge1xuICAgIGNvbnN0IHRvdGFsU3VtbWFyeSA9IHt9O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9yZGVyU2l6ZS5sZW5ndGg7IGkrKykge1xuICAgICAgT2JqZWN0LnZhbHVlKHRoaXMuYWNjb3VudHMpLmZvckVhY2goKGFjY291bnQpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiB0b3RhbFN1bW1hcnlbaV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgdG90YWxTdW1tYXJ5W2ldID0geyBhbW91bnQ6IDAsIG9yZGVyOiBpIH07XG4gICAgICAgIH1cbiAgICAgICAgdG90YWxTdW1tYXJ5W2ldLmFtb3VudCArPSBhY2NvdW50W2ldLmFtb3VudDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLnRvdGFsU3VtbWFyeSA9IHRvdGFsU3VtbWFyeTtcbiAgfVxuXG4gIHRvQXJyYXlUb3RhbFN1bW1hcnkoKSB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy50b3RhbFN1bW1hcnkpO1xuICB9XG5cbn1cbiIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmVzdGVkU2V0IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIG1ldGhvZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLVxuICAgKi9cbiAgY29uc3RydWN0b3IoaXRlbXMsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICBwYXJlbnRJZDogJ3BhcmVudF9pZCcsXG4gICAgICBpZDogJ2lkJyxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfTtcbiAgICB0aGlzLml0ZW1zID0gaXRlbXM7XG4gICAgdGhpcy5jb2xsZWN0aW9uID0ge307XG4gICAgdGhpcy50b1RyZWUoKTtcblxuICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogTGluayBub2RlcyBjaGlsZHJlbi5cbiAgICovXG4gIGxpbmtDaGlsZHJlbigpIHtcbiAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgbWFwID0ge307XG4gICAgdGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBtYXBbaXRlbS5pZF0gPSBpdGVtO1xuICAgICAgbWFwW2l0ZW0uaWRdLmNoaWxkcmVuID0gW107XG4gICAgfSk7XG5cbiAgICB0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IHBhcmVudE5vZGVJZCA9IGl0ZW1bdGhpcy5vcHRpb25zLnBhcmVudElkXTtcbiAgICAgIGlmIChwYXJlbnROb2RlSWQpIHtcbiAgICAgICAgbWFwW3BhcmVudE5vZGVJZF0uY2hpbGRyZW4ucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbWFwO1xuICB9XG5cbiAgdG9UcmVlKCkge1xuICAgIGNvbnN0IG1hcCA9IHRoaXMubGlua0NoaWxkcmVuKCk7XG4gICAgY29uc3QgdHJlZSA9IHt9O1xuXG4gICAgdGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBwYXJlbnROb2RlSWQgPSBpdGVtW3RoaXMub3B0aW9ucy5wYXJlbnRJZF07XG4gICAgICBpZiAoIXBhcmVudE5vZGVJZCkge1xuICAgICAgICB0cmVlW2l0ZW0uaWRdID0gbWFwW2l0ZW0uaWRdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuY29sbGVjdGlvbiA9IE9iamVjdC52YWx1ZXModHJlZSk7XG4gIH1cblxuICB0b0FycmF5KCkge1xuXG4gIH1cbn1cbiIsImltcG9ydCBLbmV4IGZyb20gJ2tuZXgnO1xuaW1wb3J0IHsga25leFNuYWtlQ2FzZU1hcHBlcnMgfSBmcm9tICdvYmplY3Rpb24nO1xuaW1wb3J0IGtuZXhmaWxlIGZyb20gJ0AvLi4va25leGZpbGUnO1xuXG5jb25zdCBjb25maWcgPSBrbmV4ZmlsZVtwcm9jZXNzLmVudi5OT0RFX0VOVl07XG5jb25zdCBrbmV4ID0gS25leCh7XG4gIC4uLmNvbmZpZyxcbiAgLi4ua25leFNuYWtlQ2FzZU1hcHBlcnMoeyB1cHBlckNhc2U6IHRydWUgfSksXG59KTtcblxuZXhwb3J0IGRlZmF1bHQga25leDtcbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgY2hlY2ssIHZhbGlkYXRpb25SZXN1bHQsIG9uZU9mIH0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InO1xuaW1wb3J0IHsgZGlmZmVyZW5jZSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgYXN5bmNNaWRkbGV3YXJlIGZyb20gJy4uL21pZGRsZXdhcmUvYXN5bmNNaWRkbGV3YXJlJztcbmltcG9ydCBBY2NvdW50IGZyb20gJ0AvbW9kZWxzL0FjY291bnQnO1xuaW1wb3J0IEpvdXJuYWxQb3N0ZXIgZnJvbSAnQC9zZXJ2aWNlcy9BY2NvdW50aW5nL0pvdXJuYWxQb3N0ZXInO1xuaW1wb3J0IEpvdXJuYWxFbnRyeSBmcm9tICdAL3NlcnZpY2VzL0FjY291bnRpbmcvSm91cm5hbEVudHJ5JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogUm91dGVyIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbiAgICByb3V0ZXIucG9zdCgnLycsXG4gICAgICB0aGlzLm9wZW5pbmdCYWxuYWNlLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5vcGVuaW5nQmFsbmFjZS5oYW5kbGVyKSk7XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9LFxuXG4gIC8qKlxuICAgKiBPcGVuaW5nIGJhbGFuY2UgdG8gdGhlIGdpdmVuIGFjY291bnQuXG4gICAqIEBwYXJhbSB7UmVxdWVzdH0gcmVxIC1cbiAgICogQHBhcmFtIHtSZXNwb25zZX0gcmVzIC1cbiAgICovXG4gIG9wZW5pbmdCYWxuYWNlOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgY2hlY2soJ2FjY291bnRzJykuaXNBcnJheSh7IG1pbjogMSB9KSxcbiAgICAgIGNoZWNrKCdhY2NvdW50cy4qLmlkJykuZXhpc3RzKCkuaXNJbnQoKSxcbiAgICAgIG9uZU9mKFtcbiAgICAgICAgY2hlY2soJ2FjY291bnRzLiouZGViaXQnKS5pc051bWVyaWMoKS50b0Zsb2F0KCksXG4gICAgICAgIGNoZWNrKCdhY2NvdW50cy4qLmNyZWRpdCcpLmlzTnVtZXJpYygpLnRvRmxvYXQoKSxcbiAgICAgIF0pLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBhY2NvdW50cyB9ID0gcmVxLmJvZHk7XG4gICAgICBjb25zdCBhY2NvdW50c0lkcyA9IGFjY291bnRzLm1hcCgoYWNjb3VudCkgPT4gYWNjb3VudC5pZCk7XG4gICAgICBjb25zdCBhY2NvdW50c0NvbGxlY3Rpb24gPSBhd2FpdCBBY2NvdW50LnF1ZXJ5KClcbiAgICAgICAgLnNlbGVjdChbJ2lkJ10pXG4gICAgICAgIC53aGVyZUluKCdpZCcsIGFjY291bnRzSWRzKTtcblxuICAgICAgLy8gR2V0IHRoZSBzdG9yZWQgYWNjb3VudHMgSWRzIGFuZCBkaWZmZXJlbmNlIHdpdGggc3VibWl0IGFjY291bnRzLlxuICAgICAgY29uc3QgYWNjb3VudHNTdG9yZWRJZHMgPSBhY2NvdW50c0NvbGxlY3Rpb24ubWFwKChhY2NvdW50KSA9PiBhY2NvdW50LmlkKTtcbiAgICAgIGNvbnN0IG5vdEZvdW5kQWNjb3VudHNJZHMgPSBkaWZmZXJlbmNlKGFjY291bnRzSWRzLCBhY2NvdW50c1N0b3JlZElkcyk7XG4gICAgICBjb25zdCBlcnJvclJlYXNvbnMgPSBbXTtcblxuICAgICAgaWYgKG5vdEZvdW5kQWNjb3VudHNJZHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBpZHMgPSBub3RGb3VuZEFjY291bnRzSWRzLm1hcCgoYSkgPT4gcGFyc2VJbnQoYSwgMTApKTtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnTk9UX0ZPVU5EX0FDQ09VTlQnLCBjb2RlOiAxMDAsIGlkcyB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChlcnJvclJlYXNvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7IGVycm9yczogZXJyb3JSZWFzb25zIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzaGFyZWRKb3VybmFsRGV0YWlscyA9IG5ldyBKb3VybmFsRW50cnkoe1xuICAgICAgICByZWZlcmVuY2VUeXBlOiAnT3BlbmluZ0JhbGFuY2UnLFxuICAgICAgICByZWZlcmVuY2VJZDogMSxcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgam91cm5hbEVudHJpZXMgPSBuZXcgSm91cm5hbFBvc3RlcihzaGFyZWRKb3VybmFsRGV0YWlscyk7XG5cbiAgICAgIGFjY291bnRzLmZvckVhY2goKGFjY291bnQpID0+IHtcbiAgICAgICAgY29uc3QgZW50cnkgPSBuZXcgSm91cm5hbEVudHJ5KHtcbiAgICAgICAgICBhY2NvdW50OiBhY2NvdW50LmlkLFxuICAgICAgICAgIGFjY291bnROb3JtYWw6IGFjY291bnQudHlwZS5ub3JtYWwsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChhY2NvdW50LmNyZWRpdCkge1xuICAgICAgICAgIGVudHJ5LmNyZWRpdCA9IGFjY291bnQuY3JlZGl0O1xuICAgICAgICAgIGpvdXJuYWxFbnRyaWVzLmNyZWRpdChlbnRyeSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYWNjb3VudC5kZWJpdCkge1xuICAgICAgICAgIGVudHJ5LmRlYml0ID0gYWNjb3VudC5kZWJpdDtcbiAgICAgICAgICBqb3VybmFsRW50cmllcy5kZWJpdChlbnRyeSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIGpvdXJuYWxFbnRyaWVzLnNhdmVFbnRyaWVzKCksXG4gICAgICAgIGpvdXJuYWxFbnRyaWVzLnNhdmVCYWxhbmNlKCksXG4gICAgICBdKTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCgpO1xuICAgIH0sXG4gIH0sXG59O1xuIiwiaW1wb3J0IHsgY2hlY2ssIHF1ZXJ5LCB2YWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InO1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgeyBkaWZmZXJlbmNlIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBBY2NvdW50IGZyb20gJ0AvbW9kZWxzL0FjY291bnQnO1xuaW1wb3J0IGFzeW5jTWlkZGxld2FyZSBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9hc3luY01pZGRsZXdhcmUnO1xuaW1wb3J0IEpXVEF1dGggZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvand0QXV0aCc7XG5pbXBvcnQgSm91cm5hbFBvc3RlciBmcm9tICdAL3NlcnZpY2VzL0FjY291bnRpbmcvSm91cm5hbFBvc3Rlcic7XG5pbXBvcnQgSm91cm5hbEVudHJ5IGZyb20gJ0Avc2VydmljZXMvQWNjb3VudGluZy9Kb3VybmFsRW50cnknO1xuaW1wb3J0IE1hbnVhbEpvdXJuYWwgZnJvbSAnQC9tb2RlbHMvSm91cm5hbEVudHJ5JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogUm91dGVyIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG4gICAgcm91dGVyLnVzZShKV1RBdXRoKTtcblxuICAgIHJvdXRlci5wb3N0KCcvbWFrZS1qb3VybmFsLWVudHJpZXMnLFxuICAgICAgdGhpcy5tYWtlSm91cm5hbEVudHJpZXMudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLm1ha2VKb3VybmFsRW50cmllcy5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIucG9zdCgnL3JlY3VycmluZy1qb3VybmFsLWVudHJpZXMnLFxuICAgICAgdGhpcy5yZWN1cnJpbmdKb3VybmFsRW50cmllcy52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMucmVjdXJyaW5nSm91cm5hbEVudHJpZXMuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLnBvc3QoJ3F1aWNrLWpvdXJuYWwtZW50cmllcycsXG4gICAgICB0aGlzLnF1aWNrSm91cm5hbEVudHJpZXMudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLnF1aWNrSm91cm5hbEVudHJpZXMuaGFuZGxlcikpO1xuXG4gICAgcmV0dXJuIHJvdXRlcjtcbiAgfSxcblxuICAvKipcbiAgICogTWFrZSBqb3VybmFsIGVudHJpcmVzLlxuICAgKi9cbiAgbWFrZUpvdXJuYWxFbnRyaWVzOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgY2hlY2soJ2RhdGUnKS5pc0lTTzg2MDEoKSxcbiAgICAgIGNoZWNrKCdyZWZlcmVuY2UnKS5leGlzdHMoKSxcbiAgICAgIGNoZWNrKCdlbnRyaWVzJykuaXNBcnJheSh7IG1pbjogMSB9KSxcbiAgICAgIGNoZWNrKCdlbnRyaWVzLiouY3JlZGl0JykuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdlbnRyaWVzLiouZGViaXQnKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2VudHJpZXMuKi5hY2NvdW50X2lkJykuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdlbnRyaWVzLioubm90ZScpLm9wdGlvbmFsKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZm9ybSA9IHsgLi4ucmVxLmJvZHkgfTtcbiAgICAgIGNvbnN0IGVycm9yUmVhc29ucyA9IFtdO1xuICAgICAgbGV0IHRvdGFsQ3JlZGl0ID0gMDtcbiAgICAgIGxldCB0b3RhbERlYml0ID0gMDtcblxuICAgICAgZm9ybS5lbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICAgIGlmIChlbnRyeS5jcmVkaXQgPiAwKSB7XG4gICAgICAgICAgdG90YWxDcmVkaXQgKz0gZW50cnkuY3JlZGl0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbnRyeS5kZWJpdCA+IDApIHtcbiAgICAgICAgICB0b3RhbERlYml0ICs9IGVudHJ5LmRlYml0O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmICh0b3RhbENyZWRpdCA8PSAwIHx8IHRvdGFsRGViaXQgPD0gMCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ0NSRURJVC5ERUJJVC5TVU1BVElPTi5TSE9VTEQuTk9ULkVRVUFMLlpFUk8nLFxuICAgICAgICAgIGNvZGU6IDQwMCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAodG90YWxDcmVkaXQgIT09IHRvdGFsRGViaXQpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnQ1JFRElULkRFQklULk5PVC5FUVVBTFMnLCBjb2RlOiAxMDAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBhY2NvdW50c0lkcyA9IGZvcm0uZW50cmllcy5tYXAoKGVudHJ5KSA9PiBlbnRyeS5hY2NvdW50X2lkKTtcbiAgICAgIGNvbnN0IGFjY291bnRzID0gYXdhaXQgQWNjb3VudC5xdWVyeSgpLndoZXJlSW4oJ2lkJywgYWNjb3VudHNJZHMpXG4gICAgICAgIC53aXRoR3JhcGhGZXRjaGVkKCd0eXBlJyk7XG5cbiAgICAgIGNvbnN0IHN0b3JlZEFjY291bnRzSWRzID0gYWNjb3VudHMubWFwKChhY2NvdW50KSA9PiBhY2NvdW50LmlkKTtcblxuICAgICAgaWYgKGRpZmZlcmVuY2UoYWNjb3VudHNJZHMsIHN0b3JlZEFjY291bnRzSWRzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHsgdHlwZTogJ0FDQ09VTlRTLklEUy5OT1QuRk9VTkQnLCBjb2RlOiAyMDAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGpvdXJuYWxSZWZlcmVuY2UgPSBhd2FpdCBNYW51YWxKb3VybmFsLnF1ZXJ5KCkud2hlcmUoJ3JlZmVyZW5jZScsIGZvcm0ucmVmZXJlbmNlKTtcblxuICAgICAgaWYgKGpvdXJuYWxSZWZlcmVuY2UubGVuZ3RoID4gMCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdSRUZFUkVOQ0UuQUxSRUFEWS5FWElTVFMnLCBjb2RlOiAzMDAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZXJyb3JSZWFzb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHsgZXJyb3JzOiBlcnJvclJlYXNvbnMgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBqb3VybmFsUG9zdGVyID0gbmV3IEpvdXJuYWxQb3N0ZXIoKTtcblxuICAgICAgZm9ybS5lbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICAgIGNvbnN0IGFjY291bnQgPSBhY2NvdW50cy5maW5kKChhKSA9PiBhLmlkID09PSBlbnRyeS5hY2NvdW50X2lkKTtcblxuICAgICAgICBjb25zdCBqb3VyYW5sRW50cnkgPSBuZXcgSm91cm5hbEVudHJ5KHtcbiAgICAgICAgICBkZWJpdDogZW50cnkuZGViaXQsXG4gICAgICAgICAgY3JlZGl0OiBlbnRyeS5jcmVkaXQsXG4gICAgICAgICAgYWNjb3VudDogYWNjb3VudC5pZCxcbiAgICAgICAgICBhY2NvdW50Tm9ybWFsOiBhY2NvdW50LnR5cGUubm9ybWFsLFxuICAgICAgICAgIG5vdGU6IGVudHJ5Lm5vdGUsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoZW50cnkuZGViaXQpIHtcbiAgICAgICAgICBqb3VybmFsUG9zdGVyLmRlYml0KGpvdXJhbmxFbnRyeSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgam91cm5hbFBvc3Rlci5jcmVkaXQoam91cmFubEVudHJ5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIFNhdmVzIHRoZSBqb3VybmFsIGVudHJpZXMgYW5kIGFjY291bnRzIGJhbGFuY2UgY2hhbmdlcy5cbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgam91cm5hbFBvc3Rlci5zYXZlRW50cmllcygpLFxuICAgICAgICBqb3VybmFsUG9zdGVyLnNhdmVCYWxhbmNlKCksXG4gICAgICBdKTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCgpO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIFNhdmVzIHJlY3VycmluZyBqb3VybmFsIGVudHJpZXMgdGVtcGxhdGUuXG4gICAqL1xuICByZWN1cnJpbmdKb3VybmFsRW50cmllczoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCd0ZW1wbGF0ZV9uYW1lJykuZXhpc3RzKCksXG4gICAgICBjaGVjaygncmVjdXJyZW5jZScpLmV4aXN0cygpLFxuICAgICAgY2hlY2soJ2FjdGl2ZScpLm9wdGlvbmFsKCkuaXNCb29sZWFuKCkudG9Cb29sZWFuKCksXG4gICAgICBjaGVjaygnZW50cmllcycpLmlzQXJyYXkoeyBtaW46IDEgfSksXG4gICAgICBjaGVjaygnZW50cmllcy4qLmNyZWRpdCcpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnZW50cmllcy4qLmRlYml0JykuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdlbnRyaWVzLiouYWNjb3VudF9pZCcpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnZW50cmllcy4qLm5vdGUnKS5vcHRpb25hbCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIH0sXG4gIH0sXG5cbiAgcmVjdXJyaW5nSm91cm5hbHNMaXN0OiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcXVlcnkoJ3BhZ2UnKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBxdWVyeSgncGFnZV9zaXplJykub3B0aW9uYWwoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgcXVlcnkoJ3RlbXBsYXRlX25hbWUnKS5vcHRpb25hbCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIHF1aWNrSm91cm5hbEVudHJpZXM6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBjaGVjaygnZGF0ZScpLmV4aXN0cygpLmlzSVNPODYwMSgpLFxuICAgICAgY2hlY2soJ2Ftb3VudCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvRmxvYXQoKSxcbiAgICAgIGNoZWNrKCdjcmVkaXRfYWNjb3VudF9pZCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnZGViaXRfYWNjb3VudF9pZCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygndHJhbnNhY3Rpb25fdHlwZScpLmV4aXN0cygpLFxuICAgICAgY2hlY2soJ25vdGUnKS5vcHRpb25hbCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVycm9yUmVhc29ucyA9IFtdO1xuICAgICAgY29uc3QgZm9ybSA9IHsgLi4ucmVxLmJvZHkgfTtcblxuICAgICAgY29uc3QgZm91bmRBY2NvdW50cyA9IGF3YWl0IEFjY291bnQucXVlcnkoKVxuICAgICAgICAud2hlcmUoJ2lkJywgZm9ybS5jcmVkaXRfYWNjb3VudF9pZClcbiAgICAgICAgLm9yV2hlcmUoJ2lkJywgZm9ybS5kZWJpdF9hY2NvdW50X2lkKTtcblxuICAgICAgY29uc3QgY3JlZGl0QWNjb3VudCA9IGZvdW5kQWNjb3VudHMuZmluZCgoYSkgPT4gYS5pZCA9PT0gZm9ybS5jcmVkaXRfYWNjb3VudF9pZCk7XG4gICAgICBjb25zdCBkZWJpdEFjY291bnQgPSBmb3VuZEFjY291bnRzLmZpbmQoKGEpID0+IGEuaWQgPT09IGZvcm0uZGViaXRfYWNjb3VudF9pZCk7XG5cbiAgICAgIGlmICghY3JlZGl0QWNjb3VudCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdDUkVESVRfQUNDT1VOVC5OT1QuRVhJU1QnLCBjb2RlOiAxMDAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoIWRlYml0QWNjb3VudCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdERUJJVF9BQ0NPVU5ULk5PVC5FWElTVCcsIGNvZGU6IDIwMCB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChlcnJvclJlYXNvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoeyBlcnJvcnM6IGVycm9yUmVhc29ucyB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gY29uc3Qgam91cm5hbFBvc3RlciA9IG5ldyBKb3VybmFsUG9zdGVyKCk7XG4gICAgICAvLyBjb25zdCBqb3VybmFsQ3JlZGl0ID0gbmV3IEpvdXJuYWxFbnRyeSh7XG4gICAgICAvLyAgIGRlYml0OiBcbiAgICAgIC8vICAgYWNjb3VudDogZGViaXRBY2NvdW50LmlkLFxuICAgICAgLy8gICByZWZlcmVuY2VJZDogXG4gICAgICAvLyB9KVxuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxufTtcbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgY2hlY2ssIHZhbGlkYXRpb25SZXN1bHQsIHBhcmFtLCBxdWVyeSB9IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJztcbmltcG9ydCBhc3luY01pZGRsZXdhcmUgZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvYXN5bmNNaWRkbGV3YXJlJztcbmltcG9ydCBBY2NvdW50IGZyb20gJ0AvbW9kZWxzL0FjY291bnQnO1xuaW1wb3J0IEFjY291bnRUeXBlIGZyb20gJ0AvbW9kZWxzL0FjY291bnRUeXBlJztcbmltcG9ydCBBY2NvdW50VHJhbnNhY3Rpb24gZnJvbSAnQC9tb2RlbHMvQWNjb3VudFRyYW5zYWN0aW9uJztcbmltcG9ydCBKb3VybmFsUG9zdGVyIGZyb20gJ0Avc2VydmljZXMvQWNjb3VudGluZy9Kb3VybmFsUG9zdGVyJztcbmltcG9ydCBBY2NvdW50QmFsYW5jZSBmcm9tICdAL21vZGVscy9BY2NvdW50QmFsYW5jZSc7XG5pbXBvcnQgSldUQXV0aCBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9qd3RBdXRoJztcbmltcG9ydCBOZXN0ZWRTZXQgZnJvbSAnLi4vLi4vY29sbGVjdGlvbi9OZXN0ZWRTZXQnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBSb3V0ZXIgY29uc3RydWN0b3IgbWV0aG9kLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbiAgICByb3V0ZXIudXNlKEpXVEF1dGgpO1xuICAgIHJvdXRlci5wb3N0KCcvJyxcbiAgICAgIHRoaXMubmV3QWNjb3VudC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMubmV3QWNjb3VudC5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIucG9zdCgnLzppZCcsXG4gICAgICB0aGlzLmVkaXRBY2NvdW50LnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5lZGl0QWNjb3VudC5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvOmlkJyxcbiAgICAgIHRoaXMuZ2V0QWNjb3VudC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZ2V0QWNjb3VudC5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvJyxcbiAgICAgIHRoaXMuZ2V0QWNjb3VudHNMaXN0LnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5nZXRBY2NvdW50c0xpc3QuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmRlbGV0ZSgnLzppZCcsXG4gICAgICB0aGlzLmRlbGV0ZUFjY291bnQudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmRlbGV0ZUFjY291bnQuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLnBvc3QoJy86aWQvYWN0aXZlJyxcbiAgICAgIHRoaXMuYWN0aXZlQWNjb3VudC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuYWN0aXZlQWNjb3VudC5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIucG9zdCgnLzppZC9pbmFjdGl2ZScsXG4gICAgICB0aGlzLmluYWN0aXZlQWNjb3VudC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuaW5hY3RpdmVBY2NvdW50LmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCcvOmlkL3JlY2FsY3VsYXRlLWJhbGFuY2UnLFxuICAgICAgdGhpcy5yZWNhbGN1YWx0ZUJhbGFuYWNlLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5yZWNhbGN1YWx0ZUJhbGFuYWNlLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCcvOmlkL3RyYW5zZmVyX2FjY291bnQvOnRvQWNjb3VudCcsXG4gICAgICB0aGlzLnRyYW5zZmVyVG9Bbm90aGVyQWNjb3VudC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMudHJhbnNmZXJUb0Fub3RoZXJBY2NvdW50LmhhbmRsZXIpKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYWNjb3VudC5cbiAgICovXG4gIG5ld0FjY291bnQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBjaGVjaygnbmFtZScpLmV4aXN0cygpLmlzTGVuZ3RoKHsgbWluOiAzIH0pLnRyaW0oKS5lc2NhcGUoKSxcbiAgICAgIGNoZWNrKCdjb2RlJykuZXhpc3RzKCkuaXNMZW5ndGgoeyBtYXg6IDEwIH0pLnRyaW0oKS5lc2NhcGUoKSxcbiAgICAgIGNoZWNrKCdhY2NvdW50X3R5cGVfaWQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2Rlc2NyaXB0aW9uJykub3B0aW9uYWwoKS50cmltKCkuZXNjYXBlKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZm9ybSA9IHsgLi4ucmVxLmJvZHkgfTtcblxuICAgICAgY29uc3QgZm91bmRBY2NvdW50Q29kZVByb21pc2UgPSBmb3JtLmNvZGVcbiAgICAgICAgPyBBY2NvdW50LnF1ZXJ5KCkud2hlcmUoJ2NvZGUnLCBmb3JtLmNvZGUpIDogbnVsbDtcblxuICAgICAgY29uc3QgZm91bmRBY2NvdW50VHlwZVByb21pc2UgPSBBY2NvdW50VHlwZS5xdWVyeSgpXG4gICAgICAgIC5maW5kQnlJZChmb3JtLmFjY291bnRfdHlwZV9pZCk7XG5cbiAgICAgIGNvbnN0IFtmb3VuZEFjY291bnRDb2RlLCBmb3VuZEFjY291bnRUeXBlXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgZm91bmRBY2NvdW50Q29kZVByb21pc2UsIGZvdW5kQWNjb3VudFR5cGVQcm9taXNlLFxuICAgICAgXSk7XG5cbiAgICAgIGlmIChmb3VuZEFjY291bnRDb2RlUHJvbWlzZSAmJiBmb3VuZEFjY291bnRDb2RlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ05PVF9VTklRVUVfQ09ERScsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoIWZvdW5kQWNjb3VudFR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ05PVF9FWElTVF9BQ0NPVU5UX1RZUEUnLCBjb2RlOiAyMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgYXdhaXQgQWNjb3VudC5xdWVyeSgpLmluc2VydCh7IC4uLmZvcm0gfSk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGl0ZW06IHsgfSB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBFZGl0IHRoZSBnaXZlbiBhY2NvdW50IGRldGFpbHMuXG4gICAqL1xuICBlZGl0QWNjb3VudDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdpZCcpLmV4aXN0cygpLnRvSW50KCksXG4gICAgICBjaGVjaygnbmFtZScpLmV4aXN0cygpLmlzTGVuZ3RoKHsgbWluOiAzIH0pLnRyaW0oKS5lc2NhcGUoKSxcbiAgICAgIGNoZWNrKCdjb2RlJykuZXhpc3RzKCkuaXNMZW5ndGgoeyBtYXg6IDEwIH0pLnRyaW0oKS5lc2NhcGUoKSxcbiAgICAgIGNoZWNrKCdhY2NvdW50X3R5cGVfaWQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2Rlc2NyaXB0aW9uJykub3B0aW9uYWwoKS50cmltKCkuZXNjYXBlKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGZvcm0gPSB7IC4uLnJlcS5ib2R5IH07XG4gICAgICBjb25zdCBhY2NvdW50ID0gYXdhaXQgQWNjb3VudC5xdWVyeSgpLmZpbmRCeUlkKGlkKTtcblxuICAgICAgaWYgKCFhY2NvdW50KSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZCgpO1xuICAgICAgfVxuICAgICAgY29uc3QgZm91bmRBY2NvdW50Q29kZVByb21pc2UgPSAoZm9ybS5jb2RlICYmIGZvcm0uY29kZSAhPT0gYWNjb3VudC5jb2RlKVxuICAgICAgICA/IEFjY291bnQucXVlcnkoKS53aGVyZSgnY29kZScsIGZvcm0uY29kZSkud2hlcmVOb3QoJ2lkJywgYWNjb3VudC5pZCkgOiBudWxsO1xuXG4gICAgICBjb25zdCBmb3VuZEFjY291bnRUeXBlUHJvbWlzZSA9IChmb3JtLmFjY291bnRfdHlwZV9pZCAhPT0gYWNjb3VudC5hY2NvdW50X3R5cGVfaWQpXG4gICAgICAgID8gQWNjb3VudFR5cGUucXVlcnkoKS53aGVyZSgnaWQnLCBmb3JtLmFjY291bnRfdHlwZV9pZCkgOiBudWxsO1xuXG4gICAgICBjb25zdCBbZm91bmRBY2NvdW50Q29kZSwgZm91bmRBY2NvdW50VHlwZV0gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIGZvdW5kQWNjb3VudENvZGVQcm9taXNlLCBmb3VuZEFjY291bnRUeXBlUHJvbWlzZSxcbiAgICAgIF0pO1xuICAgICAgaWYgKGZvdW5kQWNjb3VudENvZGUubGVuZ3RoID4gMCAmJiBmb3VuZEFjY291bnRDb2RlUHJvbWlzZSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkUmVxdWVzdChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnTk9UX1VOSVFVRV9DT0RFJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZEFjY291bnRUeXBlLmxlbmd0aCA8PSAwICYmIGZvdW5kQWNjb3VudFR5cGVQcm9taXNlKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWRSZXF1ZXN0KG51bGwsIHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdOT1RfRVhJU1RfQUNDT1VOVF9UWVBFJywgY29kZTogMTEwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IGFjY291bnQucGF0Y2goeyAuLi5mb3JtIH0pO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgZGV0YWlscyBvZiB0aGUgZ2l2ZW4gYWNjb3VudC5cbiAgICovXG4gIGdldEFjY291bnQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBwYXJhbSgnaWQnKS50b0ludCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgeyBpZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IGFjY291bnQgPSBhd2FpdCBBY2NvdW50LndoZXJlKCdpZCcsIGlkKS5mZXRjaCgpO1xuXG4gICAgICBpZiAoIWFjY291bnQpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyBpdGVtOiB7IC4uLmFjY291bnQuYXR0cmlidXRlcyB9IH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIERlbGV0ZSB0aGUgZ2l2ZW4gYWNjb3VudC5cbiAgICovXG4gIGRlbGV0ZUFjY291bnQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBwYXJhbSgnaWQnKS50b0ludCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgeyBpZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IGFjY291bnQgPSBhd2FpdCBBY2NvdW50LnF1ZXJ5KCkuZmluZEJ5SWQoaWQpO1xuXG4gICAgICBpZiAoIWFjY291bnQpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKCk7XG4gICAgICB9XG4gICAgICBjb25zdCBhY2NvdW50VHJhbnNhY3Rpb25zID0gYXdhaXQgQWNjb3VudFRyYW5zYWN0aW9uLnF1ZXJ5KClcbiAgICAgICAgLndoZXJlKCdhY2NvdW50X2lkJywgYWNjb3VudC5pZCk7XG5cbiAgICAgIGlmIChhY2NvdW50VHJhbnNhY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ0FDQ09VTlQuSEFTLkFTU09DSUFURUQuVFJBTlNBQ1RJT05TJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IEFjY291bnQucXVlcnkoKS5kZWxldGVCeUlkKGFjY291bnQuaWQpO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhY2NvdW50cyBsaXN0LlxuICAgKi9cbiAgZ2V0QWNjb3VudHNMaXN0OiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcXVlcnkoJ2FjY291bnRfdHlwZXMnKS5vcHRpb25hbCgpLmlzQXJyYXkoKSxcbiAgICAgIHF1ZXJ5KCdhY2NvdW50X3R5cGVzLionKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmb3JtID0ge1xuICAgICAgICBhY2NvdW50X3R5cGVzOiBbXSxcbiAgICAgICAgLi4ucmVxLmJvZHksXG4gICAgICB9O1xuICAgICAgY29uc3QgYWNjb3VudHMgPSBhd2FpdCBBY2NvdW50LnF1ZXJ5KClcbiAgICAgICAgLm1vZGlmeSgnZmlsdGVyQWNjb3VudFR5cGVzJywgZm9ybS5hY2NvdW50X3R5cGVzKTtcblxuICAgICAgY29uc3QgYWNjb3VudHNOZXN0ZWRTZXQgPSBuZXcgTmVzdGVkU2V0KGFjY291bnRzLCB7XG4gICAgICAgIHBhcmVudElkOiAncGFyZW50QWNjb3VudElkJyxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoe1xuICAgICAgICAvLyAuLi5hY2NvdW50c05lc3RlZFNldC50b0FycmF5KCksXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZS1jYWxjdWxhdGVzIGJhbGFuY2Ugb2YgdGhlIGdpdmVuIGFjY291bnQuXG4gICAqL1xuICByZWNhbGN1YWx0ZUJhbGFuYWNlOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ2lkJykuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCBhY2NvdW50ID0gYXdhaXQgQWNjb3VudC5maW5kQnlJZChpZCk7XG5cbiAgICAgIGlmICghYWNjb3VudCkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoe1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ0FDQ09VTlQuTk9ULkZPVU5EJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFjY291bnRUcmFuc2FjdGlvbnMgPSBBY2NvdW50VHJhbnNhY3Rpb24ucXVlcnkoKVxuICAgICAgICAud2hlcmUoJ2FjY291bnRfaWQnLCBhY2NvdW50LmlkKTtcblxuICAgICAgY29uc3Qgam91cm5hbEVudHJpZXMgPSBuZXcgSm91cm5hbFBvc3RlcigpO1xuICAgICAgam91cm5hbEVudHJpZXMubG9hZEZyb21Db2xsZWN0aW9uKGFjY291bnRUcmFuc2FjdGlvbnMpO1xuXG4gICAgICAvLyBEZWxldGUgdGhlIGJhbGFuY2Ugb2YgdGhlIGdpdmVuIGFjY291bnQgaWQuXG4gICAgICBhd2FpdCBBY2NvdW50QmFsYW5jZS5xdWVyeSgpLndoZXJlKCdhY2NvdW50X2lkJywgYWNjb3VudC5pZCkuZGVsZXRlKCk7XG4gICAgICBcbiAgICAgIC8vIFNhdmUgY2FsY3VhbHRlZCBhY2NvdW50IGJhbGFuY2UuXG4gICAgICBhd2FpdCBqb3VybmFsRW50cmllcy5zYXZlQmFsYW5jZSgpO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxuXG5cbiAgYWN0aXZlQWNjb3VudDoge1xuICAgIHZhbGlkYXRpb246IFtcblxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgXG4gICAgfSxcbiAgfSxcblxuICBpbmFjdGl2ZUFjY291bnQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG5cbiAgICB9LFxuICB9LFxuXG4gIHRyYW5zZmVyVG9Bbm90aGVyQWNjb3VudDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdpZCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBwYXJhbSgndG9BY2NvdW50JykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIC8vIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIC8vIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgIC8vICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgLy8gICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgIC8vICAgfSk7XG4gICAgICAvLyB9XG5cbiAgICAgIC8vIGNvbnN0IHsgaWQsIHRvQWNjb3VudDogdG9BY2NvdW50SWQgfSA9IHJlcS5wYXJhbXM7XG5cbiAgICAgIC8vIGNvbnN0IFtmcm9tQWNjb3VudCwgdG9BY2NvdW50XSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIC8vICAgQWNjb3VudC5xdWVyeSgpLmZpbmRCeUlkKGlkKSxcbiAgICAgIC8vICAgQWNjb3VudC5xdWVyeSgpLmZpbmRCeUlkKHRvQWNjb3VudElkKSxcbiAgICAgIC8vIF0pO1xuXG4gICAgICAvLyBjb25zdCBmcm9tQWNjb3VudFRyYW5zYWN0aW9ucyA9IGF3YWl0IEFjY291bnRUcmFuc2FjdGlvbi5xdWVyeSgpXG4gICAgICAvLyAgIC53aGVyZSgnYWNjb3VudF9pZCcsIGZyb21BY2NvdW50KTtcblxuICAgICAgLy8gcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKCk7XG4gICAgfSxcbiAgfSxcbn07XG4iLCJcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgY2hlY2ssIHZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICdleHByZXNzLXZhbGlkYXRvcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgTXVzdGFjaGUgZnJvbSAnbXVzdGFjaGUnO1xuaW1wb3J0IGp3dCBmcm9tICdqc29ud2VidG9rZW4nO1xuaW1wb3J0IGFzeW5jTWlkZGxld2FyZSBmcm9tICcuLi9taWRkbGV3YXJlL2FzeW5jTWlkZGxld2FyZSc7XG5pbXBvcnQgVXNlciBmcm9tICdAL21vZGVscy9Vc2VyJztcbmltcG9ydCBQYXNzd29yZFJlc2V0IGZyb20gJ0AvbW9kZWxzL1Bhc3N3b3JkUmVzZXQnO1xuaW1wb3J0IG1haWwgZnJvbSAnQC9zZXJ2aWNlcy9tYWlsJztcbmltcG9ydCB7IGhhc2hQYXNzd29yZCB9IGZyb20gJ0AvdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBtZXRob2QuXG4gICAqL1xuICByb3V0ZXIoKSB7XG4gICAgY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcblxuICAgIHJvdXRlci5wb3N0KCcvbG9naW4nLFxuICAgICAgdGhpcy5sb2dpbi52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMubG9naW4uaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLnBvc3QoJy9zZW5kX3Jlc2V0X3Bhc3N3b3JkJyxcbiAgICAgIHRoaXMuc2VuZFJlc2V0UGFzc3dvcmQudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLnNlbmRSZXNldFBhc3N3b3JkLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCcvcmVzZXQvOnRva2VuJyxcbiAgICAgIHRoaXMucmVzZXRQYXNzd29yZC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMucmVzZXRQYXNzd29yZC5oYW5kbGVyKSk7XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9LFxuXG4gIC8qKlxuICAgKiBVc2VyIGxvZ2luIGF1dGhlbnRpY2F0aW9uIHJlcXVlc3QuXG4gICAqL1xuICBsb2dpbjoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCdjcmVkaWVudGlhbCcpLmV4aXN0cygpLmlzRW1haWwoKSxcbiAgICAgIGNoZWNrKCdwYXNzd29yZCcpLmV4aXN0cygpLmlzTGVuZ3RoKHsgbWluOiA1IH0pLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHsgY3JlZGllbnRpYWwsIHBhc3N3b3JkIH0gPSByZXEuYm9keTtcbiAgICAgIGNvbnN0IHsgSldUX1NFQ1JFVF9LRVkgfSA9IHByb2Nlc3MuZW52O1xuXG4gICAgICBjb25zdCB1c2VyID0gYXdhaXQgVXNlci5xdWVyeSgpXG4gICAgICAgIC53aGVyZSgnZW1haWwnLCBjcmVkaWVudGlhbClcbiAgICAgICAgLm9yV2hlcmUoJ3Bob25lX251bWJlcicsIGNyZWRpZW50aWFsKVxuICAgICAgICAuZmlyc3QoKTtcblxuICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWRSZXF1ZXN0KG51bGwsIHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdJTlZBTElEX0RFVEFJTFMnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKCF1c2VyLnZlcmlmeVBhc3N3b3JkKHBhc3N3b3JkKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkUmVxdWVzdChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnSU5DT1JSRUNUX1BBU1NXT1JEJywgY29kZTogMTEwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmICghdXNlci5hY3RpdmUpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ1VTRVJfSU5BQ1RJVkUnLCBjb2RlOiAxMjAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLy8gdXNlci51cGRhdGUoeyBsYXN0X2xvZ2luX2F0OiBuZXcgRGF0ZSgpIH0pO1xuXG4gICAgICBjb25zdCB0b2tlbiA9IGp3dC5zaWduKHtcbiAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXG4gICAgICAgIF9pZDogdXNlci5pZCxcbiAgICAgIH0sIEpXVF9TRUNSRVRfS0VZLCB7XG4gICAgICAgIGV4cGlyZXNJbjogJzFkJyxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgdG9rZW4gfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogU2VuZCByZXNldCBwYXNzd29yZCBsaW5rIHZpYSBlbWFpbCBvciBTTVMuXG4gICAqL1xuICBzZW5kUmVzZXRQYXNzd29yZDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCdlbWFpbCcpLmV4aXN0cygpLmlzRW1haWwoKSxcbiAgICBdLFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCB7IGVtYWlsIH0gPSByZXEuYm9keTtcbiAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBVc2VyLndoZXJlKCdlbWFpbCcsIGVtYWlsKS5mZXRjaCgpO1xuXG4gICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDIyKS5zZW5kKCk7XG4gICAgICB9XG4gICAgICAvLyBEZWxldGUgYWxsIHN0b3JlZCB0b2tlbnMgb2YgcmVzZXQgcGFzc3dvcmQgdGhhdCBhc3NvY2lhdGUgdG8gdGhlIGdpdmUgZW1haWwuXG4gICAgICBhd2FpdCBQYXNzd29yZFJlc2V0LndoZXJlKHsgZW1haWwgfSkuZGVzdHJveSh7IHJlcXVpcmU6IGZhbHNlIH0pO1xuXG4gICAgICBjb25zdCBwYXNzd29yZFJlc2V0ID0gUGFzc3dvcmRSZXNldC5mb3JnZSh7XG4gICAgICAgIGVtYWlsLFxuICAgICAgICB0b2tlbjogJzEyMzEyMycsXG4gICAgICB9KTtcbiAgICAgIGF3YWl0IHBhc3N3b3JkUmVzZXQuc2F2ZSgpO1xuXG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi92aWV3cy9tYWlsL1Jlc2V0UGFzc3dvcmQuaHRtbCcpO1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsICd1dGY4Jyk7XG4gICAgICBjb25zdCByZW5kZXJlZCA9IE11c3RhY2hlLnJlbmRlcih0ZW1wbGF0ZSwge1xuICAgICAgICB1cmw6IGAke3JlcS5wcm90b2NvbH06Ly8ke3JlcS5ob3N0bmFtZX0vcmVzZXQvJHtwYXNzd29yZFJlc2V0LmF0dHJpYnV0ZXMudG9rZW59YCxcbiAgICAgICAgZmlyc3RfbmFtZTogdXNlci5hdHRyaWJ1dGVzLmZpcnN0X25hbWUsXG4gICAgICAgIGxhc3RfbmFtZTogdXNlci5hdHRyaWJ1dGVzLmxhc3RfbmFtZSxcbiAgICAgICAgY29udGFjdF91c19lbWFpbDogcHJvY2Vzcy5lbnYuQ09OVEFDVF9VU19FTUFJTCxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBtYWlsT3B0aW9ucyA9IHtcbiAgICAgICAgdG86IHVzZXIuYXR0cmlidXRlcy5lbWFpbCxcbiAgICAgICAgZnJvbTogYCR7cHJvY2Vzcy5lbnYuTUFJTF9GUk9NX05BTUV9ICR7cHJvY2Vzcy5lbnYuTUFJTF9GUk9NX0FERFJFU1N9YCxcbiAgICAgICAgc3ViamVjdDogJ1JhdHRlYiBQYXNzd29yZCBSZXNldCcsXG4gICAgICAgIGh0bWw6IHJlbmRlcmVkLFxuICAgICAgfTtcblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gICAgICBtYWlsLnNlbmRNYWlsKG1haWxPcHRpb25zLCAoZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoeyBkYXRhOiB7IGVtYWlsOiBwYXNzd29yZFJlc2V0LmF0dHJpYnV0ZXMuZW1haWwgfSB9KTtcbiAgICAgIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlc2V0IHBhc3N3b3JkLlxuICAgKi9cbiAgcmVzZXRQYXNzd29yZDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCdwYXNzd29yZCcpLmV4aXN0cygpLmlzTGVuZ3RoKHsgbWluOiA1IH0pLmN1c3RvbSgodmFsdWUsIHsgcmVxIH0pID0+IHtcbiAgICAgICAgaWYgKHZhbHVlICE9PSByZXEuYm9keS5jb25maXJtX3Bhc3N3b3JkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUGFzc3dvcmRzIGRvbid0IG1hdGNoXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAnVkFMSURBVElPTl9FUlJPUicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgeyB0b2tlbiB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IHsgcGFzc3dvcmQgfSA9IHJlcS5ib2R5O1xuXG4gICAgICBjb25zdCB0b2tlbk1vZGVsID0gYXdhaXQgUGFzc3dvcmRSZXNldC5xdWVyeSgpXG4gICAgICAgIC53aGVyZSgndG9rZW4nLCB0b2tlbilcbiAgICAgICAgLndoZXJlKCdjcmVhdGVkX2F0JywgJz49JywgRGF0ZS5ub3coKSAtIDM2MDAwMDApXG4gICAgICAgIC5maXJzdCgpO1xuXG4gICAgICBpZiAoIXRva2VuTW9kZWwpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ1RPS0VOX0lOVkFMSUQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgdXNlciA9IGF3YWl0IFVzZXIud2hlcmUoe1xuICAgICAgICBlbWFpbDogdG9rZW5Nb2RlbC5lbWFpbCxcbiAgICAgIH0pO1xuICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWRSZXF1ZXN0KG51bGwsIHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdVU0VSX05PVF9GT1VORCcsIGNvZGU6IDEyMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBoYXNoZWRQYXNzd29yZCA9IGF3YWl0IGhhc2hQYXNzd29yZChwYXNzd29yZCk7XG5cbiAgICAgIHVzZXIucGFzc3dvcmQgPSBoYXNoZWRQYXNzd29yZDtcbiAgICAgIGF3YWl0IHVzZXIuc2F2ZSgpO1xuXG4gICAgICBhd2FpdCBQYXNzd29yZFJlc2V0LndoZXJlKCdlbWFpbCcsIHVzZXIuZ2V0KCdlbWFpbCcpKS5kZXN0cm95KHsgcmVxdWlyZTogZmFsc2UgfSk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7fSk7XG4gICAgfSxcbiAgfSxcbn07XG4iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIHJvdXRlcigpIHtcbiAgICBjb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuXG4gICAgcmV0dXJuIHJvdXRlcjtcbiAgfSxcbn07XG4iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCB7XG4gIGNoZWNrLFxuICBxdWVyeSxcbiAgcGFyYW0sXG4gIHZhbGlkYXRpb25SZXN1bHQsXG59IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJztcbmltcG9ydCB7IHBpY2ssIGRpZmZlcmVuY2UsIGdyb3VwQnkgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGFzeW5jTWlkZGxld2FyZSBmcm9tIFwiQC9odHRwL21pZGRsZXdhcmUvYXN5bmNNaWRkbGV3YXJlXCI7XG5pbXBvcnQgSldUQXV0aCBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9qd3RBdXRoJztcbmltcG9ydCBCdWRnZXQgZnJvbSAnQC9tb2RlbHMvQnVkZ2V0JztcbmltcG9ydCBCdWRnZXRFbnRyeSBmcm9tICdAL21vZGVscy9CdWRnZXRFbnRyeSc7XG5pbXBvcnQgQWNjb3VudCBmcm9tICdAL21vZGVscy9BY2NvdW50JztcbmltcG9ydCBtb21lbnQgZnJvbSAnQC9zZXJ2aWNlcy9Nb21lbnQnO1xuaW1wb3J0IEJ1ZGdldEVudHJpZXNTZXQgZnJvbSAnQC9jb2xsZWN0aW9uL0J1ZGdldEVudHJpZXNTZXQnO1xuaW1wb3J0IEFjY291bnRUeXBlIGZyb20gJ0AvbW9kZWxzL0FjY291bnRUeXBlJztcbmltcG9ydCBOZXN0ZWRTZXQgZnJvbSAnQC9jb2xsZWN0aW9uL05lc3RlZFNldCc7XG5cbmNvbnN0IGZvcm1hdFBhcnNlID0gKHJhbmdlVHlwZSkgPT4ge1xuICBzd2l0Y2ggKHJhbmdlVHlwZSkge1xuICAgIGNhc2UgJ3llYXInOlxuICAgICAgcmV0dXJuICdZWVlZJztcbiAgICBjYXNlICdtb250aCc6XG4gICAgY2FzZSAncXVhcnRlcic6XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnWVlZWS1NTSc7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyoqXG4gICAqIFJvdXRlciBjb25zdHJ1Y3Rvci5cbiAgICovXG4gIHJvdXRlcigpIHtcbiAgICBjb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuXG4gICAgcm91dGVyLnVzZShKV1RBdXRoKTtcblxuICAgIHJvdXRlci5wb3N0KCcvJyxcbiAgICAgIHRoaXMubmV3QnVkZ2V0LnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5uZXdCdWRnZXQuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmdldCgnLzppZCcsXG4gICAgICB0aGlzLmdldEJ1ZGdldC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZ2V0QnVkZ2V0LmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5nZXQoJy86aWQnLFxuICAgICAgdGhpcy5kZWxldGVCdWRnZXQudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmRlbGV0ZUJ1ZGdldC5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvJyxcbiAgICAgIHRoaXMubGlzdEJ1ZGdldHMudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmxpc3RCdWRnZXRzLmhhbmRsZXIpKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGJ1ZGdldCBkZXRhaWxzIG9mIHRoZSBnaXZlbiBpZC5cbiAgICovXG4gIGdldEJ1ZGdldDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdpZCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgeyBpZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IGJ1ZGdldCA9IGF3YWl0IEJ1ZGdldC5xdWVyeSgpLmZpbmRCeUlkKGlkKTtcblxuICAgICAgaWYgKCFidWRnZXQpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5zZW5kKHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdidWRnZXQubm90LmZvdW5kJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYWNjb3VudFR5cGVzID0gYXdhaXQgQWNjb3VudFR5cGUucXVlcnkoKS53aGVyZSgnYmFsYW5jZV9zaGVldCcsIHRydWUpO1xuXG4gICAgICBjb25zdCBbYnVkZ2V0RW50cmllcywgYWNjb3VudHNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBCdWRnZXRFbnRyeS5xdWVyeSgpLndoZXJlKCdidWRnZXRfaWQnLCBidWRnZXQuaWQpLFxuICAgICAgICBBY2NvdW50LnF1ZXJ5KCkud2hlcmVJbignYWNjb3VudF90eXBlX2lkJywgYWNjb3VudFR5cGVzLm1hcCgoYSkgPT4gYS5pZCkpLFxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGFjY291bnRzTmVzdGVkU2V0ID0gbmV3IE5lc3RlZFNldChhY2NvdW50cyk7XG5cbiAgICAgIGNvbnN0IGNvbHVtbnMgPSBbXTtcbiAgICAgIGNvbnN0IGZyb21EYXRlID0gbW9tZW50KGJ1ZGdldC55ZWFyKS5zdGFydE9mKCd5ZWFyJylcbiAgICAgICAgLmFkZChidWRnZXQucmFuZ2VPZmZzZXQsIGJ1ZGdldC5yYW5nZUJ5KS50b0RhdGUoKTtcblxuICAgICAgY29uc3QgdG9EYXRlID0gbW9tZW50KGJ1ZGdldC55ZWFyKS5lbmRPZigneWVhcicpLnRvRGF0ZSgpO1xuXG4gICAgICBjb25zdCBkYXRlUmFuZ2UgPSBtb21lbnQucmFuZ2UoZnJvbURhdGUsIHRvRGF0ZSk7XG4gICAgICBjb25zdCBkYXRlUmFuZ2VDb2xsZWN0aW9uID0gQXJyYXkuZnJvbShkYXRlUmFuZ2UuYnkoYnVkZ2V0LnJhbmdlQnksIHtcbiAgICAgICAgc3RlcDogYnVkZ2V0LnJhbmdlSW5jcmVtZW50LCBleGNsdWRlRW5kOiBmYWxzZSwgZXhjbHVkZVN0YXJ0OiBmYWxzZSxcbiAgICAgIH0pKTtcblxuICAgICAgZGF0ZVJhbmdlQ29sbGVjdGlvbi5mb3JFYWNoKChkYXRlKSA9PiB7XG4gICAgICAgIGNvbHVtbnMucHVzaChkYXRlLmZvcm1hdChmb3JtYXRQYXJzZShidWRnZXQucmFuZ2VCeSkpKTtcbiAgICAgIH0pO1xuICAgICAgY29uc3QgYnVkZ2V0RW50cmllc1NldCA9IEJ1ZGdldEVudHJpZXNTZXQuZnJvbShidWRnZXRFbnRyaWVzLCB7XG4gICAgICAgIG9yZGVyU2l6ZTogY29sdW1ucy5sZW5ndGgsXG4gICAgICB9KTtcbiAgICAgIGJ1ZGdldEVudHJpZXNTZXQuc2V0WmVyb1BsYWNlaG9sZGVyKCk7XG4gICAgICBidWRnZXRFbnRyaWVzU2V0LmNhbGNUb3RhbFN1bW1hcnkoKTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgY29sdW1ucyxcbiAgICAgICAgYWNjb3VudHM6IGJ1ZGdldEVudHJpZXNTZXQudG9BcnJheSgpLFxuICAgICAgICB0b3RhbDogYnVkZ2V0RW50cmllc1NldC50b0FycmF5VG90YWxTdW1tYXJ5KCksXG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIERlbGV0ZSB0aGUgZ2l2ZW4gYnVkZ2V0LlxuICAgKi9cbiAgZGVsZXRlQnVkZ2V0OiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ2lkJykuZXhpc3RzKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgYnVkZ2V0ID0gYXdhaXQgQnVkZ2V0LnF1ZXJ5KCkuZmluZEJ5SWQoaWQpO1xuXG4gICAgICBpZiAoIWJ1ZGdldCkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLnNlbmQoe1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ2J1ZGdldC5ub3QuZm91bmQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgYXdhaXQgQnVkZ2V0RW50cnkucXVlcnkoKS53aGVyZSgnYnVkZ2V0X2lkJywgYnVkZ2V0LmlkKS5kZWxldGUoKTtcbiAgICAgIGF3YWl0IGJ1ZGdldC5kZWxldGUoKTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKCk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogU2F2ZXMgdGhlIG5ldyBidWRnZXQuXG4gICAqL1xuICBuZXdCdWRnZXQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBjaGVjaygnbmFtZScpLmV4aXN0cygpLFxuICAgICAgY2hlY2soJ2Zpc2NhbF95ZWFyJykuZXhpc3RzKCksXG4gICAgICBjaGVjaygncGVyaW9kJykuZXhpc3RzKCkuaXNJbihbJ3llYXInLCAnbW9udGgnLCAncXVhcnRlcicsICdoYWxmLXllYXInXSksXG4gICAgICBjaGVjaygnYWNjb3VudHNfdHlwZScpLmV4aXN0cygpLmlzSW4oWydiYWxhbmNlX3NoZWV0JywgJ3Byb2ZpdF9sb3NzJ10pLFxuICAgICAgY2hlY2soJ2FjY291bnRzJykuaXNBcnJheSgpLFxuICAgICAgY2hlY2soJ2FjY291bnRzLiouYWNjb3VudF9pZCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnYWNjb3VudHMuKi5lbnRyaWVzJykuZXhpc3RzKCkuaXNBcnJheSgpLFxuICAgICAgY2hlY2soJ2FjY291bnRzLiouZW50cmllcy4qLmFtb3VudCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvRmxvYXQoKSxcbiAgICAgIGNoZWNrKCdhY2NvdW50cy4qLmVudHJpZXMuKi5vcmRlcicpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmb3JtID0geyAuLi5yZXEuYm9keSB9O1xuICAgICAgY29uc3Qgc3VibWl0QWNjb3VudHNJZHMgPSBmb3JtLmFjY291bnRzLm1hcCgoYSkgPT4gYS5hY2NvdW50X2lkKTtcbiAgICAgIGNvbnN0IHN0b3JlZEFjY291bnRzID0gYXdhaXQgQWNjb3VudC5xdWVyeSgpLndoZXJlSW4oJ2lkJywgc3VibWl0QWNjb3VudHNJZHMpO1xuICAgICAgY29uc3Qgc3RvcmVkQWNjb3VudHNJZHMgPSBzdG9yZWRBY2NvdW50cy5tYXAoKGEpID0+IGEuaWQpO1xuXG4gICAgICBjb25zdCBlcnJvclJlYXNvbnMgPSBbXTtcbiAgICAgIGNvbnN0IG5vdEZvdW5kQWNjb3VudHNJZHMgPSBkaWZmZXJlbmNlKHN1Ym1pdEFjY291bnRzSWRzLCBzdG9yZWRBY2NvdW50c0lkcyk7XG5cbiAgICAgIGlmIChub3RGb3VuZEFjY291bnRzSWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdBQ0NPVU5ULk5PVC5GT1VORCcsIGNvZGU6IDIwMCwgYWNjb3VudHM6IG5vdEZvdW5kQWNjb3VudHNJZHMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGVycm9yUmVhc29ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7IGVycm9yczogZXJyb3JSZWFzb25zIH0pO1xuICAgICAgfVxuICAgICAgLy8gdmFsaWRhdGlvbiBlbnRyaWVzIG9yZGVyLlxuICAgICAgY29uc3QgYnVkZ2V0ID0gYXdhaXQgQnVkZ2V0LnF1ZXJ5KCkuaW5zZXJ0KHtcbiAgICAgICAgLi4ucGljayhmb3JtLCBbJ25hbWUnLCAnZmlzY2FsX3llYXInLCAncGVyaW9kJywgJ2FjY291bnRzX3R5cGUnXSksXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgcHJvbWlzZU9wZXJzID0gW107XG5cbiAgICAgIGZvcm0uYWNjb3VudHMuZm9yRWFjaCgoYWNjb3VudCkgPT4ge1xuICAgICAgICBhY2NvdW50LmVudHJpZXMuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgICAgICBjb25zdCBidWRnZXRFbnRyeSA9IEJ1ZGdldEVudHJ5LnF1ZXJ5KCkuaW5zZXJ0KHtcbiAgICAgICAgICAgIGFjY291bnRfaWQ6IGFjY291bnQuYWNjb3VudF9pZCxcbiAgICAgICAgICAgIGFtb3VudDogZW50cnkuYW1vdW50LFxuICAgICAgICAgICAgb3JkZXI6IGVudHJ5Lm9yZGVyLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHByb21pc2VPcGVycy5wdXNoKGJ1ZGdldEVudHJ5KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VPcGVycyk7XG4gICAgICBcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGlkOiBidWRnZXQuaWQgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogTGlzdCBvZiBwYWdpbmF0ZWQgYnVkZ2V0cyBpdGVtcy5cbiAgICovXG4gIGxpc3RCdWRnZXRzOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcXVlcnkoJ3llYXInKS5vcHRpb25hbCgpLFxuICAgICAgcXVlcnkoJ2luY29tZV9zdGF0ZW1lbnQnKS5vcHRpb25hbCgpLmlzQm9vbGVhbigpLnRvQm9vbGVhbigpLFxuICAgICAgcXVlcnkoJ3Byb2ZpdF9sb3NzJykub3B0aW9uYWwoKS5pc0Jvb2xlYW4oKS50b0Jvb2xlYW4oKSxcbiAgICAgIHF1ZXJ5KCdwYWdlJykuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIHF1ZXJ5KCdwYWdlX3NpemUnKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmlsdGVyID0ge1xuICAgICAgICBwYWdlX3NpemU6IDEwLFxuICAgICAgICBwYWdlOiAxLFxuICAgICAgICAuLi5yZXEucXVlcnksXG4gICAgICB9O1xuICAgICAgY29uc3QgYnVkZ2V0cyA9IGF3YWl0IEJ1ZGdldC5xdWVyeSgpXG4gICAgICAgIC5tb2RpZnkoJ2ZpbHRlckJ5WWVhcicsIGZpbHRlci55ZWFyKVxuICAgICAgICAubW9kaWZ5KCdmaWx0ZXJCeUluY29tZVN0YXRlbWVudCcsIGZpbHRlci5pbmNvbWVfc3RhdGVtZW50KVxuICAgICAgICAubW9kaWZ5KCdmaWx0ZXJCeVByb2ZpdExvc3MnLCBmaWx0ZXIucHJvZml0X2xvc3MpXG4gICAgICAgIC5wYWdlKGZpbHRlci5wYWdlLCBmaWx0ZXIucGFnZV9zaXplKTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgaXRlbXM6IGJ1ZGdldHMuaXRlbXMsXG4gICAgICB9KVxuICAgIH0sXG4gIH0sXG59O1xuIiwiXG5leHBvcnQgZGVmYXVsdCB7XG4gIFxuICBhZGRFeGNoYW5nZVByaWNlOiB7XG4gICAgdmFsaWRhdGlvbjoge1xuICAgICAgXG4gICAgfSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG5cbiAgICB9LFxuICB9LFxufSIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9LFxufTtcbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHtcbiAgY2hlY2ssXG4gIHBhcmFtLFxuICBxdWVyeSxcbiAgdmFsaWRhdGlvblJlc3VsdCxcbn0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHsgZGlmZmVyZW5jZSwgY2hhaW4gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGFzeW5jTWlkZGxld2FyZSBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9hc3luY01pZGRsZXdhcmUnO1xuaW1wb3J0IEV4cGVuc2UgZnJvbSAnQC9tb2RlbHMvRXhwZW5zZSc7XG5pbXBvcnQgQWNjb3VudCBmcm9tICdAL21vZGVscy9BY2NvdW50JztcbmltcG9ydCBKb3VybmFsUG9zdGVyIGZyb20gJ0Avc2VydmljZXMvQWNjb3VudGluZy9Kb3VybmFsUG9zdGVyJztcbmltcG9ydCBKb3VybmFsRW50cnkgZnJvbSAnQC9zZXJ2aWNlcy9BY2NvdW50aW5nL0pvdXJuYWxFbnRyeSc7XG5pbXBvcnQgSldUQXV0aCBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9qd3RBdXRoJztcbmltcG9ydCBBY2NvdW50VHJhbnNhY3Rpb24gZnJvbSAnQC9tb2RlbHMvQWNjb3VudFRyYW5zYWN0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogUm91dGVyIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG4gICAgcm91dGVyLnVzZShKV1RBdXRoKTtcblxuICAgIHJvdXRlci5wb3N0KCcvJyxcbiAgICAgIHRoaXMubmV3RXhwZW5zZS52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMubmV3RXhwZW5zZS5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZGVsZXRlKCcvOmlkJyxcbiAgICAgIHRoaXMuZGVsZXRlRXhwZW5zZS52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZGVsZXRlRXhwZW5zZS5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIucG9zdCgnL2J1bGsnLFxuICAgICAgdGhpcy5idWxrQWRkRXhwZW5zZXMudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmJ1bGtBZGRFeHBlbnNlcy5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIucG9zdCgnLzppZCcsXG4gICAgICB0aGlzLnVwZGF0ZUV4cGVuc2UudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLnVwZGF0ZUV4cGVuc2UuaGFuZGxlcikpO1xuXG4gICAgcmV0dXJuIHJvdXRlcjtcbiAgfSxcblxuICAvKipcbiAgICogU2F2ZXMgYSBuZXcgZXhwZW5zZS5cbiAgICovXG4gIG5ld0V4cGVuc2U6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBjaGVjaygnZGF0ZScpLm9wdGlvbmFsKCkuaXNJU084NjAxKCksXG4gICAgICBjaGVjaygncGF5bWVudF9hY2NvdW50X2lkJykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdleHBlbnNlX2FjY291bnRfaWQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2Rlc2NyaXB0aW9uJykub3B0aW9uYWwoKSxcbiAgICAgIGNoZWNrKCdhbW91bnQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0Zsb2F0KCksXG4gICAgICBjaGVjaygnY3VycmVuY3lfY29kZScpLm9wdGlvbmFsKCksXG4gICAgICBjaGVjaygnZXhjaGFuZ2VfcmF0ZScpLm9wdGlvbmFsKCkuaXNOdW1lcmljKCkudG9GbG9hdCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGZvcm0gPSB7XG4gICAgICAgIGRhdGU6IG5ldyBEYXRlKCksXG4gICAgICAgIC4uLnJlcS5ib2R5LFxuICAgICAgfTtcbiAgICAgIC8vIENvbnZlcnQgdGhlIGRhdGUgdG8gdGhlIGdlbmVyYWwgZm9ybWF0LlxuICAgICAgZm9ybS5kYXRlID0gbW9tZW50KGZvcm0uZGF0ZSkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG5cbiAgICAgIGNvbnN0IGVycm9yUmVhc29ucyA9IFtdO1xuICAgICAgY29uc3QgcGF5bWVudEFjY291bnQgPSBhd2FpdCBBY2NvdW50LnF1ZXJ5KClcbiAgICAgICAgLmZpbmRCeUlkKGZvcm0ucGF5bWVudF9hY2NvdW50X2lkKS5maXJzdCgpO1xuXG4gICAgICBpZiAoIXBheW1lbnRBY2NvdW50KSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHsgdHlwZTogJ1BBWU1FTlQuQUNDT1VOVC5OT1QuRk9VTkQnLCBjb2RlOiAxMDAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBleHBlbnNlQWNjb3VudCA9IGF3YWl0IEFjY291bnQucXVlcnkoKVxuICAgICAgICAuZmluZEJ5SWQoZm9ybS5leHBlbnNlX2FjY291bnRfaWQpLmZpcnN0KCk7XG5cbiAgICAgIGlmICghZXhwZW5zZUFjY291bnQpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnRVhQRU5TRS5BQ0NPVU5ULk5PVC5GT1VORCcsIGNvZGU6IDIwMCB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChlcnJvclJlYXNvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoeyBlcnJvcnM6IGVycm9yUmVhc29ucyB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGV4cGVuc2VUcmFuc2FjdGlvbiA9IGF3YWl0IEV4cGVuc2UucXVlcnkoKS5pbnNlcnQoeyAuLi5mb3JtIH0pO1xuXG4gICAgICBjb25zdCBqb3VybmFsRW50cmllcyA9IG5ldyBKb3VybmFsUG9zdGVyKCk7XG4gICAgICBjb25zdCBjcmVkaXRFbnRyeSA9IG5ldyBKb3VybmFsRW50cnkoe1xuICAgICAgICBjcmVkaXQ6IGZvcm0uYW1vdW50LFxuICAgICAgICByZWZlcmVuY2VJZDogZXhwZW5zZVRyYW5zYWN0aW9uLmlkLFxuICAgICAgICByZWZlcmVuY2VUeXBlOiBFeHBlbnNlLnJlZmVyZW5jZVR5cGUsXG4gICAgICAgIGRhdGU6IGZvcm0uZGF0ZSxcbiAgICAgICAgYWNjb3VudDogZXhwZW5zZUFjY291bnQuaWQsXG4gICAgICAgIGFjY291bnROb3JtYWw6ICdkZWJpdCcsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGRlYml0RW50cnkgPSBuZXcgSm91cm5hbEVudHJ5KHtcbiAgICAgICAgZGViaXQ6IGZvcm0uYW1vdW50LFxuICAgICAgICByZWZlcmVuY2VJZDogZXhwZW5zZVRyYW5zYWN0aW9uLmlkLFxuICAgICAgICByZWZlcmVuY2VUeXBlOiBFeHBlbnNlLnJlZmVyZW5jZVR5cGUsXG4gICAgICAgIGRhdGU6IGZvcm0uZGF0ZSxcbiAgICAgICAgYWNjb3VudDogcGF5bWVudEFjY291bnQuaWQsXG4gICAgICAgIGFjY291bnROb3JtYWw6ICdkZWJpdCcsXG4gICAgICB9KTtcbiAgICAgIGpvdXJuYWxFbnRyaWVzLmNyZWRpdChjcmVkaXRFbnRyeSk7XG4gICAgICBqb3VybmFsRW50cmllcy5kZWJpdChkZWJpdEVudHJ5KTtcblxuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBqb3VybmFsRW50cmllcy5zYXZlRW50cmllcygpLFxuICAgICAgICBqb3VybmFsRW50cmllcy5zYXZlQmFsYW5jZSgpLFxuICAgICAgXSk7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyBpZDogZXhwZW5zZVRyYW5zYWN0aW9uLmlkIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIEJ1bGsgYWRkIGV4cG5lc2VzIHRvIHRoZSBnaXZlbiBhY2NvdW50cy5cbiAgICovXG4gIGJ1bGtBZGRFeHBlbnNlczoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCdleHBlbnNlcycpLmV4aXN0cygpLmlzQXJyYXkoeyBtaW46IDEgfSksXG4gICAgICBjaGVjaygnZXhwZW5zZXMuKi5kYXRlJykub3B0aW9uYWwoKS5pc0lTTzg2MDEoKSxcbiAgICAgIGNoZWNrKCdleHBlbnNlcy4qLnBheW1lbnRfYWNjb3VudF9pZCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnZXhwZW5zZXMuKi5leHBlbnNlX2FjY291bnRfaWQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2V4cGVuc2VzLiouZGVzY3JpcHRpb24nKS5vcHRpb25hbCgpLFxuICAgICAgY2hlY2soJ2V4cGVuc2VzLiouYW1vdW50JykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9GbG9hdCgpLFxuICAgICAgY2hlY2soJ2V4cGVuc2VzLiouY3VycmVuY3lfY29kZScpLm9wdGlvbmFsKCksXG4gICAgICBjaGVjaygnZXhwZW5zZXMuKi5leGNoYW5nZV9yYXRlJykub3B0aW9uYWwoKS5pc051bWVyaWMoKS50b0Zsb2F0KCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZm9ybSA9IHsgLi4ucmVxLmJvZHkgfTtcbiAgICAgIGNvbnN0IGVycm9yUmVhc29ucyA9IFtdO1xuXG4gICAgICBjb25zdCBwYXltZW50QWNjb3VudHNJZHMgPSBjaGFpbihmb3JtLmV4cGVuc2VzKVxuICAgICAgICAubWFwKChlKSA9PiBlLnBheW1lbnRfYWNjb3VudF9pZCkudW5pcSgpLnZhbHVlKCk7XG4gICAgICBjb25zdCBleHBlbnNlQWNjb3VudHNJZHMgPSBjaGFpbihmb3JtLmV4cGVuc2VzKVxuICAgICAgICAubWFwKChlKSA9PiBlLmV4cGVuc2VfYWNjb3VudF9pZCkudW5pcSgpLnZhbHVlKCk7XG5cbiAgICAgIGNvbnN0IFtleHBlbnNlc0FjY291bnRzLCBwYXltZW50QWNjb3VudHNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBBY2NvdW50LnF1ZXJ5KCkud2hlcmVJbignaWQnLCBleHBlbnNlQWNjb3VudHNJZHMpLFxuICAgICAgICBBY2NvdW50LnF1ZXJ5KCkud2hlcmVJbignaWQnLCBwYXltZW50QWNjb3VudHNJZHMpLFxuICAgICAgXSk7XG4gICAgICBjb25zdCBzdG9yZWRFeHBlbnNlc0FjY291bnRzSWRzID0gZXhwZW5zZXNBY2NvdW50cy5tYXAoKGEpID0+IGEuaWQpO1xuICAgICAgY29uc3Qgc3RvcmVkUGF5bWVudEFjY291bnRzSWRzID0gcGF5bWVudEFjY291bnRzLm1hcCgoYSkgPT4gYS5pZCk7XG5cbiAgICAgIGNvbnN0IG5vdEZvdW5kUGF5bWVudEFjY291bnRzSWRzID0gZGlmZmVyZW5jZShleHBlbnNlQWNjb3VudHNJZHMsIHN0b3JlZEV4cGVuc2VzQWNjb3VudHNJZHMpO1xuICAgICAgY29uc3Qgbm90Rm91bmRFeHBlbnNlQWNjb3VudHNJZHMgPSBkaWZmZXJlbmNlKHBheW1lbnRBY2NvdW50c0lkcywgc3RvcmVkUGF5bWVudEFjY291bnRzSWRzKTtcblxuICAgICAgaWYgKG5vdEZvdW5kUGF5bWVudEFjY291bnRzSWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdQQVlNRU5ZLkFDQ09VTlRTLk5PVC5GT1VORCcsXG4gICAgICAgICAgY29kZTogMTAwLFxuICAgICAgICAgIGFjY291bnRzOiBub3RGb3VuZFBheW1lbnRBY2NvdW50c0lkcyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAobm90Rm91bmRFeHBlbnNlQWNjb3VudHNJZHMubGVuZ3RoID4gMCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ0VYUEVOU0UuQUNDT1VOVFMuTk9ULkZPVU5EJyxcbiAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgYWNjb3VudHM6IG5vdEZvdW5kRXhwZW5zZUFjY291bnRzSWRzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChlcnJvclJlYXNvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkUmVxdWVzdChudWxsLCB7IHJlYXNvbnM6IGVycm9yUmVhc29ucyB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGV4cGVuc2VTYXZlT3BlcnMgPSBbXTtcbiAgICAgIGNvbnN0IGpvdXJuYWxQb3N0ZXIgPSBuZXcgSm91cm5hbFBvc3RlcigpO1xuXG4gICAgICBmb3JtLmV4cGVuc2VzLmZvckVhY2goYXN5bmMgKGV4cGVuc2UpID0+IHtcbiAgICAgICAgY29uc3QgZXhwZW5zZVNhdmVPcGVyID0gRXhwZW5zZS5xdWVyeSgpLmluc2VydCh7IC4uLmV4cGVuc2UgfSk7XG4gICAgICAgIGV4cGVuc2VTYXZlT3BlcnMucHVzaChleHBlbnNlU2F2ZU9wZXIpO1xuICAgICAgfSk7XG4gICAgICAvLyBXYWl0IHVuaXQgc2F2ZSBhbGwgZXhwZW5zZSB0cmFuc2FjdGlvbnMuXG4gICAgICBjb25zdCBzYXZlZEV4cGVuc2VUcmFuc2FjdGlvbnMgPSBhd2FpdCBQcm9taXNlLmFsbChleHBlbnNlU2F2ZU9wZXJzKTtcblxuICAgICAgc2F2ZWRFeHBlbnNlVHJhbnNhY3Rpb25zLmZvckVhY2goKGV4cGVuc2UpID0+IHtcbiAgICAgICAgY29uc3QgZGF0ZSA9IG1vbWVudChleHBlbnNlLmRhdGUpLmZvcm1hdCgnWVlZWS1ERC1NTScpO1xuXG4gICAgICAgIGNvbnN0IGRlYml0ID0gbmV3IEpvdXJuYWxFbnRyeSh7XG4gICAgICAgICAgZGViaXQ6IGV4cGVuc2UuYW1vdW50LFxuICAgICAgICAgIHJlZmVyZW5jZUlkOiBleHBlbnNlLmlkLFxuICAgICAgICAgIHJlZmVyZW5jZVR5cGU6IEV4cGVuc2UucmVmZXJlbmNlVHlwZSxcbiAgICAgICAgICBhY2NvdW50OiBleHBlbnNlLnBheW1lbnRfYWNjb3VudF9pZCxcbiAgICAgICAgICBhY2NvdW50Tm9ybWFsOiAnZGViaXQnLFxuICAgICAgICAgIGRhdGUsXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBjcmVkaXQgPSBuZXcgSm91cm5hbEVudHJ5KHtcbiAgICAgICAgICBjcmVkaXQ6IGV4cGVuc2UuYW1vdW50LFxuICAgICAgICAgIHJlZmVyZW5jZUlkOiBleHBlbnNlLmlkLFxuICAgICAgICAgIHJlZmVyZW5jZVR5cGU6IEV4cGVuc2UucmVmZXJlbmNlSWQsXG4gICAgICAgICAgYWNjb3VudDogZXhwZW5zZS5leHBlbnNlX2FjY291bnRfaWQsXG4gICAgICAgICAgYWNjb3VudE5vcm1hbDogJ2RlYml0JyxcbiAgICAgICAgICBkYXRlLFxuICAgICAgICB9KTtcbiAgICAgICAgam91cm5hbFBvc3Rlci5jcmVkaXQoY3JlZGl0KTtcbiAgICAgICAgam91cm5hbFBvc3Rlci5kZWJpdChkZWJpdCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gU2F2ZSBleHBlbnNlIGpvdXJuYWwgZW50cmllcyBhbmQgYmFsYW5jZSBjaGFuZ2UuXG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIGpvdXJuYWxQb3N0ZXIuc2F2ZUVudHJpZXMoKSxcbiAgICAgICAgam91cm5hbFBvc3Rlci5zYXZlQmFsYW5jZSgpLFxuICAgICAgXSk7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBwYWdpbmF0ZWQgZXhwZW5zZXMgbGlzdC5cbiAgICovXG4gIGxpc3RFeHBlbnNlczoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHF1ZXJ5KCdleHBlbnNlX2FjY291bnRfaWQnKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBxdWVyeSgncGF5bWVudF9hY2NvdW50X2lkJykub3B0aW9uYWwoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgcXVlcnkoJ25vdGUnKS5vcHRpb25hbCgpLFxuICAgICAgcXVlcnkoJ3JhbmdlX2Zyb20nKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvRmxvYXQoKSxcbiAgICAgIHF1ZXJ5KCdyYW5nZV90bycpLm9wdGlvbmFsKCkuaXNOdW1lcmljKCkudG9GbG9hdCgpLFxuICAgICAgcXVlcnkoJ2RhdGVfZnJvbScpLm9wdGlvbmFsKCkuaXNJU084NjAxKCksXG4gICAgICBxdWVyeSgnZGF0ZV90bycpLm9wdGlvbmFsKCkuaXNJU084NjAxKCksXG4gICAgICBxdWVyeSgnY29sdW1uX3NvcnRfb3JkZXInKS5vcHRpb25hbCgpLmlzSW4oWydjcmVhdGVkX2F0JywgJ2RhdGUnLCAnYW1vdW50J10pLFxuICAgICAgcXVlcnkoJ3NvcnRfb3JkZXInKS5vcHRpb25hbCgpLmlzSW4oWydkZXNjJywgJ2FzYyddKSxcbiAgICAgIHF1ZXJ5KCdwYWdlJykub3B0aW9uYWwoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgcXVlcnkoJ3BhZ2Vfc2l6ZScpLm9wdGlvbmFsKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIHF1ZXJ5KCdjdXN0b21fdmlld19pZCcpLm9wdGlvbmFsKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmaWx0ZXIgPSB7XG4gICAgICAgIHBhZ2Vfc2l6ZTogMTAsXG4gICAgICAgIHBhZ2U6IDEsXG4gICAgICAgIC4uLnJlcS5xdWVyeSxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGV4cGVuc2VzID0gYXdhaXQgRXhwZW5zZS5xdWVyeSgpXG4gICAgICAgIC5tb2RpZnkoJ2ZpbHRlckJ5QW1vdW50UmFuZ2UnLCBmaWx0ZXIucmFuZ2VfZnJvbSwgZmlsdGVyLnRvX3JhbmdlKVxuICAgICAgICAubW9kaWZ5KCdmaWx0ZXJCeURhdGVSYW5nZScsIGZpbHRlci5kYXRlX2Zyb20sIGZpbHRlci5kYXRlX3RvKVxuICAgICAgICAubW9kaWZ5KCdmaWx0ZXJCeUV4cGVuc2VBY2NvdW50JywgZmlsdGVyLmV4cGVuc2VfYWNjb3VudF9pZClcbiAgICAgICAgLm1vZGlmeSgnZmlsdGVyQnlQYXltZW50QWNjb3VudCcsIGZpbHRlci5wYXltZW50X2FjY291bnRfaWQpXG4gICAgICAgIC5tb2RpZnkoJ29yZGVyQnknLCBmaWx0ZXIuY29sdW1uX3NvcnRfb3JkZXIsIGZpbHRlci5zb3J0X29yZGVyKVxuICAgICAgICAucGFnZShmaWx0ZXIucGFnZSwgZmlsdGVyLnBhZ2Vfc2l6ZSk7XG4gICAgICBcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBEZWxldGUgdGhlIGdpdmVuIGFjY291bnQuXG4gICAqL1xuICBkZWxldGVFeHBlbnNlOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ2lkJykuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgZXhwZW5zZVRyYW5zYWN0aW9uID0gYXdhaXQgRXhwZW5zZS5xdWVyeSgpLmZpbmRCeUlkKGlkKTtcblxuICAgICAgaWYgKCFleHBlbnNlVHJhbnNhY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5zZW5kKHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdFWFBFTlNFLlRSQU5TQUNUSU9OLk5PVC5GT1VORCcsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBleHBlbnNlRW50cmllcyA9IGF3YWl0IEFjY291bnRUcmFuc2FjdGlvbi5xdWVyeSgpXG4gICAgICAgIC53aGVyZSgncmVmZXJlbmNlX3R5cGUnLCAnRXhwZW5zZScpXG4gICAgICAgIC53aGVyZSgncmVmZXJlbmNlX2lkJywgZXhwZW5zZVRyYW5zYWN0aW9uLmlkKTtcblxuICAgICAgY29uc3QgZXhwZW5zZUVudHJpZXNDb2xsZWN0ID0gbmV3IEpvdXJuYWxQb3N0ZXIoKTtcbiAgICAgIGV4cGVuc2VFbnRyaWVzQ29sbGVjdC5sb2FkRW50cmllcyhleHBlbnNlRW50cmllcyk7XG4gICAgICBleHBlbnNlRW50cmllc0NvbGxlY3QucmV2ZXJzZUVudHJpZXMoKTtcblxuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBleHBlbnNlVHJhbnNhY3Rpb24uZGVsZXRlKCksXG4gICAgICAgIGV4cGVuc2VFbnRyaWVzQ29sbGVjdC5kZWxldGVFbnRyaWVzKCksXG4gICAgICAgIGV4cGVuc2VFbnRyaWVzQ29sbGVjdC5zYXZlQmFsYW5jZSgpLFxuICAgICAgXSk7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBVcGRhdGUgZGV0YWlscyBvZiB0aGUgZ2l2ZW4gYWNjb3VudC5cbiAgICovXG4gIHVwZGF0ZUV4cGVuc2U6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBwYXJhbSgnaWQnKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2RhdGUnKS5vcHRpb25hbCgpLmlzSVNPODYwMSgpLFxuICAgICAgY2hlY2soJ3BheW1lbnRfYWNjb3VudF9pZCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnZXhwZW5zZV9hY2NvdW50X2lkJykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdkZXNjcmlwdGlvbicpLm9wdGlvbmFsKCksXG4gICAgICBjaGVjaygnYW1vdW50JykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9GbG9hdCgpLFxuICAgICAgY2hlY2soJ2N1cnJlbmN5X2NvZGUnKS5vcHRpb25hbCgpLFxuICAgICAgY2hlY2soJ2V4Y2hhbmdlX3JhdGUnKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvRmxvYXQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgZXhwZW5zZVRyYW5zYWN0aW9uID0gYXdhaXQgRXhwZW5zZS5xdWVyeSgpLmZpbmRCeUlkKGlkKTtcblxuICAgICAgaWYgKCFleHBlbnNlVHJhbnNhY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5zZW5kKHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdFWFBFTlNFLlRSQU5TQUNUSU9OLk5PVC5GT1VORCcsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgfSxcbn07XG4iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCB7IGNoZWNrLCBwYXJhbSwgdmFsaWRhdGlvblJlc3VsdCB9IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJztcbmltcG9ydCBSZXNvdXJjZUZpZWxkIGZyb20gJ0AvbW9kZWxzL1Jlc291cmNlRmllbGQnO1xuaW1wb3J0IFJlc291cmNlIGZyb20gJ0AvbW9kZWxzL1Jlc291cmNlJztcbmltcG9ydCBhc3luY01pZGRsZXdhcmUgZnJvbSAnLi4vbWlkZGxld2FyZS9hc3luY01pZGRsZXdhcmUnO1xuXG4vKipcbiAqIFR5cGVzIG9mIHRoZSBjdXN0b20gZmllbGRzLlxuICovXG5jb25zdCBUWVBFUyA9IFsndGV4dCcsICdlbWFpbCcsICdudW1iZXInLCAndXJsJywgJ3BlcmNlbnRhZ2UnLCAnY2hlY2tib3gnLCAncmFkaW8nLCAndGV4dGFyZWEnXTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogUm91dGVyIGNvbnN0cnVjdG9yIG1ldGhvZC5cbiAgICovXG4gIHJvdXRlcigpIHtcbiAgICBjb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuXG4gICAgcm91dGVyLnBvc3QoJy9yZXNvdXJjZS86cmVzb3VyY2VfaWQnLFxuICAgICAgdGhpcy5hZGROZXdGaWVsZC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuYWRkTmV3RmllbGQuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLnBvc3QoJy86ZmllbGRfaWQnLFxuICAgICAgdGhpcy5lZGl0RmllbGQudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmVkaXRGaWVsZC5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIucG9zdCgnL3N0YXR1cy86ZmllbGRfaWQnLFxuICAgICAgdGhpcy5jaGFuZ2VTdGF0dXMudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmNoYW5nZVN0YXR1cy5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvOmZpZWxkX2lkJyxcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmdldEZpZWxkLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5kZWxldGUoJy86ZmllbGRfaWQnLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZGVsZXRlRmllbGQuaGFuZGxlcikpO1xuXG4gICAgcmV0dXJuIHJvdXRlcjtcbiAgfSxcblxuICAvKipcbiAgICogQWRkcyBhIG5ldyBmaWVsZCBjb250cm9sIHRvIHRoZSBnaXZlbiByZXNvdXJjZS5cbiAgICogQHBhcmFtIHtSZXF1ZXN0fSByZXEgLVxuICAgKiBAcGFyYW0ge1Jlc3BvbnNlfSByZXMgLVxuICAgKi9cbiAgYWRkTmV3RmllbGQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBwYXJhbSgncmVzb3VyY2VfaWQnKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2xhYmVsJykuZXhpc3RzKCkuZXNjYXBlKCkudHJpbSgpLFxuICAgICAgY2hlY2soJ2RhdGFfdHlwZScpLmV4aXN0cygpLmlzSW4oVFlQRVMpLFxuICAgICAgY2hlY2soJ2hlbHBfdGV4dCcpLm9wdGlvbmFsKCksXG4gICAgICBjaGVjaygnZGVmYXVsdCcpLm9wdGlvbmFsKCksXG4gICAgICBjaGVjaygnb3B0aW9ucycpLm9wdGlvbmFsKCkuaXNBcnJheSgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgeyByZXNvdXJjZV9pZDogcmVzb3VyY2VJZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICdWQUxJREFUSU9OX0VSUk9SJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCByZXNvdXJjZSA9IGF3YWl0IFJlc291cmNlLndoZXJlKCdpZCcsIHJlc291cmNlSWQpLmZldGNoKCk7XG5cbiAgICAgIGlmICghcmVzb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKG51bGwsIHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdSRVNPVVJDRV9OT1RfRk9VTkQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7IGxhYmVsLCBkYXRhX3R5cGU6IGRhdGFUeXBlLCBoZWxwX3RleHQ6IGhlbHBUZXh0IH0gPSByZXEuYm9keTtcbiAgICAgIGNvbnN0IHsgZGVmYXVsdDogZGVmYXVsdFZhbHVlLCBvcHRpb25zIH0gPSByZXEuYm9keTtcblxuICAgICAgY29uc3QgY2hvaWNlcyA9IG9wdGlvbnMubWFwKChvcHRpb24sIGluZGV4KSA9PiAoeyBrZXk6IGluZGV4ICsgMSwgdmFsdWU6IG9wdGlvbiB9KSk7XG5cbiAgICAgIGNvbnN0IGZpZWxkID0gUmVzb3VyY2VGaWVsZC5mb3JnZSh7XG4gICAgICAgIGRhdGFfdHlwZTogZGF0YVR5cGUsXG4gICAgICAgIGxhYmVsX25hbWU6IGxhYmVsLFxuICAgICAgICBoZWxwX3RleHQ6IGhlbHBUZXh0LFxuICAgICAgICBkZWZhdWx0OiBkZWZhdWx0VmFsdWUsXG4gICAgICAgIHJlc291cmNlX2lkOiByZXNvdXJjZS5pZCxcbiAgICAgICAgb3B0aW9uczogY2hvaWNlcyxcbiAgICAgIH0pO1xuXG4gICAgICBhd2FpdCBmaWVsZC5zYXZlKCk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCgpO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIEVkaXQgZGV0YWlscyBvZiB0aGUgZ2l2ZW4gZmllbGQuXG4gICAqL1xuICBlZGl0RmllbGQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBwYXJhbSgnZmllbGRfaWQnKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2xhYmVsJykuZXhpc3RzKCkuZXNjYXBlKCkudHJpbSgpLFxuICAgICAgY2hlY2soJ2RhdGFfdHlwZScpLmV4aXN0cygpLFxuICAgICAgY2hlY2soJ2hlbHBfdGV4dCcpLm9wdGlvbmFsKCksXG4gICAgICBjaGVjaygnZGVmYXVsdCcpLm9wdGlvbmFsKCksXG4gICAgICBjaGVjaygnb3B0aW9ucycpLm9wdGlvbmFsKCkuaXNBcnJheSgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgeyBmaWVsZF9pZDogZmllbGRJZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICdWQUxJREFUSU9OX0VSUk9SJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZpZWxkID0gYXdhaXQgUmVzb3VyY2VGaWVsZC53aGVyZSgnaWQnLCBmaWVsZElkKS5mZXRjaCgpO1xuXG4gICAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnRklFTERfTk9UX0ZPVU5EJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gU2V0cyB0aGUgZGVmYXVsdCB2YWx1ZSBvZiBvcHRpb25hbCBmaWVsZHMuXG4gICAgICBjb25zdCBmb3JtID0geyBvcHRpb25zOiBbXSwgLi4ucmVxLmJvZHkgfTtcblxuICAgICAgY29uc3QgeyBsYWJlbCwgZGF0YV90eXBlOiBkYXRhVHlwZSwgaGVscF90ZXh0OiBoZWxwVGV4dCB9ID0gZm9ybTtcbiAgICAgIGNvbnN0IHsgZGVmYXVsdDogZGVmYXVsdFZhbHVlLCBvcHRpb25zIH0gPSBmb3JtO1xuXG4gICAgICBjb25zdCBzdG9yZWRGaWVsZE9wdGlvbnMgPSBmaWVsZC5hdHRyaWJ1dGVzLm9wdGlvbnMgfHwgW107XG4gICAgICBsZXQgbGFzdENob2ljZUluZGV4ID0gMDtcbiAgICAgIHN0b3JlZEZpZWxkT3B0aW9ucy5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICAgICAgY29uc3Qga2V5ID0gcGFyc2VJbnQob3B0aW9uLmtleSwgMTApO1xuICAgICAgICBpZiAoa2V5ID4gbGFzdENob2ljZUluZGV4KSB7XG4gICAgICAgICAgbGFzdENob2ljZUluZGV4ID0ga2V5O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHNhdmVkT3B0aW9uS2V5cyA9IG9wdGlvbnMuZmlsdGVyKChvcCkgPT4gdHlwZW9mIG9wID09PSAnb2JqZWN0Jyk7XG4gICAgICBjb25zdCBub3RTYXZlZE9wdGlvbnNLZXlzID0gb3B0aW9ucy5maWx0ZXIoKG9wKSA9PiB0eXBlb2Ygb3AgIT09ICdvYmplY3QnKTtcblxuICAgICAgY29uc3QgY2hvaWNlcyA9IFtcbiAgICAgICAgLi4uc2F2ZWRPcHRpb25LZXlzLFxuICAgICAgICAuLi5ub3RTYXZlZE9wdGlvbnNLZXlzLm1hcCgob3B0aW9uKSA9PiB7XG4gICAgICAgICAgbGFzdENob2ljZUluZGV4ICs9IDE7XG4gICAgICAgICAgcmV0dXJuIHsga2V5OiBsYXN0Q2hvaWNlSW5kZXgsIHZhbHVlOiBvcHRpb24gfTtcbiAgICAgICAgfSksXG4gICAgICBdO1xuXG4gICAgICBhd2FpdCBmaWVsZC5zYXZlKHtcbiAgICAgICAgZGF0YV90eXBlOiBkYXRhVHlwZSxcbiAgICAgICAgbGFiZWxfbmFtZTogbGFiZWwsXG4gICAgICAgIGhlbHBfdGV4dDogaGVscFRleHQsXG4gICAgICAgIGRlZmF1bHQ6IGRlZmF1bHRWYWx1ZSxcbiAgICAgICAgb3B0aW9uczogY2hvaWNlcyxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyBpZDogZmllbGQuZ2V0KCdpZCcpIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIHRoZSBmaWVsZHMgbGlzdCBvZiB0aGUgZ2l2ZW4gcmVzb3VyY2UuXG4gICAqIEBwYXJhbSB7UmVxdWVzdH0gcmVxIC1cbiAgICogQHBhcmFtIHtSZXNwb25zZX0gcmVzIC1cbiAgICovXG4gIGZpZWxkc0xpc3Q6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBwYXJhbSgncmVzb3VyY2VfaWQnKS50b0ludCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgeyByZXNvdXJjZV9pZDogcmVzb3VyY2VJZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IGZpZWxkcyA9IGF3YWl0IFJlc291cmNlRmllbGQud2hlcmUoJ3Jlc291cmNlX2lkJywgcmVzb3VyY2VJZCkuZmV0Y2hBbGwoKTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgZmllbGRzOiBmaWVsZHMudG9KU09OKCkgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogQ2hhbmdlIHN0YXR1cyBvZiB0aGUgZ2l2ZW4gZmllbGQuXG4gICAqL1xuICBjaGFuZ2VTdGF0dXM6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBwYXJhbSgnZmllbGRfaWQnKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2FjdGl2ZScpLmlzQm9vbGVhbigpLnRvQm9vbGVhbigpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgeyBmaWVsZF9pZDogZmllbGRJZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IGZpZWxkID0gYXdhaXQgUmVzb3VyY2VGaWVsZC53aGVyZSgnaWQnLCBmaWVsZElkKS5mZXRjaCgpO1xuXG4gICAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnTk9UX0ZPVU5EX0ZJRUxEJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBhY3RpdmUgfSA9IHJlcS5ib2R5O1xuICAgICAgYXdhaXQgZmllbGQuc2F2ZSh7IGFjdGl2ZSB9KTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgaWQ6IGZpZWxkLmdldCgnaWQnKSB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBkZXRhaWxzIG9mIHRoZSBnaXZlbiBmaWVsZC5cbiAgICovXG4gIGdldEZpZWxkOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ2ZpZWxkX2lkJykudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgZmllbGRfaWQ6IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgZmllbGQgPSBhd2FpdCBSZXNvdXJjZUZpZWxkLndoZXJlKCdpZCcsIGlkKS5mZXRjaCgpO1xuXG4gICAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoe1xuICAgICAgICBmaWVsZDogZmllbGQudG9KU09OKCksXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBEZWxldGUgdGhlIGdpdmVuIGZpZWxkLlxuICAgKi9cbiAgZGVsZXRlRmllbGQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBwYXJhbSgnZmllbGRfaWQnKS50b0ludCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgeyBmaWVsZF9pZDogaWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCBmaWVsZCA9IGF3YWl0IFJlc291cmNlRmllbGQud2hlcmUoJ2lkJywgaWQpLmZldGNoKCk7XG5cbiAgICAgIGlmICghZmllbGQpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKCk7XG4gICAgICB9XG4gICAgICBpZiAoZmllbGQuYXR0cmlidXRlcy5wcmVkZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWRSZXF1ZXN0KG51bGwsIHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdQUkVERUZJTkVEX0ZJRUxEJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgZmllbGQuZGVzdHJveSgpO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyBpZDogZmllbGQuZ2V0KCdpZCcpIH0pO1xuICAgIH0sXG4gIH0sXG59O1xuIiwiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgeyBxdWVyeSwgdmFsaWRhdGlvblJlc3VsdCB9IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7IHBpY2sgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGFzeW5jTWlkZGxld2FyZSBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9hc3luY01pZGRsZXdhcmUnO1xuaW1wb3J0IEFjY291bnRUcmFuc2FjdGlvbiBmcm9tICdAL21vZGVscy9BY2NvdW50VHJhbnNhY3Rpb24nO1xuaW1wb3J0IGp3dEF1dGggZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvand0QXV0aCc7XG5pbXBvcnQgQWNjb3VudFR5cGUgZnJvbSAnQC9tb2RlbHMvQWNjb3VudFR5cGUnO1xuaW1wb3J0IEFjY291bnQgZnJvbSAnQC9tb2RlbHMvQWNjb3VudCc7XG5pbXBvcnQgSm91cm5hbFBvc3RlciBmcm9tICdAL3NlcnZpY2VzL0FjY291bnRpbmcvSm91cm5hbFBvc3Rlcic7XG5pbXBvcnQgeyBkYXRlUmFuZ2VDb2xsZWN0aW9uIH0gZnJvbSAnQC91dGlscyc7XG5cbmNvbnN0IGZvcm1hdE51bWJlckNsb3N1cmUgPSAoZmlsdGVyKSA9PiAoYmFsYW5jZSkgPT4ge1xuICBsZXQgZm9ybWF0dGVkQmFsYW5jZSA9IHBhcnNlRmxvYXQoYmFsYW5jZSk7XG5cbiAgaWYgKGZpbHRlci5ub19jZW50cykge1xuICAgIGZvcm1hdHRlZEJhbGFuY2UgPSBwYXJzZUludChmb3JtYXR0ZWRCYWxhbmNlLCAxMCk7XG4gIH1cbiAgaWYgKGZpbHRlci5kaXZpZGVfMTAwMCkge1xuICAgIGZvcm1hdHRlZEJhbGFuY2UgLz0gMTAwMDtcbiAgfVxuICByZXR1cm4gZm9ybWF0dGVkQmFsYW5jZTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyoqXG4gICAqIFJvdXRlciBjb25zdHJ1Y3Rvci5cbiAgICovXG4gIHJvdXRlcigpIHtcbiAgICBjb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuICAgIHJvdXRlci51c2Uoand0QXV0aCk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvbGVkZ2VyJyxcbiAgICAgIHRoaXMubGVkZ2VyLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5sZWRnZXIuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmdldCgnL2dlbmVyYWxfbGVkZ2VyJyxcbiAgICAgIHRoaXMuZ2VuZXJhbExlZGdlci52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZ2VuZXJhbExlZGdlci5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvYmFsYW5jZV9zaGVldCcsXG4gICAgICB0aGlzLmJhbGFuY2VTaGVldC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuYmFsYW5jZVNoZWV0LmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5nZXQoJy90cmlhbF9iYWxhbmNlX3NoZWV0JyxcbiAgICAgIHRoaXMudHJpYWxCYWxhbmNlU2hlZXQudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLnRyaWFsQmFsYW5jZVNoZWV0LmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5nZXQoJy9wcm9maXRfbG9zc19zaGVldCcsXG4gICAgICB0aGlzLnByb2ZpdExvc3NTaGVldC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMucHJvZml0TG9zc1NoZWV0LmhhbmRsZXIpKTtcblxuICAgIC8vIHJvdXRlci5nZXQoJy9jYXNoX2Zsb3dfc3RhdGVtZW50JyxcbiAgICAvLyAgIHRoaXMuY2FzaEZsb3dTdGF0ZW1lbnQudmFsaWRhdGlvbixcbiAgICAvLyAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmNhc2hGbG93U3RhdGVtZW50LmhhbmRsZXIpKTtcblxuICAgIC8vIHJvdXRlci5nZXQoJy9iYWRnZXRfdmVyc2VzX2FjdHVhbCcsXG4gICAgLy8gICB0aGlzLmJhZGdldFZlcnNlc0FjdHVhbHMudmFsaWRhdGlvbixcbiAgICAvLyAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmJhZGdldFZlcnNlc0FjdHVhbHMuaGFuZGxlcikpO1xuXG4gICAgcmV0dXJuIHJvdXRlcjtcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGxlZGdlciByZXBvcnQgb2YgdGhlIGdpdmVuIGFjY291bnQuXG4gICAqL1xuICBsZWRnZXI6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBxdWVyeSgnZnJvbV9kYXRlJykub3B0aW9uYWwoKS5pc0lTTzg2MDEoKSxcbiAgICAgIHF1ZXJ5KCd0b19kYXRlJykub3B0aW9uYWwoKS5pc0lTTzg2MDEoKSxcbiAgICAgIHF1ZXJ5KCd0cmFuc2FjdGlvbl90eXBlcycpLm9wdGlvbmFsKCkuaXNBcnJheSh7IG1pbjogMSB9KSxcbiAgICAgIHF1ZXJ5KCdhY2NvdW50X2lkcycpLm9wdGlvbmFsKCkuaXNBcnJheSh7IG1pbjogMSB9KSxcbiAgICAgIHF1ZXJ5KCdhY2NvdW50X2lkcy4qJykub3B0aW9uYWwoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgcXVlcnkoJ2Zyb21fcmFuZ2UnKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBxdWVyeSgndG9fcmFuZ2UnKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBxdWVyeSgnbnVtYmVyX2Zvcm1hdC5ub19jZW50cycpLm9wdGlvbmFsKCkuaXNCb29sZWFuKCkudG9Cb29sZWFuKCksXG4gICAgICBxdWVyeSgnbnVtYmVyX2Zvcm1hdC5kaXZpZGVfMTAwMCcpLm9wdGlvbmFsKCkuaXNCb29sZWFuKCkudG9Cb29sZWFuKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZmlsdGVyID0ge1xuICAgICAgICBmcm9tX3JhbmdlOiBudWxsLFxuICAgICAgICB0b19yYW5nZTogbnVsbCxcbiAgICAgICAgYWNjb3VudF9pZHM6IFtdLFxuICAgICAgICB0cmFuc2FjdGlvbl90eXBlczogW10sXG4gICAgICAgIG51bWJlcl9mb3JtYXQ6IHtcbiAgICAgICAgICBub19jZW50czogZmFsc2UsXG4gICAgICAgICAgZGl2aWRlXzEwMDA6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICAuLi5yZXEucXVlcnksXG4gICAgICB9O1xuICAgICAgY29uc3QgYWNjb3VudHNKb3VybmFsRW50cmllcyA9IGF3YWl0IEFjY291bnRUcmFuc2FjdGlvbi5xdWVyeSgpXG4gICAgICAgIC5tb2RpZnkoJ2ZpbHRlckRhdGVSYW5nZScsIGZpbHRlci5mcm9tX2RhdGUsIGZpbHRlci50b19kYXRlKVxuICAgICAgICAubW9kaWZ5KCdmaWx0ZXJBY2NvdW50cycsIGZpbHRlci5hY2NvdW50X2lkcylcbiAgICAgICAgLm1vZGlmeSgnZmlsdGVyVHJhbnNhY3Rpb25UeXBlcycsIGZpbHRlci50cmFuc2FjdGlvbl90eXBlcylcbiAgICAgICAgLm1vZGlmeSgnZmlsdGVyQW1vdW50UmFuZ2UnLCBmaWx0ZXIuZnJvbV9yYW5nZSwgZmlsdGVyLnRvX3JhbmdlKVxuICAgICAgICAud2l0aEdyYXBoRmV0Y2hlZCgnYWNjb3VudCcpO1xuXG4gICAgICBjb25zdCBmb3JtYXROdW1iZXIgPSBmb3JtYXROdW1iZXJDbG9zdXJlKGZpbHRlci5udW1iZXJfZm9ybWF0KTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgbWV0YTogeyAuLi5maWx0ZXIgfSxcbiAgICAgICAgaXRlbXM6IGFjY291bnRzSm91cm5hbEVudHJpZXMubWFwKChlbnRyeSkgPT4gKHtcbiAgICAgICAgICAuLi5lbnRyeSxcbiAgICAgICAgICBjcmVkaXQ6IGZvcm1hdE51bWJlcihlbnRyeS5jcmVkaXQpLFxuICAgICAgICAgIGRlYml0OiBmb3JtYXROdW1iZXIoZW50cnkuZGViaXQpLFxuICAgICAgICB9KSksXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgZ2VuZXJhbCBsZWRnZXIgZmluYW5jaWFsIHN0YXRlbWVudC5cbiAgICovXG4gIGdlbmVyYWxMZWRnZXI6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBxdWVyeSgnZnJvbV9kYXRlJykub3B0aW9uYWwoKS5pc0lTTzg2MDEoKSxcbiAgICAgIHF1ZXJ5KCd0b19kYXRlJykub3B0aW9uYWwoKS5pc0lTTzg2MDEoKSxcbiAgICAgIHF1ZXJ5KCdiYXNpcycpLm9wdGlvbmFsKCksXG4gICAgICBxdWVyeSgnbnVtYmVyX2Zvcm1hdC5ub19jZW50cycpLm9wdGlvbmFsKCkuaXNCb29sZWFuKCkudG9Cb29sZWFuKCksXG4gICAgICBxdWVyeSgnbnVtYmVyX2Zvcm1hdC5kaXZpZGVfMTAwMCcpLm9wdGlvbmFsKCkuaXNCb29sZWFuKCkudG9Cb29sZWFuKCksXG4gICAgICBxdWVyeSgnbm9uZV96ZXJvJykub3B0aW9uYWwoKS5pc0Jvb2xlYW4oKS50b0Jvb2xlYW4oKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmaWx0ZXIgPSB7XG4gICAgICAgIGZyb21fZGF0ZTogbW9tZW50KCkuc3RhcnRPZigneWVhcicpLmZvcm1hdCgnWVlZWS1NTS1ERCcpLFxuICAgICAgICB0b19kYXRlOiBtb21lbnQoKS5lbmRPZigneWVhcicpLmZvcm1hdCgnWVlZWS1NTS1ERCcpLFxuICAgICAgICBudW1iZXJfZm9ybWF0OiB7XG4gICAgICAgICAgbm9fY2VudHM6IGZhbHNlLFxuICAgICAgICAgIGRpdmlkZV8xMDAwOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgbm9uZV96ZXJvOiBmYWxzZSxcbiAgICAgICAgLi4ucmVxLnF1ZXJ5LFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGFjY291bnRzID0gYXdhaXQgQWNjb3VudC5xdWVyeSgpXG4gICAgICAgIC5vcmRlckJ5KCdpbmRleCcsICdERVNDJylcbiAgICAgICAgLndpdGhHcmFwaEZldGNoZWQoJ3RyYW5zYWN0aW9ucycpXG4gICAgICAgIC5tb2RpZnlHcmFwaCgndHJhbnNhY3Rpb25zJywgKGJ1aWxkZXIpID0+IHtcbiAgICAgICAgICBidWlsZGVyLm1vZGlmeSgnZmlsdGVyRGF0ZVJhbmdlJywgZmlsdGVyLmZyb21fZGF0ZSwgZmlsdGVyLnRvX2RhdGUpO1xuICAgICAgICB9KTtcblxuICAgICAgY29uc3Qgb3BlbmluZ0JhbGFuY2VUcmFuc2FjdGlvbnMgPSBhd2FpdCBBY2NvdW50VHJhbnNhY3Rpb24ucXVlcnkoKVxuICAgICAgICAubW9kaWZ5KCdmaWx0ZXJEYXRlUmFuZ2UnLCBudWxsLCBmaWx0ZXIuZnJvbV9kYXRlKVxuICAgICAgICAubW9kaWZ5KCdzdW1hdGlvbkNyZWRpdERlYml0JylcbiAgICAgICAgLndpdGhHcmFwaEZldGNoZWQoJ2FjY291bnQudHlwZScpO1xuXG4gICAgICBjb25zdCBjbG9zaW5nQmFsYW5jZVRyYW5zYWN0aW9ucyA9IGF3YWl0IEFjY291bnRUcmFuc2FjdGlvbi5xdWVyeSgpXG4gICAgICAgIC5tb2RpZnkoJ2ZpbHRlckRhdGVSYW5nZScsIG51bGwsIGZpbHRlci50b19kYXRlKVxuICAgICAgICAubW9kaWZ5KCdzdW1hdGlvbkNyZWRpdERlYml0JylcbiAgICAgICAgLndpdGhHcmFwaEZldGNoZWQoJ2FjY291bnQudHlwZScpO1xuXG4gICAgICBjb25zdCBvcGVpbmdCYWxhbmNlQ29sbGVjdGlvbiA9IG5ldyBKb3VybmFsUG9zdGVyKCk7XG4gICAgICBjb25zdCBjbG9zaW5nQmFsYW5jZUNvbGxlY3Rpb24gPSBuZXcgSm91cm5hbFBvc3RlcigpO1xuXG4gICAgICBvcGVpbmdCYWxhbmNlQ29sbGVjdGlvbi5sb2FkRW50cmllcyhvcGVuaW5nQmFsYW5jZVRyYW5zYWN0aW9ucyk7XG4gICAgICBjbG9zaW5nQmFsYW5jZUNvbGxlY3Rpb24ubG9hZEVudHJpZXMoY2xvc2luZ0JhbGFuY2VUcmFuc2FjdGlvbnMpO1xuXG4gICAgICAvLyBUcmFuc2FjdGlvbiBhbW91bnQgZm9ybWF0dGVyIGJhc2VkIG9uIHRoZSBnaXZlbiBxdWVyeS5cbiAgICAgIGNvbnN0IGZvcm1hdE51bWJlciA9IGZvcm1hdE51bWJlckNsb3N1cmUoZmlsdGVyLm51bWJlcl9mb3JtYXQpO1xuXG4gICAgICBjb25zdCBpdGVtcyA9IFtcbiAgICAgICAgLi4uYWNjb3VudHNcbiAgICAgICAgICAuZmlsdGVyKChhY2NvdW50KSA9PiAoXG4gICAgICAgICAgICBhY2NvdW50LnRyYW5zYWN0aW9ucy5sZW5ndGggPiAwIHx8ICFmaWx0ZXIubm9uZV96ZXJvXG4gICAgICAgICAgKSlcbiAgICAgICAgICAubWFwKChhY2NvdW50KSA9PiAoe1xuICAgICAgICAgICAgLi4ucGljayhhY2NvdW50LCBbJ2lkJywgJ25hbWUnLCAnY29kZScsICdpbmRleCddKSxcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uczogW1xuICAgICAgICAgICAgICAuLi5hY2NvdW50LnRyYW5zYWN0aW9ucy5tYXAoKHRyYW5zYWN0aW9uKSA9PiAoe1xuICAgICAgICAgICAgICAgIC4uLnRyYW5zYWN0aW9uLFxuICAgICAgICAgICAgICAgIGNyZWRpdDogZm9ybWF0TnVtYmVyKHRyYW5zYWN0aW9uLmNyZWRpdCksXG4gICAgICAgICAgICAgICAgZGViaXQ6IGZvcm1hdE51bWJlcih0cmFuc2FjdGlvbi5kZWJpdCksXG4gICAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBvcGVuaW5nOiB7XG4gICAgICAgICAgICAgIGRhdGU6IGZpbHRlci5mcm9tX2RhdGUsXG4gICAgICAgICAgICAgIGJhbGFuY2U6IG9wZWluZ0JhbGFuY2VDb2xsZWN0aW9uLmdldENsb3NpbmdCYWxhbmNlKGFjY291bnQuaWQpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsb3Npbmc6IHtcbiAgICAgICAgICAgICAgZGF0ZTogZmlsdGVyLnRvX2RhdGUsXG4gICAgICAgICAgICAgIGJhbGFuY2U6IGNsb3NpbmdCYWxhbmNlQ29sbGVjdGlvbi5nZXRDbG9zaW5nQmFsYW5jZShhY2NvdW50LmlkKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSkpLFxuICAgICAgXTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgIG1ldGE6IHsgLi4uZmlsdGVyIH0sXG4gICAgICAgIGl0ZW1zLFxuICAgICAgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGJhbGFuY2Ugc2hlZXQuXG4gICAqL1xuICBiYWxhbmNlU2hlZXQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBxdWVyeSgnYWNjb3VudGluZ19tZXRob2QnKS5vcHRpb25hbCgpLmlzSW4oWydjYXNoJywgJ2FjY3VyYWwnXSksXG4gICAgICBxdWVyeSgnZnJvbV9kYXRlJykub3B0aW9uYWwoKSxcbiAgICAgIHF1ZXJ5KCd0b19kYXRlJykub3B0aW9uYWwoKSxcbiAgICAgIHF1ZXJ5KCdkaXNwbGF5X2NvbHVtbnNfYnknKS5vcHRpb25hbCgpLmlzSW4oWyd5ZWFyJywgJ21vbnRoJywgJ3dlZWsnLCAnZGF5JywgJ3F1YXJ0ZXInXSksXG4gICAgICBxdWVyeSgnbnVtYmVyX2Zvcm1hdC5ub19jZW50cycpLm9wdGlvbmFsKCkuaXNCb29sZWFuKCkudG9Cb29sZWFuKCksXG4gICAgICBxdWVyeSgnbnVtYmVyX2Zvcm1hdC5kaXZpZGVfMTAwMCcpLm9wdGlvbmFsKCkuaXNCb29sZWFuKCkudG9Cb29sZWFuKCksXG4gICAgICBxdWVyeSgnbm9uZV96ZXJvJykub3B0aW9uYWwoKS5pc0Jvb2xlYW4oKS50b0Jvb2xlYW4oKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmaWx0ZXIgPSB7XG4gICAgICAgIGRpc3BsYXlfY29sdW1uc19ieTogJ3llYXInLFxuICAgICAgICBmcm9tX2RhdGU6IG1vbWVudCgpLnN0YXJ0T2YoJ3llYXInKS5mb3JtYXQoJ1lZWVktTU0tREQnKSxcbiAgICAgICAgdG9fZGF0ZTogbW9tZW50KCkuZW5kT2YoJ3llYXInKS5mb3JtYXQoJ1lZWVktTU0tREQnKSxcbiAgICAgICAgbnVtYmVyX2Zvcm1hdDoge1xuICAgICAgICAgIG5vX2NlbnRzOiBmYWxzZSxcbiAgICAgICAgICBkaXZpZGVfMTAwMDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIG5vbmVfemVybzogZmFsc2UsXG4gICAgICAgIC4uLnJlcS5xdWVyeSxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGJhbGFuY2VTaGVldFR5cGVzID0gYXdhaXQgQWNjb3VudFR5cGUucXVlcnkoKVxuICAgICAgICAud2hlcmUoJ2JhbGFuY2Vfc2hlZXQnLCB0cnVlKTtcblxuICAgICAgLy8gRmV0Y2ggYWxsIGJhbGFuY2Ugc2hlZXQgYWNjb3VudHMuXG4gICAgICBjb25zdCBhY2NvdW50cyA9IGF3YWl0IEFjY291bnQucXVlcnkoKVxuICAgICAgICAud2hlcmVJbignYWNjb3VudF90eXBlX2lkJywgYmFsYW5jZVNoZWV0VHlwZXMubWFwKChhKSA9PiBhLmlkKSlcbiAgICAgICAgLndpdGhHcmFwaEZldGNoZWQoJ3R5cGUnKVxuICAgICAgICAud2l0aEdyYXBoRmV0Y2hlZCgndHJhbnNhY3Rpb25zJylcbiAgICAgICAgLm1vZGlmeUdyYXBoKCd0cmFuc2FjdGlvbnMnLCAoYnVpbGRlcikgPT4ge1xuICAgICAgICAgIGJ1aWxkZXIubW9kaWZ5KCdmaWx0ZXJEYXRlUmFuZ2UnLCBudWxsLCBmaWx0ZXIudG9fZGF0ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICBjb25zdCBqb3VybmFsRW50cmllc0NvbGxlY3RlZCA9IEFjY291bnQuY29sbGVjdEpvdXJuYWxFbnRyaWVzKGFjY291bnRzKTtcbiAgICAgIGNvbnN0IGpvdXJuYWxFbnRyaWVzID0gbmV3IEpvdXJuYWxQb3N0ZXIoKTtcbiAgICAgIGpvdXJuYWxFbnRyaWVzLmxvYWRFbnRyaWVzKGpvdXJuYWxFbnRyaWVzQ29sbGVjdGVkKTtcblxuICAgICAgLy8gQWNjb3VudCBiYWxhbmNlIGZvcm1tYXR0ZXIgYmFzZWQgb24gdGhlIGdpdmVuIHF1ZXJ5LlxuICAgICAgY29uc3QgYmFsYW5jZUZvcm1hdHRlciA9IGZvcm1hdE51bWJlckNsb3N1cmUoZmlsdGVyLm51bWJlcl9mb3JtYXQpO1xuXG4gICAgICAvLyBHZXRzIHRoZSBkYXRlIHJhbmdlIHNldCBmcm9tIHN0YXJ0IHRvIGVuZCBkYXRlLlxuICAgICAgY29uc3QgZGF0ZVJhbmdlU2V0ID0gZGF0ZVJhbmdlQ29sbGVjdGlvbihcbiAgICAgICAgZmlsdGVyLmZyb21fZGF0ZSxcbiAgICAgICAgZmlsdGVyLnRvX2RhdGUsXG4gICAgICAgIGZpbHRlci5kaXNwbGF5X2NvbHVtbnNfYnksXG4gICAgICApO1xuICAgICAgLy8gUmV0cmlldmUgdGhlIGFzc2V0IGJhbGFuY2Ugc2hlZXQuXG4gICAgICBjb25zdCBhc3NldHMgPSBbXG4gICAgICAgIC4uLmFjY291bnRzXG4gICAgICAgICAgLmZpbHRlcigoYWNjb3VudCkgPT4gKFxuICAgICAgICAgICAgYWNjb3VudC50eXBlLm5vcm1hbCA9PT0gJ2RlYml0J1xuICAgICAgICAgICAgJiYgKGFjY291bnQudHJhbnNhY3Rpb25zLmxlbmd0aCA+IDAgfHwgIWZpbHRlci5ub25lX3plcm8pXG4gICAgICAgICAgKSlcbiAgICAgICAgICAubWFwKChhY2NvdW50KSA9PiAoe1xuICAgICAgICAgICAgLi4ucGljayhhY2NvdW50LCBbJ2lkJywgJ2luZGV4JywgJ25hbWUnLCAnY29kZSddKSxcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uczogZGF0ZVJhbmdlU2V0Lm1hcCgoZGF0ZSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB0eXBlID0gZmlsdGVyLmRpc3BsYXlfY29sdW1uc19ieTtcbiAgICAgICAgICAgICAgY29uc3QgYmFsYW5jZSA9IGpvdXJuYWxFbnRyaWVzLmdldENsb3NpbmdCYWxhbmNlKGFjY291bnQuaWQsIGRhdGUsIHR5cGUpO1xuICAgICAgICAgICAgICByZXR1cm4geyBkYXRlLCBiYWxhbmNlOiBiYWxhbmNlRm9ybWF0dGVyKGJhbGFuY2UpIH07XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9KSksXG4gICAgICBdO1xuICAgICAgLy8gUmV0cmlldmUgbGlhYmlsaXRpZXMgYW5kIGVxdWl0eSBiYWxhbmNlIHNoZWV0LlxuICAgICAgY29uc3QgbGlhYmlsaXRpZXNFcXVpdHkgPSBbXG4gICAgICAgIC4uLmFjY291bnRzXG4gICAgICAgICAgLmZpbHRlcigoYWNjb3VudCkgPT4gKFxuICAgICAgICAgICAgYWNjb3VudC50eXBlLm5vcm1hbCA9PT0gJ2NyZWRpdCdcbiAgICAgICAgICAgICYmIChhY2NvdW50LnRyYW5zYWN0aW9ucy5sZW5ndGggPiAwIHx8ICFmaWx0ZXIubm9uZV96ZXJvKVxuICAgICAgICAgICkpXG4gICAgICAgICAgLm1hcCgoYWNjb3VudCkgPT4gKHtcbiAgICAgICAgICAgIC4uLnBpY2soYWNjb3VudCwgWydpZCcsICdpbmRleCcsICduYW1lJywgJ2NvZGUnXSksXG4gICAgICAgICAgICB0cmFuc2FjdGlvbnM6IGRhdGVSYW5nZVNldC5tYXAoKGRhdGUpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IGZpbHRlci5kaXNwbGF5X2NvbHVtbnNfYnk7XG4gICAgICAgICAgICAgIGNvbnN0IGJhbGFuY2UgPSBqb3VybmFsRW50cmllcy5nZXRDbG9zaW5nQmFsYW5jZShhY2NvdW50LmlkLCBkYXRlLCB0eXBlKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0ZSwgYmFsYW5jZTogYmFsYW5jZUZvcm1hdHRlcihiYWxhbmNlKSB9O1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSkpLFxuICAgICAgXTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgIGNvbHVtbnM6IHsgLi4uZGF0ZVJhbmdlU2V0IH0sXG4gICAgICAgIGJhbGFuY2Vfc2hlZXQ6IHtcbiAgICAgICAgICBhc3NldHMsXG4gICAgICAgICAgbGlhYmlsaXRpZXNfZXF1aXR5OiBsaWFiaWxpdGllc0VxdWl0eSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIHRoZSB0cmlhbCBiYWxhbmNlIHNoZWV0LlxuICAgKi9cbiAgdHJpYWxCYWxhbmNlU2hlZXQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBxdWVyeSgnYmFzaXMnKS5vcHRpb25hbCgpLFxuICAgICAgcXVlcnkoJ2Zyb21fZGF0ZScpLm9wdGlvbmFsKCkuaXNJU084NjAxKCksXG4gICAgICBxdWVyeSgndG9fZGF0ZScpLm9wdGlvbmFsKCkuaXNJU084NjAxKCksXG4gICAgICBxdWVyeSgnbnVtYmVyX2Zvcm1hdC5ub19jZW50cycpLm9wdGlvbmFsKCkuaXNCb29sZWFuKCksXG4gICAgICBxdWVyeSgnbnVtYmVyX2Zvcm1hdC4xMDAwX2RpdmlkZScpLm9wdGlvbmFsKCkuaXNCb29sZWFuKCksXG4gICAgICBxdWVyeSgnYmFzaXMnKS5vcHRpb25hbCgpLFxuICAgICAgcXVlcnkoJ25vbmVfemVybycpLm9wdGlvbmFsKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZmlsdGVyID0ge1xuICAgICAgICBmcm9tX2RhdGU6IG1vbWVudCgpLnN0YXJ0T2YoJ3llYXInKS5mb3JtYXQoJ1lZWVktTU0tREQnKSxcbiAgICAgICAgdG9fZGF0ZTogbW9tZW50KCkuZW5kT2YoJ3llYXInKS5mb3JtYXQoJ1lZWVktTU0tREQnKSxcbiAgICAgICAgbnVtYmVyX2Zvcm1hdDoge1xuICAgICAgICAgIG5vX2NlbnRzOiBmYWxzZSxcbiAgICAgICAgICBkaXZpZGVfMTAwMDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIGJhc2lzOiAnYWNjdXJhbCcsXG4gICAgICAgIG5vbmVfemVybzogZmFsc2UsXG4gICAgICAgIC4uLnJlcS5xdWVyeSxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGFjY291bnRzID0gYXdhaXQgQWNjb3VudC5xdWVyeSgpXG4gICAgICAgIC53aXRoR3JhcGhGZXRjaGVkKCd0eXBlJylcbiAgICAgICAgLndpdGhHcmFwaEZldGNoZWQoJ3RyYW5zYWN0aW9ucycpXG4gICAgICAgIC5tb2RpZnlHcmFwaCgndHJhbnNhY3Rpb25zJywgKGJ1aWxkZXIpID0+IHtcbiAgICAgICAgICBidWlsZGVyLm1vZGlmeSgnc3VtYXRpb25DcmVkaXREZWJpdCcpO1xuICAgICAgICAgIGJ1aWxkZXIubW9kaWZ5KCdmaWx0ZXJEYXRlUmFuZ2UnLCBmaWx0ZXIuZnJvbV9kYXRlLCBmaWx0ZXIudG9fZGF0ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICBjb25zdCBqb3VybmFsRW50cmllc0NvbGxlY3QgPSBBY2NvdW50LmNvbGxlY3RKb3VybmFsRW50cmllcyhhY2NvdW50cyk7XG4gICAgICBjb25zdCBqb3VybmFsRW50cmllcyA9IG5ldyBKb3VybmFsUG9zdGVyKCk7XG4gICAgICBqb3VybmFsRW50cmllcy5sb2FkRW50cmllcyhqb3VybmFsRW50cmllc0NvbGxlY3QpO1xuXG4gICAgICAvLyBBY2NvdW50IGJhbGFuY2UgZm9ybW1hdHRlciBiYXNlZCBvbiB0aGUgZ2l2ZW4gcXVlcnkuXG4gICAgICBjb25zdCBiYWxhbmNlRm9ybWF0dGVyID0gZm9ybWF0TnVtYmVyQ2xvc3VyZShmaWx0ZXIubnVtYmVyX2Zvcm1hdCk7XG5cbiAgICAgIGNvbnN0IGl0ZW1zID0gYWNjb3VudHNcbiAgICAgICAgLmZpbHRlcigoYWNjb3VudCkgPT4gKFxuICAgICAgICAgIGFjY291bnQudHJhbnNhY3Rpb25zLmxlbmd0aCA+IDAgfHwgIWZpbHRlci5ub25lX3plcm9cbiAgICAgICAgKSlcbiAgICAgICAgLm1hcCgoYWNjb3VudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHRyaWFsID0gam91cm5hbEVudHJpZXMuZ2V0VHJpYWxCYWxhbmNlKGFjY291bnQuaWQpO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhY2NvdW50X2lkOiBhY2NvdW50LmlkLFxuICAgICAgICAgICAgY29kZTogYWNjb3VudC5jb2RlLFxuICAgICAgICAgICAgYWNjb3VudE5vcm1hbDogYWNjb3VudC50eXBlLm5vcm1hbCxcbiAgICAgICAgICAgIGNyZWRpdDogYmFsYW5jZUZvcm1hdHRlcih0cmlhbC5jcmVkaXQpLFxuICAgICAgICAgICAgZGViaXQ6IGJhbGFuY2VGb3JtYXR0ZXIodHJpYWwuZGViaXQpLFxuICAgICAgICAgICAgYmFsYW5jZTogYmFsYW5jZUZvcm1hdHRlcih0cmlhbC5iYWxhbmNlKSxcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgIG1ldGE6IHsgLi4uZmlsdGVyIH0sXG4gICAgICAgIGl0ZW1zOiBbLi4uaXRlbXNdLFxuICAgICAgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgcHJvZml0L2xvc3MgZmluYW5jaWFsIHN0YXRlbWVudC5cbiAgICovXG4gIHByb2ZpdExvc3NTaGVldDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHF1ZXJ5KCdiYXNpcycpLm9wdGlvbmFsKCksXG4gICAgICBxdWVyeSgnZnJvbV9kYXRlJykub3B0aW9uYWwoKS5pc0lTTzg2MDEoKSxcbiAgICAgIHF1ZXJ5KCd0b19kYXRlJykub3B0aW9uYWwoKS5pc0lTTzg2MDEoKSxcbiAgICAgIHF1ZXJ5KCdudW1iZXJfZm9ybWF0Lm5vX2NlbnRzJykub3B0aW9uYWwoKS5pc0Jvb2xlYW4oKSxcbiAgICAgIHF1ZXJ5KCdudW1iZXJfZm9ybWF0LmRpdmlkZV8xMDAwJykub3B0aW9uYWwoKS5pc0Jvb2xlYW4oKSxcbiAgICAgIHF1ZXJ5KCdiYXNpcycpLm9wdGlvbmFsKCksXG4gICAgICBxdWVyeSgnbm9uZV96ZXJvJykub3B0aW9uYWwoKSxcbiAgICAgIHF1ZXJ5KCdkaXNwbGF5X2NvbHVtbnNfYnknKS5vcHRpb25hbCgpLmlzSW4oWyd5ZWFyJywgJ21vbnRoJywgJ3dlZWsnLCAnZGF5JywgJ3F1YXJ0ZXInXSksXG4gICAgICBxdWVyeSgnYWNjb3VudHMnKS5vcHRpb25hbCgpLmlzQXJyYXkoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmaWx0ZXIgPSB7XG4gICAgICAgIGZyb21fZGF0ZTogbW9tZW50KCkuc3RhcnRPZigneWVhcicpLmZvcm1hdCgnWVlZWS1NTS1ERCcpLFxuICAgICAgICB0b19kYXRlOiBtb21lbnQoKS5lbmRPZigneWVhcicpLmZvcm1hdCgnWVlZWS1NTS1ERCcpLFxuICAgICAgICBudW1iZXJfZm9ybWF0OiB7XG4gICAgICAgICAgbm9fY2VudHM6IGZhbHNlLFxuICAgICAgICAgIGRpdmlkZV8xMDAwOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgYmFzaXM6ICdhY2N1cmFsJyxcbiAgICAgICAgbm9uZV96ZXJvOiBmYWxzZSxcbiAgICAgICAgZGlzcGxheV9jb2x1bW5zX2J5OiAnbW9udGgnLFxuICAgICAgICAuLi5yZXEucXVlcnksXG4gICAgICB9O1xuICAgICAgY29uc3QgaW5jb21lU3RhdGVtZW50VHlwZXMgPSBhd2FpdCBBY2NvdW50VHlwZS5xdWVyeSgpLndoZXJlKCdpbmNvbWVfc2hlZXQnLCB0cnVlKTtcblxuICAgICAgY29uc3QgYWNjb3VudHMgPSBhd2FpdCBBY2NvdW50LnF1ZXJ5KClcbiAgICAgICAgLndoZXJlSW4oJ2FjY291bnRfdHlwZV9pZCcsIGluY29tZVN0YXRlbWVudFR5cGVzLm1hcCgodCkgPT4gdC5pZCkpXG4gICAgICAgIC53aXRoR3JhcGhGZXRjaGVkKCd0eXBlJylcbiAgICAgICAgLndpdGhHcmFwaEZldGNoZWQoJ3RyYW5zYWN0aW9ucycpO1xuXG4gICAgICBjb25zdCBmaWx0ZXJlZEFjY291bnRzID0gYWNjb3VudHMuZmlsdGVyKChhY2NvdW50KSA9PiB7XG4gICAgICAgIHJldHVybiBhY2NvdW50LnRyYW5zYWN0aW9ucy5sZW5ndGggPiAwIHx8ICFmaWx0ZXIubm9uZV96ZXJvO1xuICAgICAgfSk7XG4gICAgICBjb25zdCBqb3VybmFsRW50cmllc0NvbGxlY3RlZCA9IEFjY291bnQuY29sbGVjdEpvdXJuYWxFbnRyaWVzKGFjY291bnRzKTtcbiAgICAgIGNvbnN0IGpvdXJuYWxFbnRyaWVzID0gbmV3IEpvdXJuYWxQb3N0ZXIoKTtcbiAgICAgIGpvdXJuYWxFbnRyaWVzLmxvYWRFbnRyaWVzKGpvdXJuYWxFbnRyaWVzQ29sbGVjdGVkKTtcblxuICAgICAgLy8gQWNjb3VudCBiYWxhbmNlIGZvcm1tYXR0ZXIgYmFzZWQgb24gdGhlIGdpdmVuIHF1ZXJ5LlxuICAgICAgY29uc3QgbnVtYmVyRm9ybWF0dGVyID0gZm9ybWF0TnVtYmVyQ2xvc3VyZShmaWx0ZXIubnVtYmVyX2Zvcm1hdCk7XG5cbiAgICAgIC8vIEdldHMgdGhlIGRhdGUgcmFuZ2Ugc2V0IGZyb20gc3RhcnQgdG8gZW5kIGRhdGUuXG4gICAgICBjb25zdCBkYXRlUmFuZ2VTZXQgPSBkYXRlUmFuZ2VDb2xsZWN0aW9uKFxuICAgICAgICBmaWx0ZXIuZnJvbV9kYXRlLFxuICAgICAgICBmaWx0ZXIudG9fZGF0ZSxcbiAgICAgICAgZmlsdGVyLmRpc3BsYXlfY29sdW1uc19ieSxcbiAgICAgICk7XG4gICAgICBjb25zdCBhY2NvdW50c0luY29tZSA9IGZpbHRlcmVkQWNjb3VudHNcbiAgICAgICAgLmZpbHRlcigoYWNjb3VudCkgPT4gYWNjb3VudC50eXBlLm5vcm1hbCA9PT0gJ2NyZWRpdCcpXG4gICAgICAgIC5tYXAoKGFjY291bnQpID0+ICh7XG4gICAgICAgICAgLi4ucGljayhhY2NvdW50LCBbJ2lkJywgJ2luZGV4JywgJ25hbWUnLCAnY29kZSddKSxcbiAgICAgICAgICBkYXRlczogZGF0ZVJhbmdlU2V0Lm1hcCgoZGF0ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdHlwZSA9IGZpbHRlci5kaXNwbGF5X2NvbHVtbnNfYnk7XG4gICAgICAgICAgICBjb25zdCBhbW91bnQgPSBqb3VybmFsRW50cmllcy5nZXRDbG9zaW5nQmFsYW5jZShhY2NvdW50LmlkLCBkYXRlLCB0eXBlKTtcblxuICAgICAgICAgICAgcmV0dXJuIHsgZGF0ZSwgcmF3QW1vdW50OiBhbW91bnQsIGFtb3VudDogbnVtYmVyRm9ybWF0dGVyKGFtb3VudCkgfTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSkpO1xuXG4gICAgICBjb25zdCBhY2NvdW50c0V4cGVuc2VzID0gZmlsdGVyZWRBY2NvdW50c1xuICAgICAgICAuZmlsdGVyKChhY2NvdW50KSA9PiBhY2NvdW50LnR5cGUubm9ybWFsID09PSAnZGViaXQnKVxuICAgICAgICAubWFwKChhY2NvdW50KSA9PiAoe1xuICAgICAgICAgIC4uLnBpY2soYWNjb3VudCwgWydpZCcsICdpbmRleCcsICduYW1lJywgJ2NvZGUnXSksXG4gICAgICAgICAgZGF0ZXM6IGRhdGVSYW5nZVNldC5tYXAoKGRhdGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBmaWx0ZXIuZGlzcGxheV9jb2x1bW5zX2J5O1xuICAgICAgICAgICAgY29uc3QgYW1vdW50ID0gam91cm5hbEVudHJpZXMuZ2V0Q2xvc2luZ0JhbGFuY2UoYWNjb3VudC5pZCwgZGF0ZSwgdHlwZSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7IGRhdGUsIHJhd0Ftb3VudDogYW1vdW50LCBhbW91bnQ6IG51bWJlckZvcm1hdHRlcihhbW91bnQpIH07XG4gICAgICAgICAgfSksXG4gICAgICAgIH0pKTtcblxuICAgICAgLy8gQ2FsY3VsYXRlcyB0aGUgdG90YWwgaW5jb21lIG9mIGluY29tZSBhY2NvdW50cy5cbiAgICAgIGNvbnN0IHRvdGFsQWNjb3VudHNJbmNvbWUgPSBkYXRlUmFuZ2VTZXQucmVkdWNlKChhY2MsIGRhdGUsIGluZGV4KSA9PiB7XG4gICAgICAgIGxldCBhbW91bnQgPSAwO1xuICAgICAgICBhY2NvdW50c0luY29tZS5mb3JFYWNoKChhY2NvdW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgY3VycmVudERhdGUgPSBhY2NvdW50LmRhdGVzW2luZGV4XTtcbiAgICAgICAgICBhbW91bnQgKz0gY3VycmVudERhdGUucmF3QW1vdW50IHx8IDA7XG4gICAgICAgIH0pO1xuICAgICAgICBhY2NbZGF0ZV0gPSB7IGRhdGUsIHJhd0Ftb3VudDogYW1vdW50LCBhbW91bnQ6IG51bWJlckZvcm1hdHRlcihhbW91bnQpIH07XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LCB7fSk7XG5cbiAgICAgIC8vIENhbGN1bGF0ZXMgdGhlIHRvdGFsIGV4cGVuc2VzIG9mIGV4cGVuc2VzIGFjY291bnRzLlxuICAgICAgY29uc3QgdG90YWxBY2NvdW50c0V4cGVuc2VzID0gZGF0ZVJhbmdlU2V0LnJlZHVjZSgoYWNjLCBkYXRlLCBpbmRleCkgPT4ge1xuICAgICAgICBsZXQgYW1vdW50ID0gMDtcbiAgICAgICAgYWNjb3VudHNFeHBlbnNlcy5mb3JFYWNoKChhY2NvdW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgY3VycmVudERhdGUgPSBhY2NvdW50LmRhdGVzW2luZGV4XTtcbiAgICAgICAgICBhbW91bnQgKz0gY3VycmVudERhdGUucmF3QW1vdW50IHx8IDA7XG4gICAgICAgIH0pO1xuICAgICAgICBhY2NbZGF0ZV0gPSB7IGRhdGUsIHJhd0Ftb3VudDogYW1vdW50LCBhbW91bnQ6IG51bWJlckZvcm1hdHRlcihhbW91bnQpIH07XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LCB7fSk7XG5cbiAgICAgIC8vIFRvdGFsIGluY29tZShkYXRlKSAtIFRvdGFsIGV4cGVuc2VzKGRhdGUpID0gTmV0IGluY29tZShkYXRlKVxuICAgICAgY29uc3QgbmV0SW5jb21lID0gZGF0ZVJhbmdlU2V0Lm1hcCgoZGF0ZSkgPT4ge1xuICAgICAgICBjb25zdCB0b3RhbEluY29tZSA9IHRvdGFsQWNjb3VudHNJbmNvbWVbZGF0ZV07XG4gICAgICAgIGNvbnN0IHRvdGFsRXhwZW5zZXMgPSB0b3RhbEFjY291bnRzRXhwZW5zZXNbZGF0ZV07XG5cbiAgICAgICAgbGV0IGFtb3VudCA9IHRvdGFsSW5jb21lLnJhd0Ftb3VudCB8fCAwO1xuICAgICAgICBhbW91bnQgLT0gdG90YWxFeHBlbnNlcy5yYXdBbW91bnQgfHwgMDtcbiAgICAgICAgcmV0dXJuIHsgZGF0ZSwgcmF3QW1vdW50OiBhbW91bnQsIGFtb3VudDogbnVtYmVyRm9ybWF0dGVyKGFtb3VudCkgfTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoe1xuICAgICAgICBtZXRhOiB7IC4uLmZpbHRlciB9LFxuICAgICAgICBpbmNvbWU6IHtcbiAgICAgICAgICBlbnRyeV9ub3JtYWw6ICdjcmVkaXQnLFxuICAgICAgICAgIGFjY291bnRzOiBhY2NvdW50c0luY29tZSxcbiAgICAgICAgfSxcbiAgICAgICAgZXhwZW5zZXM6IHtcbiAgICAgICAgICBlbnRyeV9ub3JtYWw6ICdkZWJpdCcsXG4gICAgICAgICAgYWNjb3VudHM6IGFjY291bnRzRXhwZW5zZXMsXG4gICAgICAgIH0sXG4gICAgICAgIHRvdGFsX2luY29tZTogT2JqZWN0LnZhbHVlcyh0b3RhbEFjY291bnRzSW5jb21lKSxcbiAgICAgICAgdG90YWxfZXhwZW5zZXM6IE9iamVjdC52YWx1ZXModG90YWxBY2NvdW50c0V4cGVuc2VzKSxcbiAgICAgICAgdG90YWxfbmV0X2luY29tZTogbmV0SW5jb21lLFxuICAgICAgfSk7XG4gICAgfSxcbiAgfSxcblxuICBjYXNoRmxvd1N0YXRlbWVudDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHF1ZXJ5KCdkYXRlX2Zyb20nKS5vcHRpb25hbCgpLFxuICAgICAgcXVlcnkoJ2RhdGVfdG8nKS5vcHRpb25hbCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxuXG5cbiAgYmFkZ2V0VmVyc2VzQWN0dWFsczoge1xuICAgIHZhbGlkYXRpb246IFtcblxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuXG4gICAgfSxcbiAgfSxcbn1cbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgY2hlY2ssIHBhcmFtLCB2YWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InO1xuaW1wb3J0IGFzeW5jTWlkZGxld2FyZSBmcm9tICcuLi9taWRkbGV3YXJlL2FzeW5jTWlkZGxld2FyZSc7XG5pbXBvcnQgSXRlbUNhdGVnb3J5IGZyb20gJ0AvbW9kZWxzL0l0ZW1DYXRlZ29yeSc7XG5pbXBvcnQgQXV0aG9yaXphdGlvbiBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9hdXRob3JpemF0aW9uJztcbmltcG9ydCBKV1RBdXRoIGZyb20gJ0AvaHR0cC9taWRkbGV3YXJlL2p3dEF1dGgnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBSb3V0ZXIgY29uc3RydWN0b3IgbWV0aG9kLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG4gICAgY29uc3QgcGVybWl0ID0gQXV0aG9yaXphdGlvbignaXRlbXNfY2F0ZWdvcmllcycpO1xuXG4gICAgcm91dGVyLnVzZShKV1RBdXRoKTtcblxuICAgIHJvdXRlci5wb3N0KCcvOmlkJyxcbiAgICAgIHBlcm1pdCgnY3JlYXRlJywgJ2VkaXQnKSxcbiAgICAgIHRoaXMuZWRpdENhdGVnb3J5LnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5lZGl0Q2F0ZWdvcnkuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLnBvc3QoJy8nLFxuICAgICAgcGVybWl0KCdjcmVhdGUnKSxcbiAgICAgIHRoaXMubmV3Q2F0ZWdvcnkudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLm5ld0NhdGVnb3J5LmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5kZWxldGUoJy86aWQnLFxuICAgICAgcGVybWl0KCdjcmVhdGUnLCAnZWRpdCcsICdkZWxldGUnKSxcbiAgICAgIHRoaXMuZGVsZXRlSXRlbS52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZGVsZXRlSXRlbS5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvOmlkJyxcbiAgICAgIHBlcm1pdCgndmlldycpLFxuICAgICAgdGhpcy5nZXRDYXRlZ29yeS52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZ2V0Q2F0ZWdvcnkuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmdldCgnLycsXG4gICAgICBwZXJtaXQoJ3ZpZXcnKSxcbiAgICAgIHRoaXMuZ2V0TGlzdC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZ2V0TGlzdC52YWxpZGF0aW9uKSk7XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGl0ZW0gY2F0ZWdvcnkuXG4gICAqL1xuICBuZXdDYXRlZ29yeToge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCduYW1lJykuZXhpc3RzKHsgY2hlY2tGYWxzeTogdHJ1ZSB9KS50cmltKCkuZXNjYXBlKCksXG4gICAgICBjaGVjaygncGFyZW50X2NhdGVnb3J5X2lkJykub3B0aW9uYWwoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2Rlc2NyaXB0aW9uJykub3B0aW9uYWwoKS50cmltKCkuZXNjYXBlKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7IG5hbWUsIHBhcmVudF9jYXRlZ29yeV9pZDogcGFyZW50Q2F0ZWdvcnlJZCwgZGVzY3JpcHRpb24gfSA9IHJlcS5ib2R5O1xuXG4gICAgICBpZiAocGFyZW50Q2F0ZWdvcnlJZCkge1xuICAgICAgICBjb25zdCBmb3VuZFBhcmVudENhdGVnb3J5ID0gYXdhaXQgSXRlbUNhdGVnb3J5LndoZXJlKCdpZCcsIHBhcmVudENhdGVnb3J5SWQpLmZldGNoKCk7XG5cbiAgICAgICAgaWYgKCFmb3VuZFBhcmVudENhdGVnb3J5KSB7XG4gICAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKCdUaGUgcGFyZW50IGNhdGVnb3J5IElEIGlzIG5vdCBmb3VuZC4nLCB7XG4gICAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdQQVJFTlRfQ0FURUdPUllfTk9UX0ZPVU5EJywgY29kZTogMTAwIH1dLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBjYXRlZ29yeSA9IGF3YWl0IEl0ZW1DYXRlZ29yeS5mb3JnZSh7XG4gICAgICAgIGxhYmVsOiBuYW1lLFxuICAgICAgICBwYXJlbnRfY2F0ZWdvcnlfaWQ6IHBhcmVudENhdGVnb3J5SWQsXG4gICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgfSk7XG5cbiAgICAgIGF3YWl0IGNhdGVnb3J5LnNhdmUoKTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGlkOiBjYXRlZ29yeS5nZXQoJ2lkJykgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogRWRpdCBkZXRhaWxzIG9mIHRoZSBnaXZlbiBjYXRlZ29yeSBpdGVtLlxuICAgKi9cbiAgZWRpdENhdGVnb3J5OiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ2lkJykudG9JbnQoKSxcbiAgICAgIGNoZWNrKCduYW1lJykuZXhpc3RzKHsgY2hlY2tGYWxzeTogdHJ1ZSB9KS50cmltKCkuZXNjYXBlKCksXG4gICAgICBjaGVjaygncGFyZW50X2NhdGVnb3J5X2lkJykub3B0aW9uYWwoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2Rlc2NyaXB0aW9uJykub3B0aW9uYWwoKS50cmltKCkuZXNjYXBlKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHsgbmFtZSwgcGFyZW50X2NhdGVnb3J5X2lkOiBwYXJlbnRDYXRlZ29yeUlkLCBkZXNjcmlwdGlvbiB9ID0gcmVxLmJvZHk7XG4gICAgICBjb25zdCBpdGVtQ2F0ZWdvcnkgPSBhd2FpdCBJdGVtQ2F0ZWdvcnkud2hlcmUoJ2lkJywgaWQpLmZldGNoKCk7XG5cbiAgICAgIGlmICghaXRlbUNhdGVnb3J5KSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZCgpO1xuICAgICAgfVxuICAgICAgaWYgKHBhcmVudENhdGVnb3J5SWQgJiYgcGFyZW50Q2F0ZWdvcnlJZCAhPT0gaXRlbUNhdGVnb3J5LmF0dHJpYnV0ZXMucGFyZW50X2NhdGVnb3J5X2lkKSB7XG4gICAgICAgIGNvbnN0IGZvdW5kUGFyZW50Q2F0ZWdvcnkgPSBhd2FpdCBJdGVtQ2F0ZWdvcnkud2hlcmUoJ2lkJywgcGFyZW50Q2F0ZWdvcnlJZCkuZmV0Y2goKTtcblxuICAgICAgICBpZiAoIWZvdW5kUGFyZW50Q2F0ZWdvcnkpIHtcbiAgICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQoJ1RoZSBwYXJlbnQgY2F0ZWdvcnkgSUQgaXMgbm90IGZvdW5kLicsIHtcbiAgICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ1BBUkVOVF9DQVRFR09SWV9OT1RfRk9VTkQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGF3YWl0IGl0ZW1DYXRlZ29yeS5zYXZlKHtcbiAgICAgICAgbGFiZWw6IG5hbWUsXG4gICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICBwYXJlbnRfY2F0ZWdvcnlfaWQ6IHBhcmVudENhdGVnb3J5SWQsXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgaWQ6IGl0ZW1DYXRlZ29yeS5pZCB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBEZWxldGUgdGhlIGdpdmUgaXRlbSBjYXRlZ29yeS5cbiAgICovXG4gIGRlbGV0ZUl0ZW06IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBwYXJhbSgnaWQnKS50b0ludCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgeyBpZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IGl0ZW1DYXRlZ29yeSA9IGF3YWl0IEl0ZW1DYXRlZ29yeS53aGVyZSgnaWQnLCBpZCkuZmV0Y2goKTtcblxuICAgICAgaWYgKCFpdGVtQ2F0ZWdvcnkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKCk7XG4gICAgICB9XG4gICAgICBhd2FpdCBpdGVtQ2F0ZWdvcnkuZGVzdHJveSgpO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKCk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGxpc3Qgb2YgaXRlbXMuXG4gICAqL1xuICBnZXRMaXN0OiB7XG4gICAgdmFsaWRhdGlvbjogW10sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCBJdGVtQ2F0ZWdvcnkuZmV0Y2goKTtcblxuICAgICAgaWYgKCFpdGVtcykge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGl0ZW1zOiBpdGVtcy50b0pTT04oKSB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBkZXRhaWxzIG9mIHRoZSBnaXZlbiBjYXRlZ29yeS5cbiAgICovXG4gIGdldENhdGVnb3J5OiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ2NhdGVnb3J5X2lkJykudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgY2F0ZWdvcnlfaWQ6IGNhdGVnb3J5SWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCBpdGVtID0gYXdhaXQgSXRlbUNhdGVnb3J5LndoZXJlKCdpZCcsIGNhdGVnb3J5SWQpLmZldGNoKCk7XG5cbiAgICAgIGlmICghaXRlbSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ0NBVEVHT1JZX05PVF9GT1VORCcsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGNhdGVnb3J5OiBpdGVtLnRvSlNPTigpIH0pO1xuICAgIH0sXG4gIH0sXG59O1xuIiwiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgeyBjaGVjaywgdmFsaWRhdGlvblJlc3VsdCB9IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7IGRpZmZlcmVuY2UgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGFzeW5jTWlkZGxld2FyZSBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9hc3luY01pZGRsZXdhcmUnO1xuaW1wb3J0IGp3dEF1dGggZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvand0QXV0aCc7XG5pbXBvcnQgSXRlbSBmcm9tICdAL21vZGVscy9JdGVtJztcbmltcG9ydCBBY2NvdW50IGZyb20gJ0AvbW9kZWxzL0FjY291bnQnO1xuaW1wb3J0IEl0ZW1DYXRlZ29yeSBmcm9tICdAL21vZGVscy9JdGVtQ2F0ZWdvcnknO1xuaW1wb3J0IFJlc291cmNlIGZyb20gJ0AvbW9kZWxzL1Jlc291cmNlJztcbmltcG9ydCBSZXNvdXJjZUZpZWxkIGZyb20gJ0AvbW9kZWxzL1Jlc291cmNlRmllbGQnO1xuaW1wb3J0IEF1dGhvcml6YXRpb24gZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvYXV0aG9yaXphdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICByb3V0ZXIoKSB7XG4gICAgY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcbiAgICBjb25zdCBwZXJtaXQgPSBBdXRob3JpemF0aW9uKCdpdGVtcycpO1xuXG4gICAgcm91dGVyLnVzZShqd3RBdXRoKTtcblxuICAgIC8vIHJvdXRlci5wb3N0KCcvOmlkJyxcbiAgICAvLyAgIHRoaXMuZWRpdEl0ZW0udmFsaWRhdGlvbixcbiAgICAvLyAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmVkaXRDYXRlZ29yeS5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIucG9zdCgnLycsXG4gICAgICBwZXJtaXQoJ2NyZWF0ZScpLFxuICAgICAgdGhpcy5uZXdJdGVtLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5uZXdJdGVtLmhhbmRsZXIpKTtcblxuICAgIC8vIHJvdXRlci5kZWxldGUoJy86aWQnLFxuICAgIC8vICAgdGhpcy5kZWxldGVJdGVtLnZhbGlkYXRpb24sXG4gICAgLy8gICBhc3luY01pZGRsZXdhcmUodGhpcy5kZWxldGVJdGVtLmhhbmRsZXIpKTtcblxuICAgIC8vIHJvdXRlci5nZXQoJy86aWQnLFxuICAgIC8vICAgdGhpcy5nZXRDYXRlZ29yeS52YWxpZGF0aW9uLFxuICAgIC8vICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZ2V0Q2F0ZWdvcnkuaGFuZGxlcikpO1xuXG4gICAgLy8gcm91dGVyLmdldCgnLycsXG4gICAgLy8gICB0aGlzLmNhdGVnb3JpZXNMaXN0LnZhbGlkYXRpb24sXG4gICAgLy8gICBhc3luY01pZGRsZXdhcmUodGhpcy5jYXRlZ29yaWVzTGlzdC52YWxpZGF0aW9uKSk7XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGl0ZW0uXG4gICAqL1xuICBuZXdJdGVtOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgY2hlY2soJ25hbWUnKS5leGlzdHMoKSxcbiAgICAgIGNoZWNrKCd0eXBlX2lkJykuZXhpc3RzKCkuaXNJbnQoKSxcbiAgICAgIGNoZWNrKCdidXlfcHJpY2UnKS5leGlzdHMoKS5pc051bWVyaWMoKSxcbiAgICAgIGNoZWNrKCdjb3N0X3ByaWNlJykuZXhpc3RzKCkuaXNOdW1lcmljKCksXG4gICAgICBjaGVjaygnY29zdF9hY2NvdW50X2lkJykuZXhpc3RzKCkuaXNJbnQoKSxcbiAgICAgIGNoZWNrKCdzZWxsX2FjY291bnRfaWQnKS5leGlzdHMoKS5pc0ludCgpLFxuICAgICAgY2hlY2soJ2NhdGVnb3J5X2lkJykub3B0aW9uYWwoKS5pc0ludCgpLFxuXG4gICAgICBjaGVjaygnY3VzdG9tX2ZpZWxkcycpLmlzQXJyYXkoeyBtaW46IDEgfSksXG4gICAgICBjaGVjaygnY3VzdG9tX2ZpZWxkcy4qLmtleScpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnY3VzdG9tX2ZpZWxkcy4qLnZhbHVlJykuZXhpc3RzKCksXG5cbiAgICAgIGNoZWNrKCdub3RlJykub3B0aW9uYWwoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmb3JtID0geyAuLi5yZXEuYm9keSB9O1xuICAgICAgY29uc3QgZXJyb3JSZWFzb25zID0gW107XG5cbiAgICAgIGNvbnN0IGNvc3RBY2NvdW50UHJvbWlzZSA9IEFjY291bnQud2hlcmUoJ2lkJywgZm9ybS5jb3N0X2FjY291bnRfaWQpLmZldGNoKCk7XG4gICAgICBjb25zdCBzZWxsQWNjb3VudFByb21pc2UgPSBBY2NvdW50LndoZXJlKCdpZCcsIGZvcm0uc2VsbF9hY2NvdW50X2lkKS5mZXRjaCgpO1xuICAgICAgY29uc3QgaXRlbUNhdGVnb3J5UHJvbWlzZSA9IChmb3JtLmNhdGVnb3J5X2lkKVxuICAgICAgICA/IEl0ZW1DYXRlZ29yeS53aGVyZSgnaWQnLCBmb3JtLmNhdGVnb3J5X2lkKS5mZXRjaCgpIDogbnVsbDtcblxuICAgICAgLy8gVmFsaWRhdGUgdGhlIGN1c3RvbSBmaWVsZHMga2V5IGFuZCB2YWx1ZSB0eXBlLlxuICAgICAgaWYgKGZvcm0uY3VzdG9tX2ZpZWxkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGN1c3RvbUZpZWxkc0tleXMgPSBmb3JtLmN1c3RvbV9maWVsZHMubWFwKChmaWVsZCkgPT4gZmllbGQua2V5KTtcblxuICAgICAgICAvLyBHZXQgcmVzb3VyY2UgaWQgdGhhbiBnZXQgYWxsIHJlc291cmNlIGZpZWxkcy5cbiAgICAgICAgY29uc3QgcmVzb3VyY2UgPSBhd2FpdCBSZXNvdXJjZS53aGVyZSgnbmFtZScsICdpdGVtcycpLmZldGNoKCk7XG4gICAgICAgIGNvbnN0IGZpZWxkcyA9IGF3YWl0IFJlc291cmNlRmllbGQucXVlcnkoKHF1ZXJ5KSA9PiB7XG4gICAgICAgICAgcXVlcnkud2hlcmUoJ3Jlc291cmNlX2lkJywgcmVzb3VyY2UuaWQpO1xuICAgICAgICAgIHF1ZXJ5LndoZXJlSW4oJ2tleScsIGN1c3RvbUZpZWxkc0tleXMpO1xuICAgICAgICB9KS5mZXRjaEFsbCgpO1xuXG4gICAgICAgIGNvbnN0IHN0b3JlZEZpZWxkc0tleSA9IGZpZWxkcy5tYXAoKGYpID0+IGYuYXR0cmlidXRlcy5rZXkpO1xuXG4gICAgICAgIC8vIEdldCBhbGwgbm90IGRlZmluZWQgcmVzb3VyY2UgZmllbGRzLlxuICAgICAgICBjb25zdCBub3RGb3VuZEZpZWxkcyA9IGRpZmZlcmVuY2UoY3VzdG9tRmllbGRzS2V5cywgc3RvcmVkRmllbGRzS2V5KTtcblxuICAgICAgICBpZiAobm90Rm91bmRGaWVsZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHsgdHlwZTogJ0ZJRUxEX0tFWV9OT1RfRk9VTkQnLCBjb2RlOiAxNTAsIGZpZWxkczogbm90Rm91bmRGaWVsZHMgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgW2Nvc3RBY2NvdW50LCBzZWxsQWNjb3VudCwgaXRlbUNhdGVnb3J5XSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgY29zdEFjY291bnRQcm9taXNlLCBzZWxsQWNjb3VudFByb21pc2UsIGl0ZW1DYXRlZ29yeVByb21pc2UsXG4gICAgICBdKTtcbiAgICAgIGlmICghY29zdEFjY291bnQpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnQ09TVF9BQ0NPVU5UX05PVF9GT1VORCcsIGNvZGU6IDEwMCB9KTtcbiAgICAgIH1cbiAgICAgIGlmICghc2VsbEFjY291bnQpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnU0VMTF9BQ0NPVU5UX05PVF9GT1VORCcsIGNvZGU6IDEyMCB9KTtcbiAgICAgIH1cbiAgICAgIGlmICghaXRlbUNhdGVnb3J5ICYmIGZvcm0uY2F0ZWdvcnlfaWQpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnSVRFTV9DQVRFR09SWV9OT1RfRk9VTkQnLCBjb2RlOiAxNDAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZXJyb3JSZWFzb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwgeyBlcnJvcnM6IGVycm9yUmVhc29ucyB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGl0ZW0gPSBJdGVtLmZvcmdlKHtcbiAgICAgICAgbmFtZTogcmVxLmJvZHkubmFtZSxcbiAgICAgICAgdHlwZV9pZDogMSxcbiAgICAgICAgYnV5X3ByaWNlOiByZXEuYm9keS5idXlfcHJpY2UsXG4gICAgICAgIHNlbGxfcHJpY2U6IHJlcS5ib2R5LnNlbGxfcHJpY2UsXG4gICAgICAgIGN1cnJlbmN5X2NvZGU6IHJlcS5ib2R5LmN1cnJlbmN5X2NvZGUsXG4gICAgICAgIG5vdGU6IHJlcS5ib2R5Lm5vdGUsXG4gICAgICB9KTtcbiAgICAgIGF3YWl0IGl0ZW0uc2F2ZSgpO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBFZGl0IHRoZSBnaXZlbiBpdGVtLlxuICAgKi9cbiAgZWRpdEl0ZW06IHtcbiAgICB2YWxpZGF0aW9uOiBbXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaXRlbSA9IGF3YWl0IEl0ZW0ud2hlcmUoJ2lkJywgaWQpLmZldGNoKCk7XG5cbiAgICAgIGlmICghaXRlbSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCgpO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIERlbGV0ZSB0aGUgZ2l2ZW4gaXRlbSBmcm9tIHRoZSBzdG9yYWdlLlxuICAgKi9cbiAgZGVsZXRlSXRlbToge1xuICAgIHZhbGlkYXRpb246IFtdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCBpdGVtID0gYXdhaXQgSXRlbS53aGVyZSgnaWQnLCBpZCkuZmV0Y2goKTtcblxuICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnSVRFTV9OT1RfRk9VTkQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCBpdGVtLmRlc3Ryb3koKTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCgpO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHJpdmUgdGhlIGxpc3QgaXRlbXMgd2l0aCBwYWdpbmF0aW9uIG1ldGEuXG4gICAqL1xuICBsaXN0SXRlbXM6IHtcbiAgICB2YWxpZGF0aW9uOiBbXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCBmaWx0ZXIgPSB7XG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIFNLVTogJycsXG4gICAgICAgIGFjY291bnRfaWQ6IG51bGwsXG4gICAgICAgIHBhZ2Vfc2l6ZTogMTAsXG4gICAgICAgIHBhZ2U6IDEsXG4gICAgICAgIHN0YXJ0X2RhdGU6IG51bGwsXG4gICAgICAgIGVuZF9kYXRlOiBudWxsLFxuICAgICAgICAuLi5yZXEucXVlcnksXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IEl0ZW0ucXVlcnkoKHF1ZXJ5KSA9PiB7XG4gICAgICAgIGlmIChmaWx0ZXIuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICBxdWVyeS53aGVyZSgnZGVzY3JpcHRpb24nLCAnbGlrZScsIGAlJHtmaWx0ZXIuZGVzY3JpcHRpb259JWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWx0ZXIuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICBxdWVyeS53aGVyZSgnU0tVJywgZmlsdGVyLlNLWSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbHRlci5uYW1lKSB7XG4gICAgICAgICAgcXVlcnkud2hlcmUoJ25hbWUnLCBmaWx0ZXIubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbHRlci5zdGFydF9kYXRlKSB7XG4gICAgICAgICAgY29uc3Qgc3RhcnREYXRlRm9ybWF0dGVkID0gbW9tZW50KGZpbHRlci5zdGFydF9kYXRlKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06U1MnKTtcbiAgICAgICAgICBxdWVyeS53aGVyZSgnY3JlYXRlZF9hdCcsICc+PScsIHN0YXJ0RGF0ZUZvcm1hdHRlZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbHRlci5lbmRfZGF0ZSkge1xuICAgICAgICAgIGNvbnN0IGVuZERhdGVGb3JtYXR0ZWQgPSBtb21lbnQoZmlsdGVyLmVuZF9kYXRlKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06U1MnKTtcbiAgICAgICAgICBxdWVyeS53aGVyZSgnY3JlYXRlZF9hdCcsICc8PScsIGVuZERhdGVGb3JtYXR0ZWQpO1xuICAgICAgICB9XG4gICAgICB9KS5mZXRjaFBhZ2Uoe1xuICAgICAgICBwYWdlX3NpemU6IGZpbHRlci5wYWdlX3NpemUsXG4gICAgICAgIHBhZ2U6IGZpbHRlci5wYWdlLFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgIGl0ZW1zOiBpdGVtcy50b0pTT04oKSxcbiAgICAgICAgcGFnaW5hdGlvbjogaXRlbXMucGFnaW5hdGlvbixcbiAgICAgIH0pO1xuICAgIH0sXG4gIH0sXG59O1xuIiwiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgeyBib2R5LCBxdWVyeSwgdmFsaWRhdGlvblJlc3VsdCB9IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJztcbmltcG9ydCBhc3luY01pZGRsZXdhcmUgZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvYXN5bmNNaWRkbGV3YXJlJztcbmltcG9ydCBPcHRpb24gZnJvbSAnQC9tb2RlbHMvT3B0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogUm91dGVyIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbiAgICByb3V0ZXIucG9zdCgnLycsXG4gICAgICB0aGlzLnNhdmVPcHRpb25zLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5zYXZlT3B0aW9ucy5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvJyxcbiAgICAgIHRoaXMuZ2V0T3B0aW9ucy52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZ2V0U2V0dGluZ3MpKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNhdmVzIHRoZSBnaXZlbiBvcHRpb25zIHRvIHRoZSBzdG9yYWdlLlxuICAgKi9cbiAgc2F2ZU9wdGlvbnM6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBib2R5KCdvcHRpb25zJykuaXNBcnJheSgpLFxuICAgICAgYm9keSgnb3B0aW9ucy4qLmtleScpLmV4aXN0cygpLFxuICAgICAgYm9keSgnb3B0aW9ucy4qLnZhbHVlJykuZXhpc3RzKCksXG4gICAgICBib2R5KCdvcHRpb25zLiouZ3JvdXAnKS5leGlzdHMoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICdWQUxJREFUSU9OX0VSUk9SJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmb3JtID0geyAuLi5yZXEuYm9keSB9O1xuICAgICAgY29uc3Qgb3B0aW9uc0NvbGxlY3Rpb25zID0gYXdhaXQgT3B0aW9uLnF1ZXJ5KCk7XG5cbiAgICAgIGZvcm0ub3B0aW9ucy5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICAgICAgb3B0aW9uc0NvbGxlY3Rpb25zLnNldE1ldGEob3B0aW9uLmtleSwgb3B0aW9uLnZhbHVlLCBvcHRpb24uZ3JvdXApO1xuICAgICAgfSk7XG4gICAgICBhd2FpdCBvcHRpb25zQ29sbGVjdGlvbnMuc2F2ZU1ldGEoKTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKCk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGFwcGxpY2F0aW9uIG9wdGlvbnMgZnJvbSB0aGUgc3RvcmFnZS5cbiAgICovXG4gIGdldE9wdGlvbnM6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBxdWVyeSgna2V5Jykub3B0aW9uYWwoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICdWQUxJREFUSU9OX0VSUk9SJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBvcHRpb25zID0gYXdhaXQgT3B0aW9uLnF1ZXJ5KCk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZHMoe1xuICAgICAgICBvcHRpb25zOiBvcHRpb25zLnRvQXJyYXkoKSxcbiAgICAgIH0pO1xuICAgIH0sXG4gIH0sXG59O1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgY2hlY2ssIHZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICdleHByZXNzLXZhbGlkYXRvcic7XG5pbXBvcnQgeyBkaWZmZXJlbmNlIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBhc3luY01pZGRsZXdhcmUgZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvYXN5bmNNaWRkbGV3YXJlJztcbmltcG9ydCBSb2xlIGZyb20gJ0AvbW9kZWxzL1JvbGUnO1xuaW1wb3J0IFBlcm1pc3Npb24gZnJvbSAnQC9tb2RlbHMvUGVybWlzc2lvbic7XG5pbXBvcnQgUmVzb3VyY2UgZnJvbSAnQC9tb2RlbHMvUmVzb3VyY2UnO1xuaW1wb3J0IGtuZXggZnJvbSAnQC9kYXRhYmFzZS9rbmV4JztcblxuY29uc3QgQWNjZXNzQ29udHJvbGxTY2hlbWEgPSBbXG4gIHtcbiAgICByZXNvdXJjZTogJ2l0ZW1zJyxcbiAgICBsYWJlbDogJ3Byb2R1Y3RzX3NlcnZpY2VzJyxcbiAgICBwZXJtaXNzaW9uczogWydjcmVhdGUnLCAnZWRpdCcsICdkZWxldGUnLCAndmlldyddLFxuICAgIGZ1bGxBY2Nlc3M6IHRydWUsXG4gICAgb3duQ29udHJvbDogdHJ1ZSxcbiAgfSxcbl07XG5cbmNvbnN0IGdldFJlc291cmNlU2NoZW1hID0gKHJlc291cmNlKSA9PiBBY2Nlc3NDb250cm9sbFNjaGVtYVxuICAuZmluZCgoc2NoZW1hKSA9PiBzY2hlbWEucmVzb3VyY2UgPT09IHJlc291cmNlKTtcblxuY29uc3QgZ2V0UmVzb3VyY2VQZXJtaXNzaW9ucyA9IChyZXNvdXJjZSkgPT4ge1xuICBjb25zdCBmb3VuZFJlc291cmNlID0gZ2V0UmVzb3VyY2VTY2hlbWEocmVzb3VyY2UpO1xuICByZXR1cm4gZm91bmRSZXNvdXJjZSA/IGZvdW5kUmVzb3VyY2UucGVybWlzc2lvbnMgOiBbXTtcbn07XG5cbmNvbnN0IGZpbmROb3RGb3VuZFJlc291cmNlcyA9IChyZXNvdXJjZXNTbHVncykgPT4ge1xuICBjb25zdCBzY2hlbWFSZXNvdXJjZXNTbHVncyA9IEFjY2Vzc0NvbnRyb2xsU2NoZW1hLm1hcCgocykgPT4gcy5yZXNvdXJjZSk7XG4gIHJldHVybiBkaWZmZXJlbmNlKHJlc291cmNlc1NsdWdzLCBzY2hlbWFSZXNvdXJjZXNTbHVncyk7XG59O1xuXG5jb25zdCBmaW5kTm90Rm91bmRQZXJtaXNzaW9ucyA9IChwZXJtaXNzaW9ucywgcmVzb3VyY2VTbHVnKSA9PiB7XG4gIGNvbnN0IHNjaGVtYVBlcm1pc3Npb25zID0gZ2V0UmVzb3VyY2VQZXJtaXNzaW9ucyhyZXNvdXJjZVNsdWcpO1xuICByZXR1cm4gZGlmZmVyZW5jZShwZXJtaXNzaW9ucywgc2NoZW1hUGVybWlzc2lvbnMpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogUm91dGVyIGNvbnN0cnVjdG9yIG1ldGhvZC5cbiAgICovXG4gIHJvdXRlcigpIHtcbiAgICBjb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuXG4gICAgcm91dGVyLnBvc3QoJy8nLFxuICAgICAgdGhpcy5uZXdSb2xlLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5uZXdSb2xlLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCcvOmlkJyxcbiAgICAgIHRoaXMuZWRpdFJvbGUudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmVkaXRSb2xlLmhhbmRsZXIuYmluZCh0aGlzKSkpO1xuXG4gICAgcm91dGVyLmRlbGV0ZSgnLzppZCcsXG4gICAgICB0aGlzLmRlbGV0ZVJvbGUudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmRlbGV0ZVJvbGUuaGFuZGxlcikpO1xuXG4gICAgcmV0dXJuIHJvdXRlcjtcbiAgfSxcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyByb2xlLlxuICAgKi9cbiAgbmV3Um9sZToge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCduYW1lJykuZXhpc3RzKCkudHJpbSgpLmVzY2FwZSgpLFxuICAgICAgY2hlY2soJ2Rlc2NyaXB0aW9uJykub3B0aW9uYWwoKS50cmltKCkuZXNjYXBlKCksXG4gICAgICBjaGVjaygncGVybWlzc2lvbnMnKS5pc0FycmF5KHsgbWluOiAwIH0pLFxuICAgICAgY2hlY2soJ3Blcm1pc3Npb25zLioucmVzb3VyY2Vfc2x1ZycpLmV4aXN0cygpLndoaXRlbGlzdCgnXlthLXowLTldKyg/Oi1bYS16MC05XSspKiQnKSxcbiAgICAgIGNoZWNrKCdwZXJtaXNzaW9ucy4qLnBlcm1pc3Npb25zJykuaXNBcnJheSh7IG1pbjogMSB9KSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCB7IG5hbWUsIGRlc2NyaXB0aW9uLCBwZXJtaXNzaW9ucyB9ID0gcmVxLmJvZHk7XG5cbiAgICAgIGNvbnN0IHJlc291cmNlc1NsdWdzID0gcGVybWlzc2lvbnMubWFwKChwZXJtKSA9PiBwZXJtLnJlc291cmNlX3NsdWcpO1xuICAgICAgY29uc3QgcGVybWlzc2lvbnNTbHVncyA9IFtdO1xuICAgICAgY29uc3QgcmVzb3VyY2VzTm90Rm91bmQgPSBmaW5kTm90Rm91bmRSZXNvdXJjZXMocmVzb3VyY2VzU2x1Z3MpO1xuXG4gICAgICBjb25zdCBlcnJvclJlYXNvbnMgPSBbXTtcbiAgICAgIGNvbnN0IG5vdEZvdW5kUGVybWlzc2lvbnMgPSBbXTtcblxuICAgICAgaWYgKHJlc291cmNlc05vdEZvdW5kLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdSRVNPVVJDRV9TTFVHX05PVF9GT1VORCcsIGNvZGU6IDEwMCwgcmVzb3VyY2VzOiByZXNvdXJjZXNOb3RGb3VuZCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBwZXJtaXNzaW9ucy5mb3JFYWNoKChwZXJtKSA9PiB7XG4gICAgICAgIGNvbnN0IGFiaWxpdGllcyA9IHBlcm0ucGVybWlzc2lvbnMubWFwKChhYmlsaXR5KSA9PiBhYmlsaXR5KTtcblxuICAgICAgICAvLyBHZXRzIHRoZSBub3QgZm91bmQgcGVybWlzc2lvbnMgaW4gdGhlIHNjaGVtYS5cbiAgICAgICAgY29uc3Qgbm90Rm91bmRBYmlsaXRpZXMgPSBmaW5kTm90Rm91bmRQZXJtaXNzaW9ucyhhYmlsaXRpZXMsIHBlcm0ucmVzb3VyY2Vfc2x1Zyk7XG4gICAgICAgIFxuICAgICAgICBpZiAobm90Rm91bmRBYmlsaXRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIG5vdEZvdW5kUGVybWlzc2lvbnMucHVzaCh7XG4gICAgICAgICAgICByZXNvdXJjZV9zbHVnOiBwZXJtLnJlc291cmNlX3NsdWcsXG4gICAgICAgICAgICBwZXJtaXNzaW9uczogbm90Rm91bmRBYmlsaXRpZXMsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgcGVybXMgPSBwZXJtLnBlcm1pc3Npb25zIHx8IFtdO1xuICAgICAgICAgIHBlcm1zLmZvckVhY2goKHBlcm1pc3Npb24pID0+IHtcbiAgICAgICAgICAgIGlmIChwZXJtcy5pbmRleE9mKHBlcm1pc3Npb24pICE9PSAtMSkge1xuICAgICAgICAgICAgICBwZXJtaXNzaW9uc1NsdWdzLnB1c2gocGVybWlzc2lvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKG5vdEZvdW5kUGVybWlzc2lvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ1BFUk1JU1NJT05TX1NMVUdfTk9UX0ZPVU5EJyxcbiAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgcGVybWlzc2lvbnM6IG5vdEZvdW5kUGVybWlzc2lvbnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGVycm9yUmVhc29ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWRSZXF1ZXN0KG51bGwsIHsgZXJyb3JzOiBlcnJvclJlYXNvbnMgfSk7XG4gICAgICB9XG4gICAgICAvLyBQZXJtaXNzaW9ucy5cbiAgICAgIGNvbnN0IFtyZXNvdXJjZXNDb2xsZWN0aW9uLCBwZXJtc0NvbGxlY3Rpb25dID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBSZXNvdXJjZS5xdWVyeSgocXVlcnkpID0+IHsgcXVlcnkud2hlcmVJbignbmFtZScsIHJlc291cmNlc1NsdWdzKTsgfSkuZmV0Y2hBbGwoKSxcbiAgICAgICAgUGVybWlzc2lvbi5xdWVyeSgocXVlcnkpID0+IHsgcXVlcnkud2hlcmVJbignbmFtZScsIHBlcm1pc3Npb25zU2x1Z3MpOyB9KS5mZXRjaEFsbCgpLFxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IG5vdFN0b3JlZFJlc291cmNlcyA9IGRpZmZlcmVuY2UoXG4gICAgICAgIHJlc291cmNlc1NsdWdzLCByZXNvdXJjZXNDb2xsZWN0aW9uLm1hcCgocykgPT4gcy5uYW1lKSxcbiAgICAgICk7XG4gICAgICBjb25zdCBub3RTdG9yZWRQZXJtaXNzaW9ucyA9IGRpZmZlcmVuY2UoXG4gICAgICAgIHBlcm1pc3Npb25zU2x1Z3MsIHBlcm1zQ29sbGVjdGlvbi5tYXAoKHBlcm0pID0+IHBlcm0uc2x1ZyksXG4gICAgICApO1xuXG4gICAgICBjb25zdCBpbnNlcnRUaHJlYWQgPSBbXTtcblxuICAgICAgaWYgKG5vdFN0b3JlZFJlc291cmNlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGluc2VydFRocmVhZC5wdXNoKGtuZXgoJ3Jlc291cmNlcycpLmluc2VydChbXG4gICAgICAgICAgLi4ubm90U3RvcmVkUmVzb3VyY2VzLm1hcCgocmVzb3VyY2UpID0+ICh7IG5hbWU6IHJlc291cmNlIH0pKSxcbiAgICAgICAgXSkpO1xuICAgICAgfVxuICAgICAgaWYgKG5vdFN0b3JlZFBlcm1pc3Npb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaW5zZXJ0VGhyZWFkLnB1c2goa25leCgncGVybWlzc2lvbnMnKS5pbnNlcnQoW1xuICAgICAgICAgIC4uLm5vdFN0b3JlZFBlcm1pc3Npb25zLm1hcCgocGVybWlzc2lvbikgPT4gKHsgbmFtZTogcGVybWlzc2lvbiB9KSksXG4gICAgICAgIF0pKTtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoaW5zZXJ0VGhyZWFkKTtcblxuICAgICAgY29uc3QgW3N0b3JlZFBlcm1pc3Npb25zLCBzdG9yZWRSZXNvdXJjZXNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBQZXJtaXNzaW9uLnF1ZXJ5KChxKSA9PiB7IHEud2hlcmVJbignbmFtZScsIHBlcm1pc3Npb25zU2x1Z3MpOyB9KS5mZXRjaEFsbCgpLFxuICAgICAgICBSZXNvdXJjZS5xdWVyeSgocSkgPT4geyBxLndoZXJlSW4oJ25hbWUnLCByZXNvdXJjZXNTbHVncyk7IH0pLmZldGNoQWxsKCksXG4gICAgICBdKTtcblxuICAgICAgY29uc3Qgc3RvcmVkUmVzb3VyY2VzU2V0ID0gbmV3IE1hcChzdG9yZWRSZXNvdXJjZXMubWFwKChyZXNvdXJjZSkgPT4gW1xuICAgICAgICByZXNvdXJjZS5hdHRyaWJ1dGVzLm5hbWUsIHJlc291cmNlLmF0dHJpYnV0ZXMuaWQsXG4gICAgICBdKSk7XG4gICAgICBjb25zdCBzdG9yZWRQZXJtaXNzaW9uc1NldCA9IG5ldyBNYXAoc3RvcmVkUGVybWlzc2lvbnMubWFwKChwZXJtKSA9PiBbXG4gICAgICAgIHBlcm0uYXR0cmlidXRlcy5uYW1lLCBwZXJtLmF0dHJpYnV0ZXMuaWQsXG4gICAgICBdKSk7XG4gICAgICBjb25zdCByb2xlID0gUm9sZS5mb3JnZSh7IG5hbWUsIGRlc2NyaXB0aW9uIH0pO1xuXG4gICAgICBhd2FpdCByb2xlLnNhdmUoKTtcblxuICAgICAgY29uc3Qgcm9sZUhhc1Blcm1zID0gcGVybWlzc2lvbnMubWFwKChyZXNvdXJjZSkgPT4gcmVzb3VyY2UucGVybWlzc2lvbnMubWFwKChwZXJtKSA9PiAoe1xuICAgICAgICByb2xlX2lkOiByb2xlLmlkLFxuICAgICAgICByZXNvdXJjZV9pZDogc3RvcmVkUmVzb3VyY2VzU2V0LmdldChyZXNvdXJjZS5yZXNvdXJjZV9zbHVnKSxcbiAgICAgICAgcGVybWlzc2lvbl9pZDogc3RvcmVkUGVybWlzc2lvbnNTZXQuZ2V0KHBlcm0pLFxuICAgICAgfSkpKTtcblxuICAgICAgaWYgKHJvbGVIYXNQZXJtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGF3YWl0IGtuZXgoJ3JvbGVfaGFzX3Blcm1pc3Npb25zJykuaW5zZXJ0KHJvbGVIYXNQZXJtc1swXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyBpZDogcm9sZS5nZXQoJ2lkJykgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogRWRpdCB0aGUgZ2l2ZSByb2xlLlxuICAgKi9cbiAgZWRpdFJvbGU6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBjaGVjaygnbmFtZScpLmV4aXN0cygpLnRyaW0oKS5lc2NhcGUoKSxcbiAgICAgIGNoZWNrKCdkZXNjcmlwdGlvbicpLm9wdGlvbmFsKCkudHJpbSgpLmVzY2FwZSgpLFxuICAgICAgY2hlY2soJ3Blcm1pc3Npb25zJykuaXNBcnJheSh7IG1pbjogMCB9KSxcbiAgICAgIGNoZWNrKCdwZXJtaXNzaW9ucy4qLnJlc291cmNlX3NsdWcnKS5leGlzdHMoKS53aGl0ZWxpc3QoJ15bYS16MC05XSsoPzotW2EtejAtOV0rKSokJyksXG4gICAgICBjaGVjaygncGVybWlzc2lvbnMuKi5wZXJtaXNzaW9ucycpLmlzQXJyYXkoeyBtaW46IDEgfSksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3Qgcm9sZSA9IGF3YWl0IFJvbGUud2hlcmUoJ2lkJywgaWQpLmZldGNoKCk7XG5cbiAgICAgIGlmICghcm9sZSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ1JPTEVfTk9UX0ZPVU5EJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBwZXJtaXNzaW9ucyB9ID0gcmVxLmJvZHk7XG4gICAgICBjb25zdCBlcnJvclJlYXNvbnMgPSBbXTtcbiAgICAgIGNvbnN0IHBlcm1pc3Npb25zU2x1Z3MgPSBbXTtcbiAgICAgIGNvbnN0IG5vdEZvdW5kUGVybWlzc2lvbnMgPSBbXTtcblxuICAgICAgY29uc3QgcmVzb3VyY2VzU2x1Z3MgPSBwZXJtaXNzaW9ucy5tYXAoKHBlcm0pID0+IHBlcm0ucmVzb3VyY2Vfc2x1Zyk7XG4gICAgICBjb25zdCByZXNvdXJjZXNOb3RGb3VuZCA9IGZpbmROb3RGb3VuZFJlc291cmNlcyhyZXNvdXJjZXNTbHVncyk7XG5cbiAgICAgIGlmIChyZXNvdXJjZXNOb3RGb3VuZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnUkVTT1VSQ0VfU0xVR19OT1RfRk9VTkQnLFxuICAgICAgICAgIGNvZGU6IDEwMCxcbiAgICAgICAgICByZXNvdXJjZXM6IHJlc291cmNlc05vdEZvdW5kLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcGVybWlzc2lvbnMuZm9yRWFjaCgocGVybSkgPT4ge1xuICAgICAgICBjb25zdCBhYmlsaXRpZXMgPSBwZXJtLnBlcm1pc3Npb25zLm1hcCgoYWJpbGl0eSkgPT4gYWJpbGl0eSk7XG4gICAgICAgIC8vIEdldHMgdGhlIG5vdCBmb3VuZCBwZXJtaXNzaW9ucyBpbiB0aGUgc2NoZW1hLlxuICAgICAgICBjb25zdCBub3RGb3VuZEFiaWxpdGllcyA9IGZpbmROb3RGb3VuZFBlcm1pc3Npb25zKGFiaWxpdGllcywgcGVybS5yZXNvdXJjZV9zbHVnKTtcblxuICAgICAgICBpZiAobm90Rm91bmRBYmlsaXRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIG5vdEZvdW5kUGVybWlzc2lvbnMucHVzaCh7XG4gICAgICAgICAgICByZXNvdXJjZV9zbHVnOiBwZXJtLnJlc291cmNlX3NsdWcsIHBlcm1pc3Npb25zOiBub3RGb3VuZEFiaWxpdGllcyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBwZXJtcyA9IHBlcm0ucGVybWlzc2lvbnMgfHwgW107XG4gICAgICAgICAgcGVybXMuZm9yRWFjaCgocGVybWlzc2lvbikgPT4ge1xuICAgICAgICAgICAgaWYgKHBlcm1zLmluZGV4T2YocGVybWlzc2lvbikgIT09IC0xKSB7XG4gICAgICAgICAgICAgIHBlcm1pc3Npb25zU2x1Z3MucHVzaChwZXJtaXNzaW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChub3RGb3VuZFBlcm1pc3Npb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdQRVJNSVNTSU9OU19TTFVHX05PVF9GT1VORCcsXG4gICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgIHBlcm1pc3Npb25zOiBub3RGb3VuZFBlcm1pc3Npb25zLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChlcnJvclJlYXNvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkUmVxdWVzdChudWxsLCB7IGVycm9yczogZXJyb3JSZWFzb25zIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBQZXJtaXNzaW9ucy5cbiAgICAgIGNvbnN0IFtyZXNvdXJjZXNDb2xsZWN0aW9uLCBwZXJtc0NvbGxlY3Rpb25dID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBSZXNvdXJjZS5xdWVyeSgocXVlcnkpID0+IHsgcXVlcnkud2hlcmVJbignbmFtZScsIHJlc291cmNlc1NsdWdzKTsgfSkuZmV0Y2hBbGwoKSxcbiAgICAgICAgUGVybWlzc2lvbi5xdWVyeSgocXVlcnkpID0+IHsgcXVlcnkud2hlcmVJbignbmFtZScsIHBlcm1pc3Npb25zU2x1Z3MpOyB9KS5mZXRjaEFsbCgpLFxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IG5vdFN0b3JlZFJlc291cmNlcyA9IGRpZmZlcmVuY2UoXG4gICAgICAgIHJlc291cmNlc1NsdWdzLCByZXNvdXJjZXNDb2xsZWN0aW9uLm1hcCgocykgPT4gcy5uYW1lKSxcbiAgICAgICk7XG4gICAgICBjb25zdCBub3RTdG9yZWRQZXJtaXNzaW9ucyA9IGRpZmZlcmVuY2UoXG4gICAgICAgIHBlcm1pc3Npb25zU2x1Z3MsIHBlcm1zQ29sbGVjdGlvbi5tYXAoKHBlcm0pID0+IHBlcm0uc2x1ZyksXG4gICAgICApO1xuICAgICAgY29uc3QgaW5zZXJ0VGhyZWFkID0gW107XG5cbiAgICAgIGlmIChub3RTdG9yZWRSZXNvdXJjZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBpbnNlcnRUaHJlYWQucHVzaChrbmV4KCdyZXNvdXJjZXMnKS5pbnNlcnQoW1xuICAgICAgICAgIC4uLm5vdFN0b3JlZFJlc291cmNlcy5tYXAoKHJlc291cmNlKSA9PiAoeyBuYW1lOiByZXNvdXJjZSB9KSksXG4gICAgICAgIF0pKTtcbiAgICAgIH1cbiAgICAgIGlmIChub3RTdG9yZWRQZXJtaXNzaW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGluc2VydFRocmVhZC5wdXNoKGtuZXgoJ3Blcm1pc3Npb25zJykuaW5zZXJ0KFtcbiAgICAgICAgICAuLi5ub3RTdG9yZWRQZXJtaXNzaW9ucy5tYXAoKHBlcm1pc3Npb24pID0+ICh7IG5hbWU6IHBlcm1pc3Npb24gfSkpLFxuICAgICAgICBdKSk7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKGluc2VydFRocmVhZCk7XG5cbiAgICAgIGNvbnN0IFtzdG9yZWRQZXJtaXNzaW9ucywgc3RvcmVkUmVzb3VyY2VzXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgUGVybWlzc2lvbi5xdWVyeSgocSkgPT4geyBxLndoZXJlSW4oJ25hbWUnLCBwZXJtaXNzaW9uc1NsdWdzKTsgfSkuZmV0Y2hBbGwoKSxcbiAgICAgICAgUmVzb3VyY2UucXVlcnkoKHEpID0+IHsgcS53aGVyZUluKCduYW1lJywgcmVzb3VyY2VzU2x1Z3MpOyB9KS5mZXRjaEFsbCgpLFxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IHN0b3JlZFJlc291cmNlc1NldCA9IG5ldyBNYXAoc3RvcmVkUmVzb3VyY2VzLm1hcCgocmVzb3VyY2UpID0+IFtcbiAgICAgICAgcmVzb3VyY2UuYXR0cmlidXRlcy5uYW1lLCByZXNvdXJjZS5hdHRyaWJ1dGVzLmlkLFxuICAgICAgXSkpO1xuICAgICAgY29uc3Qgc3RvcmVkUGVybWlzc2lvbnNTZXQgPSBuZXcgTWFwKHN0b3JlZFBlcm1pc3Npb25zLm1hcCgocGVybSkgPT4gW1xuICAgICAgICBwZXJtLmF0dHJpYnV0ZXMubmFtZSwgcGVybS5hdHRyaWJ1dGVzLmlkLFxuICAgICAgXSkpO1xuXG4gICAgICBhd2FpdCByb2xlLnNhdmUoKTtcblxuXG4gICAgICBjb25zdCBzYXZlZFJvbGVIYXNQZXJtcyA9IGF3YWl0IGtuZXgoJ3JvbGVfaGFzX3Blcm1pc3Npb25zJykud2hlcmUoe1xuICAgICAgICByb2xlX2lkOiByb2xlLmlkLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnNvbGUubG9nKHNhdmVkUm9sZUhhc1Blcm1zKTtcblxuICAgICAgLy8gY29uc3Qgcm9sZUhhc1Blcm1zID0gcGVybWlzc2lvbnMubWFwKChyZXNvdXJjZSkgPT4gcmVzb3VyY2UucGVybWlzc2lvbnMubWFwKChwZXJtKSA9PiAoe1xuICAgICAgLy8gICByb2xlX2lkOiByb2xlLmlkLFxuICAgICAgLy8gICByZXNvdXJjZV9pZDogc3RvcmVkUmVzb3VyY2VzU2V0LmdldChyZXNvdXJjZS5yZXNvdXJjZV9zbHVnKSxcbiAgICAgIC8vICAgcGVybWlzc2lvbl9pZDogc3RvcmVkUGVybWlzc2lvbnNTZXQuZ2V0KHBlcm0pLFxuICAgICAgLy8gfSkpKTtcblxuICAgICAgLy8gaWYgKHJvbGVIYXNQZXJtcy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyAgIGF3YWl0IGtuZXgoJ3JvbGVfaGFzX3Blcm1pc3Npb25zJykuaW5zZXJ0KHJvbGVIYXNQZXJtc1swXSk7XG4gICAgICAvLyB9XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyBpZDogcm9sZS5nZXQoJ2lkJykgfSk7XG4gICAgfSxcbiAgfSxcblxuICBkZWxldGVSb2xlOiB7XG4gICAgdmFsaWRhdGlvbjogW10sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgeyBpZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IHJvbGUgPSBhd2FpdCBSb2xlLndoZXJlKCdpZCcsIGlkKS5mZXRjaCgpO1xuXG4gICAgICBpZiAoIXJvbGUpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKCk7XG4gICAgICB9XG4gICAgICBpZiAocm9sZS5hdHRyaWJ1dGVzLnByZWRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ1JPTEVfUFJFREVGSU5FRCcsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IGtuZXgoJ3JvbGVfaGFzX3Blcm1pc3Npb25zJylcbiAgICAgICAgLndoZXJlKCdyb2xlX2lkJywgcm9sZS5pZCkuZGVsZXRlKHsgcmVxdWlyZTogZmFsc2UgfSk7XG5cbiAgICAgIGF3YWl0IHJvbGUuZGVzdHJveSgpO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxuXG4gIGdldFJvbGU6IHtcbiAgICB2YWxpZGF0aW9uOiBbXSxcbiAgICBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxufTtcbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9LFxufTtcbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgY2hlY2ssIHZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICdleHByZXNzLXZhbGlkYXRvcic7XG5pbXBvcnQgVXNlciBmcm9tICdAL21vZGVscy9Vc2VyJztcbmltcG9ydCBhc3luY01pZGRsZXdhcmUgZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvYXN5bmNNaWRkbGV3YXJlJztcbmltcG9ydCBqd3RBdXRoIGZyb20gJ0AvaHR0cC9taWRkbGV3YXJlL2p3dEF1dGgnO1xuaW1wb3J0IEF1dGhvcml6YXRpb24gZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvYXV0aG9yaXphdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICAvKipcbiAgICogUm91dGVyIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG4gICAgY29uc3QgcGVybWl0ID0gQXV0aG9yaXphdGlvbigndXNlcnMnKTtcblxuICAgIHJvdXRlci51c2Uoand0QXV0aCk7XG5cbiAgICByb3V0ZXIucG9zdCgnLycsXG4gICAgICBwZXJtaXQoJ2NyZWF0ZScpLFxuICAgICAgdGhpcy5uZXdVc2VyLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5uZXdVc2VyLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCcvOmlkJyxcbiAgICAgIHBlcm1pdCgnY3JlYXRlJywgJ2VkaXQnKSxcbiAgICAgIHRoaXMuZWRpdFVzZXIudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmVkaXRVc2VyLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5nZXQoJy8nLFxuICAgICAgcGVybWl0KCd2aWV3JyksXG4gICAgICB0aGlzLmxpc3RVc2Vycy52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMubGlzdFVzZXJzLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5nZXQoJy86aWQnLFxuICAgICAgcGVybWl0KCd2aWV3JyksXG4gICAgICB0aGlzLmdldFVzZXIudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmdldFVzZXIuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmRlbGV0ZSgnLzppZCcsXG4gICAgICBwZXJtaXQoJ2NyZWF0ZScsICdlZGl0JywgJ2RlbGV0ZScpLFxuICAgICAgdGhpcy5kZWxldGVVc2VyLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5kZWxldGVVc2VyLmhhbmRsZXIpKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgdXNlci5cbiAgICovXG4gIG5ld1VzZXI6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBjaGVjaygnZmlyc3RfbmFtZScpLmV4aXN0cygpLFxuICAgICAgY2hlY2soJ2xhc3RfbmFtZScpLmV4aXN0cygpLFxuICAgICAgY2hlY2soJ2VtYWlsJykuZXhpc3RzKCkuaXNFbWFpbCgpLFxuICAgICAgY2hlY2soJ3Bob25lX251bWJlcicpLm9wdGlvbmFsKCkuaXNNb2JpbGVQaG9uZSgpLFxuICAgICAgY2hlY2soJ3Bhc3N3b3JkJykuaXNMZW5ndGgoeyBtaW46IDQgfSkuZXhpc3RzKCkuY3VzdG9tKCh2YWx1ZSwgeyByZXEgfSkgPT4ge1xuICAgICAgICBpZiAodmFsdWUgIT09IHJlcS5ib2R5LmNvbmZpcm1fcGFzc3dvcmQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQYXNzd29yZHMgZG9uJ3QgbWF0Y2hcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIGNoZWNrKCdzdGF0dXMnKS5leGlzdHMoKS5pc0Jvb2xlYW4oKS50b0Jvb2xlYW4oKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCB7IGVtYWlsLCBwaG9uZV9udW1iZXI6IHBob25lTnVtYmVyIH0gPSByZXEuYm9keTtcblxuICAgICAgY29uc3QgZm91bmRVc2VycyA9IGF3YWl0IFVzZXIucXVlcnkoKHF1ZXJ5KSA9PiB7XG4gICAgICAgIHF1ZXJ5LndoZXJlKCdlbWFpbCcsIGVtYWlsKTtcbiAgICAgICAgcXVlcnkub3JXaGVyZSgncGhvbmVfbnVtYmVyJywgcGhvbmVOdW1iZXIpO1xuICAgICAgfSkuZmV0Y2hBbGwoKTtcblxuICAgICAgY29uc3QgZm91bmRVc2VyRW1haWwgPSBmb3VuZFVzZXJzLmZpbmQoKHUpID0+IHUuYXR0cmlidXRlcy5lbWFpbCA9PT0gZW1haWwpO1xuICAgICAgY29uc3QgZm91bmRVc2VyUGhvbmUgPSBmb3VuZFVzZXJzLmZpbmQoKHUpID0+IHUuYXR0cmlidXRlcy5waG9uZV9udW1iZXIgPT09IHBob25lTnVtYmVyKTtcblxuICAgICAgY29uc3QgZXJyb3JSZWFzb25zID0gW107XG5cbiAgICAgIGlmIChmb3VuZFVzZXJFbWFpbCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdFTUFJTF9BTFJFQURZX0VYSVNUJywgY29kZTogMTAwIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGZvdW5kVXNlclBob25lKSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHsgdHlwZTogJ1BIT05FX05VTUJFUl9BTFJFQURZX0VYSVNUJywgY29kZTogMTIwIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGVycm9yUmVhc29ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWRSZXF1ZXN0KG51bGwsIHsgZXJyb3JzOiBlcnJvclJlYXNvbnMgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHVzZXIgPSBVc2VyLmZvcmdlKHtcbiAgICAgICAgZmlyc3RfbmFtZTogcmVxLmJvZHkuZmlyc3RfbmFtZSxcbiAgICAgICAgbGFzdF9uYW1lOiByZXEuYm9keS5sYXN0X25hbWUsXG4gICAgICAgIGVtYWlsOiByZXEuYm9keS5lbWFpbCxcbiAgICAgICAgcGhvbmVfbnVtYmVyOiByZXEuYm9keS5waG9uZV9udW1iZXIsXG4gICAgICAgIGFjdGl2ZTogcmVxLmJvZHkuc3RhdHVzLFxuICAgICAgfSk7XG5cbiAgICAgIGF3YWl0IHVzZXIuc2F2ZSgpO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyBpZDogdXNlci5nZXQoJ2lkJykgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogRWRpdCBkZXRhaWxzIG9mIHRoZSBnaXZlbiB1c2VyLlxuICAgKi9cbiAgZWRpdFVzZXI6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBjaGVjaygnZmlyc3RfbmFtZScpLmV4aXN0cygpLFxuICAgICAgY2hlY2soJ2xhc3RfbmFtZScpLmV4aXN0cygpLFxuICAgICAgY2hlY2soJ2VtYWlsJykuZXhpc3RzKCkuaXNFbWFpbCgpLFxuICAgICAgY2hlY2soJ3Bob25lX251bWJlcicpLm9wdGlvbmFsKCkuaXNNb2JpbGVQaG9uZSgpLFxuICAgICAgY2hlY2soJ3Bhc3N3b3JkJykuaXNMZW5ndGgoeyBtaW46IDQgfSkuZXhpc3RzKCkuY3VzdG9tKCh2YWx1ZSwgeyByZXEgfSkgPT4ge1xuICAgICAgICBpZiAodmFsdWUgIT09IHJlcS5ib2R5LmNvbmZpcm1fcGFzc3dvcmQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQYXNzd29yZHMgZG9uJ3QgbWF0Y2hcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIGNoZWNrKCdzdGF0dXMnKS5leGlzdHMoKS5pc0Jvb2xlYW4oKS50b0Jvb2xlYW4oKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgdXNlciA9IGF3YWl0IFVzZXIud2hlcmUoJ2lkJywgaWQpLmZldGNoKCk7XG5cbiAgICAgIGlmICghdXNlcikge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQoKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHsgZW1haWwsIHBob25lX251bWJlcjogcGhvbmVOdW1iZXIgfSA9IHJlcS5ib2R5O1xuXG4gICAgICBjb25zdCBmb3VuZFVzZXJzID0gYXdhaXQgVXNlci5xdWVyeSgocXVlcnkpID0+IHtcbiAgICAgICAgcXVlcnkud2hlcmVOb3QoJ2lkJywgaWQpO1xuICAgICAgICBxdWVyeS53aGVyZSgnZW1haWwnLCBlbWFpbCk7XG4gICAgICAgIHF1ZXJ5Lm9yV2hlcmUoJ3Bob25lX251bWJlcicsIHBob25lTnVtYmVyKTtcbiAgICAgIH0pLmZldGNoQWxsKCk7XG5cbiAgICAgIGNvbnN0IGZvdW5kVXNlckVtYWlsID0gZm91bmRVc2Vycy5maW5kKCh1KSA9PiB1LmF0dHJpYnVlcy5lbWFpbCA9PT0gZW1haWwpO1xuICAgICAgY29uc3QgZm91bmRVc2VyUGhvbmUgPSBmb3VuZFVzZXJzLmZpbmQoKHUpID0+IHUuYXR0cmlidWVzLnBob25lX251bWJlciA9PT0gcGhvbmVOdW1iZXIpO1xuXG4gICAgICBjb25zdCBlcnJvclJlYXNvbnMgPSBbXTtcblxuICAgICAgaWYgKGZvdW5kVXNlckVtYWlsKSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHsgdHlwZTogJ0VNQUlMX0FMUkVBRFlfRVhJU1QnLCBjb2RlOiAxMDAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZm91bmRVc2VyUGhvbmUpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnUEhPTkVfTlVNQkVSX0FMUkVBRFlfRVhJU1QnLCBjb2RlOiAxMjAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZXJyb3JSZWFzb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJlcy5iYWRSZXF1ZXN0KG51bGwsIHsgZXJyb3JzOiBlcnJvclJlYXNvbnMgfSk7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHVzZXIuc2F2ZSh7XG4gICAgICAgIGZpcnN0X25hbWU6IHJlcS5ib2R5LmZpcnN0X25hbWUsXG4gICAgICAgIGxhc3RfbmFtZTogcmVxLmJvZHkubGFzdF9uYW1lLFxuICAgICAgICBlbWFpbDogcmVxLmJvZHkuZW1haWwsXG4gICAgICAgIHBob25lX251bWJlcjogcmVxLmJvZHkucGhvbmVfbnVtYmVyLFxuICAgICAgICBzdGF0dXM6IHJlcS5ib2R5LnN0YXR1cyxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBTb2Z0IGRlbGV0aW5nIHRoZSBnaXZlbiB1c2VyLlxuICAgKi9cbiAgZGVsZXRlVXNlcjoge1xuICAgIHZhbGlkYXRpb246IFtdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCB1c2VyID0gYXdhaXQgVXNlci53aGVyZSgnaWQnLCBpZCkuZmV0Y2goKTtcblxuICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnVVNFUl9OT1RfRk9VTkQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCB1c2VyLmRlc3Ryb3koKTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCgpO1xuICAgIH0sXG4gIH0sXG5cbiAgZ2V0VXNlcjoge1xuICAgIHZhbGlkYXRpb246IFtdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCB1c2VyID0gYXdhaXQgVXNlci53aGVyZSgnaWQnLCBpZCkuZmV0Y2goKTtcblxuICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyBpdGVtOiB1c2VyLnRvSlNPTigpIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIHRoZSBsaXN0IG9mIHVzZXJzLlxuICAgKi9cbiAgbGlzdFVzZXJzOiB7XG4gICAgdmFsaWRhdGlvbjogW10sXG4gICAgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgZmlsdGVyID0ge1xuICAgICAgICBmaXJzdF9uYW1lOiAnJyxcbiAgICAgICAgbGFzdF9uYW1lOiAnJyxcbiAgICAgICAgZW1haWw6ICcnLFxuICAgICAgICBwaG9uZV9udW1iZXI6ICcnLFxuXG4gICAgICAgIHBhZ2Vfc2l6ZTogMTAsXG4gICAgICAgIHBhZ2U6IDEsXG4gICAgICAgIC4uLnJlcS5xdWVyeSxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHVzZXJzID0gVXNlci5xdWVyeSgocXVlcnkpID0+IHtcbiAgICAgICAgaWYgKGZpbHRlci5maXJzdF9uYW1lKSB7XG4gICAgICAgICAgcXVlcnkud2hlcmUoJ2ZpcnN0X25hbWUnLCBmaWx0ZXIuZmlyc3RfbmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbHRlci5sYXN0X25hbWUpIHtcbiAgICAgICAgICBxdWVyeS53aGVyZSgnbGFzdF9uYW1lJywgZmlsdGVyLmxhc3RfbmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbHRlci5lbWFpbCkge1xuICAgICAgICAgIHF1ZXJ5LndoZXJlKCdlbWFpbCcsIGZpbHRlci5lbWFpbCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbHRlci5waG9uZV9udW1iZXIpIHtcbiAgICAgICAgICBxdWVyeS53aGVyZSgncGhvbmVfbnVtYmVyJywgZmlsdGVyLnBob25lX251bWJlcik7XG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoUGFnZSh7XG4gICAgICAgIHBhZ2Vfc2l6ZTogZmlsdGVyLnBhZ2Vfc2l6ZSxcbiAgICAgICAgcGFnZTogZmlsdGVyLnBhZ2UsXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgaXRlbXM6IHVzZXJzLnRvSlNPTigpLFxuICAgICAgICBwYWdpbmF0aW9uOiB1c2Vycy5wYWdpbmF0aW9uLFxuICAgICAgfSk7XG4gICAgfSxcbiAgfSxcbn07XG4iLCJpbXBvcnQgeyBkaWZmZXJlbmNlIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgY2hlY2ssIHF1ZXJ5LCB2YWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InO1xuaW1wb3J0IGFzeW5jTWlkZGxld2FyZSBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9hc3luY01pZGRsZXdhcmUnO1xuaW1wb3J0IFJlc291cmNlIGZyb20gJ0AvbW9kZWxzL1Jlc291cmNlJztcbmltcG9ydCBWaWV3IGZyb20gJy4uLy4uL21vZGVscy9WaWV3JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICByZXNvdXJjZTogJ2l0ZW1zJyxcblxuICAvKipcbiAgICogUm91dGVyIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbiAgICByb3V0ZXIucG9zdCgnLycsXG4gICAgICB0aGlzLmNyZWF0ZVZpZXcudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmNyZWF0ZVZpZXcuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLnBvc3QoJy86dmlld19pZCcsXG4gICAgICB0aGlzLmVkaXRWaWV3LnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5lZGl0Vmlldy5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZGVsZXRlKCcvOnZpZXdfaWQnLFxuICAgICAgdGhpcy5kZWxldGVWaWV3LnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5kZWxldGVWaWV3LmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5nZXQoJy86dmlld19pZCcsXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5nZXRWaWV3LmhhbmRsZXIpKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIExpc3QgYWxsIHZpZXdzIHRoYXQgYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiByZXNvdXJjZS5cbiAgICovXG4gIGxpc3RWaWV3czoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHF1ZXJ5KCdyZXNvdXJjZV9uYW1lJykub3B0aW9uYWwoKS50cmltKCkuZXNjYXBlKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IHJlc291cmNlX2lkOiByZXNvdXJjZUlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3Qgdmlld3MgPSBhd2FpdCBWaWV3LndoZXJlKCdyZXNvdXJjZV9pZCcsIHJlc291cmNlSWQpLmZldGNoQWxsKCk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IHZpZXdzOiB2aWV3cy50b0pTT04oKSB9KTtcbiAgICB9LFxuICB9LFxuXG4gIGdldFZpZXc6IHtcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IHZpZXdfaWQ6IHZpZXdJZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IHZpZXcgPSBhd2FpdCBWaWV3LndoZXJlKCdpZCcsIHZpZXdJZCkuZmV0Y2goe1xuICAgICAgICB3aXRoUmVsYXRlZDogWydyZXNvdXJjZScsICdjb2x1bW5zJywgJ3ZpZXdSb2xlcyddLFxuICAgICAgfSk7XG5cbiAgICAgIGlmICghdmlldykge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ1JPTEVfTk9UX0ZPVU5EJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IC4uLnZpZXcudG9KU09OKCkgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogRGVsZXRlIHRoZSBnaXZlbiB2aWV3IG9mIHRoZSByZXNvdXJjZS5cbiAgICovXG4gIGRlbGV0ZVZpZXc6IHtcbiAgICB2YWxpZGF0aW9uOiBbXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IHZpZXdfaWQ6IHZpZXdJZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IHZpZXcgPSBhd2FpdCBWaWV3LndoZXJlKCdpZCcsIHZpZXdJZCkuZmV0Y2goe1xuICAgICAgICB3aXRoUmVsYXRlZDogWyd2aWV3Um9sZXMnLCAnY29sdW1ucyddLFxuICAgICAgfSk7XG5cbiAgICAgIGlmICghdmlldykge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ1ZJRVdfTk9UX0ZPVU5EJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmICh2aWV3LmF0dHJpYnV0ZXMucHJlZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkUmVxdWVzdChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnUFJFREVGSU5FRF9WSUVXJywgY29kZTogMjAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8vIGNvbnNvbGUubG9nKHZpZXcpO1xuICAgICAgYXdhaXQgdmlldy5kZXN0cm95KCk7XG5cbiAgICAgIC8vIGF3YWl0IHZpZXcuY29sdW1ucygpLmRlc3Ryb3koeyByZXF1aXJlOiBmYWxzZSB9KTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgaWQ6IHZpZXcuZ2V0KCdpZCcpIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgdmlldy5cbiAgICovXG4gIGNyZWF0ZVZpZXc6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBjaGVjaygncmVzb3VyY2VfbmFtZScpLmV4aXN0cygpLmVzY2FwZSgpLnRyaW0oKSxcbiAgICAgIGNoZWNrKCdsYWJlbCcpLmV4aXN0cygpLmVzY2FwZSgpLnRyaW0oKSxcbiAgICAgIGNoZWNrKCdjb2x1bW5zJykuaXNBcnJheSh7IG1pbjogMyB9KSxcbiAgICAgIGNoZWNrKCdyb2xlcycpLmlzQXJyYXkoKSxcbiAgICAgIGNoZWNrKCdyb2xlcy4qLmZpZWxkJykuZXhpc3RzKCkuZXNjYXBlKCkudHJpbSgpLFxuICAgICAgY2hlY2soJ3JvbGVzLiouY29tcGFyYXRvcicpLmV4aXN0cygpLFxuICAgICAgY2hlY2soJ3JvbGVzLioudmFsdWUnKS5leGlzdHMoKSxcbiAgICAgIGNoZWNrKCdyb2xlcy4qLmluZGV4JykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdjb2x1bW5zJykuZXhpc3RzKCkuaXNBcnJheSgpLFxuICAgICAgY2hlY2soJ2NvbHVtbnMuKicpLmV4aXN0cygpLmVzY2FwZSgpLnRyaW0oKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZvcm0gPSB7IC4uLnJlcS5ib2R5IH07XG4gICAgICBjb25zdCByZXNvdXJjZSA9IGF3YWl0IFJlc291cmNlLnF1ZXJ5KCkud2hlcmUoJ25hbWUnLCBmb3JtLnJlc291cmNlX25hbWUpLmZpcnN0KCk7XG5cbiAgICAgIGlmICghcmVzb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKG51bGwsIHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdSRVNPVVJDRV9OT1RfRk9VTkQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZXJyb3JSZWFzb25zID0gW107XG4gICAgICBjb25zdCBmaWVsZHNTbHVncyA9IGZvcm0ucm9sZXMubWFwKChyb2xlKSA9PiByb2xlLmZpZWxkKTtcblxuICAgICAgY29uc3QgcmVzb3VyY2VGaWVsZHMgPSBhd2FpdCByZXNvdXJjZS5maWVsZHMoKS5mZXRjaCgpO1xuICAgICAgY29uc3QgcmVzb3VyY2VGaWVsZHNLZXlzID0gcmVzb3VyY2VGaWVsZHMubWFwKChmKSA9PiBmLmdldCgna2V5JykpO1xuICAgICAgY29uc3Qgbm90Rm91bmRGaWVsZHMgPSBkaWZmZXJlbmNlKGZpZWxkc1NsdWdzLCByZXNvdXJjZUZpZWxkc0tleXMpO1xuXG4gICAgICBpZiAobm90Rm91bmRGaWVsZHMubGVuZ3RoID4gMCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdSRVNPVVJDRV9GSUVMRFNfTk9UX0VYSVNUJywgY29kZTogMTAwLCBmaWVsZHM6IG5vdEZvdW5kRmllbGRzIH0pO1xuICAgICAgfVxuICAgICAgY29uc3Qgbm90Rm91bmRDb2x1bW5zID0gZGlmZmVyZW5jZShmb3JtLmNvbHVtbnMsIHJlc291cmNlRmllbGRzS2V5cyk7XG5cbiAgICAgIGlmIChub3RGb3VuZENvbHVtbnMubGVuZ3RoID4gMCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdDT0xVTU5TX05PVF9FWElTVCcsIGNvZGU6IDIwMCwgZmllbGRzOiBub3RGb3VuZENvbHVtbnMgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZXJyb3JSZWFzb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwgeyBlcnJvcnM6IGVycm9yUmVhc29ucyB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdmlldyA9IGF3YWl0IFZpZXcucXVlcnkoKS5pbnNlcnQoe1xuICAgICAgICBuYW1lOiBmb3JtLmxhYmVsLFxuICAgICAgICBwcmVkZWZpbmVkOiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBTYXZlIHZpZXcgZGV0YWlscy5cbiAgICAgIGF3YWl0IHZpZXcuc2F2ZSgpO1xuXG4gICAgICAvLyBTYXZlIHZpZXcgY29sdW1ucy5cblxuICAgICAgLy8gU2F2ZSB2aWV3IHJvbGVzLlxuXG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCgpO1xuICAgIH0sXG4gIH0sXG5cblxuICBlZGl0Vmlldzoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCdsYWJlbCcpLmV4aXN0cygpLmVzY2FwZSgpLnRyaW0oKSxcbiAgICAgIGNoZWNrKCdjb2x1bW5zJykuaXNBcnJheSh7IG1pbjogMyB9KSxcbiAgICAgIGNoZWNrKCdyb2xlcycpLmlzQXJyYXkoKSxcbiAgICAgIGNoZWNrKCdyb2xlcy4qLmZpZWxkJykuZXhpc3RzKCkuZXNjYXBlKCkudHJpbSgpLFxuICAgICAgY2hlY2soJ3JvbGVzLiouY29tcGFyYXRvcicpLmV4aXN0cygpLFxuICAgICAgY2hlY2soJ3JvbGVzLioudmFsdWUnKS5leGlzdHMoKSxcbiAgICAgIGNoZWNrKCdyb2xlcy4qLmluZGV4JykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgdmlld19pZDogdmlld0lkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHZpZXcgPSBhd2FpdCBWaWV3LndoZXJlKCdpZCcsIHZpZXdJZCkuZmV0Y2goKTtcblxuICAgICAgaWYgKCF2aWV3KSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnUk9MRV9OT1RfRk9VTkQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxufTtcbiIsIi8vIGltcG9ydCBPQXV0aDIgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL09BdXRoMic7XG5pbXBvcnQgQXV0aGVudGljYXRpb24gZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL0F1dGhlbnRpY2F0aW9uJztcbmltcG9ydCBVc2VycyBmcm9tICdAL2h0dHAvY29udHJvbGxlcnMvVXNlcnMnO1xuaW1wb3J0IFJvbGVzIGZyb20gJ0AvaHR0cC9jb250cm9sbGVycy9Sb2xlcyc7XG5pbXBvcnQgSXRlbXMgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL0l0ZW1zJztcbmltcG9ydCBJdGVtQ2F0ZWdvcmllcyBmcm9tICdAL2h0dHAvY29udHJvbGxlcnMvSXRlbUNhdGVnb3JpZXMnO1xuaW1wb3J0IEFjY291bnRzIGZyb20gJ0AvaHR0cC9jb250cm9sbGVycy9BY2NvdW50cyc7XG5pbXBvcnQgQWNjb3VudE9wZW5pbmdCYWxhbmNlIGZyb20gJ0AvaHR0cC9jb250cm9sbGVycy9BY2NvdW50T3BlbmluZ0JhbGFuY2UnO1xuaW1wb3J0IFZpZXdzIGZyb20gJ0AvaHR0cC9jb250cm9sbGVycy9WaWV3cyc7XG5pbXBvcnQgQ3VzdG9tRmllbGRzIGZyb20gJ0AvaHR0cC9jb250cm9sbGVycy9GaWVsZHMnO1xuaW1wb3J0IEFjY291bnRpbmcgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL0FjY291bnRpbmcnO1xuaW1wb3J0IEZpbmFuY2lhbFN0YXRlbWVudHMgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL0ZpbmFuY2lhbFN0YXRlbWVudHMnO1xuaW1wb3J0IEV4cGVuc2VzIGZyb20gJ0AvaHR0cC9jb250cm9sbGVycy9FeHBlbnNlcyc7XG5pbXBvcnQgT3B0aW9ucyBmcm9tICdAL2h0dHAvY29udHJvbGxlcnMvT3B0aW9ucyc7XG5pbXBvcnQgQnVkZ2V0IGZyb20gJ0AvaHR0cC9jb250cm9sbGVycy9CdWRnZXQnO1xuaW1wb3J0IEN1c3RvbWVycyBmcm9tICdAL2h0dHAvY29udHJvbGxlcnMvQ3VzdG9tZXJzJztcbmltcG9ydCBTdXBwbGllcnMgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL1N1cHBsaWVycyc7XG5pbXBvcnQgQmlsbHMgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL0JpbGxzJztcbmltcG9ydCBDdXJyZW5jeUFkanVzdG1lbnQgZnJvbSAnLi9jb250cm9sbGVycy9DdXJyZW5jeUFkanVzdG1lbnQnO1xuLy8gaW1wb3J0IFNhbGVzUmVwb3J0cyBmcm9tICdAL2h0dHAvY29udHJvbGxlcnMvU2FsZXNSZXBvcnRzJztcbi8vIGltcG9ydCBQdXJjaGFzZXNSZXBvcnRzIGZyb20gJ0AvaHR0cC9jb250cm9sbGVycy9QdXJjaGFzZXNSZXBvcnRzJztcblxuZXhwb3J0IGRlZmF1bHQgKGFwcCkgPT4ge1xuICAvLyBhcHAudXNlKCcvYXBpL29hdXRoMicsIE9BdXRoMi5yb3V0ZXIoKSk7XG4gIGFwcC51c2UoJy9hcGkvYXV0aCcsIEF1dGhlbnRpY2F0aW9uLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS91c2VycycsIFVzZXJzLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS9yb2xlcycsIFJvbGVzLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS9hY2NvdW50cycsIEFjY291bnRzLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS9hY2NvdW50aW5nJywgQWNjb3VudGluZy5yb3V0ZXIoKSk7XG4gIGFwcC51c2UoJy9hcGkvYWNjb3VudHNfb3BlaW5nX2JhbGFuY2UnLCBBY2NvdW50T3BlbmluZ0JhbGFuY2Uucm91dGVyKCkpO1xuICBhcHAudXNlKCcvYXBpL3ZpZXdzJywgVmlld3Mucm91dGVyKCkpO1xuICBhcHAudXNlKCcvYXBpL2ZpZWxkcycsIEN1c3RvbUZpZWxkcy5yb3V0ZXIoKSk7XG4gIGFwcC51c2UoJy9hcGkvaXRlbXMnLCBJdGVtcy5yb3V0ZXIoKSk7XG4gIGFwcC51c2UoJy9hcGkvaXRlbV9jYXRlZ29yaWVzJywgSXRlbUNhdGVnb3JpZXMucm91dGVyKCkpO1xuICBhcHAudXNlKCcvYXBpL2V4cGVuc2VzJywgRXhwZW5zZXMucm91dGVyKCkpO1xuICBhcHAudXNlKCcvYXBpL2ZpbmFuY2lhbF9zdGF0ZW1lbnRzJywgRmluYW5jaWFsU3RhdGVtZW50cy5yb3V0ZXIoKSk7XG4gIGFwcC51c2UoJy9hcGkvb3B0aW9ucycsIE9wdGlvbnMucm91dGVyKCkpO1xuICAvLyBhcHAudXNlKCcvYXBpL2N1c3RvbWVycycsIEN1c3RvbWVycy5yb3V0ZXIoKSk7XG4gIC8vIGFwcC51c2UoJy9hcGkvc3VwcGxpZXJzJywgU3VwcGxpZXJzLnJvdXRlcigpKTtcbiAgLy8gYXBwLnVzZSgnL2FwaS9iaWxscycsIEJpbGxzLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS9idWRnZXQnLCBCdWRnZXQucm91dGVyKCkpO1xuICAvLyBhcHAudXNlKCcvYXBpL2N1cnJlbmN5X2FkanVzdG1lbnQnLCBDdXJyZW5jeUFkanVzdG1lbnQucm91dGVyKCkpO1xuICAvLyBhcHAudXNlKCcvYXBpL3JlcG9ydHMvc2FsZXMnLCBTYWxlc1JlcG9ydHMucm91dGVyKCkpO1xuICAvLyBhcHAudXNlKCcvYXBpL3JlcG9ydHMvcHVyY2hhc2VzJywgUHVyY2hhc2VzUmVwb3J0cy5yb3V0ZXIoKSk7XG59O1xuIiwiY29uc3QgYXN5bmNNaWRkbGV3YXJlID0gKGZuKSA9PiAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgUHJvbWlzZS5yZXNvbHZlKGZuKHJlcSwgcmVzLCBuZXh0KSlcbiAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICBuZXh0KGVycm9yKTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jTWlkZGxld2FyZTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIGNvbnNpc3RlbnQtcmV0dXJuICovXG5jb25zdCBhdXRob3JpemF0aW9uID0gKHJlc291cmNlTmFtZSkgPT4gKC4uLnBlcm1pc3Npb25zKSA9PiAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgY29uc3QgeyB1c2VyIH0gPSByZXE7XG4gIGNvbnN0IG9uRXJyb3IgPSAoKSA9PiB7XG4gICAgcmVzLmJvb20udW5hdXRob3JpemVkKCk7XG4gIH07XG4gIHVzZXIuaGFzUGVybWlzc2lvbnMocmVzb3VyY2VOYW1lLCBwZXJtaXNzaW9ucylcbiAgICAudGhlbigoYXV0aG9yaXplZCkgPT4ge1xuICAgICAgaWYgKCFhdXRob3JpemVkKSB7XG4gICAgICAgIHJldHVybiBvbkVycm9yKCk7XG4gICAgICB9XG4gICAgICBuZXh0KCk7XG4gICAgfSkuY2F0Y2gob25FcnJvcik7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhdXRob3JpemF0aW9uO1xuIiwiLyogZXNsaW50LWRpc2FibGUgY29uc2lzdGVudC1yZXR1cm4gKi9cbmltcG9ydCBqd3QgZnJvbSAnanNvbndlYnRva2VuJztcbmltcG9ydCBVc2VyIGZyb20gJ0AvbW9kZWxzL1VzZXInO1xuLy8gaW1wb3J0IEF1dGggZnJvbSAnQC9tb2RlbHMvQXV0aCc7XG5cbmNvbnN0IGF1dGhNaWRkbGV3YXJlID0gKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gIGNvbnN0IHsgSldUX1NFQ1JFVF9LRVkgfSA9IHByb2Nlc3MuZW52O1xuICBjb25zdCB0b2tlbiA9IHJlcS5oZWFkZXJzWyd4LWFjY2Vzcy10b2tlbiddIHx8IHJlcS5xdWVyeS50b2tlbjtcblxuICBjb25zdCBvbkVycm9yID0gKCkgPT4ge1xuICAgIC8vIEF1dGgubG9nZ2VkT3V0KCk7XG4gICAgcmVzLnN0YXR1cyg0MDEpLnNlbmQoe1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBtZXNzYWdlOiAndW5hdXRob3JpemVkJyxcbiAgICB9KTtcbiAgfTtcblxuICBpZiAoIXRva2VuKSB7XG4gICAgcmV0dXJuIG9uRXJyb3IoKTtcbiAgfVxuXG4gIGNvbnN0IHZlcmlmeSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBqd3QudmVyaWZ5KHRva2VuLCBKV1RfU0VDUkVUX0tFWSwgYXN5bmMgKGVycm9yLCBkZWNvZGVkKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlcnNjb3JlLWRhbmdsZVxuICAgICAgICByZXEudXNlciA9IGF3YWl0IFVzZXIucXVlcnkoKS5maW5kQnlJZChkZWNvZGVkLl9pZCk7XG4gICAgICAgIC8vIEF1dGguc2V0QXV0aGVudGljYXRlZFVzZXIocmVxLnVzZXIpO1xuXG4gICAgICAgIGlmICghcmVxLnVzZXIpIHtcbiAgICAgICAgICByZXR1cm4gb25FcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUoZGVjb2RlZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHZlcmlmeS50aGVuKCgpID0+IHsgbmV4dCgpOyB9KS5jYXRjaChvbkVycm9yKTtcbn07XG5leHBvcnQgZGVmYXVsdCBhdXRoTWlkZGxld2FyZTtcbiIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWV0YWJsZUNvbGxlY3Rpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm1ldGFkYXRhID0gW107XG4gICAgdGhpcy5LRVlfQ09MVU1OID0gJ2tleSc7XG4gICAgdGhpcy5WQUxVRV9DT0xVTU4gPSAndmFsdWUnO1xuICAgIHRoaXMuVFlQRV9DT0xVTU4gPSAndHlwZSc7XG4gICAgdGhpcy5tb2RlbCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2V0IG1vZGVsIG9mIHRoaXMgbWV0YWRhdGEgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IG1vZGVsIC1cbiAgICovXG4gIHNldE1vZGVsKG1vZGVsKSB7XG4gICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIGdpdmVuIG1ldGFkYXRhIGtleS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSAtXG4gICAqIEByZXR1cm4ge29iamVjdH0gLSBNZXRhZGF0YSBvYmplY3QuXG4gICAqL1xuICBmaW5kTWV0YShrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5hbGxNZXRhZGF0YSgpLmZpbmQoKG1ldGEpID0+IG1ldGEua2V5ID09PSBrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGFsbCBtZXRhZGF0YS5cbiAgICovXG4gIGFsbE1ldGFkYXRhKCkge1xuICAgIHJldHVybiB0aGlzLm1ldGFkYXRhLmZpbHRlcigobWV0YSkgPT4gIW1ldGEubWFya0FzRGVsZXRlZCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgbWV0YWRhdGEgb2YgdGhlIGdpdmVuIGtleS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSAtXG4gICAqIEBwYXJhbSB7TWl4aWVkfSBkZWZhdWx0VmFsdWUgLVxuICAgKi9cbiAgZ2V0TWV0YShrZXksIGRlZmF1bHRWYWx1ZSkge1xuICAgIGNvbnN0IG1ldGFkYXRhID0gdGhpcy5maW5kTWV0YShrZXkpO1xuICAgIHJldHVybiBtZXRhZGF0YSA/IG1ldGFkYXRhLnZhbHVlIDogZGVmYXVsdFZhbHVlIHx8IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtlcyB0aGUgbWV0YWRhdGEgdG8gc2hvdWxkIGJlIGRlbGV0ZWQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgLVxuICAgKi9cbiAgcmVtb3ZlTWV0YShrZXkpIHtcbiAgICBjb25zdCBtZXRhZGF0YSA9IHRoaXMuZmluZE1ldGEoa2V5KTtcblxuICAgIGlmIChtZXRhZGF0YSkge1xuICAgICAgbWV0YWRhdGEubWFya0FzRGVsZXRlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgbWV0YSBkYXRhIG9mIHRoZSBnaXZlbiBncm91cC5cbiAgICogQHBhcmFtIHsqfSBncm91cFxuICAgKi9cbiAgcmVtb3ZlQWxsTWV0YShncm91cCA9ICdkZWZhdWx0Jykge1xuICAgIHRoaXMubWV0YWRhdGEuZm9yRWFjaChtZXRhID0+IHtcbiAgICAgIG1ldGEubWFya0FzRGVsZXRlZCA9IHRydWU7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBtZXRhIGRhdGEgdG8gdGhlIHN0YWNrLlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IC1cbiAgICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlIC1cbiAgICovXG4gIHNldE1ldGEoa2V5LCB2YWx1ZSwgcGF5bG9hZCkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGtleSkpIHtcbiAgICAgIGNvbnN0IG1ldGFkYXRhID0ga2V5O1xuXG4gICAgICBtZXRhZGF0YS5mb3JFYWNoKChtZXRhKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0TWV0YShtZXRhLmtleSwgbWV0YS52YWx1ZSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbWV0YWRhdGEgPSB0aGlzLmZpbmRNZXRhKGtleSk7XG5cbiAgICBpZiAobWV0YWRhdGEpIHtcbiAgICAgIG1ldGFkYXRhLnZhbHVlID0gdmFsdWU7XG4gICAgICBtZXRhZGF0YS5tYXJrQXNVcGRhdGVkID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tZXRhZGF0YS5wdXNoKHtcbiAgICAgICAgdmFsdWUsIGtleSwgLi4ucGF5bG9hZCwgbWFya0FzSW5zZXJ0ZWQ6IHRydWUsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2F2ZWQgdGhlIG1vZGlmaWVkL2RlbGV0ZWQgYW5kIGluc2VydGVkIG1ldGFkYXRhLlxuICAgKi9cbiAgYXN5bmMgc2F2ZU1ldGEoKSB7XG4gICAgY29uc3QgaW5zZXJ0ZWQgPSB0aGlzLm1ldGFkYXRhLmZpbHRlcigobSkgPT4gKG0ubWFya0FzSW5zZXJ0ZWQgPT09IHRydWUpKTtcbiAgICBjb25zdCB1cGRhdGVkID0gdGhpcy5tZXRhZGF0YS5maWx0ZXIoKG0pID0+IChtLm1hcmtBc1VwZGF0ZWQgPT09IHRydWUpKTtcbiAgICBjb25zdCBkZWxldGVkID0gdGhpcy5tZXRhZGF0YS5maWx0ZXIoKG0pID0+IChtLm1hcmtBc0RlbGV0ZWQgPT09IHRydWUpKTtcbiAgICBjb25zdCBvcGVycyA9IFtdO1xuXG4gICAgaWYgKGRlbGV0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgZGVsZXRlT3BlciA9IHRoaXMubW9kZWwucXVlcnkoKVxuICAgICAgICAud2hlcmVJbigna2V5JywgZGVsZXRlZC5tYXAoKG1ldGEpID0+IG1ldGEua2V5KSkuZGVsZXRlKCk7XG5cbiAgICAgIG9wZXJzLnB1c2goZGVsZXRlT3Blcik7XG4gICAgfVxuICAgIGluc2VydGVkLmZvckVhY2goKG1ldGEpID0+IHtcbiAgICAgIGNvbnN0IGluc2VydE9wZXIgPSB0aGlzLm1vZGVsLnF1ZXJ5KCkuaW5zZXJ0KHtcbiAgICAgICAgW3RoaXMuS0VZX0NPTFVNTl06IG1ldGEua2V5LFxuICAgICAgICBbdGhpcy5WQUxVRV9DT0xVTU5dOiBtZXRhLnZhbHVlLFxuICAgICAgfSk7XG4gICAgICBvcGVycy5wdXNoKGluc2VydE9wZXIpO1xuICAgIH0pO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKG9wZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkcyB0aGUgbWV0YWRhdGEgZnJvbSB0aGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGtleSAtXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gZm9yY2UgLVxuICAgKi9cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICBjb25zdCBtZXRhZGF0YSA9IGF3YWl0IHRoaXMucXVlcnkoKTtcblxuICAgIGNvbnN0IG1ldGFkYXRhQXJyYXkgPSB0aGlzLm1hcE1ldGFkYXRhQ29sbGVjdGlvbihtZXRhZGF0YSk7XG4gICAgbWV0YWRhdGFBcnJheS5mb3JFYWNoKChtZXRhKSA9PiB7XG4gICAgICB0aGlzLm1ldGFkYXRhLnB1c2gobWV0YSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRm9ybWF0IHRoZSBtZXRhZGF0YSBiZWZvcmUgc2F2aW5nIHRvIHRoZSBkYXRhYmFzZS5cbiAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfEJvb2xlYW59IHZhbHVlIC1cbiAgICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlVHlwZSAtXG4gICAqIEByZXR1cm4ge1N0cmluZ3xOdW1iZXJ8Qm9vbGVhbn0gLVxuICAgKi9cbiAgc3RhdGljIGZvcm1hdE1ldGFWYWx1ZSh2YWx1ZSwgdmFsdWVUeXBlKSB7XG4gICAgbGV0IHBhcnNlZFZhbHVlO1xuXG4gICAgc3dpdGNoICh2YWx1ZVR5cGUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHBhcnNlZFZhbHVlID0gYCR7dmFsdWV9YDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgcGFyc2VkVmFsdWUgPSB2YWx1ZSA/ICcxJyA6ICcwJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdqc29uJzpcbiAgICAgICAgcGFyc2VkVmFsdWUgPSBKU09OLnN0cmluZ2lmeShwYXJzZWRWYWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcGFyc2VkVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZWRWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXBwaW5nIGFuZCBwYXJzZSBtZXRhZGF0YSB0byBjb2xsZWN0aW9uIGVudHJpZXMuXG4gICAqIEBwYXJhbSB7TWV0YX0gYXR0ciAtXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJzZVR5cGUgLVxuICAgKi9cbiAgbWFwTWV0YWRhdGEoYXR0ciwgcGFyc2VUeXBlID0gJ3BhcnNlJykge1xuICAgIHJldHVybiB7XG4gICAgICBrZXk6IGF0dHJbdGhpcy5LRVlfQ09MVU1OXSxcbiAgICAgIHZhbHVlOiAocGFyc2VUeXBlID09PSAncGFyc2UnKVxuICAgICAgICA/IE1ldGFibGVDb2xsZWN0aW9uLnBhcnNlTWV0YVZhbHVlKFxuICAgICAgICAgIGF0dHJbdGhpcy5WQUxVRV9DT0xVTU5dLFxuICAgICAgICAgIHRoaXMuVFlQRV9DT0xVTU4gPyBhdHRyW3RoaXMuVFlQRV9DT0xVTU5dIDogZmFsc2UsXG4gICAgICAgIClcbiAgICAgICAgOiBNZXRhYmxlQ29sbGVjdGlvbi5mb3JtYXRNZXRhVmFsdWUoXG4gICAgICAgICAgYXR0clt0aGlzLlZBTFVFX0NPTFVNTl0sXG4gICAgICAgICAgdGhpcy5UWVBFX0NPTFVNTiA/IGF0dHJbdGhpcy5UWVBFX0NPTFVNTl0gOiBmYWxzZSxcbiAgICAgICAgKSxcbiAgICAgIC4uLnRoaXMuZXh0cmFDb2x1bW5zLm1hcCgoZXh0cmFDb2wpID0+ICh7XG4gICAgICAgIFtleHRyYUNvbF06IGF0dHJbZXh0cmFDb2xdIHx8IG51bGwsXG4gICAgICB9KSksXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZSB0aGUgbWV0YWRhdGEgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSB7QXJyYXl9IGNvbGxlY3Rpb24gLVxuICAgKi9cbiAgbWFwTWV0YWRhdGFUb0NvbGxlY3Rpb24obWV0YWRhdGEsIHBhcnNlVHlwZSA9ICdwYXJzZScpIHtcbiAgICByZXR1cm4gbWV0YWRhdGEubWFwKChtb2RlbCkgPT4gdGhpcy5tYXBNZXRhZGF0YVRvQ29sbGVjdGlvbihtb2RlbCwgcGFyc2VUeXBlKSk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZCBtZXRhZGF0YSB0byB0aGUgbWV0YWJsZSBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0ge0FycmF5fSBtZXRhIC1cbiAgICovXG4gIGZyb20obWV0YSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG1ldGEpKSB7XG4gICAgICBtZXRhLmZvckVhY2goKG0pID0+IHsgdGhpcy5mcm9tKG0pOyB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5tZXRhZGF0YS5wdXNoKG1ldGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXRpYyBtZXRob2QgdG8gbG9hZCBtZXRhZGF0YSB0byB0aGUgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIHtBcnJheX0gbWV0YSBcbiAgICovXG4gIHN0YXRpYyBmcm9tKG1ldGEpIHtcbiAgICBjb25zdCBjb2xsZWN0aW9uID0gbmV3IE1ldGFibGVDb2xsZWN0aW9uKCk7XG4gICAgY29sbGVjdGlvbi5mcm9tKG1ldGEpO1xuXG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH1cbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIGdsb2JhbC1yZXF1aXJlICovXG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJ29iamVjdGlvbic7XG5pbXBvcnQgeyBmbGF0dGVuIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBCYXNlTW9kZWwgZnJvbSAnQC9tb2RlbHMvTW9kZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY2NvdW50IGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWVcbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAnYWNjb3VudHMnO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vZGVsIG1vZGlmaWVycy5cbiAgICovXG4gIHN0YXRpYyBnZXQgbW9kaWZpZXJzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBmaWx0ZXJBY2NvdW50VHlwZXMocXVlcnksIHR5cGVzSWRzKSB7XG4gICAgICAgIGlmICh0eXBlc0lkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcXVlcnkud2hlcmVJbignYWNjb3VuX3R5cGVfaWQnLCB0eXBlc0lkcyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxhdGlvbnNoaXAgbWFwcGluZy5cbiAgICovXG4gIHN0YXRpYyBnZXQgcmVsYXRpb25NYXBwaW5ncygpIHtcbiAgICBjb25zdCBBY2NvdW50VHlwZSA9IHJlcXVpcmUoJ0AvbW9kZWxzL0FjY291bnRUeXBlJyk7XG4gICAgY29uc3QgQWNjb3VudEJhbGFuY2UgPSByZXF1aXJlKCdAL21vZGVscy9BY2NvdW50QmFsYW5jZScpO1xuICAgIGNvbnN0IEFjY291bnRUcmFuc2FjdGlvbiA9IHJlcXVpcmUoJ0AvbW9kZWxzL0FjY291bnRUcmFuc2FjdGlvbicpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8qKlxuICAgICAgICogQWNjb3VudCBtb2RlbCBtYXkgYmVsb25ncyB0byBhY2NvdW50IHR5cGUuXG4gICAgICAgKi9cbiAgICAgIHR5cGU6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkJlbG9uZ3NUb09uZVJlbGF0aW9uLFxuICAgICAgICBtb2RlbENsYXNzOiBBY2NvdW50VHlwZS5kZWZhdWx0LFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ2FjY291bnRzLmFjY291bnRUeXBlSWQnLFxuICAgICAgICAgIHRvOiAnYWNjb3VudF90eXBlcy5pZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEFjY291bnQgbW9kZWwgbWF5IGhhcyBtYW55IGJhbGFuY2VzIGFjY291bnRzLlxuICAgICAgICovXG4gICAgICBiYWxhbmNlOiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5IYXNPbmVSZWxhdGlvbixcbiAgICAgICAgbW9kZWxDbGFzczogQWNjb3VudEJhbGFuY2UuZGVmYXVsdCxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICdhY2NvdW50cy5pZCcsXG4gICAgICAgICAgdG86ICdhY2NvdW50X2JhbGFuY2UuYWNjb3VudElkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQWNjb3VudCBtb2RlbCBtYXkgaGFzIG1hbnkgdHJhbnNhY3Rpb25zLlxuICAgICAgICovXG4gICAgICB0cmFuc2FjdGlvbnM6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkhhc01hbnlSZWxhdGlvbixcbiAgICAgICAgbW9kZWxDbGFzczogQWNjb3VudFRyYW5zYWN0aW9uLmRlZmF1bHQsXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAnYWNjb3VudHMuaWQnLFxuICAgICAgICAgIHRvOiAnYWNjb3VudHNfdHJhbnNhY3Rpb25zLmFjY291bnRJZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgY29sbGVjdEpvdXJuYWxFbnRyaWVzKGFjY291bnRzKSB7XG4gICAgcmV0dXJuIGZsYXR0ZW4oYWNjb3VudHMubWFwKChhY2NvdW50KSA9PiBhY2NvdW50LnRyYW5zYWN0aW9ucy5tYXAoKHRyYW5zYWN0aW9uKSA9PiAoe1xuICAgICAgYWNjb3VudElkOiBhY2NvdW50LmlkLFxuICAgICAgLi4udHJhbnNhY3Rpb24sXG4gICAgICBhY2NvdW50Tm9ybWFsOiBhY2NvdW50LnR5cGUubm9ybWFsLFxuICAgIH0pKSkpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBNb2RlbCB9IGZyb20gJ29iamVjdGlvbic7XG5pbXBvcnQgQmFzZU1vZGVsIGZyb20gJ0AvbW9kZWxzL01vZGVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWNjb3VudEJhbGFuY2UgZXh0ZW5kcyBCYXNlTW9kZWwge1xuICAvKipcbiAgICogVGFibGUgbmFtZVxuICAgKi9cbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICdhY2NvdW50X2JhbGFuY2UnO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGF0aW9uc2hpcCBtYXBwaW5nLlxuICAgKi9cbiAgc3RhdGljIGdldCByZWxhdGlvbk1hcHBpbmdzKCkge1xuICAgIGNvbnN0IEFjY291bnQgPSByZXF1aXJlKCdAL21vZGVscy9BY2NvdW50Jyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWNjb3VudDoge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuQmVsb25nc1RvT25lUmVsYXRpb24sXG4gICAgICAgIG1vZGVsQ2xhc3M6IEFjY291bnQuZGVmYXVsdCxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICdhY2NvdW50X2JhbGFuY2UuYWNjb3VudF9pZCcsXG4gICAgICAgICAgdG86ICdhY2NvdW50cy5pZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cbiIsImltcG9ydCB7IE1vZGVsIH0gZnJvbSAnb2JqZWN0aW9uJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCBCYXNlTW9kZWwgZnJvbSAnQC9tb2RlbHMvTW9kZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY2NvdW50VHJhbnNhY3Rpb24gZXh0ZW5kcyBCYXNlTW9kZWwge1xuICAvKipcbiAgICogVGFibGUgbmFtZVxuICAgKi9cbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICdhY2NvdW50c190cmFuc2FjdGlvbnMnO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vZGVsIG1vZGlmaWVycy5cbiAgICovXG4gIHN0YXRpYyBnZXQgbW9kaWZpZXJzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBmaWx0ZXJBY2NvdW50cyhxdWVyeSwgYWNjb3VudHNJZHMpIHtcbiAgICAgICAgaWYgKGFjY291bnRzSWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBxdWVyeS53aGVyZUluKCdhY2NvdW50X2lkJywgYWNjb3VudHNJZHMpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZmlsdGVyVHJhbnNhY3Rpb25UeXBlcyhxdWVyeSwgdHlwZXMpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodHlwZXMpICYmIHR5cGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBxdWVyeS53aGVyZUluKCdyZWZlcmVuY2VfdHlwZScsIHR5cGVzKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdHlwZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgcXVlcnkud2hlcmUoJ3JlZmVyZW5jZV90eXBlJywgdHlwZXMpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZmlsdGVyRGF0ZVJhbmdlKHF1ZXJ5LCBzdGFydERhdGUsIGVuZERhdGUsIHR5cGUgPSAnZGF5Jykge1xuICAgICAgICBjb25zdCBkYXRlRm9ybWF0ID0gJ1lZWVktTU0tREQgSEg6bW06c3MnO1xuICAgICAgICBjb25zdCBmcm9tRGF0ZSA9IG1vbWVudChzdGFydERhdGUpLnN0YXJ0T2YodHlwZSkuZm9ybWF0KGRhdGVGb3JtYXQpO1xuICAgICAgICBjb25zdCB0b0RhdGUgPSBtb21lbnQoZW5kRGF0ZSkuZW5kT2YodHlwZSkuZm9ybWF0KGRhdGVGb3JtYXQpO1xuXG4gICAgICAgIGlmIChzdGFydERhdGUpIHtcbiAgICAgICAgICBxdWVyeS53aGVyZSgnZGF0ZScsICc+PScsIGZyb21EYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW5kRGF0ZSkge1xuICAgICAgICAgIHF1ZXJ5LndoZXJlKCdkYXRlJywgJzw9JywgdG9EYXRlKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZpbHRlckFtb3VudFJhbmdlKHF1ZXJ5LCBmcm9tQW1vdW50LCB0b0Ftb3VudCkge1xuICAgICAgICBpZiAoZnJvbUFtb3VudCkge1xuICAgICAgICAgIHF1ZXJ5LmFuZFdoZXJlKChxKSA9PiB7XG4gICAgICAgICAgICBxLndoZXJlKCdjcmVkaXQnLCAnPj0nLCBmcm9tQW1vdW50KTtcbiAgICAgICAgICAgIHEub3JXaGVyZSgnZGViaXQnLCAnPj0nLCBmcm9tQW1vdW50KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9BbW91bnQpIHtcbiAgICAgICAgICBxdWVyeS5hbmRXaGVyZSgocSkgPT4ge1xuICAgICAgICAgICAgcS53aGVyZSgnY3JlZGl0JywgJzw9JywgdG9BbW91bnQpO1xuICAgICAgICAgICAgcS5vcldoZXJlKCdkZWJpdCcsICc8PScsIHRvQW1vdW50KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHN1bWF0aW9uQ3JlZGl0RGViaXQocXVlcnkpIHtcbiAgICAgICAgcXVlcnkuc3VtKCdjcmVkaXQgYXMgY3JlZGl0Jyk7XG4gICAgICAgIHF1ZXJ5LnN1bSgnZGViaXQgYXMgZGViaXQnKTtcbiAgICAgICAgcXVlcnkuZ3JvdXBCeSgnYWNjb3VudF9pZCcpO1xuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGF0aW9uc2hpcCBtYXBwaW5nLlxuICAgKi9cbiAgc3RhdGljIGdldCByZWxhdGlvbk1hcHBpbmdzKCkge1xuICAgIGNvbnN0IEFjY291bnQgPSByZXF1aXJlKCdAL21vZGVscy9BY2NvdW50Jyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWNjb3VudDoge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuQmVsb25nc1RvT25lUmVsYXRpb24sXG4gICAgICAgIG1vZGVsQ2xhc3M6IEFjY291bnQuZGVmYXVsdCxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICdhY2NvdW50c190cmFuc2FjdGlvbnMuYWNjb3VudElkJyxcbiAgICAgICAgICB0bzogJ2FjY291bnRzLmlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIiwiLy8gaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJ29iamVjdGlvbic7XG5pbXBvcnQgQmFzZU1vZGVsIGZyb20gJ0AvbW9kZWxzL01vZGVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWNjb3VudFR5cGUgZXh0ZW5kcyBCYXNlTW9kZWwge1xuICAvKipcbiAgICogVGFibGUgbmFtZVxuICAgKi9cbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICdhY2NvdW50X3R5cGVzJztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxhdGlvbnNoaXAgbWFwcGluZy5cbiAgICovXG4gIHN0YXRpYyBnZXQgcmVsYXRpb25NYXBwaW5ncygpIHtcbiAgICBjb25zdCBBY2NvdW50ID0gcmVxdWlyZSgnQC9tb2RlbHMvQWNjb3VudCcpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8qKlxuICAgICAgICogQWNjb3VudCB0eXBlIG1heSBoYXMgbWFueSBhc3NvY2lhdGVkIGFjY291bnRzLlxuICAgICAgICovXG4gICAgICBhY2NvdW50czoge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuSGFzTWFueVJlbGF0aW9uLFxuICAgICAgICBtb2RlbENsYXNzOiBBY2NvdW50LmRlZmF1bHQsXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAnYWNjb3VudF90eXBlcy5pZCcsXG4gICAgICAgICAgdG86ICdhY2NvdW50cy5hY2NvdW50VHlwZUlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VNb2RlbCBmcm9tICdAL21vZGVscy9Nb2RlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1ZGdldCBleHRlbmRzIEJhc2VNb2RlbCB7XG4gIC8qKlxuICAgKiBUYWJsZSBuYW1lXG4gICAqL1xuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ2J1ZGdldHMnO1xuICB9XG5cbiAgc3RhdGljIGdldCB2aXJ0dWFsQXR0cmlidXRlcygpIHtcbiAgICByZXR1cm4gWydyYW5nZUJ5JywgJ3JhbmdlSW5jcmVtZW50J107XG4gIH1cblxuICBnZXQgcmFuZ2VCeSgpIHtcbiAgICBzd2l0Y2ggKHRoaXMucGVyaW9kKSB7XG4gICAgICBjYXNlICdoYWxmLXllYXInOlxuICAgICAgY2FzZSAncXVhcnRlcic6XG4gICAgICAgIHJldHVybiAnbW9udGgnO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHRoaXMucGVyaW9kO1xuICAgIH1cbiAgfVxuXG4gIGdldCByYW5nZUluY3JlbWVudCgpIHtcbiAgICBzd2l0Y2ggKHRoaXMucGVyaW9kKSB7XG4gICAgICBjYXNlICdoYWxmLXllYXInOlxuICAgICAgICByZXR1cm4gNjtcblxuICAgICAgY2FzZSAncXVhcnRlcic6XG4gICAgICAgIHJldHVybiAzO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHJhbmdlT2Zmc2V0KCkge1xuICAgIHN3aXRjaCAodGhpcy5wZXJpb2QpIHtcbiAgICAgIGNhc2UgJ2hhbGYteWVhcic6IHJldHVybiA1O1xuICAgICAgY2FzZSAncXVhcnRlcic6IHJldHVybiAyO1xuICAgICAgZGVmYXVsdDogcmV0dXJuIDA7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgQmFzZU1vZGVsIGZyb20gJ0AvbW9kZWxzL01vZGVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVkZ2V0IGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWVcbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAnYnVkZ2V0X2VudHJpZXMnO1xuICB9XG59XG4iLCJpbXBvcnQgeyBNb2RlbCB9IGZyb20gJ29iamVjdGlvbic7XG5pbXBvcnQgQmFzZU1vZGVsIGZyb20gJ0AvbW9kZWxzL01vZGVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXhwZW5zZSBleHRlbmRzIEJhc2VNb2RlbCB7XG4gIC8qKlxuICAgKiBUYWJsZSBuYW1lXG4gICAqL1xuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ2V4cGVuc2VzJztcbiAgfVxuXG4gIHN0YXRpYyBnZXQgcmVmZXJlbmNlVHlwZSgpIHtcbiAgICByZXR1cm4gJ0V4cGVuc2UnO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vZGVsIG1vZGlmaWVycy5cbiAgICovXG4gIHN0YXRpYyBnZXQgbW9kaWZpZXJzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBmaWx0ZXJCeURhdGVSYW5nZShxdWVyeSwgc3RhcnREYXRlLCBlbmREYXRlKSB7XG4gICAgICAgIGlmIChzdGFydERhdGUpIHtcbiAgICAgICAgICBxdWVyeS53aGVyZSgnZGF0ZScsICc+PScsIHN0YXJ0RGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVuZERhdGUpIHtcbiAgICAgICAgICBxdWVyeS53aGVyZSgnZGF0ZScsICc8PScsIGVuZERhdGUpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZmlsdGVyQnlBbW91bnRSYW5nZShxdWVyeSwgZnJvbSwgdG8pIHtcbiAgICAgICAgaWYgKGZyb20pIHtcbiAgICAgICAgICBxdWVyeS53aGVyZSgnYW1vdW50JywgJz49JywgZnJvbSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRvKSB7XG4gICAgICAgICAgcXVlcnkud2hlcmUoJ2Ftb3VudCcsICc8PScsIHRvKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZpbHRlckJ5RXhwZW5zZUFjY291bnQocXVlcnksIGFjY291bnRJZCkge1xuICAgICAgICBpZiAoYWNjb3VudElkKSB7XG4gICAgICAgICAgcXVlcnkud2hlcmUoJ2V4cGVuc2VfYWNjb3VudF9pZCcsIGFjY291bnRJZCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmaWx0ZXJCeVBheW1lbnRBY2NvdW50KHF1ZXJ5LCBhY2NvdW50SWQpIHtcbiAgICAgICAgaWYgKGFjY291bnRJZCkge1xuICAgICAgICAgIHF1ZXJ5LndoZXJlKCdwYXltZW50X2FjY291bnRfaWQnLCBhY2NvdW50SWQpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUmVsYXRpb25zaGlwIG1hcHBpbmcuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHJlbGF0aW9uTWFwcGluZ3MoKSB7XG4gICAgY29uc3QgQWNjb3VudCA9IHJlcXVpcmUoJ0AvbW9kZWxzL0FjY291bnQnKTtcbiAgICBjb25zdCBVc2VyID0gcmVxdWlyZSgnQC9tb2RlbHMvVXNlcicpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHBheW1lbnRBY2NvdW50OiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5CZWxvbmdzVG9PbmVSZWxhdGlvbixcbiAgICAgICAgbW9kZWxDbGFzczogQWNjb3VudC5kZWZhdWx0LFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ2V4cGVuc2VzLnBheW1lbnRBY2NvdW50SWQnLFxuICAgICAgICAgIHRvOiAnYWNjb3VudHMuaWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcblxuICAgICAgZXhwZW5zZUFjY291bnQ6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkJlbG9uZ3NUb09uZVJlbGF0aW9uLFxuICAgICAgICBtb2RlbENsYXNzOiBBY2NvdW50LmRlZmF1bHQsXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAnZXhwZW5zZXMuZXhwZW5zZUFjY291bnRJZCcsXG4gICAgICAgICAgdG86ICdhY2NvdW50cy5pZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuXG4gICAgICB1c2VyOiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5CZWxvbmdzVG9PbmVSZWxhdGlvbixcbiAgICAgICAgbW9kZWxDbGFzczogVXNlci5kZWZhdWx0LFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ2V4cGVuc2VzLnVzZXJJZCcsXG4gICAgICAgICAgdG86ICd1c2Vycy5pZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cbiIsImltcG9ydCB7IE1vZGVsIH0gZnJvbSAnb2JqZWN0aW9uJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEJhc2VNb2RlbCBmcm9tICdAL21vZGVscy9Nb2RlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEl0ZW0gZXh0ZW5kcyBCYXNlTW9kZWwge1xuICAvKipcbiAgICogVGFibGUgbmFtZVxuICAgKi9cbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICdpdGVtcyc7XG4gIH1cblxuICAvKipcbiAgICogUmVsYXRpb25zaGlwIG1hcHBpbmcuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHJlbGF0aW9uTWFwcGluZ3MoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8qKlxuICAgICAgICogSXRlbSBtYXkgaGFzIG1hbnkgbWV0YSBkYXRhLlxuICAgICAgICovXG4gICAgICBtZXRhZGF0YToge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuSGFzTWFueVJlbGF0aW9uLFxuICAgICAgICBtb2RlbEJhc2U6IHBhdGguam9pbihfX2Rpcm5hbWUsICdJdGVtTWV0YWRhdGEnKSxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICdpdGVtcy5pZCcsXG4gICAgICAgICAgdG86ICdpdGVtc19tZXRhZGF0YS5pdGVtX2lkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogSXRlbSBtYXkgYmVsb25ncyB0byBjYXRlb2dvcnkgbW9kZWwuXG4gICAgICAgKi9cbiAgICAgIGNhdGVnb3J5OiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5CZWxvbmdzVG9PbmVSZWxhdGlvbixcbiAgICAgICAgbW9kZWxCYXNlOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnSXRlbUNhdGVnb3J5JyksXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAnaXRlbXMuY2F0ZWdvcnlJZCcsXG4gICAgICAgICAgdG86ICdpdGVtc19jYXRlZ29yaWVzLmlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJ29iamVjdGlvbic7XG5pbXBvcnQgQmFzZU1vZGVsIGZyb20gJ0AvbW9kZWxzL01vZGVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXRlbUNhdGVnb3J5IGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWUuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ2l0ZW1zX2NhdGVnb3JpZXMnO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGF0aW9uc2hpcCBtYXBwaW5nLlxuICAgKi9cbiAgc3RhdGljIGdldCByZWxhdGlvbk1hcHBpbmdzKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvKipcbiAgICAgICAqIEl0ZW0gY2F0ZWdvcnkgbWF5IGhhcyBtYW55IGl0ZW1zLlxuICAgICAgICovXG4gICAgICBpdGVtczoge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuSGFzTWFueVJlbGF0aW9uLFxuICAgICAgICBtb2RlbEJhc2U6IHBhdGguam9pbihfX2Rpcm5hbWUsICdJdGVtJyksXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAnaXRlbXNfY2F0ZWdvcmllcy5pdGVtX2lkJyxcbiAgICAgICAgICB0bzogJ2l0ZW1zLmlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VNb2RlbCBmcm9tICdAL21vZGVscy9Nb2RlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEpvdXJuYWxFbnRyeSBleHRlbmRzIEJhc2VNb2RlbCB7XG4gIC8qKlxuICAgKiBUYWJsZSBuYW1lLlxuICAgKi9cbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICdtYW51YWxfam91cm5hbHMnO1xuICB9XG59XG4iLCJpbXBvcnQgeyBNb2RlbCB9IGZyb20gJ29iamVjdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vZGVsQmFzZSBleHRlbmRzIE1vZGVsIHtcblxuICBzdGF0aWMgZ2V0IGNvbGxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIEFycmF5O1xuICB9XG5cbiAgc3RhdGljIHF1ZXJ5KC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gc3VwZXIucXVlcnkoLi4uYXJncykucnVuQWZ0ZXIoKHJlc3VsdCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5mcm9tKHJlc3VsdCk7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IG1peGluIH0gZnJvbSAnb2JqZWN0aW9uJztcbmltcG9ydCBCYXNlTW9kZWwgZnJvbSAnQC9tb2RlbHMvTW9kZWwnO1xuaW1wb3J0IE1ldGFibGVDb2xsZWN0aW9uIGZyb20gJ0AvbGliL01ldGFibGUvTWV0YWJsZUNvbGxlY3Rpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPcHRpb24gZXh0ZW5kcyBtaXhpbihCYXNlTW9kZWwsIFttaXhpbl0pIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWUuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ29wdGlvbnMnO1xuICB9XG5cbiAgc3RhdGljIGdldCBjb2xsZWN0aW9uKCkge1xuICAgIHJldHVybiBNZXRhYmxlQ29sbGVjdGlvbjtcbiAgfVxufVxuIiwiaW1wb3J0IE1vZGVsIGZyb20gJ0AvbW9kZWxzL01vZGVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFzc3dvcmRSZXNldHMgZXh0ZW5kcyBNb2RlbCB7XG4gIC8qKlxuICAgKiBUYWJsZSBuYW1lXG4gICAqL1xuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3Bhc3N3b3JkX3Jlc2V0cyc7XG4gIH1cbn1cbiIsImltcG9ydCB7IE1vZGVsIH0gZnJvbSAnb2JqZWN0aW9uJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEJhc2VNb2RlbCBmcm9tICdAL21vZGVscy9Nb2RlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBlcm1pc3Npb24gZXh0ZW5kcyBCYXNlTW9kZWwge1xuICAvKipcbiAgICogVGFibGUgbmFtZSBvZiBSb2xlIG1vZGVsLlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICdwZXJtaXNzaW9ucyc7XG4gIH1cblxuICAvKipcbiAgICogUmVsYXRpb25zaGlwIG1hcHBpbmcuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHJlbGF0aW9uTWFwcGluZ3MoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8qKlxuICAgICAgICogUGVybWlzc2lvbiBtb2RlbCBtYXkgYmVsb25ncyB0byByb2xlIG1vZGVsLlxuICAgICAgICovXG4gICAgICByb2xlOiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5CZWxvbmdzVG9PbmVSZWxhdGlvbixcbiAgICAgICAgbW9kZWxCYXNlOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnUm9sZScpLFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ3Blcm1pc3Npb25zLnJvbGVfaWQnLFxuICAgICAgICAgIHRvOiAncm9sZXMuaWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcblxuICAgICAgLy8gcmVzb3VyY2U6IHtcbiAgICAgIC8vICAgcmVsYXRpb246IE1vZGVsLkJlbG9uZ3NUb09uZVJlbGF0aW9uLFxuICAgICAgLy8gICBtb2RlbEJhc2U6IHBhdGguam9pbihfX2Rpcm5hbWUsICdSZXNvdXJjZScpLFxuICAgICAgLy8gICBqb2luOiB7XG4gICAgICAvLyAgICAgZnJvbTogJ3Blcm1pc3Npb25zLicsXG4gICAgICAvLyAgICAgdG86ICcnLFxuICAgICAgLy8gICB9XG4gICAgICAvLyB9XG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJ29iamVjdGlvbic7XG5pbXBvcnQgQmFzZU1vZGVsIGZyb20gJ0AvbW9kZWxzL01vZGVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVzb3VyY2UgZXh0ZW5kcyBCYXNlTW9kZWwge1xuICAvKipcbiAgICogVGFibGUgbmFtZS5cbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAncmVzb3VyY2VzJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaW1lc3RhbXAgY29sdW1ucy5cbiAgICovXG4gIHN0YXRpYyBnZXQgaGFzVGltZXN0YW1wcygpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVsYXRpb25zaGlwIG1hcHBpbmcuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHJlbGF0aW9uTWFwcGluZ3MoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8qKlxuICAgICAgICogUmVzb3VyY2UgbW9kZWwgbWF5IGhhcyBtYW55IHZpZXdzLlxuICAgICAgICovXG4gICAgICB2aWV3czoge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuSGFzTWFueVJlbGF0aW9uLFxuICAgICAgICBtb2RlbEJhc2U6IHBhdGguam9pbihfX2Rpcm5hbWUsICdWaWV3JyksXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAncmVzb3VyY2VzLmlkJyxcbiAgICAgICAgICB0bzogJ3ZpZXdzLnJlc291cmNlX2lkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogUmVzb3VyY2UgbW9kZWwgbWF5IGhhcyBtYW55IGZpZWxkcy5cbiAgICAgICAqL1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5IYXNNYW55UmVsYXRpb24sXG4gICAgICAgIG1vZGVsQmFzZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ1Jlc291cmNlRmllbGQnKSxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICdyZXNvdXJjZXMuaWQnLFxuICAgICAgICAgIHRvOiAndmlld3MucmVzb3VyY2VfaWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBSZXNvdXJjZSBtb2RlbCBtYXkgaGFzIG1hbnkgYXNzb2NpYXRlZCBwZXJtaXNzaW9ucy5cbiAgICAgICAqL1xuICAgICAgcGVybWlzc2lvbnM6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLk1hbnlUb01hbnlSZWxhdGlvbixcbiAgICAgICAgbW9kZWxCYXNlOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnUGVybWlzc2lvbicpLFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ3Jlc291cmNlcy5pZCcsXG4gICAgICAgICAgdGhyb3VnaDoge1xuICAgICAgICAgICAgZnJvbTogJ3JvbGVfaGFzX3Blcm1pc3Npb25zLnJlc291cmNlX2lkJyxcbiAgICAgICAgICAgIHRvOiAncm9sZV9oYXNfcGVybWlzc2lvbnMucGVybWlzc2lvbl9pZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0bzogJ3Blcm1pc3Npb25zLmlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgc25ha2VDYXNlIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnb2JqZWN0aW9uJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEJhc2VNb2RlbCBmcm9tICdAL21vZGVscy9Nb2RlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc291cmNlRmllbGQgZXh0ZW5kcyBCYXNlTW9kZWwge1xuICAvKipcbiAgICogVGFibGUgbmFtZS5cbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAncmVzb3VyY2VfZmllbGRzJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaW1lc3RhbXAgY29sdW1ucy5cbiAgICovXG4gIHN0YXRpYyBnZXQgaGFzVGltZXN0YW1wcygpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogVmlydHVhbCBhdHRyaWJ1dGVzLlxuICAgKi9cbiAgc3RhdGljIGdldCB2aXJ0dWFsQXR0cmlidXRlcygpIHtcbiAgICByZXR1cm4gWydrZXknXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNvdXJjZSBmaWVsZCBrZXkuXG4gICAqL1xuICBrZXkoKSB7XG4gICAgcmV0dXJuIHNuYWtlQ2FzZSh0aGlzLmxhYmVsTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVsYXRpb25zaGlwIG1hcHBpbmcuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHJlbGF0aW9uTWFwcGluZ3MoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8qKlxuICAgICAgICogUmVzb3VyY2UgZmllbGQgbWF5IGJlbG9uZ3MgdG8gcmVzb3VyY2UgbW9kZWwuXG4gICAgICAgKi9cbiAgICAgIHJlc291cmNlOiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5CZWxvbmdzVG9PbmVSZWxhdGlvbixcbiAgICAgICAgbW9kZWxCYXNlOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnUmVzb3VyY2UnKSxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICdyZXNvdXJjZV9maWVsZHMucmVzb3VyY2VfaWQnLFxuICAgICAgICAgIHRvOiAncmVzb3VyY2VzLmlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTW9kZWwgfSBmcm9tICdvYmplY3Rpb24nO1xuaW1wb3J0IEJhc2VNb2RlbCBmcm9tICdAL21vZGVscy9Nb2RlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvbGUgZXh0ZW5kcyBCYXNlTW9kZWwge1xuICAvKipcbiAgICogVGFibGUgbmFtZSBvZiBSb2xlIG1vZGVsLlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICdyb2xlcyc7XG4gIH1cblxuICAvKipcbiAgICogVGltZXN0YW1wIGNvbHVtbnMuXG4gICAqL1xuICBzdGF0aWMgZ2V0IGhhc1RpbWVzdGFtcHMoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGF0aW9uc2hpcCBtYXBwaW5nLlxuICAgKi9cbiAgc3RhdGljIGdldCByZWxhdGlvbk1hcHBpbmdzKCkge1xuICAgIGNvbnN0IFBlcm1pc3Npb24gPSByZXF1aXJlKCdAL21vZGVscy9QZXJtaXNzaW9uJyk7XG4gICAgY29uc3QgUmVzb3VyY2UgPSByZXF1aXJlKCdAL21vZGVscy9SZXNvdXJjZScpO1xuICAgIGNvbnN0IFVzZXIgPSByZXF1aXJlKCdAL21vZGVscy9Vc2VyJyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLyoqXG4gICAgICAgKiBSb2xlIG1heSBoYXMgbWFueSBwZXJtaXNzaW9ucy5cbiAgICAgICAqL1xuICAgICAgcGVybWlzc2lvbnM6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLk1hbnlUb01hbnlSZWxhdGlvbixcbiAgICAgICAgbW9kZWxDbGFzczogUGVybWlzc2lvbi5kZWZhdWx0LFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ3JvbGVzLmlkJyxcbiAgICAgICAgICB0aHJvdWdoOiB7XG4gICAgICAgICAgICBmcm9tOiAncm9sZV9oYXNfcGVybWlzc2lvbnMucm9sZUlkJyxcbiAgICAgICAgICAgIHRvOiAncm9sZV9oYXNfcGVybWlzc2lvbnMucGVybWlzc2lvbklkJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRvOiAncGVybWlzc2lvbnMuaWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBSb2xlIG1heSBoYXMgbWFueSByZXNvdXJjZXMuXG4gICAgICAgKi9cbiAgICAgIHJlc291cmNlczoge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuTWFueVRvTWFueVJlbGF0aW9uLFxuICAgICAgICBtb2RlbENsYXNzOiBSZXNvdXJjZS5kZWZhdWx0LFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ3JvbGVzLmlkJyxcbiAgICAgICAgICB0aHJvdWdoOiB7XG4gICAgICAgICAgICBmcm9tOiAncm9sZV9oYXNfcGVybWlzc2lvbnMucm9sZUlkJyxcbiAgICAgICAgICAgIHRvOiAncm9sZV9oYXNfcGVybWlzc2lvbnMucmVzb3VyY2VJZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0bzogJ3Jlc291cmNlcy5pZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFJvbGUgbWF5IGhhcyBtYW55IGFzc29jaWF0ZWQgdXNlcnMuXG4gICAgICAgKi9cbiAgICAgIHVzZXJzOiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5NYW55VG9NYW55UmVsYXRpb24sXG4gICAgICAgIG1vZGVsQ2xhc3M6IFVzZXIuZGVmYXVsdCxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICdyb2xlcy5pZCcsXG4gICAgICAgICAgdGhyb3VnaDoge1xuICAgICAgICAgICAgZnJvbTogJ3VzZXJfaGFzX3JvbGVzLnJvbGVJZCcsXG4gICAgICAgICAgICB0bzogJ3VzZXJfaGFzX3JvbGVzLnVzZXJJZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0bzogJ3VzZXJzLmlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHRqcyc7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJ29iamVjdGlvbic7XG5pbXBvcnQgQmFzZU1vZGVsIGZyb20gJ0AvbW9kZWxzL01vZGVsJztcbi8vIGltcG9ydCBQZXJtaXNzaW9uc1NlcnZpY2UgZnJvbSAnQC9zZXJ2aWNlcy9QZXJtaXNzaW9uc1NlcnZpY2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVc2VyIGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLy8gLi4uUGVybWlzc2lvbnNTZXJ2aWNlXG5cbiAgLyoqXG4gICAqIFRhYmxlIG5hbWVcbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAndXNlcnMnO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGF0aW9uc2hpcCBtYXBwaW5nLlxuICAgKi9cbiAgc3RhdGljIGdldCByZWxhdGlvbk1hcHBpbmdzKCkge1xuICAgIGNvbnN0IFJvbGUgPSByZXF1aXJlKCdAL21vZGVscy9Sb2xlJyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgcm9sZXM6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLk1hbnlUb01hbnlSZWxhdGlvbixcbiAgICAgICAgbW9kZWxDbGFzczogUm9sZS5kZWZhdWx0LFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ3VzZXJzLmlkJyxcbiAgICAgICAgICB0aHJvdWdoOiB7XG4gICAgICAgICAgICBmcm9tOiAndXNlcl9oYXNfcm9sZXMudXNlcklkJyxcbiAgICAgICAgICAgIHRvOiAndXNlcl9oYXNfcm9sZXMucm9sZUlkJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRvOiAncm9sZXMuaWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFZlcmlmeSB0aGUgcGFzc3dvcmQgb2YgdGhlIHVzZXIuXG4gICAqIEBwYXJhbSAge1N0cmluZ30gcGFzc3dvcmQgLSBUaGUgZ2l2ZW4gcGFzc3dvcmQuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICB2ZXJpZnlQYXNzd29yZChwYXNzd29yZCkge1xuICAgIHJldHVybiBiY3J5cHQuY29tcGFyZVN5bmMocGFzc3dvcmQsIHRoaXMucGFzc3dvcmQpO1xuICB9XG59XG4iLCJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnb2JqZWN0aW9uJztcbmltcG9ydCBCYXNlTW9kZWwgZnJvbSAnQC9tb2RlbHMvTW9kZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWUuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3ZpZXdzJztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxhdGlvbnNoaXAgbWFwcGluZy5cbiAgICovXG4gIHN0YXRpYyBnZXQgcmVsYXRpb25NYXBwaW5ncygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLyoqXG4gICAgICAgKiBWaWV3IG1vZGVsIGJlbG9uZ3MgdG8gcmVzb3VyY2UgbW9kZWwuXG4gICAgICAgKi9cbiAgICAgIHJlc291cmNlOiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5CZWxvbmdzVG9PbmVSZWxhdGlvbixcbiAgICAgICAgbW9kZWxCYXNlOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnUmVzb3VyY2UnKSxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICd2aWV3cy5yZXNvdXJjZV9pZCcsXG4gICAgICAgICAgdG86ICdyZXNvdXJjZXMuaWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBWaWV3IG1vZGVsIG1heSBoYXMgbWFueSBjb2x1bW5zLlxuICAgICAgICovXG4gICAgICAvLyBjb2x1bW5zOiB7XG4gICAgICAvLyAgIHJlbGF0aW9uOiBNb2RlbC5NYW55VG9NYW55UmVsYXRpb24sXG4gICAgICAvLyAgIG1vZGVsQmFzZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ1Jlc291cmNlRmllbGQnKSxcbiAgICAgIC8vICAgam9pbjoge1xuICAgICAgLy8gICAgIGZyb206ICdpZCcsXG4gICAgICAvLyAgICAgdGhyb3VnaDoge1xuICAgICAgLy8gICAgICAgZnJvbTogJ3ZpZXdfaGFzX2NvbHVtbnMudmlld19pZCcsXG4gICAgICAvLyAgICAgICB0bzogJ3ZpZXdfaGFzX2NvbHVtbnMuZmllbGRfaWQnLFxuICAgICAgLy8gICAgIH0sXG4gICAgICAvLyAgICAgdG86ICdyZXNvdXJjZV9maWVsZHMudmlld19pZCcsXG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBWaWV3IG1vZGVsIG1heSBoYXMgbWFueSB2aWV3IHJvbGVzLlxuICAgICAgICovXG4gICAgICB2aWV3Um9sZXM6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkhhc01hbnlSZWxhdGlvbixcbiAgICAgICAgbW9kZWxCYXNlOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnVmlld1JvbGUnKSxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICd2aWV3cy5pZCcsXG4gICAgICAgICAgdG86ICd2aWV3X2lkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIC8vIGNvbHVtbnMoKSB7XG4gIC8vICAgcmV0dXJuIHRoaXMuYmVsb25nc1RvTWFueSgnUmVzb3VyY2VGaWVsZCcsICd2aWV3X2hhc19jb2x1bW5zJywgJ3ZpZXdfaWQnLCAnZmllbGRfaWQnKTtcbiAgLy8gfSxcblxuICAvLyB2aWV3Um9sZXMoKSB7XG4gIC8vICAgcmV0dXJuIHRoaXMuaGFzTWFueSgnVmlld1JvbGUnLCAndmlld19pZCcpO1xuICAvLyB9LFxufVxuIiwiaW1wb3J0IHsgTW9kZWwgfSBmcm9tICdvYmplY3Rpb24nO1xuaW1wb3J0IGtuZXggZnJvbSAnQC9kYXRhYmFzZS9rbmV4JztcblxuLy8gQmluZCBhbGwgTW9kZWxzIHRvIGEga25leCBpbnN0YW5jZS4gSWYgeW91IG9ubHkgaGF2ZSBvbmUgZGF0YWJhc2UgaW5cbi8vIHlvdXIgc2VydmVyIHRoaXMgaXMgYWxsIHlvdSBoYXZlIHRvIGRvLiBGb3IgbXVsdGkgZGF0YWJhc2Ugc3lzdGVtcywgc2VlXG4vLyB0aGUgTW9kZWwuYmluZEtuZXgoKSBtZXRob2QuXG5Nb2RlbC5rbmV4KGtuZXgpO1xuIiwiaW1wb3J0IGVycm9ySGFuZGxlciBmcm9tICdlcnJvcmhhbmRsZXInO1xuaW1wb3J0IGFwcCBmcm9tICdAL2FwcCc7XG5cbmFwcC51c2UoZXJyb3JIYW5kbGVyKTtcblxuY29uc3Qgc2VydmVyID0gYXBwLmxpc3RlbihhcHAuZ2V0KCdwb3J0JyksICgpID0+IHtcbiAgY29uc29sZS5sb2coXG4gICAgJyAgQXBwIGlzIHJ1bm5pbmcgYXQgaHR0cDovL2xvY2FsaG9zdDolZCBpbiAlcyBtb2RlJyxcbiAgICBhcHAuZ2V0KCdwb3J0JyksXG4gICAgYXBwLmdldCgnZW52JyksXG4gICk7XG4gIGNvbnNvbGUubG9nKCcgIFByZXNzIENUUkwtQyB0byBzdG9wJyk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgc2VydmVyO1xuIiwiXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKb3VybmFsRW50cnkge1xuICBjb25zdHJ1Y3RvcihlbnRyeSkge1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgY3JlZGl0OiAwLFxuICAgICAgZGViaXQ6IDAsXG4gICAgfTtcbiAgICB0aGlzLmVudHJ5ID0geyAuLi5kZWZhdWx0cywgLi4uZW50cnkgfTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgcGljayB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgSm91cm5hbEVudHJ5IGZyb20gJ0Avc2VydmljZXMvQWNjb3VudGluZy9Kb3VybmFsRW50cnknO1xuaW1wb3J0IEFjY291bnRUcmFuc2FjdGlvbiBmcm9tICdAL21vZGVscy9BY2NvdW50VHJhbnNhY3Rpb24nO1xuaW1wb3J0IEFjY291bnRCYWxhbmNlIGZyb20gJ0AvbW9kZWxzL0FjY291bnRCYWxhbmNlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSm91cm5hbFBvc3RlciB7XG4gIC8qKlxuICAgKiBKb3VybmFsIHBvc3RlciBjb25zdHJ1Y3Rvci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW50cmllcyA9IFtdO1xuICAgIHRoaXMuYmFsYW5jZXNDaGFuZ2UgPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcml0ZXMgdGhlIGNyZWRpdCBlbnRyeSBmb3IgdGhlIGdpdmVuIGFjY291bnQuXG4gICAqIEBwYXJhbSB7Sm91cm5hbEVudHJ5fSBlbnRyeSAtXG4gICAqL1xuICBjcmVkaXQoZW50cnlNb2RlbCkge1xuICAgIGlmIChlbnRyeU1vZGVsIGluc3RhbmNlb2YgSm91cm5hbEVudHJ5ID09PSBmYWxzZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgZW50cnkgaXMgbm90IGluc3RhbmNlIG9mIEpvdXJuYWxFbnRyeS4nKTtcbiAgICB9XG4gICAgdGhpcy5lbnRyaWVzLnB1c2goZW50cnlNb2RlbC5lbnRyeSk7XG4gICAgdGhpcy5zZXRBY2NvdW50QmFsYW5jZUNoYW5nZShlbnRyeU1vZGVsLmVudHJ5LCAnY3JlZGl0Jyk7XG4gIH1cblxuICAvKipcbiAgICogV3JpdGVzIHRoZSBkZWJpdCBlbnRyeSBmb3IgdGhlIGdpdmVuIGFjY291bnQuXG4gICAqIEBwYXJhbSB7Sm91cm5hbEVudHJ5fSBlbnRyeSAtXG4gICAqL1xuICBkZWJpdChlbnRyeU1vZGVsKSB7XG4gICAgaWYgKGVudHJ5TW9kZWwgaW5zdGFuY2VvZiBKb3VybmFsRW50cnkgPT09IGZhbHNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBlbnRyeSBpcyBub3QgaW5zdGFuY2Ugb2YgSm91cm5hbEVudHJ5LicpO1xuICAgIH1cbiAgICB0aGlzLmVudHJpZXMucHVzaChlbnRyeU1vZGVsLmVudHJ5KTtcbiAgICB0aGlzLnNldEFjY291bnRCYWxhbmNlQ2hhbmdlKGVudHJ5TW9kZWwuZW50cnksICdkZWJpdCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYWNjb3VudCBiYWxhbmNlIGNoYW5nZS5cbiAgICogQHBhcmFtIHtKb3VybmFsRW50cnl9IGVudHJ5XG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gICAqL1xuICBzZXRBY2NvdW50QmFsYW5jZUNoYW5nZShlbnRyeSwgdHlwZSkge1xuICAgIGlmICghdGhpcy5iYWxhbmNlc0NoYW5nZVtlbnRyeS5hY2NvdW50XSkge1xuICAgICAgdGhpcy5iYWxhbmNlc0NoYW5nZVtlbnRyeS5hY2NvdW50XSA9IDA7XG4gICAgfVxuICAgIGxldCBjaGFuZ2UgPSAwO1xuXG4gICAgaWYgKGVudHJ5LmFjY291bnROb3JtYWwgPT09ICdjcmVkaXQnKSB7XG4gICAgICBjaGFuZ2UgPSAodHlwZSA9PT0gJ2NyZWRpdCcpID8gZW50cnkuY3JlZGl0IDogLTEgKiBlbnRyeS5kZWJpdDtcbiAgICB9IGVsc2UgaWYgKGVudHJ5LmFjY291bnROb3JtYWwgPT09ICdkZWJpdCcpIHtcbiAgICAgIGNoYW5nZSA9ICh0eXBlID09PSAnZGViaXQnKSA/IGVudHJ5LmRlYml0IDogLTEgKiBlbnRyeS5jcmVkaXQ7XG4gICAgfVxuICAgIHRoaXMuYmFsYW5jZXNDaGFuZ2VbZW50cnkuYWNjb3VudF0gKz0gY2hhbmdlO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcHBpbmcgdGhlIGJhbGFuY2UgY2hhbmdlIHRvIGxpc3QuXG4gICAqL1xuICBtYXBCYWxhbmNlQ2hhbmdlc1RvTGlzdCgpIHtcbiAgICBjb25zdCBtYXBwZWRMaXN0ID0gW107XG5cbiAgICBPYmplY3Qua2V5cyh0aGlzLmJhbGFuY2VzQ2hhbmdlKS5mb3JFYWNoKChhY2NvdW50SWQpID0+IHtcbiAgICAgIGNvbnN0IGJhbGFuY2UgPSB0aGlzLmJhbGFuY2VzQ2hhbmdlW2FjY291bnRJZF07XG5cbiAgICAgIG1hcHBlZExpc3QucHVzaCh7XG4gICAgICAgIGFjY291bnRfaWQ6IGFjY291bnRJZCxcbiAgICAgICAgYW1vdW50OiBiYWxhbmNlLFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG1hcHBlZExpc3Q7XG4gIH1cblxuICAvKipcbiAgICogU2F2ZXMgdGhlIGJhbGFuY2UgY2hhbmdlIG9mIGpvdXJuYWwgZW50cmllcy5cbiAgICovXG4gIGFzeW5jIHNhdmVCYWxhbmNlKCkge1xuICAgIGNvbnN0IGJhbGFuY2VzTGlzdCA9IHRoaXMubWFwQmFsYW5jZUNoYW5nZXNUb0xpc3QoKTtcbiAgICBjb25zdCBiYWxhbmNlVXBkYXRlT3BlcnMgPSBbXTtcbiAgICBjb25zdCBiYWxhbmNlSW5zZXJ0T3BlcnMgPSBbXTtcbiAgICBjb25zdCBiYWxhbmNlRmluZE9uZU9wZXJzID0gW107XG4gICAgbGV0IGJhbGFuY2VBY2NvdW50cyA9IFtdO1xuXG4gICAgYmFsYW5jZXNMaXN0LmZvckVhY2goKGJhbGFuY2UpID0+IHtcbiAgICAgIGNvbnN0IG9wZXIgPSBBY2NvdW50QmFsYW5jZS5xdWVyeSgpLmZpbmRPbmUoJ2FjY291bnRfaWQnLCBiYWxhbmNlLmFjY291bnRfaWQpO1xuICAgICAgYmFsYW5jZUZpbmRPbmVPcGVycy5wdXNoKG9wZXIpO1xuICAgIH0pO1xuICAgIGJhbGFuY2VBY2NvdW50cyA9IGF3YWl0IFByb21pc2UuYWxsKGJhbGFuY2VGaW5kT25lT3BlcnMpO1xuXG4gICAgYmFsYW5jZXNMaXN0LmZvckVhY2goKGJhbGFuY2UpID0+IHtcbiAgICAgIGNvbnN0IG1ldGhvZCA9IGJhbGFuY2UuYW1vdW50IDwgMCA/ICdkZWNyZW1lbnQnIDogJ2luY3JlbWVudCc7XG5cbiAgICAgIC8vIERldGFybWluZSBpZiB0aGUgYWNjb3VudCBiYWxhbmNlIGlzIGFscmVhZHkgZXhpc3RzIG9yIG5vdC5cbiAgICAgIGNvbnN0IGZvdW5kQWNjQmFsYW5jZSA9IGJhbGFuY2VBY2NvdW50cy5zb21lKChhY2NvdW50KSA9PiAoXG4gICAgICAgIGFjY291bnQgJiYgYWNjb3VudC5hY2NvdW50X2lkID09PSBiYWxhbmNlLmFjY291bnRfaWRcbiAgICAgICkpO1xuICAgICAgaWYgKGZvdW5kQWNjQmFsYW5jZSkge1xuICAgICAgICBjb25zdCBxdWVyeSA9IEFjY291bnRCYWxhbmNlXG4gICAgICAgICAgLnF1ZXJ5KClbbWV0aG9kXSgnYW1vdW50JywgTWF0aC5hYnMoYmFsYW5jZS5hbW91bnQpKVxuICAgICAgICAgIC53aGVyZSgnYWNjb3VudF9pZCcsIGJhbGFuY2UuYWNjb3VudF9pZCk7XG5cbiAgICAgICAgYmFsYW5jZVVwZGF0ZU9wZXJzLnB1c2gocXVlcnkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcXVlcnkgPSBBY2NvdW50QmFsYW5jZS5xdWVyeSgpLmluc2VydCh7XG4gICAgICAgICAgYWNjb3VudF9pZDogYmFsYW5jZS5hY2NvdW50X2lkLFxuICAgICAgICAgIGFtb3VudDogYmFsYW5jZS5hbW91bnQsXG4gICAgICAgICAgY3VycmVuY3lfY29kZTogJ1VTRCcsXG4gICAgICAgIH0pO1xuICAgICAgICBiYWxhbmNlSW5zZXJ0T3BlcnMucHVzaChxdWVyeSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgLi4uYmFsYW5jZVVwZGF0ZU9wZXJzLCAuLi5iYWxhbmNlSW5zZXJ0T3BlcnMsXG4gICAgXSk7XG4gIH1cblxuICAvKipcbiAgICogU2F2ZXMgdGhlIHN0YWNrZWQgam91cm5hbCBlbnRyaWVzIHRvIHRoZSBzdG9yYWdlLlxuICAgKi9cbiAgYXN5bmMgc2F2ZUVudHJpZXMoKSB7XG4gICAgY29uc3Qgc2F2ZU9wZXJhdGlvbnMgPSBbXTtcblxuICAgIHRoaXMuZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgY29uc3Qgb3BlciA9IEFjY291bnRUcmFuc2FjdGlvbi5xdWVyeSgpLmluc2VydCh7XG4gICAgICAgIGFjY291bnRJZDogZW50cnkuYWNjb3VudCxcbiAgICAgICAgLi4ucGljayhlbnRyeSwgWydjcmVkaXQnLCAnZGViaXQnLCAndHJhbnNhY3Rpb25UeXBlJyxcbiAgICAgICAgICAncmVmZXJlbmNlVHlwZScsICdyZWZlcmVuY2VJZCcsICdub3RlJ10pLFxuICAgICAgfSk7XG4gICAgICBzYXZlT3BlcmF0aW9ucy5wdXNoKG9wZXIpO1xuICAgIH0pO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKHNhdmVPcGVyYXRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXZlcnNlcyB0aGUgc3RhY2tlZCBqb3VybmFsIGVudHJpZXMuXG4gICAqL1xuICByZXZlcnNlRW50cmllcygpIHtcbiAgICBjb25zdCByZXZlcnNlRW50cmllcyA9IFtdO1xuXG4gICAgdGhpcy5lbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBjb25zdCByZXZlcnNlRW50cnkgPSB7IC4uLmVudHJ5IH07XG5cbiAgICAgIGlmIChlbnRyeS5jcmVkaXQpIHtcbiAgICAgICAgcmV2ZXJzZUVudHJ5LmRlYml0ID0gZW50cnkuY3JlZGl0O1xuICAgICAgfVxuICAgICAgaWYgKGVudHJ5LmRlYml0KSB7XG4gICAgICAgIHJldmVyc2VFbnRyeS5jcmVkaXQgPSBlbnRyeS5kZWJpdDtcbiAgICAgIH1cbiAgICAgIHJldmVyc2VFbnRyaWVzLnB1c2gocmV2ZXJzZUVudHJ5KTtcbiAgICB9KTtcbiAgICB0aGlzLmVudHJpZXMgPSByZXZlcnNlRW50cmllcztcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgdGhlIGdpdmVuIG9yIGFsbCBzdGFja2VkIGVudHJpZXMuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGlkcyAtXG4gICAqL1xuICBhc3luYyBkZWxldGVFbnRyaWVzKGlkcykge1xuICAgIGNvbnN0IGVudHJpZXNJZHMgPSBpZHMgfHwgdGhpcy5lbnRyaWVzLm1hcCgoZSkgPT4gZS5pZCk7XG5cbiAgICBpZiAoZW50cmllc0lkcy5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCBBY2NvdW50VHJhbnNhY3Rpb24ucXVlcnkoKS53aGVyZUluKCdpZCcsIGVudHJpZXNJZHMpLmRlbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgY2xvc2luZyBiYWxhbmNlIGZvciB0aGUgZ2l2ZW4gYWNjb3VudCBhbmQgY2xvc2luZyBkYXRlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gYWNjb3VudElkIC1cbiAgICogQHBhcmFtIHtEYXRlfSBjbG9zaW5nRGF0ZSAtXG4gICAqL1xuICBnZXRDbG9zaW5nQmFsYW5jZShhY2NvdW50SWQsIGNsb3NpbmdEYXRlLCBkYXRlVHlwZSA9ICdkYXknKSB7XG4gICAgbGV0IGNsb3NpbmdCYWxhbmNlID0gMDtcbiAgICBjb25zdCBtb21lbnRDbG9zaW5nRGF0ZSA9IG1vbWVudChjbG9zaW5nRGF0ZSk7XG5cbiAgICB0aGlzLmVudHJpZXMuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgIC8vIENhbiBub3QgY29udGludWUgaWYgbm90IGJlZm9yZSBvciBldmVudCBzYW1lIGNsb3NpbmcgZGF0ZS5cbiAgICAgIGlmICgoIW1vbWVudENsb3NpbmdEYXRlLmlzQWZ0ZXIoZW50cnkuZGF0ZSwgZGF0ZVR5cGUpXG4gICAgICAgICYmICFtb21lbnRDbG9zaW5nRGF0ZS5pc1NhbWUoZW50cnkuZGF0ZSwgZGF0ZVR5cGUpKVxuICAgICAgICB8fCAoZW50cnkuYWNjb3VudCAhPT0gYWNjb3VudElkICYmIGFjY291bnRJZCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGVudHJ5LmFjY291bnROb3JtYWwgPT09ICdjcmVkaXQnKSB7XG4gICAgICAgIGNsb3NpbmdCYWxhbmNlICs9IChlbnRyeS5jcmVkaXQpID8gZW50cnkuY3JlZGl0IDogLTEgKiBlbnRyeS5kZWJpdDtcbiAgICAgIH0gZWxzZSBpZiAoZW50cnkuYWNjb3VudE5vcm1hbCA9PT0gJ2RlYml0Jykge1xuICAgICAgICBjbG9zaW5nQmFsYW5jZSArPSAoZW50cnkuZGViaXQpID8gZW50cnkuZGViaXQgOiAtMSAqIGVudHJ5LmNyZWRpdDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gY2xvc2luZ0JhbGFuY2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGNyZWRpdC9kZWJpdCBzdW1hdGlvbiBmb3IgdGhlIGdpdmVuIGFjY291bnQgYW5kIGRhdGUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhY2NvdW50IC1cbiAgICogQHBhcmFtIHtEYXRlfFN0cmluZ30gY2xvc2luZ0RhdGUgLVxuICAgKi9cbiAgZ2V0VHJpYWxCYWxhbmNlKGFjY291bnRJZCwgY2xvc2luZ0RhdGUsIGRhdGVUeXBlKSB7XG4gICAgY29uc3QgbW9tZW50Q2xvc2luZ0RhdGUgPSBtb21lbnQoY2xvc2luZ0RhdGUpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgIGNyZWRpdDogMCxcbiAgICAgIGRlYml0OiAwLFxuICAgICAgYmFsYW5jZTogMCxcbiAgICB9O1xuICAgIHRoaXMuZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgaWYgKCghbW9tZW50Q2xvc2luZ0RhdGUuaXNBZnRlcihlbnRyeS5kYXRlLCBkYXRlVHlwZSlcbiAgICAgICAgJiYgIW1vbWVudENsb3NpbmdEYXRlLmlzU2FtZShlbnRyeS5kYXRlLCBkYXRlVHlwZSkpXG4gICAgICAgIHx8IChlbnRyeS5hY2NvdW50ICE9PSBhY2NvdW50SWQgJiYgYWNjb3VudElkKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXN1bHQuY3JlZGl0ICs9IGVudHJ5LmNyZWRpdDtcbiAgICAgIHJlc3VsdC5kZWJpdCArPSBlbnRyeS5kZWJpdDtcblxuICAgICAgaWYgKGVudHJ5LmFjY291bnROb3JtYWwgPT09ICdjcmVkaXQnKSB7XG4gICAgICAgIHJlc3VsdC5iYWxhbmNlICs9IChlbnRyeS5jcmVkaXQpID8gZW50cnkuY3JlZGl0IDogLTEgKiBlbnRyeS5kZWJpdDtcbiAgICAgIH0gZWxzZSBpZiAoZW50cnkuYWNjb3VudE5vcm1hbCA9PT0gJ2RlYml0Jykge1xuICAgICAgICByZXN1bHQuYmFsYW5jZSArPSAoZW50cnkuZGViaXQpID8gZW50cnkuZGViaXQgOiAtMSAqIGVudHJ5LmNyZWRpdDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgZmV0Y2hlZCBhY2NvdW50cyBqb3VybmFsIGVudHJpZXMuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGVudHJpZXMgLVxuICAgKi9cbiAgbG9hZEVudHJpZXMoZW50cmllcykge1xuICAgIGVudHJpZXMuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgIHRoaXMuZW50cmllcy5wdXNoKHtcbiAgICAgICAgLi4uZW50cnksXG4gICAgICAgIGFjY291bnQ6IGVudHJ5LmFjY291bnQgPyBlbnRyeS5hY2NvdW50LmlkIDogZW50cnkuYWNjb3VudElkLFxuICAgICAgICBhY2NvdW50Tm9ybWFsOiAoZW50cnkuYWNjb3VudCAmJiBlbnRyeS5hY2NvdW50LnR5cGUpXG4gICAgICAgICAgPyBlbnRyeS5hY2NvdW50LnR5cGUubm9ybWFsIDogZW50cnkuYWNjb3VudE5vcm1hbCxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGxvYWRBY2NvdW50cygpIHtcblxuICB9XG59XG4iLCJpbXBvcnQgTW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgeyBleHRlbmRNb21lbnQgfSBmcm9tICdtb21lbnQtcmFuZ2UnO1xuXG5jb25zdCBtb21lbnQgPSBleHRlbmRNb21lbnQoTW9tZW50KTtcblxuZXhwb3J0IGRlZmF1bHQgbW9tZW50OyIsImltcG9ydCBub2RlbWFpbGVyIGZyb20gJ25vZGVtYWlsZXInO1xuXG4vLyBjcmVhdGUgcmV1c2FibGUgdHJhbnNwb3J0ZXIgb2JqZWN0IHVzaW5nIHRoZSBkZWZhdWx0IFNNVFAgdHJhbnNwb3J0XG5jb25zdCB0cmFuc3BvcnRlciA9IG5vZGVtYWlsZXIuY3JlYXRlVHJhbnNwb3J0KHtcbiAgaG9zdDogcHJvY2Vzcy5lbnYuTUFJTF9IT1NULFxuICBwb3J0OiBOdW1iZXIocHJvY2Vzcy5lbnYuTUFJTF9QT1JUKSxcbiAgc2VjdXJlOiBwcm9jZXNzLmVudi5NQUlMX1NFQ1VSRSA9PT0gJ3RydWUnLCAvLyB0cnVlIGZvciA0NjUsIGZhbHNlIGZvciBvdGhlciBwb3J0c1xuICBhdXRoOiB7XG4gICAgdXNlcjogcHJvY2Vzcy5lbnYuTUFJTF9VU0VSTkFNRSxcbiAgICBwYXNzOiBwcm9jZXNzLmVudi5NQUlMX1BBU1NXT1JELFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHRyYW5zcG9ydGVyO1xuIiwiaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHRqcyc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5cbmNvbnN0IGhhc2hQYXNzd29yZCA9IChwYXNzd29yZCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgYmNyeXB0LmdlblNhbHQoMTAsIChlcnJvciwgc2FsdCkgPT4ge1xuICAgIGJjcnlwdC5oYXNoKHBhc3N3b3JkLCBzYWx0LCAoZXJyLCBoYXNoKSA9PiB7IHJlc29sdmUoaGFzaCk7IH0pO1xuICB9KTtcbn0pO1xuXG5jb25zdCBvcmlnaW4gPSAocmVxdWVzdCkgPT4gYCR7cmVxdWVzdC5wcm90b2NvbH06Ly8ke3JlcXVlc3QuaG9zdG5hbWV9YDtcblxuY29uc3QgZGF0ZVJhbmdlQ29sbGVjdGlvbiA9IChmcm9tRGF0ZSwgdG9EYXRlLCBhZGRUeXBlID0gJ2RheScsIGluY3JlbWVudCA9IDEpID0+IHtcbiAgY29uc3QgY29sbGVjdGlvbiA9IFtdO1xuICBjb25zdCBtb21lbnRGcm9tRGF0ZSA9IG1vbWVudChmcm9tRGF0ZSk7XG4gIGxldCBkYXRlRm9ybWF0ID0gJyc7XG5cbiAgc3dpdGNoIChhZGRUeXBlKSB7XG4gICAgY2FzZSAnZGF5JzpcbiAgICBkZWZhdWx0OlxuICAgICAgZGF0ZUZvcm1hdCA9ICdZWVlZLU1NLUREJzsgYnJlYWs7XG4gICAgY2FzZSAnbW9udGgnOlxuICAgIGNhc2UgJ3F1YXJ0ZXInOlxuICAgICAgZGF0ZUZvcm1hdCA9ICdZWVlZLU1NJzsgYnJlYWs7XG4gICAgY2FzZSAneWVhcic6XG4gICAgICBkYXRlRm9ybWF0ID0gJ1lZWVknOyBicmVhaztcbiAgfVxuICBmb3IgKGxldCBpID0gbW9tZW50RnJvbURhdGU7XG4gICAgKGkuaXNCZWZvcmUodG9EYXRlLCBhZGRUeXBlKSB8fCBpLmlzU2FtZSh0b0RhdGUsIGFkZFR5cGUpKTtcbiAgICBpLmFkZChpbmNyZW1lbnQsIGAke2FkZFR5cGV9c2ApKSB7XG4gICAgY29sbGVjdGlvbi5wdXNoKGkuZW5kT2YoYWRkVHlwZSkuZm9ybWF0KGRhdGVGb3JtYXQpKTtcbiAgfVxuICByZXR1cm4gY29sbGVjdGlvbjtcbn07XG5cbmV4cG9ydCB7XG4gIGhhc2hQYXNzd29yZCxcbiAgb3JpZ2luLFxuICBkYXRlUmFuZ2VDb2xsZWN0aW9uLFxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBiYWJlbC9wbHVnaW4tdHJhbnNmb3JtLXJ1bnRpbWVcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hc3luY1RvR2VuZXJhdG9yXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2tcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2RlZmluZVByb3BlcnR5XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvZ2V0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvZ2V0UHJvdG90eXBlT2ZcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbmhlcml0c1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm5cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9zbGljZWRUb0FycmF5XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvdG9Db25zdW1hYmxlQXJyYXlcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy90eXBlb2ZcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvcmVnZW5lcmF0b3JcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYmNyeXB0anNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZG90ZW52XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVycm9yaGFuZGxlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3MtYm9vbVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzLXZhbGlkYXRvclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJoZWxtZXRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwianNvbndlYnRva2VuXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImtuZXhcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG9kYXNoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm1vbWVudFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb21lbnQtcmFuZ2VcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibXVzdGFjaGVcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibm9kZW1haWxlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJvYmplY3Rpb25cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNoREE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hFQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3ZEQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNWQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN6RkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTdFQTtBQStFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDak5BO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFuQkE7QUFDQTtBQUNBO0FBcUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ2hNQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ1JBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ1BBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDUkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUE3REE7QUFDQTtBQStEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF2RkE7QUF5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3ZVQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNsUEE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN6Z0JBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNwTEE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBaENBO0FBa0NBO0FBQ0E7QUFDQTtBQXBDQTtBQXNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3pOQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDdkVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWhJQTtBQUNBO0FBQ0E7QUFDQTtBQWtJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN2VkE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNSQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDeFBBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNoTUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzVDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDUkE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDZkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQS9EQTtBQW1FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2pOQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBdEVBOztBQU9BOztBQWFBOztBQVNBOztBQVlBOztBQVlBOzs7Ozs7Ozs7Ozs7QUM5REE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDM0JBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUMvRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDL0JBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBcENBOzs7Ozs7Ozs7Ozs7QUNOQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ1JBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNwRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUN6Q0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzdCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ1JBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ1pBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDZEE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNSQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBcEJBO0FBc0JBOzs7Ozs7Ozs7Ozs7O0FDdkNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDaEVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBNUJBOztBQUdBOztBQU9BOztBQU9BOztBQW1CQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbkRBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDNUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBcENBOztBQUdBOztBQU9BOzs7Ozs7Ozs7Ozs7QUNsQkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBN0RBOzs7Ozs7Ozs7Ozs7O0FDSkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDTkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNSQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDL09BO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ0xBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2JBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pDQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7OztBIiwic291cmNlUm9vdCI6IiJ9