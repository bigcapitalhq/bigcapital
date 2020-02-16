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
    } }, { key: "walk", value: function walk()

    {

    } }, { key: "getParents", value: function getParents()

    {

    } }, { key: "getChildren", value: function getChildren()

    {

    } }, { key: "toFlattenArray", value: function toFlattenArray()

    {

    } }, { key: "toArray", value: function toArray()

    {

    } }]);return NestedSet;}();

/***/ }),

/***/ "./src/collection/ResourceFieldMetadataCollection.js":
/*!***********************************************************!*\
  !*** ./src/collection/ResourceFieldMetadataCollection.js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ResourceFieldMetadataCollection; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "@babel/runtime/helpers/possibleConstructorReturn");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "@babel/runtime/helpers/getPrototypeOf");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "@babel/runtime/helpers/inherits");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _lib_Metable_MetableCollection__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/lib/Metable/MetableCollection */ "./src/lib/Metable/MetableCollection.js");
/* harmony import */ var _models_ResourceFieldMetadata__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/models/ResourceFieldMetadata */ "./src/models/ResourceFieldMetadata.js");

var

ResourceFieldMetadataCollection = /*#__PURE__*/function (_MetableCollection) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default()(ResourceFieldMetadataCollection, _MetableCollection);
  /**
                                                                                                                                               * Constructor method.
                                                                                                                                               */
  function ResourceFieldMetadataCollection() {var _this;_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, ResourceFieldMetadataCollection);
    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_1___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_2___default()(ResourceFieldMetadataCollection).call(this));

    _this.setModel(_models_ResourceFieldMetadata__WEBPACK_IMPORTED_MODULE_5__["default"]);
    _this.extraColumns = ['resource_id', 'resource_item_id'];return _this;
  }return ResourceFieldMetadataCollection;}(_lib_Metable_MetableCollection__WEBPACK_IMPORTED_MODULE_4__["default"]);

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
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
/* harmony import */ var _http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/http/middleware/jwtAuth */ "./src/http/middleware/jwtAuth.js");
/* harmony import */ var _models_Account__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/models/Account */ "./src/models/Account.js");
/* harmony import */ var _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/services/Accounting/JournalPoster */ "./src/services/Accounting/JournalPoster.js");
/* harmony import */ var _services_Accounting_JournalEntry__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/services/Accounting/JournalEntry */ "./src/services/Accounting/JournalEntry.js");
/* harmony import */ var _models_ManualJournal__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @/models/ManualJournal */ "./src/models/ManualJournal.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}










/* harmony default export */ __webpack_exports__["default"] = ({
  /**
                  * Router constructor.
                  */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_3___default.a.Router();

    router.use(_http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_8__["default"]);

    router.post('/',
    this.openingBalnace.validation,
    Object(_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(this.openingBalnace.handler));

    return router;
  },

  /**
      * Opening balance to the given account.
      * @param {Request} req -
      * @param {Response} res -
      */
  openingBalnace: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('date').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('note').optional().trim().escape(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('balance_adjustment_account').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('accounts').isArray({ min: 1 }),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('accounts.*.id').exists().isInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["oneOf"])([
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('accounts.*.debit').exists().isNumeric().toFloat(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('accounts.*.credit').exists().isNumeric().toFloat()])],


    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(req, res) {var validationErrors, accounts, user, form, date, accountsIds, storedAccounts, accountsCollection, accountsStoredIds, notFoundAccountsIds, errorReasons, ids, account, journalEntries, trial, entryModel, manualJournal;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context.next = 3;break;}return _context.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:



                accounts = req.body.accounts;
                user = req.user;
                form = _objectSpread({}, req.body);
                date = moment__WEBPACK_IMPORTED_MODULE_6___default()(form.date).format('YYYY-MM-DD');

                accountsIds = accounts.map(function (account) {return account.id;});_context.next = 10;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_9__["default"].query().
                  select(['id']).whereIn('id', accountsIds).
                  withGraphFetched('type'));case 10:storedAccounts = _context.sent;

                accountsCollection = new Map(storedAccounts.map(function (i) {return [i.id, i];}));

                // Get the stored accounts Ids and difference with submit accounts.
                accountsStoredIds = storedAccounts.map(function (account) {return account.id;});
                notFoundAccountsIds = Object(lodash__WEBPACK_IMPORTED_MODULE_5__["difference"])(accountsIds, accountsStoredIds);
                errorReasons = [];

                if (notFoundAccountsIds.length > 0) {
                  ids = notFoundAccountsIds.map(function (a) {return parseInt(a, 10);});
                  errorReasons.push({ type: 'NOT_FOUND_ACCOUNT', code: 100, ids: ids });
                }if (!
                form.balance_adjustment_account) {_context.next = 21;break;}_context.next = 19;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_9__["default"].query().findById(form.balance_adjustment_account));case 19:account = _context.sent;

                if (!account) {
                  errorReasons.push({ type: 'BALANCE.ADJUSTMENT.ACCOUNT.NOT.EXIST', code: 300 });
                }case 21:if (!(

                errorReasons.length > 0)) {_context.next = 23;break;}return _context.abrupt("return",
                res.boom.badData(null, { errors: errorReasons }));case 23:


                journalEntries = new _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_10__["default"]();

                accounts.forEach(function (account) {
                  var storedAccount = accountsCollection.get(account.id);

                  // Can't continue in case the stored account was not found.
                  if (!storedAccount) {return;}

                  var entryModel = new _services_Accounting_JournalEntry__WEBPACK_IMPORTED_MODULE_11__["default"]({
                    referenceType: 'OpeningBalance',
                    account: account.id,
                    accountNormal: storedAccount.type.normal,
                    userId: user.id });

                  if (account.credit) {
                    entryModel.entry.credit = account.credit;
                    journalEntries.credit(entryModel);
                  } else if (account.debit) {
                    entryModel.entry.debit = account.debit;
                    journalEntries.debit(entryModel);
                  }
                });
                // Calculates the credit and debit balance of stacked entries.
                trial = journalEntries.getTrialBalance();

                if (trial.credit !== trial.debit) {
                  entryModel = new _services_Accounting_JournalEntry__WEBPACK_IMPORTED_MODULE_11__["default"]({
                    referenceType: 'OpeningBalance',
                    account: form.balance_adjustment_account,
                    accountNormal: 'credit',
                    userId: user.id });


                  if (trial.credit > trial.debit) {
                    entryModel.entry.credit = Math.abs(trial.credit);
                    journalEntries.credit(entryModel);

                  } else if (trial.credit < trial.debit) {
                    entryModel.entry.debit = Math.abs(trial.debit);
                    journalEntries.debit(entryModel);
                  }
                }_context.next = 29;return (
                  _models_ManualJournal__WEBPACK_IMPORTED_MODULE_12__["default"].query().insert({
                    amount: Math.max(trial.credit, trial.debit),
                    transaction_type: 'OpeningBalance',
                    date: date,
                    note: form.note,
                    user_id: user.id }));case 29:manualJournal = _context.sent;


                journalEntries.entries = journalEntries.entries.map(function (entry) {return _objectSpread({},
                  entry, {
                    referenceId: manualJournal.id });});_context.next = 33;return (

                  Promise.all([
                  journalEntries.saveEntries(),
                  journalEntries.saveBalance()]));case 33:return _context.abrupt("return",

                res.status(200).send({ id: manualJournal.id }));case 34:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() } });

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



  /**
                                                                                                                                                                                                    * Active the given account.
                                                                                                                                                                                                    */
  activeAccount: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["param"])('id').exists().isNumeric().toInt()],

    handler: function () {var _handler7 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee7(req, res) {var id, account;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:
                id = req.params.id;_context7.next = 3;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_7__["default"].findById(id));case 3:account = _context7.sent;if (

                account) {_context7.next = 6;break;}return _context7.abrupt("return",
                res.status(400).send({
                  errors: [{ type: 'ACCOUNT.NOT.FOUND', code: 100 }] }));case 6:_context7.next = 8;return (


                  account.patch({ active: true }));case 8:return _context7.abrupt("return",

                res.status(200).send({ id: account.id }));case 9:case "end":return _context7.stop();}}}, _callee7);}));function handler(_x13, _x14) {return _handler7.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                     * Inactive the given account.
                                                                                                                                                                                                                     */
  inactiveAccount: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["param"])('id').exists().isNumeric().toInt()],

    handler: function () {var _handler8 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee8(req, res) {var id, account;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee8$(_context8) {while (1) {switch (_context8.prev = _context8.next) {case 0:
                id = req.params.id;_context8.next = 3;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_7__["default"].findById(id));case 3:account = _context8.sent;if (

                account) {_context8.next = 6;break;}return _context8.abrupt("return",
                res.status(400).send({
                  errors: [{ type: 'ACCOUNT.NOT.FOUND', code: 100 }] }));case 6:_context8.next = 8;return (


                  account.patch({ active: false }));case 8:return _context8.abrupt("return",

                res.status(200).send({ id: account.id }));case 9:case "end":return _context8.stop();}}}, _callee8);}));function handler(_x15, _x16) {return _handler8.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                     * Transfer all journal entries of the given account to another account.
                                                                                                                                                                                                                     */
  transferToAnotherAccount: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["param"])('id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["param"])('toAccount').exists().isNumeric().toInt()],

    handler: function () {var _handler9 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee9(req, res) {var validationErrors;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee9$(_context9) {while (1) {switch (_context9.prev = _context9.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context9.next = 3;break;}return _context9.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:case "end":return _context9.stop();}}}, _callee9);}));function handler(_x17, _x18) {return _handler9.apply(this, arguments);}return handler;}() } });

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
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @/utils */ "./src/utils/index.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}














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
                  columns.push(date.format(Object(_utils__WEBPACK_IMPORTED_MODULE_16__["dateRangeFormat"])(budget.rangeBy)));
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
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('page').optional().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('page_size').isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('custom_view_id').optional().isNumeric().toInt()],

    handler: function () {var _handler4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(req, res) {var validationErrors, filter, budgets;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context4.next = 3;break;}return _context4.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:



                filter = _objectSpread({
                  page_size: 10,
                  page: 1 },
                req.query);_context4.next = 6;return (

                  _models_Budget__WEBPACK_IMPORTED_MODULE_9__["default"].query().runBefore(function (result, q) {
                    if (filter.profit_loss) {
                      q.modify('filterByYear', filter.year);
                    }
                    if (filter.income_statement) {
                      q.modify('filterByIncomeStatement', filter.income_statement);
                    }
                    if (filter.profit_loss) {
                      q.modify('filterByProfitLoss', filter.profit_loss);
                    }
                    q.page(filter.page, filter.page_size);
                    return result;
                  }));case 6:budgets = _context4.sent;return _context4.abrupt("return",
                res.status(200).send({
                  items: budgets.items }));case 8:case "end":return _context4.stop();}}}, _callee4);}));function handler(_x7, _x8) {return _handler4.apply(this, arguments);}return handler;}() } });

/***/ }),

/***/ "./src/http/controllers/BudgetReports.js":
/*!***********************************************!*\
  !*** ./src/http/controllers/BudgetReports.js ***!
  \***********************************************/
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
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/http/middleware/jwtAuth */ "./src/http/middleware/jwtAuth.js");
/* harmony import */ var _http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/http/middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
/* harmony import */ var _models_Budget__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/models/Budget */ "./src/models/Budget.js");
/* harmony import */ var _models_Account__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/models/Account */ "./src/models/Account.js");
/* harmony import */ var _models_AccountType__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/models/AccountType */ "./src/models/AccountType.js");
/* harmony import */ var _collection_NestedSet__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/collection/NestedSet */ "./src/collection/NestedSet/index.js");
/* harmony import */ var _models_BudgetEntry__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @/models/BudgetEntry */ "./src/models/BudgetEntry.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @/utils */ "./src/utils/index.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}











/* harmony default export */ __webpack_exports__["default"] = ({

  /**
                  * Router constructor.
                  */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_3___default.a.Router();

    router.use(_http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_6__["default"]);

    router.get('/budget_verses_actual/:reportId',
    this.budgetVersesActual.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(this.budgetVersesActual.handler));

    return router;
  },

  budgetVersesActual: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["query"])('basis').optional().isIn(['cash', 'accural']),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["query"])('period').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["query"])('active_accounts').optional().toBoolean()],

    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(req, res) {var validationErrors, reportId, form, errorReasons, budget, budgetEntries, accountTypes, accounts, fromDate, toDate, dateRange, dateRangeCollection;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context.next = 3;break;}return _context.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                reportId = req.params.reportId;
                form = _objectSpread({}, req.body);
                errorReasons = [];_context.next = 8;return (

                  _models_Budget__WEBPACK_IMPORTED_MODULE_8__["default"].query().findById(reportId));case 8:budget = _context.sent;

                if (!budget) {
                  errorReasons.push({ type: 'BUDGET_NOT_FOUND', code: 100 });
                }_context.next = 12;return (
                  _models_BudgetEntry__WEBPACK_IMPORTED_MODULE_12__["default"].query().where('budget_id', budget.id));case 12:budgetEntries = _context.sent;if (!(

                errorReasons.length > 0)) {_context.next = 15;break;}return _context.abrupt("return",
                res.status(400).send({ errors: errorReasons }));case 15:_context.next = 17;return (

                  _models_AccountType__WEBPACK_IMPORTED_MODULE_10__["default"].query().
                  where('balance_sheet', budget.accountTypes === 'balance_sheet').
                  where('income_sheet', budget.accountTypes === 'profit_losss'));case 17:accountTypes = _context.sent;_context.next = 20;return (

                  _models_Account__WEBPACK_IMPORTED_MODULE_9__["default"].query().runBefore(function (result, q) {
                    var accountTypesIds = accountTypes.map(function (t) {return t.id;});

                    if (accountTypesIds.length > 0) {
                      q.whereIn('account_type_id', accountTypesIds);
                    }
                    q.where('active', form.active_accounts === true);
                    q.withGraphFetched('transactions');
                  }));case 20:accounts = _context.sent;

                // const accountsNestedSet = NestedSet.from(accounts);

                fromDate = moment__WEBPACK_IMPORTED_MODULE_5___default()(budget.year).startOf('year').
                add(budget.rangeOffset, budget.rangeBy).toDate();

                toDate = moment__WEBPACK_IMPORTED_MODULE_5___default()(budget.year).endOf('year').toDate();

                dateRange = moment__WEBPACK_IMPORTED_MODULE_5___default.a.range(fromDate, toDate);
                dateRangeCollection = Array.from(dateRange.by(budget.rangeBy, {
                  step: budget.rangeIncrement, excludeEnd: false, excludeStart: false }));


                //   // const accounts = {
                //   //   assets: [
                //   //     {
                //   //       name: '',
                //   //       code: '',
                //   //       totalEntries: [
                //   //         {

                //   //         }
                //   //       ],
                //   //       children: [
                //   //         {
                //   //           name: '',
                //   //           code: '',
                //   //           entries: [
                //   //             {

                //   //             }
                //   //           ]
                //   //         }
                //   //       ]
                //   //     }
                //   //   ]
                //   // }
                return _context.abrupt("return",
                res.status(200).send({
                  columns: dateRangeCollection.map(function (d) {return d.format(Object(_utils__WEBPACK_IMPORTED_MODULE_13__["dateRangeFormat"])(budget.rangeBy));})
                  // accounts: {
                  //   asset: [],
                  //   liabilities: [],
                  //   equaity: [],

                  //   income: [],
                  //   expenses: [],
                  // }
                }));case 26:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() } });

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


  router: function router() {

  },

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
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "@babel/runtime/helpers/toConsumableArray");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "@babel/runtime/helpers/slicedToArray");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__);
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
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/http/middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
/* harmony import */ var _models_Expense__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/models/Expense */ "./src/models/Expense.js");
/* harmony import */ var _models_Account__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/models/Account */ "./src/models/Account.js");
/* harmony import */ var _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @/services/Accounting/JournalPoster */ "./src/services/Accounting/JournalPoster.js");
/* harmony import */ var _services_Accounting_JournalEntry__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @/services/Accounting/JournalEntry */ "./src/services/Accounting/JournalEntry.js");
/* harmony import */ var _http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @/http/middleware/jwtAuth */ "./src/http/middleware/jwtAuth.js");
/* harmony import */ var _models_AccountTransaction__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @/models/AccountTransaction */ "./src/models/AccountTransaction.js");
/* harmony import */ var _models_View__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @/models/View */ "./src/models/View.js");
/* harmony import */ var _models_Resource__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../models/Resource */ "./src/models/Resource.js");
/* harmony import */ var _services_CustomFields_ResourceCustomFieldRepository__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @/services/CustomFields/ResourceCustomFieldRepository */ "./src/services/CustomFields/ResourceCustomFieldRepository.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}














/* harmony default export */ __webpack_exports__["default"] = ({
  /**
                  * Router constructor.
                  */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_5___default.a.Router();
    router.use(_http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_14__["default"]);

    router.post('/',
    this.newExpense.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_9__["default"])(this.newExpense.handler));

    router.post('/:id/publish',
    this.publishExpense.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_9__["default"])(this.publishExpense.handler));

    router["delete"]('/:id',
    this.deleteExpense.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_9__["default"])(this.deleteExpense.handler));

    router.post('/bulk',
    this.bulkAddExpenses.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_9__["default"])(this.bulkAddExpenses.handler));

    router.post('/:id',
    this.updateExpense.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_9__["default"])(this.updateExpense.handler));

    router.get('/',
    this.listExpenses.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_9__["default"])(this.listExpenses.handler));

    router.get('/:id',
    this.getExpense.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_9__["default"])(this.getExpense.handler));

    return router;
  },

  /**
      * Saves a new expense.
      */
  newExpense: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('date').optional().isISO8601(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('payment_account_id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('expense_account_id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('description').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('amount').exists().isNumeric().toFloat(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('currency_code').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('exchange_rate').optional().isNumeric().toFloat(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('publish').optional().isBoolean().toBoolean(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('custom_fields').optional().isArray({ min: 1 }),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('custom_fields.*.key').exists().trim().escape(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('custom_fields.*.value').exists()],

    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee(req, res) {var validationErrors, form, errorReasons, paymentAccount, expenseAccount, customFields, expenseTransaction, journalEntries, creditEntry, debitEntry;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context.next = 3;break;}return _context.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                form = _objectSpread({
                  date: new Date(),
                  published: false,
                  custom_fields: [] },
                req.body);

                // Convert the date to the general format.
                form.date = moment__WEBPACK_IMPORTED_MODULE_7___default()(form.date).format('YYYY-MM-DD');
                s;
                errorReasons = [];_context.next = 9;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_11__["default"].query().
                  findById(form.payment_account_id).first());case 9:paymentAccount = _context.sent;

                if (!paymentAccount) {
                  errorReasons.push({ type: 'PAYMENT.ACCOUNT.NOT.FOUND', code: 100 });
                }_context.next = 13;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_11__["default"].query().findById(form.expense_account_id).first());case 13:expenseAccount = _context.sent;

                if (!expenseAccount) {
                  errorReasons.push({ type: 'EXPENSE.ACCOUNT.NOT.FOUND', code: 200 });
                }
                customFields = new _services_CustomFields_ResourceCustomFieldRepository__WEBPACK_IMPORTED_MODULE_18__["default"](_models_Expense__WEBPACK_IMPORTED_MODULE_10__["default"]);_context.next = 18;return (
                  customFields.load());case 18:

                if (customFields.validateExistCustomFields()) {
                  errorReasons.push({ type: 'CUSTOM.FIELDS.SLUGS.NOT.EXISTS', code: 400 });
                }if (!(
                errorReasons.length > 0)) {_context.next = 21;break;}return _context.abrupt("return",
                res.status(400).send({ errors: errorReasons }));case 21:_context.next = 23;return (

                  _models_Expense__WEBPACK_IMPORTED_MODULE_10__["default"].query().insertAndFetch(_objectSpread({},
                  Object(lodash__WEBPACK_IMPORTED_MODULE_8__["omit"])(form, ['custom_fields']))));case 23:expenseTransaction = _context.sent;

                customFields.fillCustomFields(expenseTransaction.id, form.custom_fields);

                journalEntries = new _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_12__["default"]();
                creditEntry = new _services_Accounting_JournalEntry__WEBPACK_IMPORTED_MODULE_13__["default"]({
                  credit: form.amount,
                  referenceId: expenseTransaction.id,
                  referenceType: _models_Expense__WEBPACK_IMPORTED_MODULE_10__["default"].referenceType,
                  date: form.date,
                  account: expenseAccount.id,
                  accountNormal: 'debit',
                  draft: !form.published });

                debitEntry = new _services_Accounting_JournalEntry__WEBPACK_IMPORTED_MODULE_13__["default"]({
                  debit: form.amount,
                  referenceId: expenseTransaction.id,
                  referenceType: _models_Expense__WEBPACK_IMPORTED_MODULE_10__["default"].referenceType,
                  date: form.date,
                  account: paymentAccount.id,
                  accountNormal: 'debit',
                  draft: !form.published });

                journalEntries.credit(creditEntry);
                journalEntries.debit(debitEntry);_context.next = 32;return (

                  Promise.all([
                  customFields.saveCustomFields(expenseTransaction.id),
                  journalEntries.saveEntries(),
                  journalEntries.saveBalance()]));case 32:return _context.abrupt("return",

                res.status(200).send({ id: expenseTransaction.id }));case 33:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                           * Bulk add expneses to the given accounts.
                                                                                                                                                                                                                           */
  bulkAddExpenses: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('expenses').exists().isArray({ min: 1 }),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('expenses.*.date').optional().isISO8601(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('expenses.*.payment_account_id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('expenses.*.expense_account_id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('expenses.*.description').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('expenses.*.amount').exists().isNumeric().toFloat(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('expenses.*.currency_code').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('expenses.*.exchange_rate').optional().isNumeric().toFloat()],

    handler: function () {var _handler2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee3(req, res) {var validationErrors, form, errorReasons, paymentAccountsIds, expenseAccountsIds, _ref, _ref2, expensesAccounts, paymentAccounts, storedExpensesAccountsIds, storedPaymentAccountsIds, notFoundPaymentAccountsIds, notFoundExpenseAccountsIds, expenseSaveOpers, journalPoster, savedExpenseTransactions;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context3.next = 3;break;}return _context3.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                form = _objectSpread({}, req.body);
                errorReasons = [];

                paymentAccountsIds = Object(lodash__WEBPACK_IMPORTED_MODULE_8__["chain"])(form.expenses).
                map(function (e) {return e.payment_account_id;}).uniq().value();
                expenseAccountsIds = Object(lodash__WEBPACK_IMPORTED_MODULE_8__["chain"])(form.expenses).
                map(function (e) {return e.expense_account_id;}).uniq().value();_context3.next = 9;return (

                  Promise.all([
                  _models_Account__WEBPACK_IMPORTED_MODULE_11__["default"].query().whereIn('id', expenseAccountsIds),
                  _models_Account__WEBPACK_IMPORTED_MODULE_11__["default"].query().whereIn('id', paymentAccountsIds)]));case 9:_ref = _context3.sent;_ref2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_ref, 2);expensesAccounts = _ref2[0];paymentAccounts = _ref2[1];

                storedExpensesAccountsIds = expensesAccounts.map(function (a) {return a.id;});
                storedPaymentAccountsIds = paymentAccounts.map(function (a) {return a.id;});

                notFoundPaymentAccountsIds = Object(lodash__WEBPACK_IMPORTED_MODULE_8__["difference"])(expenseAccountsIds, storedExpensesAccountsIds);
                notFoundExpenseAccountsIds = Object(lodash__WEBPACK_IMPORTED_MODULE_8__["difference"])(paymentAccountsIds, storedPaymentAccountsIds);

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
                journalPoster = new _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_12__["default"]();

                form.expenses.forEach( /*#__PURE__*/function () {var _ref3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee2(expense) {var expenseSaveOper;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                            expenseSaveOper = _models_Expense__WEBPACK_IMPORTED_MODULE_10__["default"].query().insert(_objectSpread({}, expense));
                            expenseSaveOpers.push(expenseSaveOper);case 2:case "end":return _context2.stop();}}}, _callee2);}));return function (_x5) {return _ref3.apply(this, arguments);};}());

                // Wait unit save all expense transactions.
                _context3.next = 26;return Promise.all(expenseSaveOpers);case 26:savedExpenseTransactions = _context3.sent;

                savedExpenseTransactions.forEach(function (expense) {
                  var date = moment__WEBPACK_IMPORTED_MODULE_7___default()(expense.date).format('YYYY-DD-MM');

                  var debit = new _services_Accounting_JournalEntry__WEBPACK_IMPORTED_MODULE_13__["default"]({
                    debit: expense.amount,
                    referenceId: expense.id,
                    referenceType: _models_Expense__WEBPACK_IMPORTED_MODULE_10__["default"].referenceType,
                    account: expense.payment_account_id,
                    accountNormal: 'debit',
                    date: date });

                  var credit = new _services_Accounting_JournalEntry__WEBPACK_IMPORTED_MODULE_13__["default"]({
                    credit: expense.amount,
                    referenceId: expense.id,
                    referenceType: _models_Expense__WEBPACK_IMPORTED_MODULE_10__["default"].referenceId,
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
                                                                                                                                                                                                  * Publish the given expense id.
                                                                                                                                                                                                  */
  publishExpense: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["param"])('id').exists().isNumeric().toInt()],

    handler: function () {var _handler3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee4(req, res) {var validationErrors, id, errorReasons, expense;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context4.next = 3;break;}return _context4.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:



                id = req.params.id;
                errorReasons = [];_context4.next = 7;return (
                  _models_Expense__WEBPACK_IMPORTED_MODULE_10__["default"].query().findById(id));case 7:expense = _context4.sent;

                if (!expense) {
                  errorReasons.push({ type: 'EXPENSE.NOT.FOUND', code: 100 });
                }if (!(
                errorReasons.length > 0)) {_context4.next = 11;break;}return _context4.abrupt("return",
                res.status(400).send({ errors: errorReasons }));case 11:


                if (expense.published) {
                  errorReasons.push({ type: 'EXPENSE.ALREADY.PUBLISHED', code: 200 });
                }if (!(
                errorReasons.length > 0)) {_context4.next = 14;break;}return _context4.abrupt("return",
                res.status(400).send({ errors: errorReasons }));case 14:_context4.next = 16;return (


                  _models_AccountTransaction__WEBPACK_IMPORTED_MODULE_15__["default"].query().
                  where('reference_id', expense.id).
                  where('reference_type', 'Expense').
                  patch({
                    draft: false }));case 16:_context4.next = 18;return (


                  _models_Expense__WEBPACK_IMPORTED_MODULE_10__["default"].query().
                  where('id', expense.id).
                  update({ published: true }));case 18:return _context4.abrupt("return",

                res.status(200).send());case 19:case "end":return _context4.stop();}}}, _callee4);}));function handler(_x6, _x7) {return _handler3.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                  * Retrieve paginated expenses list.
                                                                                                                                                                                                  */
  listExpenses: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["query"])('expense_account_id').optional().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["query"])('payment_account_id').optional().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["query"])('note').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["query"])('range_from').optional().isNumeric().toFloat(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["query"])('range_to').optional().isNumeric().toFloat(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["query"])('date_from').optional().isISO8601(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["query"])('date_to').optional().isISO8601(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["query"])('column_sort_order').optional().isIn(['created_at', 'date', 'amount']),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["query"])('sort_order').optional().isIn(['desc', 'asc']),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["query"])('page').optional().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["query"])('page_size').optional().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["query"])('custom_view_id').optional().isNumeric().toInt()],

    handler: function () {var _handler4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee5(req, res) {var validationErrors, filter, errorReasons, expenseResource, view, expenses;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context5.next = 3;break;}return _context5.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                filter = _objectSpread({
                  page_size: 10,
                  page: 1 },
                req.query);

                errorReasons = [];_context5.next = 7;return (
                  _models_Resource__WEBPACK_IMPORTED_MODULE_17__["default"].query().where('name', 'expenses').first());case 7:expenseResource = _context5.sent;

                if (!expenseResource) {
                  errorReasons.push({ type: 'EXPENSE_NOT_FOUND', code: 300 });
                }_context5.next = 11;return (
                  _models_View__WEBPACK_IMPORTED_MODULE_16__["default"].query().runBefore(function (result, q) {
                    if (filter.customer_view_id) {
                      q.where('id', filter.customer_view_id);
                    } else {
                      q.where('favorite', true);
                    }
                    q.where('resource_id', expenseResource.id);
                    q.withGraphFetched('viewRoles');
                    q.withGraphFetched('columns');
                    q.first();
                    return result;
                  }));case 11:view = _context5.sent;

                if (!view) {
                  errorReasons.push({ type: 'VIEW_NOT_FOUND', code: 100 });
                }if (!(
                errorReasons.length > 0)) {_context5.next = 15;break;}return _context5.abrupt("return",
                res.boom.badRequest(null, { errors: errorReasons }));case 15:_context5.next = 17;return (

                  _models_Expense__WEBPACK_IMPORTED_MODULE_10__["default"].query().
                  modify('filterByAmountRange', filter.range_from, filter.to_range).
                  modify('filterByDateRange', filter.date_from, filter.date_to).
                  modify('filterByExpenseAccount', filter.expense_account_id).
                  modify('filterByPaymentAccount', filter.payment_account_id).
                  modify('orderBy', filter.column_sort_order, filter.sort_order).
                  page(filter.page, filter.page_size));case 17:expenses = _context5.sent;return _context5.abrupt("return",

                res.status(200).send({
                  columns: view.columns,
                  viewRoles: view.viewRoles }));case 19:case "end":return _context5.stop();}}}, _callee5);}));function handler(_x8, _x9) {return _handler4.apply(this, arguments);}return handler;}() },




  /**
                                                                                                                                                                                                          * Delete the given account.
                                                                                                                                                                                                          */
  deleteExpense: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["param"])('id').isNumeric().toInt()],

    handler: function () {var _handler5 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee6(req, res) {var validationErrors, id, expenseTransaction, expenseEntries, expenseEntriesCollect;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context6.next = 3;break;}return _context6.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                id = req.params.id;_context6.next = 6;return (
                  _models_Expense__WEBPACK_IMPORTED_MODULE_10__["default"].query().findById(id));case 6:expenseTransaction = _context6.sent;if (

                expenseTransaction) {_context6.next = 9;break;}return _context6.abrupt("return",
                res.status(404).send({
                  errors: [{ type: 'EXPENSE.TRANSACTION.NOT.FOUND', code: 100 }] }));case 9:_context6.next = 11;return (


                  _models_AccountTransaction__WEBPACK_IMPORTED_MODULE_15__["default"].query().
                  where('reference_type', 'Expense').
                  where('reference_id', expenseTransaction.id));case 11:expenseEntries = _context6.sent;

                expenseEntriesCollect = new _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_12__["default"]();
                expenseEntriesCollect.loadEntries(expenseEntries);
                expenseEntriesCollect.reverseEntries();_context6.next = 17;return (

                  Promise.all([
                  _models_Expense__WEBPACK_IMPORTED_MODULE_10__["default"].query().findById(expenseTransaction.id)["delete"](),
                  expenseEntriesCollect.deleteEntries(),
                  expenseEntriesCollect.saveBalance()]));case 17:return _context6.abrupt("return",

                res.status(200).send());case 18:case "end":return _context6.stop();}}}, _callee6);}));function handler(_x10, _x11) {return _handler5.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                    * Update details of the given account.
                                                                                                                                                                                                    */
  updateExpense: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["param"])('id').isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('date').optional().isISO8601(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('payment_account_id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('expense_account_id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('description').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('amount').exists().isNumeric().toFloat(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('currency_code').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('exchange_rate').optional().isNumeric().toFloat()],

    handler: function () {var _handler6 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee7(req, res) {var validationErrors, id, expenseTransaction;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context7.next = 3;break;}return _context7.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                id = req.params.id;_context7.next = 6;return (
                  _models_Expense__WEBPACK_IMPORTED_MODULE_10__["default"].query().findById(id));case 6:expenseTransaction = _context7.sent;if (

                expenseTransaction) {_context7.next = 9;break;}return _context7.abrupt("return",
                res.status(404).send({
                  errors: [{ type: 'EXPENSE.TRANSACTION.NOT.FOUND', code: 100 }] }));case 9:case "end":return _context7.stop();}}}, _callee7);}));function handler(_x12, _x13) {return _handler6.apply(this, arguments);}return handler;}() },





  /**
                                                                                                                                                                                                                                                * Retrieve details of the given expense id.
                                                                                                                                                                                                                                                */
  getExpense: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["param"])('id').exists().isNumeric().toInt()],

    handler: function () {var _handler7 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee8(req, res) {var validationErrors, id, expenseTransaction, expenseCFMetadataRepo, expenseCusFieldsMetadata;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee8$(_context8) {while (1) {switch (_context8.prev = _context8.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context8.next = 3;break;}return _context8.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                id = req.params.id;_context8.next = 6;return (
                  _models_Expense__WEBPACK_IMPORTED_MODULE_10__["default"].query().findById(id));case 6:expenseTransaction = _context8.sent;if (

                expenseTransaction) {_context8.next = 9;break;}return _context8.abrupt("return",
                res.status(404).send({
                  errors: [{ type: 'EXPENSE.TRANSACTION.NOT.FOUND', code: 100 }] }));case 9:



                expenseCFMetadataRepo = new _services_CustomFields_ResourceCustomFieldRepository__WEBPACK_IMPORTED_MODULE_18__["default"](_models_Expense__WEBPACK_IMPORTED_MODULE_10__["default"]);_context8.next = 12;return (
                  expenseCFMetadataRepo.load());case 12:_context8.next = 14;return (
                  expenseCFMetadataRepo.fetchCustomFieldsMetadata(expenseTransaction.id));case 14:

                expenseCusFieldsMetadata = expenseCFMetadataRepo.getMetadata(expenseTransaction.id);return _context8.abrupt("return",

                res.status(200).send(_objectSpread({},
                expenseTransaction, {
                  custom_fields: _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(
                  expenseCusFieldsMetadata.toArray()) })));case 16:case "end":return _context8.stop();}}}, _callee8);}));function handler(_x14, _x15) {return _handler7.apply(this, arguments);}return handler;}() } });

/***/ }),

/***/ "./src/http/controllers/Fields.js":
/*!****************************************!*\
  !*** ./src/http/controllers/Fields.js ***!
  \****************************************/
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
/* harmony import */ var _models_ResourceField__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/models/ResourceField */ "./src/models/ResourceField.js");
/* harmony import */ var _models_Resource__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/models/Resource */ "./src/models/Resource.js");
/* harmony import */ var _middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}





/**
                                                              * Types of the custom fields.
                                                              */
var TYPES = ['text', 'email', 'number', 'url', 'percentage', 'checkbox', 'radio', 'textarea'];

/* harmony default export */ __webpack_exports__["default"] = ({
  /**
                  * Router constructor method.
                  */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_3___default.a.Router();

    router.post('/resource/:resource_name',
    this.addNewField.validation,
    Object(_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(this.addNewField.handler));

    router.post('/:field_id',
    this.editField.validation,
    Object(_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(this.editField.handler));

    router.post('/status/:field_id',
    this.changeStatus.validation,
    Object(_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(this.changeStatus.handler));

    // router.get('/:field_id',
    //   asyncMiddleware(this.getField.handler));

    // router.delete('/:field_id',
    //   asyncMiddleware(this.deleteField.handler));

    return router;
  },

  /**
      * Adds a new field control to the given resource.
      * @param {Request} req -
      * @param {Response} res -
      */
  addNewField: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["param"])('resource_name').exists().trim().escape(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('label').exists().escape().trim(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('data_type').exists().isIn(TYPES),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('help_text').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('default').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('options').optional().isArray(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('options.*.key').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('options.*.value').exists()],

    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(req, res) {var resourceName, validationErrors, resource, form, choices, storedResource;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                resourceName = req.params.resource_name;
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context.next = 4;break;}return _context.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 4:_context.next = 6;return (


                  _models_Resource__WEBPACK_IMPORTED_MODULE_6__["default"].query().where('name', resourceName).first());case 6:resource = _context.sent;if (

                resource) {_context.next = 9;break;}return _context.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'RESOURCE_NOT_FOUND', code: 100 }] }));case 9:


                form = _objectSpread({ options: [] }, req.body);
                choices = form.options.map(function (option) {return { key: option.key, value: option.value };});_context.next = 13;return (

                  _models_ResourceField__WEBPACK_IMPORTED_MODULE_5__["default"].query().insertAndFetch({
                    data_type: form.data_type,
                    label_name: form.label,
                    help_text: form.help_text,
                    "default": form["default"],
                    resource_id: resource.id,
                    options: choices,
                    index: -1 }));case 13:storedResource = _context.sent;return _context.abrupt("return",

                res.status(200).send({ id: storedResource.id }));case 15:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                       * Edit details of the given field.
                                                                                                                                                                                                                       */
  editField: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["param"])('field_id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('label').exists().escape().trim(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('data_type').exists().isIn(TYPES),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('help_text').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('default').optional(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('options').optional().isArray(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('options.*.key').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('options.*.value').exists()],

    handler: function () {var _handler2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(req, res) {var fieldId, validationErrors, field, form, choices;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                fieldId = req.params.field_id;
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context2.next = 4;break;}return _context2.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 4:_context2.next = 6;return (


                  _models_ResourceField__WEBPACK_IMPORTED_MODULE_5__["default"].query().findById(fieldId));case 6:field = _context2.sent;if (

                field) {_context2.next = 9;break;}return _context2.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'FIELD_NOT_FOUND', code: 100 }] }));case 9:


                // Sets the default value of optional fields.
                form = _objectSpread({ options: [] }, req.body);
                choices = form.options.map(function (option) {return { key: option.key, value: option.value };});_context2.next = 13;return (

                  _models_ResourceField__WEBPACK_IMPORTED_MODULE_5__["default"].query().findById(field.id).update({
                    data_type: form.data_type,
                    label_name: form.label,
                    help_text: form.help_text,
                    "default": form["default"],
                    options: choices }));case 13:return _context2.abrupt("return",

                res.status(200).send({ id: field.id }));case 14:case "end":return _context2.stop();}}}, _callee2);}));function handler(_x3, _x4) {return _handler2.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                  * Retrieve the fields list of the given resource.
                                                                                                                                                                                                                  * @param {Request} req -
                                                                                                                                                                                                                  * @param {Response} res -
                                                                                                                                                                                                                  */
  fieldsList: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["param"])('resource_name').toInt()],

    handler: function () {var _handler3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(req, res) {var validationErrors, resourceName, resource, fields;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context3.next = 3;break;}return _context3.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                resourceName = req.params.resource_name;_context3.next = 6;return (
                  _models_Resource__WEBPACK_IMPORTED_MODULE_6__["default"].query().where('name', resourceName).first());case 6:resource = _context3.sent;if (

                resource) {_context3.next = 9;break;}return _context3.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'RESOURCE_NOT_FOUND', code: 100 }] }));case 9:_context3.next = 11;return (


                  _models_ResourceField__WEBPACK_IMPORTED_MODULE_5__["default"].where('resource_id', resource.id).fetchAll());case 11:fields = _context3.sent;return _context3.abrupt("return",

                res.status(200).send({ fields: fields.toJSON() }));case 13:case "end":return _context3.stop();}}}, _callee3);}));function handler(_x5, _x6) {return _handler3.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                             * Change status of the given field.
                                                                                                                                                                                                                             */
  changeStatus: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["param"])('field_id').toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('active').isBoolean().toBoolean()],

    handler: function () {var _handler4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(req, res) {var fieldId, field, active;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                fieldId = req.params.field_id;_context4.next = 3;return (
                  _models_ResourceField__WEBPACK_IMPORTED_MODULE_5__["default"].query().findById(fieldId));case 3:field = _context4.sent;if (

                field) {_context4.next = 6;break;}return _context4.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'NOT_FOUND_FIELD', code: 100 }] }));case 6:



                active = req.body.active;_context4.next = 9;return (
                  _models_ResourceField__WEBPACK_IMPORTED_MODULE_5__["default"].query().findById(field.id).patch({ active: active }));case 9:return _context4.abrupt("return",

                res.status(200).send({ id: field.id }));case 10:case "end":return _context4.stop();}}}, _callee4);}));function handler(_x7, _x8) {return _handler4.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                  * Retrieve details of the given field.
                                                                                                                                                                                                                  */
  getField: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["param"])('field_id').toInt()],

    handler: function () {var _handler5 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee5(req, res) {var id, field;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
                id = req.params.field_id;_context5.next = 3;return (
                  _models_ResourceField__WEBPACK_IMPORTED_MODULE_5__["default"].where('id', id).fetch());case 3:field = _context5.sent;if (

                field) {_context5.next = 6;break;}return _context5.abrupt("return",
                res.boom.notFound());case 6:return _context5.abrupt("return",


                res.status(200).send({
                  field: field.toJSON() }));case 7:case "end":return _context5.stop();}}}, _callee5);}));function handler(_x9, _x10) {return _handler5.apply(this, arguments);}return handler;}() },




  /**
                                                                                                                                                                                                      * Delete the given field.
                                                                                                                                                                                                      */
  deleteField: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["param"])('field_id').toInt()],

    handler: function () {var _handler6 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee6(req, res) {var id, field;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:
                id = req.params.field_id;_context6.next = 3;return (
                  _models_ResourceField__WEBPACK_IMPORTED_MODULE_5__["default"].where('id', id).fetch());case 3:field = _context6.sent;if (

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

    router.get('/cash_flow_statement',
    this.cashFlowStatement.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_8__["default"])(this.cashFlowStatement.handler));

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

                res.status(200).send({
                  meta: {},
                  operating: [],
                  financing: [],
                  investing: [] }));case 1:case "end":return _context6.stop();}}}, _callee6);}));function handler(_x11, _x12) {return _handler6.apply(this, arguments);}return handler;}() } });

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

    router.post('/:id',
    this.editItem.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_8__["default"])(this.editItem.handler));

    router.post('/',
    // permit('create'),
    this.newItem.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_8__["default"])(this.newItem.handler));

    router["delete"]('/:id',
    this.deleteItem.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_8__["default"])(this.deleteItem.handler));

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
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('type').exists().trim().escape().isIn(['service', 'product']),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('cost_price').exists().isNumeric(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('sell_price').exists().isNumeric(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('cost_account_id').exists().isInt().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('sell_account_id').exists().isInt().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('category_id').optional().isInt().toInt(),

    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('custom_fields').optional().isArray({ min: 1 }),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('custom_fields.*.key').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('custom_fields.*.value').exists(),

    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('note').optional()],

    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(req, res) {var validationErrors, form, errorReasons, costAccountPromise, sellAccountPromise, itemCategoryPromise, customFieldsKeys, resource, fields, storedFieldsKey, notFoundFields, _ref, _ref2, costAccount, sellAccount, itemCategory, item;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context.next = 3;break;}return _context.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                form = _objectSpread({
                  custom_fields: [] },
                req.body);

                errorReasons = [];

                costAccountPromise = _models_Account__WEBPACK_IMPORTED_MODULE_11__["default"].query().findById(form.cost_account_id);
                sellAccountPromise = _models_Account__WEBPACK_IMPORTED_MODULE_11__["default"].query().findById(form.sell_account_id);
                itemCategoryPromise = form.category_id ?
                _models_ItemCategory__WEBPACK_IMPORTED_MODULE_12__["default"].query().findById(form.category_id) : null;

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
                res.boom.badRequest(null, { errors: errorReasons }));case 31:_context.next = 33;return (

                  _models_Item__WEBPACK_IMPORTED_MODULE_10__["default"].query().insertAndFetch({
                    name: form.name,
                    type: form.type,
                    cost_price: form.cost_price,
                    sell_price: form.sell_price,
                    sell_account_id: form.sell_account_id,
                    cost_account_id: form.cost_account_id,
                    currency_code: form.currency_code,
                    note: form.note }));case 33:item = _context.sent;return _context.abrupt("return",

                res.status(200).send({ id: item.id }));case 35:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                             * Edit the given item.
                                                                                                                                                                                                             */
  editItem: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('name').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('type').exists().trim().escape().isIn(['product', 'service']),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('cost_price').exists().isNumeric(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('sell_price').exists().isNumeric(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('cost_account_id').exists().isInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('sell_account_id').exists().isInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('category_id').optional().isInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('note').optional()],

    handler: function () {var _handler2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(req, res) {var validationErrors, id, form, item, errorReasons, costAccountPromise, sellAccountPromise, itemCategoryPromise, _ref3, _ref4, costAccount, sellAccount, itemCategory, updatedItem;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context2.next = 3;break;}return _context2.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:



                id = req.params.id;
                form = _objectSpread({
                  custom_fields: [] },
                req.body);_context2.next = 7;return (

                  _models_Item__WEBPACK_IMPORTED_MODULE_10__["default"].query().findById(id));case 7:item = _context2.sent;if (

                item) {_context2.next = 10;break;}return _context2.abrupt("return",
                res.boom.notFound(null, { errors: [
                  { type: 'ITEM.NOT.FOUND', code: 100 }] }));case 10:


                errorReasons = [];

                costAccountPromise = _models_Account__WEBPACK_IMPORTED_MODULE_11__["default"].query().findById(form.cost_account_id);
                sellAccountPromise = _models_Account__WEBPACK_IMPORTED_MODULE_11__["default"].query().findById(form.sell_account_id);
                itemCategoryPromise = form.category_id ?
                _models_ItemCategory__WEBPACK_IMPORTED_MODULE_12__["default"].query().findById(form.category_id) : null;_context2.next = 16;return (

                  Promise.all([
                  costAccountPromise, sellAccountPromise, itemCategoryPromise]));case 16:_ref3 = _context2.sent;_ref4 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_ref3, 3);costAccount = _ref4[0];sellAccount = _ref4[1];itemCategory = _ref4[2];

                if (!costAccount) {
                  errorReasons.push({ type: 'COST_ACCOUNT_NOT_FOUND', code: 100 });
                }
                if (!sellAccount) {
                  errorReasons.push({ type: 'SELL_ACCOUNT_NOT_FOUND', code: 120 });
                }
                if (!itemCategory && form.category_id) {
                  errorReasons.push({ type: 'ITEM_CATEGORY_NOT_FOUND', code: 140 });
                }if (!(
                errorReasons.length > 0)) {_context2.next = 26;break;}return _context2.abrupt("return",
                res.boom.badRequest(null, { errors: errorReasons }));case 26:_context2.next = 28;return (


                  _models_Item__WEBPACK_IMPORTED_MODULE_10__["default"].query().findById(id).patch({
                    name: form.name,
                    type: form.type,
                    cost_price: form.cost_price,
                    sell_price: form.sell_price,
                    currency_code: form.currency_code,
                    sell_account_id: form.sell_account_id,
                    cost_account_id: form.cost_account_id,
                    category_id: form.category_id,
                    note: form.note }));case 28:updatedItem = _context2.sent;return _context2.abrupt("return",

                res.status(200).send({ id: updatedItem.id }));case 30:case "end":return _context2.stop();}}}, _callee2);}));function handler(_x3, _x4) {return _handler2.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                        * Delete the given item from the storage.
                                                                                                                                                                                                                        */
  deleteItem: {
    validation: [],
    handler: function () {var _handler3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(req, res) {var id, item;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                id = req.params.id;_context3.next = 3;return (
                  _models_Item__WEBPACK_IMPORTED_MODULE_10__["default"].query().findById(id));case 3:item = _context3.sent;if (

                item) {_context3.next = 6;break;}return _context3.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'ITEM_NOT_FOUND', code: 100 }] }));case 6:_context3.next = 8;return (




                  _models_Item__WEBPACK_IMPORTED_MODULE_10__["default"].query().findById(item.id)["delete"]());case 8:return _context3.abrupt("return",

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
/* harmony import */ var _http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/http/middleware/jwtAuth */ "./src/http/middleware/jwtAuth.js");
/* harmony import */ var _models_Resource__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/models/Resource */ "./src/models/Resource.js");
/* harmony import */ var _models_View__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/models/View */ "./src/models/View.js");
/* harmony import */ var _models_ViewRole__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/models/ViewRole */ "./src/models/ViewRole.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}








/* harmony default export */ __webpack_exports__["default"] = ({
  resource: 'items',

  /**
                      * Router constructor.
                      */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_4___default.a.Router();

    router.use(_http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_7__["default"]);

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

    router.get('/resource/:resource_name',
    this.getResourceViews.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.getResourceViews.handler));

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
                  _models_View__WEBPACK_IMPORTED_MODULE_9__["default"].where('resource_id', resourceId).fetchAll());case 3:views = _context.sent;return _context.abrupt("return",

                res.status(200).send({ views: views.toJSON() }));case 5:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },



  getView: {
    handler: function () {var _handler2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee2(req, res) {var viewId, view;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                viewId = req.params.view_id;_context2.next = 3;return (
                  _models_View__WEBPACK_IMPORTED_MODULE_9__["default"].where('id', viewId).fetch({
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
                  _models_View__WEBPACK_IMPORTED_MODULE_9__["default"].query().findById(viewId));case 3:view = _context3.sent;if (

                view) {_context3.next = 6;break;}return _context3.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'VIEW_NOT_FOUND', code: 100 }] }));case 6:if (!


                view.predefined) {_context3.next = 8;break;}return _context3.abrupt("return",
                res.boom.badRequest(null, {
                  errors: [{ type: 'PREDEFINED_VIEW', code: 200 }] }));case 8:_context3.next = 10;return (


                  Promise.all([
                  view.$relatedQuery('viewRoles')["delete"](),
                  view.$relatedQuery('columns')["delete"]()]));case 10:_context3.next = 12;return (

                  view["delete"]());case 12:return _context3.abrupt("return",

                res.status(200).send({ id: view.get('id') }));case 13:case "end":return _context3.stop();}}}, _callee3);}));function handler(_x5, _x6) {return _handler3.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                        * Creates a new view.
                                                                                                                                                                                                                        */
  createView: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('resource_name').exists().escape().trim(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('label').exists().escape().trim(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('columns').exists().isArray({ min: 1 }),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles').isArray(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles.*.field').exists().escape().trim(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles.*.comparator').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles.*.value').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles.*.index').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('columns').exists().isArray(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('columns.*.field').exists().escape().trim(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('columns.*.index').exists().isNumeric().toInt()],

    handler: function () {var _handler4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee4(req, res) {var validationErrors, form, resource, errorReasons, fieldsSlugs, resourceFields, resourceFieldsKeys, notFoundFields, notFoundColumns, view, saveViewRolesOpers;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context4.next = 3;break;}return _context4.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                form = _objectSpread({}, req.body);_context4.next = 6;return (
                  _models_Resource__WEBPACK_IMPORTED_MODULE_8__["default"].query().where('name', form.resource_name).first());case 6:resource = _context4.sent;if (

                resource) {_context4.next = 9;break;}return _context4.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'RESOURCE_NOT_FOUND', code: 100 }] }));case 9:


                errorReasons = [];
                fieldsSlugs = form.roles.map(function (role) {return role.field;});_context4.next = 13;return (

                  resource.$relatedQuery('fields'));case 13:resourceFields = _context4.sent;
                resourceFieldsKeys = resourceFields.map(function (f) {return f.slug;});

                // The difference between the stored resource fields and submit fields keys.
                notFoundFields = Object(lodash__WEBPACK_IMPORTED_MODULE_3__["difference"])(fieldsSlugs, resourceFieldsKeys);

                if (notFoundFields.length > 0) {
                  errorReasons.push({ type: 'RESOURCE_FIELDS_NOT_EXIST', code: 100, fields: notFoundFields });
                }
                // The difference between the stored resource fields and the submit columns keys.
                notFoundColumns = Object(lodash__WEBPACK_IMPORTED_MODULE_3__["difference"])(form.columns, resourceFieldsKeys);

                if (notFoundColumns.length > 0) {
                  errorReasons.push({ type: 'COLUMNS_NOT_EXIST', code: 200, columns: notFoundColumns });
                }if (!(
                errorReasons.length > 0)) {_context4.next = 21;break;}return _context4.abrupt("return",
                res.boom.badRequest(null, { errors: errorReasons }));case 21:_context4.next = 23;return (



                  _models_View__WEBPACK_IMPORTED_MODULE_9__["default"].query().insert({
                    name: form.label,
                    predefined: false,
                    resource_id: resource.id }));case 23:view = _context4.sent;


                // Save view roles async operations.
                saveViewRolesOpers = [];

                form.roles.forEach(function (role) {
                  var fieldModel = resourceFields.find(function (f) {return f.slug === role.field;});

                  var oper = _models_ViewRole__WEBPACK_IMPORTED_MODULE_10__["default"].query().insert(_objectSpread({},
                  Object(lodash__WEBPACK_IMPORTED_MODULE_3__["pick"])(role, ['comparator', 'value', 'index']), {
                    field_id: fieldModel.id,
                    view_id: view.id }));

                  saveViewRolesOpers.push(oper);
                });_context4.next = 28;return (
                  Promise.all(saveViewRolesOpers));case 28:return _context4.abrupt("return",

                res.status(200).send({ id: view.id }));case 29:case "end":return _context4.stop();}}}, _callee4);}));function handler(_x7, _x8) {return _handler4.apply(this, arguments);}return handler;}() },



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


                  _models_View__WEBPACK_IMPORTED_MODULE_9__["default"].where('id', viewId).fetch());case 6:view = _context5.sent;if (

                view) {_context5.next = 9;break;}return _context5.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'ROLE_NOT_FOUND', code: 100 }] }));case 9:return _context5.abrupt("return",



                res.status(200).send());case 10:case "end":return _context5.stop();}}}, _callee5);}));function handler(_x9, _x10) {return _handler5.apply(this, arguments);}return handler;}() },



  getResourceViews: {
    validation: [],


    handler: function () {var _handler6 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee6(req, res) {return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:case "end":return _context6.stop();}}}, _callee6);}));function handler(_x11, _x12) {return _handler6.apply(this, arguments);}return handler;}() } });

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
/* harmony import */ var _http_controllers_BudgetReports__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @/http/controllers/BudgetReports */ "./src/http/controllers/BudgetReports.js");
/* harmony import */ var _http_controllers_Customers__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @/http/controllers/Customers */ "./src/http/controllers/Customers.js");
/* harmony import */ var _http_controllers_Suppliers__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @/http/controllers/Suppliers */ "./src/http/controllers/Suppliers.js");
/* harmony import */ var _http_controllers_Bills__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @/http/controllers/Bills */ "./src/http/controllers/Bills.js");
/* harmony import */ var _controllers_CurrencyAdjustment__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./controllers/CurrencyAdjustment */ "./src/http/controllers/CurrencyAdjustment.js");
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
  app.use('/api/accounts_opening_balances', _http_controllers_AccountOpeningBalance__WEBPACK_IMPORTED_MODULE_6__["default"].router());
  app.use('/api/views', _http_controllers_Views__WEBPACK_IMPORTED_MODULE_7__["default"].router());
  app.use('/api/fields', _http_controllers_Fields__WEBPACK_IMPORTED_MODULE_8__["default"].router());
  app.use('/api/items', _http_controllers_Items__WEBPACK_IMPORTED_MODULE_3__["default"].router());
  app.use('/api/item_categories', _http_controllers_ItemCategories__WEBPACK_IMPORTED_MODULE_4__["default"].router());
  app.use('/api/expenses', _http_controllers_Expenses__WEBPACK_IMPORTED_MODULE_11__["default"].router());
  app.use('/api/financial_statements', _http_controllers_FinancialStatements__WEBPACK_IMPORTED_MODULE_10__["default"].router());
  app.use('/api/options', _http_controllers_Options__WEBPACK_IMPORTED_MODULE_12__["default"].router());
  app.use('/api/budget_reports', _http_controllers_BudgetReports__WEBPACK_IMPORTED_MODULE_14__["default"].router());
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
  function MetableCollection() {var _this = this;_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default()(this, MetableCollection);
    this.metadata = [];
    this.KEY_COLUMN = 'key';
    this.VALUE_COLUMN = 'value';
    this.TYPE_COLUMN = 'type';
    this.model = null;
    this.extraColumns = [];

    this.extraQuery = function (query, meta) {
      query.where('key', meta[_this.KEY_COLUMN]);
    };
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
      this.metadata = this.metadata.map(function (meta) {return _objectSpread({},
        meta, {
          markAsDeleted: true });});

    } }, { key: "setExtraQuery", value: function setExtraQuery(

    callback) {
      this.extraQuery = callback;
    }

    /**
       * Set the meta data to the stack.
       * @param {String} key -
       * @param {String} value -
       */ }, { key: "setMeta", value: function setMeta(
    key, value, payload) {var _this2 = this;
      if (Array.isArray(key)) {
        var _metadata = key;

        _metadata.forEach(function (meta) {
          _this2.setMeta(meta.key, meta.value);
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
       */ }, { key: "saveMeta", value: function () {var _saveMeta = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {var _this3 = this;var inserted, updated, deleted, opers;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:

                inserted = this.metadata.filter(function (m) {return m.markAsInserted === true;});
                updated = this.metadata.filter(function (m) {return m.markAsUpdated === true;});
                deleted = this.metadata.filter(function (m) {return m.markAsDeleted === true;});
                opers = [];

                if (deleted.length > 0) {
                  deleted.forEach(function (meta) {
                    var deleteOper = _this3.model.query().beforeRun(function (query, result) {
                      _this3.extraQuery(query, meta);
                      return result;
                    })["delete"]();
                    opers.push(deleteOper);
                  });
                }
                inserted.forEach(function (meta) {var _objectSpread2;
                  var insertOper = _this3.model.query().insert(_objectSpread((_objectSpread2 = {}, _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(_objectSpread2,
                  _this3.KEY_COLUMN, meta.key), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(_objectSpread2,
                  _this3.VALUE_COLUMN, meta.value), _objectSpread2),
                  _this3.extraColumns.reduce(function (obj, column) {
                    if (typeof meta[column] !== 'undefined') {
                      obj[column] = meta[column];
                    }
                    return obj;
                  }, {})));

                  opers.push(insertOper);
                });
                updated.forEach(function (meta) {
                  var updateOper = _this3.model.query().onBuild(function (query) {
                    _this3.extraQuery(query, meta);
                  }).patch(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()({},
                  _this3.VALUE_COLUMN, meta.value));

                  opers.push(updateOper);
                });_context.next = 9;return (
                  Promise.all(opers));case 9:case "end":return _context.stop();}}}, _callee, this);}));function saveMeta() {return _saveMeta.apply(this, arguments);}return saveMeta;}()


    /**
                                                                                                                                                                                          * Loads the metadata from the storage.
                                                                                                                                                                                          * @param {String|Array} key -
                                                                                                                                                                                          * @param {Boolean} force -
                                                                                                                                                                                          */ }, { key: "load", value: function () {var _load = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2() {var _this4 = this;var metadata, metadataArray;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (

                  this.query());case 2:metadata = _context2.sent;

                metadataArray = this.mapMetadataCollection(metadata);
                metadataArray.forEach(function (meta) {
                  _this4.metadata.push(meta);
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
    metadata) {var _this5 = this;var parseType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'parse';
      return metadata.map(function (model) {return _this5.mapMetadataToCollection(model, parseType);});
    }

    /**
       * Load metadata to the metable collection.
       * @param {Array} meta -
       */ }, { key: "from", value: function from(
    meta) {var _this6 = this;
      if (Array.isArray(meta)) {
        meta.forEach(function (m) {_this6.from(m);});
        return;
      }
      this.metadata.push(meta);
    } }, { key: "toArray", value: function toArray()


    {
      return this.metadata;
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   */balance: { relation: objection__WEBPACK_IMPORTED_MODULE_6__["Model"].HasOneRelation, modelClass: AccountBalance["default"], join: { from: 'accounts.id', to: 'account_balances.accountId' } }, /**
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
      return 'account_balances';
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
                                */get: function get() {return 'budgets';} }, { key: "virtualAttributes", get: function get() {return ['rangeBy', 'rangeIncrement'];} /**
                                                                                                                                                                      * Model modifiers.
                                                                                                                                                                      */ }, { key: "modifiers", get: function get() {return { filterByYear: function filterByYear(query, year) {query.where('year', year);}, filterByIncomeStatement: function filterByIncomeStatement(query) {query.where('account_types', 'income_statement');}, filterByProfitLoss: function filterByProfitLoss(query) {query.where('accounts_types', 'profit_loss');} };} }]);return Budget;}(_models_Model__WEBPACK_IMPORTED_MODULE_5__["default"]);

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

/***/ "./src/models/ManualJournal.js":
/*!*************************************!*\
  !*** ./src/models/ManualJournal.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ManualJournal; });
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

ManualJournal = /*#__PURE__*/function (_BaseModel) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(ManualJournal, _BaseModel);function ManualJournal() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, ManualJournal);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(ManualJournal).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(ManualJournal, null, [{ key: "tableName",
    /**
                                                                                                                                                                                                                                                                                                                * Table name.
                                                                                                                                                                                                                                                                                                                */get: function get()
    {
      return 'manual_journals';
    } }]);return ManualJournal;}(_models_Model__WEBPACK_IMPORTED_MODULE_5__["default"]);

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
        if (Array.isArray(result)) {
          return _this.collection.from(result);
        }
        return result;
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
/* harmony import */ var _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/get */ "@babel/runtime/helpers/get");
/* harmony import */ var _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "@babel/runtime/helpers/inherits");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! objection */ "objection");
/* harmony import */ var objection__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(objection__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _models_Model__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/models/Model */ "./src/models/Model.js");
/* harmony import */ var _lib_Metable_MetableCollection__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/lib/Metable/MetableCollection */ "./src/lib/Metable/MetableCollection.js");


var

Option = /*#__PURE__*/function (_mixin) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(Option, _mixin);function Option() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Option);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(Option).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Option, null, [{ key: "query",







    /**
                                                                                                                                                                                                                                                          * Override the model query.
                                                                                                                                                                                                                                                          * @param  {...any} args -
                                                                                                                                                                                                                                                          */value: function query()
    {var _get2;for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
      return (_get2 = _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_4___default()(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(Option), "query", this)).call.apply(_get2, [this].concat(args)).runAfter(function (result) {
        if (result instanceof _lib_Metable_MetableCollection__WEBPACK_IMPORTED_MODULE_8__["default"]) {
          result.setModel(Option);
        }
        return result;
      });
    } }, { key: "tableName", /**
                              * Table name.
                              */get: function get() {return 'options';} }, { key: "collection", get: function get() {
      return _lib_Metable_MetableCollection__WEBPACK_IMPORTED_MODULE_8__["default"];
    } }]);return Option;}(Object(objection__WEBPACK_IMPORTED_MODULE_6__["mixin"])(_models_Model__WEBPACK_IMPORTED_MODULE_7__["default"], [objection__WEBPACK_IMPORTED_MODULE_6__["mixin"]]));

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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Resource; });
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
      var View = __webpack_require__(/*! @/models/View */ "./src/models/View.js");
      var ResourceField = __webpack_require__(/*! @/models/ResourceField */ "./src/models/ResourceField.js");
      var Permission = __webpack_require__(/*! @/models/Permission */ "./src/models/Permission.js");

      return {
        /**
                * Resource model may has many views.
                */
        views: {
          relation: objection__WEBPACK_IMPORTED_MODULE_6__["Model"].HasManyRelation,
          modelClass: View["default"],
          join: {
            from: 'resources.id',
            to: 'views.resourceId' } },



        /**
                                         * Resource model may has many fields.
                                         */
        fields: {
          relation: objection__WEBPACK_IMPORTED_MODULE_6__["Model"].HasManyRelation,
          modelClass: ResourceField["default"],
          join: {
            from: 'resources.id',
            to: 'resource_fields.resourceId' } },



        /**
                                                   * Resource model may has many associated permissions.
                                                   */
        permissions: {
          relation: objection__WEBPACK_IMPORTED_MODULE_6__["Model"].ManyToManyRelation,
          modelClass: Permission["default"],
          join: {
            from: 'resources.id',
            through: {
              from: 'role_has_permissions.resourceId',
              to: 'role_has_permissions.permissionId' },

            to: 'permissions.id' } } };



    } }]);return Resource;}(_models_Model__WEBPACK_IMPORTED_MODULE_7__["default"]);

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
                                    */get: function get() {return 'resource_fields';} }, { key: "jsonAttributes", get: function get() {return ['options'];} /**
                                                                                                                                                             * Model modifiers.
                                                                                                                                                             */ }, { key: "modifiers", get: function get() {return { whereNotPredefined: function whereNotPredefined(query) {query.whereNot('predefined', true);} };} /**
                                                                                                                                                                                                                                                                                                                       * Timestamp columns.
                                                                                                                                                                                                                                                                                                                       */ }, { key: "hasTimestamps", get: function get() {return false;} /**
                                                                                                                                                                                                                                                                                                                                                                                          * Virtual attributes.
                                                                                                                                                                                                                                                                                                                                                                                          */ }, { key: "virtualAttributes", get: function get() {return ['key'];} }, { key: "relationMappings", get: function get() {return { /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * Resource field may belongs to resource model.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */resource: { relation: objection__WEBPACK_IMPORTED_MODULE_6__["Model"].BelongsToOneRelation, modelBase: path__WEBPACK_IMPORTED_MODULE_7___default.a.join(__dirname, 'Resource'), join: { from: 'resource_fields.resource_id',
            to: 'resources.id' } } };



    } }]);return ResourceField;}(_models_Model__WEBPACK_IMPORTED_MODULE_8__["default"]);
/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./src/models/ResourceFieldMetadata.js":
/*!*********************************************!*\
  !*** ./src/models/ResourceFieldMetadata.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ResourceFieldMetadata; });
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
/* harmony import */ var _collection_ResourceFieldMetadataCollection__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/collection/ResourceFieldMetadataCollection */ "./src/collection/ResourceFieldMetadataCollection.js");



var

ResourceFieldMetadata = /*#__PURE__*/function (_BaseModel) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(ResourceFieldMetadata, _BaseModel);function ResourceFieldMetadata() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, ResourceFieldMetadata);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(ResourceFieldMetadata).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(ResourceFieldMetadata, null, [{ key: "tableName",
    /**
                                                                                                                                                                                                                                                                                                                                                                * Table name.
                                                                                                                                                                                                                                                                                                                                                                */get: function get()
    {
      return 'resource_custom_fields_metadata';
    }

    /**
       * Override the resource field metadata collection.
       */ }, { key: "collection", get: function get()
    {
      return _collection_ResourceFieldMetadataCollection__WEBPACK_IMPORTED_MODULE_8__["default"];
    }

    /**
       * Relationship mapping.
       */ }, { key: "relationMappings", get: function get()
    {
      return {
        /**
                * Resource field may belongs to resource model.
                */
        resource: {
          relation: objection__WEBPACK_IMPORTED_MODULE_5__["Model"].BelongsToOneRelation,
          modelBase: path__WEBPACK_IMPORTED_MODULE_6___default.a.join(__dirname, 'Resource'),
          join: {
            from: 'resource_fields.resource_id',
            to: 'resources.id' } } };



    } }]);return ResourceFieldMetadata;}(_models_Model__WEBPACK_IMPORTED_MODULE_7__["default"]);
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return View; });
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
      var Resource = __webpack_require__(/*! @/models/Resource */ "./src/models/Resource.js");
      var ViewColumn = __webpack_require__(/*! @/models/ViewColumn */ "./src/models/ViewColumn.js");
      var ViewRole = __webpack_require__(/*! @/models/ViewRole */ "./src/models/ViewRole.js");

      return {
        /**
                * View model belongs to resource model.
                */
        resource: {
          relation: objection__WEBPACK_IMPORTED_MODULE_6__["Model"].BelongsToOneRelation,
          modelClass: Resource["default"],
          join: {
            from: 'views.resourceId',
            to: 'resources.id' } },



        /**
                                     * View model may has many columns.
                                     */
        columns: {
          relation: objection__WEBPACK_IMPORTED_MODULE_6__["Model"].HasManyRelation,
          modelClass: ViewColumn["default"],
          join: {
            from: 'views.id',
            to: 'view_has_columns.view_id' } },



        /**
                                                 * View model may has many view roles.
                                                 */
        viewRoles: {
          relation: objection__WEBPACK_IMPORTED_MODULE_6__["Model"].HasManyRelation,
          modelClass: ViewRole["default"],
          join: {
            from: 'views.id',
            to: 'view_roles.view_id' } } };



    } }]);return View;}(_models_Model__WEBPACK_IMPORTED_MODULE_7__["default"]);

/***/ }),

/***/ "./src/models/ViewColumn.js":
/*!**********************************!*\
  !*** ./src/models/ViewColumn.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ViewColumn; });
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

ViewColumn = /*#__PURE__*/function (_BaseModel) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(ViewColumn, _BaseModel);function ViewColumn() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, ViewColumn);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(ViewColumn).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(ViewColumn, null, [{ key: "tableName",
    /**
                                                                                                                                                                                                                                                                                              * Table name.
                                                                                                                                                                                                                                                                                              */get: function get()
    {
      return 'view_has_columns';
    }

    /**
       * Timestamp columns.
       */ }, { key: "hasTimestamps", get: function get()
    {
      return false;
    } }]);return ViewColumn;}(_models_Model__WEBPACK_IMPORTED_MODULE_5__["default"]);

/***/ }),

/***/ "./src/models/ViewRole.js":
/*!********************************!*\
  !*** ./src/models/ViewRole.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ViewRole; });
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

ViewRole = /*#__PURE__*/function (_BaseModel) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(ViewRole, _BaseModel);function ViewRole() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, ViewRole);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(ViewRole).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(ViewRole, null, [{ key: "tableName",
    /**
                                                                                                                                                                                                                                                                                  * Table name.
                                                                                                                                                                                                                                                                                  */get: function get()
    {
      return 'view_roles';
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
                * View role model may belongs to view model.
                */
        view: {
          relation: objection__WEBPACK_IMPORTED_MODULE_5__["Model"].BelongsToOneRelation,
          modelBase: path__WEBPACK_IMPORTED_MODULE_6___default.a.join(__dirname, 'View'),
          join: {
            from: 'view_roles.view_id',
            to: 'views.id' } } };



    } }]);return ViewRole;}(_models_Model__WEBPACK_IMPORTED_MODULE_7__["default"]);
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

/***/ "./src/services/CustomFields/ResourceCustomFieldRepository.js":
/*!********************************************************************!*\
  !*** ./src/services/CustomFields/ResourceCustomFieldRepository.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ResourceCustomFieldRepository; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _models_Resource__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/models/Resource */ "./src/models/Resource.js");
/* harmony import */ var _models_ResourceField__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/models/ResourceField */ "./src/models/ResourceField.js");
/* harmony import */ var _models_ResourceFieldMetadata__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/models/ResourceFieldMetadata */ "./src/models/ResourceFieldMetadata.js");
/* harmony import */ var _collection_ResourceFieldMetadataCollection__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/collection/ResourceFieldMetadataCollection */ "./src/collection/ResourceFieldMetadataCollection.js");



var

ResourceCustomFieldRepository = /*#__PURE__*/function () {
  /**
                                                           * Class constructor.
                                                           */
  function ResourceCustomFieldRepository(model) {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, ResourceCustomFieldRepository);
    if (typeof model === 'function') {
      this.resourceName = model.name;
    } else if (typeof model === 'string') {
      this.resourceName = model;
    }
    // Custom fields of the given resource.
    this.customFields = [];
    this.filledCustomFields = {};

    // metadata of custom fields of the given resource.
    this.fieldsMetadata = {};
    this.resource = {};
  }

  /**
     * Fetches metadata of custom fields of the given resource.
     * @param {Integer} id - Resource item id.
     */_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default()(ResourceCustomFieldRepository, [{ key: "fetchCustomFieldsMetadata", value: function () {var _fetchCustomFieldsMetadata = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(
      id) {var metadata;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (!(
                typeof id === 'undefined')) {_context.next = 2;break;}throw (
                  new Error('Please define the resource item id.'));case 2:if (

                this.resource) {_context.next = 4;break;}throw (
                  new Error('Target resource model is not found.'));case 4:_context.next = 6;return (

                  _models_ResourceFieldMetadata__WEBPACK_IMPORTED_MODULE_6__["default"].query().
                  where('resource_id', this.resource.id).
                  where('resource_item_id', id));case 6:metadata = _context.sent;

                this.fieldsMetadata[id] = metadata;case 8:case "end":return _context.stop();}}}, _callee, this);}));function fetchCustomFieldsMetadata(_x) {return _fetchCustomFieldsMetadata.apply(this, arguments);}return fetchCustomFieldsMetadata;}()


    /**
                                                                                                                                                                                                                                                            * Load resource.
                                                                                                                                                                                                                                                            */ }, { key: "loadResource", value: function () {var _loadResource = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2() {var resource;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (

                  _models_Resource__WEBPACK_IMPORTED_MODULE_4__["default"].query().where('name', this.resourceName).first());case 2:resource = _context2.sent;if (

                resource) {_context2.next = 5;break;}throw (
                  new Error('There is no stored resource in the storage with the given model name.'));case 5:

                this.setResource(resource);case 6:case "end":return _context2.stop();}}}, _callee2, this);}));function loadResource() {return _loadResource.apply(this, arguments);}return loadResource;}()


    /**
                                                                                                                                                                                                             * Load metadata of the resource.
                                                                                                                                                                                                             */ }, { key: "loadResourceCustomFields", value: function () {var _loadResourceCustomFields = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3() {var customFields;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:if (!(

                typeof this.resource.id === 'undefined')) {_context3.next = 2;break;}throw (
                  new Error('Please fetch resource details before fetch custom fields of the resource.'));case 2:_context3.next = 4;return (

                  _models_ResourceField__WEBPACK_IMPORTED_MODULE_5__["default"].query().
                  where('resource_id', this.resource.id).
                  modify('whereNotPredefined'));case 4:customFields = _context3.sent;

                this.setResourceCustomFields(customFields);case 6:case "end":return _context3.stop();}}}, _callee3, this);}));function loadResourceCustomFields() {return _loadResourceCustomFields.apply(this, arguments);}return loadResourceCustomFields;}()


    /**
                                                                                                                                                                                                                                                                 * Sets resource model.
                                                                                                                                                                                                                                                                 * @param {Resource} resource -
                                                                                                                                                                                                                                                                 */ }, { key: "setResource", value: function setResource(
    resource) {
      this.resource = resource;
    }

    /**
       * Sets resource custom fields collection.
       * @param {Array} customFields -
       */ }, { key: "setResourceCustomFields", value: function setResourceCustomFields(
    customFields) {
      this.customFields = customFields;
    }

    /**
       * Retrieve metadata of the resource custom fields.
       * @param {Integer} itemId -
       */ }, { key: "getMetadata", value: function getMetadata(
    itemId) {
      return this.fieldsMetadata[itemId] || this.fieldsMetadata;
    }

    /**
       * Fill metadata of the custom fields that associated to the resource.
       * @param {Inter} id - Resource item id.
       * @param {Array} attributes -
       */ }, { key: "fillCustomFields", value: function fillCustomFields(
    id, attributes) {var _this = this;
      if (typeof this.filledCustomFields[id] === 'undefined') {
        this.filledCustomFields[id] = [];
      }
      attributes.forEach(function (attr) {
        _this.filledCustomFields[id].push(attr);

        if (!_this.fieldsMetadata[id]) {
          _this.fieldsMetadata[id] = new _collection_ResourceFieldMetadataCollection__WEBPACK_IMPORTED_MODULE_7__["default"]();
        }
        _this.fieldsMetadata[id].setMeta(attr.key, attr.value, {
          resource_id: _this.resource.id,
          resource_item_id: id });

      });
    }

    /**
       * Saves the instered, updated and deleted  custom fields metadata.
       * @param {Integer} id - Optional resource item id.
       */ }, { key: "saveCustomFields", value: function () {var _saveCustomFields = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(
      id) {var opers;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:if (!
                id) {_context4.next = 7;break;}if (!(
                typeof this.fieldsMetadata[id] === 'undefined')) {_context4.next = 3;break;}throw (
                  new Error('There is no resource item with the given id.'));case 3:_context4.next = 5;return (

                  this.fieldsMetadata[id].saveMeta());case 5:_context4.next = 11;break;case 7:

                opers = [];
                this.fieldsMetadata.forEach(function (metadata) {
                  var oper = metadata.saveMeta();
                  opers.push(oper);
                });_context4.next = 11;return (
                  Promise.all(opers));case 11:case "end":return _context4.stop();}}}, _callee4, this);}));function saveCustomFields(_x2) {return _saveCustomFields.apply(this, arguments);}return saveCustomFields;}()



    /**
                                                                                                                                                                                                                        * Validates the exist custom fields.
                                                                                                                                                                                                                        */ }, { key: "validateExistCustomFields", value: function validateExistCustomFields()
    {

    } }, { key: "toArray", value: function toArray()

    {
      return this.fieldsMetadata.toArray();
    } }, { key: "load", value: function () {var _load = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee5() {return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:_context5.next = 2;return (


                  this.loadResource());case 2:_context5.next = 4;return (
                  this.loadResourceCustomFields());case 4:case "end":return _context5.stop();}}}, _callee5, this);}));function load() {return _load.apply(this, arguments);}return load;}() }], [{ key: "forgeMetadataCollection", value: function forgeMetadataCollection()


    {

    } }]);return ResourceCustomFieldRepository;}();

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
/*! exports provided: hashPassword, origin, dateRangeCollection, dateRangeFormat */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hashPassword", function() { return hashPassword; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "origin", function() { return origin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dateRangeCollection", function() { return dateRangeCollection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dateRangeFormat", function() { return dateRangeFormat; });
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

var dateRangeFormat = function dateRangeFormat(rangeType) {
  switch (rangeType) {
    case 'year':
      return 'YYYY';
    case 'month':
    case 'quarter':
    default:
      return 'YYYY-MM';}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrL2Jvb3RzdHJhcCIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9jb25maWcvaW5kZXguanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIva25leGZpbGUuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2FwcC5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvY29sbGVjdGlvbi9CdWRnZXRFbnRyaWVzU2V0LmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9jb2xsZWN0aW9uL05lc3RlZFNldC9pbmRleC5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvY29sbGVjdGlvbi9SZXNvdXJjZUZpZWxkTWV0YWRhdGFDb2xsZWN0aW9uLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9kYXRhYmFzZS9rbmV4LmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9odHRwL2NvbnRyb2xsZXJzL0FjY291bnRPcGVuaW5nQmFsYW5jZS5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9BY2NvdW50aW5nLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9odHRwL2NvbnRyb2xsZXJzL0FjY291bnRzLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9odHRwL2NvbnRyb2xsZXJzL0F1dGhlbnRpY2F0aW9uLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9odHRwL2NvbnRyb2xsZXJzL0JpbGxzLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9odHRwL2NvbnRyb2xsZXJzL0J1ZGdldC5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9CdWRnZXRSZXBvcnRzLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9odHRwL2NvbnRyb2xsZXJzL0N1cnJlbmN5QWRqdXN0bWVudC5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9DdXN0b21lcnMuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvY29udHJvbGxlcnMvRXhwZW5zZXMuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvY29udHJvbGxlcnMvRmllbGRzLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9odHRwL2NvbnRyb2xsZXJzL0ZpbmFuY2lhbFN0YXRlbWVudHMuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvY29udHJvbGxlcnMvSXRlbUNhdGVnb3JpZXMuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvY29udHJvbGxlcnMvSXRlbXMuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvY29udHJvbGxlcnMvT3B0aW9ucy5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9Sb2xlcy5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9TdXBwbGllcnMuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvY29udHJvbGxlcnMvVXNlcnMuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvY29udHJvbGxlcnMvVmlld3MuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvaW5kZXguanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvbWlkZGxld2FyZS9hc3luY01pZGRsZXdhcmUuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvbWlkZGxld2FyZS9hdXRob3JpemF0aW9uLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9odHRwL21pZGRsZXdhcmUvand0QXV0aC5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvbGliL01ldGFibGUvTWV0YWJsZUNvbGxlY3Rpb24uanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9BY2NvdW50LmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvQWNjb3VudEJhbGFuY2UuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9BY2NvdW50VHJhbnNhY3Rpb24uanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9BY2NvdW50VHlwZS5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL0J1ZGdldC5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL0J1ZGdldEVudHJ5LmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvRXhwZW5zZS5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL0l0ZW0uanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9JdGVtQ2F0ZWdvcnkuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9Kb3VybmFsRW50cnkuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9NYW51YWxKb3VybmFsLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvTW9kZWwuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9PcHRpb24uanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9QYXNzd29yZFJlc2V0LmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvUGVybWlzc2lvbi5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL1Jlc291cmNlLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvUmVzb3VyY2VGaWVsZC5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL1Jlc291cmNlRmllbGRNZXRhZGF0YS5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL1JvbGUuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9Vc2VyLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvVmlldy5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL1ZpZXdDb2x1bW4uanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9WaWV3Um9sZS5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL2luZGV4LmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9zZXJ2ZXIuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL3NlcnZpY2VzL0FjY291bnRpbmcvSm91cm5hbEVudHJ5LmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9zZXJ2aWNlcy9BY2NvdW50aW5nL0pvdXJuYWxQb3N0ZXIuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL3NlcnZpY2VzL0N1c3RvbUZpZWxkcy9SZXNvdXJjZUN1c3RvbUZpZWxkUmVwb3NpdG9yeS5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvc2VydmljZXMvTW9tZW50L2luZGV4LmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9zZXJ2aWNlcy9tYWlsLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy91dGlscy9pbmRleC5qcyIsImV4dGVybmFsIFwiQGJhYmVsL3BsdWdpbi10cmFuc2Zvcm0tcnVudGltZVwiIiwiZXh0ZXJuYWwgXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2FzeW5jVG9HZW5lcmF0b3JcIiIsImV4dGVybmFsIFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVja1wiIiwiZXh0ZXJuYWwgXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzXCIiLCJleHRlcm5hbCBcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvZGVmaW5lUHJvcGVydHlcIiIsImV4dGVybmFsIFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9nZXRcIiIsImV4dGVybmFsIFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9nZXRQcm90b3R5cGVPZlwiIiwiZXh0ZXJuYWwgXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2luaGVyaXRzXCIiLCJleHRlcm5hbCBcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVyblwiIiwiZXh0ZXJuYWwgXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL3NsaWNlZFRvQXJyYXlcIiIsImV4dGVybmFsIFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy90b0NvbnN1bWFibGVBcnJheVwiIiwiZXh0ZXJuYWwgXCJAYmFiZWwvcnVudGltZS9yZWdlbmVyYXRvclwiIiwiZXh0ZXJuYWwgXCJiY3J5cHRqc1wiIiwiZXh0ZXJuYWwgXCJkb3RlbnZcIiIsImV4dGVybmFsIFwiZXJyb3JoYW5kbGVyXCIiLCJleHRlcm5hbCBcImV4cHJlc3NcIiIsImV4dGVybmFsIFwiZXhwcmVzcy1ib29tXCIiLCJleHRlcm5hbCBcImV4cHJlc3MtdmFsaWRhdG9yXCIiLCJleHRlcm5hbCBcImZzXCIiLCJleHRlcm5hbCBcImhlbG1ldFwiIiwiZXh0ZXJuYWwgXCJqc29ud2VidG9rZW5cIiIsImV4dGVybmFsIFwia25leFwiIiwiZXh0ZXJuYWwgXCJsb2Rhc2hcIiIsImV4dGVybmFsIFwibW9tZW50XCIiLCJleHRlcm5hbCBcIm1vbWVudC1yYW5nZVwiIiwiZXh0ZXJuYWwgXCJtdXN0YWNoZVwiIiwiZXh0ZXJuYWwgXCJub2RlbWFpbGVyXCIiLCJleHRlcm5hbCBcIm9iamVjdGlvblwiIiwiZXh0ZXJuYWwgXCJwYXRoXCIiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJkaXN0L1wiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBkb3RlbnYgZnJvbSAnZG90ZW52JztcblxuZG90ZW52LmNvbmZpZyh7XG4gIHBhdGg6IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnLmVudi50ZXN0JyksXG59KTtcbiIsInJlcXVpcmUoJ2RvdGVudicpLmNvbmZpZygpO1xuXG5jb25zdCBNSUdSQVRJT05TX0RJUiA9ICcuL3NyYy9kYXRhYmFzZS9taWdyYXRpb25zJztcbmNvbnN0IFNFRURTX0RJUiA9ICcuL3NyYy9kYXRhYmFzZS9zZWVkcyc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB0ZXN0OiB7XG4gICAgY2xpZW50OiBwcm9jZXNzLmVudi5EQl9DTElFTlQsXG4gICAgbWlncmF0aW9uczoge1xuICAgICAgZGlyZWN0b3J5OiBNSUdSQVRJT05TX0RJUixcbiAgICB9LFxuICAgIGNvbm5lY3Rpb246IHtcbiAgICAgIGhvc3Q6IHByb2Nlc3MuZW52LkRCX0hPU1QsXG4gICAgICB1c2VyOiBwcm9jZXNzLmVudi5EQl9VU0VSLFxuICAgICAgcGFzc3dvcmQ6IHByb2Nlc3MuZW52LkRCX1BBU1NXT1JELFxuICAgICAgZGF0YWJhc2U6IHByb2Nlc3MuZW52LkRCX05BTUUsXG4gICAgICBjaGFyc2V0OiAndXRmOCcsXG4gICAgfSxcbiAgfSxcbiAgZGV2ZWxvcG1lbnQ6IHtcbiAgICBjbGllbnQ6IHByb2Nlc3MuZW52LkRCX0NMSUVOVCxcbiAgICBjb25uZWN0aW9uOiB7XG4gICAgICBob3N0OiBwcm9jZXNzLmVudi5EQl9IT1NULFxuICAgICAgdXNlcjogcHJvY2Vzcy5lbnYuREJfVVNFUixcbiAgICAgIHBhc3N3b3JkOiBwcm9jZXNzLmVudi5EQl9QQVNTV09SRCxcbiAgICAgIGRhdGFiYXNlOiBwcm9jZXNzLmVudi5EQl9OQU1FLFxuICAgICAgY2hhcnNldDogJ3V0ZjgnLFxuICAgIH0sXG4gICAgbWlncmF0aW9uczoge1xuICAgICAgZGlyZWN0b3J5OiBNSUdSQVRJT05TX0RJUixcbiAgICB9LFxuICAgIHNlZWRzOiB7XG4gICAgICBkaXJlY3Rvcnk6IFNFRURTX0RJUixcbiAgICB9LFxuICB9LFxuICBwcm9kdWN0aW9uOiB7XG4gICAgY2xpZW50OiBwcm9jZXNzLmVudi5EQl9DTElFTlQsXG4gICAgY29ubmVjdGlvbjoge1xuICAgICAgaG9zdDogcHJvY2Vzcy5lbnYuREJfSE9TVCxcbiAgICAgIHVzZXI6IHByb2Nlc3MuZW52LkRCX1VTRVIsXG4gICAgICBwYXNzd29yZDogcHJvY2Vzcy5lbnYuREJfUEFTU1dPUkQsXG4gICAgICBkYXRhYmFzZTogcHJvY2Vzcy5lbnYuREJfTkFNRSxcbiAgICAgIGNoYXJzZXQ6ICd1dGY4JyxcbiAgICB9LFxuICAgIG1pZ3JhdGlvbnM6IHtcbiAgICAgIGRpcmVjdG9yeTogTUlHUkFUSU9OU19ESVIsXG4gICAgfSxcbiAgICBzZWVkczoge1xuICAgICAgZGlyZWN0b3J5OiBTRUVEU19ESVIsXG4gICAgfSxcbiAgfSxcbn07XG4iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCBoZWxtZXQgZnJvbSAnaGVsbWV0JztcbmltcG9ydCBib29tIGZyb20gJ2V4cHJlc3MtYm9vbSc7XG5pbXBvcnQgJy4uL2NvbmZpZyc7XG5pbXBvcnQgcm91dGVzIGZyb20gJ0AvaHR0cCc7XG5pbXBvcnQgJ0AvbW9kZWxzJztcblxuY29uc3QgYXBwID0gZXhwcmVzcygpO1xuXG4vLyBFeHByZXNzIGNvbmZpZ3VyYXRpb25cbmFwcC5zZXQoJ3BvcnQnLCBwcm9jZXNzLmVudi5QT1JUIHx8IDMwMDApO1xuXG5hcHAudXNlKGhlbG1ldCgpKTtcbmFwcC51c2UoYm9vbSgpKTtcbmFwcC51c2UoZXhwcmVzcy5qc29uKCkpO1xuXG5yb3V0ZXMoYXBwKTtcblxuZXhwb3J0IGRlZmF1bHQgYXBwO1xuIiwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1ZGdldEVudHJpZXNTZXQge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYWNjb3VudHMgPSB7fTsgXG4gICAgdGhpcy50b3RhbFN1bW1hcnkgPSB7fVxuICAgIHRoaXMub3JkZXJTaXplID0gbnVsbDtcbiAgfVxuXG4gIHNldFplcm9QbGFjZWhvbGRlcigpIHtcbiAgICBpZiAoIXRoaXMub3JkZXJTaXplKSB7IHJldHVybjsgfVxuXG4gICAgT2JqZWN0LnZhbHVlcyh0aGlzLmFjY291bnRzKS5mb3JFYWNoKChhY2NvdW50KSA9PiB7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHRoaXMub3JkZXJTaXplLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYWNjb3VudFtpXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBhY2NvdW50W2ldID0geyBhbW91bnQ6IDAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGZyb20oYWNjb3VudHMsIGNvbmZpZ3MpIHtcbiAgICBjb25zdCBjb2xsZWN0aW9uID0gbmV3IHRoaXMoY29uZmlncyk7XG5cbiAgICBhY2NvdW50cy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLmFjY291bnRzW2VudHJ5LmFjY291bnRJZF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbGxlY3Rpb24uYWNjb3VudHNbZW50cnkuYWNjb3VudElkXSA9IHt9O1xuICAgICAgfVxuICAgICAgaWYgKGVudHJ5Lm9yZGVyKSB7XG4gICAgICAgIGNvbGxlY3Rpb24uYWNjb3VudHNbZW50cnkuYWNjb3VudElkXVtlbnRyeS5vcmRlcl0gPSBlbnRyeTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfVxuXG4gIHRvQXJyYXkoKSB7XG4gICAgY29uc3Qgb3V0cHV0ID0gW107XG5cbiAgICBPYmplY3Qua2V5KHRoaXMuYWNjb3VudHMpLmZvckVhY2goKGFjY291bnRJZCkgPT4ge1xuICAgICAgY29uc3QgZW50cmllcyA9IHRoaXMuYWNjb3VudHNbYWNjb3VudElkXTtcbiAgICAgIG91dHB1dC5wdXNoKHtcbiAgICAgICAgYWNjb3VudF9pZDogYWNjb3VudElkLFxuICAgICAgICBlbnRyaWVzOiBbXG4gICAgICAgICAgLi4uT2JqZWN0LmtleShlbnRyaWVzKS5tYXAoKG9yZGVyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbnRyeSA9IGVudHJpZXNbb3JkZXJdO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgb3JkZXIsXG4gICAgICAgICAgICAgIGFtb3VudDogZW50cnkuYW1vdW50LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgY2FsY1RvdGFsU3VtbWFyeSgpIHtcbiAgICBjb25zdCB0b3RhbFN1bW1hcnkgPSB7fTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vcmRlclNpemUubGVuZ3RoOyBpKyspIHtcbiAgICAgIE9iamVjdC52YWx1ZSh0aGlzLmFjY291bnRzKS5mb3JFYWNoKChhY2NvdW50KSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgdG90YWxTdW1tYXJ5W2ldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHRvdGFsU3VtbWFyeVtpXSA9IHsgYW1vdW50OiAwLCBvcmRlcjogaSB9O1xuICAgICAgICB9XG4gICAgICAgIHRvdGFsU3VtbWFyeVtpXS5hbW91bnQgKz0gYWNjb3VudFtpXS5hbW91bnQ7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy50b3RhbFN1bW1hcnkgPSB0b3RhbFN1bW1hcnk7XG4gIH1cblxuICB0b0FycmF5VG90YWxTdW1tYXJ5KCkge1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMudG90YWxTdW1tYXJ5KTtcbiAgfVxuXG59XG4iLCJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5lc3RlZFNldCB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBtZXRob2QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC1cbiAgICovXG4gIGNvbnN0cnVjdG9yKGl0ZW1zLCBvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgcGFyZW50SWQ6ICdwYXJlbnRfaWQnLFxuICAgICAgaWQ6ICdpZCcsXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH07XG4gICAgdGhpcy5pdGVtcyA9IGl0ZW1zO1xuICAgIHRoaXMuY29sbGVjdGlvbiA9IHt9O1xuICAgIHRoaXMudG9UcmVlKCk7XG5cbiAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIExpbmsgbm9kZXMgY2hpbGRyZW4uXG4gICAqL1xuICBsaW5rQ2hpbGRyZW4oKSB7XG4gICAgaWYgKHRoaXMuaXRlbXMubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IG1hcCA9IHt9O1xuICAgIHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgbWFwW2l0ZW0uaWRdID0gaXRlbTtcbiAgICAgIG1hcFtpdGVtLmlkXS5jaGlsZHJlbiA9IFtdO1xuICAgIH0pO1xuXG4gICAgdGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBwYXJlbnROb2RlSWQgPSBpdGVtW3RoaXMub3B0aW9ucy5wYXJlbnRJZF07XG4gICAgICBpZiAocGFyZW50Tm9kZUlkKSB7XG4gICAgICAgIG1hcFtwYXJlbnROb2RlSWRdLmNoaWxkcmVuLnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG1hcDtcbiAgfVxuXG4gIHRvVHJlZSgpIHtcbiAgICBjb25zdCBtYXAgPSB0aGlzLmxpbmtDaGlsZHJlbigpO1xuICAgIGNvbnN0IHRyZWUgPSB7fTtcblxuICAgIHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgcGFyZW50Tm9kZUlkID0gaXRlbVt0aGlzLm9wdGlvbnMucGFyZW50SWRdO1xuICAgICAgaWYgKCFwYXJlbnROb2RlSWQpIHtcbiAgICAgICAgdHJlZVtpdGVtLmlkXSA9IG1hcFtpdGVtLmlkXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmNvbGxlY3Rpb24gPSBPYmplY3QudmFsdWVzKHRyZWUpO1xuICB9XG5cbiAgd2FsaygpIHtcblxuICB9XG5cbiAgZ2V0UGFyZW50cygpIHtcblxuICB9XG5cbiAgZ2V0Q2hpbGRyZW4oKSB7XG4gICAgXG4gIH1cblxuICB0b0ZsYXR0ZW5BcnJheSgpIHtcblxuICB9XG5cbiAgdG9BcnJheSgpIHtcblxuICB9XG59XG4iLCJpbXBvcnQgTWV0YWJsZUNvbGxlY3Rpb24gZnJvbSAnQC9saWIvTWV0YWJsZS9NZXRhYmxlQ29sbGVjdGlvbic7XG5pbXBvcnQgUmVzb3VyY2VGaWVsZE1ldGFkYXRhIGZyb20gJ0AvbW9kZWxzL1Jlc291cmNlRmllbGRNZXRhZGF0YSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc291cmNlRmllbGRNZXRhZGF0YUNvbGxlY3Rpb24gZXh0ZW5kcyBNZXRhYmxlQ29sbGVjdGlvbiB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBtZXRob2QuXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zZXRNb2RlbChSZXNvdXJjZUZpZWxkTWV0YWRhdGEpO1xuICAgIHRoaXMuZXh0cmFDb2x1bW5zID0gWydyZXNvdXJjZV9pZCcsICdyZXNvdXJjZV9pdGVtX2lkJ107XG4gIH1cbn1cbiIsImltcG9ydCBLbmV4IGZyb20gJ2tuZXgnO1xuaW1wb3J0IHsga25leFNuYWtlQ2FzZU1hcHBlcnMgfSBmcm9tICdvYmplY3Rpb24nO1xuaW1wb3J0IGtuZXhmaWxlIGZyb20gJ0AvLi4va25leGZpbGUnO1xuXG5jb25zdCBjb25maWcgPSBrbmV4ZmlsZVtwcm9jZXNzLmVudi5OT0RFX0VOVl07XG5jb25zdCBrbmV4ID0gS25leCh7XG4gIC4uLmNvbmZpZyxcbiAgLi4ua25leFNuYWtlQ2FzZU1hcHBlcnMoeyB1cHBlckNhc2U6IHRydWUgfSksXG59KTtcblxuZXhwb3J0IGRlZmF1bHQga25leDtcbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgY2hlY2ssIHZhbGlkYXRpb25SZXN1bHQsIG9uZU9mIH0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InO1xuaW1wb3J0IHsgZGlmZmVyZW5jZSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgYXN5bmNNaWRkbGV3YXJlIGZyb20gJy4uL21pZGRsZXdhcmUvYXN5bmNNaWRkbGV3YXJlJztcbmltcG9ydCBqd3RBdXRoIGZyb20gJ0AvaHR0cC9taWRkbGV3YXJlL2p3dEF1dGgnO1xuaW1wb3J0IEFjY291bnQgZnJvbSAnQC9tb2RlbHMvQWNjb3VudCc7XG5pbXBvcnQgSm91cm5hbFBvc3RlciBmcm9tICdAL3NlcnZpY2VzL0FjY291bnRpbmcvSm91cm5hbFBvc3Rlcic7XG5pbXBvcnQgSm91cm5hbEVudHJ5IGZyb20gJ0Avc2VydmljZXMvQWNjb3VudGluZy9Kb3VybmFsRW50cnknO1xuaW1wb3J0IE1hbnVhbEpvdXJuYWwgZnJvbSAnQC9tb2RlbHMvTWFudWFsSm91cm5hbCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyoqXG4gICAqIFJvdXRlciBjb25zdHJ1Y3Rvci5cbiAgICovXG4gIHJvdXRlcigpIHtcbiAgICBjb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuXG4gICAgcm91dGVyLnVzZShqd3RBdXRoKTtcblxuICAgIHJvdXRlci5wb3N0KCcvJyxcbiAgICAgIHRoaXMub3BlbmluZ0JhbG5hY2UudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLm9wZW5pbmdCYWxuYWNlLmhhbmRsZXIpKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIE9wZW5pbmcgYmFsYW5jZSB0byB0aGUgZ2l2ZW4gYWNjb3VudC5cbiAgICogQHBhcmFtIHtSZXF1ZXN0fSByZXEgLVxuICAgKiBAcGFyYW0ge1Jlc3BvbnNlfSByZXMgLVxuICAgKi9cbiAgb3BlbmluZ0JhbG5hY2U6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBjaGVjaygnZGF0ZScpLm9wdGlvbmFsKCksXG4gICAgICBjaGVjaygnbm90ZScpLm9wdGlvbmFsKCkudHJpbSgpLmVzY2FwZSgpLFxuICAgICAgY2hlY2soJ2JhbGFuY2VfYWRqdXN0bWVudF9hY2NvdW50JykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdhY2NvdW50cycpLmlzQXJyYXkoeyBtaW46IDEgfSksXG4gICAgICBjaGVjaygnYWNjb3VudHMuKi5pZCcpLmV4aXN0cygpLmlzSW50KCksXG4gICAgICBvbmVPZihbXG4gICAgICAgIGNoZWNrKCdhY2NvdW50cy4qLmRlYml0JykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9GbG9hdCgpLFxuICAgICAgICBjaGVjaygnYWNjb3VudHMuKi5jcmVkaXQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0Zsb2F0KCksXG4gICAgICBdKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgYWNjb3VudHMgfSA9IHJlcS5ib2R5O1xuICAgICAgY29uc3QgeyB1c2VyIH0gPSByZXE7XG4gICAgICBjb25zdCBmb3JtID0geyAuLi5yZXEuYm9keSB9O1xuICAgICAgY29uc3QgZGF0ZSA9IG1vbWVudChmb3JtLmRhdGUpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuXG4gICAgICBjb25zdCBhY2NvdW50c0lkcyA9IGFjY291bnRzLm1hcCgoYWNjb3VudCkgPT4gYWNjb3VudC5pZCk7XG4gICAgICBjb25zdCBzdG9yZWRBY2NvdW50cyA9IGF3YWl0IEFjY291bnQucXVlcnkoKVxuICAgICAgICAuc2VsZWN0KFsnaWQnXSkud2hlcmVJbignaWQnLCBhY2NvdW50c0lkcylcbiAgICAgICAgLndpdGhHcmFwaEZldGNoZWQoJ3R5cGUnKTtcblxuICAgICAgY29uc3QgYWNjb3VudHNDb2xsZWN0aW9uID0gbmV3IE1hcChzdG9yZWRBY2NvdW50cy5tYXAoaSA9PiBbaS5pZCwgaV0pKTtcblxuICAgICAgLy8gR2V0IHRoZSBzdG9yZWQgYWNjb3VudHMgSWRzIGFuZCBkaWZmZXJlbmNlIHdpdGggc3VibWl0IGFjY291bnRzLlxuICAgICAgY29uc3QgYWNjb3VudHNTdG9yZWRJZHMgPSBzdG9yZWRBY2NvdW50cy5tYXAoKGFjY291bnQpID0+IGFjY291bnQuaWQpO1xuICAgICAgY29uc3Qgbm90Rm91bmRBY2NvdW50c0lkcyA9IGRpZmZlcmVuY2UoYWNjb3VudHNJZHMsIGFjY291bnRzU3RvcmVkSWRzKTtcbiAgICAgIGNvbnN0IGVycm9yUmVhc29ucyA9IFtdO1xuXG4gICAgICBpZiAobm90Rm91bmRBY2NvdW50c0lkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGlkcyA9IG5vdEZvdW5kQWNjb3VudHNJZHMubWFwKChhKSA9PiBwYXJzZUludChhLCAxMCkpO1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdOT1RfRk9VTkRfQUNDT1VOVCcsIGNvZGU6IDEwMCwgaWRzIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGZvcm0uYmFsYW5jZV9hZGp1c3RtZW50X2FjY291bnQpIHtcbiAgICAgICAgY29uc3QgYWNjb3VudCA9IGF3YWl0IEFjY291bnQucXVlcnkoKS5maW5kQnlJZChmb3JtLmJhbGFuY2VfYWRqdXN0bWVudF9hY2NvdW50KTtcblxuICAgICAgICBpZiAoIWFjY291bnQpIHtcbiAgICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdCQUxBTkNFLkFESlVTVE1FTlQuQUNDT1VOVC5OT1QuRVhJU1QnLCBjb2RlOiAzMDAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChlcnJvclJlYXNvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7IGVycm9yczogZXJyb3JSZWFzb25zIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBqb3VybmFsRW50cmllcyA9IG5ldyBKb3VybmFsUG9zdGVyKCk7XG5cbiAgICAgIGFjY291bnRzLmZvckVhY2goKGFjY291bnQpID0+IHtcbiAgICAgICAgY29uc3Qgc3RvcmVkQWNjb3VudCA9IGFjY291bnRzQ29sbGVjdGlvbi5nZXQoYWNjb3VudC5pZCk7XG5cbiAgICAgICAgLy8gQ2FuJ3QgY29udGludWUgaW4gY2FzZSB0aGUgc3RvcmVkIGFjY291bnQgd2FzIG5vdCBmb3VuZC5cbiAgICAgICAgaWYgKCFzdG9yZWRBY2NvdW50KSB7IHJldHVybjsgfVxuXG4gICAgICAgIGNvbnN0IGVudHJ5TW9kZWwgPSBuZXcgSm91cm5hbEVudHJ5KHtcbiAgICAgICAgICByZWZlcmVuY2VUeXBlOiAnT3BlbmluZ0JhbGFuY2UnLFxuICAgICAgICAgIGFjY291bnQ6IGFjY291bnQuaWQsXG4gICAgICAgICAgYWNjb3VudE5vcm1hbDogc3RvcmVkQWNjb3VudC50eXBlLm5vcm1hbCxcbiAgICAgICAgICB1c2VySWQ6IHVzZXIuaWQsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoYWNjb3VudC5jcmVkaXQpIHtcbiAgICAgICAgICBlbnRyeU1vZGVsLmVudHJ5LmNyZWRpdCA9IGFjY291bnQuY3JlZGl0O1xuICAgICAgICAgIGpvdXJuYWxFbnRyaWVzLmNyZWRpdChlbnRyeU1vZGVsKTtcbiAgICAgICAgfSBlbHNlIGlmIChhY2NvdW50LmRlYml0KSB7XG4gICAgICAgICAgZW50cnlNb2RlbC5lbnRyeS5kZWJpdCA9IGFjY291bnQuZGViaXQ7XG4gICAgICAgICAgam91cm5hbEVudHJpZXMuZGViaXQoZW50cnlNb2RlbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLy8gQ2FsY3VsYXRlcyB0aGUgY3JlZGl0IGFuZCBkZWJpdCBiYWxhbmNlIG9mIHN0YWNrZWQgZW50cmllcy5cbiAgICAgIGNvbnN0IHRyaWFsID0gam91cm5hbEVudHJpZXMuZ2V0VHJpYWxCYWxhbmNlKCk7XG5cbiAgICAgIGlmICh0cmlhbC5jcmVkaXQgIT09IHRyaWFsLmRlYml0KSB7XG4gICAgICAgIGNvbnN0IGVudHJ5TW9kZWwgPSBuZXcgSm91cm5hbEVudHJ5KHtcbiAgICAgICAgICByZWZlcmVuY2VUeXBlOiAnT3BlbmluZ0JhbGFuY2UnLFxuICAgICAgICAgIGFjY291bnQ6IGZvcm0uYmFsYW5jZV9hZGp1c3RtZW50X2FjY291bnQsXG4gICAgICAgICAgYWNjb3VudE5vcm1hbDogJ2NyZWRpdCcsXG4gICAgICAgICAgdXNlcklkOiB1c2VyLmlkLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodHJpYWwuY3JlZGl0ID4gdHJpYWwuZGViaXQpIHtcbiAgICAgICAgICBlbnRyeU1vZGVsLmVudHJ5LmNyZWRpdCA9IE1hdGguYWJzKHRyaWFsLmNyZWRpdCk7XG4gICAgICAgICAgam91cm5hbEVudHJpZXMuY3JlZGl0KGVudHJ5TW9kZWwpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAodHJpYWwuY3JlZGl0IDwgdHJpYWwuZGViaXQpIHtcbiAgICAgICAgICBlbnRyeU1vZGVsLmVudHJ5LmRlYml0ID0gTWF0aC5hYnModHJpYWwuZGViaXQpO1xuICAgICAgICAgIGpvdXJuYWxFbnRyaWVzLmRlYml0KGVudHJ5TW9kZWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBtYW51YWxKb3VybmFsID0gYXdhaXQgTWFudWFsSm91cm5hbC5xdWVyeSgpLmluc2VydCh7XG4gICAgICAgIGFtb3VudDogTWF0aC5tYXgodHJpYWwuY3JlZGl0LCB0cmlhbC5kZWJpdCksXG4gICAgICAgIHRyYW5zYWN0aW9uX3R5cGU6ICdPcGVuaW5nQmFsYW5jZScsXG4gICAgICAgIGRhdGUsXG4gICAgICAgIG5vdGU6IGZvcm0ubm90ZSxcbiAgICAgICAgdXNlcl9pZDogdXNlci5pZCxcbiAgICAgIH0pO1xuXG4gICAgICBqb3VybmFsRW50cmllcy5lbnRyaWVzID0gam91cm5hbEVudHJpZXMuZW50cmllcy5tYXAoKGVudHJ5KSA9PiAoe1xuICAgICAgICAuLi5lbnRyeSxcbiAgICAgICAgcmVmZXJlbmNlSWQ6IG1hbnVhbEpvdXJuYWwuaWQsXG4gICAgICB9KSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIGpvdXJuYWxFbnRyaWVzLnNhdmVFbnRyaWVzKCksXG4gICAgICAgIGpvdXJuYWxFbnRyaWVzLnNhdmVCYWxhbmNlKCksXG4gICAgICBdKTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGlkOiBtYW51YWxKb3VybmFsLmlkIH0pO1xuICAgIH0sXG4gIH0sXG59O1xuIiwiaW1wb3J0IHsgY2hlY2ssIHF1ZXJ5LCB2YWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InO1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgeyBkaWZmZXJlbmNlIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBBY2NvdW50IGZyb20gJ0AvbW9kZWxzL0FjY291bnQnO1xuaW1wb3J0IGFzeW5jTWlkZGxld2FyZSBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9hc3luY01pZGRsZXdhcmUnO1xuaW1wb3J0IEpXVEF1dGggZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvand0QXV0aCc7XG5pbXBvcnQgSm91cm5hbFBvc3RlciBmcm9tICdAL3NlcnZpY2VzL0FjY291bnRpbmcvSm91cm5hbFBvc3Rlcic7XG5pbXBvcnQgSm91cm5hbEVudHJ5IGZyb20gJ0Avc2VydmljZXMvQWNjb3VudGluZy9Kb3VybmFsRW50cnknO1xuaW1wb3J0IE1hbnVhbEpvdXJuYWwgZnJvbSAnQC9tb2RlbHMvSm91cm5hbEVudHJ5JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogUm91dGVyIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG4gICAgcm91dGVyLnVzZShKV1RBdXRoKTtcblxuICAgIHJvdXRlci5wb3N0KCcvbWFrZS1qb3VybmFsLWVudHJpZXMnLFxuICAgICAgdGhpcy5tYWtlSm91cm5hbEVudHJpZXMudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLm1ha2VKb3VybmFsRW50cmllcy5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIucG9zdCgnL3JlY3VycmluZy1qb3VybmFsLWVudHJpZXMnLFxuICAgICAgdGhpcy5yZWN1cnJpbmdKb3VybmFsRW50cmllcy52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMucmVjdXJyaW5nSm91cm5hbEVudHJpZXMuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLnBvc3QoJ3F1aWNrLWpvdXJuYWwtZW50cmllcycsXG4gICAgICB0aGlzLnF1aWNrSm91cm5hbEVudHJpZXMudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLnF1aWNrSm91cm5hbEVudHJpZXMuaGFuZGxlcikpO1xuXG4gICAgcmV0dXJuIHJvdXRlcjtcbiAgfSxcblxuICAvKipcbiAgICogTWFrZSBqb3VybmFsIGVudHJpcmVzLlxuICAgKi9cbiAgbWFrZUpvdXJuYWxFbnRyaWVzOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgY2hlY2soJ2RhdGUnKS5pc0lTTzg2MDEoKSxcbiAgICAgIGNoZWNrKCdyZWZlcmVuY2UnKS5leGlzdHMoKSxcbiAgICAgIGNoZWNrKCdlbnRyaWVzJykuaXNBcnJheSh7IG1pbjogMSB9KSxcbiAgICAgIGNoZWNrKCdlbnRyaWVzLiouY3JlZGl0JykuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdlbnRyaWVzLiouZGViaXQnKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2VudHJpZXMuKi5hY2NvdW50X2lkJykuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdlbnRyaWVzLioubm90ZScpLm9wdGlvbmFsKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZm9ybSA9IHsgLi4ucmVxLmJvZHkgfTtcbiAgICAgIGNvbnN0IGVycm9yUmVhc29ucyA9IFtdO1xuICAgICAgbGV0IHRvdGFsQ3JlZGl0ID0gMDtcbiAgICAgIGxldCB0b3RhbERlYml0ID0gMDtcblxuICAgICAgZm9ybS5lbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICAgIGlmIChlbnRyeS5jcmVkaXQgPiAwKSB7XG4gICAgICAgICAgdG90YWxDcmVkaXQgKz0gZW50cnkuY3JlZGl0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbnRyeS5kZWJpdCA+IDApIHtcbiAgICAgICAgICB0b3RhbERlYml0ICs9IGVudHJ5LmRlYml0O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmICh0b3RhbENyZWRpdCA8PSAwIHx8IHRvdGFsRGViaXQgPD0gMCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ0NSRURJVC5ERUJJVC5TVU1BVElPTi5TSE9VTEQuTk9ULkVRVUFMLlpFUk8nLFxuICAgICAgICAgIGNvZGU6IDQwMCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAodG90YWxDcmVkaXQgIT09IHRvdGFsRGViaXQpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnQ1JFRElULkRFQklULk5PVC5FUVVBTFMnLCBjb2RlOiAxMDAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBhY2NvdW50c0lkcyA9IGZvcm0uZW50cmllcy5tYXAoKGVudHJ5KSA9PiBlbnRyeS5hY2NvdW50X2lkKTtcbiAgICAgIGNvbnN0IGFjY291bnRzID0gYXdhaXQgQWNjb3VudC5xdWVyeSgpLndoZXJlSW4oJ2lkJywgYWNjb3VudHNJZHMpXG4gICAgICAgIC53aXRoR3JhcGhGZXRjaGVkKCd0eXBlJyk7XG5cbiAgICAgIGNvbnN0IHN0b3JlZEFjY291bnRzSWRzID0gYWNjb3VudHMubWFwKChhY2NvdW50KSA9PiBhY2NvdW50LmlkKTtcblxuICAgICAgaWYgKGRpZmZlcmVuY2UoYWNjb3VudHNJZHMsIHN0b3JlZEFjY291bnRzSWRzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHsgdHlwZTogJ0FDQ09VTlRTLklEUy5OT1QuRk9VTkQnLCBjb2RlOiAyMDAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGpvdXJuYWxSZWZlcmVuY2UgPSBhd2FpdCBNYW51YWxKb3VybmFsLnF1ZXJ5KCkud2hlcmUoJ3JlZmVyZW5jZScsIGZvcm0ucmVmZXJlbmNlKTtcblxuICAgICAgaWYgKGpvdXJuYWxSZWZlcmVuY2UubGVuZ3RoID4gMCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdSRUZFUkVOQ0UuQUxSRUFEWS5FWElTVFMnLCBjb2RlOiAzMDAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZXJyb3JSZWFzb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHsgZXJyb3JzOiBlcnJvclJlYXNvbnMgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBqb3VybmFsUG9zdGVyID0gbmV3IEpvdXJuYWxQb3N0ZXIoKTtcblxuICAgICAgZm9ybS5lbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICAgIGNvbnN0IGFjY291bnQgPSBhY2NvdW50cy5maW5kKChhKSA9PiBhLmlkID09PSBlbnRyeS5hY2NvdW50X2lkKTtcblxuICAgICAgICBjb25zdCBqb3VyYW5sRW50cnkgPSBuZXcgSm91cm5hbEVudHJ5KHtcbiAgICAgICAgICBkZWJpdDogZW50cnkuZGViaXQsXG4gICAgICAgICAgY3JlZGl0OiBlbnRyeS5jcmVkaXQsXG4gICAgICAgICAgYWNjb3VudDogYWNjb3VudC5pZCxcbiAgICAgICAgICBhY2NvdW50Tm9ybWFsOiBhY2NvdW50LnR5cGUubm9ybWFsLFxuICAgICAgICAgIG5vdGU6IGVudHJ5Lm5vdGUsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoZW50cnkuZGViaXQpIHtcbiAgICAgICAgICBqb3VybmFsUG9zdGVyLmRlYml0KGpvdXJhbmxFbnRyeSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgam91cm5hbFBvc3Rlci5jcmVkaXQoam91cmFubEVudHJ5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIFNhdmVzIHRoZSBqb3VybmFsIGVudHJpZXMgYW5kIGFjY291bnRzIGJhbGFuY2UgY2hhbmdlcy5cbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgam91cm5hbFBvc3Rlci5zYXZlRW50cmllcygpLFxuICAgICAgICBqb3VybmFsUG9zdGVyLnNhdmVCYWxhbmNlKCksXG4gICAgICBdKTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCgpO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIFNhdmVzIHJlY3VycmluZyBqb3VybmFsIGVudHJpZXMgdGVtcGxhdGUuXG4gICAqL1xuICByZWN1cnJpbmdKb3VybmFsRW50cmllczoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCd0ZW1wbGF0ZV9uYW1lJykuZXhpc3RzKCksXG4gICAgICBjaGVjaygncmVjdXJyZW5jZScpLmV4aXN0cygpLFxuICAgICAgY2hlY2soJ2FjdGl2ZScpLm9wdGlvbmFsKCkuaXNCb29sZWFuKCkudG9Cb29sZWFuKCksXG4gICAgICBjaGVjaygnZW50cmllcycpLmlzQXJyYXkoeyBtaW46IDEgfSksXG4gICAgICBjaGVjaygnZW50cmllcy4qLmNyZWRpdCcpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnZW50cmllcy4qLmRlYml0JykuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdlbnRyaWVzLiouYWNjb3VudF9pZCcpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnZW50cmllcy4qLm5vdGUnKS5vcHRpb25hbCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIH0sXG4gIH0sXG5cbiAgcmVjdXJyaW5nSm91cm5hbHNMaXN0OiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcXVlcnkoJ3BhZ2UnKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBxdWVyeSgncGFnZV9zaXplJykub3B0aW9uYWwoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgcXVlcnkoJ3RlbXBsYXRlX25hbWUnKS5vcHRpb25hbCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIHF1aWNrSm91cm5hbEVudHJpZXM6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBjaGVjaygnZGF0ZScpLmV4aXN0cygpLmlzSVNPODYwMSgpLFxuICAgICAgY2hlY2soJ2Ftb3VudCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvRmxvYXQoKSxcbiAgICAgIGNoZWNrKCdjcmVkaXRfYWNjb3VudF9pZCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnZGViaXRfYWNjb3VudF9pZCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygndHJhbnNhY3Rpb25fdHlwZScpLmV4aXN0cygpLFxuICAgICAgY2hlY2soJ25vdGUnKS5vcHRpb25hbCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVycm9yUmVhc29ucyA9IFtdO1xuICAgICAgY29uc3QgZm9ybSA9IHsgLi4ucmVxLmJvZHkgfTtcblxuICAgICAgY29uc3QgZm91bmRBY2NvdW50cyA9IGF3YWl0IEFjY291bnQucXVlcnkoKVxuICAgICAgICAud2hlcmUoJ2lkJywgZm9ybS5jcmVkaXRfYWNjb3VudF9pZClcbiAgICAgICAgLm9yV2hlcmUoJ2lkJywgZm9ybS5kZWJpdF9hY2NvdW50X2lkKTtcblxuICAgICAgY29uc3QgY3JlZGl0QWNjb3VudCA9IGZvdW5kQWNjb3VudHMuZmluZCgoYSkgPT4gYS5pZCA9PT0gZm9ybS5jcmVkaXRfYWNjb3VudF9pZCk7XG4gICAgICBjb25zdCBkZWJpdEFjY291bnQgPSBmb3VuZEFjY291bnRzLmZpbmQoKGEpID0+IGEuaWQgPT09IGZvcm0uZGViaXRfYWNjb3VudF9pZCk7XG5cbiAgICAgIGlmICghY3JlZGl0QWNjb3VudCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdDUkVESVRfQUNDT1VOVC5OT1QuRVhJU1QnLCBjb2RlOiAxMDAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoIWRlYml0QWNjb3VudCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdERUJJVF9BQ0NPVU5ULk5PVC5FWElTVCcsIGNvZGU6IDIwMCB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChlcnJvclJlYXNvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoeyBlcnJvcnM6IGVycm9yUmVhc29ucyB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gY29uc3Qgam91cm5hbFBvc3RlciA9IG5ldyBKb3VybmFsUG9zdGVyKCk7XG4gICAgICAvLyBjb25zdCBqb3VybmFsQ3JlZGl0ID0gbmV3IEpvdXJuYWxFbnRyeSh7XG4gICAgICAvLyAgIGRlYml0OiBcbiAgICAgIC8vICAgYWNjb3VudDogZGViaXRBY2NvdW50LmlkLFxuICAgICAgLy8gICByZWZlcmVuY2VJZDogXG4gICAgICAvLyB9KVxuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxufTtcbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgY2hlY2ssIHZhbGlkYXRpb25SZXN1bHQsIHBhcmFtLCBxdWVyeSB9IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJztcbmltcG9ydCBhc3luY01pZGRsZXdhcmUgZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvYXN5bmNNaWRkbGV3YXJlJztcbmltcG9ydCBBY2NvdW50IGZyb20gJ0AvbW9kZWxzL0FjY291bnQnO1xuaW1wb3J0IEFjY291bnRUeXBlIGZyb20gJ0AvbW9kZWxzL0FjY291bnRUeXBlJztcbmltcG9ydCBBY2NvdW50VHJhbnNhY3Rpb24gZnJvbSAnQC9tb2RlbHMvQWNjb3VudFRyYW5zYWN0aW9uJztcbmltcG9ydCBKb3VybmFsUG9zdGVyIGZyb20gJ0Avc2VydmljZXMvQWNjb3VudGluZy9Kb3VybmFsUG9zdGVyJztcbmltcG9ydCBBY2NvdW50QmFsYW5jZSBmcm9tICdAL21vZGVscy9BY2NvdW50QmFsYW5jZSc7XG5pbXBvcnQgSldUQXV0aCBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9qd3RBdXRoJztcbmltcG9ydCBOZXN0ZWRTZXQgZnJvbSAnLi4vLi4vY29sbGVjdGlvbi9OZXN0ZWRTZXQnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBSb3V0ZXIgY29uc3RydWN0b3IgbWV0aG9kLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbiAgICByb3V0ZXIudXNlKEpXVEF1dGgpO1xuICAgIHJvdXRlci5wb3N0KCcvJyxcbiAgICAgIHRoaXMubmV3QWNjb3VudC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMubmV3QWNjb3VudC5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIucG9zdCgnLzppZCcsXG4gICAgICB0aGlzLmVkaXRBY2NvdW50LnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5lZGl0QWNjb3VudC5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvOmlkJyxcbiAgICAgIHRoaXMuZ2V0QWNjb3VudC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZ2V0QWNjb3VudC5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvJyxcbiAgICAgIHRoaXMuZ2V0QWNjb3VudHNMaXN0LnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5nZXRBY2NvdW50c0xpc3QuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmRlbGV0ZSgnLzppZCcsXG4gICAgICB0aGlzLmRlbGV0ZUFjY291bnQudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmRlbGV0ZUFjY291bnQuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLnBvc3QoJy86aWQvYWN0aXZlJyxcbiAgICAgIHRoaXMuYWN0aXZlQWNjb3VudC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuYWN0aXZlQWNjb3VudC5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIucG9zdCgnLzppZC9pbmFjdGl2ZScsXG4gICAgICB0aGlzLmluYWN0aXZlQWNjb3VudC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuaW5hY3RpdmVBY2NvdW50LmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCcvOmlkL3JlY2FsY3VsYXRlLWJhbGFuY2UnLFxuICAgICAgdGhpcy5yZWNhbGN1YWx0ZUJhbGFuYWNlLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5yZWNhbGN1YWx0ZUJhbGFuYWNlLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCcvOmlkL3RyYW5zZmVyX2FjY291bnQvOnRvQWNjb3VudCcsXG4gICAgICB0aGlzLnRyYW5zZmVyVG9Bbm90aGVyQWNjb3VudC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMudHJhbnNmZXJUb0Fub3RoZXJBY2NvdW50LmhhbmRsZXIpKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYWNjb3VudC5cbiAgICovXG4gIG5ld0FjY291bnQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBjaGVjaygnbmFtZScpLmV4aXN0cygpLmlzTGVuZ3RoKHsgbWluOiAzIH0pLnRyaW0oKS5lc2NhcGUoKSxcbiAgICAgIGNoZWNrKCdjb2RlJykuZXhpc3RzKCkuaXNMZW5ndGgoeyBtYXg6IDEwIH0pLnRyaW0oKS5lc2NhcGUoKSxcbiAgICAgIGNoZWNrKCdhY2NvdW50X3R5cGVfaWQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2Rlc2NyaXB0aW9uJykub3B0aW9uYWwoKS50cmltKCkuZXNjYXBlKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZm9ybSA9IHsgLi4ucmVxLmJvZHkgfTtcblxuICAgICAgY29uc3QgZm91bmRBY2NvdW50Q29kZVByb21pc2UgPSBmb3JtLmNvZGVcbiAgICAgICAgPyBBY2NvdW50LnF1ZXJ5KCkud2hlcmUoJ2NvZGUnLCBmb3JtLmNvZGUpIDogbnVsbDtcblxuICAgICAgY29uc3QgZm91bmRBY2NvdW50VHlwZVByb21pc2UgPSBBY2NvdW50VHlwZS5xdWVyeSgpXG4gICAgICAgIC5maW5kQnlJZChmb3JtLmFjY291bnRfdHlwZV9pZCk7XG5cbiAgICAgIGNvbnN0IFtmb3VuZEFjY291bnRDb2RlLCBmb3VuZEFjY291bnRUeXBlXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgZm91bmRBY2NvdW50Q29kZVByb21pc2UsIGZvdW5kQWNjb3VudFR5cGVQcm9taXNlLFxuICAgICAgXSk7XG5cbiAgICAgIGlmIChmb3VuZEFjY291bnRDb2RlUHJvbWlzZSAmJiBmb3VuZEFjY291bnRDb2RlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ05PVF9VTklRVUVfQ09ERScsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoIWZvdW5kQWNjb3VudFR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ05PVF9FWElTVF9BQ0NPVU5UX1RZUEUnLCBjb2RlOiAyMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgYXdhaXQgQWNjb3VudC5xdWVyeSgpLmluc2VydCh7IC4uLmZvcm0gfSk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGl0ZW06IHsgfSB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBFZGl0IHRoZSBnaXZlbiBhY2NvdW50IGRldGFpbHMuXG4gICAqL1xuICBlZGl0QWNjb3VudDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdpZCcpLmV4aXN0cygpLnRvSW50KCksXG4gICAgICBjaGVjaygnbmFtZScpLmV4aXN0cygpLmlzTGVuZ3RoKHsgbWluOiAzIH0pLnRyaW0oKS5lc2NhcGUoKSxcbiAgICAgIGNoZWNrKCdjb2RlJykuZXhpc3RzKCkuaXNMZW5ndGgoeyBtYXg6IDEwIH0pLnRyaW0oKS5lc2NhcGUoKSxcbiAgICAgIGNoZWNrKCdhY2NvdW50X3R5cGVfaWQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2Rlc2NyaXB0aW9uJykub3B0aW9uYWwoKS50cmltKCkuZXNjYXBlKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGZvcm0gPSB7IC4uLnJlcS5ib2R5IH07XG4gICAgICBjb25zdCBhY2NvdW50ID0gYXdhaXQgQWNjb3VudC5xdWVyeSgpLmZpbmRCeUlkKGlkKTtcblxuICAgICAgaWYgKCFhY2NvdW50KSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZCgpO1xuICAgICAgfVxuICAgICAgY29uc3QgZm91bmRBY2NvdW50Q29kZVByb21pc2UgPSAoZm9ybS5jb2RlICYmIGZvcm0uY29kZSAhPT0gYWNjb3VudC5jb2RlKVxuICAgICAgICA/IEFjY291bnQucXVlcnkoKS53aGVyZSgnY29kZScsIGZvcm0uY29kZSkud2hlcmVOb3QoJ2lkJywgYWNjb3VudC5pZCkgOiBudWxsO1xuXG4gICAgICBjb25zdCBmb3VuZEFjY291bnRUeXBlUHJvbWlzZSA9IChmb3JtLmFjY291bnRfdHlwZV9pZCAhPT0gYWNjb3VudC5hY2NvdW50X3R5cGVfaWQpXG4gICAgICAgID8gQWNjb3VudFR5cGUucXVlcnkoKS53aGVyZSgnaWQnLCBmb3JtLmFjY291bnRfdHlwZV9pZCkgOiBudWxsO1xuXG4gICAgICBjb25zdCBbZm91bmRBY2NvdW50Q29kZSwgZm91bmRBY2NvdW50VHlwZV0gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIGZvdW5kQWNjb3VudENvZGVQcm9taXNlLCBmb3VuZEFjY291bnRUeXBlUHJvbWlzZSxcbiAgICAgIF0pO1xuICAgICAgaWYgKGZvdW5kQWNjb3VudENvZGUubGVuZ3RoID4gMCAmJiBmb3VuZEFjY291bnRDb2RlUHJvbWlzZSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkUmVxdWVzdChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnTk9UX1VOSVFVRV9DT0RFJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZEFjY291bnRUeXBlLmxlbmd0aCA8PSAwICYmIGZvdW5kQWNjb3VudFR5cGVQcm9taXNlKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWRSZXF1ZXN0KG51bGwsIHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdOT1RfRVhJU1RfQUNDT1VOVF9UWVBFJywgY29kZTogMTEwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IGFjY291bnQucGF0Y2goeyAuLi5mb3JtIH0pO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgZGV0YWlscyBvZiB0aGUgZ2l2ZW4gYWNjb3VudC5cbiAgICovXG4gIGdldEFjY291bnQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBwYXJhbSgnaWQnKS50b0ludCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgeyBpZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IGFjY291bnQgPSBhd2FpdCBBY2NvdW50LndoZXJlKCdpZCcsIGlkKS5mZXRjaCgpO1xuXG4gICAgICBpZiAoIWFjY291bnQpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyBpdGVtOiB7IC4uLmFjY291bnQuYXR0cmlidXRlcyB9IH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIERlbGV0ZSB0aGUgZ2l2ZW4gYWNjb3VudC5cbiAgICovXG4gIGRlbGV0ZUFjY291bnQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBwYXJhbSgnaWQnKS50b0ludCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgeyBpZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IGFjY291bnQgPSBhd2FpdCBBY2NvdW50LnF1ZXJ5KCkuZmluZEJ5SWQoaWQpO1xuXG4gICAgICBpZiAoIWFjY291bnQpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKCk7XG4gICAgICB9XG4gICAgICBjb25zdCBhY2NvdW50VHJhbnNhY3Rpb25zID0gYXdhaXQgQWNjb3VudFRyYW5zYWN0aW9uLnF1ZXJ5KClcbiAgICAgICAgLndoZXJlKCdhY2NvdW50X2lkJywgYWNjb3VudC5pZCk7XG5cbiAgICAgIGlmIChhY2NvdW50VHJhbnNhY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ0FDQ09VTlQuSEFTLkFTU09DSUFURUQuVFJBTlNBQ1RJT05TJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IEFjY291bnQucXVlcnkoKS5kZWxldGVCeUlkKGFjY291bnQuaWQpO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhY2NvdW50cyBsaXN0LlxuICAgKi9cbiAgZ2V0QWNjb3VudHNMaXN0OiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcXVlcnkoJ2FjY291bnRfdHlwZXMnKS5vcHRpb25hbCgpLmlzQXJyYXkoKSxcbiAgICAgIHF1ZXJ5KCdhY2NvdW50X3R5cGVzLionKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmb3JtID0ge1xuICAgICAgICBhY2NvdW50X3R5cGVzOiBbXSxcbiAgICAgICAgLi4ucmVxLmJvZHksXG4gICAgICB9O1xuICAgICAgY29uc3QgYWNjb3VudHMgPSBhd2FpdCBBY2NvdW50LnF1ZXJ5KClcbiAgICAgICAgLm1vZGlmeSgnZmlsdGVyQWNjb3VudFR5cGVzJywgZm9ybS5hY2NvdW50X3R5cGVzKTtcblxuICAgICAgY29uc3QgYWNjb3VudHNOZXN0ZWRTZXQgPSBuZXcgTmVzdGVkU2V0KGFjY291bnRzLCB7XG4gICAgICAgIHBhcmVudElkOiAncGFyZW50QWNjb3VudElkJyxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoe1xuICAgICAgICAvLyAuLi5hY2NvdW50c05lc3RlZFNldC50b0FycmF5KCksXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZS1jYWxjdWxhdGVzIGJhbGFuY2Ugb2YgdGhlIGdpdmVuIGFjY291bnQuXG4gICAqL1xuICByZWNhbGN1YWx0ZUJhbGFuYWNlOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ2lkJykuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCBhY2NvdW50ID0gYXdhaXQgQWNjb3VudC5maW5kQnlJZChpZCk7XG5cbiAgICAgIGlmICghYWNjb3VudCkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoe1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ0FDQ09VTlQuTk9ULkZPVU5EJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFjY291bnRUcmFuc2FjdGlvbnMgPSBBY2NvdW50VHJhbnNhY3Rpb24ucXVlcnkoKVxuICAgICAgICAud2hlcmUoJ2FjY291bnRfaWQnLCBhY2NvdW50LmlkKTtcblxuICAgICAgY29uc3Qgam91cm5hbEVudHJpZXMgPSBuZXcgSm91cm5hbFBvc3RlcigpO1xuICAgICAgam91cm5hbEVudHJpZXMubG9hZEZyb21Db2xsZWN0aW9uKGFjY291bnRUcmFuc2FjdGlvbnMpO1xuXG4gICAgICAvLyBEZWxldGUgdGhlIGJhbGFuY2Ugb2YgdGhlIGdpdmVuIGFjY291bnQgaWQuXG4gICAgICBhd2FpdCBBY2NvdW50QmFsYW5jZS5xdWVyeSgpLndoZXJlKCdhY2NvdW50X2lkJywgYWNjb3VudC5pZCkuZGVsZXRlKCk7XG5cbiAgICAgIC8vIFNhdmUgY2FsY3VhbHRlZCBhY2NvdW50IGJhbGFuY2UuXG4gICAgICBhd2FpdCBqb3VybmFsRW50cmllcy5zYXZlQmFsYW5jZSgpO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBBY3RpdmUgdGhlIGdpdmVuIGFjY291bnQuXG4gICAqL1xuICBhY3RpdmVBY2NvdW50OiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ2lkJykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCBhY2NvdW50ID0gYXdhaXQgQWNjb3VudC5maW5kQnlJZChpZCk7XG5cbiAgICAgIGlmICghYWNjb3VudCkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoe1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ0FDQ09VTlQuTk9ULkZPVU5EJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IGFjY291bnQucGF0Y2goeyBhY3RpdmU6IHRydWUgfSk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGlkOiBhY2NvdW50LmlkIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIEluYWN0aXZlIHRoZSBnaXZlbiBhY2NvdW50LlxuICAgKi9cbiAgaW5hY3RpdmVBY2NvdW50OiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ2lkJykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCBhY2NvdW50ID0gYXdhaXQgQWNjb3VudC5maW5kQnlJZChpZCk7XG5cbiAgICAgIGlmICghYWNjb3VudCkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoe1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ0FDQ09VTlQuTk9ULkZPVU5EJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IGFjY291bnQucGF0Y2goeyBhY3RpdmU6IGZhbHNlIH0pO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyBpZDogYWNjb3VudC5pZCB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBUcmFuc2ZlciBhbGwgam91cm5hbCBlbnRyaWVzIG9mIHRoZSBnaXZlbiBhY2NvdW50IHRvIGFub3RoZXIgYWNjb3VudC5cbiAgICovXG4gIHRyYW5zZmVyVG9Bbm90aGVyQWNjb3VudDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdpZCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBwYXJhbSgndG9BY2NvdW50JykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIGNvbnN0IHsgaWQsIHRvQWNjb3VudDogdG9BY2NvdW50SWQgfSA9IHJlcS5wYXJhbXM7XG5cbiAgICAgIC8vIGNvbnN0IFtmcm9tQWNjb3VudCwgdG9BY2NvdW50XSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIC8vICAgQWNjb3VudC5xdWVyeSgpLmZpbmRCeUlkKGlkKSxcbiAgICAgIC8vICAgQWNjb3VudC5xdWVyeSgpLmZpbmRCeUlkKHRvQWNjb3VudElkKSxcbiAgICAgIC8vIF0pO1xuXG4gICAgICAvLyBjb25zdCBmcm9tQWNjb3VudFRyYW5zYWN0aW9ucyA9IGF3YWl0IEFjY291bnRUcmFuc2FjdGlvbi5xdWVyeSgpXG4gICAgICAvLyAgIC53aGVyZSgnYWNjb3VudF9pZCcsIGZyb21BY2NvdW50KTtcblxuICAgICAgLy8gcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKCk7XG4gICAgfSxcbiAgfSxcbn07XG4iLCJcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgY2hlY2ssIHZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICdleHByZXNzLXZhbGlkYXRvcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgTXVzdGFjaGUgZnJvbSAnbXVzdGFjaGUnO1xuaW1wb3J0IGp3dCBmcm9tICdqc29ud2VidG9rZW4nO1xuaW1wb3J0IGFzeW5jTWlkZGxld2FyZSBmcm9tICcuLi9taWRkbGV3YXJlL2FzeW5jTWlkZGxld2FyZSc7XG5pbXBvcnQgVXNlciBmcm9tICdAL21vZGVscy9Vc2VyJztcbmltcG9ydCBQYXNzd29yZFJlc2V0IGZyb20gJ0AvbW9kZWxzL1Bhc3N3b3JkUmVzZXQnO1xuaW1wb3J0IG1haWwgZnJvbSAnQC9zZXJ2aWNlcy9tYWlsJztcbmltcG9ydCB7IGhhc2hQYXNzd29yZCB9IGZyb20gJ0AvdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBtZXRob2QuXG4gICAqL1xuICByb3V0ZXIoKSB7XG4gICAgY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcblxuICAgIHJvdXRlci5wb3N0KCcvbG9naW4nLFxuICAgICAgdGhpcy5sb2dpbi52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMubG9naW4uaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLnBvc3QoJy9zZW5kX3Jlc2V0X3Bhc3N3b3JkJyxcbiAgICAgIHRoaXMuc2VuZFJlc2V0UGFzc3dvcmQudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLnNlbmRSZXNldFBhc3N3b3JkLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCcvcmVzZXQvOnRva2VuJyxcbiAgICAgIHRoaXMucmVzZXRQYXNzd29yZC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMucmVzZXRQYXNzd29yZC5oYW5kbGVyKSk7XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9LFxuXG4gIC8qKlxuICAgKiBVc2VyIGxvZ2luIGF1dGhlbnRpY2F0aW9uIHJlcXVlc3QuXG4gICAqL1xuICBsb2dpbjoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCdjcmVkaWVudGlhbCcpLmV4aXN0cygpLmlzRW1haWwoKSxcbiAgICAgIGNoZWNrKCdwYXNzd29yZCcpLmV4aXN0cygpLmlzTGVuZ3RoKHsgbWluOiA1IH0pLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHsgY3JlZGllbnRpYWwsIHBhc3N3b3JkIH0gPSByZXEuYm9keTtcbiAgICAgIGNvbnN0IHsgSldUX1NFQ1JFVF9LRVkgfSA9IHByb2Nlc3MuZW52O1xuXG4gICAgICBjb25zdCB1c2VyID0gYXdhaXQgVXNlci5xdWVyeSgpXG4gICAgICAgIC53aGVyZSgnZW1haWwnLCBjcmVkaWVudGlhbClcbiAgICAgICAgLm9yV2hlcmUoJ3Bob25lX251bWJlcicsIGNyZWRpZW50aWFsKVxuICAgICAgICAuZmlyc3QoKTtcblxuICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWRSZXF1ZXN0KG51bGwsIHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdJTlZBTElEX0RFVEFJTFMnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKCF1c2VyLnZlcmlmeVBhc3N3b3JkKHBhc3N3b3JkKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkUmVxdWVzdChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnSU5DT1JSRUNUX1BBU1NXT1JEJywgY29kZTogMTEwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmICghdXNlci5hY3RpdmUpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ1VTRVJfSU5BQ1RJVkUnLCBjb2RlOiAxMjAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLy8gdXNlci51cGRhdGUoeyBsYXN0X2xvZ2luX2F0OiBuZXcgRGF0ZSgpIH0pO1xuXG4gICAgICBjb25zdCB0b2tlbiA9IGp3dC5zaWduKHtcbiAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXG4gICAgICAgIF9pZDogdXNlci5pZCxcbiAgICAgIH0sIEpXVF9TRUNSRVRfS0VZLCB7XG4gICAgICAgIGV4cGlyZXNJbjogJzFkJyxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgdG9rZW4gfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogU2VuZCByZXNldCBwYXNzd29yZCBsaW5rIHZpYSBlbWFpbCBvciBTTVMuXG4gICAqL1xuICBzZW5kUmVzZXRQYXNzd29yZDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCdlbWFpbCcpLmV4aXN0cygpLmlzRW1haWwoKSxcbiAgICBdLFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCB7IGVtYWlsIH0gPSByZXEuYm9keTtcbiAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBVc2VyLndoZXJlKCdlbWFpbCcsIGVtYWlsKS5mZXRjaCgpO1xuXG4gICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDIyKS5zZW5kKCk7XG4gICAgICB9XG4gICAgICAvLyBEZWxldGUgYWxsIHN0b3JlZCB0b2tlbnMgb2YgcmVzZXQgcGFzc3dvcmQgdGhhdCBhc3NvY2lhdGUgdG8gdGhlIGdpdmUgZW1haWwuXG4gICAgICBhd2FpdCBQYXNzd29yZFJlc2V0LndoZXJlKHsgZW1haWwgfSkuZGVzdHJveSh7IHJlcXVpcmU6IGZhbHNlIH0pO1xuXG4gICAgICBjb25zdCBwYXNzd29yZFJlc2V0ID0gUGFzc3dvcmRSZXNldC5mb3JnZSh7XG4gICAgICAgIGVtYWlsLFxuICAgICAgICB0b2tlbjogJzEyMzEyMycsXG4gICAgICB9KTtcbiAgICAgIGF3YWl0IHBhc3N3b3JkUmVzZXQuc2F2ZSgpO1xuXG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi92aWV3cy9tYWlsL1Jlc2V0UGFzc3dvcmQuaHRtbCcpO1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsICd1dGY4Jyk7XG4gICAgICBjb25zdCByZW5kZXJlZCA9IE11c3RhY2hlLnJlbmRlcih0ZW1wbGF0ZSwge1xuICAgICAgICB1cmw6IGAke3JlcS5wcm90b2NvbH06Ly8ke3JlcS5ob3N0bmFtZX0vcmVzZXQvJHtwYXNzd29yZFJlc2V0LmF0dHJpYnV0ZXMudG9rZW59YCxcbiAgICAgICAgZmlyc3RfbmFtZTogdXNlci5hdHRyaWJ1dGVzLmZpcnN0X25hbWUsXG4gICAgICAgIGxhc3RfbmFtZTogdXNlci5hdHRyaWJ1dGVzLmxhc3RfbmFtZSxcbiAgICAgICAgY29udGFjdF91c19lbWFpbDogcHJvY2Vzcy5lbnYuQ09OVEFDVF9VU19FTUFJTCxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBtYWlsT3B0aW9ucyA9IHtcbiAgICAgICAgdG86IHVzZXIuYXR0cmlidXRlcy5lbWFpbCxcbiAgICAgICAgZnJvbTogYCR7cHJvY2Vzcy5lbnYuTUFJTF9GUk9NX05BTUV9ICR7cHJvY2Vzcy5lbnYuTUFJTF9GUk9NX0FERFJFU1N9YCxcbiAgICAgICAgc3ViamVjdDogJ1JhdHRlYiBQYXNzd29yZCBSZXNldCcsXG4gICAgICAgIGh0bWw6IHJlbmRlcmVkLFxuICAgICAgfTtcblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gICAgICBtYWlsLnNlbmRNYWlsKG1haWxPcHRpb25zLCAoZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoeyBkYXRhOiB7IGVtYWlsOiBwYXNzd29yZFJlc2V0LmF0dHJpYnV0ZXMuZW1haWwgfSB9KTtcbiAgICAgIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlc2V0IHBhc3N3b3JkLlxuICAgKi9cbiAgcmVzZXRQYXNzd29yZDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCdwYXNzd29yZCcpLmV4aXN0cygpLmlzTGVuZ3RoKHsgbWluOiA1IH0pLmN1c3RvbSgodmFsdWUsIHsgcmVxIH0pID0+IHtcbiAgICAgICAgaWYgKHZhbHVlICE9PSByZXEuYm9keS5jb25maXJtX3Bhc3N3b3JkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUGFzc3dvcmRzIGRvbid0IG1hdGNoXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAnVkFMSURBVElPTl9FUlJPUicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgeyB0b2tlbiB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IHsgcGFzc3dvcmQgfSA9IHJlcS5ib2R5O1xuXG4gICAgICBjb25zdCB0b2tlbk1vZGVsID0gYXdhaXQgUGFzc3dvcmRSZXNldC5xdWVyeSgpXG4gICAgICAgIC53aGVyZSgndG9rZW4nLCB0b2tlbilcbiAgICAgICAgLndoZXJlKCdjcmVhdGVkX2F0JywgJz49JywgRGF0ZS5ub3coKSAtIDM2MDAwMDApXG4gICAgICAgIC5maXJzdCgpO1xuXG4gICAgICBpZiAoIXRva2VuTW9kZWwpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ1RPS0VOX0lOVkFMSUQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgdXNlciA9IGF3YWl0IFVzZXIud2hlcmUoe1xuICAgICAgICBlbWFpbDogdG9rZW5Nb2RlbC5lbWFpbCxcbiAgICAgIH0pO1xuICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWRSZXF1ZXN0KG51bGwsIHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdVU0VSX05PVF9GT1VORCcsIGNvZGU6IDEyMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBoYXNoZWRQYXNzd29yZCA9IGF3YWl0IGhhc2hQYXNzd29yZChwYXNzd29yZCk7XG5cbiAgICAgIHVzZXIucGFzc3dvcmQgPSBoYXNoZWRQYXNzd29yZDtcbiAgICAgIGF3YWl0IHVzZXIuc2F2ZSgpO1xuXG4gICAgICBhd2FpdCBQYXNzd29yZFJlc2V0LndoZXJlKCdlbWFpbCcsIHVzZXIuZ2V0KCdlbWFpbCcpKS5kZXN0cm95KHsgcmVxdWlyZTogZmFsc2UgfSk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7fSk7XG4gICAgfSxcbiAgfSxcbn07XG4iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIHJvdXRlcigpIHtcbiAgICBjb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuXG4gICAgcmV0dXJuIHJvdXRlcjtcbiAgfSxcbn07XG4iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCB7XG4gIGNoZWNrLFxuICBxdWVyeSxcbiAgcGFyYW0sXG4gIHZhbGlkYXRpb25SZXN1bHQsXG59IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJztcbmltcG9ydCB7IHBpY2ssIGRpZmZlcmVuY2UsIGdyb3VwQnkgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGFzeW5jTWlkZGxld2FyZSBmcm9tIFwiQC9odHRwL21pZGRsZXdhcmUvYXN5bmNNaWRkbGV3YXJlXCI7XG5pbXBvcnQgSldUQXV0aCBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9qd3RBdXRoJztcbmltcG9ydCBCdWRnZXQgZnJvbSAnQC9tb2RlbHMvQnVkZ2V0JztcbmltcG9ydCBCdWRnZXRFbnRyeSBmcm9tICdAL21vZGVscy9CdWRnZXRFbnRyeSc7XG5pbXBvcnQgQWNjb3VudCBmcm9tICdAL21vZGVscy9BY2NvdW50JztcbmltcG9ydCBtb21lbnQgZnJvbSAnQC9zZXJ2aWNlcy9Nb21lbnQnO1xuaW1wb3J0IEJ1ZGdldEVudHJpZXNTZXQgZnJvbSAnQC9jb2xsZWN0aW9uL0J1ZGdldEVudHJpZXNTZXQnO1xuaW1wb3J0IEFjY291bnRUeXBlIGZyb20gJ0AvbW9kZWxzL0FjY291bnRUeXBlJztcbmltcG9ydCBOZXN0ZWRTZXQgZnJvbSAnQC9jb2xsZWN0aW9uL05lc3RlZFNldCc7XG5pbXBvcnQgeyBkYXRlUmFuZ2VGb3JtYXQgfSBmcm9tICdAL3V0aWxzJztcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBSb3V0ZXIgY29uc3RydWN0b3IuXG4gICAqL1xuICByb3V0ZXIoKSB7XG4gICAgY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcblxuICAgIHJvdXRlci51c2UoSldUQXV0aCk7XG5cbiAgICByb3V0ZXIucG9zdCgnLycsXG4gICAgICB0aGlzLm5ld0J1ZGdldC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMubmV3QnVkZ2V0LmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5nZXQoJy86aWQnLFxuICAgICAgdGhpcy5nZXRCdWRnZXQudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmdldEJ1ZGdldC5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvOmlkJyxcbiAgICAgIHRoaXMuZGVsZXRlQnVkZ2V0LnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5kZWxldGVCdWRnZXQuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmdldCgnLycsXG4gICAgICB0aGlzLmxpc3RCdWRnZXRzLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5saXN0QnVkZ2V0cy5oYW5kbGVyKSk7XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBidWRnZXQgZGV0YWlscyBvZiB0aGUgZ2l2ZW4gaWQuXG4gICAqL1xuICBnZXRCdWRnZXQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBwYXJhbSgnaWQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCBidWRnZXQgPSBhd2FpdCBCdWRnZXQucXVlcnkoKS5maW5kQnlJZChpZCk7XG5cbiAgICAgIGlmICghYnVkZ2V0KSB7XG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwNCkuc2VuZCh7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnYnVkZ2V0Lm5vdC5mb3VuZCcsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBhY2NvdW50VHlwZXMgPSBhd2FpdCBBY2NvdW50VHlwZS5xdWVyeSgpLndoZXJlKCdiYWxhbmNlX3NoZWV0JywgdHJ1ZSk7XG5cbiAgICAgIGNvbnN0IFtidWRnZXRFbnRyaWVzLCBhY2NvdW50c10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIEJ1ZGdldEVudHJ5LnF1ZXJ5KCkud2hlcmUoJ2J1ZGdldF9pZCcsIGJ1ZGdldC5pZCksXG4gICAgICAgIEFjY291bnQucXVlcnkoKS53aGVyZUluKCdhY2NvdW50X3R5cGVfaWQnLCBhY2NvdW50VHlwZXMubWFwKChhKSA9PiBhLmlkKSksXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYWNjb3VudHNOZXN0ZWRTZXQgPSBuZXcgTmVzdGVkU2V0KGFjY291bnRzKTtcblxuICAgICAgY29uc3QgY29sdW1ucyA9IFtdO1xuICAgICAgY29uc3QgZnJvbURhdGUgPSBtb21lbnQoYnVkZ2V0LnllYXIpLnN0YXJ0T2YoJ3llYXInKVxuICAgICAgICAuYWRkKGJ1ZGdldC5yYW5nZU9mZnNldCwgYnVkZ2V0LnJhbmdlQnkpLnRvRGF0ZSgpO1xuXG4gICAgICBjb25zdCB0b0RhdGUgPSBtb21lbnQoYnVkZ2V0LnllYXIpLmVuZE9mKCd5ZWFyJykudG9EYXRlKCk7XG5cbiAgICAgIGNvbnN0IGRhdGVSYW5nZSA9IG1vbWVudC5yYW5nZShmcm9tRGF0ZSwgdG9EYXRlKTtcbiAgICAgIGNvbnN0IGRhdGVSYW5nZUNvbGxlY3Rpb24gPSBBcnJheS5mcm9tKGRhdGVSYW5nZS5ieShidWRnZXQucmFuZ2VCeSwge1xuICAgICAgICBzdGVwOiBidWRnZXQucmFuZ2VJbmNyZW1lbnQsIGV4Y2x1ZGVFbmQ6IGZhbHNlLCBleGNsdWRlU3RhcnQ6IGZhbHNlLFxuICAgICAgfSkpO1xuXG4gICAgICBkYXRlUmFuZ2VDb2xsZWN0aW9uLmZvckVhY2goKGRhdGUpID0+IHtcbiAgICAgICAgY29sdW1ucy5wdXNoKGRhdGUuZm9ybWF0KGRhdGVSYW5nZUZvcm1hdChidWRnZXQucmFuZ2VCeSkpKTtcbiAgICAgIH0pO1xuICAgICAgY29uc3QgYnVkZ2V0RW50cmllc1NldCA9IEJ1ZGdldEVudHJpZXNTZXQuZnJvbShidWRnZXRFbnRyaWVzLCB7XG4gICAgICAgIG9yZGVyU2l6ZTogY29sdW1ucy5sZW5ndGgsXG4gICAgICB9KTtcbiAgICAgIGJ1ZGdldEVudHJpZXNTZXQuc2V0WmVyb1BsYWNlaG9sZGVyKCk7XG4gICAgICBidWRnZXRFbnRyaWVzU2V0LmNhbGNUb3RhbFN1bW1hcnkoKTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgY29sdW1ucyxcbiAgICAgICAgYWNjb3VudHM6IGJ1ZGdldEVudHJpZXNTZXQudG9BcnJheSgpLFxuICAgICAgICB0b3RhbDogYnVkZ2V0RW50cmllc1NldC50b0FycmF5VG90YWxTdW1tYXJ5KCksXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBEZWxldGUgdGhlIGdpdmVuIGJ1ZGdldC5cbiAgICovXG4gIGRlbGV0ZUJ1ZGdldDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdpZCcpLmV4aXN0cygpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBpZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IGJ1ZGdldCA9IGF3YWl0IEJ1ZGdldC5xdWVyeSgpLmZpbmRCeUlkKGlkKTtcblxuICAgICAgaWYgKCFidWRnZXQpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5zZW5kKHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdidWRnZXQubm90LmZvdW5kJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IEJ1ZGdldEVudHJ5LnF1ZXJ5KCkud2hlcmUoJ2J1ZGdldF9pZCcsIGJ1ZGdldC5pZCkuZGVsZXRlKCk7XG4gICAgICBhd2FpdCBidWRnZXQuZGVsZXRlKCk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCgpO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIFNhdmVzIHRoZSBuZXcgYnVkZ2V0LlxuICAgKi9cbiAgbmV3QnVkZ2V0OiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgY2hlY2soJ25hbWUnKS5leGlzdHMoKSxcbiAgICAgIGNoZWNrKCdmaXNjYWxfeWVhcicpLmV4aXN0cygpLFxuICAgICAgY2hlY2soJ3BlcmlvZCcpLmV4aXN0cygpLmlzSW4oWyd5ZWFyJywgJ21vbnRoJywgJ3F1YXJ0ZXInLCAnaGFsZi15ZWFyJ10pLFxuICAgICAgY2hlY2soJ2FjY291bnRzX3R5cGUnKS5leGlzdHMoKS5pc0luKFsnYmFsYW5jZV9zaGVldCcsICdwcm9maXRfbG9zcyddKSxcbiAgICAgIGNoZWNrKCdhY2NvdW50cycpLmlzQXJyYXkoKSxcbiAgICAgIGNoZWNrKCdhY2NvdW50cy4qLmFjY291bnRfaWQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2FjY291bnRzLiouZW50cmllcycpLmV4aXN0cygpLmlzQXJyYXkoKSxcbiAgICAgIGNoZWNrKCdhY2NvdW50cy4qLmVudHJpZXMuKi5hbW91bnQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0Zsb2F0KCksXG4gICAgICBjaGVjaygnYWNjb3VudHMuKi5lbnRyaWVzLioub3JkZXInKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZm9ybSA9IHsgLi4ucmVxLmJvZHkgfTtcbiAgICAgIGNvbnN0IHN1Ym1pdEFjY291bnRzSWRzID0gZm9ybS5hY2NvdW50cy5tYXAoKGEpID0+IGEuYWNjb3VudF9pZCk7XG4gICAgICBjb25zdCBzdG9yZWRBY2NvdW50cyA9IGF3YWl0IEFjY291bnQucXVlcnkoKS53aGVyZUluKCdpZCcsIHN1Ym1pdEFjY291bnRzSWRzKTtcbiAgICAgIGNvbnN0IHN0b3JlZEFjY291bnRzSWRzID0gc3RvcmVkQWNjb3VudHMubWFwKChhKSA9PiBhLmlkKTtcblxuICAgICAgY29uc3QgZXJyb3JSZWFzb25zID0gW107XG4gICAgICBjb25zdCBub3RGb3VuZEFjY291bnRzSWRzID0gZGlmZmVyZW5jZShzdWJtaXRBY2NvdW50c0lkcywgc3RvcmVkQWNjb3VudHNJZHMpO1xuXG4gICAgICBpZiAobm90Rm91bmRBY2NvdW50c0lkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnQUNDT1VOVC5OT1QuRk9VTkQnLCBjb2RlOiAyMDAsIGFjY291bnRzOiBub3RGb3VuZEFjY291bnRzSWRzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChlcnJvclJlYXNvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoeyBlcnJvcnM6IGVycm9yUmVhc29ucyB9KTtcbiAgICAgIH1cbiAgICAgIC8vIHZhbGlkYXRpb24gZW50cmllcyBvcmRlci5cbiAgICAgIGNvbnN0IGJ1ZGdldCA9IGF3YWl0IEJ1ZGdldC5xdWVyeSgpLmluc2VydCh7XG4gICAgICAgIC4uLnBpY2soZm9ybSwgWyduYW1lJywgJ2Zpc2NhbF95ZWFyJywgJ3BlcmlvZCcsICdhY2NvdW50c190eXBlJ10pLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHByb21pc2VPcGVycyA9IFtdO1xuXG4gICAgICBmb3JtLmFjY291bnRzLmZvckVhY2goKGFjY291bnQpID0+IHtcbiAgICAgICAgYWNjb3VudC5lbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICAgICAgY29uc3QgYnVkZ2V0RW50cnkgPSBCdWRnZXRFbnRyeS5xdWVyeSgpLmluc2VydCh7XG4gICAgICAgICAgICBhY2NvdW50X2lkOiBhY2NvdW50LmFjY291bnRfaWQsXG4gICAgICAgICAgICBhbW91bnQ6IGVudHJ5LmFtb3VudCxcbiAgICAgICAgICAgIG9yZGVyOiBlbnRyeS5vcmRlcixcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBwcm9taXNlT3BlcnMucHVzaChidWRnZXRFbnRyeSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlT3BlcnMpO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyBpZDogYnVkZ2V0LmlkIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgcGFnaW5hdGVkIGJ1ZGdldHMgaXRlbXMuXG4gICAqL1xuICBsaXN0QnVkZ2V0czoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHF1ZXJ5KCd5ZWFyJykub3B0aW9uYWwoKSxcbiAgICAgIHF1ZXJ5KCdpbmNvbWVfc3RhdGVtZW50Jykub3B0aW9uYWwoKS5pc0Jvb2xlYW4oKS50b0Jvb2xlYW4oKSxcbiAgICAgIHF1ZXJ5KCdwcm9maXRfbG9zcycpLm9wdGlvbmFsKCkuaXNCb29sZWFuKCkudG9Cb29sZWFuKCksXG4gICAgICBxdWVyeSgncGFnZScpLm9wdGlvbmFsKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIHF1ZXJ5KCdwYWdlX3NpemUnKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgcXVlcnkoJ2N1c3RvbV92aWV3X2lkJykub3B0aW9uYWwoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmlsdGVyID0ge1xuICAgICAgICBwYWdlX3NpemU6IDEwLFxuICAgICAgICBwYWdlOiAxLFxuICAgICAgICAuLi5yZXEucXVlcnksXG4gICAgICB9O1xuICAgICAgY29uc3QgYnVkZ2V0cyA9IGF3YWl0IEJ1ZGdldC5xdWVyeSgpLnJ1bkJlZm9yZSgocmVzdWx0LCBxKSA9PiB7XG4gICAgICAgIGlmIChmaWx0ZXIucHJvZml0X2xvc3MpIHtcbiAgICAgICAgICBxLm1vZGlmeSgnZmlsdGVyQnlZZWFyJywgZmlsdGVyLnllYXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWx0ZXIuaW5jb21lX3N0YXRlbWVudCkge1xuICAgICAgICAgIHEubW9kaWZ5KCdmaWx0ZXJCeUluY29tZVN0YXRlbWVudCcsIGZpbHRlci5pbmNvbWVfc3RhdGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmlsdGVyLnByb2ZpdF9sb3NzKSB7XG4gICAgICAgICAgcS5tb2RpZnkoJ2ZpbHRlckJ5UHJvZml0TG9zcycsIGZpbHRlci5wcm9maXRfbG9zcyk7XG4gICAgICAgIH1cbiAgICAgICAgcS5wYWdlKGZpbHRlci5wYWdlLCBmaWx0ZXIucGFnZV9zaXplKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgaXRlbXM6IGJ1ZGdldHMuaXRlbXMsXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxufTtcbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgcXVlcnksIHZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICdleHByZXNzLXZhbGlkYXRvcic7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgand0QXV0aCBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9qd3RBdXRoJztcbmltcG9ydCBhc3luY01pZGRsZXdhcmUgZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvYXN5bmNNaWRkbGV3YXJlJztcbmltcG9ydCBCdWRnZXQgZnJvbSAnQC9tb2RlbHMvQnVkZ2V0JztcbmltcG9ydCBBY2NvdW50IGZyb20gJ0AvbW9kZWxzL0FjY291bnQnO1xuaW1wb3J0IEFjY291bnRUeXBlIGZyb20gJ0AvbW9kZWxzL0FjY291bnRUeXBlJztcbmltcG9ydCBOZXN0ZWRTZXQgZnJvbSAnQC9jb2xsZWN0aW9uL05lc3RlZFNldCc7XG5pbXBvcnQgQnVkZ2V0RW50cnkgZnJvbSAnQC9tb2RlbHMvQnVkZ2V0RW50cnknO1xuaW1wb3J0IHsgZGF0ZVJhbmdlRm9ybWF0IH0gZnJvbSAnQC91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICAvKipcbiAgICogUm91dGVyIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbiAgICByb3V0ZXIudXNlKGp3dEF1dGgpO1xuXG4gICAgcm91dGVyLmdldCgnL2J1ZGdldF92ZXJzZXNfYWN0dWFsLzpyZXBvcnRJZCcsXG4gICAgICB0aGlzLmJ1ZGdldFZlcnNlc0FjdHVhbC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuYnVkZ2V0VmVyc2VzQWN0dWFsLmhhbmRsZXIpKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG5cbiAgYnVkZ2V0VmVyc2VzQWN0dWFsOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcXVlcnkoJ2Jhc2lzJykub3B0aW9uYWwoKS5pc0luKFsnY2FzaCcsICdhY2N1cmFsJ10pLFxuICAgICAgcXVlcnkoJ3BlcmlvZCcpLm9wdGlvbmFsKCksXG4gICAgICBxdWVyeSgnYWN0aXZlX2FjY291bnRzJykub3B0aW9uYWwoKS50b0Jvb2xlYW4oKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCB7IHJlcG9ydElkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgZm9ybSA9IHsgLi4ucmVxLmJvZHkgfTtcbiAgICAgIGNvbnN0IGVycm9yUmVhc29ucyA9IFtdO1xuXG4gICAgICBjb25zdCBidWRnZXQgPSBhd2FpdCBCdWRnZXQucXVlcnkoKS5maW5kQnlJZChyZXBvcnRJZCk7XG5cbiAgICAgIGlmICghYnVkZ2V0KSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHsgdHlwZTogJ0JVREdFVF9OT1RfRk9VTkQnLCBjb2RlOiAxMDAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBidWRnZXRFbnRyaWVzID0gYXdhaXQgQnVkZ2V0RW50cnkucXVlcnkoKS53aGVyZSgnYnVkZ2V0X2lkJywgYnVkZ2V0LmlkKTtcblxuICAgICAgaWYgKGVycm9yUmVhc29ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7IGVycm9yczogZXJyb3JSZWFzb25zIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgYWNjb3VudFR5cGVzID0gYXdhaXQgQWNjb3VudFR5cGUucXVlcnkoKVxuICAgICAgICAud2hlcmUoJ2JhbGFuY2Vfc2hlZXQnLCBidWRnZXQuYWNjb3VudFR5cGVzID09PSAnYmFsYW5jZV9zaGVldCcpXG4gICAgICAgIC53aGVyZSgnaW5jb21lX3NoZWV0JywgYnVkZ2V0LmFjY291bnRUeXBlcyA9PT0gJ3Byb2ZpdF9sb3NzcycpO1xuXG4gICAgICBjb25zdCBhY2NvdW50cyA9IGF3YWl0IEFjY291bnQucXVlcnkoKS5ydW5CZWZvcmUoKHJlc3VsdCwgcSkgPT4ge1xuICAgICAgICBjb25zdCBhY2NvdW50VHlwZXNJZHMgPSBhY2NvdW50VHlwZXMubWFwKCh0KSA9PiB0LmlkKTtcblxuICAgICAgICBpZiAoYWNjb3VudFR5cGVzSWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBxLndoZXJlSW4oJ2FjY291bnRfdHlwZV9pZCcsIGFjY291bnRUeXBlc0lkcyk7XG4gICAgICAgIH1cbiAgICAgICAgcS53aGVyZSgnYWN0aXZlJywgZm9ybS5hY3RpdmVfYWNjb3VudHMgPT09IHRydWUpO1xuICAgICAgICBxLndpdGhHcmFwaEZldGNoZWQoJ3RyYW5zYWN0aW9ucycpO1xuICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgLy8gY29uc3QgYWNjb3VudHNOZXN0ZWRTZXQgPSBOZXN0ZWRTZXQuZnJvbShhY2NvdW50cyk7XG5cbiAgICAgIGNvbnN0IGZyb21EYXRlID0gbW9tZW50KGJ1ZGdldC55ZWFyKS5zdGFydE9mKCd5ZWFyJylcbiAgICAgICAgLmFkZChidWRnZXQucmFuZ2VPZmZzZXQsIGJ1ZGdldC5yYW5nZUJ5KS50b0RhdGUoKTtcblxuICAgICAgY29uc3QgdG9EYXRlID0gbW9tZW50KGJ1ZGdldC55ZWFyKS5lbmRPZigneWVhcicpLnRvRGF0ZSgpO1xuXG4gICAgICBjb25zdCBkYXRlUmFuZ2UgPSBtb21lbnQucmFuZ2UoZnJvbURhdGUsIHRvRGF0ZSk7XG4gICAgICBjb25zdCBkYXRlUmFuZ2VDb2xsZWN0aW9uID0gQXJyYXkuZnJvbShkYXRlUmFuZ2UuYnkoYnVkZ2V0LnJhbmdlQnksIHtcbiAgICAgICAgc3RlcDogYnVkZ2V0LnJhbmdlSW5jcmVtZW50LCBleGNsdWRlRW5kOiBmYWxzZSwgZXhjbHVkZVN0YXJ0OiBmYWxzZSxcbiAgICAgIH0pKTtcblxuICAgIC8vICAgLy8gY29uc3QgYWNjb3VudHMgPSB7XG4gICAgLy8gICAvLyAgIGFzc2V0czogW1xuICAgIC8vICAgLy8gICAgIHtcbiAgICAvLyAgIC8vICAgICAgIG5hbWU6ICcnLFxuICAgIC8vICAgLy8gICAgICAgY29kZTogJycsXG4gICAgLy8gICAvLyAgICAgICB0b3RhbEVudHJpZXM6IFtcbiAgICAvLyAgIC8vICAgICAgICAge1xuXG4gICAgLy8gICAvLyAgICAgICAgIH1cbiAgICAvLyAgIC8vICAgICAgIF0sXG4gICAgLy8gICAvLyAgICAgICBjaGlsZHJlbjogW1xuICAgIC8vICAgLy8gICAgICAgICB7XG4gICAgLy8gICAvLyAgICAgICAgICAgbmFtZTogJycsXG4gICAgLy8gICAvLyAgICAgICAgICAgY29kZTogJycsXG4gICAgLy8gICAvLyAgICAgICAgICAgZW50cmllczogW1xuICAgIC8vICAgLy8gICAgICAgICAgICAge1xuXG4gICAgLy8gICAvLyAgICAgICAgICAgICB9XG4gICAgLy8gICAvLyAgICAgICAgICAgXVxuICAgIC8vICAgLy8gICAgICAgICB9XG4gICAgLy8gICAvLyAgICAgICBdXG4gICAgLy8gICAvLyAgICAgfVxuICAgIC8vICAgLy8gICBdXG4gICAgLy8gICAvLyB9XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgIGNvbHVtbnM6IGRhdGVSYW5nZUNvbGxlY3Rpb24ubWFwKGQgPT4gZC5mb3JtYXQoZGF0ZVJhbmdlRm9ybWF0KGJ1ZGdldC5yYW5nZUJ5KSkpLFxuICAgICAgICAvLyBhY2NvdW50czoge1xuICAgICAgICAvLyAgIGFzc2V0OiBbXSxcbiAgICAgICAgLy8gICBsaWFiaWxpdGllczogW10sXG4gICAgICAgIC8vICAgZXF1YWl0eTogW10sXG5cbiAgICAgICAgLy8gICBpbmNvbWU6IFtdLFxuICAgICAgICAvLyAgIGV4cGVuc2VzOiBbXSxcbiAgICAgICAgLy8gfVxuICAgICAgfSk7XG4gICAgfSxcbiAgfSxcbn0iLCJcbmV4cG9ydCBkZWZhdWx0IHtcblxuXG4gIHJvdXRlcigpIHtcblxuICB9LFxuICBcbiAgYWRkRXhjaGFuZ2VQcmljZToge1xuICAgIHZhbGlkYXRpb246IHtcbiAgICAgIFxuICAgIH0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuXG4gICAgfSxcbiAgfSxcbn0iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIHJvdXRlcigpIHtcbiAgICBjb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuXG4gICAgcmV0dXJuIHJvdXRlcjtcbiAgfSxcbn07XG4iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCB7XG4gIGNoZWNrLFxuICBwYXJhbSxcbiAgcXVlcnksXG4gIHZhbGlkYXRpb25SZXN1bHQsXG59IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7IGRpZmZlcmVuY2UsIGNoYWluLCBvbWl0IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBhc3luY01pZGRsZXdhcmUgZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvYXN5bmNNaWRkbGV3YXJlJztcbmltcG9ydCBFeHBlbnNlIGZyb20gJ0AvbW9kZWxzL0V4cGVuc2UnO1xuaW1wb3J0IEFjY291bnQgZnJvbSAnQC9tb2RlbHMvQWNjb3VudCc7XG5pbXBvcnQgSm91cm5hbFBvc3RlciBmcm9tICdAL3NlcnZpY2VzL0FjY291bnRpbmcvSm91cm5hbFBvc3Rlcic7XG5pbXBvcnQgSm91cm5hbEVudHJ5IGZyb20gJ0Avc2VydmljZXMvQWNjb3VudGluZy9Kb3VybmFsRW50cnknO1xuaW1wb3J0IEpXVEF1dGggZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvand0QXV0aCc7XG5pbXBvcnQgQWNjb3VudFRyYW5zYWN0aW9uIGZyb20gJ0AvbW9kZWxzL0FjY291bnRUcmFuc2FjdGlvbic7XG5pbXBvcnQgVmlldyBmcm9tICdAL21vZGVscy9WaWV3JztcbmltcG9ydCBSZXNvdXJjZSBmcm9tICcuLi8uLi9tb2RlbHMvUmVzb3VyY2UnO1xuaW1wb3J0IFJlc291cmNlQ3VzdG9tRmllbGRSZXBvc2l0b3J5IGZyb20gJ0Avc2VydmljZXMvQ3VzdG9tRmllbGRzL1Jlc291cmNlQ3VzdG9tRmllbGRSZXBvc2l0b3J5JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogUm91dGVyIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG4gICAgcm91dGVyLnVzZShKV1RBdXRoKTtcblxuICAgIHJvdXRlci5wb3N0KCcvJyxcbiAgICAgIHRoaXMubmV3RXhwZW5zZS52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMubmV3RXhwZW5zZS5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIucG9zdCgnLzppZC9wdWJsaXNoJyxcbiAgICAgIHRoaXMucHVibGlzaEV4cGVuc2UudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLnB1Ymxpc2hFeHBlbnNlLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5kZWxldGUoJy86aWQnLFxuICAgICAgdGhpcy5kZWxldGVFeHBlbnNlLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5kZWxldGVFeHBlbnNlLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCcvYnVsaycsXG4gICAgICB0aGlzLmJ1bGtBZGRFeHBlbnNlcy52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuYnVsa0FkZEV4cGVuc2VzLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCcvOmlkJyxcbiAgICAgIHRoaXMudXBkYXRlRXhwZW5zZS52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMudXBkYXRlRXhwZW5zZS5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvJyxcbiAgICAgIHRoaXMubGlzdEV4cGVuc2VzLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5saXN0RXhwZW5zZXMuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmdldCgnLzppZCcsXG4gICAgICB0aGlzLmdldEV4cGVuc2UudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmdldEV4cGVuc2UuaGFuZGxlcikpO1xuXG4gICAgcmV0dXJuIHJvdXRlcjtcbiAgfSxcblxuICAvKipcbiAgICogU2F2ZXMgYSBuZXcgZXhwZW5zZS5cbiAgICovXG4gIG5ld0V4cGVuc2U6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBjaGVjaygnZGF0ZScpLm9wdGlvbmFsKCkuaXNJU084NjAxKCksXG4gICAgICBjaGVjaygncGF5bWVudF9hY2NvdW50X2lkJykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdleHBlbnNlX2FjY291bnRfaWQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2Rlc2NyaXB0aW9uJykub3B0aW9uYWwoKSxcbiAgICAgIGNoZWNrKCdhbW91bnQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0Zsb2F0KCksXG4gICAgICBjaGVjaygnY3VycmVuY3lfY29kZScpLm9wdGlvbmFsKCksXG4gICAgICBjaGVjaygnZXhjaGFuZ2VfcmF0ZScpLm9wdGlvbmFsKCkuaXNOdW1lcmljKCkudG9GbG9hdCgpLFxuICAgICAgY2hlY2soJ3B1Ymxpc2gnKS5vcHRpb25hbCgpLmlzQm9vbGVhbigpLnRvQm9vbGVhbigpLFxuICAgICAgY2hlY2soJ2N1c3RvbV9maWVsZHMnKS5vcHRpb25hbCgpLmlzQXJyYXkoeyBtaW46IDEgfSksXG4gICAgICBjaGVjaygnY3VzdG9tX2ZpZWxkcy4qLmtleScpLmV4aXN0cygpLnRyaW0oKS5lc2NhcGUoKSxcbiAgICAgIGNoZWNrKCdjdXN0b21fZmllbGRzLioudmFsdWUnKS5leGlzdHMoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmb3JtID0ge1xuICAgICAgICBkYXRlOiBuZXcgRGF0ZSgpLFxuICAgICAgICBwdWJsaXNoZWQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZmllbGRzOiBbXSxcbiAgICAgICAgLi4ucmVxLmJvZHksXG4gICAgICB9O1xuICAgICAgLy8gQ29udmVydCB0aGUgZGF0ZSB0byB0aGUgZ2VuZXJhbCBmb3JtYXQuXG4gICAgICBmb3JtLmRhdGUgPSBtb21lbnQoZm9ybS5kYXRlKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbnNcbiAgICAgIGNvbnN0IGVycm9yUmVhc29ucyA9IFtdO1xuICAgICAgY29uc3QgcGF5bWVudEFjY291bnQgPSBhd2FpdCBBY2NvdW50LnF1ZXJ5KClcbiAgICAgICAgLmZpbmRCeUlkKGZvcm0ucGF5bWVudF9hY2NvdW50X2lkKS5maXJzdCgpO1xuXG4gICAgICBpZiAoIXBheW1lbnRBY2NvdW50KSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHsgdHlwZTogJ1BBWU1FTlQuQUNDT1VOVC5OT1QuRk9VTkQnLCBjb2RlOiAxMDAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBleHBlbnNlQWNjb3VudCA9IGF3YWl0IEFjY291bnQucXVlcnkoKS5maW5kQnlJZChmb3JtLmV4cGVuc2VfYWNjb3VudF9pZCkuZmlyc3QoKTtcblxuICAgICAgaWYgKCFleHBlbnNlQWNjb3VudCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdFWFBFTlNFLkFDQ09VTlQuTk9ULkZPVU5EJywgY29kZTogMjAwIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgY3VzdG9tRmllbGRzID0gbmV3IFJlc291cmNlQ3VzdG9tRmllbGRSZXBvc2l0b3J5KEV4cGVuc2UpO1xuICAgICAgYXdhaXQgY3VzdG9tRmllbGRzLmxvYWQoKTtcblxuICAgICAgaWYgKGN1c3RvbUZpZWxkcy52YWxpZGF0ZUV4aXN0Q3VzdG9tRmllbGRzKCkpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnQ1VTVE9NLkZJRUxEUy5TTFVHUy5OT1QuRVhJU1RTJywgY29kZTogNDAwIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGVycm9yUmVhc29ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7IGVycm9yczogZXJyb3JSZWFzb25zIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZXhwZW5zZVRyYW5zYWN0aW9uID0gYXdhaXQgRXhwZW5zZS5xdWVyeSgpLmluc2VydEFuZEZldGNoKHtcbiAgICAgICAgLi4ub21pdChmb3JtLCBbJ2N1c3RvbV9maWVsZHMnXSksXG4gICAgICB9KTtcbiAgICAgIGN1c3RvbUZpZWxkcy5maWxsQ3VzdG9tRmllbGRzKGV4cGVuc2VUcmFuc2FjdGlvbi5pZCwgZm9ybS5jdXN0b21fZmllbGRzKTtcblxuICAgICAgY29uc3Qgam91cm5hbEVudHJpZXMgPSBuZXcgSm91cm5hbFBvc3RlcigpO1xuICAgICAgY29uc3QgY3JlZGl0RW50cnkgPSBuZXcgSm91cm5hbEVudHJ5KHtcbiAgICAgICAgY3JlZGl0OiBmb3JtLmFtb3VudCxcbiAgICAgICAgcmVmZXJlbmNlSWQ6IGV4cGVuc2VUcmFuc2FjdGlvbi5pZCxcbiAgICAgICAgcmVmZXJlbmNlVHlwZTogRXhwZW5zZS5yZWZlcmVuY2VUeXBlLFxuICAgICAgICBkYXRlOiBmb3JtLmRhdGUsXG4gICAgICAgIGFjY291bnQ6IGV4cGVuc2VBY2NvdW50LmlkLFxuICAgICAgICBhY2NvdW50Tm9ybWFsOiAnZGViaXQnLFxuICAgICAgICBkcmFmdDogIWZvcm0ucHVibGlzaGVkLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBkZWJpdEVudHJ5ID0gbmV3IEpvdXJuYWxFbnRyeSh7XG4gICAgICAgIGRlYml0OiBmb3JtLmFtb3VudCxcbiAgICAgICAgcmVmZXJlbmNlSWQ6IGV4cGVuc2VUcmFuc2FjdGlvbi5pZCxcbiAgICAgICAgcmVmZXJlbmNlVHlwZTogRXhwZW5zZS5yZWZlcmVuY2VUeXBlLFxuICAgICAgICBkYXRlOiBmb3JtLmRhdGUsXG4gICAgICAgIGFjY291bnQ6IHBheW1lbnRBY2NvdW50LmlkLFxuICAgICAgICBhY2NvdW50Tm9ybWFsOiAnZGViaXQnLFxuICAgICAgICBkcmFmdDogIWZvcm0ucHVibGlzaGVkLFxuICAgICAgfSk7XG4gICAgICBqb3VybmFsRW50cmllcy5jcmVkaXQoY3JlZGl0RW50cnkpO1xuICAgICAgam91cm5hbEVudHJpZXMuZGViaXQoZGViaXRFbnRyeSk7XG5cbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgY3VzdG9tRmllbGRzLnNhdmVDdXN0b21GaWVsZHMoZXhwZW5zZVRyYW5zYWN0aW9uLmlkKSxcbiAgICAgICAgam91cm5hbEVudHJpZXMuc2F2ZUVudHJpZXMoKSxcbiAgICAgICAgam91cm5hbEVudHJpZXMuc2F2ZUJhbGFuY2UoKSxcbiAgICAgIF0pO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgaWQ6IGV4cGVuc2VUcmFuc2FjdGlvbi5pZCB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBCdWxrIGFkZCBleHBuZXNlcyB0byB0aGUgZ2l2ZW4gYWNjb3VudHMuXG4gICAqL1xuICBidWxrQWRkRXhwZW5zZXM6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBjaGVjaygnZXhwZW5zZXMnKS5leGlzdHMoKS5pc0FycmF5KHsgbWluOiAxIH0pLFxuICAgICAgY2hlY2soJ2V4cGVuc2VzLiouZGF0ZScpLm9wdGlvbmFsKCkuaXNJU084NjAxKCksXG4gICAgICBjaGVjaygnZXhwZW5zZXMuKi5wYXltZW50X2FjY291bnRfaWQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2V4cGVuc2VzLiouZXhwZW5zZV9hY2NvdW50X2lkJykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdleHBlbnNlcy4qLmRlc2NyaXB0aW9uJykub3B0aW9uYWwoKSxcbiAgICAgIGNoZWNrKCdleHBlbnNlcy4qLmFtb3VudCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvRmxvYXQoKSxcbiAgICAgIGNoZWNrKCdleHBlbnNlcy4qLmN1cnJlbmN5X2NvZGUnKS5vcHRpb25hbCgpLFxuICAgICAgY2hlY2soJ2V4cGVuc2VzLiouZXhjaGFuZ2VfcmF0ZScpLm9wdGlvbmFsKCkuaXNOdW1lcmljKCkudG9GbG9hdCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGZvcm0gPSB7IC4uLnJlcS5ib2R5IH07XG4gICAgICBjb25zdCBlcnJvclJlYXNvbnMgPSBbXTtcblxuICAgICAgY29uc3QgcGF5bWVudEFjY291bnRzSWRzID0gY2hhaW4oZm9ybS5leHBlbnNlcylcbiAgICAgICAgLm1hcCgoZSkgPT4gZS5wYXltZW50X2FjY291bnRfaWQpLnVuaXEoKS52YWx1ZSgpO1xuICAgICAgY29uc3QgZXhwZW5zZUFjY291bnRzSWRzID0gY2hhaW4oZm9ybS5leHBlbnNlcylcbiAgICAgICAgLm1hcCgoZSkgPT4gZS5leHBlbnNlX2FjY291bnRfaWQpLnVuaXEoKS52YWx1ZSgpO1xuXG4gICAgICBjb25zdCBbZXhwZW5zZXNBY2NvdW50cywgcGF5bWVudEFjY291bnRzXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgQWNjb3VudC5xdWVyeSgpLndoZXJlSW4oJ2lkJywgZXhwZW5zZUFjY291bnRzSWRzKSxcbiAgICAgICAgQWNjb3VudC5xdWVyeSgpLndoZXJlSW4oJ2lkJywgcGF5bWVudEFjY291bnRzSWRzKSxcbiAgICAgIF0pO1xuICAgICAgY29uc3Qgc3RvcmVkRXhwZW5zZXNBY2NvdW50c0lkcyA9IGV4cGVuc2VzQWNjb3VudHMubWFwKChhKSA9PiBhLmlkKTtcbiAgICAgIGNvbnN0IHN0b3JlZFBheW1lbnRBY2NvdW50c0lkcyA9IHBheW1lbnRBY2NvdW50cy5tYXAoKGEpID0+IGEuaWQpO1xuXG4gICAgICBjb25zdCBub3RGb3VuZFBheW1lbnRBY2NvdW50c0lkcyA9IGRpZmZlcmVuY2UoZXhwZW5zZUFjY291bnRzSWRzLCBzdG9yZWRFeHBlbnNlc0FjY291bnRzSWRzKTtcbiAgICAgIGNvbnN0IG5vdEZvdW5kRXhwZW5zZUFjY291bnRzSWRzID0gZGlmZmVyZW5jZShwYXltZW50QWNjb3VudHNJZHMsIHN0b3JlZFBheW1lbnRBY2NvdW50c0lkcyk7XG5cbiAgICAgIGlmIChub3RGb3VuZFBheW1lbnRBY2NvdW50c0lkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnUEFZTUVOWS5BQ0NPVU5UUy5OT1QuRk9VTkQnLFxuICAgICAgICAgIGNvZGU6IDEwMCxcbiAgICAgICAgICBhY2NvdW50czogbm90Rm91bmRQYXltZW50QWNjb3VudHNJZHMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKG5vdEZvdW5kRXhwZW5zZUFjY291bnRzSWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdFWFBFTlNFLkFDQ09VTlRTLk5PVC5GT1VORCcsXG4gICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgIGFjY291bnRzOiBub3RGb3VuZEV4cGVuc2VBY2NvdW50c0lkcyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZXJyb3JSZWFzb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwgeyByZWFzb25zOiBlcnJvclJlYXNvbnMgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBleHBlbnNlU2F2ZU9wZXJzID0gW107XG4gICAgICBjb25zdCBqb3VybmFsUG9zdGVyID0gbmV3IEpvdXJuYWxQb3N0ZXIoKTtcblxuICAgICAgZm9ybS5leHBlbnNlcy5mb3JFYWNoKGFzeW5jIChleHBlbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IGV4cGVuc2VTYXZlT3BlciA9IEV4cGVuc2UucXVlcnkoKS5pbnNlcnQoeyAuLi5leHBlbnNlIH0pO1xuICAgICAgICBleHBlbnNlU2F2ZU9wZXJzLnB1c2goZXhwZW5zZVNhdmVPcGVyKTtcbiAgICAgIH0pO1xuICAgICAgLy8gV2FpdCB1bml0IHNhdmUgYWxsIGV4cGVuc2UgdHJhbnNhY3Rpb25zLlxuICAgICAgY29uc3Qgc2F2ZWRFeHBlbnNlVHJhbnNhY3Rpb25zID0gYXdhaXQgUHJvbWlzZS5hbGwoZXhwZW5zZVNhdmVPcGVycyk7XG5cbiAgICAgIHNhdmVkRXhwZW5zZVRyYW5zYWN0aW9ucy5mb3JFYWNoKChleHBlbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGUgPSBtb21lbnQoZXhwZW5zZS5kYXRlKS5mb3JtYXQoJ1lZWVktREQtTU0nKTtcblxuICAgICAgICBjb25zdCBkZWJpdCA9IG5ldyBKb3VybmFsRW50cnkoe1xuICAgICAgICAgIGRlYml0OiBleHBlbnNlLmFtb3VudCxcbiAgICAgICAgICByZWZlcmVuY2VJZDogZXhwZW5zZS5pZCxcbiAgICAgICAgICByZWZlcmVuY2VUeXBlOiBFeHBlbnNlLnJlZmVyZW5jZVR5cGUsXG4gICAgICAgICAgYWNjb3VudDogZXhwZW5zZS5wYXltZW50X2FjY291bnRfaWQsXG4gICAgICAgICAgYWNjb3VudE5vcm1hbDogJ2RlYml0JyxcbiAgICAgICAgICBkYXRlLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgY3JlZGl0ID0gbmV3IEpvdXJuYWxFbnRyeSh7XG4gICAgICAgICAgY3JlZGl0OiBleHBlbnNlLmFtb3VudCxcbiAgICAgICAgICByZWZlcmVuY2VJZDogZXhwZW5zZS5pZCxcbiAgICAgICAgICByZWZlcmVuY2VUeXBlOiBFeHBlbnNlLnJlZmVyZW5jZUlkLFxuICAgICAgICAgIGFjY291bnQ6IGV4cGVuc2UuZXhwZW5zZV9hY2NvdW50X2lkLFxuICAgICAgICAgIGFjY291bnROb3JtYWw6ICdkZWJpdCcsXG4gICAgICAgICAgZGF0ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGpvdXJuYWxQb3N0ZXIuY3JlZGl0KGNyZWRpdCk7XG4gICAgICAgIGpvdXJuYWxQb3N0ZXIuZGViaXQoZGViaXQpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFNhdmUgZXhwZW5zZSBqb3VybmFsIGVudHJpZXMgYW5kIGJhbGFuY2UgY2hhbmdlLlxuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBqb3VybmFsUG9zdGVyLnNhdmVFbnRyaWVzKCksXG4gICAgICAgIGpvdXJuYWxQb3N0ZXIuc2F2ZUJhbGFuY2UoKSxcbiAgICAgIF0pO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKCk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogUHVibGlzaCB0aGUgZ2l2ZW4gZXhwZW5zZSBpZC5cbiAgICovXG4gIHB1Ymxpc2hFeHBlbnNlOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ2lkJykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCBlcnJvclJlYXNvbnMgPSBbXTtcbiAgICAgIGNvbnN0IGV4cGVuc2UgPSBhd2FpdCBFeHBlbnNlLnF1ZXJ5KCkuZmluZEJ5SWQoaWQpO1xuXG4gICAgICBpZiAoIWV4cGVuc2UpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnRVhQRU5TRS5OT1QuRk9VTkQnLCBjb2RlOiAxMDAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZXJyb3JSZWFzb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHsgZXJyb3JzOiBlcnJvclJlYXNvbnMgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChleHBlbnNlLnB1Ymxpc2hlZCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdFWFBFTlNFLkFMUkVBRFkuUFVCTElTSEVEJywgY29kZTogMjAwIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGVycm9yUmVhc29ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7IGVycm9yczogZXJyb3JSZWFzb25zIH0pO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCBBY2NvdW50VHJhbnNhY3Rpb24ucXVlcnkoKVxuICAgICAgICAud2hlcmUoJ3JlZmVyZW5jZV9pZCcsIGV4cGVuc2UuaWQpXG4gICAgICAgIC53aGVyZSgncmVmZXJlbmNlX3R5cGUnLCAnRXhwZW5zZScpXG4gICAgICAgIC5wYXRjaCh7XG4gICAgICAgICAgZHJhZnQ6IGZhbHNlLFxuICAgICAgICB9KTtcblxuICAgICAgYXdhaXQgRXhwZW5zZS5xdWVyeSgpXG4gICAgICAgIC53aGVyZSgnaWQnLCBleHBlbnNlLmlkKVxuICAgICAgICAudXBkYXRlKHsgcHVibGlzaGVkOiB0cnVlIH0pO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBwYWdpbmF0ZWQgZXhwZW5zZXMgbGlzdC5cbiAgICovXG4gIGxpc3RFeHBlbnNlczoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHF1ZXJ5KCdleHBlbnNlX2FjY291bnRfaWQnKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBxdWVyeSgncGF5bWVudF9hY2NvdW50X2lkJykub3B0aW9uYWwoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgcXVlcnkoJ25vdGUnKS5vcHRpb25hbCgpLFxuICAgICAgcXVlcnkoJ3JhbmdlX2Zyb20nKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvRmxvYXQoKSxcbiAgICAgIHF1ZXJ5KCdyYW5nZV90bycpLm9wdGlvbmFsKCkuaXNOdW1lcmljKCkudG9GbG9hdCgpLFxuICAgICAgcXVlcnkoJ2RhdGVfZnJvbScpLm9wdGlvbmFsKCkuaXNJU084NjAxKCksXG4gICAgICBxdWVyeSgnZGF0ZV90bycpLm9wdGlvbmFsKCkuaXNJU084NjAxKCksXG4gICAgICBxdWVyeSgnY29sdW1uX3NvcnRfb3JkZXInKS5vcHRpb25hbCgpLmlzSW4oWydjcmVhdGVkX2F0JywgJ2RhdGUnLCAnYW1vdW50J10pLFxuICAgICAgcXVlcnkoJ3NvcnRfb3JkZXInKS5vcHRpb25hbCgpLmlzSW4oWydkZXNjJywgJ2FzYyddKSxcbiAgICAgIHF1ZXJ5KCdwYWdlJykub3B0aW9uYWwoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgcXVlcnkoJ3BhZ2Vfc2l6ZScpLm9wdGlvbmFsKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIHF1ZXJ5KCdjdXN0b21fdmlld19pZCcpLm9wdGlvbmFsKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmaWx0ZXIgPSB7XG4gICAgICAgIHBhZ2Vfc2l6ZTogMTAsXG4gICAgICAgIHBhZ2U6IDEsXG4gICAgICAgIC4uLnJlcS5xdWVyeSxcbiAgICAgIH07XG4gICAgICBjb25zdCBlcnJvclJlYXNvbnMgPSBbXTtcbiAgICAgIGNvbnN0IGV4cGVuc2VSZXNvdXJjZSA9IGF3YWl0IFJlc291cmNlLnF1ZXJ5KCkud2hlcmUoJ25hbWUnLCAnZXhwZW5zZXMnKS5maXJzdCgpO1xuXG4gICAgICBpZiAoIWV4cGVuc2VSZXNvdXJjZSkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdFWFBFTlNFX05PVF9GT1VORCcsIGNvZGU6IDMwMCB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHZpZXcgPSBhd2FpdCBWaWV3LnF1ZXJ5KCkucnVuQmVmb3JlKChyZXN1bHQsIHEpID0+IHtcbiAgICAgICAgaWYgKGZpbHRlci5jdXN0b21lcl92aWV3X2lkKSB7XG4gICAgICAgICAgcS53aGVyZSgnaWQnLCBmaWx0ZXIuY3VzdG9tZXJfdmlld19pZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcS53aGVyZSgnZmF2b3JpdGUnLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBxLndoZXJlKCdyZXNvdXJjZV9pZCcsIGV4cGVuc2VSZXNvdXJjZS5pZCk7XG4gICAgICAgIHEud2l0aEdyYXBoRmV0Y2hlZCgndmlld1JvbGVzJyk7XG4gICAgICAgIHEud2l0aEdyYXBoRmV0Y2hlZCgnY29sdW1ucycpO1xuICAgICAgICBxLmZpcnN0KCk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KTtcblxuICAgICAgaWYgKCF2aWV3KSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHsgdHlwZTogJ1ZJRVdfTk9UX0ZPVU5EJywgY29kZTogMTAwIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGVycm9yUmVhc29ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWRSZXF1ZXN0KG51bGwsIHsgZXJyb3JzOiBlcnJvclJlYXNvbnMgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBleHBlbnNlcyA9IGF3YWl0IEV4cGVuc2UucXVlcnkoKVxuICAgICAgICAubW9kaWZ5KCdmaWx0ZXJCeUFtb3VudFJhbmdlJywgZmlsdGVyLnJhbmdlX2Zyb20sIGZpbHRlci50b19yYW5nZSlcbiAgICAgICAgLm1vZGlmeSgnZmlsdGVyQnlEYXRlUmFuZ2UnLCBmaWx0ZXIuZGF0ZV9mcm9tLCBmaWx0ZXIuZGF0ZV90bylcbiAgICAgICAgLm1vZGlmeSgnZmlsdGVyQnlFeHBlbnNlQWNjb3VudCcsIGZpbHRlci5leHBlbnNlX2FjY291bnRfaWQpXG4gICAgICAgIC5tb2RpZnkoJ2ZpbHRlckJ5UGF5bWVudEFjY291bnQnLCBmaWx0ZXIucGF5bWVudF9hY2NvdW50X2lkKVxuICAgICAgICAubW9kaWZ5KCdvcmRlckJ5JywgZmlsdGVyLmNvbHVtbl9zb3J0X29yZGVyLCBmaWx0ZXIuc29ydF9vcmRlcilcbiAgICAgICAgLnBhZ2UoZmlsdGVyLnBhZ2UsIGZpbHRlci5wYWdlX3NpemUpO1xuICAgICAgXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoe1xuICAgICAgICBjb2x1bW5zOiB2aWV3LmNvbHVtbnMsXG4gICAgICAgIHZpZXdSb2xlczogdmlldy52aWV3Um9sZXMsXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBEZWxldGUgdGhlIGdpdmVuIGFjY291bnQuXG4gICAqL1xuICBkZWxldGVFeHBlbnNlOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ2lkJykuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgZXhwZW5zZVRyYW5zYWN0aW9uID0gYXdhaXQgRXhwZW5zZS5xdWVyeSgpLmZpbmRCeUlkKGlkKTtcblxuICAgICAgaWYgKCFleHBlbnNlVHJhbnNhY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5zZW5kKHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdFWFBFTlNFLlRSQU5TQUNUSU9OLk5PVC5GT1VORCcsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBleHBlbnNlRW50cmllcyA9IGF3YWl0IEFjY291bnRUcmFuc2FjdGlvbi5xdWVyeSgpXG4gICAgICAgIC53aGVyZSgncmVmZXJlbmNlX3R5cGUnLCAnRXhwZW5zZScpXG4gICAgICAgIC53aGVyZSgncmVmZXJlbmNlX2lkJywgZXhwZW5zZVRyYW5zYWN0aW9uLmlkKTtcblxuICAgICAgY29uc3QgZXhwZW5zZUVudHJpZXNDb2xsZWN0ID0gbmV3IEpvdXJuYWxQb3N0ZXIoKTtcbiAgICAgIGV4cGVuc2VFbnRyaWVzQ29sbGVjdC5sb2FkRW50cmllcyhleHBlbnNlRW50cmllcyk7XG4gICAgICBleHBlbnNlRW50cmllc0NvbGxlY3QucmV2ZXJzZUVudHJpZXMoKTtcblxuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBFeHBlbnNlLnF1ZXJ5KCkuZmluZEJ5SWQoZXhwZW5zZVRyYW5zYWN0aW9uLmlkKS5kZWxldGUoKSxcbiAgICAgICAgZXhwZW5zZUVudHJpZXNDb2xsZWN0LmRlbGV0ZUVudHJpZXMoKSxcbiAgICAgICAgZXhwZW5zZUVudHJpZXNDb2xsZWN0LnNhdmVCYWxhbmNlKCksXG4gICAgICBdKTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCgpO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBkZXRhaWxzIG9mIHRoZSBnaXZlbiBhY2NvdW50LlxuICAgKi9cbiAgdXBkYXRlRXhwZW5zZToge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdpZCcpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnZGF0ZScpLm9wdGlvbmFsKCkuaXNJU084NjAxKCksXG4gICAgICBjaGVjaygncGF5bWVudF9hY2NvdW50X2lkJykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdleHBlbnNlX2FjY291bnRfaWQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2Rlc2NyaXB0aW9uJykub3B0aW9uYWwoKSxcbiAgICAgIGNoZWNrKCdhbW91bnQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0Zsb2F0KCksXG4gICAgICBjaGVjaygnY3VycmVuY3lfY29kZScpLm9wdGlvbmFsKCksXG4gICAgICBjaGVjaygnZXhjaGFuZ2VfcmF0ZScpLm9wdGlvbmFsKCkuaXNOdW1lcmljKCkudG9GbG9hdCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCBleHBlbnNlVHJhbnNhY3Rpb24gPSBhd2FpdCBFeHBlbnNlLnF1ZXJ5KCkuZmluZEJ5SWQoaWQpO1xuXG4gICAgICBpZiAoIWV4cGVuc2VUcmFuc2FjdGlvbikge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLnNlbmQoe1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ0VYUEVOU0UuVFJBTlNBQ1RJT04uTk9ULkZPVU5EJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBkZXRhaWxzIG9mIHRoZSBnaXZlbiBleHBlbnNlIGlkLlxuICAgKi9cbiAgZ2V0RXhwZW5zZToge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdpZCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgeyBpZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IGV4cGVuc2VUcmFuc2FjdGlvbiA9IGF3YWl0IEV4cGVuc2UucXVlcnkoKS5maW5kQnlJZChpZCk7XG5cbiAgICAgIGlmICghZXhwZW5zZVRyYW5zYWN0aW9uKSB7XG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwNCkuc2VuZCh7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnRVhQRU5TRS5UUkFOU0FDVElPTi5OT1QuRk9VTkQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBleHBlbnNlQ0ZNZXRhZGF0YVJlcG8gPSBuZXcgUmVzb3VyY2VDdXN0b21GaWVsZFJlcG9zaXRvcnkoRXhwZW5zZSk7XG4gICAgICBhd2FpdCBleHBlbnNlQ0ZNZXRhZGF0YVJlcG8ubG9hZCgpO1xuICAgICAgYXdhaXQgZXhwZW5zZUNGTWV0YWRhdGFSZXBvLmZldGNoQ3VzdG9tRmllbGRzTWV0YWRhdGEoZXhwZW5zZVRyYW5zYWN0aW9uLmlkKTtcblxuICAgICAgY29uc3QgZXhwZW5zZUN1c0ZpZWxkc01ldGFkYXRhID0gZXhwZW5zZUNGTWV0YWRhdGFSZXBvLmdldE1ldGFkYXRhKGV4cGVuc2VUcmFuc2FjdGlvbi5pZCk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgIC4uLmV4cGVuc2VUcmFuc2FjdGlvbixcbiAgICAgICAgY3VzdG9tX2ZpZWxkczogW1xuICAgICAgICAgIC4uLmV4cGVuc2VDdXNGaWVsZHNNZXRhZGF0YS50b0FycmF5KCksXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxufTtcbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgY2hlY2ssIHBhcmFtLCB2YWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InO1xuaW1wb3J0IFJlc291cmNlRmllbGQgZnJvbSAnQC9tb2RlbHMvUmVzb3VyY2VGaWVsZCc7XG5pbXBvcnQgUmVzb3VyY2UgZnJvbSAnQC9tb2RlbHMvUmVzb3VyY2UnO1xuaW1wb3J0IGFzeW5jTWlkZGxld2FyZSBmcm9tICcuLi9taWRkbGV3YXJlL2FzeW5jTWlkZGxld2FyZSc7XG5cbi8qKlxuICogVHlwZXMgb2YgdGhlIGN1c3RvbSBmaWVsZHMuXG4gKi9cbmNvbnN0IFRZUEVTID0gWyd0ZXh0JywgJ2VtYWlsJywgJ251bWJlcicsICd1cmwnLCAncGVyY2VudGFnZScsICdjaGVja2JveCcsICdyYWRpbycsICd0ZXh0YXJlYSddO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBSb3V0ZXIgY29uc3RydWN0b3IgbWV0aG9kLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbiAgICByb3V0ZXIucG9zdCgnL3Jlc291cmNlLzpyZXNvdXJjZV9uYW1lJyxcbiAgICAgIHRoaXMuYWRkTmV3RmllbGQudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmFkZE5ld0ZpZWxkLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCcvOmZpZWxkX2lkJyxcbiAgICAgIHRoaXMuZWRpdEZpZWxkLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5lZGl0RmllbGQuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLnBvc3QoJy9zdGF0dXMvOmZpZWxkX2lkJyxcbiAgICAgIHRoaXMuY2hhbmdlU3RhdHVzLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5jaGFuZ2VTdGF0dXMuaGFuZGxlcikpO1xuXG4gICAgLy8gcm91dGVyLmdldCgnLzpmaWVsZF9pZCcsXG4gICAgLy8gICBhc3luY01pZGRsZXdhcmUodGhpcy5nZXRGaWVsZC5oYW5kbGVyKSk7XG5cbiAgICAvLyByb3V0ZXIuZGVsZXRlKCcvOmZpZWxkX2lkJyxcbiAgICAvLyAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmRlbGV0ZUZpZWxkLmhhbmRsZXIpKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFkZHMgYSBuZXcgZmllbGQgY29udHJvbCB0byB0aGUgZ2l2ZW4gcmVzb3VyY2UuXG4gICAqIEBwYXJhbSB7UmVxdWVzdH0gcmVxIC1cbiAgICogQHBhcmFtIHtSZXNwb25zZX0gcmVzIC1cbiAgICovXG4gIGFkZE5ld0ZpZWxkOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ3Jlc291cmNlX25hbWUnKS5leGlzdHMoKS50cmltKCkuZXNjYXBlKCksXG4gICAgICBjaGVjaygnbGFiZWwnKS5leGlzdHMoKS5lc2NhcGUoKS50cmltKCksXG4gICAgICBjaGVjaygnZGF0YV90eXBlJykuZXhpc3RzKCkuaXNJbihUWVBFUyksXG4gICAgICBjaGVjaygnaGVscF90ZXh0Jykub3B0aW9uYWwoKSxcbiAgICAgIGNoZWNrKCdkZWZhdWx0Jykub3B0aW9uYWwoKSxcbiAgICAgIGNoZWNrKCdvcHRpb25zJykub3B0aW9uYWwoKS5pc0FycmF5KCksXG4gICAgICBjaGVjaygnb3B0aW9ucy4qLmtleScpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnb3B0aW9ucy4qLnZhbHVlJykuZXhpc3RzKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IHJlc291cmNlX25hbWU6IHJlc291cmNlTmFtZSB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCByZXNvdXJjZSA9IGF3YWl0IFJlc291cmNlLnF1ZXJ5KCkud2hlcmUoJ25hbWUnLCByZXNvdXJjZU5hbWUpLmZpcnN0KCk7XG5cbiAgICAgIGlmICghcmVzb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKG51bGwsIHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdSRVNPVVJDRV9OT1RfRk9VTkQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZm9ybSA9IHsgb3B0aW9uczogW10sIC4uLnJlcS5ib2R5IH07XG4gICAgICBjb25zdCBjaG9pY2VzID0gZm9ybS5vcHRpb25zLm1hcCgob3B0aW9uKSA9PiAoeyBrZXk6IG9wdGlvbi5rZXksIHZhbHVlOiBvcHRpb24udmFsdWUgfSkpO1xuXG4gICAgICBjb25zdCBzdG9yZWRSZXNvdXJjZSA9IGF3YWl0IFJlc291cmNlRmllbGQucXVlcnkoKS5pbnNlcnRBbmRGZXRjaCh7XG4gICAgICAgIGRhdGFfdHlwZTogZm9ybS5kYXRhX3R5cGUsXG4gICAgICAgIGxhYmVsX25hbWU6IGZvcm0ubGFiZWwsXG4gICAgICAgIGhlbHBfdGV4dDogZm9ybS5oZWxwX3RleHQsXG4gICAgICAgIGRlZmF1bHQ6IGZvcm0uZGVmYXVsdCxcbiAgICAgICAgcmVzb3VyY2VfaWQ6IHJlc291cmNlLmlkLFxuICAgICAgICBvcHRpb25zOiBjaG9pY2VzLFxuICAgICAgICBpbmRleDogLTEsXG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGlkOiBzdG9yZWRSZXNvdXJjZS5pZCB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBFZGl0IGRldGFpbHMgb2YgdGhlIGdpdmVuIGZpZWxkLlxuICAgKi9cbiAgZWRpdEZpZWxkOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ2ZpZWxkX2lkJykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdsYWJlbCcpLmV4aXN0cygpLmVzY2FwZSgpLnRyaW0oKSxcbiAgICAgIGNoZWNrKCdkYXRhX3R5cGUnKS5leGlzdHMoKS5pc0luKFRZUEVTKSxcbiAgICAgIGNoZWNrKCdoZWxwX3RleHQnKS5vcHRpb25hbCgpLFxuICAgICAgY2hlY2soJ2RlZmF1bHQnKS5vcHRpb25hbCgpLFxuICAgICAgY2hlY2soJ29wdGlvbnMnKS5vcHRpb25hbCgpLmlzQXJyYXkoKSxcbiAgICAgIGNoZWNrKCdvcHRpb25zLioua2V5JykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdvcHRpb25zLioudmFsdWUnKS5leGlzdHMoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgZmllbGRfaWQ6IGZpZWxkSWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZmllbGQgPSBhd2FpdCBSZXNvdXJjZUZpZWxkLnF1ZXJ5KCkuZmluZEJ5SWQoZmllbGRJZCk7XG5cbiAgICAgIGlmICghZmllbGQpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKG51bGwsIHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdGSUVMRF9OT1RfRk9VTkQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLy8gU2V0cyB0aGUgZGVmYXVsdCB2YWx1ZSBvZiBvcHRpb25hbCBmaWVsZHMuXG4gICAgICBjb25zdCBmb3JtID0geyBvcHRpb25zOiBbXSwgLi4ucmVxLmJvZHkgfTtcbiAgICAgIGNvbnN0IGNob2ljZXMgPSBmb3JtLm9wdGlvbnMubWFwKChvcHRpb24pID0+ICh7IGtleTogb3B0aW9uLmtleSwgdmFsdWU6IG9wdGlvbi52YWx1ZSB9KSk7XG5cbiAgICAgIGF3YWl0IFJlc291cmNlRmllbGQucXVlcnkoKS5maW5kQnlJZChmaWVsZC5pZCkudXBkYXRlKHtcbiAgICAgICAgZGF0YV90eXBlOiBmb3JtLmRhdGFfdHlwZSxcbiAgICAgICAgbGFiZWxfbmFtZTogZm9ybS5sYWJlbCxcbiAgICAgICAgaGVscF90ZXh0OiBmb3JtLmhlbHBfdGV4dCxcbiAgICAgICAgZGVmYXVsdDogZm9ybS5kZWZhdWx0LFxuICAgICAgICBvcHRpb25zOiBjaG9pY2VzLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyBpZDogZmllbGQuaWQgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGZpZWxkcyBsaXN0IG9mIHRoZSBnaXZlbiByZXNvdXJjZS5cbiAgICogQHBhcmFtIHtSZXF1ZXN0fSByZXEgLVxuICAgKiBAcGFyYW0ge1Jlc3BvbnNlfSByZXMgLVxuICAgKi9cbiAgZmllbGRzTGlzdDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdyZXNvdXJjZV9uYW1lJykudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCB7IHJlc291cmNlX25hbWU6IHJlc291cmNlTmFtZSB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IHJlc291cmNlID0gYXdhaXQgUmVzb3VyY2UucXVlcnkoKS53aGVyZSgnbmFtZScsIHJlc291cmNlTmFtZSkuZmlyc3QoKTtcblxuICAgICAgaWYgKCFyZXNvdXJjZSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ1JFU09VUkNFX05PVF9GT1VORCcsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmaWVsZHMgPSBhd2FpdCBSZXNvdXJjZUZpZWxkLndoZXJlKCdyZXNvdXJjZV9pZCcsIHJlc291cmNlLmlkKS5mZXRjaEFsbCgpO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyBmaWVsZHM6IGZpZWxkcy50b0pTT04oKSB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBDaGFuZ2Ugc3RhdHVzIG9mIHRoZSBnaXZlbiBmaWVsZC5cbiAgICovXG4gIGNoYW5nZVN0YXR1czoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdmaWVsZF9pZCcpLnRvSW50KCksXG4gICAgICBjaGVjaygnYWN0aXZlJykuaXNCb29sZWFuKCkudG9Cb29sZWFuKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGZpZWxkX2lkOiBmaWVsZElkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgZmllbGQgPSBhd2FpdCBSZXNvdXJjZUZpZWxkLnF1ZXJ5KCkuZmluZEJ5SWQoZmllbGRJZCk7XG5cbiAgICAgIGlmICghZmllbGQpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKG51bGwsIHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdOT1RfRk9VTkRfRklFTEQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7IGFjdGl2ZSB9ID0gcmVxLmJvZHk7XG4gICAgICBhd2FpdCBSZXNvdXJjZUZpZWxkLnF1ZXJ5KCkuZmluZEJ5SWQoZmllbGQuaWQpLnBhdGNoKHsgYWN0aXZlIH0pO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyBpZDogZmllbGQuaWQgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgZGV0YWlscyBvZiB0aGUgZ2l2ZW4gZmllbGQuXG4gICAqL1xuICBnZXRGaWVsZDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdmaWVsZF9pZCcpLnRvSW50KCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGZpZWxkX2lkOiBpZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IGZpZWxkID0gYXdhaXQgUmVzb3VyY2VGaWVsZC53aGVyZSgnaWQnLCBpZCkuZmV0Y2goKTtcblxuICAgICAgaWYgKCFmaWVsZCkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgZmllbGQ6IGZpZWxkLnRvSlNPTigpLFxuICAgICAgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogRGVsZXRlIHRoZSBnaXZlbiBmaWVsZC5cbiAgICovXG4gIGRlbGV0ZUZpZWxkOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ2ZpZWxkX2lkJykudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgZmllbGRfaWQ6IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgZmllbGQgPSBhd2FpdCBSZXNvdXJjZUZpZWxkLndoZXJlKCdpZCcsIGlkKS5mZXRjaCgpO1xuXG4gICAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZCgpO1xuICAgICAgfVxuICAgICAgaWYgKGZpZWxkLmF0dHJpYnV0ZXMucHJlZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkUmVxdWVzdChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnUFJFREVGSU5FRF9GSUVMRCcsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IGZpZWxkLmRlc3Ryb3koKTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgaWQ6IGZpZWxkLmdldCgnaWQnKSB9KTtcbiAgICB9LFxuICB9LFxufTtcbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgcXVlcnksIHZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICdleHByZXNzLXZhbGlkYXRvcic7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgeyBwaWNrIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBhc3luY01pZGRsZXdhcmUgZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvYXN5bmNNaWRkbGV3YXJlJztcbmltcG9ydCBBY2NvdW50VHJhbnNhY3Rpb24gZnJvbSAnQC9tb2RlbHMvQWNjb3VudFRyYW5zYWN0aW9uJztcbmltcG9ydCBqd3RBdXRoIGZyb20gJ0AvaHR0cC9taWRkbGV3YXJlL2p3dEF1dGgnO1xuaW1wb3J0IEFjY291bnRUeXBlIGZyb20gJ0AvbW9kZWxzL0FjY291bnRUeXBlJztcbmltcG9ydCBBY2NvdW50IGZyb20gJ0AvbW9kZWxzL0FjY291bnQnO1xuaW1wb3J0IEpvdXJuYWxQb3N0ZXIgZnJvbSAnQC9zZXJ2aWNlcy9BY2NvdW50aW5nL0pvdXJuYWxQb3N0ZXInO1xuaW1wb3J0IHsgZGF0ZVJhbmdlQ29sbGVjdGlvbiB9IGZyb20gJ0AvdXRpbHMnO1xuXG5jb25zdCBmb3JtYXROdW1iZXJDbG9zdXJlID0gKGZpbHRlcikgPT4gKGJhbGFuY2UpID0+IHtcbiAgbGV0IGZvcm1hdHRlZEJhbGFuY2UgPSBwYXJzZUZsb2F0KGJhbGFuY2UpO1xuXG4gIGlmIChmaWx0ZXIubm9fY2VudHMpIHtcbiAgICBmb3JtYXR0ZWRCYWxhbmNlID0gcGFyc2VJbnQoZm9ybWF0dGVkQmFsYW5jZSwgMTApO1xuICB9XG4gIGlmIChmaWx0ZXIuZGl2aWRlXzEwMDApIHtcbiAgICBmb3JtYXR0ZWRCYWxhbmNlIC89IDEwMDA7XG4gIH1cbiAgcmV0dXJuIGZvcm1hdHRlZEJhbGFuY2U7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBSb3V0ZXIgY29uc3RydWN0b3IuXG4gICAqL1xuICByb3V0ZXIoKSB7XG4gICAgY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcbiAgICByb3V0ZXIudXNlKGp3dEF1dGgpO1xuXG4gICAgcm91dGVyLmdldCgnL2xlZGdlcicsXG4gICAgICB0aGlzLmxlZGdlci52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMubGVkZ2VyLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5nZXQoJy9nZW5lcmFsX2xlZGdlcicsXG4gICAgICB0aGlzLmdlbmVyYWxMZWRnZXIudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmdlbmVyYWxMZWRnZXIuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmdldCgnL2JhbGFuY2Vfc2hlZXQnLFxuICAgICAgdGhpcy5iYWxhbmNlU2hlZXQudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmJhbGFuY2VTaGVldC5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvdHJpYWxfYmFsYW5jZV9zaGVldCcsXG4gICAgICB0aGlzLnRyaWFsQmFsYW5jZVNoZWV0LnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy50cmlhbEJhbGFuY2VTaGVldC5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvcHJvZml0X2xvc3Nfc2hlZXQnLFxuICAgICAgdGhpcy5wcm9maXRMb3NzU2hlZXQudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLnByb2ZpdExvc3NTaGVldC5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvY2FzaF9mbG93X3N0YXRlbWVudCcsXG4gICAgICB0aGlzLmNhc2hGbG93U3RhdGVtZW50LnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5jYXNoRmxvd1N0YXRlbWVudC5oYW5kbGVyKSk7XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgbGVkZ2VyIHJlcG9ydCBvZiB0aGUgZ2l2ZW4gYWNjb3VudC5cbiAgICovXG4gIGxlZGdlcjoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHF1ZXJ5KCdmcm9tX2RhdGUnKS5vcHRpb25hbCgpLmlzSVNPODYwMSgpLFxuICAgICAgcXVlcnkoJ3RvX2RhdGUnKS5vcHRpb25hbCgpLmlzSVNPODYwMSgpLFxuICAgICAgcXVlcnkoJ3RyYW5zYWN0aW9uX3R5cGVzJykub3B0aW9uYWwoKS5pc0FycmF5KHsgbWluOiAxIH0pLFxuICAgICAgcXVlcnkoJ2FjY291bnRfaWRzJykub3B0aW9uYWwoKS5pc0FycmF5KHsgbWluOiAxIH0pLFxuICAgICAgcXVlcnkoJ2FjY291bnRfaWRzLionKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBxdWVyeSgnZnJvbV9yYW5nZScpLm9wdGlvbmFsKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIHF1ZXJ5KCd0b19yYW5nZScpLm9wdGlvbmFsKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIHF1ZXJ5KCdudW1iZXJfZm9ybWF0Lm5vX2NlbnRzJykub3B0aW9uYWwoKS5pc0Jvb2xlYW4oKS50b0Jvb2xlYW4oKSxcbiAgICAgIHF1ZXJ5KCdudW1iZXJfZm9ybWF0LmRpdmlkZV8xMDAwJykub3B0aW9uYWwoKS5pc0Jvb2xlYW4oKS50b0Jvb2xlYW4oKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmaWx0ZXIgPSB7XG4gICAgICAgIGZyb21fcmFuZ2U6IG51bGwsXG4gICAgICAgIHRvX3JhbmdlOiBudWxsLFxuICAgICAgICBhY2NvdW50X2lkczogW10sXG4gICAgICAgIHRyYW5zYWN0aW9uX3R5cGVzOiBbXSxcbiAgICAgICAgbnVtYmVyX2Zvcm1hdDoge1xuICAgICAgICAgIG5vX2NlbnRzOiBmYWxzZSxcbiAgICAgICAgICBkaXZpZGVfMTAwMDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIC4uLnJlcS5xdWVyeSxcbiAgICAgIH07XG4gICAgICBjb25zdCBhY2NvdW50c0pvdXJuYWxFbnRyaWVzID0gYXdhaXQgQWNjb3VudFRyYW5zYWN0aW9uLnF1ZXJ5KClcbiAgICAgICAgLm1vZGlmeSgnZmlsdGVyRGF0ZVJhbmdlJywgZmlsdGVyLmZyb21fZGF0ZSwgZmlsdGVyLnRvX2RhdGUpXG4gICAgICAgIC5tb2RpZnkoJ2ZpbHRlckFjY291bnRzJywgZmlsdGVyLmFjY291bnRfaWRzKVxuICAgICAgICAubW9kaWZ5KCdmaWx0ZXJUcmFuc2FjdGlvblR5cGVzJywgZmlsdGVyLnRyYW5zYWN0aW9uX3R5cGVzKVxuICAgICAgICAubW9kaWZ5KCdmaWx0ZXJBbW91bnRSYW5nZScsIGZpbHRlci5mcm9tX3JhbmdlLCBmaWx0ZXIudG9fcmFuZ2UpXG4gICAgICAgIC53aXRoR3JhcGhGZXRjaGVkKCdhY2NvdW50Jyk7XG5cbiAgICAgIGNvbnN0IGZvcm1hdE51bWJlciA9IGZvcm1hdE51bWJlckNsb3N1cmUoZmlsdGVyLm51bWJlcl9mb3JtYXQpO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoe1xuICAgICAgICBtZXRhOiB7IC4uLmZpbHRlciB9LFxuICAgICAgICBpdGVtczogYWNjb3VudHNKb3VybmFsRW50cmllcy5tYXAoKGVudHJ5KSA9PiAoe1xuICAgICAgICAgIC4uLmVudHJ5LFxuICAgICAgICAgIGNyZWRpdDogZm9ybWF0TnVtYmVyKGVudHJ5LmNyZWRpdCksXG4gICAgICAgICAgZGViaXQ6IGZvcm1hdE51bWJlcihlbnRyeS5kZWJpdCksXG4gICAgICAgIH0pKSxcbiAgICAgIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIHRoZSBnZW5lcmFsIGxlZGdlciBmaW5hbmNpYWwgc3RhdGVtZW50LlxuICAgKi9cbiAgZ2VuZXJhbExlZGdlcjoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHF1ZXJ5KCdmcm9tX2RhdGUnKS5vcHRpb25hbCgpLmlzSVNPODYwMSgpLFxuICAgICAgcXVlcnkoJ3RvX2RhdGUnKS5vcHRpb25hbCgpLmlzSVNPODYwMSgpLFxuICAgICAgcXVlcnkoJ2Jhc2lzJykub3B0aW9uYWwoKSxcbiAgICAgIHF1ZXJ5KCdudW1iZXJfZm9ybWF0Lm5vX2NlbnRzJykub3B0aW9uYWwoKS5pc0Jvb2xlYW4oKS50b0Jvb2xlYW4oKSxcbiAgICAgIHF1ZXJ5KCdudW1iZXJfZm9ybWF0LmRpdmlkZV8xMDAwJykub3B0aW9uYWwoKS5pc0Jvb2xlYW4oKS50b0Jvb2xlYW4oKSxcbiAgICAgIHF1ZXJ5KCdub25lX3plcm8nKS5vcHRpb25hbCgpLmlzQm9vbGVhbigpLnRvQm9vbGVhbigpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGZpbHRlciA9IHtcbiAgICAgICAgZnJvbV9kYXRlOiBtb21lbnQoKS5zdGFydE9mKCd5ZWFyJykuZm9ybWF0KCdZWVlZLU1NLUREJyksXG4gICAgICAgIHRvX2RhdGU6IG1vbWVudCgpLmVuZE9mKCd5ZWFyJykuZm9ybWF0KCdZWVlZLU1NLUREJyksXG4gICAgICAgIG51bWJlcl9mb3JtYXQ6IHtcbiAgICAgICAgICBub19jZW50czogZmFsc2UsXG4gICAgICAgICAgZGl2aWRlXzEwMDA6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBub25lX3plcm86IGZhbHNlLFxuICAgICAgICAuLi5yZXEucXVlcnksXG4gICAgICB9O1xuICAgICAgY29uc3QgYWNjb3VudHMgPSBhd2FpdCBBY2NvdW50LnF1ZXJ5KClcbiAgICAgICAgLm9yZGVyQnkoJ2luZGV4JywgJ0RFU0MnKVxuICAgICAgICAud2l0aEdyYXBoRmV0Y2hlZCgndHJhbnNhY3Rpb25zJylcbiAgICAgICAgLm1vZGlmeUdyYXBoKCd0cmFuc2FjdGlvbnMnLCAoYnVpbGRlcikgPT4ge1xuICAgICAgICAgIGJ1aWxkZXIubW9kaWZ5KCdmaWx0ZXJEYXRlUmFuZ2UnLCBmaWx0ZXIuZnJvbV9kYXRlLCBmaWx0ZXIudG9fZGF0ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICBjb25zdCBvcGVuaW5nQmFsYW5jZVRyYW5zYWN0aW9ucyA9IGF3YWl0IEFjY291bnRUcmFuc2FjdGlvbi5xdWVyeSgpXG4gICAgICAgIC5tb2RpZnkoJ2ZpbHRlckRhdGVSYW5nZScsIG51bGwsIGZpbHRlci5mcm9tX2RhdGUpXG4gICAgICAgIC5tb2RpZnkoJ3N1bWF0aW9uQ3JlZGl0RGViaXQnKVxuICAgICAgICAud2l0aEdyYXBoRmV0Y2hlZCgnYWNjb3VudC50eXBlJyk7XG5cbiAgICAgIGNvbnN0IGNsb3NpbmdCYWxhbmNlVHJhbnNhY3Rpb25zID0gYXdhaXQgQWNjb3VudFRyYW5zYWN0aW9uLnF1ZXJ5KClcbiAgICAgICAgLm1vZGlmeSgnZmlsdGVyRGF0ZVJhbmdlJywgbnVsbCwgZmlsdGVyLnRvX2RhdGUpXG4gICAgICAgIC5tb2RpZnkoJ3N1bWF0aW9uQ3JlZGl0RGViaXQnKVxuICAgICAgICAud2l0aEdyYXBoRmV0Y2hlZCgnYWNjb3VudC50eXBlJyk7XG5cbiAgICAgIGNvbnN0IG9wZWluZ0JhbGFuY2VDb2xsZWN0aW9uID0gbmV3IEpvdXJuYWxQb3N0ZXIoKTtcbiAgICAgIGNvbnN0IGNsb3NpbmdCYWxhbmNlQ29sbGVjdGlvbiA9IG5ldyBKb3VybmFsUG9zdGVyKCk7XG5cbiAgICAgIG9wZWluZ0JhbGFuY2VDb2xsZWN0aW9uLmxvYWRFbnRyaWVzKG9wZW5pbmdCYWxhbmNlVHJhbnNhY3Rpb25zKTtcbiAgICAgIGNsb3NpbmdCYWxhbmNlQ29sbGVjdGlvbi5sb2FkRW50cmllcyhjbG9zaW5nQmFsYW5jZVRyYW5zYWN0aW9ucyk7XG5cbiAgICAgIC8vIFRyYW5zYWN0aW9uIGFtb3VudCBmb3JtYXR0ZXIgYmFzZWQgb24gdGhlIGdpdmVuIHF1ZXJ5LlxuICAgICAgY29uc3QgZm9ybWF0TnVtYmVyID0gZm9ybWF0TnVtYmVyQ2xvc3VyZShmaWx0ZXIubnVtYmVyX2Zvcm1hdCk7XG5cbiAgICAgIGNvbnN0IGl0ZW1zID0gW1xuICAgICAgICAuLi5hY2NvdW50c1xuICAgICAgICAgIC5maWx0ZXIoKGFjY291bnQpID0+IChcbiAgICAgICAgICAgIGFjY291bnQudHJhbnNhY3Rpb25zLmxlbmd0aCA+IDAgfHwgIWZpbHRlci5ub25lX3plcm9cbiAgICAgICAgICApKVxuICAgICAgICAgIC5tYXAoKGFjY291bnQpID0+ICh7XG4gICAgICAgICAgICAuLi5waWNrKGFjY291bnQsIFsnaWQnLCAnbmFtZScsICdjb2RlJywgJ2luZGV4J10pLFxuICAgICAgICAgICAgdHJhbnNhY3Rpb25zOiBbXG4gICAgICAgICAgICAgIC4uLmFjY291bnQudHJhbnNhY3Rpb25zLm1hcCgodHJhbnNhY3Rpb24pID0+ICh7XG4gICAgICAgICAgICAgICAgLi4udHJhbnNhY3Rpb24sXG4gICAgICAgICAgICAgICAgY3JlZGl0OiBmb3JtYXROdW1iZXIodHJhbnNhY3Rpb24uY3JlZGl0KSxcbiAgICAgICAgICAgICAgICBkZWJpdDogZm9ybWF0TnVtYmVyKHRyYW5zYWN0aW9uLmRlYml0KSxcbiAgICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIG9wZW5pbmc6IHtcbiAgICAgICAgICAgICAgZGF0ZTogZmlsdGVyLmZyb21fZGF0ZSxcbiAgICAgICAgICAgICAgYmFsYW5jZTogb3BlaW5nQmFsYW5jZUNvbGxlY3Rpb24uZ2V0Q2xvc2luZ0JhbGFuY2UoYWNjb3VudC5pZCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xvc2luZzoge1xuICAgICAgICAgICAgICBkYXRlOiBmaWx0ZXIudG9fZGF0ZSxcbiAgICAgICAgICAgICAgYmFsYW5jZTogY2xvc2luZ0JhbGFuY2VDb2xsZWN0aW9uLmdldENsb3NpbmdCYWxhbmNlKGFjY291bnQuaWQpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSksXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgbWV0YTogeyAuLi5maWx0ZXIgfSxcbiAgICAgICAgaXRlbXMsXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgYmFsYW5jZSBzaGVldC5cbiAgICovXG4gIGJhbGFuY2VTaGVldDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHF1ZXJ5KCdhY2NvdW50aW5nX21ldGhvZCcpLm9wdGlvbmFsKCkuaXNJbihbJ2Nhc2gnLCAnYWNjdXJhbCddKSxcbiAgICAgIHF1ZXJ5KCdmcm9tX2RhdGUnKS5vcHRpb25hbCgpLFxuICAgICAgcXVlcnkoJ3RvX2RhdGUnKS5vcHRpb25hbCgpLFxuICAgICAgcXVlcnkoJ2Rpc3BsYXlfY29sdW1uc19ieScpLm9wdGlvbmFsKCkuaXNJbihbJ3llYXInLCAnbW9udGgnLCAnd2VlaycsICdkYXknLCAncXVhcnRlciddKSxcbiAgICAgIHF1ZXJ5KCdudW1iZXJfZm9ybWF0Lm5vX2NlbnRzJykub3B0aW9uYWwoKS5pc0Jvb2xlYW4oKS50b0Jvb2xlYW4oKSxcbiAgICAgIHF1ZXJ5KCdudW1iZXJfZm9ybWF0LmRpdmlkZV8xMDAwJykub3B0aW9uYWwoKS5pc0Jvb2xlYW4oKS50b0Jvb2xlYW4oKSxcbiAgICAgIHF1ZXJ5KCdub25lX3plcm8nKS5vcHRpb25hbCgpLmlzQm9vbGVhbigpLnRvQm9vbGVhbigpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGZpbHRlciA9IHtcbiAgICAgICAgZGlzcGxheV9jb2x1bW5zX2J5OiAneWVhcicsXG4gICAgICAgIGZyb21fZGF0ZTogbW9tZW50KCkuc3RhcnRPZigneWVhcicpLmZvcm1hdCgnWVlZWS1NTS1ERCcpLFxuICAgICAgICB0b19kYXRlOiBtb21lbnQoKS5lbmRPZigneWVhcicpLmZvcm1hdCgnWVlZWS1NTS1ERCcpLFxuICAgICAgICBudW1iZXJfZm9ybWF0OiB7XG4gICAgICAgICAgbm9fY2VudHM6IGZhbHNlLFxuICAgICAgICAgIGRpdmlkZV8xMDAwOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgbm9uZV96ZXJvOiBmYWxzZSxcbiAgICAgICAgLi4ucmVxLnF1ZXJ5LFxuICAgICAgfTtcblxuICAgICAgY29uc3QgYmFsYW5jZVNoZWV0VHlwZXMgPSBhd2FpdCBBY2NvdW50VHlwZS5xdWVyeSgpXG4gICAgICAgIC53aGVyZSgnYmFsYW5jZV9zaGVldCcsIHRydWUpO1xuXG4gICAgICAvLyBGZXRjaCBhbGwgYmFsYW5jZSBzaGVldCBhY2NvdW50cy5cbiAgICAgIGNvbnN0IGFjY291bnRzID0gYXdhaXQgQWNjb3VudC5xdWVyeSgpXG4gICAgICAgIC53aGVyZUluKCdhY2NvdW50X3R5cGVfaWQnLCBiYWxhbmNlU2hlZXRUeXBlcy5tYXAoKGEpID0+IGEuaWQpKVxuICAgICAgICAud2l0aEdyYXBoRmV0Y2hlZCgndHlwZScpXG4gICAgICAgIC53aXRoR3JhcGhGZXRjaGVkKCd0cmFuc2FjdGlvbnMnKVxuICAgICAgICAubW9kaWZ5R3JhcGgoJ3RyYW5zYWN0aW9ucycsIChidWlsZGVyKSA9PiB7XG4gICAgICAgICAgYnVpbGRlci5tb2RpZnkoJ2ZpbHRlckRhdGVSYW5nZScsIG51bGwsIGZpbHRlci50b19kYXRlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGpvdXJuYWxFbnRyaWVzQ29sbGVjdGVkID0gQWNjb3VudC5jb2xsZWN0Sm91cm5hbEVudHJpZXMoYWNjb3VudHMpO1xuICAgICAgY29uc3Qgam91cm5hbEVudHJpZXMgPSBuZXcgSm91cm5hbFBvc3RlcigpO1xuICAgICAgam91cm5hbEVudHJpZXMubG9hZEVudHJpZXMoam91cm5hbEVudHJpZXNDb2xsZWN0ZWQpO1xuXG4gICAgICAvLyBBY2NvdW50IGJhbGFuY2UgZm9ybW1hdHRlciBiYXNlZCBvbiB0aGUgZ2l2ZW4gcXVlcnkuXG4gICAgICBjb25zdCBiYWxhbmNlRm9ybWF0dGVyID0gZm9ybWF0TnVtYmVyQ2xvc3VyZShmaWx0ZXIubnVtYmVyX2Zvcm1hdCk7XG5cbiAgICAgIC8vIEdldHMgdGhlIGRhdGUgcmFuZ2Ugc2V0IGZyb20gc3RhcnQgdG8gZW5kIGRhdGUuXG4gICAgICBjb25zdCBkYXRlUmFuZ2VTZXQgPSBkYXRlUmFuZ2VDb2xsZWN0aW9uKFxuICAgICAgICBmaWx0ZXIuZnJvbV9kYXRlLFxuICAgICAgICBmaWx0ZXIudG9fZGF0ZSxcbiAgICAgICAgZmlsdGVyLmRpc3BsYXlfY29sdW1uc19ieSxcbiAgICAgICk7XG4gICAgICAvLyBSZXRyaWV2ZSB0aGUgYXNzZXQgYmFsYW5jZSBzaGVldC5cbiAgICAgIGNvbnN0IGFzc2V0cyA9IFtcbiAgICAgICAgLi4uYWNjb3VudHNcbiAgICAgICAgICAuZmlsdGVyKChhY2NvdW50KSA9PiAoXG4gICAgICAgICAgICBhY2NvdW50LnR5cGUubm9ybWFsID09PSAnZGViaXQnXG4gICAgICAgICAgICAmJiAoYWNjb3VudC50cmFuc2FjdGlvbnMubGVuZ3RoID4gMCB8fCAhZmlsdGVyLm5vbmVfemVybylcbiAgICAgICAgICApKVxuICAgICAgICAgIC5tYXAoKGFjY291bnQpID0+ICh7XG4gICAgICAgICAgICAuLi5waWNrKGFjY291bnQsIFsnaWQnLCAnaW5kZXgnLCAnbmFtZScsICdjb2RlJ10pLFxuICAgICAgICAgICAgdHJhbnNhY3Rpb25zOiBkYXRlUmFuZ2VTZXQubWFwKChkYXRlKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBmaWx0ZXIuZGlzcGxheV9jb2x1bW5zX2J5O1xuICAgICAgICAgICAgICBjb25zdCBiYWxhbmNlID0gam91cm5hbEVudHJpZXMuZ2V0Q2xvc2luZ0JhbGFuY2UoYWNjb3VudC5pZCwgZGF0ZSwgdHlwZSk7XG4gICAgICAgICAgICAgIHJldHVybiB7IGRhdGUsIGJhbGFuY2U6IGJhbGFuY2VGb3JtYXR0ZXIoYmFsYW5jZSkgfTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0pKSxcbiAgICAgIF07XG4gICAgICAvLyBSZXRyaWV2ZSBsaWFiaWxpdGllcyBhbmQgZXF1aXR5IGJhbGFuY2Ugc2hlZXQuXG4gICAgICBjb25zdCBsaWFiaWxpdGllc0VxdWl0eSA9IFtcbiAgICAgICAgLi4uYWNjb3VudHNcbiAgICAgICAgICAuZmlsdGVyKChhY2NvdW50KSA9PiAoXG4gICAgICAgICAgICBhY2NvdW50LnR5cGUubm9ybWFsID09PSAnY3JlZGl0J1xuICAgICAgICAgICAgJiYgKGFjY291bnQudHJhbnNhY3Rpb25zLmxlbmd0aCA+IDAgfHwgIWZpbHRlci5ub25lX3plcm8pXG4gICAgICAgICAgKSlcbiAgICAgICAgICAubWFwKChhY2NvdW50KSA9PiAoe1xuICAgICAgICAgICAgLi4ucGljayhhY2NvdW50LCBbJ2lkJywgJ2luZGV4JywgJ25hbWUnLCAnY29kZSddKSxcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uczogZGF0ZVJhbmdlU2V0Lm1hcCgoZGF0ZSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB0eXBlID0gZmlsdGVyLmRpc3BsYXlfY29sdW1uc19ieTtcbiAgICAgICAgICAgICAgY29uc3QgYmFsYW5jZSA9IGpvdXJuYWxFbnRyaWVzLmdldENsb3NpbmdCYWxhbmNlKGFjY291bnQuaWQsIGRhdGUsIHR5cGUpO1xuICAgICAgICAgICAgICByZXR1cm4geyBkYXRlLCBiYWxhbmNlOiBiYWxhbmNlRm9ybWF0dGVyKGJhbGFuY2UpIH07XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9KSksXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgY29sdW1uczogeyAuLi5kYXRlUmFuZ2VTZXQgfSxcbiAgICAgICAgYmFsYW5jZV9zaGVldDoge1xuICAgICAgICAgIGFzc2V0cyxcbiAgICAgICAgICBsaWFiaWxpdGllc19lcXVpdHk6IGxpYWJpbGl0aWVzRXF1aXR5LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIHRyaWFsIGJhbGFuY2Ugc2hlZXQuXG4gICAqL1xuICB0cmlhbEJhbGFuY2VTaGVldDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHF1ZXJ5KCdiYXNpcycpLm9wdGlvbmFsKCksXG4gICAgICBxdWVyeSgnZnJvbV9kYXRlJykub3B0aW9uYWwoKS5pc0lTTzg2MDEoKSxcbiAgICAgIHF1ZXJ5KCd0b19kYXRlJykub3B0aW9uYWwoKS5pc0lTTzg2MDEoKSxcbiAgICAgIHF1ZXJ5KCdudW1iZXJfZm9ybWF0Lm5vX2NlbnRzJykub3B0aW9uYWwoKS5pc0Jvb2xlYW4oKSxcbiAgICAgIHF1ZXJ5KCdudW1iZXJfZm9ybWF0LjEwMDBfZGl2aWRlJykub3B0aW9uYWwoKS5pc0Jvb2xlYW4oKSxcbiAgICAgIHF1ZXJ5KCdiYXNpcycpLm9wdGlvbmFsKCksXG4gICAgICBxdWVyeSgnbm9uZV96ZXJvJykub3B0aW9uYWwoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmaWx0ZXIgPSB7XG4gICAgICAgIGZyb21fZGF0ZTogbW9tZW50KCkuc3RhcnRPZigneWVhcicpLmZvcm1hdCgnWVlZWS1NTS1ERCcpLFxuICAgICAgICB0b19kYXRlOiBtb21lbnQoKS5lbmRPZigneWVhcicpLmZvcm1hdCgnWVlZWS1NTS1ERCcpLFxuICAgICAgICBudW1iZXJfZm9ybWF0OiB7XG4gICAgICAgICAgbm9fY2VudHM6IGZhbHNlLFxuICAgICAgICAgIGRpdmlkZV8xMDAwOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgYmFzaXM6ICdhY2N1cmFsJyxcbiAgICAgICAgbm9uZV96ZXJvOiBmYWxzZSxcbiAgICAgICAgLi4ucmVxLnF1ZXJ5LFxuICAgICAgfTtcblxuICAgICAgY29uc3QgYWNjb3VudHMgPSBhd2FpdCBBY2NvdW50LnF1ZXJ5KClcbiAgICAgICAgLndpdGhHcmFwaEZldGNoZWQoJ3R5cGUnKVxuICAgICAgICAud2l0aEdyYXBoRmV0Y2hlZCgndHJhbnNhY3Rpb25zJylcbiAgICAgICAgLm1vZGlmeUdyYXBoKCd0cmFuc2FjdGlvbnMnLCAoYnVpbGRlcikgPT4ge1xuICAgICAgICAgIGJ1aWxkZXIubW9kaWZ5KCdzdW1hdGlvbkNyZWRpdERlYml0Jyk7XG4gICAgICAgICAgYnVpbGRlci5tb2RpZnkoJ2ZpbHRlckRhdGVSYW5nZScsIGZpbHRlci5mcm9tX2RhdGUsIGZpbHRlci50b19kYXRlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGpvdXJuYWxFbnRyaWVzQ29sbGVjdCA9IEFjY291bnQuY29sbGVjdEpvdXJuYWxFbnRyaWVzKGFjY291bnRzKTtcbiAgICAgIGNvbnN0IGpvdXJuYWxFbnRyaWVzID0gbmV3IEpvdXJuYWxQb3N0ZXIoKTtcbiAgICAgIGpvdXJuYWxFbnRyaWVzLmxvYWRFbnRyaWVzKGpvdXJuYWxFbnRyaWVzQ29sbGVjdCk7XG5cbiAgICAgIC8vIEFjY291bnQgYmFsYW5jZSBmb3JtbWF0dGVyIGJhc2VkIG9uIHRoZSBnaXZlbiBxdWVyeS5cbiAgICAgIGNvbnN0IGJhbGFuY2VGb3JtYXR0ZXIgPSBmb3JtYXROdW1iZXJDbG9zdXJlKGZpbHRlci5udW1iZXJfZm9ybWF0KTtcblxuICAgICAgY29uc3QgaXRlbXMgPSBhY2NvdW50c1xuICAgICAgICAuZmlsdGVyKChhY2NvdW50KSA9PiAoXG4gICAgICAgICAgYWNjb3VudC50cmFuc2FjdGlvbnMubGVuZ3RoID4gMCB8fCAhZmlsdGVyLm5vbmVfemVyb1xuICAgICAgICApKVxuICAgICAgICAubWFwKChhY2NvdW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgdHJpYWwgPSBqb3VybmFsRW50cmllcy5nZXRUcmlhbEJhbGFuY2UoYWNjb3VudC5pZCk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFjY291bnRfaWQ6IGFjY291bnQuaWQsXG4gICAgICAgICAgICBjb2RlOiBhY2NvdW50LmNvZGUsXG4gICAgICAgICAgICBhY2NvdW50Tm9ybWFsOiBhY2NvdW50LnR5cGUubm9ybWFsLFxuICAgICAgICAgICAgY3JlZGl0OiBiYWxhbmNlRm9ybWF0dGVyKHRyaWFsLmNyZWRpdCksXG4gICAgICAgICAgICBkZWJpdDogYmFsYW5jZUZvcm1hdHRlcih0cmlhbC5kZWJpdCksXG4gICAgICAgICAgICBiYWxhbmNlOiBiYWxhbmNlRm9ybWF0dGVyKHRyaWFsLmJhbGFuY2UpLFxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgbWV0YTogeyAuLi5maWx0ZXIgfSxcbiAgICAgICAgaXRlbXM6IFsuLi5pdGVtc10sXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBwcm9maXQvbG9zcyBmaW5hbmNpYWwgc3RhdGVtZW50LlxuICAgKi9cbiAgcHJvZml0TG9zc1NoZWV0OiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcXVlcnkoJ2Jhc2lzJykub3B0aW9uYWwoKSxcbiAgICAgIHF1ZXJ5KCdmcm9tX2RhdGUnKS5vcHRpb25hbCgpLmlzSVNPODYwMSgpLFxuICAgICAgcXVlcnkoJ3RvX2RhdGUnKS5vcHRpb25hbCgpLmlzSVNPODYwMSgpLFxuICAgICAgcXVlcnkoJ251bWJlcl9mb3JtYXQubm9fY2VudHMnKS5vcHRpb25hbCgpLmlzQm9vbGVhbigpLFxuICAgICAgcXVlcnkoJ251bWJlcl9mb3JtYXQuZGl2aWRlXzEwMDAnKS5vcHRpb25hbCgpLmlzQm9vbGVhbigpLFxuICAgICAgcXVlcnkoJ2Jhc2lzJykub3B0aW9uYWwoKSxcbiAgICAgIHF1ZXJ5KCdub25lX3plcm8nKS5vcHRpb25hbCgpLFxuICAgICAgcXVlcnkoJ2Rpc3BsYXlfY29sdW1uc19ieScpLm9wdGlvbmFsKCkuaXNJbihbJ3llYXInLCAnbW9udGgnLCAnd2VlaycsICdkYXknLCAncXVhcnRlciddKSxcbiAgICAgIHF1ZXJ5KCdhY2NvdW50cycpLm9wdGlvbmFsKCkuaXNBcnJheSgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGZpbHRlciA9IHtcbiAgICAgICAgZnJvbV9kYXRlOiBtb21lbnQoKS5zdGFydE9mKCd5ZWFyJykuZm9ybWF0KCdZWVlZLU1NLUREJyksXG4gICAgICAgIHRvX2RhdGU6IG1vbWVudCgpLmVuZE9mKCd5ZWFyJykuZm9ybWF0KCdZWVlZLU1NLUREJyksXG4gICAgICAgIG51bWJlcl9mb3JtYXQ6IHtcbiAgICAgICAgICBub19jZW50czogZmFsc2UsXG4gICAgICAgICAgZGl2aWRlXzEwMDA6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBiYXNpczogJ2FjY3VyYWwnLFxuICAgICAgICBub25lX3plcm86IGZhbHNlLFxuICAgICAgICBkaXNwbGF5X2NvbHVtbnNfYnk6ICdtb250aCcsXG4gICAgICAgIC4uLnJlcS5xdWVyeSxcbiAgICAgIH07XG4gICAgICBjb25zdCBpbmNvbWVTdGF0ZW1lbnRUeXBlcyA9IGF3YWl0IEFjY291bnRUeXBlLnF1ZXJ5KCkud2hlcmUoJ2luY29tZV9zaGVldCcsIHRydWUpO1xuXG4gICAgICBjb25zdCBhY2NvdW50cyA9IGF3YWl0IEFjY291bnQucXVlcnkoKVxuICAgICAgICAud2hlcmVJbignYWNjb3VudF90eXBlX2lkJywgaW5jb21lU3RhdGVtZW50VHlwZXMubWFwKCh0KSA9PiB0LmlkKSlcbiAgICAgICAgLndpdGhHcmFwaEZldGNoZWQoJ3R5cGUnKVxuICAgICAgICAud2l0aEdyYXBoRmV0Y2hlZCgndHJhbnNhY3Rpb25zJyk7XG5cbiAgICAgIGNvbnN0IGZpbHRlcmVkQWNjb3VudHMgPSBhY2NvdW50cy5maWx0ZXIoKGFjY291bnQpID0+IHtcbiAgICAgICAgcmV0dXJuIGFjY291bnQudHJhbnNhY3Rpb25zLmxlbmd0aCA+IDAgfHwgIWZpbHRlci5ub25lX3plcm87XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGpvdXJuYWxFbnRyaWVzQ29sbGVjdGVkID0gQWNjb3VudC5jb2xsZWN0Sm91cm5hbEVudHJpZXMoYWNjb3VudHMpO1xuICAgICAgY29uc3Qgam91cm5hbEVudHJpZXMgPSBuZXcgSm91cm5hbFBvc3RlcigpO1xuICAgICAgam91cm5hbEVudHJpZXMubG9hZEVudHJpZXMoam91cm5hbEVudHJpZXNDb2xsZWN0ZWQpO1xuXG4gICAgICAvLyBBY2NvdW50IGJhbGFuY2UgZm9ybW1hdHRlciBiYXNlZCBvbiB0aGUgZ2l2ZW4gcXVlcnkuXG4gICAgICBjb25zdCBudW1iZXJGb3JtYXR0ZXIgPSBmb3JtYXROdW1iZXJDbG9zdXJlKGZpbHRlci5udW1iZXJfZm9ybWF0KTtcblxuICAgICAgLy8gR2V0cyB0aGUgZGF0ZSByYW5nZSBzZXQgZnJvbSBzdGFydCB0byBlbmQgZGF0ZS5cbiAgICAgIGNvbnN0IGRhdGVSYW5nZVNldCA9IGRhdGVSYW5nZUNvbGxlY3Rpb24oXG4gICAgICAgIGZpbHRlci5mcm9tX2RhdGUsXG4gICAgICAgIGZpbHRlci50b19kYXRlLFxuICAgICAgICBmaWx0ZXIuZGlzcGxheV9jb2x1bW5zX2J5LFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGFjY291bnRzSW5jb21lID0gZmlsdGVyZWRBY2NvdW50c1xuICAgICAgICAuZmlsdGVyKChhY2NvdW50KSA9PiBhY2NvdW50LnR5cGUubm9ybWFsID09PSAnY3JlZGl0JylcbiAgICAgICAgLm1hcCgoYWNjb3VudCkgPT4gKHtcbiAgICAgICAgICAuLi5waWNrKGFjY291bnQsIFsnaWQnLCAnaW5kZXgnLCAnbmFtZScsICdjb2RlJ10pLFxuICAgICAgICAgIGRhdGVzOiBkYXRlUmFuZ2VTZXQubWFwKChkYXRlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gZmlsdGVyLmRpc3BsYXlfY29sdW1uc19ieTtcbiAgICAgICAgICAgIGNvbnN0IGFtb3VudCA9IGpvdXJuYWxFbnRyaWVzLmdldENsb3NpbmdCYWxhbmNlKGFjY291bnQuaWQsIGRhdGUsIHR5cGUpO1xuXG4gICAgICAgICAgICByZXR1cm4geyBkYXRlLCByYXdBbW91bnQ6IGFtb3VudCwgYW1vdW50OiBudW1iZXJGb3JtYXR0ZXIoYW1vdW50KSB9O1xuICAgICAgICAgIH0pLFxuICAgICAgICB9KSk7XG5cbiAgICAgIGNvbnN0IGFjY291bnRzRXhwZW5zZXMgPSBmaWx0ZXJlZEFjY291bnRzXG4gICAgICAgIC5maWx0ZXIoKGFjY291bnQpID0+IGFjY291bnQudHlwZS5ub3JtYWwgPT09ICdkZWJpdCcpXG4gICAgICAgIC5tYXAoKGFjY291bnQpID0+ICh7XG4gICAgICAgICAgLi4ucGljayhhY2NvdW50LCBbJ2lkJywgJ2luZGV4JywgJ25hbWUnLCAnY29kZSddKSxcbiAgICAgICAgICBkYXRlczogZGF0ZVJhbmdlU2V0Lm1hcCgoZGF0ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdHlwZSA9IGZpbHRlci5kaXNwbGF5X2NvbHVtbnNfYnk7XG4gICAgICAgICAgICBjb25zdCBhbW91bnQgPSBqb3VybmFsRW50cmllcy5nZXRDbG9zaW5nQmFsYW5jZShhY2NvdW50LmlkLCBkYXRlLCB0eXBlKTtcblxuICAgICAgICAgICAgcmV0dXJuIHsgZGF0ZSwgcmF3QW1vdW50OiBhbW91bnQsIGFtb3VudDogbnVtYmVyRm9ybWF0dGVyKGFtb3VudCkgfTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSkpO1xuXG4gICAgICAvLyBDYWxjdWxhdGVzIHRoZSB0b3RhbCBpbmNvbWUgb2YgaW5jb21lIGFjY291bnRzLlxuICAgICAgY29uc3QgdG90YWxBY2NvdW50c0luY29tZSA9IGRhdGVSYW5nZVNldC5yZWR1Y2UoKGFjYywgZGF0ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgbGV0IGFtb3VudCA9IDA7XG4gICAgICAgIGFjY291bnRzSW5jb21lLmZvckVhY2goKGFjY291bnQpID0+IHtcbiAgICAgICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IGFjY291bnQuZGF0ZXNbaW5kZXhdO1xuICAgICAgICAgIGFtb3VudCArPSBjdXJyZW50RGF0ZS5yYXdBbW91bnQgfHwgMDtcbiAgICAgICAgfSk7XG4gICAgICAgIGFjY1tkYXRlXSA9IHsgZGF0ZSwgcmF3QW1vdW50OiBhbW91bnQsIGFtb3VudDogbnVtYmVyRm9ybWF0dGVyKGFtb3VudCkgfTtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIHt9KTtcblxuICAgICAgLy8gQ2FsY3VsYXRlcyB0aGUgdG90YWwgZXhwZW5zZXMgb2YgZXhwZW5zZXMgYWNjb3VudHMuXG4gICAgICBjb25zdCB0b3RhbEFjY291bnRzRXhwZW5zZXMgPSBkYXRlUmFuZ2VTZXQucmVkdWNlKChhY2MsIGRhdGUsIGluZGV4KSA9PiB7XG4gICAgICAgIGxldCBhbW91bnQgPSAwO1xuICAgICAgICBhY2NvdW50c0V4cGVuc2VzLmZvckVhY2goKGFjY291bnQpID0+IHtcbiAgICAgICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IGFjY291bnQuZGF0ZXNbaW5kZXhdO1xuICAgICAgICAgIGFtb3VudCArPSBjdXJyZW50RGF0ZS5yYXdBbW91bnQgfHwgMDtcbiAgICAgICAgfSk7XG4gICAgICAgIGFjY1tkYXRlXSA9IHsgZGF0ZSwgcmF3QW1vdW50OiBhbW91bnQsIGFtb3VudDogbnVtYmVyRm9ybWF0dGVyKGFtb3VudCkgfTtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIHt9KTtcblxuICAgICAgLy8gVG90YWwgaW5jb21lKGRhdGUpIC0gVG90YWwgZXhwZW5zZXMoZGF0ZSkgPSBOZXQgaW5jb21lKGRhdGUpXG4gICAgICBjb25zdCBuZXRJbmNvbWUgPSBkYXRlUmFuZ2VTZXQubWFwKChkYXRlKSA9PiB7XG4gICAgICAgIGNvbnN0IHRvdGFsSW5jb21lID0gdG90YWxBY2NvdW50c0luY29tZVtkYXRlXTtcbiAgICAgICAgY29uc3QgdG90YWxFeHBlbnNlcyA9IHRvdGFsQWNjb3VudHNFeHBlbnNlc1tkYXRlXTtcblxuICAgICAgICBsZXQgYW1vdW50ID0gdG90YWxJbmNvbWUucmF3QW1vdW50IHx8IDA7XG4gICAgICAgIGFtb3VudCAtPSB0b3RhbEV4cGVuc2VzLnJhd0Ftb3VudCB8fCAwO1xuICAgICAgICByZXR1cm4geyBkYXRlLCByYXdBbW91bnQ6IGFtb3VudCwgYW1vdW50OiBudW1iZXJGb3JtYXR0ZXIoYW1vdW50KSB9O1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgIG1ldGE6IHsgLi4uZmlsdGVyIH0sXG4gICAgICAgIGluY29tZToge1xuICAgICAgICAgIGVudHJ5X25vcm1hbDogJ2NyZWRpdCcsXG4gICAgICAgICAgYWNjb3VudHM6IGFjY291bnRzSW5jb21lLFxuICAgICAgICB9LFxuICAgICAgICBleHBlbnNlczoge1xuICAgICAgICAgIGVudHJ5X25vcm1hbDogJ2RlYml0JyxcbiAgICAgICAgICBhY2NvdW50czogYWNjb3VudHNFeHBlbnNlcyxcbiAgICAgICAgfSxcbiAgICAgICAgdG90YWxfaW5jb21lOiBPYmplY3QudmFsdWVzKHRvdGFsQWNjb3VudHNJbmNvbWUpLFxuICAgICAgICB0b3RhbF9leHBlbnNlczogT2JqZWN0LnZhbHVlcyh0b3RhbEFjY291bnRzRXhwZW5zZXMpLFxuICAgICAgICB0b3RhbF9uZXRfaW5jb21lOiBuZXRJbmNvbWUsXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxuXG4gIGNhc2hGbG93U3RhdGVtZW50OiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcXVlcnkoJ2RhdGVfZnJvbScpLm9wdGlvbmFsKCksXG4gICAgICBxdWVyeSgnZGF0ZV90bycpLm9wdGlvbmFsKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgIG1ldGE6IHt9LFxuICAgICAgICBvcGVyYXRpbmc6IFtdLFxuICAgICAgICBmaW5hbmNpbmc6IFtdLFxuICAgICAgICBpbnZlc3Rpbmc6IFtdLFxuICAgICAgfSk7XG4gICAgfSxcbiAgfSxcbn1cbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgY2hlY2ssIHBhcmFtLCB2YWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InO1xuaW1wb3J0IGFzeW5jTWlkZGxld2FyZSBmcm9tICcuLi9taWRkbGV3YXJlL2FzeW5jTWlkZGxld2FyZSc7XG5pbXBvcnQgSXRlbUNhdGVnb3J5IGZyb20gJ0AvbW9kZWxzL0l0ZW1DYXRlZ29yeSc7XG5pbXBvcnQgQXV0aG9yaXphdGlvbiBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9hdXRob3JpemF0aW9uJztcbmltcG9ydCBKV1RBdXRoIGZyb20gJ0AvaHR0cC9taWRkbGV3YXJlL2p3dEF1dGgnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBSb3V0ZXIgY29uc3RydWN0b3IgbWV0aG9kLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG4gICAgY29uc3QgcGVybWl0ID0gQXV0aG9yaXphdGlvbignaXRlbXNfY2F0ZWdvcmllcycpO1xuXG4gICAgcm91dGVyLnVzZShKV1RBdXRoKTtcblxuICAgIHJvdXRlci5wb3N0KCcvOmlkJyxcbiAgICAgIHBlcm1pdCgnY3JlYXRlJywgJ2VkaXQnKSxcbiAgICAgIHRoaXMuZWRpdENhdGVnb3J5LnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5lZGl0Q2F0ZWdvcnkuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLnBvc3QoJy8nLFxuICAgICAgcGVybWl0KCdjcmVhdGUnKSxcbiAgICAgIHRoaXMubmV3Q2F0ZWdvcnkudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLm5ld0NhdGVnb3J5LmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5kZWxldGUoJy86aWQnLFxuICAgICAgcGVybWl0KCdjcmVhdGUnLCAnZWRpdCcsICdkZWxldGUnKSxcbiAgICAgIHRoaXMuZGVsZXRlSXRlbS52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZGVsZXRlSXRlbS5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvOmlkJyxcbiAgICAgIHBlcm1pdCgndmlldycpLFxuICAgICAgdGhpcy5nZXRDYXRlZ29yeS52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZ2V0Q2F0ZWdvcnkuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmdldCgnLycsXG4gICAgICBwZXJtaXQoJ3ZpZXcnKSxcbiAgICAgIHRoaXMuZ2V0TGlzdC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZ2V0TGlzdC52YWxpZGF0aW9uKSk7XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGl0ZW0gY2F0ZWdvcnkuXG4gICAqL1xuICBuZXdDYXRlZ29yeToge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCduYW1lJykuZXhpc3RzKHsgY2hlY2tGYWxzeTogdHJ1ZSB9KS50cmltKCkuZXNjYXBlKCksXG4gICAgICBjaGVjaygncGFyZW50X2NhdGVnb3J5X2lkJykub3B0aW9uYWwoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2Rlc2NyaXB0aW9uJykub3B0aW9uYWwoKS50cmltKCkuZXNjYXBlKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7IG5hbWUsIHBhcmVudF9jYXRlZ29yeV9pZDogcGFyZW50Q2F0ZWdvcnlJZCwgZGVzY3JpcHRpb24gfSA9IHJlcS5ib2R5O1xuXG4gICAgICBpZiAocGFyZW50Q2F0ZWdvcnlJZCkge1xuICAgICAgICBjb25zdCBmb3VuZFBhcmVudENhdGVnb3J5ID0gYXdhaXQgSXRlbUNhdGVnb3J5LndoZXJlKCdpZCcsIHBhcmVudENhdGVnb3J5SWQpLmZldGNoKCk7XG5cbiAgICAgICAgaWYgKCFmb3VuZFBhcmVudENhdGVnb3J5KSB7XG4gICAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKCdUaGUgcGFyZW50IGNhdGVnb3J5IElEIGlzIG5vdCBmb3VuZC4nLCB7XG4gICAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdQQVJFTlRfQ0FURUdPUllfTk9UX0ZPVU5EJywgY29kZTogMTAwIH1dLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBjYXRlZ29yeSA9IGF3YWl0IEl0ZW1DYXRlZ29yeS5mb3JnZSh7XG4gICAgICAgIGxhYmVsOiBuYW1lLFxuICAgICAgICBwYXJlbnRfY2F0ZWdvcnlfaWQ6IHBhcmVudENhdGVnb3J5SWQsXG4gICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgfSk7XG5cbiAgICAgIGF3YWl0IGNhdGVnb3J5LnNhdmUoKTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGlkOiBjYXRlZ29yeS5nZXQoJ2lkJykgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogRWRpdCBkZXRhaWxzIG9mIHRoZSBnaXZlbiBjYXRlZ29yeSBpdGVtLlxuICAgKi9cbiAgZWRpdENhdGVnb3J5OiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ2lkJykudG9JbnQoKSxcbiAgICAgIGNoZWNrKCduYW1lJykuZXhpc3RzKHsgY2hlY2tGYWxzeTogdHJ1ZSB9KS50cmltKCkuZXNjYXBlKCksXG4gICAgICBjaGVjaygncGFyZW50X2NhdGVnb3J5X2lkJykub3B0aW9uYWwoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2Rlc2NyaXB0aW9uJykub3B0aW9uYWwoKS50cmltKCkuZXNjYXBlKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHsgbmFtZSwgcGFyZW50X2NhdGVnb3J5X2lkOiBwYXJlbnRDYXRlZ29yeUlkLCBkZXNjcmlwdGlvbiB9ID0gcmVxLmJvZHk7XG4gICAgICBjb25zdCBpdGVtQ2F0ZWdvcnkgPSBhd2FpdCBJdGVtQ2F0ZWdvcnkud2hlcmUoJ2lkJywgaWQpLmZldGNoKCk7XG5cbiAgICAgIGlmICghaXRlbUNhdGVnb3J5KSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZCgpO1xuICAgICAgfVxuICAgICAgaWYgKHBhcmVudENhdGVnb3J5SWQgJiYgcGFyZW50Q2F0ZWdvcnlJZCAhPT0gaXRlbUNhdGVnb3J5LmF0dHJpYnV0ZXMucGFyZW50X2NhdGVnb3J5X2lkKSB7XG4gICAgICAgIGNvbnN0IGZvdW5kUGFyZW50Q2F0ZWdvcnkgPSBhd2FpdCBJdGVtQ2F0ZWdvcnkud2hlcmUoJ2lkJywgcGFyZW50Q2F0ZWdvcnlJZCkuZmV0Y2goKTtcblxuICAgICAgICBpZiAoIWZvdW5kUGFyZW50Q2F0ZWdvcnkpIHtcbiAgICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQoJ1RoZSBwYXJlbnQgY2F0ZWdvcnkgSUQgaXMgbm90IGZvdW5kLicsIHtcbiAgICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ1BBUkVOVF9DQVRFR09SWV9OT1RfRk9VTkQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGF3YWl0IGl0ZW1DYXRlZ29yeS5zYXZlKHtcbiAgICAgICAgbGFiZWw6IG5hbWUsXG4gICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICBwYXJlbnRfY2F0ZWdvcnlfaWQ6IHBhcmVudENhdGVnb3J5SWQsXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgaWQ6IGl0ZW1DYXRlZ29yeS5pZCB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBEZWxldGUgdGhlIGdpdmUgaXRlbSBjYXRlZ29yeS5cbiAgICovXG4gIGRlbGV0ZUl0ZW06IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBwYXJhbSgnaWQnKS50b0ludCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgeyBpZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IGl0ZW1DYXRlZ29yeSA9IGF3YWl0IEl0ZW1DYXRlZ29yeS53aGVyZSgnaWQnLCBpZCkuZmV0Y2goKTtcblxuICAgICAgaWYgKCFpdGVtQ2F0ZWdvcnkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKCk7XG4gICAgICB9XG4gICAgICBhd2FpdCBpdGVtQ2F0ZWdvcnkuZGVzdHJveSgpO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKCk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGxpc3Qgb2YgaXRlbXMuXG4gICAqL1xuICBnZXRMaXN0OiB7XG4gICAgdmFsaWRhdGlvbjogW10sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCBJdGVtQ2F0ZWdvcnkuZmV0Y2goKTtcblxuICAgICAgaWYgKCFpdGVtcykge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGl0ZW1zOiBpdGVtcy50b0pTT04oKSB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBkZXRhaWxzIG9mIHRoZSBnaXZlbiBjYXRlZ29yeS5cbiAgICovXG4gIGdldENhdGVnb3J5OiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ2NhdGVnb3J5X2lkJykudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgY2F0ZWdvcnlfaWQ6IGNhdGVnb3J5SWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCBpdGVtID0gYXdhaXQgSXRlbUNhdGVnb3J5LndoZXJlKCdpZCcsIGNhdGVnb3J5SWQpLmZldGNoKCk7XG5cbiAgICAgIGlmICghaXRlbSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ0NBVEVHT1JZX05PVF9GT1VORCcsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGNhdGVnb3J5OiBpdGVtLnRvSlNPTigpIH0pO1xuICAgIH0sXG4gIH0sXG59O1xuIiwiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgeyBjaGVjaywgdmFsaWRhdGlvblJlc3VsdCB9IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7IGRpZmZlcmVuY2UgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGFzeW5jTWlkZGxld2FyZSBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9hc3luY01pZGRsZXdhcmUnO1xuaW1wb3J0IGp3dEF1dGggZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvand0QXV0aCc7XG5pbXBvcnQgSXRlbSBmcm9tICdAL21vZGVscy9JdGVtJztcbmltcG9ydCBBY2NvdW50IGZyb20gJ0AvbW9kZWxzL0FjY291bnQnO1xuaW1wb3J0IEl0ZW1DYXRlZ29yeSBmcm9tICdAL21vZGVscy9JdGVtQ2F0ZWdvcnknO1xuaW1wb3J0IFJlc291cmNlIGZyb20gJ0AvbW9kZWxzL1Jlc291cmNlJztcbmltcG9ydCBSZXNvdXJjZUZpZWxkIGZyb20gJ0AvbW9kZWxzL1Jlc291cmNlRmllbGQnO1xuaW1wb3J0IEF1dGhvcml6YXRpb24gZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvYXV0aG9yaXphdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICByb3V0ZXIoKSB7XG4gICAgY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcbiAgICBjb25zdCBwZXJtaXQgPSBBdXRob3JpemF0aW9uKCdpdGVtcycpO1xuXG4gICAgcm91dGVyLnVzZShqd3RBdXRoKTtcblxuICAgIHJvdXRlci5wb3N0KCcvOmlkJyxcbiAgICAgIHRoaXMuZWRpdEl0ZW0udmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmVkaXRJdGVtLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCcvJyxcbiAgICAgIC8vIHBlcm1pdCgnY3JlYXRlJyksXG4gICAgICB0aGlzLm5ld0l0ZW0udmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLm5ld0l0ZW0uaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmRlbGV0ZSgnLzppZCcsXG4gICAgICB0aGlzLmRlbGV0ZUl0ZW0udmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmRlbGV0ZUl0ZW0uaGFuZGxlcikpO1xuXG4gICAgLy8gcm91dGVyLmdldCgnLzppZCcsXG4gICAgLy8gICB0aGlzLmdldENhdGVnb3J5LnZhbGlkYXRpb24sXG4gICAgLy8gICBhc3luY01pZGRsZXdhcmUodGhpcy5nZXRDYXRlZ29yeS5oYW5kbGVyKSk7XG5cbiAgICAvLyByb3V0ZXIuZ2V0KCcvJyxcbiAgICAvLyAgIHRoaXMuY2F0ZWdvcmllc0xpc3QudmFsaWRhdGlvbixcbiAgICAvLyAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmNhdGVnb3JpZXNMaXN0LnZhbGlkYXRpb24pKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgaXRlbS5cbiAgICovXG4gIG5ld0l0ZW06IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBjaGVjaygnbmFtZScpLmV4aXN0cygpLFxuICAgICAgY2hlY2soJ3R5cGUnKS5leGlzdHMoKS50cmltKCkuZXNjYXBlKCkuaXNJbihbJ3NlcnZpY2UnLCAncHJvZHVjdCddKSxcbiAgICAgIGNoZWNrKCdjb3N0X3ByaWNlJykuZXhpc3RzKCkuaXNOdW1lcmljKCksXG4gICAgICBjaGVjaygnc2VsbF9wcmljZScpLmV4aXN0cygpLmlzTnVtZXJpYygpLFxuICAgICAgY2hlY2soJ2Nvc3RfYWNjb3VudF9pZCcpLmV4aXN0cygpLmlzSW50KCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdzZWxsX2FjY291bnRfaWQnKS5leGlzdHMoKS5pc0ludCgpLnRvSW50KCksXG4gICAgICBjaGVjaygnY2F0ZWdvcnlfaWQnKS5vcHRpb25hbCgpLmlzSW50KCkudG9JbnQoKSxcblxuICAgICAgY2hlY2soJ2N1c3RvbV9maWVsZHMnKS5vcHRpb25hbCgpLmlzQXJyYXkoeyBtaW46IDEgfSksXG4gICAgICBjaGVjaygnY3VzdG9tX2ZpZWxkcy4qLmtleScpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnY3VzdG9tX2ZpZWxkcy4qLnZhbHVlJykuZXhpc3RzKCksXG5cbiAgICAgIGNoZWNrKCdub3RlJykub3B0aW9uYWwoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmb3JtID0ge1xuICAgICAgICBjdXN0b21fZmllbGRzOiBbXSxcbiAgICAgICAgLi4ucmVxLmJvZHksXG4gICAgICB9O1xuICAgICAgY29uc3QgZXJyb3JSZWFzb25zID0gW107XG5cbiAgICAgIGNvbnN0IGNvc3RBY2NvdW50UHJvbWlzZSA9IEFjY291bnQucXVlcnkoKS5maW5kQnlJZChmb3JtLmNvc3RfYWNjb3VudF9pZCk7XG4gICAgICBjb25zdCBzZWxsQWNjb3VudFByb21pc2UgPSBBY2NvdW50LnF1ZXJ5KCkuZmluZEJ5SWQoZm9ybS5zZWxsX2FjY291bnRfaWQpO1xuICAgICAgY29uc3QgaXRlbUNhdGVnb3J5UHJvbWlzZSA9IChmb3JtLmNhdGVnb3J5X2lkKVxuICAgICAgICA/IEl0ZW1DYXRlZ29yeS5xdWVyeSgpLmZpbmRCeUlkKGZvcm0uY2F0ZWdvcnlfaWQpIDogbnVsbDtcblxuICAgICAgLy8gVmFsaWRhdGUgdGhlIGN1c3RvbSBmaWVsZHMga2V5IGFuZCB2YWx1ZSB0eXBlLlxuICAgICAgaWYgKGZvcm0uY3VzdG9tX2ZpZWxkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGN1c3RvbUZpZWxkc0tleXMgPSBmb3JtLmN1c3RvbV9maWVsZHMubWFwKChmaWVsZCkgPT4gZmllbGQua2V5KTtcblxuICAgICAgICAvLyBHZXQgcmVzb3VyY2UgaWQgdGhhbiBnZXQgYWxsIHJlc291cmNlIGZpZWxkcy5cbiAgICAgICAgY29uc3QgcmVzb3VyY2UgPSBhd2FpdCBSZXNvdXJjZS53aGVyZSgnbmFtZScsICdpdGVtcycpLmZldGNoKCk7XG4gICAgICAgIGNvbnN0IGZpZWxkcyA9IGF3YWl0IFJlc291cmNlRmllbGQucXVlcnkoKHF1ZXJ5KSA9PiB7XG4gICAgICAgICAgcXVlcnkud2hlcmUoJ3Jlc291cmNlX2lkJywgcmVzb3VyY2UuaWQpO1xuICAgICAgICAgIHF1ZXJ5LndoZXJlSW4oJ2tleScsIGN1c3RvbUZpZWxkc0tleXMpO1xuICAgICAgICB9KS5mZXRjaEFsbCgpO1xuXG4gICAgICAgIGNvbnN0IHN0b3JlZEZpZWxkc0tleSA9IGZpZWxkcy5tYXAoKGYpID0+IGYuYXR0cmlidXRlcy5rZXkpO1xuXG4gICAgICAgIC8vIEdldCBhbGwgbm90IGRlZmluZWQgcmVzb3VyY2UgZmllbGRzLlxuICAgICAgICBjb25zdCBub3RGb3VuZEZpZWxkcyA9IGRpZmZlcmVuY2UoY3VzdG9tRmllbGRzS2V5cywgc3RvcmVkRmllbGRzS2V5KTtcblxuICAgICAgICBpZiAobm90Rm91bmRGaWVsZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHsgdHlwZTogJ0ZJRUxEX0tFWV9OT1RfRk9VTkQnLCBjb2RlOiAxNTAsIGZpZWxkczogbm90Rm91bmRGaWVsZHMgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IFtjb3N0QWNjb3VudCwgc2VsbEFjY291bnQsIGl0ZW1DYXRlZ29yeV0gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIGNvc3RBY2NvdW50UHJvbWlzZSwgc2VsbEFjY291bnRQcm9taXNlLCBpdGVtQ2F0ZWdvcnlQcm9taXNlLFxuICAgICAgXSk7XG4gICAgICBpZiAoIWNvc3RBY2NvdW50KSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHsgdHlwZTogJ0NPU1RfQUNDT1VOVF9OT1RfRk9VTkQnLCBjb2RlOiAxMDAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoIXNlbGxBY2NvdW50KSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHsgdHlwZTogJ1NFTExfQUNDT1VOVF9OT1RfRk9VTkQnLCBjb2RlOiAxMjAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoIWl0ZW1DYXRlZ29yeSAmJiBmb3JtLmNhdGVnb3J5X2lkKSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHsgdHlwZTogJ0lURU1fQ0FURUdPUllfTk9UX0ZPVU5EJywgY29kZTogMTQwIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGVycm9yUmVhc29ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWRSZXF1ZXN0KG51bGwsIHsgZXJyb3JzOiBlcnJvclJlYXNvbnMgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBpdGVtID0gYXdhaXQgSXRlbS5xdWVyeSgpLmluc2VydEFuZEZldGNoKHtcbiAgICAgICAgbmFtZTogZm9ybS5uYW1lLFxuICAgICAgICB0eXBlOiBmb3JtLnR5cGUsXG4gICAgICAgIGNvc3RfcHJpY2U6IGZvcm0uY29zdF9wcmljZSxcbiAgICAgICAgc2VsbF9wcmljZTogZm9ybS5zZWxsX3ByaWNlLFxuICAgICAgICBzZWxsX2FjY291bnRfaWQ6IGZvcm0uc2VsbF9hY2NvdW50X2lkLFxuICAgICAgICBjb3N0X2FjY291bnRfaWQ6IGZvcm0uY29zdF9hY2NvdW50X2lkLFxuICAgICAgICBjdXJyZW5jeV9jb2RlOiBmb3JtLmN1cnJlbmN5X2NvZGUsXG4gICAgICAgIG5vdGU6IGZvcm0ubm90ZSxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgaWQ6IGl0ZW0uaWQgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogRWRpdCB0aGUgZ2l2ZW4gaXRlbS5cbiAgICovXG4gIGVkaXRJdGVtOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgY2hlY2soJ25hbWUnKS5leGlzdHMoKSxcbiAgICAgIGNoZWNrKCd0eXBlJykuZXhpc3RzKCkudHJpbSgpLmVzY2FwZSgpLmlzSW4oWydwcm9kdWN0JywgJ3NlcnZpY2UnXSksXG4gICAgICBjaGVjaygnY29zdF9wcmljZScpLmV4aXN0cygpLmlzTnVtZXJpYygpLFxuICAgICAgY2hlY2soJ3NlbGxfcHJpY2UnKS5leGlzdHMoKS5pc051bWVyaWMoKSxcbiAgICAgIGNoZWNrKCdjb3N0X2FjY291bnRfaWQnKS5leGlzdHMoKS5pc0ludCgpLFxuICAgICAgY2hlY2soJ3NlbGxfYWNjb3VudF9pZCcpLmV4aXN0cygpLmlzSW50KCksXG4gICAgICBjaGVjaygnY2F0ZWdvcnlfaWQnKS5vcHRpb25hbCgpLmlzSW50KCksXG4gICAgICBjaGVjaygnbm90ZScpLm9wdGlvbmFsKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgZm9ybSA9IHtcbiAgICAgICAgY3VzdG9tX2ZpZWxkczogW10sXG4gICAgICAgIC4uLnJlcS5ib2R5LFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGl0ZW0gPSBhd2FpdCBJdGVtLnF1ZXJ5KCkuZmluZEJ5SWQoaWQpO1xuICAgICAgXG4gICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKG51bGwsIHsgZXJyb3JzOiBbXG4gICAgICAgICAgeyB0eXBlOiAnSVRFTS5OT1QuRk9VTkQnLCBjb2RlOiAxMDAgfSxcbiAgICAgICAgXX0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZXJyb3JSZWFzb25zID0gW107XG5cbiAgICAgIGNvbnN0IGNvc3RBY2NvdW50UHJvbWlzZSA9IEFjY291bnQucXVlcnkoKS5maW5kQnlJZChmb3JtLmNvc3RfYWNjb3VudF9pZCk7XG4gICAgICBjb25zdCBzZWxsQWNjb3VudFByb21pc2UgPSBBY2NvdW50LnF1ZXJ5KCkuZmluZEJ5SWQoZm9ybS5zZWxsX2FjY291bnRfaWQpO1xuICAgICAgY29uc3QgaXRlbUNhdGVnb3J5UHJvbWlzZSA9IChmb3JtLmNhdGVnb3J5X2lkKVxuICAgICAgICA/IEl0ZW1DYXRlZ29yeS5xdWVyeSgpLmZpbmRCeUlkKGZvcm0uY2F0ZWdvcnlfaWQpIDogbnVsbDtcblxuICAgICAgY29uc3QgW2Nvc3RBY2NvdW50LCBzZWxsQWNjb3VudCwgaXRlbUNhdGVnb3J5XSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgY29zdEFjY291bnRQcm9taXNlLCBzZWxsQWNjb3VudFByb21pc2UsIGl0ZW1DYXRlZ29yeVByb21pc2UsXG4gICAgICBdKTtcbiAgICAgIGlmICghY29zdEFjY291bnQpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnQ09TVF9BQ0NPVU5UX05PVF9GT1VORCcsIGNvZGU6IDEwMCB9KTtcbiAgICAgIH1cbiAgICAgIGlmICghc2VsbEFjY291bnQpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnU0VMTF9BQ0NPVU5UX05PVF9GT1VORCcsIGNvZGU6IDEyMCB9KTtcbiAgICAgIH1cbiAgICAgIGlmICghaXRlbUNhdGVnb3J5ICYmIGZvcm0uY2F0ZWdvcnlfaWQpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnSVRFTV9DQVRFR09SWV9OT1RfRk9VTkQnLCBjb2RlOiAxNDAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZXJyb3JSZWFzb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwgeyBlcnJvcnM6IGVycm9yUmVhc29ucyB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdXBkYXRlZEl0ZW0gPSBhd2FpdCBJdGVtLnF1ZXJ5KCkuZmluZEJ5SWQoaWQpLnBhdGNoKHtcbiAgICAgICAgbmFtZTogZm9ybS5uYW1lLFxuICAgICAgICB0eXBlOiBmb3JtLnR5cGUsXG4gICAgICAgIGNvc3RfcHJpY2U6IGZvcm0uY29zdF9wcmljZSxcbiAgICAgICAgc2VsbF9wcmljZTogZm9ybS5zZWxsX3ByaWNlLFxuICAgICAgICBjdXJyZW5jeV9jb2RlOiBmb3JtLmN1cnJlbmN5X2NvZGUsXG4gICAgICAgIHNlbGxfYWNjb3VudF9pZDogZm9ybS5zZWxsX2FjY291bnRfaWQsXG4gICAgICAgIGNvc3RfYWNjb3VudF9pZDogZm9ybS5jb3N0X2FjY291bnRfaWQsXG4gICAgICAgIGNhdGVnb3J5X2lkOiBmb3JtLmNhdGVnb3J5X2lkLFxuICAgICAgICBub3RlOiBmb3JtLm5vdGUsXG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGlkOiB1cGRhdGVkSXRlbS5pZCB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBEZWxldGUgdGhlIGdpdmVuIGl0ZW0gZnJvbSB0aGUgc3RvcmFnZS5cbiAgICovXG4gIGRlbGV0ZUl0ZW06IHtcbiAgICB2YWxpZGF0aW9uOiBbXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgaXRlbSA9IGF3YWl0IEl0ZW0ucXVlcnkoKS5maW5kQnlJZChpZCk7XG5cbiAgICAgIGlmICghaXRlbSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ0lURU1fTk9UX0ZPVU5EJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gRGVsZXRlIHRoZSBmdWNraW5nIHRoZSBnaXZlbiBpdGVtIGlkLlxuICAgICAgYXdhaXQgSXRlbS5xdWVyeSgpLmZpbmRCeUlkKGl0ZW0uaWQpLmRlbGV0ZSgpO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaXZlIHRoZSBsaXN0IGl0ZW1zIHdpdGggcGFnaW5hdGlvbiBtZXRhLlxuICAgKi9cbiAgbGlzdEl0ZW1zOiB7XG4gICAgdmFsaWRhdGlvbjogW10sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgZmlsdGVyID0ge1xuICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBTS1U6ICcnLFxuICAgICAgICBhY2NvdW50X2lkOiBudWxsLFxuICAgICAgICBwYWdlX3NpemU6IDEwLFxuICAgICAgICBwYWdlOiAxLFxuICAgICAgICBzdGFydF9kYXRlOiBudWxsLFxuICAgICAgICBlbmRfZGF0ZTogbnVsbCxcbiAgICAgICAgLi4ucmVxLnF1ZXJ5LFxuICAgICAgfTtcblxuICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCBJdGVtLnF1ZXJ5KChxdWVyeSkgPT4ge1xuICAgICAgICBpZiAoZmlsdGVyLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgcXVlcnkud2hlcmUoJ2Rlc2NyaXB0aW9uJywgJ2xpa2UnLCBgJSR7ZmlsdGVyLmRlc2NyaXB0aW9ufSVgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmlsdGVyLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgcXVlcnkud2hlcmUoJ1NLVScsIGZpbHRlci5TS1kpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWx0ZXIubmFtZSkge1xuICAgICAgICAgIHF1ZXJ5LndoZXJlKCduYW1lJywgZmlsdGVyLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWx0ZXIuc3RhcnRfZGF0ZSkge1xuICAgICAgICAgIGNvbnN0IHN0YXJ0RGF0ZUZvcm1hdHRlZCA9IG1vbWVudChmaWx0ZXIuc3RhcnRfZGF0ZSkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOlNTJyk7XG4gICAgICAgICAgcXVlcnkud2hlcmUoJ2NyZWF0ZWRfYXQnLCAnPj0nLCBzdGFydERhdGVGb3JtYXR0ZWQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWx0ZXIuZW5kX2RhdGUpIHtcbiAgICAgICAgICBjb25zdCBlbmREYXRlRm9ybWF0dGVkID0gbW9tZW50KGZpbHRlci5lbmRfZGF0ZSkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOlNTJyk7XG4gICAgICAgICAgcXVlcnkud2hlcmUoJ2NyZWF0ZWRfYXQnLCAnPD0nLCBlbmREYXRlRm9ybWF0dGVkKTtcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2hQYWdlKHtcbiAgICAgICAgcGFnZV9zaXplOiBmaWx0ZXIucGFnZV9zaXplLFxuICAgICAgICBwYWdlOiBmaWx0ZXIucGFnZSxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoe1xuICAgICAgICBpdGVtczogaXRlbXMudG9KU09OKCksXG4gICAgICAgIHBhZ2luYXRpb246IGl0ZW1zLnBhZ2luYXRpb24sXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxufTtcbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgYm9keSwgcXVlcnksIHZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICdleHByZXNzLXZhbGlkYXRvcic7XG5pbXBvcnQgYXN5bmNNaWRkbGV3YXJlIGZyb20gJ0AvaHR0cC9taWRkbGV3YXJlL2FzeW5jTWlkZGxld2FyZSc7XG5pbXBvcnQgT3B0aW9uIGZyb20gJ0AvbW9kZWxzL09wdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyoqXG4gICAqIFJvdXRlciBjb25zdHJ1Y3Rvci5cbiAgICovXG4gIHJvdXRlcigpIHtcbiAgICBjb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuXG4gICAgcm91dGVyLnBvc3QoJy8nLFxuICAgICAgdGhpcy5zYXZlT3B0aW9ucy52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuc2F2ZU9wdGlvbnMuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmdldCgnLycsXG4gICAgICB0aGlzLmdldE9wdGlvbnMudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmdldFNldHRpbmdzKSk7XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTYXZlcyB0aGUgZ2l2ZW4gb3B0aW9ucyB0byB0aGUgc3RvcmFnZS5cbiAgICovXG4gIHNhdmVPcHRpb25zOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgYm9keSgnb3B0aW9ucycpLmlzQXJyYXkoKSxcbiAgICAgIGJvZHkoJ29wdGlvbnMuKi5rZXknKS5leGlzdHMoKSxcbiAgICAgIGJvZHkoJ29wdGlvbnMuKi52YWx1ZScpLmV4aXN0cygpLFxuICAgICAgYm9keSgnb3B0aW9ucy4qLmdyb3VwJykuZXhpc3RzKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAnVkFMSURBVElPTl9FUlJPUicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZm9ybSA9IHsgLi4ucmVxLmJvZHkgfTtcbiAgICAgIGNvbnN0IG9wdGlvbnNDb2xsZWN0aW9ucyA9IGF3YWl0IE9wdGlvbi5xdWVyeSgpO1xuXG4gICAgICBmb3JtLm9wdGlvbnMuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgICAgIG9wdGlvbnNDb2xsZWN0aW9ucy5zZXRNZXRhKG9wdGlvbi5rZXksIG9wdGlvbi52YWx1ZSwgb3B0aW9uLmdyb3VwKTtcbiAgICAgIH0pO1xuICAgICAgYXdhaXQgb3B0aW9uc0NvbGxlY3Rpb25zLnNhdmVNZXRhKCk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCgpO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIHRoZSBhcHBsaWNhdGlvbiBvcHRpb25zIGZyb20gdGhlIHN0b3JhZ2UuXG4gICAqL1xuICBnZXRPcHRpb25zOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcXVlcnkoJ2tleScpLm9wdGlvbmFsKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAnVkFMSURBVElPTl9FUlJPUicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3Qgb3B0aW9ucyA9IGF3YWl0IE9wdGlvbi5xdWVyeSgpO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmRzKHtcbiAgICAgICAgb3B0aW9uczogb3B0aW9ucy50b0FycmF5KCksXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxufTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCB7IGNoZWNrLCB2YWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InO1xuaW1wb3J0IHsgZGlmZmVyZW5jZSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgYXN5bmNNaWRkbGV3YXJlIGZyb20gJ0AvaHR0cC9taWRkbGV3YXJlL2FzeW5jTWlkZGxld2FyZSc7XG5pbXBvcnQgUm9sZSBmcm9tICdAL21vZGVscy9Sb2xlJztcbmltcG9ydCBQZXJtaXNzaW9uIGZyb20gJ0AvbW9kZWxzL1Blcm1pc3Npb24nO1xuaW1wb3J0IFJlc291cmNlIGZyb20gJ0AvbW9kZWxzL1Jlc291cmNlJztcbmltcG9ydCBrbmV4IGZyb20gJ0AvZGF0YWJhc2Uva25leCc7XG5cbmNvbnN0IEFjY2Vzc0NvbnRyb2xsU2NoZW1hID0gW1xuICB7XG4gICAgcmVzb3VyY2U6ICdpdGVtcycsXG4gICAgbGFiZWw6ICdwcm9kdWN0c19zZXJ2aWNlcycsXG4gICAgcGVybWlzc2lvbnM6IFsnY3JlYXRlJywgJ2VkaXQnLCAnZGVsZXRlJywgJ3ZpZXcnXSxcbiAgICBmdWxsQWNjZXNzOiB0cnVlLFxuICAgIG93bkNvbnRyb2w6IHRydWUsXG4gIH0sXG5dO1xuXG5jb25zdCBnZXRSZXNvdXJjZVNjaGVtYSA9IChyZXNvdXJjZSkgPT4gQWNjZXNzQ29udHJvbGxTY2hlbWFcbiAgLmZpbmQoKHNjaGVtYSkgPT4gc2NoZW1hLnJlc291cmNlID09PSByZXNvdXJjZSk7XG5cbmNvbnN0IGdldFJlc291cmNlUGVybWlzc2lvbnMgPSAocmVzb3VyY2UpID0+IHtcbiAgY29uc3QgZm91bmRSZXNvdXJjZSA9IGdldFJlc291cmNlU2NoZW1hKHJlc291cmNlKTtcbiAgcmV0dXJuIGZvdW5kUmVzb3VyY2UgPyBmb3VuZFJlc291cmNlLnBlcm1pc3Npb25zIDogW107XG59O1xuXG5jb25zdCBmaW5kTm90Rm91bmRSZXNvdXJjZXMgPSAocmVzb3VyY2VzU2x1Z3MpID0+IHtcbiAgY29uc3Qgc2NoZW1hUmVzb3VyY2VzU2x1Z3MgPSBBY2Nlc3NDb250cm9sbFNjaGVtYS5tYXAoKHMpID0+IHMucmVzb3VyY2UpO1xuICByZXR1cm4gZGlmZmVyZW5jZShyZXNvdXJjZXNTbHVncywgc2NoZW1hUmVzb3VyY2VzU2x1Z3MpO1xufTtcblxuY29uc3QgZmluZE5vdEZvdW5kUGVybWlzc2lvbnMgPSAocGVybWlzc2lvbnMsIHJlc291cmNlU2x1ZykgPT4ge1xuICBjb25zdCBzY2hlbWFQZXJtaXNzaW9ucyA9IGdldFJlc291cmNlUGVybWlzc2lvbnMocmVzb3VyY2VTbHVnKTtcbiAgcmV0dXJuIGRpZmZlcmVuY2UocGVybWlzc2lvbnMsIHNjaGVtYVBlcm1pc3Npb25zKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyoqXG4gICAqIFJvdXRlciBjb25zdHJ1Y3RvciBtZXRob2QuXG4gICAqL1xuICByb3V0ZXIoKSB7XG4gICAgY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcblxuICAgIHJvdXRlci5wb3N0KCcvJyxcbiAgICAgIHRoaXMubmV3Um9sZS52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMubmV3Um9sZS5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIucG9zdCgnLzppZCcsXG4gICAgICB0aGlzLmVkaXRSb2xlLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5lZGl0Um9sZS5oYW5kbGVyLmJpbmQodGhpcykpKTtcblxuICAgIHJvdXRlci5kZWxldGUoJy86aWQnLFxuICAgICAgdGhpcy5kZWxldGVSb2xlLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5kZWxldGVSb2xlLmhhbmRsZXIpKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgcm9sZS5cbiAgICovXG4gIG5ld1JvbGU6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBjaGVjaygnbmFtZScpLmV4aXN0cygpLnRyaW0oKS5lc2NhcGUoKSxcbiAgICAgIGNoZWNrKCdkZXNjcmlwdGlvbicpLm9wdGlvbmFsKCkudHJpbSgpLmVzY2FwZSgpLFxuICAgICAgY2hlY2soJ3Blcm1pc3Npb25zJykuaXNBcnJheSh7IG1pbjogMCB9KSxcbiAgICAgIGNoZWNrKCdwZXJtaXNzaW9ucy4qLnJlc291cmNlX3NsdWcnKS5leGlzdHMoKS53aGl0ZWxpc3QoJ15bYS16MC05XSsoPzotW2EtejAtOV0rKSokJyksXG4gICAgICBjaGVjaygncGVybWlzc2lvbnMuKi5wZXJtaXNzaW9ucycpLmlzQXJyYXkoeyBtaW46IDEgfSksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgeyBuYW1lLCBkZXNjcmlwdGlvbiwgcGVybWlzc2lvbnMgfSA9IHJlcS5ib2R5O1xuXG4gICAgICBjb25zdCByZXNvdXJjZXNTbHVncyA9IHBlcm1pc3Npb25zLm1hcCgocGVybSkgPT4gcGVybS5yZXNvdXJjZV9zbHVnKTtcbiAgICAgIGNvbnN0IHBlcm1pc3Npb25zU2x1Z3MgPSBbXTtcbiAgICAgIGNvbnN0IHJlc291cmNlc05vdEZvdW5kID0gZmluZE5vdEZvdW5kUmVzb3VyY2VzKHJlc291cmNlc1NsdWdzKTtcblxuICAgICAgY29uc3QgZXJyb3JSZWFzb25zID0gW107XG4gICAgICBjb25zdCBub3RGb3VuZFBlcm1pc3Npb25zID0gW107XG5cbiAgICAgIGlmIChyZXNvdXJjZXNOb3RGb3VuZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnUkVTT1VSQ0VfU0xVR19OT1RfRk9VTkQnLCBjb2RlOiAxMDAsIHJlc291cmNlczogcmVzb3VyY2VzTm90Rm91bmQsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcGVybWlzc2lvbnMuZm9yRWFjaCgocGVybSkgPT4ge1xuICAgICAgICBjb25zdCBhYmlsaXRpZXMgPSBwZXJtLnBlcm1pc3Npb25zLm1hcCgoYWJpbGl0eSkgPT4gYWJpbGl0eSk7XG5cbiAgICAgICAgLy8gR2V0cyB0aGUgbm90IGZvdW5kIHBlcm1pc3Npb25zIGluIHRoZSBzY2hlbWEuXG4gICAgICAgIGNvbnN0IG5vdEZvdW5kQWJpbGl0aWVzID0gZmluZE5vdEZvdW5kUGVybWlzc2lvbnMoYWJpbGl0aWVzLCBwZXJtLnJlc291cmNlX3NsdWcpO1xuICAgICAgICBcbiAgICAgICAgaWYgKG5vdEZvdW5kQWJpbGl0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBub3RGb3VuZFBlcm1pc3Npb25zLnB1c2goe1xuICAgICAgICAgICAgcmVzb3VyY2Vfc2x1ZzogcGVybS5yZXNvdXJjZV9zbHVnLFxuICAgICAgICAgICAgcGVybWlzc2lvbnM6IG5vdEZvdW5kQWJpbGl0aWVzLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHBlcm1zID0gcGVybS5wZXJtaXNzaW9ucyB8fCBbXTtcbiAgICAgICAgICBwZXJtcy5mb3JFYWNoKChwZXJtaXNzaW9uKSA9PiB7XG4gICAgICAgICAgICBpZiAocGVybXMuaW5kZXhPZihwZXJtaXNzaW9uKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgcGVybWlzc2lvbnNTbHVncy5wdXNoKHBlcm1pc3Npb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmIChub3RGb3VuZFBlcm1pc3Npb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdQRVJNSVNTSU9OU19TTFVHX05PVF9GT1VORCcsXG4gICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgIHBlcm1pc3Npb25zOiBub3RGb3VuZFBlcm1pc3Npb25zLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChlcnJvclJlYXNvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkUmVxdWVzdChudWxsLCB7IGVycm9yczogZXJyb3JSZWFzb25zIH0pO1xuICAgICAgfVxuICAgICAgLy8gUGVybWlzc2lvbnMuXG4gICAgICBjb25zdCBbcmVzb3VyY2VzQ29sbGVjdGlvbiwgcGVybXNDb2xsZWN0aW9uXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgUmVzb3VyY2UucXVlcnkoKHF1ZXJ5KSA9PiB7IHF1ZXJ5LndoZXJlSW4oJ25hbWUnLCByZXNvdXJjZXNTbHVncyk7IH0pLmZldGNoQWxsKCksXG4gICAgICAgIFBlcm1pc3Npb24ucXVlcnkoKHF1ZXJ5KSA9PiB7IHF1ZXJ5LndoZXJlSW4oJ25hbWUnLCBwZXJtaXNzaW9uc1NsdWdzKTsgfSkuZmV0Y2hBbGwoKSxcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBub3RTdG9yZWRSZXNvdXJjZXMgPSBkaWZmZXJlbmNlKFxuICAgICAgICByZXNvdXJjZXNTbHVncywgcmVzb3VyY2VzQ29sbGVjdGlvbi5tYXAoKHMpID0+IHMubmFtZSksXG4gICAgICApO1xuICAgICAgY29uc3Qgbm90U3RvcmVkUGVybWlzc2lvbnMgPSBkaWZmZXJlbmNlKFxuICAgICAgICBwZXJtaXNzaW9uc1NsdWdzLCBwZXJtc0NvbGxlY3Rpb24ubWFwKChwZXJtKSA9PiBwZXJtLnNsdWcpLFxuICAgICAgKTtcblxuICAgICAgY29uc3QgaW5zZXJ0VGhyZWFkID0gW107XG5cbiAgICAgIGlmIChub3RTdG9yZWRSZXNvdXJjZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBpbnNlcnRUaHJlYWQucHVzaChrbmV4KCdyZXNvdXJjZXMnKS5pbnNlcnQoW1xuICAgICAgICAgIC4uLm5vdFN0b3JlZFJlc291cmNlcy5tYXAoKHJlc291cmNlKSA9PiAoeyBuYW1lOiByZXNvdXJjZSB9KSksXG4gICAgICAgIF0pKTtcbiAgICAgIH1cbiAgICAgIGlmIChub3RTdG9yZWRQZXJtaXNzaW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGluc2VydFRocmVhZC5wdXNoKGtuZXgoJ3Blcm1pc3Npb25zJykuaW5zZXJ0KFtcbiAgICAgICAgICAuLi5ub3RTdG9yZWRQZXJtaXNzaW9ucy5tYXAoKHBlcm1pc3Npb24pID0+ICh7IG5hbWU6IHBlcm1pc3Npb24gfSkpLFxuICAgICAgICBdKSk7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKGluc2VydFRocmVhZCk7XG5cbiAgICAgIGNvbnN0IFtzdG9yZWRQZXJtaXNzaW9ucywgc3RvcmVkUmVzb3VyY2VzXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgUGVybWlzc2lvbi5xdWVyeSgocSkgPT4geyBxLndoZXJlSW4oJ25hbWUnLCBwZXJtaXNzaW9uc1NsdWdzKTsgfSkuZmV0Y2hBbGwoKSxcbiAgICAgICAgUmVzb3VyY2UucXVlcnkoKHEpID0+IHsgcS53aGVyZUluKCduYW1lJywgcmVzb3VyY2VzU2x1Z3MpOyB9KS5mZXRjaEFsbCgpLFxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IHN0b3JlZFJlc291cmNlc1NldCA9IG5ldyBNYXAoc3RvcmVkUmVzb3VyY2VzLm1hcCgocmVzb3VyY2UpID0+IFtcbiAgICAgICAgcmVzb3VyY2UuYXR0cmlidXRlcy5uYW1lLCByZXNvdXJjZS5hdHRyaWJ1dGVzLmlkLFxuICAgICAgXSkpO1xuICAgICAgY29uc3Qgc3RvcmVkUGVybWlzc2lvbnNTZXQgPSBuZXcgTWFwKHN0b3JlZFBlcm1pc3Npb25zLm1hcCgocGVybSkgPT4gW1xuICAgICAgICBwZXJtLmF0dHJpYnV0ZXMubmFtZSwgcGVybS5hdHRyaWJ1dGVzLmlkLFxuICAgICAgXSkpO1xuICAgICAgY29uc3Qgcm9sZSA9IFJvbGUuZm9yZ2UoeyBuYW1lLCBkZXNjcmlwdGlvbiB9KTtcblxuICAgICAgYXdhaXQgcm9sZS5zYXZlKCk7XG5cbiAgICAgIGNvbnN0IHJvbGVIYXNQZXJtcyA9IHBlcm1pc3Npb25zLm1hcCgocmVzb3VyY2UpID0+IHJlc291cmNlLnBlcm1pc3Npb25zLm1hcCgocGVybSkgPT4gKHtcbiAgICAgICAgcm9sZV9pZDogcm9sZS5pZCxcbiAgICAgICAgcmVzb3VyY2VfaWQ6IHN0b3JlZFJlc291cmNlc1NldC5nZXQocmVzb3VyY2UucmVzb3VyY2Vfc2x1ZyksXG4gICAgICAgIHBlcm1pc3Npb25faWQ6IHN0b3JlZFBlcm1pc3Npb25zU2V0LmdldChwZXJtKSxcbiAgICAgIH0pKSk7XG5cbiAgICAgIGlmIChyb2xlSGFzUGVybXMubGVuZ3RoID4gMCkge1xuICAgICAgICBhd2FpdCBrbmV4KCdyb2xlX2hhc19wZXJtaXNzaW9ucycpLmluc2VydChyb2xlSGFzUGVybXNbMF0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgaWQ6IHJvbGUuZ2V0KCdpZCcpIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIEVkaXQgdGhlIGdpdmUgcm9sZS5cbiAgICovXG4gIGVkaXRSb2xlOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgY2hlY2soJ25hbWUnKS5leGlzdHMoKS50cmltKCkuZXNjYXBlKCksXG4gICAgICBjaGVjaygnZGVzY3JpcHRpb24nKS5vcHRpb25hbCgpLnRyaW0oKS5lc2NhcGUoKSxcbiAgICAgIGNoZWNrKCdwZXJtaXNzaW9ucycpLmlzQXJyYXkoeyBtaW46IDAgfSksXG4gICAgICBjaGVjaygncGVybWlzc2lvbnMuKi5yZXNvdXJjZV9zbHVnJykuZXhpc3RzKCkud2hpdGVsaXN0KCdeW2EtejAtOV0rKD86LVthLXowLTldKykqJCcpLFxuICAgICAgY2hlY2soJ3Blcm1pc3Npb25zLioucGVybWlzc2lvbnMnKS5pc0FycmF5KHsgbWluOiAxIH0pLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBpZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IHJvbGUgPSBhd2FpdCBSb2xlLndoZXJlKCdpZCcsIGlkKS5mZXRjaCgpO1xuXG4gICAgICBpZiAoIXJvbGUpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKG51bGwsIHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdST0xFX05PVF9GT1VORCcsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgcGVybWlzc2lvbnMgfSA9IHJlcS5ib2R5O1xuICAgICAgY29uc3QgZXJyb3JSZWFzb25zID0gW107XG4gICAgICBjb25zdCBwZXJtaXNzaW9uc1NsdWdzID0gW107XG4gICAgICBjb25zdCBub3RGb3VuZFBlcm1pc3Npb25zID0gW107XG5cbiAgICAgIGNvbnN0IHJlc291cmNlc1NsdWdzID0gcGVybWlzc2lvbnMubWFwKChwZXJtKSA9PiBwZXJtLnJlc291cmNlX3NsdWcpO1xuICAgICAgY29uc3QgcmVzb3VyY2VzTm90Rm91bmQgPSBmaW5kTm90Rm91bmRSZXNvdXJjZXMocmVzb3VyY2VzU2x1Z3MpO1xuXG4gICAgICBpZiAocmVzb3VyY2VzTm90Rm91bmQubGVuZ3RoID4gMCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ1JFU09VUkNFX1NMVUdfTk9UX0ZPVU5EJyxcbiAgICAgICAgICBjb2RlOiAxMDAsXG4gICAgICAgICAgcmVzb3VyY2VzOiByZXNvdXJjZXNOb3RGb3VuZCxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHBlcm1pc3Npb25zLmZvckVhY2goKHBlcm0pID0+IHtcbiAgICAgICAgY29uc3QgYWJpbGl0aWVzID0gcGVybS5wZXJtaXNzaW9ucy5tYXAoKGFiaWxpdHkpID0+IGFiaWxpdHkpO1xuICAgICAgICAvLyBHZXRzIHRoZSBub3QgZm91bmQgcGVybWlzc2lvbnMgaW4gdGhlIHNjaGVtYS5cbiAgICAgICAgY29uc3Qgbm90Rm91bmRBYmlsaXRpZXMgPSBmaW5kTm90Rm91bmRQZXJtaXNzaW9ucyhhYmlsaXRpZXMsIHBlcm0ucmVzb3VyY2Vfc2x1Zyk7XG5cbiAgICAgICAgaWYgKG5vdEZvdW5kQWJpbGl0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBub3RGb3VuZFBlcm1pc3Npb25zLnB1c2goe1xuICAgICAgICAgICAgcmVzb3VyY2Vfc2x1ZzogcGVybS5yZXNvdXJjZV9zbHVnLCBwZXJtaXNzaW9uczogbm90Rm91bmRBYmlsaXRpZXMsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgcGVybXMgPSBwZXJtLnBlcm1pc3Npb25zIHx8IFtdO1xuICAgICAgICAgIHBlcm1zLmZvckVhY2goKHBlcm1pc3Npb24pID0+IHtcbiAgICAgICAgICAgIGlmIChwZXJtcy5pbmRleE9mKHBlcm1pc3Npb24pICE9PSAtMSkge1xuICAgICAgICAgICAgICBwZXJtaXNzaW9uc1NsdWdzLnB1c2gocGVybWlzc2lvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAobm90Rm91bmRQZXJtaXNzaW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnUEVSTUlTU0lPTlNfU0xVR19OT1RfRk9VTkQnLFxuICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICBwZXJtaXNzaW9uczogbm90Rm91bmRQZXJtaXNzaW9ucyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZXJyb3JSZWFzb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwgeyBlcnJvcnM6IGVycm9yUmVhc29ucyB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gUGVybWlzc2lvbnMuXG4gICAgICBjb25zdCBbcmVzb3VyY2VzQ29sbGVjdGlvbiwgcGVybXNDb2xsZWN0aW9uXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgUmVzb3VyY2UucXVlcnkoKHF1ZXJ5KSA9PiB7IHF1ZXJ5LndoZXJlSW4oJ25hbWUnLCByZXNvdXJjZXNTbHVncyk7IH0pLmZldGNoQWxsKCksXG4gICAgICAgIFBlcm1pc3Npb24ucXVlcnkoKHF1ZXJ5KSA9PiB7IHF1ZXJ5LndoZXJlSW4oJ25hbWUnLCBwZXJtaXNzaW9uc1NsdWdzKTsgfSkuZmV0Y2hBbGwoKSxcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBub3RTdG9yZWRSZXNvdXJjZXMgPSBkaWZmZXJlbmNlKFxuICAgICAgICByZXNvdXJjZXNTbHVncywgcmVzb3VyY2VzQ29sbGVjdGlvbi5tYXAoKHMpID0+IHMubmFtZSksXG4gICAgICApO1xuICAgICAgY29uc3Qgbm90U3RvcmVkUGVybWlzc2lvbnMgPSBkaWZmZXJlbmNlKFxuICAgICAgICBwZXJtaXNzaW9uc1NsdWdzLCBwZXJtc0NvbGxlY3Rpb24ubWFwKChwZXJtKSA9PiBwZXJtLnNsdWcpLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGluc2VydFRocmVhZCA9IFtdO1xuXG4gICAgICBpZiAobm90U3RvcmVkUmVzb3VyY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaW5zZXJ0VGhyZWFkLnB1c2goa25leCgncmVzb3VyY2VzJykuaW5zZXJ0KFtcbiAgICAgICAgICAuLi5ub3RTdG9yZWRSZXNvdXJjZXMubWFwKChyZXNvdXJjZSkgPT4gKHsgbmFtZTogcmVzb3VyY2UgfSkpLFxuICAgICAgICBdKSk7XG4gICAgICB9XG4gICAgICBpZiAobm90U3RvcmVkUGVybWlzc2lvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICBpbnNlcnRUaHJlYWQucHVzaChrbmV4KCdwZXJtaXNzaW9ucycpLmluc2VydChbXG4gICAgICAgICAgLi4ubm90U3RvcmVkUGVybWlzc2lvbnMubWFwKChwZXJtaXNzaW9uKSA9PiAoeyBuYW1lOiBwZXJtaXNzaW9uIH0pKSxcbiAgICAgICAgXSkpO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChpbnNlcnRUaHJlYWQpO1xuXG4gICAgICBjb25zdCBbc3RvcmVkUGVybWlzc2lvbnMsIHN0b3JlZFJlc291cmNlc10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIFBlcm1pc3Npb24ucXVlcnkoKHEpID0+IHsgcS53aGVyZUluKCduYW1lJywgcGVybWlzc2lvbnNTbHVncyk7IH0pLmZldGNoQWxsKCksXG4gICAgICAgIFJlc291cmNlLnF1ZXJ5KChxKSA9PiB7IHEud2hlcmVJbignbmFtZScsIHJlc291cmNlc1NsdWdzKTsgfSkuZmV0Y2hBbGwoKSxcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBzdG9yZWRSZXNvdXJjZXNTZXQgPSBuZXcgTWFwKHN0b3JlZFJlc291cmNlcy5tYXAoKHJlc291cmNlKSA9PiBbXG4gICAgICAgIHJlc291cmNlLmF0dHJpYnV0ZXMubmFtZSwgcmVzb3VyY2UuYXR0cmlidXRlcy5pZCxcbiAgICAgIF0pKTtcbiAgICAgIGNvbnN0IHN0b3JlZFBlcm1pc3Npb25zU2V0ID0gbmV3IE1hcChzdG9yZWRQZXJtaXNzaW9ucy5tYXAoKHBlcm0pID0+IFtcbiAgICAgICAgcGVybS5hdHRyaWJ1dGVzLm5hbWUsIHBlcm0uYXR0cmlidXRlcy5pZCxcbiAgICAgIF0pKTtcblxuICAgICAgYXdhaXQgcm9sZS5zYXZlKCk7XG5cblxuICAgICAgY29uc3Qgc2F2ZWRSb2xlSGFzUGVybXMgPSBhd2FpdCBrbmV4KCdyb2xlX2hhc19wZXJtaXNzaW9ucycpLndoZXJlKHtcbiAgICAgICAgcm9sZV9pZDogcm9sZS5pZCxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zb2xlLmxvZyhzYXZlZFJvbGVIYXNQZXJtcyk7XG5cbiAgICAgIC8vIGNvbnN0IHJvbGVIYXNQZXJtcyA9IHBlcm1pc3Npb25zLm1hcCgocmVzb3VyY2UpID0+IHJlc291cmNlLnBlcm1pc3Npb25zLm1hcCgocGVybSkgPT4gKHtcbiAgICAgIC8vICAgcm9sZV9pZDogcm9sZS5pZCxcbiAgICAgIC8vICAgcmVzb3VyY2VfaWQ6IHN0b3JlZFJlc291cmNlc1NldC5nZXQocmVzb3VyY2UucmVzb3VyY2Vfc2x1ZyksXG4gICAgICAvLyAgIHBlcm1pc3Npb25faWQ6IHN0b3JlZFBlcm1pc3Npb25zU2V0LmdldChwZXJtKSxcbiAgICAgIC8vIH0pKSk7XG5cbiAgICAgIC8vIGlmIChyb2xlSGFzUGVybXMubGVuZ3RoID4gMCkge1xuICAgICAgLy8gICBhd2FpdCBrbmV4KCdyb2xlX2hhc19wZXJtaXNzaW9ucycpLmluc2VydChyb2xlSGFzUGVybXNbMF0pO1xuICAgICAgLy8gfVxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgaWQ6IHJvbGUuZ2V0KCdpZCcpIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgZGVsZXRlUm9sZToge1xuICAgIHZhbGlkYXRpb246IFtdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCByb2xlID0gYXdhaXQgUm9sZS53aGVyZSgnaWQnLCBpZCkuZmV0Y2goKTtcblxuICAgICAgaWYgKCFyb2xlKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZCgpO1xuICAgICAgfVxuICAgICAgaWYgKHJvbGUuYXR0cmlidXRlcy5wcmVkZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWRSZXF1ZXN0KG51bGwsIHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdST0xFX1BSRURFRklORUQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCBrbmV4KCdyb2xlX2hhc19wZXJtaXNzaW9ucycpXG4gICAgICAgIC53aGVyZSgncm9sZV9pZCcsIHJvbGUuaWQpLmRlbGV0ZSh7IHJlcXVpcmU6IGZhbHNlIH0pO1xuXG4gICAgICBhd2FpdCByb2xlLmRlc3Ryb3koKTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKCk7XG4gICAgfSxcbiAgfSxcblxuICBnZXRSb2xlOiB7XG4gICAgdmFsaWRhdGlvbjogW10sXG4gICAgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKCk7XG4gICAgfSxcbiAgfSxcbn07XG4iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIHJvdXRlcigpIHtcbiAgICBjb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuXG4gICAgcmV0dXJuIHJvdXRlcjtcbiAgfSxcbn07XG4iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCB7IGNoZWNrLCB2YWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InO1xuaW1wb3J0IFVzZXIgZnJvbSAnQC9tb2RlbHMvVXNlcic7XG5pbXBvcnQgYXN5bmNNaWRkbGV3YXJlIGZyb20gJ0AvaHR0cC9taWRkbGV3YXJlL2FzeW5jTWlkZGxld2FyZSc7XG5pbXBvcnQgand0QXV0aCBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9qd3RBdXRoJztcbmltcG9ydCBBdXRob3JpemF0aW9uIGZyb20gJ0AvaHR0cC9taWRkbGV3YXJlL2F1dGhvcml6YXRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgLyoqXG4gICAqIFJvdXRlciBjb25zdHJ1Y3Rvci5cbiAgICovXG4gIHJvdXRlcigpIHtcbiAgICBjb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuICAgIGNvbnN0IHBlcm1pdCA9IEF1dGhvcml6YXRpb24oJ3VzZXJzJyk7XG5cbiAgICByb3V0ZXIudXNlKGp3dEF1dGgpO1xuXG4gICAgcm91dGVyLnBvc3QoJy8nLFxuICAgICAgcGVybWl0KCdjcmVhdGUnKSxcbiAgICAgIHRoaXMubmV3VXNlci52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMubmV3VXNlci5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIucG9zdCgnLzppZCcsXG4gICAgICBwZXJtaXQoJ2NyZWF0ZScsICdlZGl0JyksXG4gICAgICB0aGlzLmVkaXRVc2VyLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5lZGl0VXNlci5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvJyxcbiAgICAgIHBlcm1pdCgndmlldycpLFxuICAgICAgdGhpcy5saXN0VXNlcnMudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmxpc3RVc2Vycy5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvOmlkJyxcbiAgICAgIHBlcm1pdCgndmlldycpLFxuICAgICAgdGhpcy5nZXRVc2VyLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5nZXRVc2VyLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5kZWxldGUoJy86aWQnLFxuICAgICAgcGVybWl0KCdjcmVhdGUnLCAnZWRpdCcsICdkZWxldGUnKSxcbiAgICAgIHRoaXMuZGVsZXRlVXNlci52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZGVsZXRlVXNlci5oYW5kbGVyKSk7XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHVzZXIuXG4gICAqL1xuICBuZXdVc2VyOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgY2hlY2soJ2ZpcnN0X25hbWUnKS5leGlzdHMoKSxcbiAgICAgIGNoZWNrKCdsYXN0X25hbWUnKS5leGlzdHMoKSxcbiAgICAgIGNoZWNrKCdlbWFpbCcpLmV4aXN0cygpLmlzRW1haWwoKSxcbiAgICAgIGNoZWNrKCdwaG9uZV9udW1iZXInKS5vcHRpb25hbCgpLmlzTW9iaWxlUGhvbmUoKSxcbiAgICAgIGNoZWNrKCdwYXNzd29yZCcpLmlzTGVuZ3RoKHsgbWluOiA0IH0pLmV4aXN0cygpLmN1c3RvbSgodmFsdWUsIHsgcmVxIH0pID0+IHtcbiAgICAgICAgaWYgKHZhbHVlICE9PSByZXEuYm9keS5jb25maXJtX3Bhc3N3b3JkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUGFzc3dvcmRzIGRvbid0IG1hdGNoXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBjaGVjaygnc3RhdHVzJykuZXhpc3RzKCkuaXNCb29sZWFuKCkudG9Cb29sZWFuKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgeyBlbWFpbCwgcGhvbmVfbnVtYmVyOiBwaG9uZU51bWJlciB9ID0gcmVxLmJvZHk7XG5cbiAgICAgIGNvbnN0IGZvdW5kVXNlcnMgPSBhd2FpdCBVc2VyLnF1ZXJ5KChxdWVyeSkgPT4ge1xuICAgICAgICBxdWVyeS53aGVyZSgnZW1haWwnLCBlbWFpbCk7XG4gICAgICAgIHF1ZXJ5Lm9yV2hlcmUoJ3Bob25lX251bWJlcicsIHBob25lTnVtYmVyKTtcbiAgICAgIH0pLmZldGNoQWxsKCk7XG5cbiAgICAgIGNvbnN0IGZvdW5kVXNlckVtYWlsID0gZm91bmRVc2Vycy5maW5kKCh1KSA9PiB1LmF0dHJpYnV0ZXMuZW1haWwgPT09IGVtYWlsKTtcbiAgICAgIGNvbnN0IGZvdW5kVXNlclBob25lID0gZm91bmRVc2Vycy5maW5kKCh1KSA9PiB1LmF0dHJpYnV0ZXMucGhvbmVfbnVtYmVyID09PSBwaG9uZU51bWJlcik7XG5cbiAgICAgIGNvbnN0IGVycm9yUmVhc29ucyA9IFtdO1xuXG4gICAgICBpZiAoZm91bmRVc2VyRW1haWwpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnRU1BSUxfQUxSRUFEWV9FWElTVCcsIGNvZGU6IDEwMCB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZFVzZXJQaG9uZSkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdQSE9ORV9OVU1CRVJfQUxSRUFEWV9FWElTVCcsIGNvZGU6IDEyMCB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChlcnJvclJlYXNvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkUmVxdWVzdChudWxsLCB7IGVycm9yczogZXJyb3JSZWFzb25zIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB1c2VyID0gVXNlci5mb3JnZSh7XG4gICAgICAgIGZpcnN0X25hbWU6IHJlcS5ib2R5LmZpcnN0X25hbWUsXG4gICAgICAgIGxhc3RfbmFtZTogcmVxLmJvZHkubGFzdF9uYW1lLFxuICAgICAgICBlbWFpbDogcmVxLmJvZHkuZW1haWwsXG4gICAgICAgIHBob25lX251bWJlcjogcmVxLmJvZHkucGhvbmVfbnVtYmVyLFxuICAgICAgICBhY3RpdmU6IHJlcS5ib2R5LnN0YXR1cyxcbiAgICAgIH0pO1xuXG4gICAgICBhd2FpdCB1c2VyLnNhdmUoKTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgaWQ6IHVzZXIuZ2V0KCdpZCcpIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIEVkaXQgZGV0YWlscyBvZiB0aGUgZ2l2ZW4gdXNlci5cbiAgICovXG4gIGVkaXRVc2VyOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgY2hlY2soJ2ZpcnN0X25hbWUnKS5leGlzdHMoKSxcbiAgICAgIGNoZWNrKCdsYXN0X25hbWUnKS5leGlzdHMoKSxcbiAgICAgIGNoZWNrKCdlbWFpbCcpLmV4aXN0cygpLmlzRW1haWwoKSxcbiAgICAgIGNoZWNrKCdwaG9uZV9udW1iZXInKS5vcHRpb25hbCgpLmlzTW9iaWxlUGhvbmUoKSxcbiAgICAgIGNoZWNrKCdwYXNzd29yZCcpLmlzTGVuZ3RoKHsgbWluOiA0IH0pLmV4aXN0cygpLmN1c3RvbSgodmFsdWUsIHsgcmVxIH0pID0+IHtcbiAgICAgICAgaWYgKHZhbHVlICE9PSByZXEuYm9keS5jb25maXJtX3Bhc3N3b3JkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUGFzc3dvcmRzIGRvbid0IG1hdGNoXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBjaGVjaygnc3RhdHVzJykuZXhpc3RzKCkuaXNCb29sZWFuKCkudG9Cb29sZWFuKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBVc2VyLndoZXJlKCdpZCcsIGlkKS5mZXRjaCgpO1xuXG4gICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKCk7XG4gICAgICB9XG4gICAgICBjb25zdCB7IGVtYWlsLCBwaG9uZV9udW1iZXI6IHBob25lTnVtYmVyIH0gPSByZXEuYm9keTtcblxuICAgICAgY29uc3QgZm91bmRVc2VycyA9IGF3YWl0IFVzZXIucXVlcnkoKHF1ZXJ5KSA9PiB7XG4gICAgICAgIHF1ZXJ5LndoZXJlTm90KCdpZCcsIGlkKTtcbiAgICAgICAgcXVlcnkud2hlcmUoJ2VtYWlsJywgZW1haWwpO1xuICAgICAgICBxdWVyeS5vcldoZXJlKCdwaG9uZV9udW1iZXInLCBwaG9uZU51bWJlcik7XG4gICAgICB9KS5mZXRjaEFsbCgpO1xuXG4gICAgICBjb25zdCBmb3VuZFVzZXJFbWFpbCA9IGZvdW5kVXNlcnMuZmluZCgodSkgPT4gdS5hdHRyaWJ1ZXMuZW1haWwgPT09IGVtYWlsKTtcbiAgICAgIGNvbnN0IGZvdW5kVXNlclBob25lID0gZm91bmRVc2Vycy5maW5kKCh1KSA9PiB1LmF0dHJpYnVlcy5waG9uZV9udW1iZXIgPT09IHBob25lTnVtYmVyKTtcblxuICAgICAgY29uc3QgZXJyb3JSZWFzb25zID0gW107XG5cbiAgICAgIGlmIChmb3VuZFVzZXJFbWFpbCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdFTUFJTF9BTFJFQURZX0VYSVNUJywgY29kZTogMTAwIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGZvdW5kVXNlclBob25lKSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHsgdHlwZTogJ1BIT05FX05VTUJFUl9BTFJFQURZX0VYSVNUJywgY29kZTogMTIwIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGVycm9yUmVhc29ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiByZXMuYmFkUmVxdWVzdChudWxsLCB7IGVycm9yczogZXJyb3JSZWFzb25zIH0pO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCB1c2VyLnNhdmUoe1xuICAgICAgICBmaXJzdF9uYW1lOiByZXEuYm9keS5maXJzdF9uYW1lLFxuICAgICAgICBsYXN0X25hbWU6IHJlcS5ib2R5Lmxhc3RfbmFtZSxcbiAgICAgICAgZW1haWw6IHJlcS5ib2R5LmVtYWlsLFxuICAgICAgICBwaG9uZV9udW1iZXI6IHJlcS5ib2R5LnBob25lX251bWJlcixcbiAgICAgICAgc3RhdHVzOiByZXEuYm9keS5zdGF0dXMsXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKCk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogU29mdCBkZWxldGluZyB0aGUgZ2l2ZW4gdXNlci5cbiAgICovXG4gIGRlbGV0ZVVzZXI6IHtcbiAgICB2YWxpZGF0aW9uOiBbXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgdXNlciA9IGF3YWl0IFVzZXIud2hlcmUoJ2lkJywgaWQpLmZldGNoKCk7XG5cbiAgICAgIGlmICghdXNlcikge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ1VTRVJfTk9UX0ZPVU5EJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgdXNlci5kZXN0cm95KCk7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxuXG4gIGdldFVzZXI6IHtcbiAgICB2YWxpZGF0aW9uOiBbXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgdXNlciA9IGF3YWl0IFVzZXIud2hlcmUoJ2lkJywgaWQpLmZldGNoKCk7XG5cbiAgICAgIGlmICghdXNlcikge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgaXRlbTogdXNlci50b0pTT04oKSB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgbGlzdCBvZiB1c2Vycy5cbiAgICovXG4gIGxpc3RVc2Vyczoge1xuICAgIHZhbGlkYXRpb246IFtdLFxuICAgIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IGZpbHRlciA9IHtcbiAgICAgICAgZmlyc3RfbmFtZTogJycsXG4gICAgICAgIGxhc3RfbmFtZTogJycsXG4gICAgICAgIGVtYWlsOiAnJyxcbiAgICAgICAgcGhvbmVfbnVtYmVyOiAnJyxcblxuICAgICAgICBwYWdlX3NpemU6IDEwLFxuICAgICAgICBwYWdlOiAxLFxuICAgICAgICAuLi5yZXEucXVlcnksXG4gICAgICB9O1xuXG4gICAgICBjb25zdCB1c2VycyA9IFVzZXIucXVlcnkoKHF1ZXJ5KSA9PiB7XG4gICAgICAgIGlmIChmaWx0ZXIuZmlyc3RfbmFtZSkge1xuICAgICAgICAgIHF1ZXJ5LndoZXJlKCdmaXJzdF9uYW1lJywgZmlsdGVyLmZpcnN0X25hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWx0ZXIubGFzdF9uYW1lKSB7XG4gICAgICAgICAgcXVlcnkud2hlcmUoJ2xhc3RfbmFtZScsIGZpbHRlci5sYXN0X25hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWx0ZXIuZW1haWwpIHtcbiAgICAgICAgICBxdWVyeS53aGVyZSgnZW1haWwnLCBmaWx0ZXIuZW1haWwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWx0ZXIucGhvbmVfbnVtYmVyKSB7XG4gICAgICAgICAgcXVlcnkud2hlcmUoJ3Bob25lX251bWJlcicsIGZpbHRlci5waG9uZV9udW1iZXIpO1xuICAgICAgICB9XG4gICAgICB9KS5mZXRjaFBhZ2Uoe1xuICAgICAgICBwYWdlX3NpemU6IGZpbHRlci5wYWdlX3NpemUsXG4gICAgICAgIHBhZ2U6IGZpbHRlci5wYWdlLFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgIGl0ZW1zOiB1c2Vycy50b0pTT04oKSxcbiAgICAgICAgcGFnaW5hdGlvbjogdXNlcnMucGFnaW5hdGlvbixcbiAgICAgIH0pO1xuICAgIH0sXG4gIH0sXG59O1xuIiwiaW1wb3J0IHsgZGlmZmVyZW5jZSwgcGljayB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCB7IGNoZWNrLCBxdWVyeSwgdmFsaWRhdGlvblJlc3VsdCB9IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJztcbmltcG9ydCBhc3luY01pZGRsZXdhcmUgZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvYXN5bmNNaWRkbGV3YXJlJztcbmltcG9ydCBqd3RBdXRoIGZyb20gJ0AvaHR0cC9taWRkbGV3YXJlL2p3dEF1dGgnO1xuaW1wb3J0IFJlc291cmNlIGZyb20gJ0AvbW9kZWxzL1Jlc291cmNlJztcbmltcG9ydCBWaWV3IGZyb20gJ0AvbW9kZWxzL1ZpZXcnO1xuaW1wb3J0IFZpZXdSb2xlIGZyb20gJ0AvbW9kZWxzL1ZpZXdSb2xlJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICByZXNvdXJjZTogJ2l0ZW1zJyxcblxuICAvKipcbiAgICogUm91dGVyIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbiAgICByb3V0ZXIudXNlKGp3dEF1dGgpO1xuXG4gICAgcm91dGVyLnBvc3QoJy8nLFxuICAgICAgdGhpcy5jcmVhdGVWaWV3LnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5jcmVhdGVWaWV3LmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCcvOnZpZXdfaWQnLFxuICAgICAgdGhpcy5lZGl0Vmlldy52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZWRpdFZpZXcuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmRlbGV0ZSgnLzp2aWV3X2lkJyxcbiAgICAgIHRoaXMuZGVsZXRlVmlldy52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZGVsZXRlVmlldy5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvOnZpZXdfaWQnLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZ2V0Vmlldy5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvcmVzb3VyY2UvOnJlc291cmNlX25hbWUnLFxuICAgICAgdGhpcy5nZXRSZXNvdXJjZVZpZXdzLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5nZXRSZXNvdXJjZVZpZXdzLmhhbmRsZXIpKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIExpc3QgYWxsIHZpZXdzIHRoYXQgYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiByZXNvdXJjZS5cbiAgICovXG4gIGxpc3RWaWV3czoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHF1ZXJ5KCdyZXNvdXJjZV9uYW1lJykub3B0aW9uYWwoKS50cmltKCkuZXNjYXBlKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IHJlc291cmNlX2lkOiByZXNvdXJjZUlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3Qgdmlld3MgPSBhd2FpdCBWaWV3LndoZXJlKCdyZXNvdXJjZV9pZCcsIHJlc291cmNlSWQpLmZldGNoQWxsKCk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IHZpZXdzOiB2aWV3cy50b0pTT04oKSB9KTtcbiAgICB9LFxuICB9LFxuXG4gIGdldFZpZXc6IHtcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IHZpZXdfaWQ6IHZpZXdJZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IHZpZXcgPSBhd2FpdCBWaWV3LndoZXJlKCdpZCcsIHZpZXdJZCkuZmV0Y2goe1xuICAgICAgICB3aXRoUmVsYXRlZDogWydyZXNvdXJjZScsICdjb2x1bW5zJywgJ3ZpZXdSb2xlcyddLFxuICAgICAgfSk7XG5cbiAgICAgIGlmICghdmlldykge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ1JPTEVfTk9UX0ZPVU5EJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IC4uLnZpZXcudG9KU09OKCkgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogRGVsZXRlIHRoZSBnaXZlbiB2aWV3IG9mIHRoZSByZXNvdXJjZS5cbiAgICovXG4gIGRlbGV0ZVZpZXc6IHtcbiAgICB2YWxpZGF0aW9uOiBbXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IHZpZXdfaWQ6IHZpZXdJZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IHZpZXcgPSBhd2FpdCBWaWV3LnF1ZXJ5KCkuZmluZEJ5SWQodmlld0lkKTtcblxuICAgICAgaWYgKCF2aWV3KSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnVklFV19OT1RfRk9VTkQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKHZpZXcucHJlZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkUmVxdWVzdChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnUFJFREVGSU5FRF9WSUVXJywgY29kZTogMjAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgdmlldy4kcmVsYXRlZFF1ZXJ5KCd2aWV3Um9sZXMnKS5kZWxldGUoKSxcbiAgICAgICAgdmlldy4kcmVsYXRlZFF1ZXJ5KCdjb2x1bW5zJykuZGVsZXRlKCksXG4gICAgICBdKTtcbiAgICAgIGF3YWl0IHZpZXcuZGVsZXRlKCk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGlkOiB2aWV3LmdldCgnaWQnKSB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHZpZXcuXG4gICAqL1xuICBjcmVhdGVWaWV3OiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgY2hlY2soJ3Jlc291cmNlX25hbWUnKS5leGlzdHMoKS5lc2NhcGUoKS50cmltKCksXG4gICAgICBjaGVjaygnbGFiZWwnKS5leGlzdHMoKS5lc2NhcGUoKS50cmltKCksXG4gICAgICBjaGVjaygnY29sdW1ucycpLmV4aXN0cygpLmlzQXJyYXkoeyBtaW46IDEgfSksXG4gICAgICBjaGVjaygncm9sZXMnKS5pc0FycmF5KCksXG4gICAgICBjaGVjaygncm9sZXMuKi5maWVsZCcpLmV4aXN0cygpLmVzY2FwZSgpLnRyaW0oKSxcbiAgICAgIGNoZWNrKCdyb2xlcy4qLmNvbXBhcmF0b3InKS5leGlzdHMoKSxcbiAgICAgIGNoZWNrKCdyb2xlcy4qLnZhbHVlJykuZXhpc3RzKCksXG4gICAgICBjaGVjaygncm9sZXMuKi5pbmRleCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnY29sdW1ucycpLmV4aXN0cygpLmlzQXJyYXkoKSxcbiAgICAgIGNoZWNrKCdjb2x1bW5zLiouZmllbGQnKS5leGlzdHMoKS5lc2NhcGUoKS50cmltKCksXG4gICAgICBjaGVjaygnY29sdW1ucy4qLmluZGV4JykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmb3JtID0geyAuLi5yZXEuYm9keSB9O1xuICAgICAgY29uc3QgcmVzb3VyY2UgPSBhd2FpdCBSZXNvdXJjZS5xdWVyeSgpLndoZXJlKCduYW1lJywgZm9ybS5yZXNvdXJjZV9uYW1lKS5maXJzdCgpO1xuXG4gICAgICBpZiAoIXJlc291cmNlKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnUkVTT1VSQ0VfTk9UX0ZPVU5EJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVycm9yUmVhc29ucyA9IFtdO1xuICAgICAgY29uc3QgZmllbGRzU2x1Z3MgPSBmb3JtLnJvbGVzLm1hcCgocm9sZSkgPT4gcm9sZS5maWVsZCk7XG5cbiAgICAgIGNvbnN0IHJlc291cmNlRmllbGRzID0gYXdhaXQgcmVzb3VyY2UuJHJlbGF0ZWRRdWVyeSgnZmllbGRzJyk7XG4gICAgICBjb25zdCByZXNvdXJjZUZpZWxkc0tleXMgPSByZXNvdXJjZUZpZWxkcy5tYXAoKGYpID0+IGYuc2x1Zyk7XG5cbiAgICAgIC8vIFRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIHN0b3JlZCByZXNvdXJjZSBmaWVsZHMgYW5kIHN1Ym1pdCBmaWVsZHMga2V5cy5cbiAgICAgIGNvbnN0IG5vdEZvdW5kRmllbGRzID0gZGlmZmVyZW5jZShmaWVsZHNTbHVncywgcmVzb3VyY2VGaWVsZHNLZXlzKTtcblxuICAgICAgaWYgKG5vdEZvdW5kRmllbGRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnUkVTT1VSQ0VfRklFTERTX05PVF9FWElTVCcsIGNvZGU6IDEwMCwgZmllbGRzOiBub3RGb3VuZEZpZWxkcyB9KTtcbiAgICAgIH1cbiAgICAgIC8vIFRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIHN0b3JlZCByZXNvdXJjZSBmaWVsZHMgYW5kIHRoZSBzdWJtaXQgY29sdW1ucyBrZXlzLlxuICAgICAgY29uc3Qgbm90Rm91bmRDb2x1bW5zID0gZGlmZmVyZW5jZShmb3JtLmNvbHVtbnMsIHJlc291cmNlRmllbGRzS2V5cyk7XG5cbiAgICAgIGlmIChub3RGb3VuZENvbHVtbnMubGVuZ3RoID4gMCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdDT0xVTU5TX05PVF9FWElTVCcsIGNvZGU6IDIwMCwgY29sdW1uczogbm90Rm91bmRDb2x1bW5zIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGVycm9yUmVhc29ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWRSZXF1ZXN0KG51bGwsIHsgZXJyb3JzOiBlcnJvclJlYXNvbnMgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFNhdmUgdmlldyBkZXRhaWxzLlxuICAgICAgY29uc3QgdmlldyA9IGF3YWl0IFZpZXcucXVlcnkoKS5pbnNlcnQoe1xuICAgICAgICBuYW1lOiBmb3JtLmxhYmVsLFxuICAgICAgICBwcmVkZWZpbmVkOiBmYWxzZSxcbiAgICAgICAgcmVzb3VyY2VfaWQ6IHJlc291cmNlLmlkLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFNhdmUgdmlldyByb2xlcyBhc3luYyBvcGVyYXRpb25zLlxuICAgICAgY29uc3Qgc2F2ZVZpZXdSb2xlc09wZXJzID0gW107XG5cbiAgICAgIGZvcm0ucm9sZXMuZm9yRWFjaCgocm9sZSkgPT4ge1xuICAgICAgICBjb25zdCBmaWVsZE1vZGVsID0gcmVzb3VyY2VGaWVsZHMuZmluZCgoZikgPT4gZi5zbHVnID09PSByb2xlLmZpZWxkKTtcblxuICAgICAgICBjb25zdCBvcGVyID0gVmlld1JvbGUucXVlcnkoKS5pbnNlcnQoe1xuICAgICAgICAgIC4uLnBpY2socm9sZSwgWydjb21wYXJhdG9yJywgJ3ZhbHVlJywgJ2luZGV4J10pLFxuICAgICAgICAgIGZpZWxkX2lkOiBmaWVsZE1vZGVsLmlkLFxuICAgICAgICAgIHZpZXdfaWQ6IHZpZXcuaWQsXG4gICAgICAgIH0pO1xuICAgICAgICBzYXZlVmlld1JvbGVzT3BlcnMucHVzaChvcGVyKTtcbiAgICAgIH0pO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoc2F2ZVZpZXdSb2xlc09wZXJzKTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgaWQ6IHZpZXcuaWQgfSk7XG4gICAgfSxcbiAgfSxcblxuICBlZGl0Vmlldzoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCdsYWJlbCcpLmV4aXN0cygpLmVzY2FwZSgpLnRyaW0oKSxcbiAgICAgIGNoZWNrKCdjb2x1bW5zJykuaXNBcnJheSh7IG1pbjogMyB9KSxcbiAgICAgIGNoZWNrKCdyb2xlcycpLmlzQXJyYXkoKSxcbiAgICAgIGNoZWNrKCdyb2xlcy4qLmZpZWxkJykuZXhpc3RzKCkuZXNjYXBlKCkudHJpbSgpLFxuICAgICAgY2hlY2soJ3JvbGVzLiouY29tcGFyYXRvcicpLmV4aXN0cygpLFxuICAgICAgY2hlY2soJ3JvbGVzLioudmFsdWUnKS5leGlzdHMoKSxcbiAgICAgIGNoZWNrKCdyb2xlcy4qLmluZGV4JykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgdmlld19pZDogdmlld0lkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHZpZXcgPSBhd2FpdCBWaWV3LndoZXJlKCdpZCcsIHZpZXdJZCkuZmV0Y2goKTtcblxuICAgICAgaWYgKCF2aWV3KSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnUk9MRV9OT1RfRk9VTkQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxuXG4gIGdldFJlc291cmNlVmlld3M6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG5cbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcblxuICAgIH0sXG4gIH0sXG59O1xuIiwiLy8gaW1wb3J0IE9BdXRoMiBmcm9tICdAL2h0dHAvY29udHJvbGxlcnMvT0F1dGgyJztcbmltcG9ydCBBdXRoZW50aWNhdGlvbiBmcm9tICdAL2h0dHAvY29udHJvbGxlcnMvQXV0aGVudGljYXRpb24nO1xuaW1wb3J0IFVzZXJzIGZyb20gJ0AvaHR0cC9jb250cm9sbGVycy9Vc2Vycyc7XG5pbXBvcnQgUm9sZXMgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL1JvbGVzJztcbmltcG9ydCBJdGVtcyBmcm9tICdAL2h0dHAvY29udHJvbGxlcnMvSXRlbXMnO1xuaW1wb3J0IEl0ZW1DYXRlZ29yaWVzIGZyb20gJ0AvaHR0cC9jb250cm9sbGVycy9JdGVtQ2F0ZWdvcmllcyc7XG5pbXBvcnQgQWNjb3VudHMgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL0FjY291bnRzJztcbmltcG9ydCBBY2NvdW50T3BlbmluZ0JhbGFuY2UgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL0FjY291bnRPcGVuaW5nQmFsYW5jZSc7XG5pbXBvcnQgVmlld3MgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL1ZpZXdzJztcbmltcG9ydCBDdXN0b21GaWVsZHMgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL0ZpZWxkcyc7XG5pbXBvcnQgQWNjb3VudGluZyBmcm9tICdAL2h0dHAvY29udHJvbGxlcnMvQWNjb3VudGluZyc7XG5pbXBvcnQgRmluYW5jaWFsU3RhdGVtZW50cyBmcm9tICdAL2h0dHAvY29udHJvbGxlcnMvRmluYW5jaWFsU3RhdGVtZW50cyc7XG5pbXBvcnQgRXhwZW5zZXMgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL0V4cGVuc2VzJztcbmltcG9ydCBPcHRpb25zIGZyb20gJ0AvaHR0cC9jb250cm9sbGVycy9PcHRpb25zJztcbmltcG9ydCBCdWRnZXQgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL0J1ZGdldCc7XG5pbXBvcnQgQnVkZ2V0UmVwb3J0cyBmcm9tICdAL2h0dHAvY29udHJvbGxlcnMvQnVkZ2V0UmVwb3J0cyc7XG5pbXBvcnQgQ3VzdG9tZXJzIGZyb20gJ0AvaHR0cC9jb250cm9sbGVycy9DdXN0b21lcnMnO1xuaW1wb3J0IFN1cHBsaWVycyBmcm9tICdAL2h0dHAvY29udHJvbGxlcnMvU3VwcGxpZXJzJztcbmltcG9ydCBCaWxscyBmcm9tICdAL2h0dHAvY29udHJvbGxlcnMvQmlsbHMnO1xuaW1wb3J0IEN1cnJlbmN5QWRqdXN0bWVudCBmcm9tICcuL2NvbnRyb2xsZXJzL0N1cnJlbmN5QWRqdXN0bWVudCc7XG4vLyBpbXBvcnQgU2FsZXNSZXBvcnRzIGZyb20gJ0AvaHR0cC9jb250cm9sbGVycy9TYWxlc1JlcG9ydHMnO1xuLy8gaW1wb3J0IFB1cmNoYXNlc1JlcG9ydHMgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL1B1cmNoYXNlc1JlcG9ydHMnO1xuXG5leHBvcnQgZGVmYXVsdCAoYXBwKSA9PiB7XG4gIC8vIGFwcC51c2UoJy9hcGkvb2F1dGgyJywgT0F1dGgyLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS9hdXRoJywgQXV0aGVudGljYXRpb24ucm91dGVyKCkpO1xuICBhcHAudXNlKCcvYXBpL3VzZXJzJywgVXNlcnMucm91dGVyKCkpO1xuICBhcHAudXNlKCcvYXBpL3JvbGVzJywgUm9sZXMucm91dGVyKCkpO1xuICBhcHAudXNlKCcvYXBpL2FjY291bnRzJywgQWNjb3VudHMucm91dGVyKCkpO1xuICBhcHAudXNlKCcvYXBpL2FjY291bnRpbmcnLCBBY2NvdW50aW5nLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS9hY2NvdW50c19vcGVuaW5nX2JhbGFuY2VzJywgQWNjb3VudE9wZW5pbmdCYWxhbmNlLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS92aWV3cycsIFZpZXdzLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS9maWVsZHMnLCBDdXN0b21GaWVsZHMucm91dGVyKCkpO1xuICBhcHAudXNlKCcvYXBpL2l0ZW1zJywgSXRlbXMucm91dGVyKCkpO1xuICBhcHAudXNlKCcvYXBpL2l0ZW1fY2F0ZWdvcmllcycsIEl0ZW1DYXRlZ29yaWVzLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS9leHBlbnNlcycsIEV4cGVuc2VzLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS9maW5hbmNpYWxfc3RhdGVtZW50cycsIEZpbmFuY2lhbFN0YXRlbWVudHMucm91dGVyKCkpO1xuICBhcHAudXNlKCcvYXBpL29wdGlvbnMnLCBPcHRpb25zLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS9idWRnZXRfcmVwb3J0cycsIEJ1ZGdldFJlcG9ydHMucm91dGVyKCkpO1xuICAvLyBhcHAudXNlKCcvYXBpL2N1c3RvbWVycycsIEN1c3RvbWVycy5yb3V0ZXIoKSk7XG4gIC8vIGFwcC51c2UoJy9hcGkvc3VwcGxpZXJzJywgU3VwcGxpZXJzLnJvdXRlcigpKTtcbiAgLy8gYXBwLnVzZSgnL2FwaS9iaWxscycsIEJpbGxzLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS9idWRnZXQnLCBCdWRnZXQucm91dGVyKCkpO1xuICAvLyBhcHAudXNlKCcvYXBpL2N1cnJlbmN5X2FkanVzdG1lbnQnLCBDdXJyZW5jeUFkanVzdG1lbnQucm91dGVyKCkpO1xuICAvLyBhcHAudXNlKCcvYXBpL3JlcG9ydHMvc2FsZXMnLCBTYWxlc1JlcG9ydHMucm91dGVyKCkpO1xuICAvLyBhcHAudXNlKCcvYXBpL3JlcG9ydHMvcHVyY2hhc2VzJywgUHVyY2hhc2VzUmVwb3J0cy5yb3V0ZXIoKSk7XG59O1xuIiwiY29uc3QgYXN5bmNNaWRkbGV3YXJlID0gKGZuKSA9PiAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgUHJvbWlzZS5yZXNvbHZlKGZuKHJlcSwgcmVzLCBuZXh0KSlcbiAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICBuZXh0KGVycm9yKTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jTWlkZGxld2FyZTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIGNvbnNpc3RlbnQtcmV0dXJuICovXG5jb25zdCBhdXRob3JpemF0aW9uID0gKHJlc291cmNlTmFtZSkgPT4gKC4uLnBlcm1pc3Npb25zKSA9PiAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgY29uc3QgeyB1c2VyIH0gPSByZXE7XG4gIGNvbnN0IG9uRXJyb3IgPSAoKSA9PiB7XG4gICAgcmVzLmJvb20udW5hdXRob3JpemVkKCk7XG4gIH07XG4gIHVzZXIuaGFzUGVybWlzc2lvbnMocmVzb3VyY2VOYW1lLCBwZXJtaXNzaW9ucylcbiAgICAudGhlbigoYXV0aG9yaXplZCkgPT4ge1xuICAgICAgaWYgKCFhdXRob3JpemVkKSB7XG4gICAgICAgIHJldHVybiBvbkVycm9yKCk7XG4gICAgICB9XG4gICAgICBuZXh0KCk7XG4gICAgfSkuY2F0Y2gob25FcnJvcik7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhdXRob3JpemF0aW9uO1xuIiwiLyogZXNsaW50LWRpc2FibGUgY29uc2lzdGVudC1yZXR1cm4gKi9cbmltcG9ydCBqd3QgZnJvbSAnanNvbndlYnRva2VuJztcbmltcG9ydCBVc2VyIGZyb20gJ0AvbW9kZWxzL1VzZXInO1xuLy8gaW1wb3J0IEF1dGggZnJvbSAnQC9tb2RlbHMvQXV0aCc7XG5cbmNvbnN0IGF1dGhNaWRkbGV3YXJlID0gKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gIGNvbnN0IHsgSldUX1NFQ1JFVF9LRVkgfSA9IHByb2Nlc3MuZW52O1xuICBjb25zdCB0b2tlbiA9IHJlcS5oZWFkZXJzWyd4LWFjY2Vzcy10b2tlbiddIHx8IHJlcS5xdWVyeS50b2tlbjtcblxuICBjb25zdCBvbkVycm9yID0gKCkgPT4ge1xuICAgIC8vIEF1dGgubG9nZ2VkT3V0KCk7XG4gICAgcmVzLnN0YXR1cyg0MDEpLnNlbmQoe1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBtZXNzYWdlOiAndW5hdXRob3JpemVkJyxcbiAgICB9KTtcbiAgfTtcblxuICBpZiAoIXRva2VuKSB7XG4gICAgcmV0dXJuIG9uRXJyb3IoKTtcbiAgfVxuXG4gIGNvbnN0IHZlcmlmeSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBqd3QudmVyaWZ5KHRva2VuLCBKV1RfU0VDUkVUX0tFWSwgYXN5bmMgKGVycm9yLCBkZWNvZGVkKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlcnNjb3JlLWRhbmdsZVxuICAgICAgICByZXEudXNlciA9IGF3YWl0IFVzZXIucXVlcnkoKS5maW5kQnlJZChkZWNvZGVkLl9pZCk7XG4gICAgICAgIC8vIEF1dGguc2V0QXV0aGVudGljYXRlZFVzZXIocmVxLnVzZXIpO1xuXG4gICAgICAgIGlmICghcmVxLnVzZXIpIHtcbiAgICAgICAgICByZXR1cm4gb25FcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUoZGVjb2RlZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHZlcmlmeS50aGVuKCgpID0+IHsgbmV4dCgpOyB9KS5jYXRjaChvbkVycm9yKTtcbn07XG5leHBvcnQgZGVmYXVsdCBhdXRoTWlkZGxld2FyZTtcbiIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWV0YWJsZUNvbGxlY3Rpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm1ldGFkYXRhID0gW107XG4gICAgdGhpcy5LRVlfQ09MVU1OID0gJ2tleSc7XG4gICAgdGhpcy5WQUxVRV9DT0xVTU4gPSAndmFsdWUnO1xuICAgIHRoaXMuVFlQRV9DT0xVTU4gPSAndHlwZSc7XG4gICAgdGhpcy5tb2RlbCA9IG51bGw7XG4gICAgdGhpcy5leHRyYUNvbHVtbnMgPSBbXTtcblxuICAgIHRoaXMuZXh0cmFRdWVyeSA9IChxdWVyeSwgbWV0YSkgPT4ge1xuICAgICAgcXVlcnkud2hlcmUoJ2tleScsIG1ldGFbdGhpcy5LRVlfQ09MVU1OXSk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgbW9kZWwgb2YgdGhpcyBtZXRhZGF0YSBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0ge09iamVjdH0gbW9kZWwgLVxuICAgKi9cbiAgc2V0TW9kZWwobW9kZWwpIHtcbiAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gIH1cblxuICAvKipcbiAgICogRmluZCB0aGUgZ2l2ZW4gbWV0YWRhdGEga2V5LlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IC1cbiAgICogQHJldHVybiB7b2JqZWN0fSAtIE1ldGFkYXRhIG9iamVjdC5cbiAgICovXG4gIGZpbmRNZXRhKGtleSkge1xuICAgIHJldHVybiB0aGlzLmFsbE1ldGFkYXRhKCkuZmluZCgobWV0YSkgPT4gbWV0YS5rZXkgPT09IGtleSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYWxsIG1ldGFkYXRhLlxuICAgKi9cbiAgYWxsTWV0YWRhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0YWRhdGEuZmlsdGVyKChtZXRhKSA9PiAhbWV0YS5tYXJrQXNEZWxldGVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBtZXRhZGF0YSBvZiB0aGUgZ2l2ZW4ga2V5LlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IC1cbiAgICogQHBhcmFtIHtNaXhpZWR9IGRlZmF1bHRWYWx1ZSAtXG4gICAqL1xuICBnZXRNZXRhKGtleSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgY29uc3QgbWV0YWRhdGEgPSB0aGlzLmZpbmRNZXRhKGtleSk7XG4gICAgcmV0dXJuIG1ldGFkYXRhID8gbWV0YWRhdGEudmFsdWUgOiBkZWZhdWx0VmFsdWUgfHwgZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogTWFya2VzIHRoZSBtZXRhZGF0YSB0byBzaG91bGQgYmUgZGVsZXRlZC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSAtXG4gICAqL1xuICByZW1vdmVNZXRhKGtleSkge1xuICAgIGNvbnN0IG1ldGFkYXRhID0gdGhpcy5maW5kTWV0YShrZXkpO1xuXG4gICAgaWYgKG1ldGFkYXRhKSB7XG4gICAgICBtZXRhZGF0YS5tYXJrQXNEZWxldGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBtZXRhIGRhdGEgb2YgdGhlIGdpdmVuIGdyb3VwLlxuICAgKiBAcGFyYW0geyp9IGdyb3VwXG4gICAqL1xuICByZW1vdmVBbGxNZXRhKGdyb3VwID0gJ2RlZmF1bHQnKSB7XG4gICAgdGhpcy5tZXRhZGF0YSA9IHRoaXMubWV0YWRhdGEubWFwKChtZXRhKSA9PiAoe1xuICAgICAgLi4ubWV0YSxcbiAgICAgIG1hcmtBc0RlbGV0ZWQ6IHRydWUsXG4gICAgfSkpO1xuICB9XG5cbiAgc2V0RXh0cmFRdWVyeShjYWxsYmFjaykge1xuICAgIHRoaXMuZXh0cmFRdWVyeSA9IGNhbGxiYWNrO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgbWV0YSBkYXRhIHRvIHRoZSBzdGFjay5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSAtXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZSAtXG4gICAqL1xuICBzZXRNZXRhKGtleSwgdmFsdWUsIHBheWxvYWQpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShrZXkpKSB7XG4gICAgICBjb25zdCBtZXRhZGF0YSA9IGtleTtcblxuICAgICAgbWV0YWRhdGEuZm9yRWFjaCgobWV0YSkgPT4ge1xuICAgICAgICB0aGlzLnNldE1ldGEobWV0YS5rZXksIG1ldGEudmFsdWUpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1ldGFkYXRhID0gdGhpcy5maW5kTWV0YShrZXkpO1xuXG4gICAgaWYgKG1ldGFkYXRhKSB7XG4gICAgICBtZXRhZGF0YS52YWx1ZSA9IHZhbHVlO1xuICAgICAgbWV0YWRhdGEubWFya0FzVXBkYXRlZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWV0YWRhdGEucHVzaCh7XG4gICAgICAgIHZhbHVlLCBrZXksIC4uLnBheWxvYWQsIG1hcmtBc0luc2VydGVkOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNhdmVkIHRoZSBtb2RpZmllZC9kZWxldGVkIGFuZCBpbnNlcnRlZCBtZXRhZGF0YS5cbiAgICovXG4gIGFzeW5jIHNhdmVNZXRhKCkge1xuICAgIGNvbnN0IGluc2VydGVkID0gdGhpcy5tZXRhZGF0YS5maWx0ZXIoKG0pID0+IChtLm1hcmtBc0luc2VydGVkID09PSB0cnVlKSk7XG4gICAgY29uc3QgdXBkYXRlZCA9IHRoaXMubWV0YWRhdGEuZmlsdGVyKChtKSA9PiAobS5tYXJrQXNVcGRhdGVkID09PSB0cnVlKSk7XG4gICAgY29uc3QgZGVsZXRlZCA9IHRoaXMubWV0YWRhdGEuZmlsdGVyKChtKSA9PiAobS5tYXJrQXNEZWxldGVkID09PSB0cnVlKSk7XG4gICAgY29uc3Qgb3BlcnMgPSBbXTtcblxuICAgIGlmIChkZWxldGVkLmxlbmd0aCA+IDApIHtcbiAgICAgIGRlbGV0ZWQuZm9yRWFjaCgobWV0YSkgPT4ge1xuICAgICAgICBjb25zdCBkZWxldGVPcGVyID0gdGhpcy5tb2RlbC5xdWVyeSgpLmJlZm9yZVJ1bigocXVlcnksIHJlc3VsdCkgPT4ge1xuICAgICAgICAgIHRoaXMuZXh0cmFRdWVyeShxdWVyeSwgbWV0YSk7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSkuZGVsZXRlKCk7XG4gICAgICAgIG9wZXJzLnB1c2goZGVsZXRlT3Blcik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaW5zZXJ0ZWQuZm9yRWFjaCgobWV0YSkgPT4ge1xuICAgICAgY29uc3QgaW5zZXJ0T3BlciA9IHRoaXMubW9kZWwucXVlcnkoKS5pbnNlcnQoe1xuICAgICAgICBbdGhpcy5LRVlfQ09MVU1OXTogbWV0YS5rZXksXG4gICAgICAgIFt0aGlzLlZBTFVFX0NPTFVNTl06IG1ldGEudmFsdWUsXG4gICAgICAgIC4uLnRoaXMuZXh0cmFDb2x1bW5zLnJlZHVjZSgob2JqLCBjb2x1bW4pID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIG1ldGFbY29sdW1uXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG9ialtjb2x1bW5dID0gbWV0YVtjb2x1bW5dO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9LCB7fSksXG4gICAgICB9KTtcbiAgICAgIG9wZXJzLnB1c2goaW5zZXJ0T3Blcik7XG4gICAgfSk7XG4gICAgdXBkYXRlZC5mb3JFYWNoKChtZXRhKSA9PiB7XG4gICAgICBjb25zdCB1cGRhdGVPcGVyID0gdGhpcy5tb2RlbC5xdWVyeSgpLm9uQnVpbGQoKHF1ZXJ5KSA9PiB7XG4gICAgICAgIHRoaXMuZXh0cmFRdWVyeShxdWVyeSwgbWV0YSk7XG4gICAgICB9KS5wYXRjaCh7XG4gICAgICAgIFt0aGlzLlZBTFVFX0NPTFVNTl06IG1ldGEudmFsdWUsXG4gICAgICB9KTtcbiAgICAgIG9wZXJzLnB1c2godXBkYXRlT3Blcik7XG4gICAgfSk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwob3BlcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIHRoZSBtZXRhZGF0YSBmcm9tIHRoZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0ga2V5IC1cbiAgICogQHBhcmFtIHtCb29sZWFufSBmb3JjZSAtXG4gICAqL1xuICBhc3luYyBsb2FkKCkge1xuICAgIGNvbnN0IG1ldGFkYXRhID0gYXdhaXQgdGhpcy5xdWVyeSgpO1xuXG4gICAgY29uc3QgbWV0YWRhdGFBcnJheSA9IHRoaXMubWFwTWV0YWRhdGFDb2xsZWN0aW9uKG1ldGFkYXRhKTtcbiAgICBtZXRhZGF0YUFycmF5LmZvckVhY2goKG1ldGEpID0+IHtcbiAgICAgIHRoaXMubWV0YWRhdGEucHVzaChtZXRhKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3JtYXQgdGhlIG1ldGFkYXRhIGJlZm9yZSBzYXZpbmcgdG8gdGhlIGRhdGFiYXNlLlxuICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ8Qm9vbGVhbn0gdmFsdWUgLVxuICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVUeXBlIC1cbiAgICogQHJldHVybiB7U3RyaW5nfE51bWJlcnxCb29sZWFufSAtXG4gICAqL1xuICBzdGF0aWMgZm9ybWF0TWV0YVZhbHVlKHZhbHVlLCB2YWx1ZVR5cGUpIHtcbiAgICBsZXQgcGFyc2VkVmFsdWU7XG5cbiAgICBzd2l0Y2ggKHZhbHVlVHlwZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgcGFyc2VkVmFsdWUgPSBgJHt2YWx1ZX1gO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICBwYXJzZWRWYWx1ZSA9IHZhbHVlID8gJzEnIDogJzAnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2pzb24nOlxuICAgICAgICBwYXJzZWRWYWx1ZSA9IEpTT04uc3RyaW5naWZ5KHBhcnNlZFZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBwYXJzZWRWYWx1ZSA9IHZhbHVlO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlZFZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcHBpbmcgYW5kIHBhcnNlIG1ldGFkYXRhIHRvIGNvbGxlY3Rpb24gZW50cmllcy5cbiAgICogQHBhcmFtIHtNZXRhfSBhdHRyIC1cbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhcnNlVHlwZSAtXG4gICAqL1xuICBtYXBNZXRhZGF0YShhdHRyLCBwYXJzZVR5cGUgPSAncGFyc2UnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGtleTogYXR0clt0aGlzLktFWV9DT0xVTU5dLFxuICAgICAgdmFsdWU6IChwYXJzZVR5cGUgPT09ICdwYXJzZScpXG4gICAgICAgID8gTWV0YWJsZUNvbGxlY3Rpb24ucGFyc2VNZXRhVmFsdWUoXG4gICAgICAgICAgYXR0clt0aGlzLlZBTFVFX0NPTFVNTl0sXG4gICAgICAgICAgdGhpcy5UWVBFX0NPTFVNTiA/IGF0dHJbdGhpcy5UWVBFX0NPTFVNTl0gOiBmYWxzZSxcbiAgICAgICAgKVxuICAgICAgICA6IE1ldGFibGVDb2xsZWN0aW9uLmZvcm1hdE1ldGFWYWx1ZShcbiAgICAgICAgICBhdHRyW3RoaXMuVkFMVUVfQ09MVU1OXSxcbiAgICAgICAgICB0aGlzLlRZUEVfQ09MVU1OID8gYXR0clt0aGlzLlRZUEVfQ09MVU1OXSA6IGZhbHNlLFxuICAgICAgICApLFxuICAgICAgLi4udGhpcy5leHRyYUNvbHVtbnMubWFwKChleHRyYUNvbCkgPT4gKHtcbiAgICAgICAgW2V4dHJhQ29sXTogYXR0cltleHRyYUNvbF0gfHwgbnVsbCxcbiAgICAgIH0pKSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnNlIHRoZSBtZXRhZGF0YSB0byB0aGUgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIHtBcnJheX0gY29sbGVjdGlvbiAtXG4gICAqL1xuICBtYXBNZXRhZGF0YVRvQ29sbGVjdGlvbihtZXRhZGF0YSwgcGFyc2VUeXBlID0gJ3BhcnNlJykge1xuICAgIHJldHVybiBtZXRhZGF0YS5tYXAoKG1vZGVsKSA9PiB0aGlzLm1hcE1ldGFkYXRhVG9Db2xsZWN0aW9uKG1vZGVsLCBwYXJzZVR5cGUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIG1ldGFkYXRhIHRvIHRoZSBtZXRhYmxlIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSB7QXJyYXl9IG1ldGEgLVxuICAgKi9cbiAgZnJvbShtZXRhKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkobWV0YSkpIHtcbiAgICAgIG1ldGEuZm9yRWFjaCgobSkgPT4geyB0aGlzLmZyb20obSk7IH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLm1ldGFkYXRhLnB1c2gobWV0YSk7XG4gIH1cblxuXG4gIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0YWRhdGE7XG4gIH1cblxuICAvKipcbiAgICogU3RhdGljIG1ldGhvZCB0byBsb2FkIG1ldGFkYXRhIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0ge0FycmF5fSBtZXRhIFxuICAgKi9cbiAgc3RhdGljIGZyb20obWV0YSkge1xuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBuZXcgTWV0YWJsZUNvbGxlY3Rpb24oKTtcbiAgICBjb2xsZWN0aW9uLmZyb20obWV0YSk7XG5cbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfVxufVxuIiwiLyogZXNsaW50LWRpc2FibGUgZ2xvYmFsLXJlcXVpcmUgKi9cbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnb2JqZWN0aW9uJztcbmltcG9ydCB7IGZsYXR0ZW4gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IEJhc2VNb2RlbCBmcm9tICdAL21vZGVscy9Nb2RlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjY291bnQgZXh0ZW5kcyBCYXNlTW9kZWwge1xuICAvKipcbiAgICogVGFibGUgbmFtZVxuICAgKi9cbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICdhY2NvdW50cyc7XG4gIH1cblxuICAvKipcbiAgICogTW9kZWwgbW9kaWZpZXJzLlxuICAgKi9cbiAgc3RhdGljIGdldCBtb2RpZmllcnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbHRlckFjY291bnRUeXBlcyhxdWVyeSwgdHlwZXNJZHMpIHtcbiAgICAgICAgaWYgKHR5cGVzSWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBxdWVyeS53aGVyZUluKCdhY2NvdW5fdHlwZV9pZCcsIHR5cGVzSWRzKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGF0aW9uc2hpcCBtYXBwaW5nLlxuICAgKi9cbiAgc3RhdGljIGdldCByZWxhdGlvbk1hcHBpbmdzKCkge1xuICAgIGNvbnN0IEFjY291bnRUeXBlID0gcmVxdWlyZSgnQC9tb2RlbHMvQWNjb3VudFR5cGUnKTtcbiAgICBjb25zdCBBY2NvdW50QmFsYW5jZSA9IHJlcXVpcmUoJ0AvbW9kZWxzL0FjY291bnRCYWxhbmNlJyk7XG4gICAgY29uc3QgQWNjb3VudFRyYW5zYWN0aW9uID0gcmVxdWlyZSgnQC9tb2RlbHMvQWNjb3VudFRyYW5zYWN0aW9uJyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLyoqXG4gICAgICAgKiBBY2NvdW50IG1vZGVsIG1heSBiZWxvbmdzIHRvIGFjY291bnQgdHlwZS5cbiAgICAgICAqL1xuICAgICAgdHlwZToge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuQmVsb25nc1RvT25lUmVsYXRpb24sXG4gICAgICAgIG1vZGVsQ2xhc3M6IEFjY291bnRUeXBlLmRlZmF1bHQsXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAnYWNjb3VudHMuYWNjb3VudFR5cGVJZCcsXG4gICAgICAgICAgdG86ICdhY2NvdW50X3R5cGVzLmlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQWNjb3VudCBtb2RlbCBtYXkgaGFzIG1hbnkgYmFsYW5jZXMgYWNjb3VudHMuXG4gICAgICAgKi9cbiAgICAgIGJhbGFuY2U6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkhhc09uZVJlbGF0aW9uLFxuICAgICAgICBtb2RlbENsYXNzOiBBY2NvdW50QmFsYW5jZS5kZWZhdWx0LFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ2FjY291bnRzLmlkJyxcbiAgICAgICAgICB0bzogJ2FjY291bnRfYmFsYW5jZXMuYWNjb3VudElkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQWNjb3VudCBtb2RlbCBtYXkgaGFzIG1hbnkgdHJhbnNhY3Rpb25zLlxuICAgICAgICovXG4gICAgICB0cmFuc2FjdGlvbnM6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkhhc01hbnlSZWxhdGlvbixcbiAgICAgICAgbW9kZWxDbGFzczogQWNjb3VudFRyYW5zYWN0aW9uLmRlZmF1bHQsXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAnYWNjb3VudHMuaWQnLFxuICAgICAgICAgIHRvOiAnYWNjb3VudHNfdHJhbnNhY3Rpb25zLmFjY291bnRJZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgY29sbGVjdEpvdXJuYWxFbnRyaWVzKGFjY291bnRzKSB7XG4gICAgcmV0dXJuIGZsYXR0ZW4oYWNjb3VudHMubWFwKChhY2NvdW50KSA9PiBhY2NvdW50LnRyYW5zYWN0aW9ucy5tYXAoKHRyYW5zYWN0aW9uKSA9PiAoe1xuICAgICAgYWNjb3VudElkOiBhY2NvdW50LmlkLFxuICAgICAgLi4udHJhbnNhY3Rpb24sXG4gICAgICBhY2NvdW50Tm9ybWFsOiBhY2NvdW50LnR5cGUubm9ybWFsLFxuICAgIH0pKSkpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBNb2RlbCB9IGZyb20gJ29iamVjdGlvbic7XG5pbXBvcnQgQmFzZU1vZGVsIGZyb20gJ0AvbW9kZWxzL01vZGVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWNjb3VudEJhbGFuY2UgZXh0ZW5kcyBCYXNlTW9kZWwge1xuICAvKipcbiAgICogVGFibGUgbmFtZVxuICAgKi9cbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICdhY2NvdW50X2JhbGFuY2VzJztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxhdGlvbnNoaXAgbWFwcGluZy5cbiAgICovXG4gIHN0YXRpYyBnZXQgcmVsYXRpb25NYXBwaW5ncygpIHtcbiAgICBjb25zdCBBY2NvdW50ID0gcmVxdWlyZSgnQC9tb2RlbHMvQWNjb3VudCcpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFjY291bnQ6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkJlbG9uZ3NUb09uZVJlbGF0aW9uLFxuICAgICAgICBtb2RlbENsYXNzOiBBY2NvdW50LmRlZmF1bHQsXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAnYWNjb3VudF9iYWxhbmNlLmFjY291bnRfaWQnLFxuICAgICAgICAgIHRvOiAnYWNjb3VudHMuaWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgeyBNb2RlbCB9IGZyb20gJ29iamVjdGlvbic7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgQmFzZU1vZGVsIGZyb20gJ0AvbW9kZWxzL01vZGVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWNjb3VudFRyYW5zYWN0aW9uIGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWVcbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAnYWNjb3VudHNfdHJhbnNhY3Rpb25zJztcbiAgfVxuXG4gIC8qKlxuICAgKiBNb2RlbCBtb2RpZmllcnMuXG4gICAqL1xuICBzdGF0aWMgZ2V0IG1vZGlmaWVycygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZmlsdGVyQWNjb3VudHMocXVlcnksIGFjY291bnRzSWRzKSB7XG4gICAgICAgIGlmIChhY2NvdW50c0lkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcXVlcnkud2hlcmVJbignYWNjb3VudF9pZCcsIGFjY291bnRzSWRzKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZpbHRlclRyYW5zYWN0aW9uVHlwZXMocXVlcnksIHR5cGVzKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHR5cGVzKSAmJiB0eXBlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcXVlcnkud2hlcmVJbigncmVmZXJlbmNlX3R5cGUnLCB0eXBlcyk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHR5cGVzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHF1ZXJ5LndoZXJlKCdyZWZlcmVuY2VfdHlwZScsIHR5cGVzKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZpbHRlckRhdGVSYW5nZShxdWVyeSwgc3RhcnREYXRlLCBlbmREYXRlLCB0eXBlID0gJ2RheScpIHtcbiAgICAgICAgY29uc3QgZGF0ZUZvcm1hdCA9ICdZWVlZLU1NLUREIEhIOm1tOnNzJztcbiAgICAgICAgY29uc3QgZnJvbURhdGUgPSBtb21lbnQoc3RhcnREYXRlKS5zdGFydE9mKHR5cGUpLmZvcm1hdChkYXRlRm9ybWF0KTtcbiAgICAgICAgY29uc3QgdG9EYXRlID0gbW9tZW50KGVuZERhdGUpLmVuZE9mKHR5cGUpLmZvcm1hdChkYXRlRm9ybWF0KTtcblxuICAgICAgICBpZiAoc3RhcnREYXRlKSB7XG4gICAgICAgICAgcXVlcnkud2hlcmUoJ2RhdGUnLCAnPj0nLCBmcm9tRGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVuZERhdGUpIHtcbiAgICAgICAgICBxdWVyeS53aGVyZSgnZGF0ZScsICc8PScsIHRvRGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmaWx0ZXJBbW91bnRSYW5nZShxdWVyeSwgZnJvbUFtb3VudCwgdG9BbW91bnQpIHtcbiAgICAgICAgaWYgKGZyb21BbW91bnQpIHtcbiAgICAgICAgICBxdWVyeS5hbmRXaGVyZSgocSkgPT4ge1xuICAgICAgICAgICAgcS53aGVyZSgnY3JlZGl0JywgJz49JywgZnJvbUFtb3VudCk7XG4gICAgICAgICAgICBxLm9yV2hlcmUoJ2RlYml0JywgJz49JywgZnJvbUFtb3VudCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRvQW1vdW50KSB7XG4gICAgICAgICAgcXVlcnkuYW5kV2hlcmUoKHEpID0+IHtcbiAgICAgICAgICAgIHEud2hlcmUoJ2NyZWRpdCcsICc8PScsIHRvQW1vdW50KTtcbiAgICAgICAgICAgIHEub3JXaGVyZSgnZGViaXQnLCAnPD0nLCB0b0Ftb3VudCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBzdW1hdGlvbkNyZWRpdERlYml0KHF1ZXJ5KSB7XG4gICAgICAgIHF1ZXJ5LnN1bSgnY3JlZGl0IGFzIGNyZWRpdCcpO1xuICAgICAgICBxdWVyeS5zdW0oJ2RlYml0IGFzIGRlYml0Jyk7XG4gICAgICAgIHF1ZXJ5Lmdyb3VwQnkoJ2FjY291bnRfaWQnKTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxhdGlvbnNoaXAgbWFwcGluZy5cbiAgICovXG4gIHN0YXRpYyBnZXQgcmVsYXRpb25NYXBwaW5ncygpIHtcbiAgICBjb25zdCBBY2NvdW50ID0gcmVxdWlyZSgnQC9tb2RlbHMvQWNjb3VudCcpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFjY291bnQ6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkJlbG9uZ3NUb09uZVJlbGF0aW9uLFxuICAgICAgICBtb2RlbENsYXNzOiBBY2NvdW50LmRlZmF1bHQsXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAnYWNjb3VudHNfdHJhbnNhY3Rpb25zLmFjY291bnRJZCcsXG4gICAgICAgICAgdG86ICdhY2NvdW50cy5pZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cbiIsIi8vIGltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICdvYmplY3Rpb24nO1xuaW1wb3J0IEJhc2VNb2RlbCBmcm9tICdAL21vZGVscy9Nb2RlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjY291bnRUeXBlIGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWVcbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAnYWNjb3VudF90eXBlcyc7XG4gIH1cblxuICAvKipcbiAgICogUmVsYXRpb25zaGlwIG1hcHBpbmcuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHJlbGF0aW9uTWFwcGluZ3MoKSB7XG4gICAgY29uc3QgQWNjb3VudCA9IHJlcXVpcmUoJ0AvbW9kZWxzL0FjY291bnQnKTtcblxuICAgIHJldHVybiB7XG4gICAgICAvKipcbiAgICAgICAqIEFjY291bnQgdHlwZSBtYXkgaGFzIG1hbnkgYXNzb2NpYXRlZCBhY2NvdW50cy5cbiAgICAgICAqL1xuICAgICAgYWNjb3VudHM6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkhhc01hbnlSZWxhdGlvbixcbiAgICAgICAgbW9kZWxDbGFzczogQWNjb3VudC5kZWZhdWx0LFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ2FjY291bnRfdHlwZXMuaWQnLFxuICAgICAgICAgIHRvOiAnYWNjb3VudHMuYWNjb3VudFR5cGVJZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlTW9kZWwgZnJvbSAnQC9tb2RlbHMvTW9kZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdWRnZXQgZXh0ZW5kcyBCYXNlTW9kZWwge1xuICAvKipcbiAgICogVGFibGUgbmFtZVxuICAgKi9cbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICdidWRnZXRzJztcbiAgfVxuXG4gIHN0YXRpYyBnZXQgdmlydHVhbEF0dHJpYnV0ZXMoKSB7XG4gICAgcmV0dXJuIFsncmFuZ2VCeScsICdyYW5nZUluY3JlbWVudCddO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vZGVsIG1vZGlmaWVycy5cbiAgICovXG4gIHN0YXRpYyBnZXQgbW9kaWZpZXJzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBmaWx0ZXJCeVllYXIocXVlcnksIHllYXIpIHtcbiAgICAgICAgcXVlcnkud2hlcmUoJ3llYXInLCB5ZWFyKTtcbiAgICAgIH0sXG4gICAgICBmaWx0ZXJCeUluY29tZVN0YXRlbWVudChxdWVyeSkge1xuICAgICAgICBxdWVyeS53aGVyZSgnYWNjb3VudF90eXBlcycsICdpbmNvbWVfc3RhdGVtZW50Jyk7XG4gICAgICB9LFxuICAgICAgZmlsdGVyQnlQcm9maXRMb3NzKHF1ZXJ5KSB7XG4gICAgICAgIHF1ZXJ5LndoZXJlKCdhY2NvdW50c190eXBlcycsICdwcm9maXRfbG9zcycpO1xuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgZ2V0IHJhbmdlQnkoKSB7XG4gICAgc3dpdGNoICh0aGlzLnBlcmlvZCkge1xuICAgICAgY2FzZSAnaGFsZi15ZWFyJzpcbiAgICAgIGNhc2UgJ3F1YXJ0ZXInOlxuICAgICAgICByZXR1cm4gJ21vbnRoJztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB0aGlzLnBlcmlvZDtcbiAgICB9XG4gIH1cblxuICBnZXQgcmFuZ2VJbmNyZW1lbnQoKSB7XG4gICAgc3dpdGNoICh0aGlzLnBlcmlvZCkge1xuICAgICAgY2FzZSAnaGFsZi15ZWFyJzpcbiAgICAgICAgcmV0dXJuIDY7XG4gICAgICBjYXNlICdxdWFydGVyJzpcbiAgICAgICAgcmV0dXJuIDM7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG4gIH1cblxuICBnZXQgcmFuZ2VPZmZzZXQoKSB7XG4gICAgc3dpdGNoICh0aGlzLnBlcmlvZCkge1xuICAgICAgY2FzZSAnaGFsZi15ZWFyJzogcmV0dXJuIDU7XG4gICAgICBjYXNlICdxdWFydGVyJzogcmV0dXJuIDI7XG4gICAgICBkZWZhdWx0OiByZXR1cm4gMDtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlTW9kZWwgZnJvbSAnQC9tb2RlbHMvTW9kZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdWRnZXQgZXh0ZW5kcyBCYXNlTW9kZWwge1xuICAvKipcbiAgICogVGFibGUgbmFtZVxuICAgKi9cbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICdidWRnZXRfZW50cmllcyc7XG4gIH1cbn1cbiIsImltcG9ydCB7IE1vZGVsIH0gZnJvbSAnb2JqZWN0aW9uJztcbmltcG9ydCBCYXNlTW9kZWwgZnJvbSAnQC9tb2RlbHMvTW9kZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHBlbnNlIGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWVcbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAnZXhwZW5zZXMnO1xuICB9XG5cbiAgc3RhdGljIGdldCByZWZlcmVuY2VUeXBlKCkge1xuICAgIHJldHVybiAnRXhwZW5zZSc7XG4gIH1cblxuICAvKipcbiAgICogTW9kZWwgbW9kaWZpZXJzLlxuICAgKi9cbiAgc3RhdGljIGdldCBtb2RpZmllcnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbHRlckJ5RGF0ZVJhbmdlKHF1ZXJ5LCBzdGFydERhdGUsIGVuZERhdGUpIHtcbiAgICAgICAgaWYgKHN0YXJ0RGF0ZSkge1xuICAgICAgICAgIHF1ZXJ5LndoZXJlKCdkYXRlJywgJz49Jywgc3RhcnREYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW5kRGF0ZSkge1xuICAgICAgICAgIHF1ZXJ5LndoZXJlKCdkYXRlJywgJzw9JywgZW5kRGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmaWx0ZXJCeUFtb3VudFJhbmdlKHF1ZXJ5LCBmcm9tLCB0bykge1xuICAgICAgICBpZiAoZnJvbSkge1xuICAgICAgICAgIHF1ZXJ5LndoZXJlKCdhbW91bnQnLCAnPj0nLCBmcm9tKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG8pIHtcbiAgICAgICAgICBxdWVyeS53aGVyZSgnYW1vdW50JywgJzw9JywgdG8pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZmlsdGVyQnlFeHBlbnNlQWNjb3VudChxdWVyeSwgYWNjb3VudElkKSB7XG4gICAgICAgIGlmIChhY2NvdW50SWQpIHtcbiAgICAgICAgICBxdWVyeS53aGVyZSgnZXhwZW5zZV9hY2NvdW50X2lkJywgYWNjb3VudElkKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZpbHRlckJ5UGF5bWVudEFjY291bnQocXVlcnksIGFjY291bnRJZCkge1xuICAgICAgICBpZiAoYWNjb3VudElkKSB7XG4gICAgICAgICAgcXVlcnkud2hlcmUoJ3BheW1lbnRfYWNjb3VudF9pZCcsIGFjY291bnRJZCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxhdGlvbnNoaXAgbWFwcGluZy5cbiAgICovXG4gIHN0YXRpYyBnZXQgcmVsYXRpb25NYXBwaW5ncygpIHtcbiAgICBjb25zdCBBY2NvdW50ID0gcmVxdWlyZSgnQC9tb2RlbHMvQWNjb3VudCcpO1xuICAgIGNvbnN0IFVzZXIgPSByZXF1aXJlKCdAL21vZGVscy9Vc2VyJyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgcGF5bWVudEFjY291bnQ6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkJlbG9uZ3NUb09uZVJlbGF0aW9uLFxuICAgICAgICBtb2RlbENsYXNzOiBBY2NvdW50LmRlZmF1bHQsXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAnZXhwZW5zZXMucGF5bWVudEFjY291bnRJZCcsXG4gICAgICAgICAgdG86ICdhY2NvdW50cy5pZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuXG4gICAgICBleHBlbnNlQWNjb3VudDoge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuQmVsb25nc1RvT25lUmVsYXRpb24sXG4gICAgICAgIG1vZGVsQ2xhc3M6IEFjY291bnQuZGVmYXVsdCxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICdleHBlbnNlcy5leHBlbnNlQWNjb3VudElkJyxcbiAgICAgICAgICB0bzogJ2FjY291bnRzLmlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG5cbiAgICAgIHVzZXI6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkJlbG9uZ3NUb09uZVJlbGF0aW9uLFxuICAgICAgICBtb2RlbENsYXNzOiBVc2VyLmRlZmF1bHQsXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAnZXhwZW5zZXMudXNlcklkJyxcbiAgICAgICAgICB0bzogJ3VzZXJzLmlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTW9kZWwgfSBmcm9tICdvYmplY3Rpb24nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgQmFzZU1vZGVsIGZyb20gJ0AvbW9kZWxzL01vZGVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXRlbSBleHRlbmRzIEJhc2VNb2RlbCB7XG4gIC8qKlxuICAgKiBUYWJsZSBuYW1lXG4gICAqL1xuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ2l0ZW1zJztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxhdGlvbnNoaXAgbWFwcGluZy5cbiAgICovXG4gIHN0YXRpYyBnZXQgcmVsYXRpb25NYXBwaW5ncygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLyoqXG4gICAgICAgKiBJdGVtIG1heSBoYXMgbWFueSBtZXRhIGRhdGEuXG4gICAgICAgKi9cbiAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5IYXNNYW55UmVsYXRpb24sXG4gICAgICAgIG1vZGVsQmFzZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ0l0ZW1NZXRhZGF0YScpLFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ2l0ZW1zLmlkJyxcbiAgICAgICAgICB0bzogJ2l0ZW1zX21ldGFkYXRhLml0ZW1faWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBJdGVtIG1heSBiZWxvbmdzIHRvIGNhdGVvZ29yeSBtb2RlbC5cbiAgICAgICAqL1xuICAgICAgY2F0ZWdvcnk6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkJlbG9uZ3NUb09uZVJlbGF0aW9uLFxuICAgICAgICBtb2RlbEJhc2U6IHBhdGguam9pbihfX2Rpcm5hbWUsICdJdGVtQ2F0ZWdvcnknKSxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICdpdGVtcy5jYXRlZ29yeUlkJyxcbiAgICAgICAgICB0bzogJ2l0ZW1zX2NhdGVnb3JpZXMuaWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnb2JqZWN0aW9uJztcbmltcG9ydCBCYXNlTW9kZWwgZnJvbSAnQC9tb2RlbHMvTW9kZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJdGVtQ2F0ZWdvcnkgZXh0ZW5kcyBCYXNlTW9kZWwge1xuICAvKipcbiAgICogVGFibGUgbmFtZS5cbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAnaXRlbXNfY2F0ZWdvcmllcyc7XG4gIH1cblxuICAvKipcbiAgICogUmVsYXRpb25zaGlwIG1hcHBpbmcuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHJlbGF0aW9uTWFwcGluZ3MoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8qKlxuICAgICAgICogSXRlbSBjYXRlZ29yeSBtYXkgaGFzIG1hbnkgaXRlbXMuXG4gICAgICAgKi9cbiAgICAgIGl0ZW1zOiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5IYXNNYW55UmVsYXRpb24sXG4gICAgICAgIG1vZGVsQmFzZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ0l0ZW0nKSxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICdpdGVtc19jYXRlZ29yaWVzLml0ZW1faWQnLFxuICAgICAgICAgIHRvOiAnaXRlbXMuaWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZU1vZGVsIGZyb20gJ0AvbW9kZWxzL01vZGVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSm91cm5hbEVudHJ5IGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWUuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ21hbnVhbF9qb3VybmFscyc7XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlTW9kZWwgZnJvbSAnQC9tb2RlbHMvTW9kZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYW51YWxKb3VybmFsIGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWUuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ21hbnVhbF9qb3VybmFscyc7XG4gIH1cbn1cbiIsImltcG9ydCB7IE1vZGVsIH0gZnJvbSAnb2JqZWN0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9kZWxCYXNlIGV4dGVuZHMgTW9kZWwge1xuICBzdGF0aWMgZ2V0IGNvbGxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIEFycmF5O1xuICB9XG5cbiAgc3RhdGljIHF1ZXJ5KC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gc3VwZXIucXVlcnkoLi4uYXJncykucnVuQWZ0ZXIoKHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0KSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmZyb20ocmVzdWx0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IG1peGluIH0gZnJvbSAnb2JqZWN0aW9uJztcbmltcG9ydCBCYXNlTW9kZWwgZnJvbSAnQC9tb2RlbHMvTW9kZWwnO1xuaW1wb3J0IE1ldGFibGVDb2xsZWN0aW9uIGZyb20gJ0AvbGliL01ldGFibGUvTWV0YWJsZUNvbGxlY3Rpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPcHRpb24gZXh0ZW5kcyBtaXhpbihCYXNlTW9kZWwsIFttaXhpbl0pIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWUuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ29wdGlvbnMnO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIHRoZSBtb2RlbCBxdWVyeS5cbiAgICogQHBhcmFtICB7Li4uYW55fSBhcmdzIC1cbiAgICovXG4gIHN0YXRpYyBxdWVyeSguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHN1cGVyLnF1ZXJ5KC4uLmFyZ3MpLnJ1bkFmdGVyKChyZXN1bHQpID0+IHtcbiAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBNZXRhYmxlQ29sbGVjdGlvbikge1xuICAgICAgICByZXN1bHQuc2V0TW9kZWwoT3B0aW9uKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGNvbGxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIE1ldGFibGVDb2xsZWN0aW9uO1xuICB9XG59XG4iLCJpbXBvcnQgTW9kZWwgZnJvbSAnQC9tb2RlbHMvTW9kZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXNzd29yZFJlc2V0cyBleHRlbmRzIE1vZGVsIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWVcbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAncGFzc3dvcmRfcmVzZXRzJztcbiAgfVxufVxuIiwiaW1wb3J0IHsgTW9kZWwgfSBmcm9tICdvYmplY3Rpb24nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgQmFzZU1vZGVsIGZyb20gJ0AvbW9kZWxzL01vZGVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGVybWlzc2lvbiBleHRlbmRzIEJhc2VNb2RlbCB7XG4gIC8qKlxuICAgKiBUYWJsZSBuYW1lIG9mIFJvbGUgbW9kZWwuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3Blcm1pc3Npb25zJztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxhdGlvbnNoaXAgbWFwcGluZy5cbiAgICovXG4gIHN0YXRpYyBnZXQgcmVsYXRpb25NYXBwaW5ncygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLyoqXG4gICAgICAgKiBQZXJtaXNzaW9uIG1vZGVsIG1heSBiZWxvbmdzIHRvIHJvbGUgbW9kZWwuXG4gICAgICAgKi9cbiAgICAgIHJvbGU6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkJlbG9uZ3NUb09uZVJlbGF0aW9uLFxuICAgICAgICBtb2RlbEJhc2U6IHBhdGguam9pbihfX2Rpcm5hbWUsICdSb2xlJyksXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAncGVybWlzc2lvbnMucm9sZV9pZCcsXG4gICAgICAgICAgdG86ICdyb2xlcy5pZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuXG4gICAgICAvLyByZXNvdXJjZToge1xuICAgICAgLy8gICByZWxhdGlvbjogTW9kZWwuQmVsb25nc1RvT25lUmVsYXRpb24sXG4gICAgICAvLyAgIG1vZGVsQmFzZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ1Jlc291cmNlJyksXG4gICAgICAvLyAgIGpvaW46IHtcbiAgICAgIC8vICAgICBmcm9tOiAncGVybWlzc2lvbnMuJyxcbiAgICAgIC8vICAgICB0bzogJycsXG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH1cbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnb2JqZWN0aW9uJztcbmltcG9ydCBCYXNlTW9kZWwgZnJvbSAnQC9tb2RlbHMvTW9kZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXNvdXJjZSBleHRlbmRzIEJhc2VNb2RlbCB7XG4gIC8qKlxuICAgKiBUYWJsZSBuYW1lLlxuICAgKi9cbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICdyZXNvdXJjZXMnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRpbWVzdGFtcCBjb2x1bW5zLlxuICAgKi9cbiAgc3RhdGljIGdldCBoYXNUaW1lc3RhbXBzKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxhdGlvbnNoaXAgbWFwcGluZy5cbiAgICovXG4gIHN0YXRpYyBnZXQgcmVsYXRpb25NYXBwaW5ncygpIHtcbiAgICBjb25zdCBWaWV3ID0gcmVxdWlyZSgnQC9tb2RlbHMvVmlldycpO1xuICAgIGNvbnN0IFJlc291cmNlRmllbGQgPSByZXF1aXJlKCdAL21vZGVscy9SZXNvdXJjZUZpZWxkJyk7XG4gICAgY29uc3QgUGVybWlzc2lvbiA9IHJlcXVpcmUoJ0AvbW9kZWxzL1Blcm1pc3Npb24nKTtcblxuICAgIHJldHVybiB7XG4gICAgICAvKipcbiAgICAgICAqIFJlc291cmNlIG1vZGVsIG1heSBoYXMgbWFueSB2aWV3cy5cbiAgICAgICAqL1xuICAgICAgdmlld3M6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkhhc01hbnlSZWxhdGlvbixcbiAgICAgICAgbW9kZWxDbGFzczogVmlldy5kZWZhdWx0LFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ3Jlc291cmNlcy5pZCcsXG4gICAgICAgICAgdG86ICd2aWV3cy5yZXNvdXJjZUlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogUmVzb3VyY2UgbW9kZWwgbWF5IGhhcyBtYW55IGZpZWxkcy5cbiAgICAgICAqL1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5IYXNNYW55UmVsYXRpb24sXG4gICAgICAgIG1vZGVsQ2xhc3M6IFJlc291cmNlRmllbGQuZGVmYXVsdCxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICdyZXNvdXJjZXMuaWQnLFxuICAgICAgICAgIHRvOiAncmVzb3VyY2VfZmllbGRzLnJlc291cmNlSWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBSZXNvdXJjZSBtb2RlbCBtYXkgaGFzIG1hbnkgYXNzb2NpYXRlZCBwZXJtaXNzaW9ucy5cbiAgICAgICAqL1xuICAgICAgcGVybWlzc2lvbnM6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLk1hbnlUb01hbnlSZWxhdGlvbixcbiAgICAgICAgbW9kZWxDbGFzczogUGVybWlzc2lvbi5kZWZhdWx0LFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ3Jlc291cmNlcy5pZCcsXG4gICAgICAgICAgdGhyb3VnaDoge1xuICAgICAgICAgICAgZnJvbTogJ3JvbGVfaGFzX3Blcm1pc3Npb25zLnJlc291cmNlSWQnLFxuICAgICAgICAgICAgdG86ICdyb2xlX2hhc19wZXJtaXNzaW9ucy5wZXJtaXNzaW9uSWQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdG86ICdwZXJtaXNzaW9ucy5pZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cbiIsImltcG9ydCB7IHNuYWtlQ2FzZSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJ29iamVjdGlvbic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBCYXNlTW9kZWwgZnJvbSAnQC9tb2RlbHMvTW9kZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXNvdXJjZUZpZWxkIGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWUuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3Jlc291cmNlX2ZpZWxkcyc7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGpzb25BdHRyaWJ1dGVzKCkge1xuICAgIHJldHVybiBbJ29wdGlvbnMnXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb2RlbCBtb2RpZmllcnMuXG4gICAqL1xuICBzdGF0aWMgZ2V0IG1vZGlmaWVycygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgd2hlcmVOb3RQcmVkZWZpbmVkKHF1ZXJ5KSB7XG4gICAgICAgIHF1ZXJ5LndoZXJlTm90KCdwcmVkZWZpbmVkJywgdHJ1ZSk7XG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVGltZXN0YW1wIGNvbHVtbnMuXG4gICAqL1xuICBzdGF0aWMgZ2V0IGhhc1RpbWVzdGFtcHMoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFZpcnR1YWwgYXR0cmlidXRlcy5cbiAgICovXG4gIHN0YXRpYyBnZXQgdmlydHVhbEF0dHJpYnV0ZXMoKSB7XG4gICAgcmV0dXJuIFsna2V5J107XG4gIH1cblxuICAvKipcbiAgICogUmVzb3VyY2UgZmllbGQga2V5LlxuICAgKi9cbiAga2V5KCkge1xuICAgIHJldHVybiBzbmFrZUNhc2UodGhpcy5sYWJlbE5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGF0aW9uc2hpcCBtYXBwaW5nLlxuICAgKi9cbiAgc3RhdGljIGdldCByZWxhdGlvbk1hcHBpbmdzKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvKipcbiAgICAgICAqIFJlc291cmNlIGZpZWxkIG1heSBiZWxvbmdzIHRvIHJlc291cmNlIG1vZGVsLlxuICAgICAgICovXG4gICAgICByZXNvdXJjZToge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuQmVsb25nc1RvT25lUmVsYXRpb24sXG4gICAgICAgIG1vZGVsQmFzZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ1Jlc291cmNlJyksXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAncmVzb3VyY2VfZmllbGRzLnJlc291cmNlX2lkJyxcbiAgICAgICAgICB0bzogJ3Jlc291cmNlcy5pZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cbiIsImltcG9ydCB7IE1vZGVsIH0gZnJvbSAnb2JqZWN0aW9uJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEJhc2VNb2RlbCBmcm9tICdAL21vZGVscy9Nb2RlbCc7XG5pbXBvcnQgUmVzb3VyY2VGaWVsZE1ldGFkYXRhQ29sbGVjdGlvbiBmcm9tICdAL2NvbGxlY3Rpb24vUmVzb3VyY2VGaWVsZE1ldGFkYXRhQ29sbGVjdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc291cmNlRmllbGRNZXRhZGF0YSBleHRlbmRzIEJhc2VNb2RlbCB7XG4gIC8qKlxuICAgKiBUYWJsZSBuYW1lLlxuICAgKi9cbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICdyZXNvdXJjZV9jdXN0b21fZmllbGRzX21ldGFkYXRhJztcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZSB0aGUgcmVzb3VyY2UgZmllbGQgbWV0YWRhdGEgY29sbGVjdGlvbi5cbiAgICovXG4gIHN0YXRpYyBnZXQgY29sbGVjdGlvbigpIHtcbiAgICByZXR1cm4gUmVzb3VyY2VGaWVsZE1ldGFkYXRhQ29sbGVjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxhdGlvbnNoaXAgbWFwcGluZy5cbiAgICovXG4gIHN0YXRpYyBnZXQgcmVsYXRpb25NYXBwaW5ncygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLyoqXG4gICAgICAgKiBSZXNvdXJjZSBmaWVsZCBtYXkgYmVsb25ncyB0byByZXNvdXJjZSBtb2RlbC5cbiAgICAgICAqL1xuICAgICAgcmVzb3VyY2U6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkJlbG9uZ3NUb09uZVJlbGF0aW9uLFxuICAgICAgICBtb2RlbEJhc2U6IHBhdGguam9pbihfX2Rpcm5hbWUsICdSZXNvdXJjZScpLFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ3Jlc291cmNlX2ZpZWxkcy5yZXNvdXJjZV9pZCcsXG4gICAgICAgICAgdG86ICdyZXNvdXJjZXMuaWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgeyBNb2RlbCB9IGZyb20gJ29iamVjdGlvbic7XG5pbXBvcnQgQmFzZU1vZGVsIGZyb20gJ0AvbW9kZWxzL01vZGVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm9sZSBleHRlbmRzIEJhc2VNb2RlbCB7XG4gIC8qKlxuICAgKiBUYWJsZSBuYW1lIG9mIFJvbGUgbW9kZWwuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3JvbGVzJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaW1lc3RhbXAgY29sdW1ucy5cbiAgICovXG4gIHN0YXRpYyBnZXQgaGFzVGltZXN0YW1wcygpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVsYXRpb25zaGlwIG1hcHBpbmcuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHJlbGF0aW9uTWFwcGluZ3MoKSB7XG4gICAgY29uc3QgUGVybWlzc2lvbiA9IHJlcXVpcmUoJ0AvbW9kZWxzL1Blcm1pc3Npb24nKTtcbiAgICBjb25zdCBSZXNvdXJjZSA9IHJlcXVpcmUoJ0AvbW9kZWxzL1Jlc291cmNlJyk7XG4gICAgY29uc3QgVXNlciA9IHJlcXVpcmUoJ0AvbW9kZWxzL1VzZXInKTtcblxuICAgIHJldHVybiB7XG4gICAgICAvKipcbiAgICAgICAqIFJvbGUgbWF5IGhhcyBtYW55IHBlcm1pc3Npb25zLlxuICAgICAgICovXG4gICAgICBwZXJtaXNzaW9uczoge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuTWFueVRvTWFueVJlbGF0aW9uLFxuICAgICAgICBtb2RlbENsYXNzOiBQZXJtaXNzaW9uLmRlZmF1bHQsXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAncm9sZXMuaWQnLFxuICAgICAgICAgIHRocm91Z2g6IHtcbiAgICAgICAgICAgIGZyb206ICdyb2xlX2hhc19wZXJtaXNzaW9ucy5yb2xlSWQnLFxuICAgICAgICAgICAgdG86ICdyb2xlX2hhc19wZXJtaXNzaW9ucy5wZXJtaXNzaW9uSWQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdG86ICdwZXJtaXNzaW9ucy5pZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFJvbGUgbWF5IGhhcyBtYW55IHJlc291cmNlcy5cbiAgICAgICAqL1xuICAgICAgcmVzb3VyY2VzOiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5NYW55VG9NYW55UmVsYXRpb24sXG4gICAgICAgIG1vZGVsQ2xhc3M6IFJlc291cmNlLmRlZmF1bHQsXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAncm9sZXMuaWQnLFxuICAgICAgICAgIHRocm91Z2g6IHtcbiAgICAgICAgICAgIGZyb206ICdyb2xlX2hhc19wZXJtaXNzaW9ucy5yb2xlSWQnLFxuICAgICAgICAgICAgdG86ICdyb2xlX2hhc19wZXJtaXNzaW9ucy5yZXNvdXJjZUlkJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRvOiAncmVzb3VyY2VzLmlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogUm9sZSBtYXkgaGFzIG1hbnkgYXNzb2NpYXRlZCB1c2Vycy5cbiAgICAgICAqL1xuICAgICAgdXNlcnM6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLk1hbnlUb01hbnlSZWxhdGlvbixcbiAgICAgICAgbW9kZWxDbGFzczogVXNlci5kZWZhdWx0LFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ3JvbGVzLmlkJyxcbiAgICAgICAgICB0aHJvdWdoOiB7XG4gICAgICAgICAgICBmcm9tOiAndXNlcl9oYXNfcm9sZXMucm9sZUlkJyxcbiAgICAgICAgICAgIHRvOiAndXNlcl9oYXNfcm9sZXMudXNlcklkJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRvOiAndXNlcnMuaWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgYmNyeXB0IGZyb20gJ2JjcnlwdGpzJztcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnb2JqZWN0aW9uJztcbmltcG9ydCBCYXNlTW9kZWwgZnJvbSAnQC9tb2RlbHMvTW9kZWwnO1xuLy8gaW1wb3J0IFBlcm1pc3Npb25zU2VydmljZSBmcm9tICdAL3NlcnZpY2VzL1Blcm1pc3Npb25zU2VydmljZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVzZXIgZXh0ZW5kcyBCYXNlTW9kZWwge1xuICAvLyAuLi5QZXJtaXNzaW9uc1NlcnZpY2VcblxuICAvKipcbiAgICogVGFibGUgbmFtZVxuICAgKi9cbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICd1c2Vycyc7XG4gIH1cblxuICAvKipcbiAgICogUmVsYXRpb25zaGlwIG1hcHBpbmcuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHJlbGF0aW9uTWFwcGluZ3MoKSB7XG4gICAgY29uc3QgUm9sZSA9IHJlcXVpcmUoJ0AvbW9kZWxzL1JvbGUnKTtcblxuICAgIHJldHVybiB7XG4gICAgICByb2xlczoge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuTWFueVRvTWFueVJlbGF0aW9uLFxuICAgICAgICBtb2RlbENsYXNzOiBSb2xlLmRlZmF1bHQsXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAndXNlcnMuaWQnLFxuICAgICAgICAgIHRocm91Z2g6IHtcbiAgICAgICAgICAgIGZyb206ICd1c2VyX2hhc19yb2xlcy51c2VySWQnLFxuICAgICAgICAgICAgdG86ICd1c2VyX2hhc19yb2xlcy5yb2xlSWQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdG86ICdyb2xlcy5pZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVmVyaWZ5IHRoZSBwYXNzd29yZCBvZiB0aGUgdXNlci5cbiAgICogQHBhcmFtICB7U3RyaW5nfSBwYXNzd29yZCAtIFRoZSBnaXZlbiBwYXNzd29yZC5cbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIHZlcmlmeVBhc3N3b3JkKHBhc3N3b3JkKSB7XG4gICAgcmV0dXJuIGJjcnlwdC5jb21wYXJlU3luYyhwYXNzd29yZCwgdGhpcy5wYXNzd29yZCk7XG4gIH1cbn1cbiIsImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICdvYmplY3Rpb24nO1xuaW1wb3J0IEJhc2VNb2RlbCBmcm9tICdAL21vZGVscy9Nb2RlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXcgZXh0ZW5kcyBCYXNlTW9kZWwge1xuICAvKipcbiAgICogVGFibGUgbmFtZS5cbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAndmlld3MnO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGF0aW9uc2hpcCBtYXBwaW5nLlxuICAgKi9cbiAgc3RhdGljIGdldCByZWxhdGlvbk1hcHBpbmdzKCkge1xuICAgIGNvbnN0IFJlc291cmNlID0gcmVxdWlyZSgnQC9tb2RlbHMvUmVzb3VyY2UnKTtcbiAgICBjb25zdCBWaWV3Q29sdW1uID0gcmVxdWlyZSgnQC9tb2RlbHMvVmlld0NvbHVtbicpO1xuICAgIGNvbnN0IFZpZXdSb2xlID0gcmVxdWlyZSgnQC9tb2RlbHMvVmlld1JvbGUnKTtcblxuICAgIHJldHVybiB7XG4gICAgICAvKipcbiAgICAgICAqIFZpZXcgbW9kZWwgYmVsb25ncyB0byByZXNvdXJjZSBtb2RlbC5cbiAgICAgICAqL1xuICAgICAgcmVzb3VyY2U6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkJlbG9uZ3NUb09uZVJlbGF0aW9uLFxuICAgICAgICBtb2RlbENsYXNzOiBSZXNvdXJjZS5kZWZhdWx0LFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ3ZpZXdzLnJlc291cmNlSWQnLFxuICAgICAgICAgIHRvOiAncmVzb3VyY2VzLmlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogVmlldyBtb2RlbCBtYXkgaGFzIG1hbnkgY29sdW1ucy5cbiAgICAgICAqL1xuICAgICAgY29sdW1uczoge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuSGFzTWFueVJlbGF0aW9uLFxuICAgICAgICBtb2RlbENsYXNzOiBWaWV3Q29sdW1uLmRlZmF1bHQsXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAndmlld3MuaWQnLFxuICAgICAgICAgIHRvOiAndmlld19oYXNfY29sdW1ucy52aWV3X2lkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogVmlldyBtb2RlbCBtYXkgaGFzIG1hbnkgdmlldyByb2xlcy5cbiAgICAgICAqL1xuICAgICAgdmlld1JvbGVzOiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5IYXNNYW55UmVsYXRpb24sXG4gICAgICAgIG1vZGVsQ2xhc3M6IFZpZXdSb2xlLmRlZmF1bHQsXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAndmlld3MuaWQnLFxuICAgICAgICAgIHRvOiAndmlld19yb2xlcy52aWV3X2lkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VNb2RlbCBmcm9tICdAL21vZGVscy9Nb2RlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXdDb2x1bW4gZXh0ZW5kcyBCYXNlTW9kZWwge1xuICAvKipcbiAgICogVGFibGUgbmFtZS5cbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAndmlld19oYXNfY29sdW1ucyc7XG4gIH1cblxuICAvKipcbiAgICogVGltZXN0YW1wIGNvbHVtbnMuXG4gICAqL1xuICBzdGF0aWMgZ2V0IGhhc1RpbWVzdGFtcHMoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBNb2RlbCB9IGZyb20gJ29iamVjdGlvbic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBCYXNlTW9kZWwgZnJvbSAnQC9tb2RlbHMvTW9kZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3Um9sZSBleHRlbmRzIEJhc2VNb2RlbCB7XG4gIC8qKlxuICAgKiBUYWJsZSBuYW1lLlxuICAgKi9cbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICd2aWV3X3JvbGVzJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaW1lc3RhbXAgY29sdW1ucy5cbiAgICovXG4gIHN0YXRpYyBnZXQgaGFzVGltZXN0YW1wcygpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVsYXRpb25zaGlwIG1hcHBpbmcuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHJlbGF0aW9uTWFwcGluZ3MoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8qKlxuICAgICAgICogVmlldyByb2xlIG1vZGVsIG1heSBiZWxvbmdzIHRvIHZpZXcgbW9kZWwuXG4gICAgICAgKi9cbiAgICAgIHZpZXc6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkJlbG9uZ3NUb09uZVJlbGF0aW9uLFxuICAgICAgICBtb2RlbEJhc2U6IHBhdGguam9pbihfX2Rpcm5hbWUsICdWaWV3JyksXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAndmlld19yb2xlcy52aWV3X2lkJyxcbiAgICAgICAgICB0bzogJ3ZpZXdzLmlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTW9kZWwgfSBmcm9tICdvYmplY3Rpb24nO1xuaW1wb3J0IGtuZXggZnJvbSAnQC9kYXRhYmFzZS9rbmV4JztcblxuLy8gQmluZCBhbGwgTW9kZWxzIHRvIGEga25leCBpbnN0YW5jZS4gSWYgeW91IG9ubHkgaGF2ZSBvbmUgZGF0YWJhc2UgaW5cbi8vIHlvdXIgc2VydmVyIHRoaXMgaXMgYWxsIHlvdSBoYXZlIHRvIGRvLiBGb3IgbXVsdGkgZGF0YWJhc2Ugc3lzdGVtcywgc2VlXG4vLyB0aGUgTW9kZWwuYmluZEtuZXgoKSBtZXRob2QuXG5Nb2RlbC5rbmV4KGtuZXgpO1xuIiwiaW1wb3J0IGVycm9ySGFuZGxlciBmcm9tICdlcnJvcmhhbmRsZXInO1xuaW1wb3J0IGFwcCBmcm9tICdAL2FwcCc7XG5cbmFwcC51c2UoZXJyb3JIYW5kbGVyKTtcblxuY29uc3Qgc2VydmVyID0gYXBwLmxpc3RlbihhcHAuZ2V0KCdwb3J0JyksICgpID0+IHtcbiAgY29uc29sZS5sb2coXG4gICAgJyAgQXBwIGlzIHJ1bm5pbmcgYXQgaHR0cDovL2xvY2FsaG9zdDolZCBpbiAlcyBtb2RlJyxcbiAgICBhcHAuZ2V0KCdwb3J0JyksXG4gICAgYXBwLmdldCgnZW52JyksXG4gICk7XG4gIGNvbnNvbGUubG9nKCcgIFByZXNzIENUUkwtQyB0byBzdG9wJyk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgc2VydmVyO1xuIiwiXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKb3VybmFsRW50cnkge1xuICBjb25zdHJ1Y3RvcihlbnRyeSkge1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgY3JlZGl0OiAwLFxuICAgICAgZGViaXQ6IDAsXG4gICAgfTtcbiAgICB0aGlzLmVudHJ5ID0geyAuLi5kZWZhdWx0cywgLi4uZW50cnkgfTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgcGljayB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgSm91cm5hbEVudHJ5IGZyb20gJ0Avc2VydmljZXMvQWNjb3VudGluZy9Kb3VybmFsRW50cnknO1xuaW1wb3J0IEFjY291bnRUcmFuc2FjdGlvbiBmcm9tICdAL21vZGVscy9BY2NvdW50VHJhbnNhY3Rpb24nO1xuaW1wb3J0IEFjY291bnRCYWxhbmNlIGZyb20gJ0AvbW9kZWxzL0FjY291bnRCYWxhbmNlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSm91cm5hbFBvc3RlciB7XG4gIC8qKlxuICAgKiBKb3VybmFsIHBvc3RlciBjb25zdHJ1Y3Rvci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW50cmllcyA9IFtdO1xuICAgIHRoaXMuYmFsYW5jZXNDaGFuZ2UgPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcml0ZXMgdGhlIGNyZWRpdCBlbnRyeSBmb3IgdGhlIGdpdmVuIGFjY291bnQuXG4gICAqIEBwYXJhbSB7Sm91cm5hbEVudHJ5fSBlbnRyeSAtXG4gICAqL1xuICBjcmVkaXQoZW50cnlNb2RlbCkge1xuICAgIGlmIChlbnRyeU1vZGVsIGluc3RhbmNlb2YgSm91cm5hbEVudHJ5ID09PSBmYWxzZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgZW50cnkgaXMgbm90IGluc3RhbmNlIG9mIEpvdXJuYWxFbnRyeS4nKTtcbiAgICB9XG4gICAgdGhpcy5lbnRyaWVzLnB1c2goZW50cnlNb2RlbC5lbnRyeSk7XG4gICAgdGhpcy5zZXRBY2NvdW50QmFsYW5jZUNoYW5nZShlbnRyeU1vZGVsLmVudHJ5LCAnY3JlZGl0Jyk7XG4gIH1cblxuICAvKipcbiAgICogV3JpdGVzIHRoZSBkZWJpdCBlbnRyeSBmb3IgdGhlIGdpdmVuIGFjY291bnQuXG4gICAqIEBwYXJhbSB7Sm91cm5hbEVudHJ5fSBlbnRyeSAtXG4gICAqL1xuICBkZWJpdChlbnRyeU1vZGVsKSB7XG4gICAgaWYgKGVudHJ5TW9kZWwgaW5zdGFuY2VvZiBKb3VybmFsRW50cnkgPT09IGZhbHNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBlbnRyeSBpcyBub3QgaW5zdGFuY2Ugb2YgSm91cm5hbEVudHJ5LicpO1xuICAgIH1cbiAgICB0aGlzLmVudHJpZXMucHVzaChlbnRyeU1vZGVsLmVudHJ5KTtcbiAgICB0aGlzLnNldEFjY291bnRCYWxhbmNlQ2hhbmdlKGVudHJ5TW9kZWwuZW50cnksICdkZWJpdCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYWNjb3VudCBiYWxhbmNlIGNoYW5nZS5cbiAgICogQHBhcmFtIHtKb3VybmFsRW50cnl9IGVudHJ5XG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gICAqL1xuICBzZXRBY2NvdW50QmFsYW5jZUNoYW5nZShlbnRyeSwgdHlwZSkge1xuICAgIGlmICghdGhpcy5iYWxhbmNlc0NoYW5nZVtlbnRyeS5hY2NvdW50XSkge1xuICAgICAgdGhpcy5iYWxhbmNlc0NoYW5nZVtlbnRyeS5hY2NvdW50XSA9IDA7XG4gICAgfVxuICAgIGxldCBjaGFuZ2UgPSAwO1xuXG4gICAgaWYgKGVudHJ5LmFjY291bnROb3JtYWwgPT09ICdjcmVkaXQnKSB7XG4gICAgICBjaGFuZ2UgPSAodHlwZSA9PT0gJ2NyZWRpdCcpID8gZW50cnkuY3JlZGl0IDogLTEgKiBlbnRyeS5kZWJpdDtcbiAgICB9IGVsc2UgaWYgKGVudHJ5LmFjY291bnROb3JtYWwgPT09ICdkZWJpdCcpIHtcbiAgICAgIGNoYW5nZSA9ICh0eXBlID09PSAnZGViaXQnKSA/IGVudHJ5LmRlYml0IDogLTEgKiBlbnRyeS5jcmVkaXQ7XG4gICAgfVxuICAgIHRoaXMuYmFsYW5jZXNDaGFuZ2VbZW50cnkuYWNjb3VudF0gKz0gY2hhbmdlO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcHBpbmcgdGhlIGJhbGFuY2UgY2hhbmdlIHRvIGxpc3QuXG4gICAqL1xuICBtYXBCYWxhbmNlQ2hhbmdlc1RvTGlzdCgpIHtcbiAgICBjb25zdCBtYXBwZWRMaXN0ID0gW107XG5cbiAgICBPYmplY3Qua2V5cyh0aGlzLmJhbGFuY2VzQ2hhbmdlKS5mb3JFYWNoKChhY2NvdW50SWQpID0+IHtcbiAgICAgIGNvbnN0IGJhbGFuY2UgPSB0aGlzLmJhbGFuY2VzQ2hhbmdlW2FjY291bnRJZF07XG5cbiAgICAgIG1hcHBlZExpc3QucHVzaCh7XG4gICAgICAgIGFjY291bnRfaWQ6IGFjY291bnRJZCxcbiAgICAgICAgYW1vdW50OiBiYWxhbmNlLFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG1hcHBlZExpc3Q7XG4gIH1cblxuICAvKipcbiAgICogU2F2ZXMgdGhlIGJhbGFuY2UgY2hhbmdlIG9mIGpvdXJuYWwgZW50cmllcy5cbiAgICovXG4gIGFzeW5jIHNhdmVCYWxhbmNlKCkge1xuICAgIGNvbnN0IGJhbGFuY2VzTGlzdCA9IHRoaXMubWFwQmFsYW5jZUNoYW5nZXNUb0xpc3QoKTtcbiAgICBjb25zdCBiYWxhbmNlVXBkYXRlT3BlcnMgPSBbXTtcbiAgICBjb25zdCBiYWxhbmNlSW5zZXJ0T3BlcnMgPSBbXTtcbiAgICBjb25zdCBiYWxhbmNlRmluZE9uZU9wZXJzID0gW107XG4gICAgbGV0IGJhbGFuY2VBY2NvdW50cyA9IFtdO1xuXG4gICAgYmFsYW5jZXNMaXN0LmZvckVhY2goKGJhbGFuY2UpID0+IHtcbiAgICAgIGNvbnN0IG9wZXIgPSBBY2NvdW50QmFsYW5jZS5xdWVyeSgpLmZpbmRPbmUoJ2FjY291bnRfaWQnLCBiYWxhbmNlLmFjY291bnRfaWQpO1xuICAgICAgYmFsYW5jZUZpbmRPbmVPcGVycy5wdXNoKG9wZXIpO1xuICAgIH0pO1xuICAgIGJhbGFuY2VBY2NvdW50cyA9IGF3YWl0IFByb21pc2UuYWxsKGJhbGFuY2VGaW5kT25lT3BlcnMpO1xuXG4gICAgYmFsYW5jZXNMaXN0LmZvckVhY2goKGJhbGFuY2UpID0+IHtcbiAgICAgIGNvbnN0IG1ldGhvZCA9IGJhbGFuY2UuYW1vdW50IDwgMCA/ICdkZWNyZW1lbnQnIDogJ2luY3JlbWVudCc7XG5cbiAgICAgIC8vIERldGFybWluZSBpZiB0aGUgYWNjb3VudCBiYWxhbmNlIGlzIGFscmVhZHkgZXhpc3RzIG9yIG5vdC5cbiAgICAgIGNvbnN0IGZvdW5kQWNjQmFsYW5jZSA9IGJhbGFuY2VBY2NvdW50cy5zb21lKChhY2NvdW50KSA9PiAoXG4gICAgICAgIGFjY291bnQgJiYgYWNjb3VudC5hY2NvdW50X2lkID09PSBiYWxhbmNlLmFjY291bnRfaWRcbiAgICAgICkpO1xuICAgICAgaWYgKGZvdW5kQWNjQmFsYW5jZSkge1xuICAgICAgICBjb25zdCBxdWVyeSA9IEFjY291bnRCYWxhbmNlXG4gICAgICAgICAgLnF1ZXJ5KClbbWV0aG9kXSgnYW1vdW50JywgTWF0aC5hYnMoYmFsYW5jZS5hbW91bnQpKVxuICAgICAgICAgIC53aGVyZSgnYWNjb3VudF9pZCcsIGJhbGFuY2UuYWNjb3VudF9pZCk7XG5cbiAgICAgICAgYmFsYW5jZVVwZGF0ZU9wZXJzLnB1c2gocXVlcnkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcXVlcnkgPSBBY2NvdW50QmFsYW5jZS5xdWVyeSgpLmluc2VydCh7XG4gICAgICAgICAgYWNjb3VudF9pZDogYmFsYW5jZS5hY2NvdW50X2lkLFxuICAgICAgICAgIGFtb3VudDogYmFsYW5jZS5hbW91bnQsXG4gICAgICAgICAgY3VycmVuY3lfY29kZTogJ1VTRCcsXG4gICAgICAgIH0pO1xuICAgICAgICBiYWxhbmNlSW5zZXJ0T3BlcnMucHVzaChxdWVyeSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgLi4uYmFsYW5jZVVwZGF0ZU9wZXJzLCAuLi5iYWxhbmNlSW5zZXJ0T3BlcnMsXG4gICAgXSk7XG4gIH1cblxuICAvKipcbiAgICogU2F2ZXMgdGhlIHN0YWNrZWQgam91cm5hbCBlbnRyaWVzIHRvIHRoZSBzdG9yYWdlLlxuICAgKi9cbiAgYXN5bmMgc2F2ZUVudHJpZXMoKSB7XG4gICAgY29uc3Qgc2F2ZU9wZXJhdGlvbnMgPSBbXTtcblxuICAgIHRoaXMuZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgY29uc3Qgb3BlciA9IEFjY291bnRUcmFuc2FjdGlvbi5xdWVyeSgpLmluc2VydCh7XG4gICAgICAgIGFjY291bnRJZDogZW50cnkuYWNjb3VudCxcbiAgICAgICAgLi4ucGljayhlbnRyeSwgWydjcmVkaXQnLCAnZGViaXQnLCAndHJhbnNhY3Rpb25UeXBlJyxcbiAgICAgICAgICAncmVmZXJlbmNlVHlwZScsICdyZWZlcmVuY2VJZCcsICdub3RlJ10pLFxuICAgICAgfSk7XG4gICAgICBzYXZlT3BlcmF0aW9ucy5wdXNoKG9wZXIpO1xuICAgIH0pO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKHNhdmVPcGVyYXRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXZlcnNlcyB0aGUgc3RhY2tlZCBqb3VybmFsIGVudHJpZXMuXG4gICAqL1xuICByZXZlcnNlRW50cmllcygpIHtcbiAgICBjb25zdCByZXZlcnNlRW50cmllcyA9IFtdO1xuXG4gICAgdGhpcy5lbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBjb25zdCByZXZlcnNlRW50cnkgPSB7IC4uLmVudHJ5IH07XG5cbiAgICAgIGlmIChlbnRyeS5jcmVkaXQpIHtcbiAgICAgICAgcmV2ZXJzZUVudHJ5LmRlYml0ID0gZW50cnkuY3JlZGl0O1xuICAgICAgfVxuICAgICAgaWYgKGVudHJ5LmRlYml0KSB7XG4gICAgICAgIHJldmVyc2VFbnRyeS5jcmVkaXQgPSBlbnRyeS5kZWJpdDtcbiAgICAgIH1cbiAgICAgIHJldmVyc2VFbnRyaWVzLnB1c2gocmV2ZXJzZUVudHJ5KTtcbiAgICB9KTtcbiAgICB0aGlzLmVudHJpZXMgPSByZXZlcnNlRW50cmllcztcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgdGhlIGdpdmVuIG9yIGFsbCBzdGFja2VkIGVudHJpZXMuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGlkcyAtXG4gICAqL1xuICBhc3luYyBkZWxldGVFbnRyaWVzKGlkcykge1xuICAgIGNvbnN0IGVudHJpZXNJZHMgPSBpZHMgfHwgdGhpcy5lbnRyaWVzLm1hcCgoZSkgPT4gZS5pZCk7XG5cbiAgICBpZiAoZW50cmllc0lkcy5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCBBY2NvdW50VHJhbnNhY3Rpb24ucXVlcnkoKS53aGVyZUluKCdpZCcsIGVudHJpZXNJZHMpLmRlbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgY2xvc2luZyBiYWxhbmNlIGZvciB0aGUgZ2l2ZW4gYWNjb3VudCBhbmQgY2xvc2luZyBkYXRlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gYWNjb3VudElkIC1cbiAgICogQHBhcmFtIHtEYXRlfSBjbG9zaW5nRGF0ZSAtXG4gICAqL1xuICBnZXRDbG9zaW5nQmFsYW5jZShhY2NvdW50SWQsIGNsb3NpbmdEYXRlLCBkYXRlVHlwZSA9ICdkYXknKSB7XG4gICAgbGV0IGNsb3NpbmdCYWxhbmNlID0gMDtcbiAgICBjb25zdCBtb21lbnRDbG9zaW5nRGF0ZSA9IG1vbWVudChjbG9zaW5nRGF0ZSk7XG5cbiAgICB0aGlzLmVudHJpZXMuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgIC8vIENhbiBub3QgY29udGludWUgaWYgbm90IGJlZm9yZSBvciBldmVudCBzYW1lIGNsb3NpbmcgZGF0ZS5cbiAgICAgIGlmICgoIW1vbWVudENsb3NpbmdEYXRlLmlzQWZ0ZXIoZW50cnkuZGF0ZSwgZGF0ZVR5cGUpXG4gICAgICAgICYmICFtb21lbnRDbG9zaW5nRGF0ZS5pc1NhbWUoZW50cnkuZGF0ZSwgZGF0ZVR5cGUpKVxuICAgICAgICB8fCAoZW50cnkuYWNjb3VudCAhPT0gYWNjb3VudElkICYmIGFjY291bnRJZCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGVudHJ5LmFjY291bnROb3JtYWwgPT09ICdjcmVkaXQnKSB7XG4gICAgICAgIGNsb3NpbmdCYWxhbmNlICs9IChlbnRyeS5jcmVkaXQpID8gZW50cnkuY3JlZGl0IDogLTEgKiBlbnRyeS5kZWJpdDtcbiAgICAgIH0gZWxzZSBpZiAoZW50cnkuYWNjb3VudE5vcm1hbCA9PT0gJ2RlYml0Jykge1xuICAgICAgICBjbG9zaW5nQmFsYW5jZSArPSAoZW50cnkuZGViaXQpID8gZW50cnkuZGViaXQgOiAtMSAqIGVudHJ5LmNyZWRpdDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gY2xvc2luZ0JhbGFuY2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGNyZWRpdC9kZWJpdCBzdW1hdGlvbiBmb3IgdGhlIGdpdmVuIGFjY291bnQgYW5kIGRhdGUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhY2NvdW50IC1cbiAgICogQHBhcmFtIHtEYXRlfFN0cmluZ30gY2xvc2luZ0RhdGUgLVxuICAgKi9cbiAgZ2V0VHJpYWxCYWxhbmNlKGFjY291bnRJZCwgY2xvc2luZ0RhdGUsIGRhdGVUeXBlKSB7XG4gICAgY29uc3QgbW9tZW50Q2xvc2luZ0RhdGUgPSBtb21lbnQoY2xvc2luZ0RhdGUpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgIGNyZWRpdDogMCxcbiAgICAgIGRlYml0OiAwLFxuICAgICAgYmFsYW5jZTogMCxcbiAgICB9O1xuICAgIHRoaXMuZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgaWYgKCghbW9tZW50Q2xvc2luZ0RhdGUuaXNBZnRlcihlbnRyeS5kYXRlLCBkYXRlVHlwZSlcbiAgICAgICAgJiYgIW1vbWVudENsb3NpbmdEYXRlLmlzU2FtZShlbnRyeS5kYXRlLCBkYXRlVHlwZSkpXG4gICAgICAgIHx8IChlbnRyeS5hY2NvdW50ICE9PSBhY2NvdW50SWQgJiYgYWNjb3VudElkKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXN1bHQuY3JlZGl0ICs9IGVudHJ5LmNyZWRpdDtcbiAgICAgIHJlc3VsdC5kZWJpdCArPSBlbnRyeS5kZWJpdDtcblxuICAgICAgaWYgKGVudHJ5LmFjY291bnROb3JtYWwgPT09ICdjcmVkaXQnKSB7XG4gICAgICAgIHJlc3VsdC5iYWxhbmNlICs9IChlbnRyeS5jcmVkaXQpID8gZW50cnkuY3JlZGl0IDogLTEgKiBlbnRyeS5kZWJpdDtcbiAgICAgIH0gZWxzZSBpZiAoZW50cnkuYWNjb3VudE5vcm1hbCA9PT0gJ2RlYml0Jykge1xuICAgICAgICByZXN1bHQuYmFsYW5jZSArPSAoZW50cnkuZGViaXQpID8gZW50cnkuZGViaXQgOiAtMSAqIGVudHJ5LmNyZWRpdDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgZmV0Y2hlZCBhY2NvdW50cyBqb3VybmFsIGVudHJpZXMuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGVudHJpZXMgLVxuICAgKi9cbiAgbG9hZEVudHJpZXMoZW50cmllcykge1xuICAgIGVudHJpZXMuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgIHRoaXMuZW50cmllcy5wdXNoKHtcbiAgICAgICAgLi4uZW50cnksXG4gICAgICAgIGFjY291bnQ6IGVudHJ5LmFjY291bnQgPyBlbnRyeS5hY2NvdW50LmlkIDogZW50cnkuYWNjb3VudElkLFxuICAgICAgICBhY2NvdW50Tm9ybWFsOiAoZW50cnkuYWNjb3VudCAmJiBlbnRyeS5hY2NvdW50LnR5cGUpXG4gICAgICAgICAgPyBlbnRyeS5hY2NvdW50LnR5cGUubm9ybWFsIDogZW50cnkuYWNjb3VudE5vcm1hbCxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGxvYWRBY2NvdW50cygpIHtcblxuICB9XG59XG4iLCJpbXBvcnQgUmVzb3VyY2UgZnJvbSAnQC9tb2RlbHMvUmVzb3VyY2UnO1xuaW1wb3J0IFJlc291cmNlRmllbGQgZnJvbSAnQC9tb2RlbHMvUmVzb3VyY2VGaWVsZCc7XG5pbXBvcnQgUmVzb3VyY2VGaWVsZE1ldGFkYXRhIGZyb20gJ0AvbW9kZWxzL1Jlc291cmNlRmllbGRNZXRhZGF0YSc7XG5pbXBvcnQgUmVzb3VyY2VGaWVsZE1ldGFkYXRhQ29sbGVjdGlvbiBmcm9tICdAL2NvbGxlY3Rpb24vUmVzb3VyY2VGaWVsZE1ldGFkYXRhQ29sbGVjdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc291cmNlQ3VzdG9tRmllbGRSZXBvc2l0b3J5IHtcbiAgLyoqXG4gICAqIENsYXNzIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgY29uc3RydWN0b3IobW9kZWwpIHtcbiAgICBpZiAodHlwZW9mIG1vZGVsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLnJlc291cmNlTmFtZSA9IG1vZGVsLm5hbWU7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kZWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnJlc291cmNlTmFtZSA9IG1vZGVsO1xuICAgIH1cbiAgICAvLyBDdXN0b20gZmllbGRzIG9mIHRoZSBnaXZlbiByZXNvdXJjZS5cbiAgICB0aGlzLmN1c3RvbUZpZWxkcyA9IFtdO1xuICAgIHRoaXMuZmlsbGVkQ3VzdG9tRmllbGRzID0ge307XG5cbiAgICAvLyBtZXRhZGF0YSBvZiBjdXN0b20gZmllbGRzIG9mIHRoZSBnaXZlbiByZXNvdXJjZS5cbiAgICB0aGlzLmZpZWxkc01ldGFkYXRhID0ge307XG4gICAgdGhpcy5yZXNvdXJjZSA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIEZldGNoZXMgbWV0YWRhdGEgb2YgY3VzdG9tIGZpZWxkcyBvZiB0aGUgZ2l2ZW4gcmVzb3VyY2UuXG4gICAqIEBwYXJhbSB7SW50ZWdlcn0gaWQgLSBSZXNvdXJjZSBpdGVtIGlkLlxuICAgKi9cbiAgYXN5bmMgZmV0Y2hDdXN0b21GaWVsZHNNZXRhZGF0YShpZCkge1xuICAgIGlmICh0eXBlb2YgaWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSBkZWZpbmUgdGhlIHJlc291cmNlIGl0ZW0gaWQuJyk7XG4gICAgfVxuICAgIGlmICghdGhpcy5yZXNvdXJjZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUYXJnZXQgcmVzb3VyY2UgbW9kZWwgaXMgbm90IGZvdW5kLicpO1xuICAgIH1cbiAgICBjb25zdCBtZXRhZGF0YSA9IGF3YWl0IFJlc291cmNlRmllbGRNZXRhZGF0YS5xdWVyeSgpXG4gICAgICAud2hlcmUoJ3Jlc291cmNlX2lkJywgdGhpcy5yZXNvdXJjZS5pZClcbiAgICAgIC53aGVyZSgncmVzb3VyY2VfaXRlbV9pZCcsIGlkKTtcblxuICAgIHRoaXMuZmllbGRzTWV0YWRhdGFbaWRdID0gbWV0YWRhdGE7XG4gIH1cblxuICAvKipcbiAgICogTG9hZCByZXNvdXJjZS5cbiAgICovXG4gIGFzeW5jIGxvYWRSZXNvdXJjZSgpIHtcbiAgICBjb25zdCByZXNvdXJjZSA9IGF3YWl0IFJlc291cmNlLnF1ZXJ5KCkud2hlcmUoJ25hbWUnLCB0aGlzLnJlc291cmNlTmFtZSkuZmlyc3QoKTtcblxuICAgIGlmICghcmVzb3VyY2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlcmUgaXMgbm8gc3RvcmVkIHJlc291cmNlIGluIHRoZSBzdG9yYWdlIHdpdGggdGhlIGdpdmVuIG1vZGVsIG5hbWUuJyk7XG4gICAgfVxuICAgIHRoaXMuc2V0UmVzb3VyY2UocmVzb3VyY2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgbWV0YWRhdGEgb2YgdGhlIHJlc291cmNlLlxuICAgKi9cbiAgYXN5bmMgbG9hZFJlc291cmNlQ3VzdG9tRmllbGRzKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5yZXNvdXJjZS5pZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIGZldGNoIHJlc291cmNlIGRldGFpbHMgYmVmb3JlIGZldGNoIGN1c3RvbSBmaWVsZHMgb2YgdGhlIHJlc291cmNlLicpO1xuICAgIH1cbiAgICBjb25zdCBjdXN0b21GaWVsZHMgPSBhd2FpdCBSZXNvdXJjZUZpZWxkLnF1ZXJ5KClcbiAgICAgIC53aGVyZSgncmVzb3VyY2VfaWQnLCB0aGlzLnJlc291cmNlLmlkKVxuICAgICAgLm1vZGlmeSgnd2hlcmVOb3RQcmVkZWZpbmVkJyk7XG5cbiAgICB0aGlzLnNldFJlc291cmNlQ3VzdG9tRmllbGRzKGN1c3RvbUZpZWxkcyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyByZXNvdXJjZSBtb2RlbC5cbiAgICogQHBhcmFtIHtSZXNvdXJjZX0gcmVzb3VyY2UgLVxuICAgKi9cbiAgc2V0UmVzb3VyY2UocmVzb3VyY2UpIHtcbiAgICB0aGlzLnJlc291cmNlID0gcmVzb3VyY2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyByZXNvdXJjZSBjdXN0b20gZmllbGRzIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSB7QXJyYXl9IGN1c3RvbUZpZWxkcyAtXG4gICAqL1xuICBzZXRSZXNvdXJjZUN1c3RvbUZpZWxkcyhjdXN0b21GaWVsZHMpIHtcbiAgICB0aGlzLmN1c3RvbUZpZWxkcyA9IGN1c3RvbUZpZWxkcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBtZXRhZGF0YSBvZiB0aGUgcmVzb3VyY2UgY3VzdG9tIGZpZWxkcy5cbiAgICogQHBhcmFtIHtJbnRlZ2VyfSBpdGVtSWQgLVxuICAgKi9cbiAgZ2V0TWV0YWRhdGEoaXRlbUlkKSB7XG4gICAgcmV0dXJuIHRoaXMuZmllbGRzTWV0YWRhdGFbaXRlbUlkXSB8fCB0aGlzLmZpZWxkc01ldGFkYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbGwgbWV0YWRhdGEgb2YgdGhlIGN1c3RvbSBmaWVsZHMgdGhhdCBhc3NvY2lhdGVkIHRvIHRoZSByZXNvdXJjZS5cbiAgICogQHBhcmFtIHtJbnRlcn0gaWQgLSBSZXNvdXJjZSBpdGVtIGlkLlxuICAgKiBAcGFyYW0ge0FycmF5fSBhdHRyaWJ1dGVzIC1cbiAgICovXG4gIGZpbGxDdXN0b21GaWVsZHMoaWQsIGF0dHJpYnV0ZXMpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuZmlsbGVkQ3VzdG9tRmllbGRzW2lkXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMuZmlsbGVkQ3VzdG9tRmllbGRzW2lkXSA9IFtdO1xuICAgIH1cbiAgICBhdHRyaWJ1dGVzLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICAgIHRoaXMuZmlsbGVkQ3VzdG9tRmllbGRzW2lkXS5wdXNoKGF0dHIpO1xuXG4gICAgICBpZiAoIXRoaXMuZmllbGRzTWV0YWRhdGFbaWRdKSB7XG4gICAgICAgIHRoaXMuZmllbGRzTWV0YWRhdGFbaWRdID0gbmV3IFJlc291cmNlRmllbGRNZXRhZGF0YUNvbGxlY3Rpb24oKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZmllbGRzTWV0YWRhdGFbaWRdLnNldE1ldGEoYXR0ci5rZXksIGF0dHIudmFsdWUsIHtcbiAgICAgICAgcmVzb3VyY2VfaWQ6IHRoaXMucmVzb3VyY2UuaWQsXG4gICAgICAgIHJlc291cmNlX2l0ZW1faWQ6IGlkLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2F2ZXMgdGhlIGluc3RlcmVkLCB1cGRhdGVkIGFuZCBkZWxldGVkICBjdXN0b20gZmllbGRzIG1ldGFkYXRhLlxuICAgKiBAcGFyYW0ge0ludGVnZXJ9IGlkIC0gT3B0aW9uYWwgcmVzb3VyY2UgaXRlbSBpZC5cbiAgICovXG4gIGFzeW5jIHNhdmVDdXN0b21GaWVsZHMoaWQpIHtcbiAgICBpZiAoaWQpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5maWVsZHNNZXRhZGF0YVtpZF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlcmUgaXMgbm8gcmVzb3VyY2UgaXRlbSB3aXRoIHRoZSBnaXZlbiBpZC4nKTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IHRoaXMuZmllbGRzTWV0YWRhdGFbaWRdLnNhdmVNZXRhKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG9wZXJzID0gW107XG4gICAgICB0aGlzLmZpZWxkc01ldGFkYXRhLmZvckVhY2goKG1ldGFkYXRhKSA9PiB7XG4gICAgICAgIGNvbnN0IG9wZXIgPSBtZXRhZGF0YS5zYXZlTWV0YSgpO1xuICAgICAgICBvcGVycy5wdXNoKG9wZXIpO1xuICAgICAgfSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChvcGVycyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlcyB0aGUgZXhpc3QgY3VzdG9tIGZpZWxkcy5cbiAgICovXG4gIHZhbGlkYXRlRXhpc3RDdXN0b21GaWVsZHMoKSB7XG5cbiAgfVxuXG4gIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmllbGRzTWV0YWRhdGEudG9BcnJheSgpO1xuICB9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICBhd2FpdCB0aGlzLmxvYWRSZXNvdXJjZSgpO1xuICAgIGF3YWl0IHRoaXMubG9hZFJlc291cmNlQ3VzdG9tRmllbGRzKCk7XG4gIH1cblxuICBzdGF0aWMgZm9yZ2VNZXRhZGF0YUNvbGxlY3Rpb24oKSB7XG5cbiAgfVxufVxuIiwiaW1wb3J0IE1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHsgZXh0ZW5kTW9tZW50IH0gZnJvbSAnbW9tZW50LXJhbmdlJztcblxuY29uc3QgbW9tZW50ID0gZXh0ZW5kTW9tZW50KE1vbWVudCk7XG5cbmV4cG9ydCBkZWZhdWx0IG1vbWVudDtcbiIsImltcG9ydCBub2RlbWFpbGVyIGZyb20gJ25vZGVtYWlsZXInO1xuXG4vLyBjcmVhdGUgcmV1c2FibGUgdHJhbnNwb3J0ZXIgb2JqZWN0IHVzaW5nIHRoZSBkZWZhdWx0IFNNVFAgdHJhbnNwb3J0XG5jb25zdCB0cmFuc3BvcnRlciA9IG5vZGVtYWlsZXIuY3JlYXRlVHJhbnNwb3J0KHtcbiAgaG9zdDogcHJvY2Vzcy5lbnYuTUFJTF9IT1NULFxuICBwb3J0OiBOdW1iZXIocHJvY2Vzcy5lbnYuTUFJTF9QT1JUKSxcbiAgc2VjdXJlOiBwcm9jZXNzLmVudi5NQUlMX1NFQ1VSRSA9PT0gJ3RydWUnLCAvLyB0cnVlIGZvciA0NjUsIGZhbHNlIGZvciBvdGhlciBwb3J0c1xuICBhdXRoOiB7XG4gICAgdXNlcjogcHJvY2Vzcy5lbnYuTUFJTF9VU0VSTkFNRSxcbiAgICBwYXNzOiBwcm9jZXNzLmVudi5NQUlMX1BBU1NXT1JELFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHRyYW5zcG9ydGVyO1xuIiwiaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHRqcyc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5cbmNvbnN0IGhhc2hQYXNzd29yZCA9IChwYXNzd29yZCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgYmNyeXB0LmdlblNhbHQoMTAsIChlcnJvciwgc2FsdCkgPT4ge1xuICAgIGJjcnlwdC5oYXNoKHBhc3N3b3JkLCBzYWx0LCAoZXJyLCBoYXNoKSA9PiB7IHJlc29sdmUoaGFzaCk7IH0pO1xuICB9KTtcbn0pO1xuXG5jb25zdCBvcmlnaW4gPSAocmVxdWVzdCkgPT4gYCR7cmVxdWVzdC5wcm90b2NvbH06Ly8ke3JlcXVlc3QuaG9zdG5hbWV9YDtcblxuY29uc3QgZGF0ZVJhbmdlQ29sbGVjdGlvbiA9IChmcm9tRGF0ZSwgdG9EYXRlLCBhZGRUeXBlID0gJ2RheScsIGluY3JlbWVudCA9IDEpID0+IHtcbiAgY29uc3QgY29sbGVjdGlvbiA9IFtdO1xuICBjb25zdCBtb21lbnRGcm9tRGF0ZSA9IG1vbWVudChmcm9tRGF0ZSk7XG4gIGxldCBkYXRlRm9ybWF0ID0gJyc7XG5cbiAgc3dpdGNoIChhZGRUeXBlKSB7XG4gICAgY2FzZSAnZGF5JzpcbiAgICBkZWZhdWx0OlxuICAgICAgZGF0ZUZvcm1hdCA9ICdZWVlZLU1NLUREJzsgYnJlYWs7XG4gICAgY2FzZSAnbW9udGgnOlxuICAgIGNhc2UgJ3F1YXJ0ZXInOlxuICAgICAgZGF0ZUZvcm1hdCA9ICdZWVlZLU1NJzsgYnJlYWs7XG4gICAgY2FzZSAneWVhcic6XG4gICAgICBkYXRlRm9ybWF0ID0gJ1lZWVknOyBicmVhaztcbiAgfVxuICBmb3IgKGxldCBpID0gbW9tZW50RnJvbURhdGU7XG4gICAgKGkuaXNCZWZvcmUodG9EYXRlLCBhZGRUeXBlKSB8fCBpLmlzU2FtZSh0b0RhdGUsIGFkZFR5cGUpKTtcbiAgICBpLmFkZChpbmNyZW1lbnQsIGAke2FkZFR5cGV9c2ApKSB7XG4gICAgY29sbGVjdGlvbi5wdXNoKGkuZW5kT2YoYWRkVHlwZSkuZm9ybWF0KGRhdGVGb3JtYXQpKTtcbiAgfVxuICByZXR1cm4gY29sbGVjdGlvbjtcbn07XG5cbmNvbnN0IGRhdGVSYW5nZUZvcm1hdCA9IChyYW5nZVR5cGUpID0+IHtcbiAgc3dpdGNoIChyYW5nZVR5cGUpIHtcbiAgICBjYXNlICd5ZWFyJzpcbiAgICAgIHJldHVybiAnWVlZWSc7XG4gICAgY2FzZSAnbW9udGgnOlxuICAgIGNhc2UgJ3F1YXJ0ZXInOlxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gJ1lZWVktTU0nO1xuICB9XG59O1xuXG5leHBvcnQge1xuICBoYXNoUGFzc3dvcmQsXG4gIG9yaWdpbixcbiAgZGF0ZVJhbmdlQ29sbGVjdGlvbixcbiAgZGF0ZVJhbmdlRm9ybWF0LFxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBiYWJlbC9wbHVnaW4tdHJhbnNmb3JtLXJ1bnRpbWVcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hc3luY1RvR2VuZXJhdG9yXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2tcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2RlZmluZVByb3BlcnR5XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvZ2V0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvZ2V0UHJvdG90eXBlT2ZcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbmhlcml0c1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm5cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9zbGljZWRUb0FycmF5XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvdG9Db25zdW1hYmxlQXJyYXlcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvcmVnZW5lcmF0b3JcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYmNyeXB0anNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZG90ZW52XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVycm9yaGFuZGxlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3MtYm9vbVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzLXZhbGlkYXRvclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJoZWxtZXRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwianNvbndlYnRva2VuXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImtuZXhcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG9kYXNoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm1vbWVudFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb21lbnQtcmFuZ2VcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibXVzdGFjaGVcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibm9kZW1haWxlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJvYmplY3Rpb25cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNoREE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hFQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDdkVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDWkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDVkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUMvSUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTdFQTtBQStFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDak5BO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFuQkE7QUFDQTtBQUNBO0FBcUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDblVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNoTUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNSQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2xQQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTdFQTtBQStFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNaQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ1JBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUE3REE7QUFDQTtBQStEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF2RkE7QUF5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzNkQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN2T0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNoZ0JBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNwTEE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBbkNBO0FBcUNBO0FBQ0E7QUFDQTtBQXZDQTtBQXlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUM5UUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3ZFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFoSUE7QUFDQTtBQUNBO0FBQ0E7QUFrSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDdlZBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDUkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3hQQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUMxTkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzlDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDUkE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDZkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFwRUE7QUF3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNqUEE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQXRFQTs7QUFPQTs7QUFhQTs7QUFTQTs7QUFZQTs7QUFZQTs7Ozs7Ozs7Ozs7O0FDOURBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzNCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDL0VBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQy9CQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBcERBOztBQVdBOzs7Ozs7Ozs7Ozs7QUNqQkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNSQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDcEZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDekNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUM3QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNSQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ1JBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNkQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBZkE7QUFrQkE7QUFDQTs7Ozs7Ozs7Ozs7O0FDM0JBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDUkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXBCQTtBQXNCQTs7Ozs7Ozs7Ozs7OztBQ3ZDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNwRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUEzQ0E7O0FBR0E7O0FBV0E7O0FBV0E7O0FBT0E7O0FBbUJBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ2xFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3JDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzVFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQXBDQTs7QUFHQTs7QUFPQTs7Ozs7Ozs7Ozs7O0FDbEJBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN6REE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNmQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDcENBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ05BO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDUkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQy9PQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDeEpBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ0xBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2JBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVDQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7OztBIiwic291cmNlUm9vdCI6IiJ9