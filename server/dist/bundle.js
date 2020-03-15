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
      return this.collection;
    } }, { key: "getTree", value: function getTree()

    {
      return this.collection;
    } }, { key: "flattenTree", value: function flattenTree(

    nodeMapper) {
      var flattenTree = [];

      var traversal = function traversal(nodes, parentNode) {
        nodes.forEach(function (node) {
          var nodeMapped = node;

          if (typeof nodeMapper === 'function') {
            nodeMapped = nodeMapper(nodeMapped, parentNode);
          }
          flattenTree.push(nodeMapped);

          if (node.children && node.children.length > 0) {
            traversal(node.children, node);
          }
        });
      };
      traversal(this.collection);

      return flattenTree;
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

/***/ "./src/data/ResourceFieldsKeys.js":
/*!****************************************!*\
  !*** ./src/data/ResourceFieldsKeys.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

/* harmony default export */ __webpack_exports__["default"] = ({
  "expense_account": 'expense_account_id',
  "payment_account": 'payment_account_id',
  "account_type": "account_type_id" });

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

/***/ "./src/http/controllers/AccountTypes.js":
/*!**********************************************!*\
  !*** ./src/http/controllers/AccountTypes.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/http/middleware/jwtAuth */ "./src/http/middleware/jwtAuth.js");
/* harmony import */ var _http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/http/middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
/* harmony import */ var _models_AccountType__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/models/AccountType */ "./src/models/AccountType.js");





/* harmony default export */ __webpack_exports__["default"] = ({
  /**
                  * Router constructor.
                  */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_2___default.a.Router();
    router.use(_http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_3__["default"]);

    router.get('/',
    this.getAccountTypesList.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_4__["default"])(this.getAccountTypesList.handler));

    return router;
  },

  /**
      * Retrieve accounts types list.
      */
  getAccountTypesList: {
    validation: [],
    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(req, res) {var accountTypes;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
                  _models_AccountType__WEBPACK_IMPORTED_MODULE_5__["default"].query());case 2:accountTypes = _context.sent;return _context.abrupt("return",

                res.status(200).send({
                  account_types: accountTypes }));case 4:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() } });

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


                form = _objectSpread({
                  date: new Date() },
                req.body);

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
                    date: entry.date,
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
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "@babel/runtime/helpers/toConsumableArray");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
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
/* harmony import */ var _http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/http/middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
/* harmony import */ var _models_Account__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/models/Account */ "./src/models/Account.js");
/* harmony import */ var _models_AccountType__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/models/AccountType */ "./src/models/AccountType.js");
/* harmony import */ var _models_AccountTransaction__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/models/AccountTransaction */ "./src/models/AccountTransaction.js");
/* harmony import */ var _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/services/Accounting/JournalPoster */ "./src/services/Accounting/JournalPoster.js");
/* harmony import */ var _models_AccountBalance__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @/models/AccountBalance */ "./src/models/AccountBalance.js");
/* harmony import */ var _models_Resource__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @/models/Resource */ "./src/models/Resource.js");
/* harmony import */ var _models_View__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @/models/View */ "./src/models/View.js");
/* harmony import */ var _http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @/http/middleware/jwtAuth */ "./src/http/middleware/jwtAuth.js");
/* harmony import */ var _collection_NestedSet__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../collection/NestedSet */ "./src/collection/NestedSet/index.js");
/* harmony import */ var _lib_ViewRolesBuilder__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @/lib/ViewRolesBuilder */ "./src/lib/ViewRolesBuilder/index.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}













/* harmony default export */ __webpack_exports__["default"] = ({
  /**
                  * Router constructor method.
                  */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_5___default.a.Router();

    router.use(_http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_15__["default"]);
    router.post('/',
    this.newAccount.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(this.newAccount.handler));

    router.post('/:id',
    this.editAccount.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(this.editAccount.handler));

    router.get('/:id',
    this.getAccount.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(this.getAccount.handler));

    router.get('/',
    this.getAccountsList.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(this.getAccountsList.handler));

    router["delete"]('/:id',
    this.deleteAccount.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(this.deleteAccount.handler));

    router.post('/:id/active',
    this.activeAccount.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(this.activeAccount.handler));

    router.post('/:id/inactive',
    this.inactiveAccount.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(this.inactiveAccount.handler));

    router.post('/:id/recalculate-balance',
    this.recalcualteBalanace.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(this.recalcualteBalanace.handler));

    router.post('/:id/transfer_account/:toAccount',
    this.transferToAnotherAccount.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])(this.transferToAnotherAccount.handler));

    return router;
  },

  /**
      * Creates a new account.
      */
  newAccount: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('name').exists().isLength({ min: 3 }).trim().escape(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('code').exists().isLength({ max: 10 }).trim().escape(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('account_type_id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('description').optional().trim().escape()],

    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee(req, res) {var validationErrors, form, foundAccountCodePromise, foundAccountTypePromise, _ref, _ref2, foundAccountCode, foundAccountType;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context.next = 3;break;}return _context.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:


                form = _objectSpread({}, req.body);

                foundAccountCodePromise = form.code ?
                _models_Account__WEBPACK_IMPORTED_MODULE_8__["default"].query().where('code', form.code) : null;

                foundAccountTypePromise = _models_AccountType__WEBPACK_IMPORTED_MODULE_9__["default"].query().
                findById(form.account_type_id);_context.next = 8;return (

                  Promise.all([
                  foundAccountCodePromise, foundAccountTypePromise]));case 8:_ref = _context.sent;_ref2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2___default()(_ref, 2);foundAccountCode = _ref2[0];foundAccountType = _ref2[1];if (!(


                foundAccountCodePromise && foundAccountCode.length > 0)) {_context.next = 14;break;}return _context.abrupt("return",
                res.boom.badRequest(null, {
                  errors: [{ type: 'NOT_UNIQUE_CODE', code: 100 }] }));case 14:if (


                foundAccountType) {_context.next = 16;break;}return _context.abrupt("return",
                res.boom.badRequest(null, {
                  errors: [{ type: 'NOT_EXIST_ACCOUNT_TYPE', code: 200 }] }));case 16:_context.next = 18;return (


                  _models_Account__WEBPACK_IMPORTED_MODULE_8__["default"].query().insert(_objectSpread({}, form)));case 18:return _context.abrupt("return",

                res.status(200).send({ item: {} }));case 19:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                          * Edit the given account details.
                                                                                                                                                                                                          */
  editAccount: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["param"])('id').exists().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('name').exists().isLength({ min: 3 }).trim().escape(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('code').exists().isLength({ max: 10 }).trim().escape(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('account_type_id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('description').optional().trim().escape()],

    handler: function () {var _handler2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee2(req, res) {var id, validationErrors, form, account, foundAccountCodePromise, foundAccountTypePromise, _ref3, _ref4, foundAccountCode, foundAccountType;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                id = req.params.id;
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context2.next = 4;break;}return _context2.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 4:


                form = _objectSpread({}, req.body);_context2.next = 7;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_8__["default"].query().findById(id));case 7:account = _context2.sent;if (

                account) {_context2.next = 10;break;}return _context2.abrupt("return",
                res.boom.notFound());case 10:

                foundAccountCodePromise = form.code && form.code !== account.code ?
                _models_Account__WEBPACK_IMPORTED_MODULE_8__["default"].query().where('code', form.code).whereNot('id', account.id) : null;

                foundAccountTypePromise = form.account_type_id !== account.account_type_id ?
                _models_AccountType__WEBPACK_IMPORTED_MODULE_9__["default"].query().where('id', form.account_type_id) : null;_context2.next = 14;return (

                  Promise.all([
                  foundAccountCodePromise, foundAccountTypePromise]));case 14:_ref3 = _context2.sent;_ref4 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2___default()(_ref3, 2);foundAccountCode = _ref4[0];foundAccountType = _ref4[1];if (!(

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
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["param"])('id').toInt()],

    handler: function () {var _handler3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee3(req, res) {var id, account;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                id = req.params.id;_context3.next = 3;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_8__["default"].query().where('id', id).first());case 3:account = _context3.sent;if (

                account) {_context3.next = 6;break;}return _context3.abrupt("return",
                res.boom.notFound());case 6:return _context3.abrupt("return",

                res.status(200).send({ account: _objectSpread({}, account) }));case 7:case "end":return _context3.stop();}}}, _callee3);}));function handler(_x5, _x6) {return _handler3.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                                        * Delete the given account.
                                                                                                                                                                                                                                        */
  deleteAccount: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["param"])('id').toInt()],

    handler: function () {var _handler4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee4(req, res) {var id, account, accountTransactions;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                id = req.params.id;_context4.next = 3;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_8__["default"].query().findById(id));case 3:account = _context4.sent;if (

                account) {_context4.next = 6;break;}return _context4.abrupt("return",
                res.boom.notFound());case 6:_context4.next = 8;return (

                  _models_AccountTransaction__WEBPACK_IMPORTED_MODULE_10__["default"].query().
                  where('account_id', account.id));case 8:accountTransactions = _context4.sent;if (!(

                accountTransactions.length > 0)) {_context4.next = 11;break;}return _context4.abrupt("return",
                res.boom.badRequest(null, {
                  errors: [{ type: 'ACCOUNT.HAS.ASSOCIATED.TRANSACTIONS', code: 100 }] }));case 11:_context4.next = 13;return (


                  _models_Account__WEBPACK_IMPORTED_MODULE_8__["default"].query().deleteById(account.id));case 13:return _context4.abrupt("return",

                res.status(200).send());case 14:case "end":return _context4.stop();}}}, _callee4);}));function handler(_x7, _x8) {return _handler4.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                  * Retrieve accounts list.
                                                                                                                                                                                                  */
  getAccountsList: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["query"])('display_type').optional().isIn(['tree', 'flat']),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["query"])('account_types').optional().isArray(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["query"])('account_types.*').optional().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["query"])('custom_view_id').optional().isNumeric().toInt()],

    handler: function () {var _handler5 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee5(req, res) {var validationErrors, filter, errorReasons, viewConditionals, accountsResource, view, accounts, nestedAccounts, groupsAccounts, accountsList, flattenAccounts;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context5.next = 3;break;}return _context5.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 3:



                filter = _objectSpread({
                  account_types: [],
                  display_type: 'tree' },
                req.query);

                errorReasons = [];
                viewConditionals = [];_context5.next = 8;return (
                  _models_Resource__WEBPACK_IMPORTED_MODULE_13__["default"].query().where('name', 'accounts').first());case 8:accountsResource = _context5.sent;if (

                accountsResource) {_context5.next = 11;break;}return _context5.abrupt("return",
                res.status(400).send({
                  errors: [{ type: 'ACCOUNTS_RESOURCE_NOT_FOUND', code: 200 }] }));case 11:_context5.next = 13;return (


                  _models_View__WEBPACK_IMPORTED_MODULE_14__["default"].query().onBuild(function (builder) {
                    if (filter.custom_view_id) {
                      builder.where('id', filter.custom_view_id);
                    } else {
                      builder.where('favourite', true);
                    }
                    builder.where('resource_id', accountsResource.id);
                    builder.withGraphFetched('roles.field');
                    builder.withGraphFetched('columns');
                    builder.first();
                  }));case 13:view = _context5.sent;

                if (view && view.roles.length > 0) {
                  viewConditionals.push.apply(viewConditionals, _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(
                  Object(_lib_ViewRolesBuilder__WEBPACK_IMPORTED_MODULE_17__["mapViewRolesToConditionals"])(view.roles)));

                  if (!Object(_lib_ViewRolesBuilder__WEBPACK_IMPORTED_MODULE_17__["validateViewRoles"])(viewConditionals, view.rolesLogicExpression)) {
                    errorReasons.push({ type: 'VIEW.LOGIC.EXPRESSION.INVALID', code: 400 });
                  }
                }if (!(
                errorReasons.length > 0)) {_context5.next = 17;break;}return _context5.abrupt("return",
                res.status(400).send({ errors: errorReasons }));case 17:_context5.next = 19;return (

                  _models_Account__WEBPACK_IMPORTED_MODULE_8__["default"].query().onBuild(function (builder) {
                    builder.modify('filterAccountTypes', filter.account_types);
                    builder.withGraphFetched('type');

                    if (viewConditionals.length) {
                      builder.modify('viewRolesBuilder', viewConditionals, view.rolesLogicExpression);
                    }
                  }));case 19:accounts = _context5.sent;

                nestedAccounts = new _collection_NestedSet__WEBPACK_IMPORTED_MODULE_16__["default"](accounts, { parentId: 'parentAccountId' });
                groupsAccounts = nestedAccounts.toTree();
                accountsList = [];

                if (filter.display_type === 'tree') {
                  accountsList.push.apply(accountsList, _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(groupsAccounts));
                } else if (filter.display_type === 'flat') {
                  flattenAccounts = nestedAccounts.flattenTree(function (account, parentAccount) {
                    if (parentAccount) {
                      account.name = "".concat(parentAccount.name, " \u2015 ").concat(account.name);
                    }
                    return account;
                  });
                  accountsList.push.apply(accountsList, _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(flattenAccounts));
                }return _context5.abrupt("return",
                res.status(200).send(_objectSpread({
                  accounts: accountsList },
                view ? {
                  customViewId: view.id } :
                {})));case 25:case "end":return _context5.stop();}}}, _callee5);}));function handler(_x9, _x10) {return _handler5.apply(this, arguments);}return handler;}() },




  /**
                                                                                                                                                                                 * Re-calculates balance of the given account.
                                                                                                                                                                                 */
  recalcualteBalanace: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["param"])('id').isNumeric().toInt()],

    handler: function () {var _handler6 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee6(req, res) {var id, account, accountTransactions, journalEntries;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:
                id = req.params.id;_context6.next = 3;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_8__["default"].findById(id));case 3:account = _context6.sent;if (

                account) {_context6.next = 6;break;}return _context6.abrupt("return",
                res.status(400).send({
                  errors: [{ type: 'ACCOUNT.NOT.FOUND', code: 100 }] }));case 6:


                accountTransactions = _models_AccountTransaction__WEBPACK_IMPORTED_MODULE_10__["default"].query().
                where('account_id', account.id);

                journalEntries = new _services_Accounting_JournalPoster__WEBPACK_IMPORTED_MODULE_11__["default"]();
                journalEntries.loadFromCollection(accountTransactions);

                // Delete the balance of the given account id.
                _context6.next = 11;return _models_AccountBalance__WEBPACK_IMPORTED_MODULE_12__["default"].query().where('account_id', account.id)["delete"]();case 11:_context6.next = 13;return (


                  journalEntries.saveBalance());case 13:return _context6.abrupt("return",

                res.status(200).send());case 14:case "end":return _context6.stop();}}}, _callee6);}));function handler(_x11, _x12) {return _handler6.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                    * Active the given account.
                                                                                                                                                                                                    */
  activeAccount: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["param"])('id').exists().isNumeric().toInt()],

    handler: function () {var _handler7 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee7(req, res) {var id, account;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:
                id = req.params.id;_context7.next = 3;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_8__["default"].findById(id));case 3:account = _context7.sent;if (

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
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["param"])('id').exists().isNumeric().toInt()],

    handler: function () {var _handler8 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee8(req, res) {var id, account;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee8$(_context8) {while (1) {switch (_context8.prev = _context8.next) {case 0:
                id = req.params.id;_context8.next = 3;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_8__["default"].findById(id));case 3:account = _context8.sent;if (

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
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["param"])('id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["param"])('toAccount').exists().isNumeric().toInt()],

    handler: function () {var _handler9 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee9(req, res) {var validationErrors;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee9$(_context9) {while (1) {switch (_context9.prev = _context9.next) {case 0:
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["validationResult"])(req);if (

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
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('password').exists().isLength({ min: 4 })],

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
                  errors: [{ type: 'INVALID_DETAILS', code: 100 }] }));case 12:if (


                user.active) {_context.next = 14;break;}return _context.abrupt("return",
                res.boom.badRequest(null, {
                  errors: [{ type: 'USER_INACTIVE', code: 110 }] }));case 14:


                // user.update({ last_login_at: new Date() });

                token = jsonwebtoken__WEBPACK_IMPORTED_MODULE_8___default.a.sign({
                  email: user.email,
                  _id: user.id },
                JWT_SECRET_KEY, {
                  expiresIn: '1d' });return _context.abrupt("return",

                res.status(200).send({ token: token, user: user }));case 16:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },



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

/***/ "./src/http/controllers/Currencies.js":
/*!********************************************!*\
  !*** ./src/http/controllers/Currencies.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! express-validator */ "express-validator");
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(express_validator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/http/middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");




/* harmony default export */ __webpack_exports__["default"] = ({

  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_2___default.a.Router();

    router.get('/all',
    this.all.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_4__["default"])(this.all.handler));

    router.get('/registered',
    this.registered.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_4__["default"])(this.registered.handler));

    return router;
  },

  all: {
    validation: [],
    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(req, res) {return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:return _context.abrupt("return",

                res.status(200).send({
                  currencies: [
                  { currency_code: 'USD', currency_sign: '$' },
                  { currency_code: 'LYD', currency_sign: '' }] }));case 1:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },





  registered: {
    validation: [],
    handler: function () {var _handler2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(req, res) {return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:return _context2.abrupt("return",

                res.status(200).send({
                  currencies: [
                  { currency_code: 'USD', currency_sign: '$' },
                  { currency_code: 'LYD', currency_sign: '' }] }));case 1:case "end":return _context2.stop();}}}, _callee2);}));function handler(_x3, _x4) {return _handler2.apply(this, arguments);}return handler;}() } });

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
/* harmony import */ var _lib_ViewRolesBuilder__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @/lib/ViewRolesBuilder */ "./src/lib/ViewRolesBuilder/index.js");
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

    // router.get('/:id',
    //   this.getExpense.validation,
    //   asyncMiddleware(this.getExpense.handler));

    return router;
  },

  /**
      * Saves a new expense.
      */
  newExpense: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_6__["check"])('date').optional(),
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

    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee(req, res) {var validationErrors, form, errorReasons, paymentAccount, expenseAccount, expenseTransaction, journalEntries, creditEntry, debitEntry;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
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

                errorReasons = [];_context.next = 8;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_11__["default"].query().
                  findById(form.payment_account_id).first());case 8:paymentAccount = _context.sent;

                if (!paymentAccount) {
                  errorReasons.push({ type: 'PAYMENT.ACCOUNT.NOT.FOUND', code: 100 });
                }_context.next = 12;return (
                  _models_Account__WEBPACK_IMPORTED_MODULE_11__["default"].query().findById(form.expense_account_id).first());case 12:expenseAccount = _context.sent;

                if (!expenseAccount) {
                  errorReasons.push({ type: 'EXPENSE.ACCOUNT.NOT.FOUND', code: 200 });
                }
                // const customFields = new ResourceCustomFieldRepository(Expense);
                // await customFields.load();

                // if (customFields.validateExistCustomFields()) {
                //   errorReasons.push({ type: 'CUSTOM.FIELDS.SLUGS.NOT.EXISTS', code: 400 });
                // }
                if (!(errorReasons.length > 0)) {_context.next = 16;break;}return _context.abrupt("return",
                res.status(400).send({ errors: errorReasons }));case 16:_context.next = 18;return (

                  _models_Expense__WEBPACK_IMPORTED_MODULE_10__["default"].query().insertAndFetch(_objectSpread({},
                  Object(lodash__WEBPACK_IMPORTED_MODULE_8__["omit"])(form, ['custom_fields']))));case 18:expenseTransaction = _context.sent;

                // customFields.fillCustomFields(expenseTransaction.id, form.custom_fields);

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
                journalEntries.debit(debitEntry);_context.next = 26;return (

                  Promise.all([
                  // customFields.saveCustomFields(expenseTransaction.id),
                  journalEntries.saveEntries(),
                  journalEntries.saveBalance()]));case 26:return _context.abrupt("return",

                res.status(200).send({ id: expenseTransaction.id }));case 27:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },



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

    handler: function () {var _handler4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee5(req, res) {var validationErrors, filter, errorReasons, expenseResource, view, viewConditionals, expenses;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
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
                  errorReasons.push({ type: 'EXPENSE_RESOURCE_NOT_FOUND', code: 300 });
                }if (!(
                errorReasons.length > 0)) {_context5.next = 11;break;}return _context5.abrupt("return",
                res.status(400).send({ errors: errorReasons }));case 11:_context5.next = 13;return (

                  _models_View__WEBPACK_IMPORTED_MODULE_16__["default"].query().onBuild(function (builder) {
                    if (filter.custom_view_id) {
                      builder.where('id', filter.custom_view_id);
                    } else {
                      builder.where('favourite', true);
                    }
                    builder.where('resource_id', expenseResource.id);
                    builder.withGraphFetched('viewRoles.field');
                    builder.withGraphFetched('columns');

                    builder.first();
                  }));case 13:view = _context5.sent;
                viewConditionals = [];

                if (view && view.viewRoles.length > 0) {
                  viewConditionals = Object(_lib_ViewRolesBuilder__WEBPACK_IMPORTED_MODULE_19__["mapViewRolesToConditionals"])(view.viewRoles);

                  if (!Object(_lib_ViewRolesBuilder__WEBPACK_IMPORTED_MODULE_19__["validateViewRoles"])(viewConditionals, view.rolesLogicExpression)) {
                    errorReasons.push({ type: 'VIEW.LOGIC.EXPRESSION.INVALID', code: 400 });
                  }
                }
                if (!view && filter.custom_view_id) {
                  errorReasons.push({ type: 'VIEW_NOT_FOUND', code: 100 });
                }if (!(
                errorReasons.length > 0)) {_context5.next = 19;break;}return _context5.abrupt("return",
                res.boom.badRequest(null, { errors: errorReasons }));case 19:_context5.next = 21;return (


                  _models_Expense__WEBPACK_IMPORTED_MODULE_10__["default"].query().onBuild(function (builder) {
                    builder.withGraphFetched('paymentAccount');
                    builder.withGraphFetched('expenseAccount');
                    builder.withGraphFetched('user');

                    if (viewConditionals.length) {
                      builder.modify('viewRolesBuilder', viewConditionals, view.rolesLogicExpression);
                    }
                    builder.modify('filterByAmountRange', filter.range_from, filter.to_range);
                    builder.modify('filterByDateRange', filter.date_from, filter.date_to);
                    builder.modify('filterByExpenseAccount', filter.expense_account_id);
                    builder.modify('filterByPaymentAccount', filter.payment_account_id);
                    builder.modify('orderBy', filter.column_sort_order, filter.sort_order);
                  }).page(filter.page - 1, filter.page_size));case 21:expenses = _context5.sent;return _context5.abrupt("return",

                res.status(200).send(_objectSpread({},
                view ? {
                  customViewId: view.id,
                  viewColumns: view.columns,
                  viewConditionals: viewConditionals } :
                {}, {
                  expenses: expenses })));case 23:case "end":return _context5.stop();}}}, _callee5);}));function handler(_x8, _x9) {return _handler4.apply(this, arguments);}return handler;}() },




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
                  query: _objectSpread({}, filter),
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

                res.status(200).sends({ options: options }));case 7:case "end":return _context2.stop();}}}, _callee2);}));function handler(_x3, _x4) {return _handler2.apply(this, arguments);}return handler;}() } });

/***/ }),

/***/ "./src/http/controllers/Resources.js":
/*!*******************************************!*\
  !*** ./src/http/controllers/Resources.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! express-validator */ "express-validator");
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(express_validator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/http/middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
/* harmony import */ var _http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/http/middleware/jwtAuth */ "./src/http/middleware/jwtAuth.js");
/* harmony import */ var _models_Resource__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/models/Resource */ "./src/models/Resource.js");






/* harmony default export */ __webpack_exports__["default"] = ({
  /**
                  * Router constructor.
                  */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_2___default.a.Router();

    router.use(_http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_5__["default"]);

    router.get('/:resource_slug/columns',
    this.resourceColumns.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_4__["default"])(this.resourceColumns.handler));

    router.get('/:resource_slug/fields',
    this.resourceFields.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_4__["default"])(this.resourceFields.handler));

    return router;
  },

  /**
      * Retrieve resource columns of the given resource.
      */
  resourceColumns: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["param"])('resource_slug').trim().escape().exists()],

    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(req, res) {var resourceSlug, resource, resourceFields;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                resourceSlug = req.params.resource_slug;_context.next = 3;return (

                  _models_Resource__WEBPACK_IMPORTED_MODULE_6__["default"].query().
                  where('name', resourceSlug).
                  withGraphFetched('fields').
                  first());case 3:resource = _context.sent;if (

                resource) {_context.next = 6;break;}return _context.abrupt("return",
                res.status(400).send({
                  errors: [{ type: 'RESOURCE.SLUG.NOT.FOUND', code: 200 }] }));case 6:


                resourceFields = resource.fields.
                filter(function (field) {return field.columnable;}).
                map(function (field) {return {
                    id: field.id,
                    label: field.labelName,
                    key: field.key };});return _context.abrupt("return",


                res.status(200).send({
                  resource_columns: resourceFields,
                  resource_slug: resourceSlug }));case 8:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },




  /**
                                                                                                                                                                                                       * Retrieve resource fields of the given resource.
                                                                                                                                                                                                       */
  resourceFields: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["param"])('resource_slug').trim().escape().exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["query"])('predefined').optional().isBoolean().toBoolean(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_3__["query"])('builtin').optional().isBoolean().toBoolean()],

    handler: function () {var _handler2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(req, res) {var resourceSlug, resource;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                resourceSlug = req.params.resource_slug;_context2.next = 3;return (

                  _models_Resource__WEBPACK_IMPORTED_MODULE_6__["default"].query().
                  where('name', resourceSlug).
                  withGraphFetched('fields').
                  first());case 3:resource = _context2.sent;if (

                resource) {_context2.next = 6;break;}return _context2.abrupt("return",
                res.status(400).send({
                  errors: [{ type: 'RESOURCE.SLUG.NOT.FOUND', code: 200 }] }));case 6:return _context2.abrupt("return",


                res.status(200).send({
                  resource_fields: resource.fields,
                  resource_slug: resourceSlug }));case 7:case "end":return _context2.stop();}}}, _callee2);}));function handler(_x3, _x4) {return _handler2.apply(this, arguments);}return handler;}() } });

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
    // const permit = Authorization('users');

    router.use(_http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_7__["default"]);

    router.post('/',
    // permit('create'),
    this.newUser.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.newUser.handler));

    router.post('/:id',
    // permit('create', 'edit'),
    this.editUser.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.editUser.handler));

    router.get('/',
    // permit('view'),
    this.listUsers.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.listUsers.handler));

    router.get('/:id',
    // permit('view'),
    this.getUser.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.getUser.handler));

    router["delete"]('/:id',
    // permit('create', 'edit', 'delete'),
    this.deleteUser.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.deleteUser.handler));

    return router;
  },

  /**
      * Creates a new user.
      */
  newUser: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('first_name').trim().escape().exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["check"])('last_name').trim().escape().exists(),
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

                  _models_User__WEBPACK_IMPORTED_MODULE_5__["default"].query().
                  where('email', email).
                  orWhere('phone_number', phoneNumber));case 6:foundUsers = _context.sent;

                foundUserEmail = foundUsers.find(function (u) {return u.email === email;});
                foundUserPhone = foundUsers.find(function (u) {return u.phoneNumber === phoneNumber;});

                errorReasons = [];

                if (foundUserEmail) {
                  errorReasons.push({ type: 'EMAIL_ALREADY_EXIST', code: 100 });
                }
                if (foundUserPhone) {
                  errorReasons.push({ type: 'PHONE_NUMBER_ALREADY_EXIST', code: 120 });
                }if (!(
                errorReasons.length > 0)) {_context.next = 14;break;}return _context.abrupt("return",
                res.boom.badRequest(null, { errors: errorReasons }));case 14:_context.next = 16;return (


                  _models_User__WEBPACK_IMPORTED_MODULE_5__["default"].query().insert({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    phone_number: req.body.phone_number,
                    active: req.body.status }));case 16:user = _context.sent;return _context.abrupt("return",


                res.status(200).send({ user: user }));case 18:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                            * Edit details of the given user.
                                                                                                                                                                                                            */
  editUser: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["param"])('id').exists().isNumeric().toInt(),
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


                  _models_User__WEBPACK_IMPORTED_MODULE_5__["default"].query().where('id', id).first());case 6:user = _context2.sent;if (

                user) {_context2.next = 9;break;}return _context2.abrupt("return",
                res.boom.notFound());case 9:_req$body2 =

                req.body, email = _req$body2.email, phoneNumber = _req$body2.phone_number;_context2.next = 12;return (

                  _models_User__WEBPACK_IMPORTED_MODULE_5__["default"].query().
                  whereNot('id', id).
                  andWhere(function (q) {
                    q.where('email', email);
                    q.orWhere('phone_number', phoneNumber);
                  }));case 12:foundUsers = _context2.sent;

                foundUserEmail = foundUsers.find(function (u) {return u.email === email;});
                foundUserPhone = foundUsers.find(function (u) {return u.phoneNumber === phoneNumber;});

                errorReasons = [];

                if (foundUserEmail) {
                  errorReasons.push({ type: 'EMAIL_ALREADY_EXIST', code: 100 });
                }
                if (foundUserPhone) {
                  errorReasons.push({ type: 'PHONE_NUMBER_ALREADY_EXIST', code: 120 });
                }if (!(
                errorReasons.length > 0)) {_context2.next = 20;break;}return _context2.abrupt("return",
                res.boom.badRequest(null, { errors: errorReasons }));case 20:_context2.next = 22;return (


                  _models_User__WEBPACK_IMPORTED_MODULE_5__["default"].query().where('id', id).update({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    phone_number: req.body.phone_number,
                    active: req.body.status }));case 22:return _context2.abrupt("return",

                res.status(200).send());case 23:case "end":return _context2.stop();}}}, _callee2);}));function handler(_x3, _x4) {return _handler2.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                  * Soft deleting the given user.
                                                                                                                                                                                                  */
  deleteUser: {
    validation: [],
    handler: function () {var _handler3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(req, res) {var id, user;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                id = req.params.id;_context3.next = 3;return (
                  _models_User__WEBPACK_IMPORTED_MODULE_5__["default"].query().where('id', id).first());case 3:user = _context3.sent;if (

                user) {_context3.next = 6;break;}return _context3.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'USER_NOT_FOUND', code: 100 }] }));case 6:_context3.next = 8;return (


                  _models_User__WEBPACK_IMPORTED_MODULE_5__["default"].query().where('id', id)["delete"]());case 8:return _context3.abrupt("return",

                res.status(200).send());case 9:case "end":return _context3.stop();}}}, _callee3);}));function handler(_x5, _x6) {return _handler3.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                 * Retrieve user details of the given user id.
                                                                                                                                                                                                 */
  getUser: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["param"])('id').exists().isNumeric().toInt()],

    handler: function () {var _handler4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(req, res) {var id, user;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                id = req.params.id;_context4.next = 3;return (
                  _models_User__WEBPACK_IMPORTED_MODULE_5__["default"].query().where('id', id).first());case 3:user = _context4.sent;if (

                user) {_context4.next = 6;break;}return _context4.abrupt("return",
                res.boom.notFound());case 6:return _context4.abrupt("return",

                res.status(200).send({ user: user }));case 7:case "end":return _context4.stop();}}}, _callee4);}));function handler(_x7, _x8) {return _handler4.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                               * Retrieve the list of users.
                                                                                                                                                                                                               */
  listUsers: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["query"])('page_size').optional().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_4__["query"])('page').optional().isNumeric().toInt()],

    handler: function () {var _handler5 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee5(req, res) {var filter, users;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
                filter = _objectSpread({
                  first_name: '',
                  last_name: '',
                  email: '',
                  phone_number: '',

                  page_size: 10,
                  page: 1 },
                req.query);_context5.next = 3;return (


                  _models_User__WEBPACK_IMPORTED_MODULE_5__["default"].query().
                  page(filter.page - 1, filter.page_size));case 3:users = _context5.sent;return _context5.abrupt("return",

                res.status(200).send({ users: users }));case 5:case "end":return _context5.stop();}}}, _callee5);}));function handler(_x9, _x10) {return _handler5.apply(this, arguments);}return handler;}() } });

/***/ }),

/***/ "./src/http/controllers/Views.js":
/*!***************************************!*\
  !*** ./src/http/controllers/Views.js ***!
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
/* harmony import */ var _models_ViewColumn__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/models/ViewColumn */ "./src/models/ViewColumn.js");
/* harmony import */ var _lib_ViewRolesBuilder__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @/lib/ViewRolesBuilder */ "./src/lib/ViewRolesBuilder/index.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}










/* harmony default export */ __webpack_exports__["default"] = ({
  resource: 'items',

  /**
                      * Router constructor.
                      */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_4___default.a.Router();

    router.use(_http_middleware_jwtAuth__WEBPACK_IMPORTED_MODULE_7__["default"]);

    router.get('/',
    this.listViews.validation,
    Object(_http_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_6__["default"])(this.listViews.handler));

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
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["oneOf"])([
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('resource_name').exists().trim().escape()],
    [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["query"])('resource_id').exists().isNumeric().toInt()])],


    handler: function () {var _handler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(req, res) {var filter, resource, views;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                filter = _objectSpread({}, req.query);_context.next = 3;return (

                  _models_Resource__WEBPACK_IMPORTED_MODULE_8__["default"].query().onBuild(function (builder) {
                    if (filter.resource_id) {
                      builder.where('id', filter.resource_id);
                    }
                    if (filter.resource_name) {
                      builder.where('name', filter.resource_name);
                    }
                    builder.first();
                  }));case 3:resource = _context.sent;_context.next = 6;return (

                  _models_View__WEBPACK_IMPORTED_MODULE_9__["default"].query().where('resource_id', resource.id));case 6:views = _context.sent;return _context.abrupt("return",

                res.status(200).send({ views: views }));case 8:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                             * Retrieve view details of the given view id.
                                                                                                                                                                                                             */
  getView: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["param"])('view_id').exists().isNumeric().toInt()],

    handler: function () {var _handler2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(req, res) {var viewId, view;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                viewId = req.params.view_id;_context2.next = 3;return (
                  _models_View__WEBPACK_IMPORTED_MODULE_9__["default"].query().
                  where('id', viewId).
                  withGraphFetched('resource').
                  withGraphFetched('columns').
                  withGraphFetched('roles.field').
                  first());case 3:view = _context2.sent;if (

                view) {_context2.next = 6;break;}return _context2.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'VIEW_NOT_FOUND', code: 100 }] }));case 6:return _context2.abrupt("return",


                res.status(200).send({ view: view.toJSON() }));case 7:case "end":return _context2.stop();}}}, _callee2);}));function handler(_x3, _x4) {return _handler2.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                        * Delete the given view of the resource.
                                                                                                                                                                                                                        */
  deleteView: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["param"])('view_id').exists().isNumeric().toInt()],

    handler: function () {var _handler3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(req, res) {var viewId, view;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                viewId = req.params.view_id;_context3.next = 3;return (
                  _models_View__WEBPACK_IMPORTED_MODULE_9__["default"].query().findById(viewId));case 3:view = _context3.sent;if (

                view) {_context3.next = 6;break;}return _context3.abrupt("return",
                res.boom.notFound(null, {
                  errors: [{ type: 'VIEW_NOT_FOUND', code: 100 }] }));case 6:if (!


                view.predefined) {_context3.next = 8;break;}return _context3.abrupt("return",
                res.boom.badRequest(null, {
                  errors: [{ type: 'PREDEFINED_VIEW', code: 200 }] }));case 8:_context3.next = 10;return (


                  Promise.all([
                  view.$relatedQuery('roles')["delete"](),
                  view.$relatedQuery('columns')["delete"]()]));case 10:_context3.next = 12;return (

                  _models_View__WEBPACK_IMPORTED_MODULE_9__["default"].query().where('id', view.id)["delete"]());case 12:return _context3.abrupt("return",

                res.status(200).send({ id: view.id }));case 13:case "end":return _context3.stop();}}}, _callee3);}));function handler(_x5, _x6) {return _handler3.apply(this, arguments);}return handler;}() },



  /**
                                                                                                                                                                                                                 * Creates a new view.
                                                                                                                                                                                                                 */
  createView: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('resource_name').exists().escape().trim(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('name').exists().escape().trim(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('logic_expression').exists().trim().escape(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles').isArray({ min: 1 }),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles.*.field_key').exists().escape().trim(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles.*.comparator').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles.*.value').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles.*.index').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('columns').exists().isArray({ min: 1 }),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('columns.*.key').exists().escape().trim(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('columns.*.index').exists().isNumeric().toInt()],

    handler: function () {var _handler4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(req, res) {var validationErrors, form, resource, errorReasons, fieldsSlugs, resourceFields, resourceFieldsKeys, resourceFieldsKeysMap, columnsKeys, notFoundFields, notFoundColumns, view, saveViewRolesOpers;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
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
                fieldsSlugs = form.roles.map(function (role) {return role.field_key;});_context4.next = 13;return (

                  resource.$relatedQuery('fields'));case 13:resourceFields = _context4.sent;
                resourceFieldsKeys = resourceFields.map(function (f) {return f.key;});
                resourceFieldsKeysMap = new Map(resourceFields.map(function (field) {return [field.key, field];}));
                columnsKeys = form.columns.map(function (c) {return c.key;});

                // The difference between the stored resource fields and submit fields keys.
                notFoundFields = Object(lodash__WEBPACK_IMPORTED_MODULE_3__["difference"])(fieldsSlugs, resourceFieldsKeys);

                if (notFoundFields.length > 0) {
                  errorReasons.push({ type: 'RESOURCE_FIELDS_NOT_EXIST', code: 100, fields: notFoundFields });
                }
                // The difference between the stored resource fields and the submit columns keys.
                notFoundColumns = Object(lodash__WEBPACK_IMPORTED_MODULE_3__["difference"])(columnsKeys, resourceFieldsKeys);

                if (notFoundColumns.length > 0) {
                  errorReasons.push({ type: 'COLUMNS_NOT_EXIST', code: 200, columns: notFoundColumns });
                }
                // Validates the view conditional logic expression.
                if (!Object(_lib_ViewRolesBuilder__WEBPACK_IMPORTED_MODULE_12__["validateViewLogicExpression"])(form.logic_expression, form.roles.map(function (r) {return r.index;}))) {
                  errorReasons.push({ type: 'VIEW.ROLES.LOGIC.EXPRESSION.INVALID', code: 400 });
                }if (!(
                errorReasons.length > 0)) {_context4.next = 24;break;}return _context4.abrupt("return",
                res.boom.badRequest(null, { errors: errorReasons }));case 24:_context4.next = 26;return (



                  _models_View__WEBPACK_IMPORTED_MODULE_9__["default"].query().insert({
                    name: form.name,
                    predefined: false,
                    resource_id: resource.id,
                    roles_logic_expression: form.logic_expression }));case 26:view = _context4.sent;

                // Save view roles async operations.
                saveViewRolesOpers = [];

                form.roles.forEach(function (role) {
                  var fieldModel = resourceFieldsKeysMap.get(role.field_key);

                  var saveViewRoleOper = _models_ViewRole__WEBPACK_IMPORTED_MODULE_10__["default"].query().insert(_objectSpread({},
                  Object(lodash__WEBPACK_IMPORTED_MODULE_3__["pick"])(role, ['comparator', 'value', 'index']), {
                    field_id: fieldModel.id,
                    view_id: view.id }));

                  saveViewRolesOpers.push(saveViewRoleOper);
                });

                form.columns.forEach(function (column) {
                  var fieldModel = resourceFieldsKeysMap.get(column.key);

                  var saveViewColumnOper = _models_ViewColumn__WEBPACK_IMPORTED_MODULE_11__["default"].query().insert({
                    field_id: fieldModel.id,
                    view_id: view.id,
                    index: column.index });

                  saveViewRolesOpers.push(saveViewColumnOper);
                });_context4.next = 32;return (
                  Promise.all(saveViewRolesOpers));case 32:return _context4.abrupt("return",

                res.status(200).send({ id: view.id }));case 33:case "end":return _context4.stop();}}}, _callee4);}));function handler(_x7, _x8) {return _handler4.apply(this, arguments);}return handler;}() },



  editView: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["param"])('view_id').exists().isNumeric().toInt(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('label').exists().escape().trim(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('columns').isArray({ min: 3 }),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles').isArray(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles.*.field').exists().escape().trim(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles.*.comparator').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles.*.value').exists(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["check"])('roles.*.index').exists().isNumeric().toInt()],

    handler: function () {var _handler5 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee5(req, res) {var viewId, validationErrors, view;return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
                viewId = req.params.view_id;
                validationErrors = Object(express_validator__WEBPACK_IMPORTED_MODULE_5__["validationResult"])(req);if (

                validationErrors.isEmpty()) {_context5.next = 4;break;}return _context5.abrupt("return",
                res.boom.badData(null, _objectSpread({
                  code: 'validation_error' }, validationErrors)));case 4:_context5.next = 6;return (


                  _models_View__WEBPACK_IMPORTED_MODULE_9__["default"].where('id', viewId).fetch());case 6:view = _context5.sent;if (

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
/* harmony import */ var _http_controllers_AccountTypes__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/http/controllers/AccountTypes */ "./src/http/controllers/AccountTypes.js");
/* harmony import */ var _http_controllers_AccountOpeningBalance__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/http/controllers/AccountOpeningBalance */ "./src/http/controllers/AccountOpeningBalance.js");
/* harmony import */ var _http_controllers_Views__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/http/controllers/Views */ "./src/http/controllers/Views.js");
/* harmony import */ var _http_controllers_Fields__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/http/controllers/Fields */ "./src/http/controllers/Fields.js");
/* harmony import */ var _http_controllers_Accounting__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/http/controllers/Accounting */ "./src/http/controllers/Accounting.js");
/* harmony import */ var _http_controllers_FinancialStatements__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/http/controllers/FinancialStatements */ "./src/http/controllers/FinancialStatements.js");
/* harmony import */ var _http_controllers_Expenses__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @/http/controllers/Expenses */ "./src/http/controllers/Expenses.js");
/* harmony import */ var _http_controllers_Options__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @/http/controllers/Options */ "./src/http/controllers/Options.js");
/* harmony import */ var _http_controllers_Budget__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @/http/controllers/Budget */ "./src/http/controllers/Budget.js");
/* harmony import */ var _http_controllers_BudgetReports__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @/http/controllers/BudgetReports */ "./src/http/controllers/BudgetReports.js");
/* harmony import */ var _http_controllers_Currencies__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @/http/controllers/Currencies */ "./src/http/controllers/Currencies.js");
/* harmony import */ var _http_controllers_Customers__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @/http/controllers/Customers */ "./src/http/controllers/Customers.js");
/* harmony import */ var _http_controllers_Suppliers__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @/http/controllers/Suppliers */ "./src/http/controllers/Suppliers.js");
/* harmony import */ var _http_controllers_Bills__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @/http/controllers/Bills */ "./src/http/controllers/Bills.js");
/* harmony import */ var _controllers_CurrencyAdjustment__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./controllers/CurrencyAdjustment */ "./src/http/controllers/CurrencyAdjustment.js");
/* harmony import */ var _controllers_Resources__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./controllers/Resources */ "./src/http/controllers/Resources.js");
// import OAuth2 from '@/http/controllers/OAuth2';






















// import SalesReports from '@/http/controllers/SalesReports';
// import PurchasesReports from '@/http/controllers/PurchasesReports';

/* harmony default export */ __webpack_exports__["default"] = (function (app) {
  // app.use('/api/oauth2', OAuth2.router());
  app.use('/api/auth', _http_controllers_Authentication__WEBPACK_IMPORTED_MODULE_0__["default"].router());
  app.use('/api/currencies', _http_controllers_Currencies__WEBPACK_IMPORTED_MODULE_16__["default"].router());
  app.use('/api/users', _http_controllers_Users__WEBPACK_IMPORTED_MODULE_1__["default"].router());
  app.use('/api/roles', _http_controllers_Roles__WEBPACK_IMPORTED_MODULE_2__["default"].router());
  app.use('/api/accounts', _http_controllers_Accounts__WEBPACK_IMPORTED_MODULE_5__["default"].router());
  app.use('/api/account_types', _http_controllers_AccountTypes__WEBPACK_IMPORTED_MODULE_6__["default"].router());
  app.use('/api/accounting', _http_controllers_Accounting__WEBPACK_IMPORTED_MODULE_10__["default"].router());
  app.use('/api/accounts_opening_balances', _http_controllers_AccountOpeningBalance__WEBPACK_IMPORTED_MODULE_7__["default"].router());
  app.use('/api/views', _http_controllers_Views__WEBPACK_IMPORTED_MODULE_8__["default"].router());
  app.use('/api/fields', _http_controllers_Fields__WEBPACK_IMPORTED_MODULE_9__["default"].router());
  app.use('/api/items', _http_controllers_Items__WEBPACK_IMPORTED_MODULE_3__["default"].router());
  app.use('/api/item_categories', _http_controllers_ItemCategories__WEBPACK_IMPORTED_MODULE_4__["default"].router());
  app.use('/api/expenses', _http_controllers_Expenses__WEBPACK_IMPORTED_MODULE_12__["default"].router());
  app.use('/api/financial_statements', _http_controllers_FinancialStatements__WEBPACK_IMPORTED_MODULE_11__["default"].router());
  app.use('/api/options', _http_controllers_Options__WEBPACK_IMPORTED_MODULE_13__["default"].router());
  app.use('/api/budget_reports', _http_controllers_BudgetReports__WEBPACK_IMPORTED_MODULE_15__["default"].router());
  // app.use('/api/customers', Customers.router());
  // app.use('/api/suppliers', Suppliers.router());
  // app.use('/api/bills', Bills.router());
  app.use('/api/budget', _http_controllers_Budget__WEBPACK_IMPORTED_MODULE_14__["default"].router());
  app.use('/api/resources', _controllers_Resources__WEBPACK_IMPORTED_MODULE_21__["default"].router());
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

/***/ "./src/lib/LogicEvaluation/Lexer.js":
/*!******************************************!*\
  !*** ./src/lib/LogicEvaluation/Lexer.js ***!
  \******************************************/
/*! exports provided: Lexer, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Lexer", function() { return Lexer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return token; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);

var OperationType = {
  LOGIC: 'LOGIC',
  STRING: 'STRING',
  COMPARISON: 'COMPARISON',
  MATH: 'MATH' };


var Lexer = /*#__PURE__*/function () {_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Lexer, null, [{ key: "optable",
    // operation table
    get: function get() {
      return {
        '=': OperationType.LOGIC,
        '&': OperationType.LOGIC,
        '|': OperationType.LOGIC,
        '?': OperationType.LOGIC,
        ':': OperationType.LOGIC,

        '\'': OperationType.STRING,
        '"': OperationType.STRING,

        '!': OperationType.COMPARISON,
        '>': OperationType.COMPARISON,
        '<': OperationType.COMPARISON,

        '(': OperationType.MATH,
        ')': OperationType.MATH,
        '+': OperationType.MATH,
        '-': OperationType.MATH,
        '*': OperationType.MATH,
        '/': OperationType.MATH,
        '%': OperationType.MATH };

    }

    /**
       * Constructor
       * @param {*} expression -
       */ }]);
  function Lexer(expression) {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Lexer);
    this.currentIndex = 0;
    this.input = expression;
    this.tokenList = [];
  }_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Lexer, [{ key: "getTokens", value: function getTokens()

    {
      var tok;
      do {
        // read current token, so step should be -1
        tok = this.pickNext(-1);
        var pos = this.currentIndex;
        switch (Lexer.optable[tok]) {
          case OperationType.LOGIC:
            // == && || ===
            this.readLogicOpt(tok);
            break;

          case OperationType.STRING:
            this.readString(tok);
            break;

          case OperationType.COMPARISON:
            this.readCompare(tok);
            break;

          case OperationType.MATH:
            this.receiveToken();
            break;

          default:
            this.readValue(tok);}


        // if the pos not changed, this loop will go into a infinite loop, every step of while loop,
        // we must move the pos forward
        // so here we should throw error, for example `1 & 2`
        if (pos === this.currentIndex && tok !== undefined) {
          var err = new Error("unkonw token ".concat(tok, " from input string ").concat(this.input));
          err.name = 'UnknowToken';
          throw err;
        }
      } while (tok !== undefined);

      return this.tokenList;
    }

    /**
       * read next token, the index param can set next step, default go foward 1 step
       *
       * @param index next postion
       */ }, { key: "pickNext", value: function pickNext()
    {var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return this.input[index + this.currentIndex + 1];
    }

    /**
       * Store token into result tokenList, and move the pos index
       *
       * @param index
       */ }, { key: "receiveToken", value: function receiveToken()
    {var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var tok = this.input.slice(this.currentIndex, this.currentIndex + index).trim();
      // skip empty string
      if (tok) {
        this.tokenList.push(tok);
      }

      this.currentIndex += index;
    }

    // ' or "
  }, { key: "readString", value: function readString(tok) {
      var next;
      var index = 0;
      do {
        next = this.pickNext(index);
        index += 1;
      } while (next !== tok && next !== undefined);
      this.receiveToken(index + 1);
    }

    // > or < or >= or <= or !==
    // tok in (>, <, !)
  }, { key: "readCompare", value: function readCompare(tok) {
      if (this.pickNext() !== '=') {
        this.receiveToken(1);
        return;
      }
      // !==
      if (tok === '!' && this.pickNext(1) === '=') {
        this.receiveToken(3);
        return;
      }
      this.receiveToken(2);
    }

    // === or ==
    // && ||
  }, { key: "readLogicOpt", value: function readLogicOpt(tok) {
      if (this.pickNext() === tok) {
        // ===
        if (tok === '=' && this.pickNext(1) === tok) {
          return this.receiveToken(3);
        }
        // == && ||
        return this.receiveToken(2);
      }
      // handle as &&
      // a ? b : c is equal to a && b || c
      if (tok === '?' || tok === ':') {
        return this.receiveToken(1);
      }
    } }, { key: "readValue", value: function readValue(

    tok) {
      if (!tok) {
        return;
      }

      var index = 0;
      while (!Lexer.optable[tok] && tok !== undefined) {
        tok = this.pickNext(index);
        index += 1;
      }
      this.receiveToken(index);
    } }]);return Lexer;}();


function token(expression) {
  var lexer = new Lexer(expression);
  return lexer.getTokens();
}

/***/ }),

/***/ "./src/lib/LogicEvaluation/Parser.js":
/*!*******************************************!*\
  !*** ./src/lib/LogicEvaluation/Parser.js ***!
  \*******************************************/
/*! exports provided: OPERATION, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OPERATION", function() { return OPERATION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Parser; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
var OPERATION = {
  '!': 5,
  '*': 4,
  '/': 4,
  '%': 4,
  '+': 3,
  '-': 3,
  '>': 2,
  '<': 2,
  '>=': 2,
  '<=': 2,
  '===': 2,
  '!==': 2,
  '==': 2,
  '!=': 2,
  '&&': 1,
  '||': 1,
  '?': 1,
  ':': 1 };


// export interface Node {
//   left: Node | string | null;
//   right: Node | string | null;
//   operation: string;
//   grouped?: boolean;
// };
var
Parser = /*#__PURE__*/function () {

  function Parser(token) {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Parser);
    this.index = -1;
    this.blockLevel = 0;
    this.token = token;
  }

  /**
     * 
     * @return {Node | string} =- 
     */_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Parser, [{ key: "parse", value: function parse()
    {
      var tok;
      var root = {
        left: null,
        right: null,
        operation: null };


      do {
        tok = this.parseStatement();

        if (tok === null || tok === undefined) {
          break;
        }

        if (root.left === null) {
          root.left = tok;
          root.operation = this.nextToken();

          if (!root.operation) {
            return tok;
          }

          root.right = this.parseStatement();
        } else {
          if (typeof tok !== 'string') {
            throw new Error('operation must be string, but get ' + JSON.stringify(tok));
          }
          root = this.addNode(tok, this.parseStatement(), root);
        }
      } while (tok);

      return root;
    } }, { key: "nextToken", value: function nextToken()

    {
      this.index += 1;
      return this.token[this.index];
    } }, { key: "prevToken", value: function prevToken()

    {
      return this.token[this.index - 1];
    }

    /**
       * 
       * @param {string} operation 
       * @param {Node|String|null} right 
       * @param {Node} root 
       */ }, { key: "addNode", value: function addNode(
    operation, right, root) {
      var pre = root;

      if (this.compare(pre.operation, operation) < 0 && !pre.grouped) {

        while (pre.right !== null &&
        typeof pre.right !== 'string' &&
        this.compare(pre.right.operation, operation) < 0 && !pre.right.grouped) {
          pre = pre.right;
        }

        pre.right = {
          operation: operation,
          left: pre.right,
          right: right };

        return root;
      }
      return {
        left: pre,
        right: right,
        operation: operation };

    }

    /**
       * 
       * @param {String} a 
       * @param {String} b 
       */ }, { key: "compare", value: function compare(
    a, b) {
      if (!OPERATION.hasOwnProperty(a) || !OPERATION.hasOwnProperty(b)) {
        throw new Error("unknow operation ".concat(a, " or ").concat(b));
      }
      return OPERATION[a] - OPERATION[b];
    }

    /**
       * @return string | Node | null
       */ }, { key: "parseStatement", value: function parseStatement()
    {
      var token = this.nextToken();
      if (token === '(') {
        this.blockLevel += 1;
        var node = this.parse();
        this.blockLevel -= 1;

        if (typeof node !== 'string') {
          node.grouped = true;
        }
        return node;
      }

      if (token === ')') {
        return null;
      }

      if (token === '!') {
        return { left: null, operation: token, right: this.parseStatement() };
      }

      // 3 > -12 or -12 + 10
      if (token === '-' && (OPERATION[this.prevToken()] > 0 || this.prevToken() === undefined)) {
        return { left: '0', operation: token, right: this.parseStatement(), grouped: true };
      }

      return token;
    } }]);return Parser;}();

/***/ }),

/***/ "./src/lib/LogicEvaluation/QueryParser.js":
/*!************************************************!*\
  !*** ./src/lib/LogicEvaluation/QueryParser.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return QueryParser; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "@babel/runtime/helpers/classCallCheck");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "@babel/runtime/helpers/createClass");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Parser */ "./src/lib/LogicEvaluation/Parser.js");
var

QueryParser = /*#__PURE__*/function () {

  function QueryParser(tree, queries) {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, QueryParser);
    this.tree = tree;
    this.queries = queries;
    this.query = null;
  }_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(QueryParser, [{ key: "setQuery", value: function setQuery(

    query) {
      this.query = query.clone();
    } }, { key: "parse", value: function parse()

    {
      return this.parseNode(this.tree);
    } }, { key: "parseNode", value: function parseNode(

    node) {
      if (typeof node === 'string') {
        var nodeQuery = this.getQuery(node);
        return function (query) {nodeQuery(query);};
      }
      if (_Parser__WEBPACK_IMPORTED_MODULE_2__["OPERATION"][node.operation] === undefined) {
        throw new Error("unknow expression ".concat(node.operation));
      }
      var leftQuery = this.getQuery(node.left);
      var rightQuery = this.getQuery(node.right);

      switch (node.operation) {
        case '&&':
        case 'AND':
        default:
          return function (nodeQuery) {return nodeQuery.where(function (query) {
              query.where(function (q) {leftQuery(q);});
              query.andWhere(function (q) {rightQuery(q);});
            });};
        case '||':
        case 'OR':
          return function (nodeQuery) {return nodeQuery.where(function (query) {
              query.where(function (q) {leftQuery(q);});
              query.orWhere(function (q) {rightQuery(q);});
            });};}

    } }, { key: "getQuery", value: function getQuery(

    node) {
      if (typeof node !== 'string' && node !== null) {
        return this.parseNode(node);
      }
      var value = parseFloat(node);

      if (!isNaN(value)) {
        if (typeof this.queries[node] === 'undefined') {
          throw new Error("unknow query under index ".concat(node));
        }
        return this.queries[node];
      }
      return null;
    } }]);return QueryParser;}();

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

/***/ "./src/lib/ViewRolesBuilder/index.js":
/*!*******************************************!*\
  !*** ./src/lib/ViewRolesBuilder/index.js ***!
  \*******************************************/
/*! exports provided: buildRoleQuery, viewRolesBuilder, validateViewLogicExpression, validateViewRoles, mapViewRolesToConditionals */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildRoleQuery", function() { return buildRoleQuery; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "viewRolesBuilder", function() { return viewRolesBuilder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateViewLogicExpression", function() { return validateViewLogicExpression; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateViewRoles", function() { return validateViewRoles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapViewRolesToConditionals", function() { return mapViewRolesToConditionals; });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_LogicEvaluation_Lexer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/LogicEvaluation/Lexer */ "./src/lib/LogicEvaluation/Lexer.js");
/* harmony import */ var _lib_LogicEvaluation_Parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/LogicEvaluation/Parser */ "./src/lib/LogicEvaluation/Parser.js");
/* harmony import */ var _lib_LogicEvaluation_QueryParser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/LogicEvaluation/QueryParser */ "./src/lib/LogicEvaluation/QueryParser.js");
/* harmony import */ var _data_ResourceFieldsKeys__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/data/ResourceFieldsKeys */ "./src/data/ResourceFieldsKeys.js");






//  const role = {
//   compatotor: '',
//   value: '',
//   columnKey: '',
//   columnSlug: '',
//   index: 1,
// }

function buildRoleQuery(role) {
  var columnName = _data_ResourceFieldsKeys__WEBPACK_IMPORTED_MODULE_4__["default"][role.columnKey];

  switch (role.comparator) {
    case 'equals':
    default:
      return function (builder) {
        builder.where(columnName, role.value);
      };
    case 'not_equal':
    case 'not_equals':
      return function (builder) {
        builder.whereNot(columnName, role.value);
      };}

}

/**
   * Builds database query from stored view roles.
   *
   * @param {Array} roles -
   * @return {Function}
   */
function viewRolesBuilder(roles) {var logicExpression = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var rolesIndexSet = {};

  roles.forEach(function (role) {
    rolesIndexSet[role.index] = buildRoleQuery(role);
  });
  // Lexer for logic expression.
  var lexer = new _lib_LogicEvaluation_Lexer__WEBPACK_IMPORTED_MODULE_1__["Lexer"](logicExpression);
  var tokens = lexer.getTokens();

  // Parse the logic expression.
  var parser = new _lib_LogicEvaluation_Parser__WEBPACK_IMPORTED_MODULE_2__["default"](tokens);
  var parsedTree = parser.parse();

  var queryParser = new _lib_LogicEvaluation_QueryParser__WEBPACK_IMPORTED_MODULE_3__["default"](parsedTree, rolesIndexSet);
  return queryParser.parse();
}

/**
   * Validates the view logic expression.
   * @param {String} logicExpression 
   * @param {Array} indexes 
   */
function validateViewLogicExpression(logicExpression, indexes) {
  var logicExpIndexes = logicExpression.match(/\d+/g) || [];
  return !Object(lodash__WEBPACK_IMPORTED_MODULE_0__["difference"])(logicExpIndexes.map(Number), indexes).length;
}

/**
   * 
   * @param {Array} roles -
   * @param {String} logicExpression -
   * @return {Boolean}
   */
function validateViewRoles(roles, logicExpression) {
  return validateViewLogicExpression(logicExpression, roles.map(function (r) {return r.index;}));
}

/**
   * Mapes the view roles to view conditionals.
   * @param {Array} viewRoles -
   * @return {Array}
   */
function mapViewRolesToConditionals(viewRoles) {
  return viewRoles.map(function (viewRole) {return {
      comparator: viewRole.comparator,
      value: viewRole.value,
      columnKey: viewRole.field.columnKey,
      slug: viewRole.field.slug,
      index: viewRole.index };});

}

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
/* harmony import */ var _lib_ViewRolesBuilder__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/lib/ViewRolesBuilder */ "./src/lib/ViewRolesBuilder/index.js");
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
                                                                          */ }, { key: "modifiers", get: function get() {return { filterAccountTypes: function filterAccountTypes(query, typesIds) {if (typesIds.length > 0) {query.whereIn('accoun_type_id', typesIds);}}, viewRolesBuilder: function viewRolesBuilder(query, conditionals, expression) {Object(_lib_ViewRolesBuilder__WEBPACK_IMPORTED_MODULE_9__["viewRolesBuilder"])(conditionals, expression)(query);} };} /**
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
/* harmony import */ var _lib_ViewRolesBuilder__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/lib/ViewRolesBuilder */ "./src/lib/ViewRolesBuilder/index.js");


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
        },

        viewRolesBuilder: function viewRolesBuilder(query, conditionals, expression) {
          Object(_lib_ViewRolesBuilder__WEBPACK_IMPORTED_MODULE_7__["viewRolesBuilder"])(conditionals, expression)(query);
        },

        orderBy: function orderBy(query) {

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
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/utils */ "./src/utils/index.js");


var

ModelBase = /*#__PURE__*/function (_Model) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(ModelBase, _Model);function ModelBase() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, ModelBase);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(ModelBase).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(ModelBase, [{ key: "$formatJson", value: function $formatJson(













    json, opt) {
      var transformed = Object(_utils__WEBPACK_IMPORTED_MODULE_8__["mapKeysDeep"])(json, function (value, key) {
        return Object(lodash__WEBPACK_IMPORTED_MODULE_7__["snakeCase"])(key);
      });
      var parsedJson = _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_4___default()(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(ModelBase.prototype), "$formatJson", this).call(this, transformed, opt);

      return parsedJson;
    } }], [{ key: "query", value: function query() {var _get2,_this = this;for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}return (_get2 = _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_4___default()(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(ModelBase), "query", this)).call.apply(_get2, [this].concat(args)).runAfter(function (result) {if (Array.isArray(result)) {return _this.collection.from(result);}return result;});} }, { key: "collection", get: function get() {return Array;} }]);return ModelBase;}(objection__WEBPACK_IMPORTED_MODULE_6__["Model"]);

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
      var ResourceField = __webpack_require__(/*! @/models/ResourceField */ "./src/models/ResourceField.js");

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
                                     * Role may has resource field.
                                     */
        field: {
          relation: objection__WEBPACK_IMPORTED_MODULE_5__["Model"].BelongsToOneRelation,
          modelClass: ResourceField["default"],
          join: {
            from: 'roles.fieldId',
            to: 'resource_fields.id' } },



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
    } }, { key: "fullName", value: function fullName()

    {
      return "".concat(this.firstName, " ").concat(this.lastName);
    } }], [{ key: "virtualAttributes", // ...PermissionsService
    get: function get() {return ['fullName'];} /**
                                                * Table name
                                                */ }, { key: "tableName", get: function get() {return 'users';} /**
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
            to: 'view_has_columns.viewId' } },



        /**
                                                * View model may has many view roles.
                                                */
        roles: {
          relation: objection__WEBPACK_IMPORTED_MODULE_6__["Model"].HasManyRelation,
          modelClass: ViewRole["default"],
          join: {
            from: 'views.id',
            to: 'view_roles.viewId' } } };



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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ViewRole; });
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

ViewRole = /*#__PURE__*/function (_BaseModel) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(ViewRole, _BaseModel);function ViewRole() {_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, ViewRole);return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(ViewRole).apply(this, arguments));}_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(ViewRole, null, [{ key: "virtualAttributes",

    /**
                                                                                                                                                                                                                                                                                          * Virtual attributes.
                                                                                                                                                                                                                                                                                          */get: function get()
    {
      return ['comparators'];
    } }, { key: "comparators", get: function get()

    {
      return [
      'equals', 'not_equal', 'contains', 'not_contain'];

    }

    /**
       * Table name.
       */ }, { key: "tableName", get: function get()
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
      var ResourceField = __webpack_require__(/*! @/models/ResourceField */ "./src/models/ResourceField.js");
      var View = __webpack_require__(/*! @/models/View */ "./src/models/View.js");

      return {
        /**
                * View role model may belongs to view model.
                */
        view: {
          relation: objection__WEBPACK_IMPORTED_MODULE_5__["Model"].BelongsToOneRelation,
          modelClass: View["default"],
          join: {
            from: 'view_roles.viewId',
            to: 'views.id' } },



        /**
                                 * View role model may belongs to resource field model.
                                 */
        field: {
          relation: objection__WEBPACK_IMPORTED_MODULE_5__["Model"].BelongsToOneRelation,
          modelClass: ResourceField["default"],
          join: {
            from: 'view_roles.fieldId',
            to: 'resource_fields.id' } } };



    } }]);return ViewRole;}(_models_Model__WEBPACK_IMPORTED_MODULE_6__["default"]);

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
/*! exports provided: hashPassword, origin, dateRangeCollection, dateRangeFormat, mapValuesDeep, mapKeysDeep */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hashPassword", function() { return hashPassword; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "origin", function() { return origin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dateRangeCollection", function() { return dateRangeCollection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dateRangeFormat", function() { return dateRangeFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapValuesDeep", function() { return mapValuesDeep; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapKeysDeep", function() { return mapKeysDeep; });
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bcryptjs */ "bcryptjs");
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);


var _require =
__webpack_require__(/*! lodash */ "lodash"),map = _require.map,isArray = _require.isArray,isPlainObject = _require.isPlainObject,mapKeys = _require.mapKeys,mapValues = _require.mapValues;


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


var mapKeysDeep = function mapKeysDeep(obj, cb) {
  if (lodash__WEBPACK_IMPORTED_MODULE_2___default.a.isArray(obj)) {
    return obj.map(function (innerObj) {return mapKeysDeep(innerObj, cb);});
  } else
  if (lodash__WEBPACK_IMPORTED_MODULE_2___default.a.isObject(obj)) {
    return lodash__WEBPACK_IMPORTED_MODULE_2___default.a.mapValues(
    lodash__WEBPACK_IMPORTED_MODULE_2___default.a.mapKeys(obj, cb),
    function (val) {return mapKeysDeep(val, cb);});

  } else {
    return obj;
  }
};

var mapValuesDeep = function mapValuesDeep(v, callback) {return (
    lodash__WEBPACK_IMPORTED_MODULE_2___default.a.isObject(v) ?
    lodash__WEBPACK_IMPORTED_MODULE_2___default.a.mapValues(v, function (v) {return mapValuesDeep(v, callback);}) :
    callback(v));};



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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrL2Jvb3RzdHJhcCIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9jb25maWcvaW5kZXguanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIva25leGZpbGUuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2FwcC5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvY29sbGVjdGlvbi9CdWRnZXRFbnRyaWVzU2V0LmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9jb2xsZWN0aW9uL05lc3RlZFNldC9pbmRleC5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvY29sbGVjdGlvbi9SZXNvdXJjZUZpZWxkTWV0YWRhdGFDb2xsZWN0aW9uLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9kYXRhL1Jlc291cmNlRmllbGRzS2V5cy5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvZGF0YWJhc2Uva25leC5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9BY2NvdW50T3BlbmluZ0JhbGFuY2UuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvY29udHJvbGxlcnMvQWNjb3VudFR5cGVzLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9odHRwL2NvbnRyb2xsZXJzL0FjY291bnRpbmcuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvY29udHJvbGxlcnMvQWNjb3VudHMuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvY29udHJvbGxlcnMvQXV0aGVudGljYXRpb24uanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvY29udHJvbGxlcnMvQmlsbHMuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvY29udHJvbGxlcnMvQnVkZ2V0LmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9odHRwL2NvbnRyb2xsZXJzL0J1ZGdldFJlcG9ydHMuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvY29udHJvbGxlcnMvQ3VycmVuY2llcy5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9DdXJyZW5jeUFkanVzdG1lbnQuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvY29udHJvbGxlcnMvQ3VzdG9tZXJzLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9odHRwL2NvbnRyb2xsZXJzL0V4cGVuc2VzLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9odHRwL2NvbnRyb2xsZXJzL0ZpZWxkcy5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9GaW5hbmNpYWxTdGF0ZW1lbnRzLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9odHRwL2NvbnRyb2xsZXJzL0l0ZW1DYXRlZ29yaWVzLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9odHRwL2NvbnRyb2xsZXJzL0l0ZW1zLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9odHRwL2NvbnRyb2xsZXJzL09wdGlvbnMuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvY29udHJvbGxlcnMvUmVzb3VyY2VzLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9odHRwL2NvbnRyb2xsZXJzL1JvbGVzLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9odHRwL2NvbnRyb2xsZXJzL1N1cHBsaWVycy5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9Vc2Vycy5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9WaWV3cy5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9pbmRleC5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9taWRkbGV3YXJlL2FzeW5jTWlkZGxld2FyZS5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvaHR0cC9taWRkbGV3YXJlL2F1dGhvcml6YXRpb24uanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2h0dHAvbWlkZGxld2FyZS9qd3RBdXRoLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9saWIvTG9naWNFdmFsdWF0aW9uL0xleGVyLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9saWIvTG9naWNFdmFsdWF0aW9uL1BhcnNlci5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvbGliL0xvZ2ljRXZhbHVhdGlvbi9RdWVyeVBhcnNlci5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvbGliL01ldGFibGUvTWV0YWJsZUNvbGxlY3Rpb24uanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL2xpYi9WaWV3Um9sZXNCdWlsZGVyL2luZGV4LmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvQWNjb3VudC5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL0FjY291bnRCYWxhbmNlLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvQWNjb3VudFRyYW5zYWN0aW9uLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvQWNjb3VudFR5cGUuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9CdWRnZXQuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9CdWRnZXRFbnRyeS5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL0V4cGVuc2UuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9JdGVtLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvSXRlbUNhdGVnb3J5LmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvSm91cm5hbEVudHJ5LmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvTWFudWFsSm91cm5hbC5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL01vZGVsLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvT3B0aW9uLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvUGFzc3dvcmRSZXNldC5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL1Blcm1pc3Npb24uanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9SZXNvdXJjZS5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL1Jlc291cmNlRmllbGQuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9SZXNvdXJjZUZpZWxkTWV0YWRhdGEuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9Sb2xlLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvVXNlci5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvbW9kZWxzL1ZpZXcuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9WaWV3Q29sdW1uLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9tb2RlbHMvVmlld1JvbGUuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL21vZGVscy9pbmRleC5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvc2VydmVyLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9zZXJ2aWNlcy9BY2NvdW50aW5nL0pvdXJuYWxFbnRyeS5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvc2VydmljZXMvQWNjb3VudGluZy9Kb3VybmFsUG9zdGVyLmpzIiwiL1VzZXJzL2FobWVkL0RvY3VtZW50cy9SYXR0ZWIvc2VydmVyL3NyYy9zZXJ2aWNlcy9DdXN0b21GaWVsZHMvUmVzb3VyY2VDdXN0b21GaWVsZFJlcG9zaXRvcnkuanMiLCIvVXNlcnMvYWhtZWQvRG9jdW1lbnRzL1JhdHRlYi9zZXJ2ZXIvc3JjL3NlcnZpY2VzL01vbWVudC9pbmRleC5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvc2VydmljZXMvbWFpbC5qcyIsIi9Vc2Vycy9haG1lZC9Eb2N1bWVudHMvUmF0dGViL3NlcnZlci9zcmMvdXRpbHMvaW5kZXguanMiLCJleHRlcm5hbCBcIkBiYWJlbC9wbHVnaW4tdHJhbnNmb3JtLXJ1bnRpbWVcIiIsImV4dGVybmFsIFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hc3luY1RvR2VuZXJhdG9yXCIiLCJleHRlcm5hbCBcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2tcIiIsImV4dGVybmFsIFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzc1wiIiwiZXh0ZXJuYWwgXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2RlZmluZVByb3BlcnR5XCIiLCJleHRlcm5hbCBcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvZ2V0XCIiLCJleHRlcm5hbCBcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvZ2V0UHJvdG90eXBlT2ZcIiIsImV4dGVybmFsIFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbmhlcml0c1wiIiwiZXh0ZXJuYWwgXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm5cIiIsImV4dGVybmFsIFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9zbGljZWRUb0FycmF5XCIiLCJleHRlcm5hbCBcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvdG9Db25zdW1hYmxlQXJyYXlcIiIsImV4dGVybmFsIFwiQGJhYmVsL3J1bnRpbWUvcmVnZW5lcmF0b3JcIiIsImV4dGVybmFsIFwiYmNyeXB0anNcIiIsImV4dGVybmFsIFwiZG90ZW52XCIiLCJleHRlcm5hbCBcImVycm9yaGFuZGxlclwiIiwiZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJleHRlcm5hbCBcImV4cHJlc3MtYm9vbVwiIiwiZXh0ZXJuYWwgXCJleHByZXNzLXZhbGlkYXRvclwiIiwiZXh0ZXJuYWwgXCJmc1wiIiwiZXh0ZXJuYWwgXCJoZWxtZXRcIiIsImV4dGVybmFsIFwianNvbndlYnRva2VuXCIiLCJleHRlcm5hbCBcImtuZXhcIiIsImV4dGVybmFsIFwibG9kYXNoXCIiLCJleHRlcm5hbCBcIm1vbWVudFwiIiwiZXh0ZXJuYWwgXCJtb21lbnQtcmFuZ2VcIiIsImV4dGVybmFsIFwibXVzdGFjaGVcIiIsImV4dGVybmFsIFwibm9kZW1haWxlclwiIiwiZXh0ZXJuYWwgXCJvYmplY3Rpb25cIiIsImV4dGVybmFsIFwicGF0aFwiIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiZGlzdC9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuIiwiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZG90ZW52IGZyb20gJ2RvdGVudic7XG5cbmRvdGVudi5jb25maWcoe1xuICBwYXRoOiBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJy5lbnYudGVzdCcpLFxufSk7XG4iLCJyZXF1aXJlKCdkb3RlbnYnKS5jb25maWcoKTtcblxuY29uc3QgTUlHUkFUSU9OU19ESVIgPSAnLi9zcmMvZGF0YWJhc2UvbWlncmF0aW9ucyc7XG5jb25zdCBTRUVEU19ESVIgPSAnLi9zcmMvZGF0YWJhc2Uvc2VlZHMnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdGVzdDoge1xuICAgIGNsaWVudDogcHJvY2Vzcy5lbnYuREJfQ0xJRU5ULFxuICAgIG1pZ3JhdGlvbnM6IHtcbiAgICAgIGRpcmVjdG9yeTogTUlHUkFUSU9OU19ESVIsXG4gICAgfSxcbiAgICBjb25uZWN0aW9uOiB7XG4gICAgICBob3N0OiBwcm9jZXNzLmVudi5EQl9IT1NULFxuICAgICAgdXNlcjogcHJvY2Vzcy5lbnYuREJfVVNFUixcbiAgICAgIHBhc3N3b3JkOiBwcm9jZXNzLmVudi5EQl9QQVNTV09SRCxcbiAgICAgIGRhdGFiYXNlOiBwcm9jZXNzLmVudi5EQl9OQU1FLFxuICAgICAgY2hhcnNldDogJ3V0ZjgnLFxuICAgIH0sXG4gIH0sXG4gIGRldmVsb3BtZW50OiB7XG4gICAgY2xpZW50OiBwcm9jZXNzLmVudi5EQl9DTElFTlQsXG4gICAgY29ubmVjdGlvbjoge1xuICAgICAgaG9zdDogcHJvY2Vzcy5lbnYuREJfSE9TVCxcbiAgICAgIHVzZXI6IHByb2Nlc3MuZW52LkRCX1VTRVIsXG4gICAgICBwYXNzd29yZDogcHJvY2Vzcy5lbnYuREJfUEFTU1dPUkQsXG4gICAgICBkYXRhYmFzZTogcHJvY2Vzcy5lbnYuREJfTkFNRSxcbiAgICAgIGNoYXJzZXQ6ICd1dGY4JyxcbiAgICB9LFxuICAgIG1pZ3JhdGlvbnM6IHtcbiAgICAgIGRpcmVjdG9yeTogTUlHUkFUSU9OU19ESVIsXG4gICAgfSxcbiAgICBzZWVkczoge1xuICAgICAgZGlyZWN0b3J5OiBTRUVEU19ESVIsXG4gICAgfSxcbiAgfSxcbiAgcHJvZHVjdGlvbjoge1xuICAgIGNsaWVudDogcHJvY2Vzcy5lbnYuREJfQ0xJRU5ULFxuICAgIGNvbm5lY3Rpb246IHtcbiAgICAgIGhvc3Q6IHByb2Nlc3MuZW52LkRCX0hPU1QsXG4gICAgICB1c2VyOiBwcm9jZXNzLmVudi5EQl9VU0VSLFxuICAgICAgcGFzc3dvcmQ6IHByb2Nlc3MuZW52LkRCX1BBU1NXT1JELFxuICAgICAgZGF0YWJhc2U6IHByb2Nlc3MuZW52LkRCX05BTUUsXG4gICAgICBjaGFyc2V0OiAndXRmOCcsXG4gICAgfSxcbiAgICBtaWdyYXRpb25zOiB7XG4gICAgICBkaXJlY3Rvcnk6IE1JR1JBVElPTlNfRElSLFxuICAgIH0sXG4gICAgc2VlZHM6IHtcbiAgICAgIGRpcmVjdG9yeTogU0VFRFNfRElSLFxuICAgIH0sXG4gIH0sXG59O1xuIiwiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgaGVsbWV0IGZyb20gJ2hlbG1ldCc7XG5pbXBvcnQgYm9vbSBmcm9tICdleHByZXNzLWJvb20nO1xuaW1wb3J0ICcuLi9jb25maWcnO1xuaW1wb3J0IHJvdXRlcyBmcm9tICdAL2h0dHAnO1xuaW1wb3J0ICdAL21vZGVscyc7XG5cbmNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcblxuLy8gRXhwcmVzcyBjb25maWd1cmF0aW9uXG5hcHAuc2V0KCdwb3J0JywgcHJvY2Vzcy5lbnYuUE9SVCB8fCAzMDAwKTtcblxuYXBwLnVzZShoZWxtZXQoKSk7XG5hcHAudXNlKGJvb20oKSk7XG5hcHAudXNlKGV4cHJlc3MuanNvbigpKTtcblxucm91dGVzKGFwcCk7XG5cbmV4cG9ydCBkZWZhdWx0IGFwcDtcbiIsIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdWRnZXRFbnRyaWVzU2V0IHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFjY291bnRzID0ge307IFxuICAgIHRoaXMudG90YWxTdW1tYXJ5ID0ge31cbiAgICB0aGlzLm9yZGVyU2l6ZSA9IG51bGw7XG4gIH1cblxuICBzZXRaZXJvUGxhY2Vob2xkZXIoKSB7XG4gICAgaWYgKCF0aGlzLm9yZGVyU2l6ZSkgeyByZXR1cm47IH1cblxuICAgIE9iamVjdC52YWx1ZXModGhpcy5hY2NvdW50cykuZm9yRWFjaCgoYWNjb3VudCkgPT4ge1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSB0aGlzLm9yZGVyU2l6ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodHlwZW9mIGFjY291bnRbaV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgYWNjb3VudFtpXSA9IHsgYW1vdW50OiAwIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tKGFjY291bnRzLCBjb25maWdzKSB7XG4gICAgY29uc3QgY29sbGVjdGlvbiA9IG5ldyB0aGlzKGNvbmZpZ3MpO1xuXG4gICAgYWNjb3VudHMuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5hY2NvdW50c1tlbnRyeS5hY2NvdW50SWRdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjb2xsZWN0aW9uLmFjY291bnRzW2VudHJ5LmFjY291bnRJZF0gPSB7fTtcbiAgICAgIH1cbiAgICAgIGlmIChlbnRyeS5vcmRlcikge1xuICAgICAgICBjb2xsZWN0aW9uLmFjY291bnRzW2VudHJ5LmFjY291bnRJZF1bZW50cnkub3JkZXJdID0gZW50cnk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH1cblxuICB0b0FycmF5KCkge1xuICAgIGNvbnN0IG91dHB1dCA9IFtdO1xuXG4gICAgT2JqZWN0LmtleSh0aGlzLmFjY291bnRzKS5mb3JFYWNoKChhY2NvdW50SWQpID0+IHtcbiAgICAgIGNvbnN0IGVudHJpZXMgPSB0aGlzLmFjY291bnRzW2FjY291bnRJZF07XG4gICAgICBvdXRwdXQucHVzaCh7XG4gICAgICAgIGFjY291bnRfaWQ6IGFjY291bnRJZCxcbiAgICAgICAgZW50cmllczogW1xuICAgICAgICAgIC4uLk9iamVjdC5rZXkoZW50cmllcykubWFwKChvcmRlcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZW50cnkgPSBlbnRyaWVzW29yZGVyXTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIG9yZGVyLFxuICAgICAgICAgICAgICBhbW91bnQ6IGVudHJ5LmFtb3VudCxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGNhbGNUb3RhbFN1bW1hcnkoKSB7XG4gICAgY29uc3QgdG90YWxTdW1tYXJ5ID0ge307XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub3JkZXJTaXplLmxlbmd0aDsgaSsrKSB7XG4gICAgICBPYmplY3QudmFsdWUodGhpcy5hY2NvdW50cykuZm9yRWFjaCgoYWNjb3VudCkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHRvdGFsU3VtbWFyeVtpXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICB0b3RhbFN1bW1hcnlbaV0gPSB7IGFtb3VudDogMCwgb3JkZXI6IGkgfTtcbiAgICAgICAgfVxuICAgICAgICB0b3RhbFN1bW1hcnlbaV0uYW1vdW50ICs9IGFjY291bnRbaV0uYW1vdW50O1xuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMudG90YWxTdW1tYXJ5ID0gdG90YWxTdW1tYXJ5O1xuICB9XG5cbiAgdG9BcnJheVRvdGFsU3VtbWFyeSgpIHtcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLnRvdGFsU3VtbWFyeSk7XG4gIH1cblxufVxuIiwiXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOZXN0ZWRTZXQge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgbWV0aG9kLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpdGVtcywgb3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIHBhcmVudElkOiAncGFyZW50X2lkJyxcbiAgICAgIGlkOiAnaWQnLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9O1xuICAgIHRoaXMuaXRlbXMgPSBpdGVtcztcbiAgICB0aGlzLmNvbGxlY3Rpb24gPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaW5rIG5vZGVzIGNoaWxkcmVuLlxuICAgKi9cbiAgbGlua0NoaWxkcmVuKCkge1xuICAgIGlmICh0aGlzLml0ZW1zLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBtYXAgPSB7fTtcbiAgICB0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIG1hcFtpdGVtLmlkXSA9IGl0ZW07XG4gICAgICBtYXBbaXRlbS5pZF0uY2hpbGRyZW4gPSBbXTtcbiAgICB9KTtcblxuICAgIHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgcGFyZW50Tm9kZUlkID0gaXRlbVt0aGlzLm9wdGlvbnMucGFyZW50SWRdO1xuICAgICAgaWYgKHBhcmVudE5vZGVJZCkge1xuICAgICAgICBtYXBbcGFyZW50Tm9kZUlkXS5jaGlsZHJlbi5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBtYXA7XG4gIH1cblxuICB0b1RyZWUoKSB7XG4gICAgY29uc3QgbWFwID0gdGhpcy5saW5rQ2hpbGRyZW4oKTtcbiAgICBjb25zdCB0cmVlID0ge307XG5cbiAgICB0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IHBhcmVudE5vZGVJZCA9IGl0ZW1bdGhpcy5vcHRpb25zLnBhcmVudElkXTtcbiAgICAgIGlmICghcGFyZW50Tm9kZUlkKSB7XG4gICAgICAgIHRyZWVbaXRlbS5pZF0gPSBtYXBbaXRlbS5pZF07XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5jb2xsZWN0aW9uID0gT2JqZWN0LnZhbHVlcyh0cmVlKTtcbiAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uO1xuICB9XG5cbiAgZ2V0VHJlZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uO1xuICB9XG5cbiAgZmxhdHRlblRyZWUobm9kZU1hcHBlcikge1xuICAgIGNvbnN0IGZsYXR0ZW5UcmVlID0gW107XG5cbiAgICBjb25zdCB0cmF2ZXJzYWwgPSAobm9kZXMsIHBhcmVudE5vZGUpID0+IHtcbiAgICAgIG5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgbGV0IG5vZGVNYXBwZWQgPSBub2RlO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygbm9kZU1hcHBlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIG5vZGVNYXBwZWQgPSBub2RlTWFwcGVyKG5vZGVNYXBwZWQsIHBhcmVudE5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGZsYXR0ZW5UcmVlLnB1c2gobm9kZU1hcHBlZCk7XG5cbiAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW4gJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdHJhdmVyc2FsKG5vZGUuY2hpbGRyZW4sIG5vZGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHRyYXZlcnNhbCh0aGlzLmNvbGxlY3Rpb24pO1xuXG4gICAgcmV0dXJuIGZsYXR0ZW5UcmVlO1xuICB9XG59XG4iLCJpbXBvcnQgTWV0YWJsZUNvbGxlY3Rpb24gZnJvbSAnQC9saWIvTWV0YWJsZS9NZXRhYmxlQ29sbGVjdGlvbic7XG5pbXBvcnQgUmVzb3VyY2VGaWVsZE1ldGFkYXRhIGZyb20gJ0AvbW9kZWxzL1Jlc291cmNlRmllbGRNZXRhZGF0YSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc291cmNlRmllbGRNZXRhZGF0YUNvbGxlY3Rpb24gZXh0ZW5kcyBNZXRhYmxlQ29sbGVjdGlvbiB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBtZXRob2QuXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zZXRNb2RlbChSZXNvdXJjZUZpZWxkTWV0YWRhdGEpO1xuICAgIHRoaXMuZXh0cmFDb2x1bW5zID0gWydyZXNvdXJjZV9pZCcsICdyZXNvdXJjZV9pdGVtX2lkJ107XG4gIH1cbn1cbiIsIlxuZXhwb3J0IGRlZmF1bHQge1xuICBcImV4cGVuc2VfYWNjb3VudFwiOiAnZXhwZW5zZV9hY2NvdW50X2lkJyxcbiAgXCJwYXltZW50X2FjY291bnRcIjogJ3BheW1lbnRfYWNjb3VudF9pZCcsXG4gIFwiYWNjb3VudF90eXBlXCI6IFwiYWNjb3VudF90eXBlX2lkXCJcbn0iLCJpbXBvcnQgS25leCBmcm9tICdrbmV4JztcbmltcG9ydCB7IGtuZXhTbmFrZUNhc2VNYXBwZXJzIH0gZnJvbSAnb2JqZWN0aW9uJztcbmltcG9ydCBrbmV4ZmlsZSBmcm9tICdALy4uL2tuZXhmaWxlJztcblxuY29uc3QgY29uZmlnID0ga25leGZpbGVbcHJvY2Vzcy5lbnYuTk9ERV9FTlZdO1xuY29uc3Qga25leCA9IEtuZXgoe1xuICAuLi5jb25maWcsXG4gIC4uLmtuZXhTbmFrZUNhc2VNYXBwZXJzKHsgdXBwZXJDYXNlOiB0cnVlIH0pLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGtuZXg7XG4iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCB7IGNoZWNrLCB2YWxpZGF0aW9uUmVzdWx0LCBvbmVPZiB9IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJztcbmltcG9ydCB7IGRpZmZlcmVuY2UgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IGFzeW5jTWlkZGxld2FyZSBmcm9tICcuLi9taWRkbGV3YXJlL2FzeW5jTWlkZGxld2FyZSc7XG5pbXBvcnQgand0QXV0aCBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9qd3RBdXRoJztcbmltcG9ydCBBY2NvdW50IGZyb20gJ0AvbW9kZWxzL0FjY291bnQnO1xuaW1wb3J0IEpvdXJuYWxQb3N0ZXIgZnJvbSAnQC9zZXJ2aWNlcy9BY2NvdW50aW5nL0pvdXJuYWxQb3N0ZXInO1xuaW1wb3J0IEpvdXJuYWxFbnRyeSBmcm9tICdAL3NlcnZpY2VzL0FjY291bnRpbmcvSm91cm5hbEVudHJ5JztcbmltcG9ydCBNYW51YWxKb3VybmFsIGZyb20gJ0AvbW9kZWxzL01hbnVhbEpvdXJuYWwnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBSb3V0ZXIgY29uc3RydWN0b3IuXG4gICAqL1xuICByb3V0ZXIoKSB7XG4gICAgY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcblxuICAgIHJvdXRlci51c2Uoand0QXV0aCk7XG5cbiAgICByb3V0ZXIucG9zdCgnLycsXG4gICAgICB0aGlzLm9wZW5pbmdCYWxuYWNlLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5vcGVuaW5nQmFsbmFjZS5oYW5kbGVyKSk7XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9LFxuXG4gIC8qKlxuICAgKiBPcGVuaW5nIGJhbGFuY2UgdG8gdGhlIGdpdmVuIGFjY291bnQuXG4gICAqIEBwYXJhbSB7UmVxdWVzdH0gcmVxIC1cbiAgICogQHBhcmFtIHtSZXNwb25zZX0gcmVzIC1cbiAgICovXG4gIG9wZW5pbmdCYWxuYWNlOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgY2hlY2soJ2RhdGUnKS5vcHRpb25hbCgpLFxuICAgICAgY2hlY2soJ25vdGUnKS5vcHRpb25hbCgpLnRyaW0oKS5lc2NhcGUoKSxcbiAgICAgIGNoZWNrKCdiYWxhbmNlX2FkanVzdG1lbnRfYWNjb3VudCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnYWNjb3VudHMnKS5pc0FycmF5KHsgbWluOiAxIH0pLFxuICAgICAgY2hlY2soJ2FjY291bnRzLiouaWQnKS5leGlzdHMoKS5pc0ludCgpLFxuICAgICAgb25lT2YoW1xuICAgICAgICBjaGVjaygnYWNjb3VudHMuKi5kZWJpdCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvRmxvYXQoKSxcbiAgICAgICAgY2hlY2soJ2FjY291bnRzLiouY3JlZGl0JykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9GbG9hdCgpLFxuICAgICAgXSksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7IGFjY291bnRzIH0gPSByZXEuYm9keTtcbiAgICAgIGNvbnN0IHsgdXNlciB9ID0gcmVxO1xuICAgICAgY29uc3QgZm9ybSA9IHsgLi4ucmVxLmJvZHkgfTtcbiAgICAgIGNvbnN0IGRhdGUgPSBtb21lbnQoZm9ybS5kYXRlKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcblxuICAgICAgY29uc3QgYWNjb3VudHNJZHMgPSBhY2NvdW50cy5tYXAoKGFjY291bnQpID0+IGFjY291bnQuaWQpO1xuICAgICAgY29uc3Qgc3RvcmVkQWNjb3VudHMgPSBhd2FpdCBBY2NvdW50LnF1ZXJ5KClcbiAgICAgICAgLnNlbGVjdChbJ2lkJ10pLndoZXJlSW4oJ2lkJywgYWNjb3VudHNJZHMpXG4gICAgICAgIC53aXRoR3JhcGhGZXRjaGVkKCd0eXBlJyk7XG5cbiAgICAgIGNvbnN0IGFjY291bnRzQ29sbGVjdGlvbiA9IG5ldyBNYXAoc3RvcmVkQWNjb3VudHMubWFwKGkgPT4gW2kuaWQsIGldKSk7XG5cbiAgICAgIC8vIEdldCB0aGUgc3RvcmVkIGFjY291bnRzIElkcyBhbmQgZGlmZmVyZW5jZSB3aXRoIHN1Ym1pdCBhY2NvdW50cy5cbiAgICAgIGNvbnN0IGFjY291bnRzU3RvcmVkSWRzID0gc3RvcmVkQWNjb3VudHMubWFwKChhY2NvdW50KSA9PiBhY2NvdW50LmlkKTtcbiAgICAgIGNvbnN0IG5vdEZvdW5kQWNjb3VudHNJZHMgPSBkaWZmZXJlbmNlKGFjY291bnRzSWRzLCBhY2NvdW50c1N0b3JlZElkcyk7XG4gICAgICBjb25zdCBlcnJvclJlYXNvbnMgPSBbXTtcblxuICAgICAgaWYgKG5vdEZvdW5kQWNjb3VudHNJZHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBpZHMgPSBub3RGb3VuZEFjY291bnRzSWRzLm1hcCgoYSkgPT4gcGFyc2VJbnQoYSwgMTApKTtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnTk9UX0ZPVU5EX0FDQ09VTlQnLCBjb2RlOiAxMDAsIGlkcyB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChmb3JtLmJhbGFuY2VfYWRqdXN0bWVudF9hY2NvdW50KSB7XG4gICAgICAgIGNvbnN0IGFjY291bnQgPSBhd2FpdCBBY2NvdW50LnF1ZXJ5KCkuZmluZEJ5SWQoZm9ybS5iYWxhbmNlX2FkanVzdG1lbnRfYWNjb3VudCk7XG5cbiAgICAgICAgaWYgKCFhY2NvdW50KSB7XG4gICAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnQkFMQU5DRS5BREpVU1RNRU5ULkFDQ09VTlQuTk9ULkVYSVNUJywgY29kZTogMzAwIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZXJyb3JSZWFzb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwgeyBlcnJvcnM6IGVycm9yUmVhc29ucyB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgam91cm5hbEVudHJpZXMgPSBuZXcgSm91cm5hbFBvc3RlcigpO1xuXG4gICAgICBhY2NvdW50cy5mb3JFYWNoKChhY2NvdW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHN0b3JlZEFjY291bnQgPSBhY2NvdW50c0NvbGxlY3Rpb24uZ2V0KGFjY291bnQuaWQpO1xuXG4gICAgICAgIC8vIENhbid0IGNvbnRpbnVlIGluIGNhc2UgdGhlIHN0b3JlZCBhY2NvdW50IHdhcyBub3QgZm91bmQuXG4gICAgICAgIGlmICghc3RvcmVkQWNjb3VudCkgeyByZXR1cm47IH1cblxuICAgICAgICBjb25zdCBlbnRyeU1vZGVsID0gbmV3IEpvdXJuYWxFbnRyeSh7XG4gICAgICAgICAgcmVmZXJlbmNlVHlwZTogJ09wZW5pbmdCYWxhbmNlJyxcbiAgICAgICAgICBhY2NvdW50OiBhY2NvdW50LmlkLFxuICAgICAgICAgIGFjY291bnROb3JtYWw6IHN0b3JlZEFjY291bnQudHlwZS5ub3JtYWwsXG4gICAgICAgICAgdXNlcklkOiB1c2VyLmlkLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGFjY291bnQuY3JlZGl0KSB7XG4gICAgICAgICAgZW50cnlNb2RlbC5lbnRyeS5jcmVkaXQgPSBhY2NvdW50LmNyZWRpdDtcbiAgICAgICAgICBqb3VybmFsRW50cmllcy5jcmVkaXQoZW50cnlNb2RlbCk7XG4gICAgICAgIH0gZWxzZSBpZiAoYWNjb3VudC5kZWJpdCkge1xuICAgICAgICAgIGVudHJ5TW9kZWwuZW50cnkuZGViaXQgPSBhY2NvdW50LmRlYml0O1xuICAgICAgICAgIGpvdXJuYWxFbnRyaWVzLmRlYml0KGVudHJ5TW9kZWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIENhbGN1bGF0ZXMgdGhlIGNyZWRpdCBhbmQgZGViaXQgYmFsYW5jZSBvZiBzdGFja2VkIGVudHJpZXMuXG4gICAgICBjb25zdCB0cmlhbCA9IGpvdXJuYWxFbnRyaWVzLmdldFRyaWFsQmFsYW5jZSgpO1xuXG4gICAgICBpZiAodHJpYWwuY3JlZGl0ICE9PSB0cmlhbC5kZWJpdCkge1xuICAgICAgICBjb25zdCBlbnRyeU1vZGVsID0gbmV3IEpvdXJuYWxFbnRyeSh7XG4gICAgICAgICAgcmVmZXJlbmNlVHlwZTogJ09wZW5pbmdCYWxhbmNlJyxcbiAgICAgICAgICBhY2NvdW50OiBmb3JtLmJhbGFuY2VfYWRqdXN0bWVudF9hY2NvdW50LFxuICAgICAgICAgIGFjY291bnROb3JtYWw6ICdjcmVkaXQnLFxuICAgICAgICAgIHVzZXJJZDogdXNlci5pZCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRyaWFsLmNyZWRpdCA+IHRyaWFsLmRlYml0KSB7XG4gICAgICAgICAgZW50cnlNb2RlbC5lbnRyeS5jcmVkaXQgPSBNYXRoLmFicyh0cmlhbC5jcmVkaXQpO1xuICAgICAgICAgIGpvdXJuYWxFbnRyaWVzLmNyZWRpdChlbnRyeU1vZGVsKTtcblxuICAgICAgICB9IGVsc2UgaWYgKHRyaWFsLmNyZWRpdCA8IHRyaWFsLmRlYml0KSB7XG4gICAgICAgICAgZW50cnlNb2RlbC5lbnRyeS5kZWJpdCA9IE1hdGguYWJzKHRyaWFsLmRlYml0KTtcbiAgICAgICAgICBqb3VybmFsRW50cmllcy5kZWJpdChlbnRyeU1vZGVsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgbWFudWFsSm91cm5hbCA9IGF3YWl0IE1hbnVhbEpvdXJuYWwucXVlcnkoKS5pbnNlcnQoe1xuICAgICAgICBhbW91bnQ6IE1hdGgubWF4KHRyaWFsLmNyZWRpdCwgdHJpYWwuZGViaXQpLFxuICAgICAgICB0cmFuc2FjdGlvbl90eXBlOiAnT3BlbmluZ0JhbGFuY2UnLFxuICAgICAgICBkYXRlLFxuICAgICAgICBub3RlOiBmb3JtLm5vdGUsXG4gICAgICAgIHVzZXJfaWQ6IHVzZXIuaWQsXG4gICAgICB9KTtcblxuICAgICAgam91cm5hbEVudHJpZXMuZW50cmllcyA9IGpvdXJuYWxFbnRyaWVzLmVudHJpZXMubWFwKChlbnRyeSkgPT4gKHtcbiAgICAgICAgLi4uZW50cnksXG4gICAgICAgIHJlZmVyZW5jZUlkOiBtYW51YWxKb3VybmFsLmlkLFxuICAgICAgfSkpO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBqb3VybmFsRW50cmllcy5zYXZlRW50cmllcygpLFxuICAgICAgICBqb3VybmFsRW50cmllcy5zYXZlQmFsYW5jZSgpLFxuICAgICAgXSk7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyBpZDogbWFudWFsSm91cm5hbC5pZCB9KTtcbiAgICB9LFxuICB9LFxufTtcbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IEpXVEF1dGggZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvand0QXV0aCc7XG5pbXBvcnQgYXN5bmNNaWRkbGV3YXJlIGZyb20gJ0AvaHR0cC9taWRkbGV3YXJlL2FzeW5jTWlkZGxld2FyZSc7XG5pbXBvcnQgQWNjb3VudFR5cGUgZnJvbSAnQC9tb2RlbHMvQWNjb3VudFR5cGUnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBSb3V0ZXIgY29uc3RydWN0b3IuXG4gICAqL1xuICByb3V0ZXIoKSB7XG4gICAgY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcbiAgICByb3V0ZXIudXNlKEpXVEF1dGgpO1xuXG4gICAgcm91dGVyLmdldCgnLycsXG4gICAgICB0aGlzLmdldEFjY291bnRUeXBlc0xpc3QudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmdldEFjY291bnRUeXBlc0xpc3QuaGFuZGxlcikpO1xuXG4gICAgcmV0dXJuIHJvdXRlcjtcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgYWNjb3VudHMgdHlwZXMgbGlzdC5cbiAgICovXG4gIGdldEFjY291bnRUeXBlc0xpc3Q6IHtcbiAgICB2YWxpZGF0aW9uOiBbXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCBhY2NvdW50VHlwZXMgPSBhd2FpdCBBY2NvdW50VHlwZS5xdWVyeSgpO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoe1xuICAgICAgICBhY2NvdW50X3R5cGVzOiBhY2NvdW50VHlwZXMsXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxufTtcbiIsImltcG9ydCB7IGNoZWNrLCBxdWVyeSwgdmFsaWRhdGlvblJlc3VsdCB9IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJztcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgZGlmZmVyZW5jZSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgQWNjb3VudCBmcm9tICdAL21vZGVscy9BY2NvdW50JztcbmltcG9ydCBhc3luY01pZGRsZXdhcmUgZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvYXN5bmNNaWRkbGV3YXJlJztcbmltcG9ydCBKV1RBdXRoIGZyb20gJ0AvaHR0cC9taWRkbGV3YXJlL2p3dEF1dGgnO1xuaW1wb3J0IEpvdXJuYWxQb3N0ZXIgZnJvbSAnQC9zZXJ2aWNlcy9BY2NvdW50aW5nL0pvdXJuYWxQb3N0ZXInO1xuaW1wb3J0IEpvdXJuYWxFbnRyeSBmcm9tICdAL3NlcnZpY2VzL0FjY291bnRpbmcvSm91cm5hbEVudHJ5JztcbmltcG9ydCBNYW51YWxKb3VybmFsIGZyb20gJ0AvbW9kZWxzL0pvdXJuYWxFbnRyeSc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyoqXG4gICAqIFJvdXRlciBjb25zdHJ1Y3Rvci5cbiAgICovXG4gIHJvdXRlcigpIHtcbiAgICBjb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuICAgIHJvdXRlci51c2UoSldUQXV0aCk7XG5cbiAgICByb3V0ZXIucG9zdCgnL21ha2Utam91cm5hbC1lbnRyaWVzJyxcbiAgICAgIHRoaXMubWFrZUpvdXJuYWxFbnRyaWVzLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5tYWtlSm91cm5hbEVudHJpZXMuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLnBvc3QoJy9yZWN1cnJpbmctam91cm5hbC1lbnRyaWVzJyxcbiAgICAgIHRoaXMucmVjdXJyaW5nSm91cm5hbEVudHJpZXMudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLnJlY3VycmluZ0pvdXJuYWxFbnRyaWVzLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCdxdWljay1qb3VybmFsLWVudHJpZXMnLFxuICAgICAgdGhpcy5xdWlja0pvdXJuYWxFbnRyaWVzLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5xdWlja0pvdXJuYWxFbnRyaWVzLmhhbmRsZXIpKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIE1ha2Ugam91cm5hbCBlbnRyaXJlcy5cbiAgICovXG4gIG1ha2VKb3VybmFsRW50cmllczoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCdkYXRlJykuaXNJU084NjAxKCksXG4gICAgICBjaGVjaygncmVmZXJlbmNlJykuZXhpc3RzKCksXG4gICAgICBjaGVjaygnZW50cmllcycpLmlzQXJyYXkoeyBtaW46IDEgfSksXG4gICAgICBjaGVjaygnZW50cmllcy4qLmNyZWRpdCcpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnZW50cmllcy4qLmRlYml0JykuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdlbnRyaWVzLiouYWNjb3VudF9pZCcpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnZW50cmllcy4qLm5vdGUnKS5vcHRpb25hbCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGZvcm0gPSB7XG4gICAgICAgIGRhdGU6IG5ldyBEYXRlKCksXG4gICAgICAgIC4uLnJlcS5ib2R5LFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGVycm9yUmVhc29ucyA9IFtdO1xuICAgICAgbGV0IHRvdGFsQ3JlZGl0ID0gMDtcbiAgICAgIGxldCB0b3RhbERlYml0ID0gMDtcblxuICAgICAgZm9ybS5lbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICAgIGlmIChlbnRyeS5jcmVkaXQgPiAwKSB7XG4gICAgICAgICAgdG90YWxDcmVkaXQgKz0gZW50cnkuY3JlZGl0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbnRyeS5kZWJpdCA+IDApIHtcbiAgICAgICAgICB0b3RhbERlYml0ICs9IGVudHJ5LmRlYml0O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmICh0b3RhbENyZWRpdCA8PSAwIHx8IHRvdGFsRGViaXQgPD0gMCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ0NSRURJVC5ERUJJVC5TVU1BVElPTi5TSE9VTEQuTk9ULkVRVUFMLlpFUk8nLFxuICAgICAgICAgIGNvZGU6IDQwMCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAodG90YWxDcmVkaXQgIT09IHRvdGFsRGViaXQpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnQ1JFRElULkRFQklULk5PVC5FUVVBTFMnLCBjb2RlOiAxMDAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBhY2NvdW50c0lkcyA9IGZvcm0uZW50cmllcy5tYXAoKGVudHJ5KSA9PiBlbnRyeS5hY2NvdW50X2lkKTtcbiAgICAgIGNvbnN0IGFjY291bnRzID0gYXdhaXQgQWNjb3VudC5xdWVyeSgpLndoZXJlSW4oJ2lkJywgYWNjb3VudHNJZHMpXG4gICAgICAgIC53aXRoR3JhcGhGZXRjaGVkKCd0eXBlJyk7XG5cbiAgICAgIGNvbnN0IHN0b3JlZEFjY291bnRzSWRzID0gYWNjb3VudHMubWFwKChhY2NvdW50KSA9PiBhY2NvdW50LmlkKTtcblxuICAgICAgaWYgKGRpZmZlcmVuY2UoYWNjb3VudHNJZHMsIHN0b3JlZEFjY291bnRzSWRzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHsgdHlwZTogJ0FDQ09VTlRTLklEUy5OT1QuRk9VTkQnLCBjb2RlOiAyMDAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGpvdXJuYWxSZWZlcmVuY2UgPSBhd2FpdCBNYW51YWxKb3VybmFsLnF1ZXJ5KCkud2hlcmUoJ3JlZmVyZW5jZScsIGZvcm0ucmVmZXJlbmNlKTtcblxuICAgICAgaWYgKGpvdXJuYWxSZWZlcmVuY2UubGVuZ3RoID4gMCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdSRUZFUkVOQ0UuQUxSRUFEWS5FWElTVFMnLCBjb2RlOiAzMDAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZXJyb3JSZWFzb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHsgZXJyb3JzOiBlcnJvclJlYXNvbnMgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBqb3VybmFsUG9zdGVyID0gbmV3IEpvdXJuYWxQb3N0ZXIoKTtcblxuICAgICAgZm9ybS5lbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICAgIGNvbnN0IGFjY291bnQgPSBhY2NvdW50cy5maW5kKChhKSA9PiBhLmlkID09PSBlbnRyeS5hY2NvdW50X2lkKTtcblxuICAgICAgICBjb25zdCBqb3VyYW5sRW50cnkgPSBuZXcgSm91cm5hbEVudHJ5KHtcbiAgICAgICAgICBkYXRlOiBlbnRyeS5kYXRlLFxuICAgICAgICAgIGRlYml0OiBlbnRyeS5kZWJpdCxcbiAgICAgICAgICBjcmVkaXQ6IGVudHJ5LmNyZWRpdCxcbiAgICAgICAgICBhY2NvdW50OiBhY2NvdW50LmlkLFxuICAgICAgICAgIGFjY291bnROb3JtYWw6IGFjY291bnQudHlwZS5ub3JtYWwsXG4gICAgICAgICAgbm90ZTogZW50cnkubm90ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChlbnRyeS5kZWJpdCkge1xuICAgICAgICAgIGpvdXJuYWxQb3N0ZXIuZGViaXQoam91cmFubEVudHJ5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBqb3VybmFsUG9zdGVyLmNyZWRpdChqb3VyYW5sRW50cnkpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gU2F2ZXMgdGhlIGpvdXJuYWwgZW50cmllcyBhbmQgYWNjb3VudHMgYmFsYW5jZSBjaGFuZ2VzLlxuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBqb3VybmFsUG9zdGVyLnNhdmVFbnRyaWVzKCksXG4gICAgICAgIGpvdXJuYWxQb3N0ZXIuc2F2ZUJhbGFuY2UoKSxcbiAgICAgIF0pO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKCk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogU2F2ZXMgcmVjdXJyaW5nIGpvdXJuYWwgZW50cmllcyB0ZW1wbGF0ZS5cbiAgICovXG4gIHJlY3VycmluZ0pvdXJuYWxFbnRyaWVzOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgY2hlY2soJ3RlbXBsYXRlX25hbWUnKS5leGlzdHMoKSxcbiAgICAgIGNoZWNrKCdyZWN1cnJlbmNlJykuZXhpc3RzKCksXG4gICAgICBjaGVjaygnYWN0aXZlJykub3B0aW9uYWwoKS5pc0Jvb2xlYW4oKS50b0Jvb2xlYW4oKSxcbiAgICAgIGNoZWNrKCdlbnRyaWVzJykuaXNBcnJheSh7IG1pbjogMSB9KSxcbiAgICAgIGNoZWNrKCdlbnRyaWVzLiouY3JlZGl0JykuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdlbnRyaWVzLiouZGViaXQnKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2VudHJpZXMuKi5hY2NvdW50X2lkJykuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdlbnRyaWVzLioubm90ZScpLm9wdGlvbmFsKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfSxcbiAgfSxcblxuICByZWN1cnJpbmdKb3VybmFsc0xpc3Q6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBxdWVyeSgncGFnZScpLm9wdGlvbmFsKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIHF1ZXJ5KCdwYWdlX3NpemUnKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBxdWVyeSgndGVtcGxhdGVfbmFtZScpLm9wdGlvbmFsKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgcXVpY2tKb3VybmFsRW50cmllczoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCdkYXRlJykuZXhpc3RzKCkuaXNJU084NjAxKCksXG4gICAgICBjaGVjaygnYW1vdW50JykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9GbG9hdCgpLFxuICAgICAgY2hlY2soJ2NyZWRpdF9hY2NvdW50X2lkJykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdkZWJpdF9hY2NvdW50X2lkJykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCd0cmFuc2FjdGlvbl90eXBlJykuZXhpc3RzKCksXG4gICAgICBjaGVjaygnbm90ZScpLm9wdGlvbmFsKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZXJyb3JSZWFzb25zID0gW107XG4gICAgICBjb25zdCBmb3JtID0geyAuLi5yZXEuYm9keSB9O1xuXG4gICAgICBjb25zdCBmb3VuZEFjY291bnRzID0gYXdhaXQgQWNjb3VudC5xdWVyeSgpXG4gICAgICAgIC53aGVyZSgnaWQnLCBmb3JtLmNyZWRpdF9hY2NvdW50X2lkKVxuICAgICAgICAub3JXaGVyZSgnaWQnLCBmb3JtLmRlYml0X2FjY291bnRfaWQpO1xuXG4gICAgICBjb25zdCBjcmVkaXRBY2NvdW50ID0gZm91bmRBY2NvdW50cy5maW5kKChhKSA9PiBhLmlkID09PSBmb3JtLmNyZWRpdF9hY2NvdW50X2lkKTtcbiAgICAgIGNvbnN0IGRlYml0QWNjb3VudCA9IGZvdW5kQWNjb3VudHMuZmluZCgoYSkgPT4gYS5pZCA9PT0gZm9ybS5kZWJpdF9hY2NvdW50X2lkKTtcblxuICAgICAgaWYgKCFjcmVkaXRBY2NvdW50KSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHsgdHlwZTogJ0NSRURJVF9BQ0NPVU5ULk5PVC5FWElTVCcsIGNvZGU6IDEwMCB9KTtcbiAgICAgIH1cbiAgICAgIGlmICghZGViaXRBY2NvdW50KSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHsgdHlwZTogJ0RFQklUX0FDQ09VTlQuTk9ULkVYSVNUJywgY29kZTogMjAwIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGVycm9yUmVhc29ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7IGVycm9yczogZXJyb3JSZWFzb25zIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBjb25zdCBqb3VybmFsUG9zdGVyID0gbmV3IEpvdXJuYWxQb3N0ZXIoKTtcbiAgICAgIC8vIGNvbnN0IGpvdXJuYWxDcmVkaXQgPSBuZXcgSm91cm5hbEVudHJ5KHtcbiAgICAgIC8vICAgZGViaXQ6IFxuICAgICAgLy8gICBhY2NvdW50OiBkZWJpdEFjY291bnQuaWQsXG4gICAgICAvLyAgIHJlZmVyZW5jZUlkOiBcbiAgICAgIC8vIH0pXG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCgpO1xuICAgIH0sXG4gIH0sXG59O1xuIiwiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgeyBjaGVjaywgdmFsaWRhdGlvblJlc3VsdCwgcGFyYW0sIHF1ZXJ5IH0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InO1xuaW1wb3J0IGFzeW5jTWlkZGxld2FyZSBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9hc3luY01pZGRsZXdhcmUnO1xuaW1wb3J0IEFjY291bnQgZnJvbSAnQC9tb2RlbHMvQWNjb3VudCc7XG5pbXBvcnQgQWNjb3VudFR5cGUgZnJvbSAnQC9tb2RlbHMvQWNjb3VudFR5cGUnO1xuaW1wb3J0IEFjY291bnRUcmFuc2FjdGlvbiBmcm9tICdAL21vZGVscy9BY2NvdW50VHJhbnNhY3Rpb24nO1xuaW1wb3J0IEpvdXJuYWxQb3N0ZXIgZnJvbSAnQC9zZXJ2aWNlcy9BY2NvdW50aW5nL0pvdXJuYWxQb3N0ZXInO1xuaW1wb3J0IEFjY291bnRCYWxhbmNlIGZyb20gJ0AvbW9kZWxzL0FjY291bnRCYWxhbmNlJztcbmltcG9ydCBSZXNvdXJjZSBmcm9tICdAL21vZGVscy9SZXNvdXJjZSc7XG5pbXBvcnQgVmlldyBmcm9tICdAL21vZGVscy9WaWV3JztcbmltcG9ydCBKV1RBdXRoIGZyb20gJ0AvaHR0cC9taWRkbGV3YXJlL2p3dEF1dGgnO1xuaW1wb3J0IE5lc3RlZFNldCBmcm9tICcuLi8uLi9jb2xsZWN0aW9uL05lc3RlZFNldCc7XG5pbXBvcnQge1xuICBtYXBWaWV3Um9sZXNUb0NvbmRpdGlvbmFscyxcbiAgdmFsaWRhdGVWaWV3Um9sZXMsXG59IGZyb20gJ0AvbGliL1ZpZXdSb2xlc0J1aWxkZXInO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBSb3V0ZXIgY29uc3RydWN0b3IgbWV0aG9kLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbiAgICByb3V0ZXIudXNlKEpXVEF1dGgpO1xuICAgIHJvdXRlci5wb3N0KCcvJyxcbiAgICAgIHRoaXMubmV3QWNjb3VudC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMubmV3QWNjb3VudC5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIucG9zdCgnLzppZCcsXG4gICAgICB0aGlzLmVkaXRBY2NvdW50LnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5lZGl0QWNjb3VudC5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvOmlkJyxcbiAgICAgIHRoaXMuZ2V0QWNjb3VudC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZ2V0QWNjb3VudC5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvJyxcbiAgICAgIHRoaXMuZ2V0QWNjb3VudHNMaXN0LnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5nZXRBY2NvdW50c0xpc3QuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmRlbGV0ZSgnLzppZCcsXG4gICAgICB0aGlzLmRlbGV0ZUFjY291bnQudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmRlbGV0ZUFjY291bnQuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLnBvc3QoJy86aWQvYWN0aXZlJyxcbiAgICAgIHRoaXMuYWN0aXZlQWNjb3VudC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuYWN0aXZlQWNjb3VudC5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIucG9zdCgnLzppZC9pbmFjdGl2ZScsXG4gICAgICB0aGlzLmluYWN0aXZlQWNjb3VudC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuaW5hY3RpdmVBY2NvdW50LmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCcvOmlkL3JlY2FsY3VsYXRlLWJhbGFuY2UnLFxuICAgICAgdGhpcy5yZWNhbGN1YWx0ZUJhbGFuYWNlLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5yZWNhbGN1YWx0ZUJhbGFuYWNlLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCcvOmlkL3RyYW5zZmVyX2FjY291bnQvOnRvQWNjb3VudCcsXG4gICAgICB0aGlzLnRyYW5zZmVyVG9Bbm90aGVyQWNjb3VudC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMudHJhbnNmZXJUb0Fub3RoZXJBY2NvdW50LmhhbmRsZXIpKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYWNjb3VudC5cbiAgICovXG4gIG5ld0FjY291bnQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBjaGVjaygnbmFtZScpLmV4aXN0cygpLmlzTGVuZ3RoKHsgbWluOiAzIH0pLnRyaW0oKS5lc2NhcGUoKSxcbiAgICAgIGNoZWNrKCdjb2RlJykuZXhpc3RzKCkuaXNMZW5ndGgoeyBtYXg6IDEwIH0pLnRyaW0oKS5lc2NhcGUoKSxcbiAgICAgIGNoZWNrKCdhY2NvdW50X3R5cGVfaWQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2Rlc2NyaXB0aW9uJykub3B0aW9uYWwoKS50cmltKCkuZXNjYXBlKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZm9ybSA9IHsgLi4ucmVxLmJvZHkgfTtcblxuICAgICAgY29uc3QgZm91bmRBY2NvdW50Q29kZVByb21pc2UgPSBmb3JtLmNvZGVcbiAgICAgICAgPyBBY2NvdW50LnF1ZXJ5KCkud2hlcmUoJ2NvZGUnLCBmb3JtLmNvZGUpIDogbnVsbDtcblxuICAgICAgY29uc3QgZm91bmRBY2NvdW50VHlwZVByb21pc2UgPSBBY2NvdW50VHlwZS5xdWVyeSgpXG4gICAgICAgIC5maW5kQnlJZChmb3JtLmFjY291bnRfdHlwZV9pZCk7XG5cbiAgICAgIGNvbnN0IFtmb3VuZEFjY291bnRDb2RlLCBmb3VuZEFjY291bnRUeXBlXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgZm91bmRBY2NvdW50Q29kZVByb21pc2UsIGZvdW5kQWNjb3VudFR5cGVQcm9taXNlLFxuICAgICAgXSk7XG5cbiAgICAgIGlmIChmb3VuZEFjY291bnRDb2RlUHJvbWlzZSAmJiBmb3VuZEFjY291bnRDb2RlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ05PVF9VTklRVUVfQ09ERScsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoIWZvdW5kQWNjb3VudFR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ05PVF9FWElTVF9BQ0NPVU5UX1RZUEUnLCBjb2RlOiAyMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgYXdhaXQgQWNjb3VudC5xdWVyeSgpLmluc2VydCh7IC4uLmZvcm0gfSk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGl0ZW06IHsgfSB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBFZGl0IHRoZSBnaXZlbiBhY2NvdW50IGRldGFpbHMuXG4gICAqL1xuICBlZGl0QWNjb3VudDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdpZCcpLmV4aXN0cygpLnRvSW50KCksXG4gICAgICBjaGVjaygnbmFtZScpLmV4aXN0cygpLmlzTGVuZ3RoKHsgbWluOiAzIH0pLnRyaW0oKS5lc2NhcGUoKSxcbiAgICAgIGNoZWNrKCdjb2RlJykuZXhpc3RzKCkuaXNMZW5ndGgoeyBtYXg6IDEwIH0pLnRyaW0oKS5lc2NhcGUoKSxcbiAgICAgIGNoZWNrKCdhY2NvdW50X3R5cGVfaWQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2Rlc2NyaXB0aW9uJykub3B0aW9uYWwoKS50cmltKCkuZXNjYXBlKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGZvcm0gPSB7IC4uLnJlcS5ib2R5IH07XG4gICAgICBjb25zdCBhY2NvdW50ID0gYXdhaXQgQWNjb3VudC5xdWVyeSgpLmZpbmRCeUlkKGlkKTtcblxuICAgICAgaWYgKCFhY2NvdW50KSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZCgpO1xuICAgICAgfVxuICAgICAgY29uc3QgZm91bmRBY2NvdW50Q29kZVByb21pc2UgPSAoZm9ybS5jb2RlICYmIGZvcm0uY29kZSAhPT0gYWNjb3VudC5jb2RlKVxuICAgICAgICA/IEFjY291bnQucXVlcnkoKS53aGVyZSgnY29kZScsIGZvcm0uY29kZSkud2hlcmVOb3QoJ2lkJywgYWNjb3VudC5pZCkgOiBudWxsO1xuXG4gICAgICBjb25zdCBmb3VuZEFjY291bnRUeXBlUHJvbWlzZSA9IChmb3JtLmFjY291bnRfdHlwZV9pZCAhPT0gYWNjb3VudC5hY2NvdW50X3R5cGVfaWQpXG4gICAgICAgID8gQWNjb3VudFR5cGUucXVlcnkoKS53aGVyZSgnaWQnLCBmb3JtLmFjY291bnRfdHlwZV9pZCkgOiBudWxsO1xuXG4gICAgICBjb25zdCBbZm91bmRBY2NvdW50Q29kZSwgZm91bmRBY2NvdW50VHlwZV0gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIGZvdW5kQWNjb3VudENvZGVQcm9taXNlLCBmb3VuZEFjY291bnRUeXBlUHJvbWlzZSxcbiAgICAgIF0pO1xuICAgICAgaWYgKGZvdW5kQWNjb3VudENvZGUubGVuZ3RoID4gMCAmJiBmb3VuZEFjY291bnRDb2RlUHJvbWlzZSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkUmVxdWVzdChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnTk9UX1VOSVFVRV9DT0RFJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZEFjY291bnRUeXBlLmxlbmd0aCA8PSAwICYmIGZvdW5kQWNjb3VudFR5cGVQcm9taXNlKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWRSZXF1ZXN0KG51bGwsIHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdOT1RfRVhJU1RfQUNDT1VOVF9UWVBFJywgY29kZTogMTEwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IGFjY291bnQucGF0Y2goeyAuLi5mb3JtIH0pO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgZGV0YWlscyBvZiB0aGUgZ2l2ZW4gYWNjb3VudC5cbiAgICovXG4gIGdldEFjY291bnQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBwYXJhbSgnaWQnKS50b0ludCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgeyBpZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IGFjY291bnQgPSBhd2FpdCBBY2NvdW50LnF1ZXJ5KCkud2hlcmUoJ2lkJywgaWQpLmZpcnN0KCk7XG5cbiAgICAgIGlmICghYWNjb3VudCkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGFjY291bnQ6IHsgLi4uYWNjb3VudCB9IH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIERlbGV0ZSB0aGUgZ2l2ZW4gYWNjb3VudC5cbiAgICovXG4gIGRlbGV0ZUFjY291bnQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBwYXJhbSgnaWQnKS50b0ludCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgeyBpZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IGFjY291bnQgPSBhd2FpdCBBY2NvdW50LnF1ZXJ5KCkuZmluZEJ5SWQoaWQpO1xuXG4gICAgICBpZiAoIWFjY291bnQpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKCk7XG4gICAgICB9XG4gICAgICBjb25zdCBhY2NvdW50VHJhbnNhY3Rpb25zID0gYXdhaXQgQWNjb3VudFRyYW5zYWN0aW9uLnF1ZXJ5KClcbiAgICAgICAgLndoZXJlKCdhY2NvdW50X2lkJywgYWNjb3VudC5pZCk7XG5cbiAgICAgIGlmIChhY2NvdW50VHJhbnNhY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ0FDQ09VTlQuSEFTLkFTU09DSUFURUQuVFJBTlNBQ1RJT05TJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IEFjY291bnQucXVlcnkoKS5kZWxldGVCeUlkKGFjY291bnQuaWQpO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhY2NvdW50cyBsaXN0LlxuICAgKi9cbiAgZ2V0QWNjb3VudHNMaXN0OiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcXVlcnkoJ2Rpc3BsYXlfdHlwZScpLm9wdGlvbmFsKCkuaXNJbihbJ3RyZWUnLCAnZmxhdCddKSxcbiAgICAgIHF1ZXJ5KCdhY2NvdW50X3R5cGVzJykub3B0aW9uYWwoKS5pc0FycmF5KCksXG4gICAgICBxdWVyeSgnYWNjb3VudF90eXBlcy4qJykub3B0aW9uYWwoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgcXVlcnkoJ2N1c3RvbV92aWV3X2lkJykub3B0aW9uYWwoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmlsdGVyID0ge1xuICAgICAgICBhY2NvdW50X3R5cGVzOiBbXSxcbiAgICAgICAgZGlzcGxheV90eXBlOiAndHJlZScsXG4gICAgICAgIC4uLnJlcS5xdWVyeSxcbiAgICAgIH07XG4gICAgICBjb25zdCBlcnJvclJlYXNvbnMgPSBbXTtcbiAgICAgIGNvbnN0IHZpZXdDb25kaXRpb25hbHMgPSBbXTtcbiAgICAgIGNvbnN0IGFjY291bnRzUmVzb3VyY2UgPSBhd2FpdCBSZXNvdXJjZS5xdWVyeSgpLndoZXJlKCduYW1lJywgJ2FjY291bnRzJykuZmlyc3QoKTtcblxuICAgICAgaWYgKCFhY2NvdW50c1Jlc291cmNlKSB7XG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnQUNDT1VOVFNfUkVTT1VSQ0VfTk9UX0ZPVU5EJywgY29kZTogMjAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHZpZXcgPSBhd2FpdCBWaWV3LnF1ZXJ5KCkub25CdWlsZCgoYnVpbGRlcikgPT4ge1xuICAgICAgICBpZiAoZmlsdGVyLmN1c3RvbV92aWV3X2lkKSB7XG4gICAgICAgICAgYnVpbGRlci53aGVyZSgnaWQnLCBmaWx0ZXIuY3VzdG9tX3ZpZXdfaWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJ1aWxkZXIud2hlcmUoJ2Zhdm91cml0ZScsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGJ1aWxkZXIud2hlcmUoJ3Jlc291cmNlX2lkJywgYWNjb3VudHNSZXNvdXJjZS5pZCk7XG4gICAgICAgIGJ1aWxkZXIud2l0aEdyYXBoRmV0Y2hlZCgncm9sZXMuZmllbGQnKTtcbiAgICAgICAgYnVpbGRlci53aXRoR3JhcGhGZXRjaGVkKCdjb2x1bW5zJyk7XG4gICAgICAgIGJ1aWxkZXIuZmlyc3QoKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAodmlldyAmJiB2aWV3LnJvbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmlld0NvbmRpdGlvbmFscy5wdXNoKFxuICAgICAgICAgIC4uLm1hcFZpZXdSb2xlc1RvQ29uZGl0aW9uYWxzKHZpZXcucm9sZXMpLFxuICAgICAgICApO1xuICAgICAgICBpZiAoIXZhbGlkYXRlVmlld1JvbGVzKHZpZXdDb25kaXRpb25hbHMsIHZpZXcucm9sZXNMb2dpY0V4cHJlc3Npb24pKSB7XG4gICAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnVklFVy5MT0dJQy5FWFBSRVNTSU9OLklOVkFMSUQnLCBjb2RlOiA0MDAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChlcnJvclJlYXNvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoeyBlcnJvcnM6IGVycm9yUmVhc29ucyB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFjY291bnRzID0gYXdhaXQgQWNjb3VudC5xdWVyeSgpLm9uQnVpbGQoKGJ1aWxkZXIpID0+IHtcbiAgICAgICAgYnVpbGRlci5tb2RpZnkoJ2ZpbHRlckFjY291bnRUeXBlcycsIGZpbHRlci5hY2NvdW50X3R5cGVzKTtcbiAgICAgICAgYnVpbGRlci53aXRoR3JhcGhGZXRjaGVkKCd0eXBlJyk7XG5cbiAgICAgICAgaWYgKHZpZXdDb25kaXRpb25hbHMubGVuZ3RoKSB7XG4gICAgICAgICAgYnVpbGRlci5tb2RpZnkoJ3ZpZXdSb2xlc0J1aWxkZXInLCB2aWV3Q29uZGl0aW9uYWxzLCB2aWV3LnJvbGVzTG9naWNFeHByZXNzaW9uKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG5lc3RlZEFjY291bnRzID0gbmV3IE5lc3RlZFNldChhY2NvdW50cywgeyBwYXJlbnRJZDogJ3BhcmVudEFjY291bnRJZCcgfSk7XG4gICAgICBjb25zdCBncm91cHNBY2NvdW50cyA9IG5lc3RlZEFjY291bnRzLnRvVHJlZSgpO1xuICAgICAgY29uc3QgYWNjb3VudHNMaXN0ID0gW107XG5cbiAgICAgIGlmIChmaWx0ZXIuZGlzcGxheV90eXBlID09PSAndHJlZScpIHtcbiAgICAgICAgYWNjb3VudHNMaXN0LnB1c2goLi4uZ3JvdXBzQWNjb3VudHMpO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIuZGlzcGxheV90eXBlID09PSAnZmxhdCcpIHtcbiAgICAgICAgY29uc3QgZmxhdHRlbkFjY291bnRzID0gbmVzdGVkQWNjb3VudHMuZmxhdHRlblRyZWUoKGFjY291bnQsIHBhcmVudEFjY291bnQpID0+IHtcbiAgICAgICAgICBpZiAocGFyZW50QWNjb3VudCkge1xuICAgICAgICAgICAgYWNjb3VudC5uYW1lID0gYCR7cGFyZW50QWNjb3VudC5uYW1lfSDigJUgJHthY2NvdW50Lm5hbWV9YDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGFjY291bnQ7XG4gICAgICAgIH0pO1xuICAgICAgICBhY2NvdW50c0xpc3QucHVzaCguLi5mbGF0dGVuQWNjb3VudHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgYWNjb3VudHM6IGFjY291bnRzTGlzdCxcbiAgICAgICAgLi4uKHZpZXcpID8ge1xuICAgICAgICAgIGN1c3RvbVZpZXdJZDogdmlldy5pZCxcbiAgICAgICAgfSA6IHt9LFxuICAgICAgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogUmUtY2FsY3VsYXRlcyBiYWxhbmNlIG9mIHRoZSBnaXZlbiBhY2NvdW50LlxuICAgKi9cbiAgcmVjYWxjdWFsdGVCYWxhbmFjZToge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdpZCcpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgYWNjb3VudCA9IGF3YWl0IEFjY291bnQuZmluZEJ5SWQoaWQpO1xuXG4gICAgICBpZiAoIWFjY291bnQpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdBQ0NPVU5ULk5PVC5GT1VORCcsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBhY2NvdW50VHJhbnNhY3Rpb25zID0gQWNjb3VudFRyYW5zYWN0aW9uLnF1ZXJ5KClcbiAgICAgICAgLndoZXJlKCdhY2NvdW50X2lkJywgYWNjb3VudC5pZCk7XG5cbiAgICAgIGNvbnN0IGpvdXJuYWxFbnRyaWVzID0gbmV3IEpvdXJuYWxQb3N0ZXIoKTtcbiAgICAgIGpvdXJuYWxFbnRyaWVzLmxvYWRGcm9tQ29sbGVjdGlvbihhY2NvdW50VHJhbnNhY3Rpb25zKTtcblxuICAgICAgLy8gRGVsZXRlIHRoZSBiYWxhbmNlIG9mIHRoZSBnaXZlbiBhY2NvdW50IGlkLlxuICAgICAgYXdhaXQgQWNjb3VudEJhbGFuY2UucXVlcnkoKS53aGVyZSgnYWNjb3VudF9pZCcsIGFjY291bnQuaWQpLmRlbGV0ZSgpO1xuXG4gICAgICAvLyBTYXZlIGNhbGN1YWx0ZWQgYWNjb3VudCBiYWxhbmNlLlxuICAgICAgYXdhaXQgam91cm5hbEVudHJpZXMuc2F2ZUJhbGFuY2UoKTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKCk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogQWN0aXZlIHRoZSBnaXZlbiBhY2NvdW50LlxuICAgKi9cbiAgYWN0aXZlQWNjb3VudDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdpZCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgYWNjb3VudCA9IGF3YWl0IEFjY291bnQuZmluZEJ5SWQoaWQpO1xuXG4gICAgICBpZiAoIWFjY291bnQpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdBQ0NPVU5ULk5PVC5GT1VORCcsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBhd2FpdCBhY2NvdW50LnBhdGNoKHsgYWN0aXZlOiB0cnVlIH0pO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyBpZDogYWNjb3VudC5pZCB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBJbmFjdGl2ZSB0aGUgZ2l2ZW4gYWNjb3VudC5cbiAgICovXG4gIGluYWN0aXZlQWNjb3VudDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdpZCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgYWNjb3VudCA9IGF3YWl0IEFjY291bnQuZmluZEJ5SWQoaWQpO1xuXG4gICAgICBpZiAoIWFjY291bnQpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdBQ0NPVU5ULk5PVC5GT1VORCcsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBhd2FpdCBhY2NvdW50LnBhdGNoKHsgYWN0aXZlOiBmYWxzZSB9KTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgaWQ6IGFjY291bnQuaWQgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogVHJhbnNmZXIgYWxsIGpvdXJuYWwgZW50cmllcyBvZiB0aGUgZ2l2ZW4gYWNjb3VudCB0byBhbm90aGVyIGFjY291bnQuXG4gICAqL1xuICB0cmFuc2ZlclRvQW5vdGhlckFjY291bnQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBwYXJhbSgnaWQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgcGFyYW0oJ3RvQWNjb3VudCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBjb25zdCB7IGlkLCB0b0FjY291bnQ6IHRvQWNjb3VudElkIH0gPSByZXEucGFyYW1zO1xuXG4gICAgICAvLyBjb25zdCBbZnJvbUFjY291bnQsIHRvQWNjb3VudF0gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAvLyAgIEFjY291bnQucXVlcnkoKS5maW5kQnlJZChpZCksXG4gICAgICAvLyAgIEFjY291bnQucXVlcnkoKS5maW5kQnlJZCh0b0FjY291bnRJZCksXG4gICAgICAvLyBdKTtcblxuICAgICAgLy8gY29uc3QgZnJvbUFjY291bnRUcmFuc2FjdGlvbnMgPSBhd2FpdCBBY2NvdW50VHJhbnNhY3Rpb24ucXVlcnkoKVxuICAgICAgLy8gICAud2hlcmUoJ2FjY291bnRfaWQnLCBmcm9tQWNjb3VudCk7XG5cbiAgICAgIC8vIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCgpO1xuICAgIH0sXG4gIH0sXG59O1xuIiwiXG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCB7IGNoZWNrLCB2YWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IE11c3RhY2hlIGZyb20gJ211c3RhY2hlJztcbmltcG9ydCBqd3QgZnJvbSAnanNvbndlYnRva2VuJztcbmltcG9ydCBhc3luY01pZGRsZXdhcmUgZnJvbSAnLi4vbWlkZGxld2FyZS9hc3luY01pZGRsZXdhcmUnO1xuaW1wb3J0IFVzZXIgZnJvbSAnQC9tb2RlbHMvVXNlcic7XG5pbXBvcnQgUGFzc3dvcmRSZXNldCBmcm9tICdAL21vZGVscy9QYXNzd29yZFJlc2V0JztcbmltcG9ydCBtYWlsIGZyb20gJ0Avc2VydmljZXMvbWFpbCc7XG5pbXBvcnQgeyBoYXNoUGFzc3dvcmQgfSBmcm9tICdAL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgbWV0aG9kLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbiAgICByb3V0ZXIucG9zdCgnL2xvZ2luJyxcbiAgICAgIHRoaXMubG9naW4udmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmxvZ2luLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCcvc2VuZF9yZXNldF9wYXNzd29yZCcsXG4gICAgICB0aGlzLnNlbmRSZXNldFBhc3N3b3JkLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5zZW5kUmVzZXRQYXNzd29yZC5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIucG9zdCgnL3Jlc2V0Lzp0b2tlbicsXG4gICAgICB0aGlzLnJlc2V0UGFzc3dvcmQudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLnJlc2V0UGFzc3dvcmQuaGFuZGxlcikpO1xuXG4gICAgcmV0dXJuIHJvdXRlcjtcbiAgfSxcblxuICAvKipcbiAgICogVXNlciBsb2dpbiBhdXRoZW50aWNhdGlvbiByZXF1ZXN0LlxuICAgKi9cbiAgbG9naW46IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBjaGVjaygnY3JlZGllbnRpYWwnKS5leGlzdHMoKS5pc0VtYWlsKCksXG4gICAgICBjaGVjaygncGFzc3dvcmQnKS5leGlzdHMoKS5pc0xlbmd0aCh7IG1pbjogNCB9KSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCB7IGNyZWRpZW50aWFsLCBwYXNzd29yZCB9ID0gcmVxLmJvZHk7XG4gICAgICBjb25zdCB7IEpXVF9TRUNSRVRfS0VZIH0gPSBwcm9jZXNzLmVudjtcblxuICAgICAgY29uc3QgdXNlciA9IGF3YWl0IFVzZXIucXVlcnkoKVxuICAgICAgICAud2hlcmUoJ2VtYWlsJywgY3JlZGllbnRpYWwpXG4gICAgICAgIC5vcldoZXJlKCdwaG9uZV9udW1iZXInLCBjcmVkaWVudGlhbClcbiAgICAgICAgLmZpcnN0KCk7XG5cbiAgICAgIGlmICghdXNlcikge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkUmVxdWVzdChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnSU5WQUxJRF9ERVRBSUxTJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmICghdXNlci52ZXJpZnlQYXNzd29yZChwYXNzd29yZCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ0lOVkFMSURfREVUQUlMUycsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoIXVzZXIuYWN0aXZlKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWRSZXF1ZXN0KG51bGwsIHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdVU0VSX0lOQUNUSVZFJywgY29kZTogMTEwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8vIHVzZXIudXBkYXRlKHsgbGFzdF9sb2dpbl9hdDogbmV3IERhdGUoKSB9KTtcblxuICAgICAgY29uc3QgdG9rZW4gPSBqd3Quc2lnbih7XG4gICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICBfaWQ6IHVzZXIuaWQsXG4gICAgICB9LCBKV1RfU0VDUkVUX0tFWSwge1xuICAgICAgICBleHBpcmVzSW46ICcxZCcsXG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IHRva2VuLCB1c2VyIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmQgcmVzZXQgcGFzc3dvcmQgbGluayB2aWEgZW1haWwgb3IgU01TLlxuICAgKi9cbiAgc2VuZFJlc2V0UGFzc3dvcmQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBjaGVjaygnZW1haWwnKS5leGlzdHMoKS5pc0VtYWlsKCksXG4gICAgXSxcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgeyBlbWFpbCB9ID0gcmVxLmJvZHk7XG4gICAgICBjb25zdCB1c2VyID0gYXdhaXQgVXNlci53aGVyZSgnZW1haWwnLCBlbWFpbCkuZmV0Y2goKTtcblxuICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQyMikuc2VuZCgpO1xuICAgICAgfVxuICAgICAgLy8gRGVsZXRlIGFsbCBzdG9yZWQgdG9rZW5zIG9mIHJlc2V0IHBhc3N3b3JkIHRoYXQgYXNzb2NpYXRlIHRvIHRoZSBnaXZlIGVtYWlsLlxuICAgICAgYXdhaXQgUGFzc3dvcmRSZXNldC53aGVyZSh7IGVtYWlsIH0pLmRlc3Ryb3koeyByZXF1aXJlOiBmYWxzZSB9KTtcblxuICAgICAgY29uc3QgcGFzc3dvcmRSZXNldCA9IFBhc3N3b3JkUmVzZXQuZm9yZ2Uoe1xuICAgICAgICBlbWFpbCxcbiAgICAgICAgdG9rZW46ICcxMjMxMjMnLFxuICAgICAgfSk7XG4gICAgICBhd2FpdCBwYXNzd29yZFJlc2V0LnNhdmUoKTtcblxuICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vdmlld3MvbWFpbC9SZXNldFBhc3N3b3JkLmh0bWwnKTtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmOCcpO1xuICAgICAgY29uc3QgcmVuZGVyZWQgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIHtcbiAgICAgICAgdXJsOiBgJHtyZXEucHJvdG9jb2x9Oi8vJHtyZXEuaG9zdG5hbWV9L3Jlc2V0LyR7cGFzc3dvcmRSZXNldC5hdHRyaWJ1dGVzLnRva2VufWAsXG4gICAgICAgIGZpcnN0X25hbWU6IHVzZXIuYXR0cmlidXRlcy5maXJzdF9uYW1lLFxuICAgICAgICBsYXN0X25hbWU6IHVzZXIuYXR0cmlidXRlcy5sYXN0X25hbWUsXG4gICAgICAgIGNvbnRhY3RfdXNfZW1haWw6IHByb2Nlc3MuZW52LkNPTlRBQ1RfVVNfRU1BSUwsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgbWFpbE9wdGlvbnMgPSB7XG4gICAgICAgIHRvOiB1c2VyLmF0dHJpYnV0ZXMuZW1haWwsXG4gICAgICAgIGZyb206IGAke3Byb2Nlc3MuZW52Lk1BSUxfRlJPTV9OQU1FfSAke3Byb2Nlc3MuZW52Lk1BSUxfRlJPTV9BRERSRVNTfWAsXG4gICAgICAgIHN1YmplY3Q6ICdSYXR0ZWIgUGFzc3dvcmQgUmVzZXQnLFxuICAgICAgICBodG1sOiByZW5kZXJlZCxcbiAgICAgIH07XG5cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICAgICAgbWFpbC5zZW5kTWFpbChtYWlsT3B0aW9ucywgKGVycm9yKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgZGF0YTogeyBlbWFpbDogcGFzc3dvcmRSZXNldC5hdHRyaWJ1dGVzLmVtYWlsIH0gfSk7XG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXNldCBwYXNzd29yZC5cbiAgICovXG4gIHJlc2V0UGFzc3dvcmQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBjaGVjaygncGFzc3dvcmQnKS5leGlzdHMoKS5pc0xlbmd0aCh7IG1pbjogNSB9KS5jdXN0b20oKHZhbHVlLCB7IHJlcSB9KSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gcmVxLmJvZHkuY29uZmlybV9wYXNzd29yZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBhc3N3b3JkcyBkb24ndCBtYXRjaFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ1ZBTElEQVRJT05fRVJST1InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHsgdG9rZW4gfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCB7IHBhc3N3b3JkIH0gPSByZXEuYm9keTtcblxuICAgICAgY29uc3QgdG9rZW5Nb2RlbCA9IGF3YWl0IFBhc3N3b3JkUmVzZXQucXVlcnkoKVxuICAgICAgICAud2hlcmUoJ3Rva2VuJywgdG9rZW4pXG4gICAgICAgIC53aGVyZSgnY3JlYXRlZF9hdCcsICc+PScsIERhdGUubm93KCkgLSAzNjAwMDAwKVxuICAgICAgICAuZmlyc3QoKTtcblxuICAgICAgaWYgKCF0b2tlbk1vZGVsKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWRSZXF1ZXN0KG51bGwsIHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdUT0tFTl9JTlZBTElEJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBVc2VyLndoZXJlKHtcbiAgICAgICAgZW1haWw6IHRva2VuTW9kZWwuZW1haWwsXG4gICAgICB9KTtcbiAgICAgIGlmICghdXNlcikge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkUmVxdWVzdChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnVVNFUl9OT1RfRk9VTkQnLCBjb2RlOiAxMjAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgaGFzaGVkUGFzc3dvcmQgPSBhd2FpdCBoYXNoUGFzc3dvcmQocGFzc3dvcmQpO1xuXG4gICAgICB1c2VyLnBhc3N3b3JkID0gaGFzaGVkUGFzc3dvcmQ7XG4gICAgICBhd2FpdCB1c2VyLnNhdmUoKTtcblxuICAgICAgYXdhaXQgUGFzc3dvcmRSZXNldC53aGVyZSgnZW1haWwnLCB1c2VyLmdldCgnZW1haWwnKSkuZGVzdHJveSh7IHJlcXVpcmU6IGZhbHNlIH0pO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoe30pO1xuICAgIH0sXG4gIH0sXG59O1xuIiwiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICByb3V0ZXIoKSB7XG4gICAgY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG59O1xuIiwiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQge1xuICBjaGVjayxcbiAgcXVlcnksXG4gIHBhcmFtLFxuICB2YWxpZGF0aW9uUmVzdWx0LFxufSBmcm9tICdleHByZXNzLXZhbGlkYXRvcic7XG5pbXBvcnQgeyBwaWNrLCBkaWZmZXJlbmNlLCBncm91cEJ5IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBhc3luY01pZGRsZXdhcmUgZnJvbSBcIkAvaHR0cC9taWRkbGV3YXJlL2FzeW5jTWlkZGxld2FyZVwiO1xuaW1wb3J0IEpXVEF1dGggZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvand0QXV0aCc7XG5pbXBvcnQgQnVkZ2V0IGZyb20gJ0AvbW9kZWxzL0J1ZGdldCc7XG5pbXBvcnQgQnVkZ2V0RW50cnkgZnJvbSAnQC9tb2RlbHMvQnVkZ2V0RW50cnknO1xuaW1wb3J0IEFjY291bnQgZnJvbSAnQC9tb2RlbHMvQWNjb3VudCc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ0Avc2VydmljZXMvTW9tZW50JztcbmltcG9ydCBCdWRnZXRFbnRyaWVzU2V0IGZyb20gJ0AvY29sbGVjdGlvbi9CdWRnZXRFbnRyaWVzU2V0JztcbmltcG9ydCBBY2NvdW50VHlwZSBmcm9tICdAL21vZGVscy9BY2NvdW50VHlwZSc7XG5pbXBvcnQgTmVzdGVkU2V0IGZyb20gJ0AvY29sbGVjdGlvbi9OZXN0ZWRTZXQnO1xuaW1wb3J0IHsgZGF0ZVJhbmdlRm9ybWF0IH0gZnJvbSAnQC91dGlscyc7XG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogUm91dGVyIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbiAgICByb3V0ZXIudXNlKEpXVEF1dGgpO1xuXG4gICAgcm91dGVyLnBvc3QoJy8nLFxuICAgICAgdGhpcy5uZXdCdWRnZXQudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLm5ld0J1ZGdldC5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvOmlkJyxcbiAgICAgIHRoaXMuZ2V0QnVkZ2V0LnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5nZXRCdWRnZXQuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmdldCgnLzppZCcsXG4gICAgICB0aGlzLmRlbGV0ZUJ1ZGdldC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZGVsZXRlQnVkZ2V0LmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5nZXQoJy8nLFxuICAgICAgdGhpcy5saXN0QnVkZ2V0cy52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMubGlzdEJ1ZGdldHMuaGFuZGxlcikpO1xuXG4gICAgcmV0dXJuIHJvdXRlcjtcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgYnVkZ2V0IGRldGFpbHMgb2YgdGhlIGdpdmVuIGlkLlxuICAgKi9cbiAgZ2V0QnVkZ2V0OiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ2lkJykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgYnVkZ2V0ID0gYXdhaXQgQnVkZ2V0LnF1ZXJ5KCkuZmluZEJ5SWQoaWQpO1xuXG4gICAgICBpZiAoIWJ1ZGdldCkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLnNlbmQoe1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ2J1ZGdldC5ub3QuZm91bmQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgYWNjb3VudFR5cGVzID0gYXdhaXQgQWNjb3VudFR5cGUucXVlcnkoKS53aGVyZSgnYmFsYW5jZV9zaGVldCcsIHRydWUpO1xuXG4gICAgICBjb25zdCBbYnVkZ2V0RW50cmllcywgYWNjb3VudHNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBCdWRnZXRFbnRyeS5xdWVyeSgpLndoZXJlKCdidWRnZXRfaWQnLCBidWRnZXQuaWQpLFxuICAgICAgICBBY2NvdW50LnF1ZXJ5KCkud2hlcmVJbignYWNjb3VudF90eXBlX2lkJywgYWNjb3VudFR5cGVzLm1hcCgoYSkgPT4gYS5pZCkpLFxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGFjY291bnRzTmVzdGVkU2V0ID0gbmV3IE5lc3RlZFNldChhY2NvdW50cyk7XG5cbiAgICAgIGNvbnN0IGNvbHVtbnMgPSBbXTtcbiAgICAgIGNvbnN0IGZyb21EYXRlID0gbW9tZW50KGJ1ZGdldC55ZWFyKS5zdGFydE9mKCd5ZWFyJylcbiAgICAgICAgLmFkZChidWRnZXQucmFuZ2VPZmZzZXQsIGJ1ZGdldC5yYW5nZUJ5KS50b0RhdGUoKTtcblxuICAgICAgY29uc3QgdG9EYXRlID0gbW9tZW50KGJ1ZGdldC55ZWFyKS5lbmRPZigneWVhcicpLnRvRGF0ZSgpO1xuXG4gICAgICBjb25zdCBkYXRlUmFuZ2UgPSBtb21lbnQucmFuZ2UoZnJvbURhdGUsIHRvRGF0ZSk7XG4gICAgICBjb25zdCBkYXRlUmFuZ2VDb2xsZWN0aW9uID0gQXJyYXkuZnJvbShkYXRlUmFuZ2UuYnkoYnVkZ2V0LnJhbmdlQnksIHtcbiAgICAgICAgc3RlcDogYnVkZ2V0LnJhbmdlSW5jcmVtZW50LCBleGNsdWRlRW5kOiBmYWxzZSwgZXhjbHVkZVN0YXJ0OiBmYWxzZSxcbiAgICAgIH0pKTtcblxuICAgICAgZGF0ZVJhbmdlQ29sbGVjdGlvbi5mb3JFYWNoKChkYXRlKSA9PiB7XG4gICAgICAgIGNvbHVtbnMucHVzaChkYXRlLmZvcm1hdChkYXRlUmFuZ2VGb3JtYXQoYnVkZ2V0LnJhbmdlQnkpKSk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGJ1ZGdldEVudHJpZXNTZXQgPSBCdWRnZXRFbnRyaWVzU2V0LmZyb20oYnVkZ2V0RW50cmllcywge1xuICAgICAgICBvcmRlclNpemU6IGNvbHVtbnMubGVuZ3RoLFxuICAgICAgfSk7XG4gICAgICBidWRnZXRFbnRyaWVzU2V0LnNldFplcm9QbGFjZWhvbGRlcigpO1xuICAgICAgYnVkZ2V0RW50cmllc1NldC5jYWxjVG90YWxTdW1tYXJ5KCk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgIGNvbHVtbnMsXG4gICAgICAgIGFjY291bnRzOiBidWRnZXRFbnRyaWVzU2V0LnRvQXJyYXkoKSxcbiAgICAgICAgdG90YWw6IGJ1ZGdldEVudHJpZXNTZXQudG9BcnJheVRvdGFsU3VtbWFyeSgpLFxuICAgICAgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogRGVsZXRlIHRoZSBnaXZlbiBidWRnZXQuXG4gICAqL1xuICBkZWxldGVCdWRnZXQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBwYXJhbSgnaWQnKS5leGlzdHMoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCBidWRnZXQgPSBhd2FpdCBCdWRnZXQucXVlcnkoKS5maW5kQnlJZChpZCk7XG5cbiAgICAgIGlmICghYnVkZ2V0KSB7XG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwNCkuc2VuZCh7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnYnVkZ2V0Lm5vdC5mb3VuZCcsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBhd2FpdCBCdWRnZXRFbnRyeS5xdWVyeSgpLndoZXJlKCdidWRnZXRfaWQnLCBidWRnZXQuaWQpLmRlbGV0ZSgpO1xuICAgICAgYXdhaXQgYnVkZ2V0LmRlbGV0ZSgpO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBTYXZlcyB0aGUgbmV3IGJ1ZGdldC5cbiAgICovXG4gIG5ld0J1ZGdldDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCduYW1lJykuZXhpc3RzKCksXG4gICAgICBjaGVjaygnZmlzY2FsX3llYXInKS5leGlzdHMoKSxcbiAgICAgIGNoZWNrKCdwZXJpb2QnKS5leGlzdHMoKS5pc0luKFsneWVhcicsICdtb250aCcsICdxdWFydGVyJywgJ2hhbGYteWVhciddKSxcbiAgICAgIGNoZWNrKCdhY2NvdW50c190eXBlJykuZXhpc3RzKCkuaXNJbihbJ2JhbGFuY2Vfc2hlZXQnLCAncHJvZml0X2xvc3MnXSksXG4gICAgICBjaGVjaygnYWNjb3VudHMnKS5pc0FycmF5KCksXG4gICAgICBjaGVjaygnYWNjb3VudHMuKi5hY2NvdW50X2lkJykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdhY2NvdW50cy4qLmVudHJpZXMnKS5leGlzdHMoKS5pc0FycmF5KCksXG4gICAgICBjaGVjaygnYWNjb3VudHMuKi5lbnRyaWVzLiouYW1vdW50JykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9GbG9hdCgpLFxuICAgICAgY2hlY2soJ2FjY291bnRzLiouZW50cmllcy4qLm9yZGVyJykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZvcm0gPSB7IC4uLnJlcS5ib2R5IH07XG4gICAgICBjb25zdCBzdWJtaXRBY2NvdW50c0lkcyA9IGZvcm0uYWNjb3VudHMubWFwKChhKSA9PiBhLmFjY291bnRfaWQpO1xuICAgICAgY29uc3Qgc3RvcmVkQWNjb3VudHMgPSBhd2FpdCBBY2NvdW50LnF1ZXJ5KCkud2hlcmVJbignaWQnLCBzdWJtaXRBY2NvdW50c0lkcyk7XG4gICAgICBjb25zdCBzdG9yZWRBY2NvdW50c0lkcyA9IHN0b3JlZEFjY291bnRzLm1hcCgoYSkgPT4gYS5pZCk7XG5cbiAgICAgIGNvbnN0IGVycm9yUmVhc29ucyA9IFtdO1xuICAgICAgY29uc3Qgbm90Rm91bmRBY2NvdW50c0lkcyA9IGRpZmZlcmVuY2Uoc3VibWl0QWNjb3VudHNJZHMsIHN0b3JlZEFjY291bnRzSWRzKTtcblxuICAgICAgaWYgKG5vdEZvdW5kQWNjb3VudHNJZHMubGVuZ3RoID4gMCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ0FDQ09VTlQuTk9ULkZPVU5EJywgY29kZTogMjAwLCBhY2NvdW50czogbm90Rm91bmRBY2NvdW50c0lkcyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZXJyb3JSZWFzb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHsgZXJyb3JzOiBlcnJvclJlYXNvbnMgfSk7XG4gICAgICB9XG4gICAgICAvLyB2YWxpZGF0aW9uIGVudHJpZXMgb3JkZXIuXG4gICAgICBjb25zdCBidWRnZXQgPSBhd2FpdCBCdWRnZXQucXVlcnkoKS5pbnNlcnQoe1xuICAgICAgICAuLi5waWNrKGZvcm0sIFsnbmFtZScsICdmaXNjYWxfeWVhcicsICdwZXJpb2QnLCAnYWNjb3VudHNfdHlwZSddKSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBwcm9taXNlT3BlcnMgPSBbXTtcblxuICAgICAgZm9ybS5hY2NvdW50cy5mb3JFYWNoKChhY2NvdW50KSA9PiB7XG4gICAgICAgIGFjY291bnQuZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGJ1ZGdldEVudHJ5ID0gQnVkZ2V0RW50cnkucXVlcnkoKS5pbnNlcnQoe1xuICAgICAgICAgICAgYWNjb3VudF9pZDogYWNjb3VudC5hY2NvdW50X2lkLFxuICAgICAgICAgICAgYW1vdW50OiBlbnRyeS5hbW91bnQsXG4gICAgICAgICAgICBvcmRlcjogZW50cnkub3JkZXIsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcHJvbWlzZU9wZXJzLnB1c2goYnVkZ2V0RW50cnkpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZU9wZXJzKTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgaWQ6IGJ1ZGdldC5pZCB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBMaXN0IG9mIHBhZ2luYXRlZCBidWRnZXRzIGl0ZW1zLlxuICAgKi9cbiAgbGlzdEJ1ZGdldHM6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBxdWVyeSgneWVhcicpLm9wdGlvbmFsKCksXG4gICAgICBxdWVyeSgnaW5jb21lX3N0YXRlbWVudCcpLm9wdGlvbmFsKCkuaXNCb29sZWFuKCkudG9Cb29sZWFuKCksXG4gICAgICBxdWVyeSgncHJvZml0X2xvc3MnKS5vcHRpb25hbCgpLmlzQm9vbGVhbigpLnRvQm9vbGVhbigpLFxuICAgICAgcXVlcnkoJ3BhZ2UnKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBxdWVyeSgncGFnZV9zaXplJykuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIHF1ZXJ5KCdjdXN0b21fdmlld19pZCcpLm9wdGlvbmFsKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZpbHRlciA9IHtcbiAgICAgICAgcGFnZV9zaXplOiAxMCxcbiAgICAgICAgcGFnZTogMSxcbiAgICAgICAgLi4ucmVxLnF1ZXJ5LFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGJ1ZGdldHMgPSBhd2FpdCBCdWRnZXQucXVlcnkoKS5ydW5CZWZvcmUoKHJlc3VsdCwgcSkgPT4ge1xuICAgICAgICBpZiAoZmlsdGVyLnByb2ZpdF9sb3NzKSB7XG4gICAgICAgICAgcS5tb2RpZnkoJ2ZpbHRlckJ5WWVhcicsIGZpbHRlci55ZWFyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmlsdGVyLmluY29tZV9zdGF0ZW1lbnQpIHtcbiAgICAgICAgICBxLm1vZGlmeSgnZmlsdGVyQnlJbmNvbWVTdGF0ZW1lbnQnLCBmaWx0ZXIuaW5jb21lX3N0YXRlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbHRlci5wcm9maXRfbG9zcykge1xuICAgICAgICAgIHEubW9kaWZ5KCdmaWx0ZXJCeVByb2ZpdExvc3MnLCBmaWx0ZXIucHJvZml0X2xvc3MpO1xuICAgICAgICB9XG4gICAgICAgIHEucGFnZShmaWx0ZXIucGFnZSwgZmlsdGVyLnBhZ2Vfc2l6ZSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgIGl0ZW1zOiBidWRnZXRzLml0ZW1zLFxuICAgICAgfSk7XG4gICAgfSxcbiAgfSxcbn07XG4iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCB7IHF1ZXJ5LCB2YWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IGp3dEF1dGggZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvand0QXV0aCc7XG5pbXBvcnQgYXN5bmNNaWRkbGV3YXJlIGZyb20gJ0AvaHR0cC9taWRkbGV3YXJlL2FzeW5jTWlkZGxld2FyZSc7XG5pbXBvcnQgQnVkZ2V0IGZyb20gJ0AvbW9kZWxzL0J1ZGdldCc7XG5pbXBvcnQgQWNjb3VudCBmcm9tICdAL21vZGVscy9BY2NvdW50JztcbmltcG9ydCBBY2NvdW50VHlwZSBmcm9tICdAL21vZGVscy9BY2NvdW50VHlwZSc7XG5pbXBvcnQgTmVzdGVkU2V0IGZyb20gJ0AvY29sbGVjdGlvbi9OZXN0ZWRTZXQnO1xuaW1wb3J0IEJ1ZGdldEVudHJ5IGZyb20gJ0AvbW9kZWxzL0J1ZGdldEVudHJ5JztcbmltcG9ydCB7IGRhdGVSYW5nZUZvcm1hdCB9IGZyb20gJ0AvdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgLyoqXG4gICAqIFJvdXRlciBjb25zdHJ1Y3Rvci5cbiAgICovXG4gIHJvdXRlcigpIHtcbiAgICBjb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuXG4gICAgcm91dGVyLnVzZShqd3RBdXRoKTtcblxuICAgIHJvdXRlci5nZXQoJy9idWRnZXRfdmVyc2VzX2FjdHVhbC86cmVwb3J0SWQnLFxuICAgICAgdGhpcy5idWRnZXRWZXJzZXNBY3R1YWwudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmJ1ZGdldFZlcnNlc0FjdHVhbC5oYW5kbGVyKSk7XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9LFxuXG4gIGJ1ZGdldFZlcnNlc0FjdHVhbDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHF1ZXJ5KCdiYXNpcycpLm9wdGlvbmFsKCkuaXNJbihbJ2Nhc2gnLCAnYWNjdXJhbCddKSxcbiAgICAgIHF1ZXJ5KCdwZXJpb2QnKS5vcHRpb25hbCgpLFxuICAgICAgcXVlcnkoJ2FjdGl2ZV9hY2NvdW50cycpLm9wdGlvbmFsKCkudG9Cb29sZWFuKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgeyByZXBvcnRJZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IGZvcm0gPSB7IC4uLnJlcS5ib2R5IH07XG4gICAgICBjb25zdCBlcnJvclJlYXNvbnMgPSBbXTtcblxuICAgICAgY29uc3QgYnVkZ2V0ID0gYXdhaXQgQnVkZ2V0LnF1ZXJ5KCkuZmluZEJ5SWQocmVwb3J0SWQpO1xuXG4gICAgICBpZiAoIWJ1ZGdldCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdCVURHRVRfTk9UX0ZPVU5EJywgY29kZTogMTAwIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgYnVkZ2V0RW50cmllcyA9IGF3YWl0IEJ1ZGdldEVudHJ5LnF1ZXJ5KCkud2hlcmUoJ2J1ZGdldF9pZCcsIGJ1ZGdldC5pZCk7XG5cbiAgICAgIGlmIChlcnJvclJlYXNvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoeyBlcnJvcnM6IGVycm9yUmVhc29ucyB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFjY291bnRUeXBlcyA9IGF3YWl0IEFjY291bnRUeXBlLnF1ZXJ5KClcbiAgICAgICAgLndoZXJlKCdiYWxhbmNlX3NoZWV0JywgYnVkZ2V0LmFjY291bnRUeXBlcyA9PT0gJ2JhbGFuY2Vfc2hlZXQnKVxuICAgICAgICAud2hlcmUoJ2luY29tZV9zaGVldCcsIGJ1ZGdldC5hY2NvdW50VHlwZXMgPT09ICdwcm9maXRfbG9zc3MnKTtcblxuICAgICAgY29uc3QgYWNjb3VudHMgPSBhd2FpdCBBY2NvdW50LnF1ZXJ5KCkucnVuQmVmb3JlKChyZXN1bHQsIHEpID0+IHtcbiAgICAgICAgY29uc3QgYWNjb3VudFR5cGVzSWRzID0gYWNjb3VudFR5cGVzLm1hcCgodCkgPT4gdC5pZCk7XG5cbiAgICAgICAgaWYgKGFjY291bnRUeXBlc0lkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcS53aGVyZUluKCdhY2NvdW50X3R5cGVfaWQnLCBhY2NvdW50VHlwZXNJZHMpO1xuICAgICAgICB9XG4gICAgICAgIHEud2hlcmUoJ2FjdGl2ZScsIGZvcm0uYWN0aXZlX2FjY291bnRzID09PSB0cnVlKTtcbiAgICAgICAgcS53aXRoR3JhcGhGZXRjaGVkKCd0cmFuc2FjdGlvbnMnKTtcbiAgICAgIH0pO1xuICAgICAgICBcbiAgICAgIC8vIGNvbnN0IGFjY291bnRzTmVzdGVkU2V0ID0gTmVzdGVkU2V0LmZyb20oYWNjb3VudHMpO1xuXG4gICAgICBjb25zdCBmcm9tRGF0ZSA9IG1vbWVudChidWRnZXQueWVhcikuc3RhcnRPZigneWVhcicpXG4gICAgICAgIC5hZGQoYnVkZ2V0LnJhbmdlT2Zmc2V0LCBidWRnZXQucmFuZ2VCeSkudG9EYXRlKCk7XG5cbiAgICAgIGNvbnN0IHRvRGF0ZSA9IG1vbWVudChidWRnZXQueWVhcikuZW5kT2YoJ3llYXInKS50b0RhdGUoKTtcblxuICAgICAgY29uc3QgZGF0ZVJhbmdlID0gbW9tZW50LnJhbmdlKGZyb21EYXRlLCB0b0RhdGUpO1xuICAgICAgY29uc3QgZGF0ZVJhbmdlQ29sbGVjdGlvbiA9IEFycmF5LmZyb20oZGF0ZVJhbmdlLmJ5KGJ1ZGdldC5yYW5nZUJ5LCB7XG4gICAgICAgIHN0ZXA6IGJ1ZGdldC5yYW5nZUluY3JlbWVudCwgZXhjbHVkZUVuZDogZmFsc2UsIGV4Y2x1ZGVTdGFydDogZmFsc2UsXG4gICAgICB9KSk7XG5cbiAgICAvLyAgIC8vIGNvbnN0IGFjY291bnRzID0ge1xuICAgIC8vICAgLy8gICBhc3NldHM6IFtcbiAgICAvLyAgIC8vICAgICB7XG4gICAgLy8gICAvLyAgICAgICBuYW1lOiAnJyxcbiAgICAvLyAgIC8vICAgICAgIGNvZGU6ICcnLFxuICAgIC8vICAgLy8gICAgICAgdG90YWxFbnRyaWVzOiBbXG4gICAgLy8gICAvLyAgICAgICAgIHtcblxuICAgIC8vICAgLy8gICAgICAgICB9XG4gICAgLy8gICAvLyAgICAgICBdLFxuICAgIC8vICAgLy8gICAgICAgY2hpbGRyZW46IFtcbiAgICAvLyAgIC8vICAgICAgICAge1xuICAgIC8vICAgLy8gICAgICAgICAgIG5hbWU6ICcnLFxuICAgIC8vICAgLy8gICAgICAgICAgIGNvZGU6ICcnLFxuICAgIC8vICAgLy8gICAgICAgICAgIGVudHJpZXM6IFtcbiAgICAvLyAgIC8vICAgICAgICAgICAgIHtcblxuICAgIC8vICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgLy8gICAgICAgICAgIF1cbiAgICAvLyAgIC8vICAgICAgICAgfVxuICAgIC8vICAgLy8gICAgICAgXVxuICAgIC8vICAgLy8gICAgIH1cbiAgICAvLyAgIC8vICAgXVxuICAgIC8vICAgLy8gfVxuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoe1xuICAgICAgICBjb2x1bW5zOiBkYXRlUmFuZ2VDb2xsZWN0aW9uLm1hcChkID0+IGQuZm9ybWF0KGRhdGVSYW5nZUZvcm1hdChidWRnZXQucmFuZ2VCeSkpKSxcbiAgICAgICAgLy8gYWNjb3VudHM6IHtcbiAgICAgICAgLy8gICBhc3NldDogW10sXG4gICAgICAgIC8vICAgbGlhYmlsaXRpZXM6IFtdLFxuICAgICAgICAvLyAgIGVxdWFpdHk6IFtdLFxuXG4gICAgICAgIC8vICAgaW5jb21lOiBbXSxcbiAgICAgICAgLy8gICBleHBlbnNlczogW10sXG4gICAgICAgIC8vIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gIH0sXG59IiwiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgeyBjaGVjaywgdmFsaWRhdGlvblJlc3VsdCB9IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJztcbmltcG9ydCBhc3luY01pZGRsZXdhcmUgZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvYXN5bmNNaWRkbGV3YXJlJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIHJvdXRlcigpIHtcbiAgICBjb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuXG4gICAgcm91dGVyLmdldCgnL2FsbCcsXG4gICAgICB0aGlzLmFsbC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuYWxsLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5nZXQoJy9yZWdpc3RlcmVkJyxcbiAgICAgIHRoaXMucmVnaXN0ZXJlZC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMucmVnaXN0ZXJlZC5oYW5kbGVyKSk7XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9LFxuXG4gIGFsbDoge1xuICAgIHZhbGlkYXRpb246IFtdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgY3VycmVuY2llczogW1xuICAgICAgICAgIHsgY3VycmVuY3lfY29kZTogJ1VTRCcsIGN1cnJlbmN5X3NpZ246ICckJyB9LFxuICAgICAgICAgIHsgY3VycmVuY3lfY29kZTogJ0xZRCcsIGN1cnJlbmN5X3NpZ246ICcnIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxuXG4gIHJlZ2lzdGVyZWQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgIGN1cnJlbmNpZXM6IFtcbiAgICAgICAgICB7IGN1cnJlbmN5X2NvZGU6ICdVU0QnLCBjdXJyZW5jeV9zaWduOiAnJCcgfSxcbiAgICAgICAgICB7IGN1cnJlbmN5X2NvZGU6ICdMWUQnLCBjdXJyZW5jeV9zaWduOiAnJyB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSxcbiAgfSxcbn07IiwiXG5leHBvcnQgZGVmYXVsdCB7XG5cblxuICByb3V0ZXIoKSB7XG5cbiAgfSxcbiAgXG4gIGFkZEV4Y2hhbmdlUHJpY2U6IHtcbiAgICB2YWxpZGF0aW9uOiB7XG4gICAgICBcbiAgICB9LFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcblxuICAgIH0sXG4gIH0sXG59IiwiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICByb3V0ZXIoKSB7XG4gICAgY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG59O1xuIiwiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQge1xuICBjaGVjayxcbiAgcGFyYW0sXG4gIHF1ZXJ5LFxuICB2YWxpZGF0aW9uUmVzdWx0LFxufSBmcm9tICdleHByZXNzLXZhbGlkYXRvcic7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgeyBkaWZmZXJlbmNlLCBjaGFpbiwgb21pdCB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgYXN5bmNNaWRkbGV3YXJlIGZyb20gJ0AvaHR0cC9taWRkbGV3YXJlL2FzeW5jTWlkZGxld2FyZSc7XG5pbXBvcnQgRXhwZW5zZSBmcm9tICdAL21vZGVscy9FeHBlbnNlJztcbmltcG9ydCBBY2NvdW50IGZyb20gJ0AvbW9kZWxzL0FjY291bnQnO1xuaW1wb3J0IEpvdXJuYWxQb3N0ZXIgZnJvbSAnQC9zZXJ2aWNlcy9BY2NvdW50aW5nL0pvdXJuYWxQb3N0ZXInO1xuaW1wb3J0IEpvdXJuYWxFbnRyeSBmcm9tICdAL3NlcnZpY2VzL0FjY291bnRpbmcvSm91cm5hbEVudHJ5JztcbmltcG9ydCBKV1RBdXRoIGZyb20gJ0AvaHR0cC9taWRkbGV3YXJlL2p3dEF1dGgnO1xuaW1wb3J0IEFjY291bnRUcmFuc2FjdGlvbiBmcm9tICdAL21vZGVscy9BY2NvdW50VHJhbnNhY3Rpb24nO1xuaW1wb3J0IFZpZXcgZnJvbSAnQC9tb2RlbHMvVmlldyc7XG5pbXBvcnQgUmVzb3VyY2UgZnJvbSAnLi4vLi4vbW9kZWxzL1Jlc291cmNlJztcbmltcG9ydCBSZXNvdXJjZUN1c3RvbUZpZWxkUmVwb3NpdG9yeSBmcm9tICdAL3NlcnZpY2VzL0N1c3RvbUZpZWxkcy9SZXNvdXJjZUN1c3RvbUZpZWxkUmVwb3NpdG9yeSc7XG5pbXBvcnQge1xuICB2YWxpZGF0ZVZpZXdSb2xlcyxcbiAgbWFwVmlld1JvbGVzVG9Db25kaXRpb25hbHMsXG59IGZyb20gJ0AvbGliL1ZpZXdSb2xlc0J1aWxkZXInO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBSb3V0ZXIgY29uc3RydWN0b3IuXG4gICAqL1xuICByb3V0ZXIoKSB7XG4gICAgY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcbiAgICByb3V0ZXIudXNlKEpXVEF1dGgpO1xuXG4gICAgcm91dGVyLnBvc3QoJy8nLFxuICAgICAgdGhpcy5uZXdFeHBlbnNlLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5uZXdFeHBlbnNlLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCcvOmlkL3B1Ymxpc2gnLFxuICAgICAgdGhpcy5wdWJsaXNoRXhwZW5zZS52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMucHVibGlzaEV4cGVuc2UuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmRlbGV0ZSgnLzppZCcsXG4gICAgICB0aGlzLmRlbGV0ZUV4cGVuc2UudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmRlbGV0ZUV4cGVuc2UuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLnBvc3QoJy9idWxrJyxcbiAgICAgIHRoaXMuYnVsa0FkZEV4cGVuc2VzLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5idWxrQWRkRXhwZW5zZXMuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLnBvc3QoJy86aWQnLFxuICAgICAgdGhpcy51cGRhdGVFeHBlbnNlLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy51cGRhdGVFeHBlbnNlLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5nZXQoJy8nLFxuICAgICAgdGhpcy5saXN0RXhwZW5zZXMudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmxpc3RFeHBlbnNlcy5oYW5kbGVyKSk7XG5cbiAgICAvLyByb3V0ZXIuZ2V0KCcvOmlkJyxcbiAgICAvLyAgIHRoaXMuZ2V0RXhwZW5zZS52YWxpZGF0aW9uLFxuICAgIC8vICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZ2V0RXhwZW5zZS5oYW5kbGVyKSk7XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTYXZlcyBhIG5ldyBleHBlbnNlLlxuICAgKi9cbiAgbmV3RXhwZW5zZToge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCdkYXRlJykub3B0aW9uYWwoKSxcbiAgICAgIGNoZWNrKCdwYXltZW50X2FjY291bnRfaWQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2V4cGVuc2VfYWNjb3VudF9pZCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnZGVzY3JpcHRpb24nKS5vcHRpb25hbCgpLFxuICAgICAgY2hlY2soJ2Ftb3VudCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvRmxvYXQoKSxcbiAgICAgIGNoZWNrKCdjdXJyZW5jeV9jb2RlJykub3B0aW9uYWwoKSxcbiAgICAgIGNoZWNrKCdleGNoYW5nZV9yYXRlJykub3B0aW9uYWwoKS5pc051bWVyaWMoKS50b0Zsb2F0KCksXG4gICAgICBjaGVjaygncHVibGlzaCcpLm9wdGlvbmFsKCkuaXNCb29sZWFuKCkudG9Cb29sZWFuKCksXG4gICAgICBjaGVjaygnY3VzdG9tX2ZpZWxkcycpLm9wdGlvbmFsKCkuaXNBcnJheSh7IG1pbjogMSB9KSxcbiAgICAgIGNoZWNrKCdjdXN0b21fZmllbGRzLioua2V5JykuZXhpc3RzKCkudHJpbSgpLmVzY2FwZSgpLFxuICAgICAgY2hlY2soJ2N1c3RvbV9maWVsZHMuKi52YWx1ZScpLmV4aXN0cygpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGZvcm0gPSB7XG4gICAgICAgIGRhdGU6IG5ldyBEYXRlKCksXG4gICAgICAgIHB1Ymxpc2hlZDogZmFsc2UsXG4gICAgICAgIGN1c3RvbV9maWVsZHM6IFtdLFxuICAgICAgICAuLi5yZXEuYm9keSxcbiAgICAgIH07XG4gICAgICAvLyBDb252ZXJ0IHRoZSBkYXRlIHRvIHRoZSBnZW5lcmFsIGZvcm1hdC5cbiAgICAgIGZvcm0uZGF0ZSA9IG1vbWVudChmb3JtLmRhdGUpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuXG4gICAgICBjb25zdCBlcnJvclJlYXNvbnMgPSBbXTtcbiAgICAgIGNvbnN0IHBheW1lbnRBY2NvdW50ID0gYXdhaXQgQWNjb3VudC5xdWVyeSgpXG4gICAgICAgIC5maW5kQnlJZChmb3JtLnBheW1lbnRfYWNjb3VudF9pZCkuZmlyc3QoKTtcblxuICAgICAgaWYgKCFwYXltZW50QWNjb3VudCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdQQVlNRU5ULkFDQ09VTlQuTk9ULkZPVU5EJywgY29kZTogMTAwIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZXhwZW5zZUFjY291bnQgPSBhd2FpdCBBY2NvdW50LnF1ZXJ5KCkuZmluZEJ5SWQoZm9ybS5leHBlbnNlX2FjY291bnRfaWQpLmZpcnN0KCk7XG5cbiAgICAgIGlmICghZXhwZW5zZUFjY291bnQpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnRVhQRU5TRS5BQ0NPVU5ULk5PVC5GT1VORCcsIGNvZGU6IDIwMCB9KTtcbiAgICAgIH1cbiAgICAgIC8vIGNvbnN0IGN1c3RvbUZpZWxkcyA9IG5ldyBSZXNvdXJjZUN1c3RvbUZpZWxkUmVwb3NpdG9yeShFeHBlbnNlKTtcbiAgICAgIC8vIGF3YWl0IGN1c3RvbUZpZWxkcy5sb2FkKCk7XG5cbiAgICAgIC8vIGlmIChjdXN0b21GaWVsZHMudmFsaWRhdGVFeGlzdEN1c3RvbUZpZWxkcygpKSB7XG4gICAgICAvLyAgIGVycm9yUmVhc29ucy5wdXNoKHsgdHlwZTogJ0NVU1RPTS5GSUVMRFMuU0xVR1MuTk9ULkVYSVNUUycsIGNvZGU6IDQwMCB9KTtcbiAgICAgIC8vIH1cbiAgICAgIGlmIChlcnJvclJlYXNvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoeyBlcnJvcnM6IGVycm9yUmVhc29ucyB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGV4cGVuc2VUcmFuc2FjdGlvbiA9IGF3YWl0IEV4cGVuc2UucXVlcnkoKS5pbnNlcnRBbmRGZXRjaCh7XG4gICAgICAgIC4uLm9taXQoZm9ybSwgWydjdXN0b21fZmllbGRzJ10pLFxuICAgICAgfSk7XG4gICAgICAvLyBjdXN0b21GaWVsZHMuZmlsbEN1c3RvbUZpZWxkcyhleHBlbnNlVHJhbnNhY3Rpb24uaWQsIGZvcm0uY3VzdG9tX2ZpZWxkcyk7XG5cbiAgICAgIGNvbnN0IGpvdXJuYWxFbnRyaWVzID0gbmV3IEpvdXJuYWxQb3N0ZXIoKTtcbiAgICAgIGNvbnN0IGNyZWRpdEVudHJ5ID0gbmV3IEpvdXJuYWxFbnRyeSh7XG4gICAgICAgIGNyZWRpdDogZm9ybS5hbW91bnQsXG4gICAgICAgIHJlZmVyZW5jZUlkOiBleHBlbnNlVHJhbnNhY3Rpb24uaWQsXG4gICAgICAgIHJlZmVyZW5jZVR5cGU6IEV4cGVuc2UucmVmZXJlbmNlVHlwZSxcbiAgICAgICAgZGF0ZTogZm9ybS5kYXRlLFxuICAgICAgICBhY2NvdW50OiBleHBlbnNlQWNjb3VudC5pZCxcbiAgICAgICAgYWNjb3VudE5vcm1hbDogJ2RlYml0JyxcbiAgICAgICAgZHJhZnQ6ICFmb3JtLnB1Ymxpc2hlZCxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgZGViaXRFbnRyeSA9IG5ldyBKb3VybmFsRW50cnkoe1xuICAgICAgICBkZWJpdDogZm9ybS5hbW91bnQsXG4gICAgICAgIHJlZmVyZW5jZUlkOiBleHBlbnNlVHJhbnNhY3Rpb24uaWQsXG4gICAgICAgIHJlZmVyZW5jZVR5cGU6IEV4cGVuc2UucmVmZXJlbmNlVHlwZSxcbiAgICAgICAgZGF0ZTogZm9ybS5kYXRlLFxuICAgICAgICBhY2NvdW50OiBwYXltZW50QWNjb3VudC5pZCxcbiAgICAgICAgYWNjb3VudE5vcm1hbDogJ2RlYml0JyxcbiAgICAgICAgZHJhZnQ6ICFmb3JtLnB1Ymxpc2hlZCxcbiAgICAgIH0pO1xuICAgICAgam91cm5hbEVudHJpZXMuY3JlZGl0KGNyZWRpdEVudHJ5KTtcbiAgICAgIGpvdXJuYWxFbnRyaWVzLmRlYml0KGRlYml0RW50cnkpO1xuXG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIC8vIGN1c3RvbUZpZWxkcy5zYXZlQ3VzdG9tRmllbGRzKGV4cGVuc2VUcmFuc2FjdGlvbi5pZCksXG4gICAgICAgIGpvdXJuYWxFbnRyaWVzLnNhdmVFbnRyaWVzKCksXG4gICAgICAgIGpvdXJuYWxFbnRyaWVzLnNhdmVCYWxhbmNlKCksXG4gICAgICBdKTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGlkOiBleHBlbnNlVHJhbnNhY3Rpb24uaWQgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogQnVsayBhZGQgZXhwbmVzZXMgdG8gdGhlIGdpdmVuIGFjY291bnRzLlxuICAgKi9cbiAgYnVsa0FkZEV4cGVuc2VzOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgY2hlY2soJ2V4cGVuc2VzJykuZXhpc3RzKCkuaXNBcnJheSh7IG1pbjogMSB9KSxcbiAgICAgIGNoZWNrKCdleHBlbnNlcy4qLmRhdGUnKS5vcHRpb25hbCgpLmlzSVNPODYwMSgpLFxuICAgICAgY2hlY2soJ2V4cGVuc2VzLioucGF5bWVudF9hY2NvdW50X2lkJykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdleHBlbnNlcy4qLmV4cGVuc2VfYWNjb3VudF9pZCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnZXhwZW5zZXMuKi5kZXNjcmlwdGlvbicpLm9wdGlvbmFsKCksXG4gICAgICBjaGVjaygnZXhwZW5zZXMuKi5hbW91bnQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0Zsb2F0KCksXG4gICAgICBjaGVjaygnZXhwZW5zZXMuKi5jdXJyZW5jeV9jb2RlJykub3B0aW9uYWwoKSxcbiAgICAgIGNoZWNrKCdleHBlbnNlcy4qLmV4Y2hhbmdlX3JhdGUnKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvRmxvYXQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmb3JtID0geyAuLi5yZXEuYm9keSB9O1xuICAgICAgY29uc3QgZXJyb3JSZWFzb25zID0gW107XG5cbiAgICAgIGNvbnN0IHBheW1lbnRBY2NvdW50c0lkcyA9IGNoYWluKGZvcm0uZXhwZW5zZXMpXG4gICAgICAgIC5tYXAoKGUpID0+IGUucGF5bWVudF9hY2NvdW50X2lkKS51bmlxKCkudmFsdWUoKTtcbiAgICAgIGNvbnN0IGV4cGVuc2VBY2NvdW50c0lkcyA9IGNoYWluKGZvcm0uZXhwZW5zZXMpXG4gICAgICAgIC5tYXAoKGUpID0+IGUuZXhwZW5zZV9hY2NvdW50X2lkKS51bmlxKCkudmFsdWUoKTtcblxuICAgICAgY29uc3QgW2V4cGVuc2VzQWNjb3VudHMsIHBheW1lbnRBY2NvdW50c10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIEFjY291bnQucXVlcnkoKS53aGVyZUluKCdpZCcsIGV4cGVuc2VBY2NvdW50c0lkcyksXG4gICAgICAgIEFjY291bnQucXVlcnkoKS53aGVyZUluKCdpZCcsIHBheW1lbnRBY2NvdW50c0lkcyksXG4gICAgICBdKTtcbiAgICAgIGNvbnN0IHN0b3JlZEV4cGVuc2VzQWNjb3VudHNJZHMgPSBleHBlbnNlc0FjY291bnRzLm1hcCgoYSkgPT4gYS5pZCk7XG4gICAgICBjb25zdCBzdG9yZWRQYXltZW50QWNjb3VudHNJZHMgPSBwYXltZW50QWNjb3VudHMubWFwKChhKSA9PiBhLmlkKTtcblxuICAgICAgY29uc3Qgbm90Rm91bmRQYXltZW50QWNjb3VudHNJZHMgPSBkaWZmZXJlbmNlKGV4cGVuc2VBY2NvdW50c0lkcywgc3RvcmVkRXhwZW5zZXNBY2NvdW50c0lkcyk7XG4gICAgICBjb25zdCBub3RGb3VuZEV4cGVuc2VBY2NvdW50c0lkcyA9IGRpZmZlcmVuY2UocGF5bWVudEFjY291bnRzSWRzLCBzdG9yZWRQYXltZW50QWNjb3VudHNJZHMpO1xuXG4gICAgICBpZiAobm90Rm91bmRQYXltZW50QWNjb3VudHNJZHMubGVuZ3RoID4gMCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ1BBWU1FTlkuQUNDT1VOVFMuTk9ULkZPVU5EJyxcbiAgICAgICAgICBjb2RlOiAxMDAsXG4gICAgICAgICAgYWNjb3VudHM6IG5vdEZvdW5kUGF5bWVudEFjY291bnRzSWRzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChub3RGb3VuZEV4cGVuc2VBY2NvdW50c0lkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnRVhQRU5TRS5BQ0NPVU5UUy5OT1QuRk9VTkQnLFxuICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICBhY2NvdW50czogbm90Rm91bmRFeHBlbnNlQWNjb3VudHNJZHMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGVycm9yUmVhc29ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWRSZXF1ZXN0KG51bGwsIHsgcmVhc29uczogZXJyb3JSZWFzb25zIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZXhwZW5zZVNhdmVPcGVycyA9IFtdO1xuICAgICAgY29uc3Qgam91cm5hbFBvc3RlciA9IG5ldyBKb3VybmFsUG9zdGVyKCk7XG5cbiAgICAgIGZvcm0uZXhwZW5zZXMuZm9yRWFjaChhc3luYyAoZXhwZW5zZSkgPT4ge1xuICAgICAgICBjb25zdCBleHBlbnNlU2F2ZU9wZXIgPSBFeHBlbnNlLnF1ZXJ5KCkuaW5zZXJ0KHsgLi4uZXhwZW5zZSB9KTtcbiAgICAgICAgZXhwZW5zZVNhdmVPcGVycy5wdXNoKGV4cGVuc2VTYXZlT3Blcik7XG4gICAgICB9KTtcbiAgICAgIC8vIFdhaXQgdW5pdCBzYXZlIGFsbCBleHBlbnNlIHRyYW5zYWN0aW9ucy5cbiAgICAgIGNvbnN0IHNhdmVkRXhwZW5zZVRyYW5zYWN0aW9ucyA9IGF3YWl0IFByb21pc2UuYWxsKGV4cGVuc2VTYXZlT3BlcnMpO1xuXG4gICAgICBzYXZlZEV4cGVuc2VUcmFuc2FjdGlvbnMuZm9yRWFjaCgoZXhwZW5zZSkgPT4ge1xuICAgICAgICBjb25zdCBkYXRlID0gbW9tZW50KGV4cGVuc2UuZGF0ZSkuZm9ybWF0KCdZWVlZLURELU1NJyk7XG5cbiAgICAgICAgY29uc3QgZGViaXQgPSBuZXcgSm91cm5hbEVudHJ5KHtcbiAgICAgICAgICBkZWJpdDogZXhwZW5zZS5hbW91bnQsXG4gICAgICAgICAgcmVmZXJlbmNlSWQ6IGV4cGVuc2UuaWQsXG4gICAgICAgICAgcmVmZXJlbmNlVHlwZTogRXhwZW5zZS5yZWZlcmVuY2VUeXBlLFxuICAgICAgICAgIGFjY291bnQ6IGV4cGVuc2UucGF5bWVudF9hY2NvdW50X2lkLFxuICAgICAgICAgIGFjY291bnROb3JtYWw6ICdkZWJpdCcsXG4gICAgICAgICAgZGF0ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGNyZWRpdCA9IG5ldyBKb3VybmFsRW50cnkoe1xuICAgICAgICAgIGNyZWRpdDogZXhwZW5zZS5hbW91bnQsXG4gICAgICAgICAgcmVmZXJlbmNlSWQ6IGV4cGVuc2UuaWQsXG4gICAgICAgICAgcmVmZXJlbmNlVHlwZTogRXhwZW5zZS5yZWZlcmVuY2VJZCxcbiAgICAgICAgICBhY2NvdW50OiBleHBlbnNlLmV4cGVuc2VfYWNjb3VudF9pZCxcbiAgICAgICAgICBhY2NvdW50Tm9ybWFsOiAnZGViaXQnLFxuICAgICAgICAgIGRhdGUsXG4gICAgICAgIH0pO1xuICAgICAgICBqb3VybmFsUG9zdGVyLmNyZWRpdChjcmVkaXQpO1xuICAgICAgICBqb3VybmFsUG9zdGVyLmRlYml0KGRlYml0KTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBTYXZlIGV4cGVuc2Ugam91cm5hbCBlbnRyaWVzIGFuZCBiYWxhbmNlIGNoYW5nZS5cbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgam91cm5hbFBvc3Rlci5zYXZlRW50cmllcygpLFxuICAgICAgICBqb3VybmFsUG9zdGVyLnNhdmVCYWxhbmNlKCksXG4gICAgICBdKTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCgpO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIFB1Ymxpc2ggdGhlIGdpdmVuIGV4cGVuc2UgaWQuXG4gICAqL1xuICBwdWJsaXNoRXhwZW5zZToge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdpZCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgZXJyb3JSZWFzb25zID0gW107XG4gICAgICBjb25zdCBleHBlbnNlID0gYXdhaXQgRXhwZW5zZS5xdWVyeSgpLmZpbmRCeUlkKGlkKTtcblxuICAgICAgaWYgKCFleHBlbnNlKSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHsgdHlwZTogJ0VYUEVOU0UuTk9ULkZPVU5EJywgY29kZTogMTAwIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGVycm9yUmVhc29ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7IGVycm9yczogZXJyb3JSZWFzb25zIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXhwZW5zZS5wdWJsaXNoZWQpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnRVhQRU5TRS5BTFJFQURZLlBVQkxJU0hFRCcsIGNvZGU6IDIwMCB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChlcnJvclJlYXNvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoeyBlcnJvcnM6IGVycm9yUmVhc29ucyB9KTtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgQWNjb3VudFRyYW5zYWN0aW9uLnF1ZXJ5KClcbiAgICAgICAgLndoZXJlKCdyZWZlcmVuY2VfaWQnLCBleHBlbnNlLmlkKVxuICAgICAgICAud2hlcmUoJ3JlZmVyZW5jZV90eXBlJywgJ0V4cGVuc2UnKVxuICAgICAgICAucGF0Y2goe1xuICAgICAgICAgIGRyYWZ0OiBmYWxzZSxcbiAgICAgICAgfSk7XG5cbiAgICAgIGF3YWl0IEV4cGVuc2UucXVlcnkoKVxuICAgICAgICAud2hlcmUoJ2lkJywgZXhwZW5zZS5pZClcbiAgICAgICAgLnVwZGF0ZSh7IHB1Ymxpc2hlZDogdHJ1ZSB9KTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKCk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgcGFnaW5hdGVkIGV4cGVuc2VzIGxpc3QuXG4gICAqL1xuICBsaXN0RXhwZW5zZXM6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBxdWVyeSgnZXhwZW5zZV9hY2NvdW50X2lkJykub3B0aW9uYWwoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgcXVlcnkoJ3BheW1lbnRfYWNjb3VudF9pZCcpLm9wdGlvbmFsKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIHF1ZXJ5KCdub3RlJykub3B0aW9uYWwoKSxcbiAgICAgIHF1ZXJ5KCdyYW5nZV9mcm9tJykub3B0aW9uYWwoKS5pc051bWVyaWMoKS50b0Zsb2F0KCksXG4gICAgICBxdWVyeSgncmFuZ2VfdG8nKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvRmxvYXQoKSxcbiAgICAgIHF1ZXJ5KCdkYXRlX2Zyb20nKS5vcHRpb25hbCgpLmlzSVNPODYwMSgpLFxuICAgICAgcXVlcnkoJ2RhdGVfdG8nKS5vcHRpb25hbCgpLmlzSVNPODYwMSgpLFxuICAgICAgcXVlcnkoJ2NvbHVtbl9zb3J0X29yZGVyJykub3B0aW9uYWwoKS5pc0luKFsnY3JlYXRlZF9hdCcsICdkYXRlJywgJ2Ftb3VudCddKSxcbiAgICAgIHF1ZXJ5KCdzb3J0X29yZGVyJykub3B0aW9uYWwoKS5pc0luKFsnZGVzYycsICdhc2MnXSksXG4gICAgICBxdWVyeSgncGFnZScpLm9wdGlvbmFsKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIHF1ZXJ5KCdwYWdlX3NpemUnKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBxdWVyeSgnY3VzdG9tX3ZpZXdfaWQnKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZmlsdGVyID0ge1xuICAgICAgICBwYWdlX3NpemU6IDEwLFxuICAgICAgICBwYWdlOiAxLFxuICAgICAgICAuLi5yZXEucXVlcnksXG4gICAgICB9O1xuICAgICAgY29uc3QgZXJyb3JSZWFzb25zID0gW107XG4gICAgICBjb25zdCBleHBlbnNlUmVzb3VyY2UgPSBhd2FpdCBSZXNvdXJjZS5xdWVyeSgpLndoZXJlKCduYW1lJywgJ2V4cGVuc2VzJykuZmlyc3QoKTtcblxuICAgICAgaWYgKCFleHBlbnNlUmVzb3VyY2UpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnRVhQRU5TRV9SRVNPVVJDRV9OT1RfRk9VTkQnLCBjb2RlOiAzMDAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZXJyb3JSZWFzb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHsgZXJyb3JzOiBlcnJvclJlYXNvbnMgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCB2aWV3ID0gYXdhaXQgVmlldy5xdWVyeSgpLm9uQnVpbGQoKGJ1aWxkZXIpID0+IHtcbiAgICAgICAgaWYgKGZpbHRlci5jdXN0b21fdmlld19pZCkge1xuICAgICAgICAgIGJ1aWxkZXIud2hlcmUoJ2lkJywgZmlsdGVyLmN1c3RvbV92aWV3X2lkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBidWlsZGVyLndoZXJlKCdmYXZvdXJpdGUnLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBidWlsZGVyLndoZXJlKCdyZXNvdXJjZV9pZCcsIGV4cGVuc2VSZXNvdXJjZS5pZCk7XG4gICAgICAgIGJ1aWxkZXIud2l0aEdyYXBoRmV0Y2hlZCgndmlld1JvbGVzLmZpZWxkJyk7XG4gICAgICAgIGJ1aWxkZXIud2l0aEdyYXBoRmV0Y2hlZCgnY29sdW1ucycpO1xuXG4gICAgICAgIGJ1aWxkZXIuZmlyc3QoKTtcbiAgICAgIH0pO1xuICAgICAgbGV0IHZpZXdDb25kaXRpb25hbHMgPSBbXTtcblxuICAgICAgaWYgKHZpZXcgJiYgdmlldy52aWV3Um9sZXMubGVuZ3RoID4gMCkge1xuICAgICAgICB2aWV3Q29uZGl0aW9uYWxzID0gbWFwVmlld1JvbGVzVG9Db25kaXRpb25hbHModmlldy52aWV3Um9sZXMpO1xuXG4gICAgICAgIGlmICghdmFsaWRhdGVWaWV3Um9sZXModmlld0NvbmRpdGlvbmFscywgdmlldy5yb2xlc0xvZ2ljRXhwcmVzc2lvbikpIHtcbiAgICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdWSUVXLkxPR0lDLkVYUFJFU1NJT04uSU5WQUxJRCcsIGNvZGU6IDQwMCB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIXZpZXcgJiYgZmlsdGVyLmN1c3RvbV92aWV3X2lkKSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHsgdHlwZTogJ1ZJRVdfTk9UX0ZPVU5EJywgY29kZTogMTAwIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGVycm9yUmVhc29ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWRSZXF1ZXN0KG51bGwsIHsgZXJyb3JzOiBlcnJvclJlYXNvbnMgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGV4cGVuc2VzID0gYXdhaXQgRXhwZW5zZS5xdWVyeSgpLm9uQnVpbGQoKGJ1aWxkZXIpID0+IHtcbiAgICAgICAgYnVpbGRlci53aXRoR3JhcGhGZXRjaGVkKCdwYXltZW50QWNjb3VudCcpO1xuICAgICAgICBidWlsZGVyLndpdGhHcmFwaEZldGNoZWQoJ2V4cGVuc2VBY2NvdW50Jyk7XG4gICAgICAgIGJ1aWxkZXIud2l0aEdyYXBoRmV0Y2hlZCgndXNlcicpO1xuXG4gICAgICAgIGlmICh2aWV3Q29uZGl0aW9uYWxzLmxlbmd0aCkge1xuICAgICAgICAgIGJ1aWxkZXIubW9kaWZ5KCd2aWV3Um9sZXNCdWlsZGVyJywgdmlld0NvbmRpdGlvbmFscywgdmlldy5yb2xlc0xvZ2ljRXhwcmVzc2lvbik7XG4gICAgICAgIH1cbiAgICAgICAgYnVpbGRlci5tb2RpZnkoJ2ZpbHRlckJ5QW1vdW50UmFuZ2UnLCBmaWx0ZXIucmFuZ2VfZnJvbSwgZmlsdGVyLnRvX3JhbmdlKTtcbiAgICAgICAgYnVpbGRlci5tb2RpZnkoJ2ZpbHRlckJ5RGF0ZVJhbmdlJywgZmlsdGVyLmRhdGVfZnJvbSwgZmlsdGVyLmRhdGVfdG8pO1xuICAgICAgICBidWlsZGVyLm1vZGlmeSgnZmlsdGVyQnlFeHBlbnNlQWNjb3VudCcsIGZpbHRlci5leHBlbnNlX2FjY291bnRfaWQpO1xuICAgICAgICBidWlsZGVyLm1vZGlmeSgnZmlsdGVyQnlQYXltZW50QWNjb3VudCcsIGZpbHRlci5wYXltZW50X2FjY291bnRfaWQpO1xuICAgICAgICBidWlsZGVyLm1vZGlmeSgnb3JkZXJCeScsIGZpbHRlci5jb2x1bW5fc29ydF9vcmRlciwgZmlsdGVyLnNvcnRfb3JkZXIpO1xuICAgICAgfSkucGFnZShmaWx0ZXIucGFnZSAtIDEsIGZpbHRlci5wYWdlX3NpemUpO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoe1xuICAgICAgICAuLi4odmlldykgPyB7XG4gICAgICAgICAgY3VzdG9tVmlld0lkOiB2aWV3LmlkLCBcbiAgICAgICAgICB2aWV3Q29sdW1uczogdmlldy5jb2x1bW5zLFxuICAgICAgICAgIHZpZXdDb25kaXRpb25hbHMsXG4gICAgICAgIH0gOiB7fSxcbiAgICAgICAgZXhwZW5zZXMsXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBEZWxldGUgdGhlIGdpdmVuIGFjY291bnQuXG4gICAqL1xuICBkZWxldGVFeHBlbnNlOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ2lkJykuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgZXhwZW5zZVRyYW5zYWN0aW9uID0gYXdhaXQgRXhwZW5zZS5xdWVyeSgpLmZpbmRCeUlkKGlkKTtcblxuICAgICAgaWYgKCFleHBlbnNlVHJhbnNhY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5zZW5kKHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdFWFBFTlNFLlRSQU5TQUNUSU9OLk5PVC5GT1VORCcsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBleHBlbnNlRW50cmllcyA9IGF3YWl0IEFjY291bnRUcmFuc2FjdGlvbi5xdWVyeSgpXG4gICAgICAgIC53aGVyZSgncmVmZXJlbmNlX3R5cGUnLCAnRXhwZW5zZScpXG4gICAgICAgIC53aGVyZSgncmVmZXJlbmNlX2lkJywgZXhwZW5zZVRyYW5zYWN0aW9uLmlkKTtcblxuICAgICAgY29uc3QgZXhwZW5zZUVudHJpZXNDb2xsZWN0ID0gbmV3IEpvdXJuYWxQb3N0ZXIoKTtcbiAgICAgIGV4cGVuc2VFbnRyaWVzQ29sbGVjdC5sb2FkRW50cmllcyhleHBlbnNlRW50cmllcyk7XG4gICAgICBleHBlbnNlRW50cmllc0NvbGxlY3QucmV2ZXJzZUVudHJpZXMoKTtcblxuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBFeHBlbnNlLnF1ZXJ5KCkuZmluZEJ5SWQoZXhwZW5zZVRyYW5zYWN0aW9uLmlkKS5kZWxldGUoKSxcbiAgICAgICAgZXhwZW5zZUVudHJpZXNDb2xsZWN0LmRlbGV0ZUVudHJpZXMoKSxcbiAgICAgICAgZXhwZW5zZUVudHJpZXNDb2xsZWN0LnNhdmVCYWxhbmNlKCksXG4gICAgICBdKTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCgpO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBkZXRhaWxzIG9mIHRoZSBnaXZlbiBhY2NvdW50LlxuICAgKi9cbiAgdXBkYXRlRXhwZW5zZToge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdpZCcpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnZGF0ZScpLm9wdGlvbmFsKCkuaXNJU084NjAxKCksXG4gICAgICBjaGVjaygncGF5bWVudF9hY2NvdW50X2lkJykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdleHBlbnNlX2FjY291bnRfaWQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2Rlc2NyaXB0aW9uJykub3B0aW9uYWwoKSxcbiAgICAgIGNoZWNrKCdhbW91bnQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0Zsb2F0KCksXG4gICAgICBjaGVjaygnY3VycmVuY3lfY29kZScpLm9wdGlvbmFsKCksXG4gICAgICBjaGVjaygnZXhjaGFuZ2VfcmF0ZScpLm9wdGlvbmFsKCkuaXNOdW1lcmljKCkudG9GbG9hdCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCBleHBlbnNlVHJhbnNhY3Rpb24gPSBhd2FpdCBFeHBlbnNlLnF1ZXJ5KCkuZmluZEJ5SWQoaWQpO1xuXG4gICAgICBpZiAoIWV4cGVuc2VUcmFuc2FjdGlvbikge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLnNlbmQoe1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ0VYUEVOU0UuVFJBTlNBQ1RJT04uTk9ULkZPVU5EJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBkZXRhaWxzIG9mIHRoZSBnaXZlbiBleHBlbnNlIGlkLlxuICAgKi9cbiAgZ2V0RXhwZW5zZToge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdpZCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgeyBpZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IGV4cGVuc2VUcmFuc2FjdGlvbiA9IGF3YWl0IEV4cGVuc2UucXVlcnkoKS5maW5kQnlJZChpZCk7XG5cbiAgICAgIGlmICghZXhwZW5zZVRyYW5zYWN0aW9uKSB7XG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwNCkuc2VuZCh7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnRVhQRU5TRS5UUkFOU0FDVElPTi5OT1QuRk9VTkQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBleHBlbnNlQ0ZNZXRhZGF0YVJlcG8gPSBuZXcgUmVzb3VyY2VDdXN0b21GaWVsZFJlcG9zaXRvcnkoRXhwZW5zZSk7XG4gICAgICBhd2FpdCBleHBlbnNlQ0ZNZXRhZGF0YVJlcG8ubG9hZCgpO1xuICAgICAgYXdhaXQgZXhwZW5zZUNGTWV0YWRhdGFSZXBvLmZldGNoQ3VzdG9tRmllbGRzTWV0YWRhdGEoZXhwZW5zZVRyYW5zYWN0aW9uLmlkKTtcblxuICAgICAgY29uc3QgZXhwZW5zZUN1c0ZpZWxkc01ldGFkYXRhID0gZXhwZW5zZUNGTWV0YWRhdGFSZXBvLmdldE1ldGFkYXRhKGV4cGVuc2VUcmFuc2FjdGlvbi5pZCk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgIC4uLmV4cGVuc2VUcmFuc2FjdGlvbixcbiAgICAgICAgY3VzdG9tX2ZpZWxkczogW1xuICAgICAgICAgIC4uLmV4cGVuc2VDdXNGaWVsZHNNZXRhZGF0YS50b0FycmF5KCksXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxufTtcbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgY2hlY2ssIHBhcmFtLCB2YWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InO1xuaW1wb3J0IFJlc291cmNlRmllbGQgZnJvbSAnQC9tb2RlbHMvUmVzb3VyY2VGaWVsZCc7XG5pbXBvcnQgUmVzb3VyY2UgZnJvbSAnQC9tb2RlbHMvUmVzb3VyY2UnO1xuaW1wb3J0IGFzeW5jTWlkZGxld2FyZSBmcm9tICcuLi9taWRkbGV3YXJlL2FzeW5jTWlkZGxld2FyZSc7XG5cbi8qKlxuICogVHlwZXMgb2YgdGhlIGN1c3RvbSBmaWVsZHMuXG4gKi9cbmNvbnN0IFRZUEVTID0gWyd0ZXh0JywgJ2VtYWlsJywgJ251bWJlcicsICd1cmwnLCAncGVyY2VudGFnZScsICdjaGVja2JveCcsICdyYWRpbycsICd0ZXh0YXJlYSddO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBSb3V0ZXIgY29uc3RydWN0b3IgbWV0aG9kLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbiAgICByb3V0ZXIucG9zdCgnL3Jlc291cmNlLzpyZXNvdXJjZV9uYW1lJyxcbiAgICAgIHRoaXMuYWRkTmV3RmllbGQudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmFkZE5ld0ZpZWxkLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCcvOmZpZWxkX2lkJyxcbiAgICAgIHRoaXMuZWRpdEZpZWxkLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5lZGl0RmllbGQuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLnBvc3QoJy9zdGF0dXMvOmZpZWxkX2lkJyxcbiAgICAgIHRoaXMuY2hhbmdlU3RhdHVzLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5jaGFuZ2VTdGF0dXMuaGFuZGxlcikpO1xuXG4gICAgLy8gcm91dGVyLmdldCgnLzpmaWVsZF9pZCcsXG4gICAgLy8gICBhc3luY01pZGRsZXdhcmUodGhpcy5nZXRGaWVsZC5oYW5kbGVyKSk7XG5cbiAgICAvLyByb3V0ZXIuZGVsZXRlKCcvOmZpZWxkX2lkJyxcbiAgICAvLyAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmRlbGV0ZUZpZWxkLmhhbmRsZXIpKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFkZHMgYSBuZXcgZmllbGQgY29udHJvbCB0byB0aGUgZ2l2ZW4gcmVzb3VyY2UuXG4gICAqIEBwYXJhbSB7UmVxdWVzdH0gcmVxIC1cbiAgICogQHBhcmFtIHtSZXNwb25zZX0gcmVzIC1cbiAgICovXG4gIGFkZE5ld0ZpZWxkOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ3Jlc291cmNlX25hbWUnKS5leGlzdHMoKS50cmltKCkuZXNjYXBlKCksXG4gICAgICBjaGVjaygnbGFiZWwnKS5leGlzdHMoKS5lc2NhcGUoKS50cmltKCksXG4gICAgICBjaGVjaygnZGF0YV90eXBlJykuZXhpc3RzKCkuaXNJbihUWVBFUyksXG4gICAgICBjaGVjaygnaGVscF90ZXh0Jykub3B0aW9uYWwoKSxcbiAgICAgIGNoZWNrKCdkZWZhdWx0Jykub3B0aW9uYWwoKSxcbiAgICAgIGNoZWNrKCdvcHRpb25zJykub3B0aW9uYWwoKS5pc0FycmF5KCksXG4gICAgICBjaGVjaygnb3B0aW9ucy4qLmtleScpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnb3B0aW9ucy4qLnZhbHVlJykuZXhpc3RzKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IHJlc291cmNlX25hbWU6IHJlc291cmNlTmFtZSB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCByZXNvdXJjZSA9IGF3YWl0IFJlc291cmNlLnF1ZXJ5KCkud2hlcmUoJ25hbWUnLCByZXNvdXJjZU5hbWUpLmZpcnN0KCk7XG5cbiAgICAgIGlmICghcmVzb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKG51bGwsIHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdSRVNPVVJDRV9OT1RfRk9VTkQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZm9ybSA9IHsgb3B0aW9uczogW10sIC4uLnJlcS5ib2R5IH07XG4gICAgICBjb25zdCBjaG9pY2VzID0gZm9ybS5vcHRpb25zLm1hcCgob3B0aW9uKSA9PiAoeyBrZXk6IG9wdGlvbi5rZXksIHZhbHVlOiBvcHRpb24udmFsdWUgfSkpO1xuXG4gICAgICBjb25zdCBzdG9yZWRSZXNvdXJjZSA9IGF3YWl0IFJlc291cmNlRmllbGQucXVlcnkoKS5pbnNlcnRBbmRGZXRjaCh7XG4gICAgICAgIGRhdGFfdHlwZTogZm9ybS5kYXRhX3R5cGUsXG4gICAgICAgIGxhYmVsX25hbWU6IGZvcm0ubGFiZWwsXG4gICAgICAgIGhlbHBfdGV4dDogZm9ybS5oZWxwX3RleHQsXG4gICAgICAgIGRlZmF1bHQ6IGZvcm0uZGVmYXVsdCxcbiAgICAgICAgcmVzb3VyY2VfaWQ6IHJlc291cmNlLmlkLFxuICAgICAgICBvcHRpb25zOiBjaG9pY2VzLFxuICAgICAgICBpbmRleDogLTEsXG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGlkOiBzdG9yZWRSZXNvdXJjZS5pZCB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBFZGl0IGRldGFpbHMgb2YgdGhlIGdpdmVuIGZpZWxkLlxuICAgKi9cbiAgZWRpdEZpZWxkOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ2ZpZWxkX2lkJykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdsYWJlbCcpLmV4aXN0cygpLmVzY2FwZSgpLnRyaW0oKSxcbiAgICAgIGNoZWNrKCdkYXRhX3R5cGUnKS5leGlzdHMoKS5pc0luKFRZUEVTKSxcbiAgICAgIGNoZWNrKCdoZWxwX3RleHQnKS5vcHRpb25hbCgpLFxuICAgICAgY2hlY2soJ2RlZmF1bHQnKS5vcHRpb25hbCgpLFxuICAgICAgY2hlY2soJ29wdGlvbnMnKS5vcHRpb25hbCgpLmlzQXJyYXkoKSxcbiAgICAgIGNoZWNrKCdvcHRpb25zLioua2V5JykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdvcHRpb25zLioudmFsdWUnKS5leGlzdHMoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgZmllbGRfaWQ6IGZpZWxkSWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZmllbGQgPSBhd2FpdCBSZXNvdXJjZUZpZWxkLnF1ZXJ5KCkuZmluZEJ5SWQoZmllbGRJZCk7XG5cbiAgICAgIGlmICghZmllbGQpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKG51bGwsIHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdGSUVMRF9OT1RfRk9VTkQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLy8gU2V0cyB0aGUgZGVmYXVsdCB2YWx1ZSBvZiBvcHRpb25hbCBmaWVsZHMuXG4gICAgICBjb25zdCBmb3JtID0geyBvcHRpb25zOiBbXSwgLi4ucmVxLmJvZHkgfTtcbiAgICAgIGNvbnN0IGNob2ljZXMgPSBmb3JtLm9wdGlvbnMubWFwKChvcHRpb24pID0+ICh7IGtleTogb3B0aW9uLmtleSwgdmFsdWU6IG9wdGlvbi52YWx1ZSB9KSk7XG5cbiAgICAgIGF3YWl0IFJlc291cmNlRmllbGQucXVlcnkoKS5maW5kQnlJZChmaWVsZC5pZCkudXBkYXRlKHtcbiAgICAgICAgZGF0YV90eXBlOiBmb3JtLmRhdGFfdHlwZSxcbiAgICAgICAgbGFiZWxfbmFtZTogZm9ybS5sYWJlbCxcbiAgICAgICAgaGVscF90ZXh0OiBmb3JtLmhlbHBfdGV4dCxcbiAgICAgICAgZGVmYXVsdDogZm9ybS5kZWZhdWx0LFxuICAgICAgICBvcHRpb25zOiBjaG9pY2VzLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyBpZDogZmllbGQuaWQgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGZpZWxkcyBsaXN0IG9mIHRoZSBnaXZlbiByZXNvdXJjZS5cbiAgICogQHBhcmFtIHtSZXF1ZXN0fSByZXEgLVxuICAgKiBAcGFyYW0ge1Jlc3BvbnNlfSByZXMgLVxuICAgKi9cbiAgZmllbGRzTGlzdDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdyZXNvdXJjZV9uYW1lJykudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCB7IHJlc291cmNlX25hbWU6IHJlc291cmNlTmFtZSB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IHJlc291cmNlID0gYXdhaXQgUmVzb3VyY2UucXVlcnkoKS53aGVyZSgnbmFtZScsIHJlc291cmNlTmFtZSkuZmlyc3QoKTtcblxuICAgICAgaWYgKCFyZXNvdXJjZSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ1JFU09VUkNFX05PVF9GT1VORCcsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmaWVsZHMgPSBhd2FpdCBSZXNvdXJjZUZpZWxkLndoZXJlKCdyZXNvdXJjZV9pZCcsIHJlc291cmNlLmlkKS5mZXRjaEFsbCgpO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyBmaWVsZHM6IGZpZWxkcy50b0pTT04oKSB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBDaGFuZ2Ugc3RhdHVzIG9mIHRoZSBnaXZlbiBmaWVsZC5cbiAgICovXG4gIGNoYW5nZVN0YXR1czoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdmaWVsZF9pZCcpLnRvSW50KCksXG4gICAgICBjaGVjaygnYWN0aXZlJykuaXNCb29sZWFuKCkudG9Cb29sZWFuKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGZpZWxkX2lkOiBmaWVsZElkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgZmllbGQgPSBhd2FpdCBSZXNvdXJjZUZpZWxkLnF1ZXJ5KCkuZmluZEJ5SWQoZmllbGRJZCk7XG5cbiAgICAgIGlmICghZmllbGQpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKG51bGwsIHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdOT1RfRk9VTkRfRklFTEQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7IGFjdGl2ZSB9ID0gcmVxLmJvZHk7XG4gICAgICBhd2FpdCBSZXNvdXJjZUZpZWxkLnF1ZXJ5KCkuZmluZEJ5SWQoZmllbGQuaWQpLnBhdGNoKHsgYWN0aXZlIH0pO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyBpZDogZmllbGQuaWQgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgZGV0YWlscyBvZiB0aGUgZ2l2ZW4gZmllbGQuXG4gICAqL1xuICBnZXRGaWVsZDoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdmaWVsZF9pZCcpLnRvSW50KCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGZpZWxkX2lkOiBpZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IGZpZWxkID0gYXdhaXQgUmVzb3VyY2VGaWVsZC53aGVyZSgnaWQnLCBpZCkuZmV0Y2goKTtcblxuICAgICAgaWYgKCFmaWVsZCkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgZmllbGQ6IGZpZWxkLnRvSlNPTigpLFxuICAgICAgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogRGVsZXRlIHRoZSBnaXZlbiBmaWVsZC5cbiAgICovXG4gIGRlbGV0ZUZpZWxkOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ2ZpZWxkX2lkJykudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgZmllbGRfaWQ6IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgZmllbGQgPSBhd2FpdCBSZXNvdXJjZUZpZWxkLndoZXJlKCdpZCcsIGlkKS5mZXRjaCgpO1xuXG4gICAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZCgpO1xuICAgICAgfVxuICAgICAgaWYgKGZpZWxkLmF0dHJpYnV0ZXMucHJlZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkUmVxdWVzdChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnUFJFREVGSU5FRF9GSUVMRCcsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBhd2FpdCBmaWVsZC5kZXN0cm95KCk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGlkOiBmaWVsZC5nZXQoJ2lkJykgfSk7XG4gICAgfSxcbiAgfSxcbn07XG4iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCB7IHF1ZXJ5LCB2YWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHsgcGljayB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgYXN5bmNNaWRkbGV3YXJlIGZyb20gJ0AvaHR0cC9taWRkbGV3YXJlL2FzeW5jTWlkZGxld2FyZSc7XG5pbXBvcnQgQWNjb3VudFRyYW5zYWN0aW9uIGZyb20gJ0AvbW9kZWxzL0FjY291bnRUcmFuc2FjdGlvbic7XG5pbXBvcnQgand0QXV0aCBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9qd3RBdXRoJztcbmltcG9ydCBBY2NvdW50VHlwZSBmcm9tICdAL21vZGVscy9BY2NvdW50VHlwZSc7XG5pbXBvcnQgQWNjb3VudCBmcm9tICdAL21vZGVscy9BY2NvdW50JztcbmltcG9ydCBKb3VybmFsUG9zdGVyIGZyb20gJ0Avc2VydmljZXMvQWNjb3VudGluZy9Kb3VybmFsUG9zdGVyJztcbmltcG9ydCB7IGRhdGVSYW5nZUNvbGxlY3Rpb24gfSBmcm9tICdAL3V0aWxzJztcblxuY29uc3QgZm9ybWF0TnVtYmVyQ2xvc3VyZSA9IChmaWx0ZXIpID0+IChiYWxhbmNlKSA9PiB7XG4gIGxldCBmb3JtYXR0ZWRCYWxhbmNlID0gcGFyc2VGbG9hdChiYWxhbmNlKTtcblxuICBpZiAoZmlsdGVyLm5vX2NlbnRzKSB7XG4gICAgZm9ybWF0dGVkQmFsYW5jZSA9IHBhcnNlSW50KGZvcm1hdHRlZEJhbGFuY2UsIDEwKTtcbiAgfVxuICBpZiAoZmlsdGVyLmRpdmlkZV8xMDAwKSB7XG4gICAgZm9ybWF0dGVkQmFsYW5jZSAvPSAxMDAwO1xuICB9XG4gIHJldHVybiBmb3JtYXR0ZWRCYWxhbmNlO1xufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogUm91dGVyIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG4gICAgcm91dGVyLnVzZShqd3RBdXRoKTtcblxuICAgIHJvdXRlci5nZXQoJy9sZWRnZXInLFxuICAgICAgdGhpcy5sZWRnZXIudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmxlZGdlci5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvZ2VuZXJhbF9sZWRnZXInLFxuICAgICAgdGhpcy5nZW5lcmFsTGVkZ2VyLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5nZW5lcmFsTGVkZ2VyLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5nZXQoJy9iYWxhbmNlX3NoZWV0JyxcbiAgICAgIHRoaXMuYmFsYW5jZVNoZWV0LnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5iYWxhbmNlU2hlZXQuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmdldCgnL3RyaWFsX2JhbGFuY2Vfc2hlZXQnLFxuICAgICAgdGhpcy50cmlhbEJhbGFuY2VTaGVldC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMudHJpYWxCYWxhbmNlU2hlZXQuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmdldCgnL3Byb2ZpdF9sb3NzX3NoZWV0JyxcbiAgICAgIHRoaXMucHJvZml0TG9zc1NoZWV0LnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5wcm9maXRMb3NzU2hlZXQuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmdldCgnL2Nhc2hfZmxvd19zdGF0ZW1lbnQnLFxuICAgICAgdGhpcy5jYXNoRmxvd1N0YXRlbWVudC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuY2FzaEZsb3dTdGF0ZW1lbnQuaGFuZGxlcikpO1xuXG4gICAgcmV0dXJuIHJvdXRlcjtcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGxlZGdlciByZXBvcnQgb2YgdGhlIGdpdmVuIGFjY291bnQuXG4gICAqL1xuICBsZWRnZXI6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBxdWVyeSgnZnJvbV9kYXRlJykub3B0aW9uYWwoKS5pc0lTTzg2MDEoKSxcbiAgICAgIHF1ZXJ5KCd0b19kYXRlJykub3B0aW9uYWwoKS5pc0lTTzg2MDEoKSxcbiAgICAgIHF1ZXJ5KCd0cmFuc2FjdGlvbl90eXBlcycpLm9wdGlvbmFsKCkuaXNBcnJheSh7IG1pbjogMSB9KSxcbiAgICAgIHF1ZXJ5KCdhY2NvdW50X2lkcycpLm9wdGlvbmFsKCkuaXNBcnJheSh7IG1pbjogMSB9KSxcbiAgICAgIHF1ZXJ5KCdhY2NvdW50X2lkcy4qJykub3B0aW9uYWwoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgcXVlcnkoJ2Zyb21fcmFuZ2UnKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBxdWVyeSgndG9fcmFuZ2UnKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBxdWVyeSgnbnVtYmVyX2Zvcm1hdC5ub19jZW50cycpLm9wdGlvbmFsKCkuaXNCb29sZWFuKCkudG9Cb29sZWFuKCksXG4gICAgICBxdWVyeSgnbnVtYmVyX2Zvcm1hdC5kaXZpZGVfMTAwMCcpLm9wdGlvbmFsKCkuaXNCb29sZWFuKCkudG9Cb29sZWFuKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZmlsdGVyID0ge1xuICAgICAgICBmcm9tX3JhbmdlOiBudWxsLFxuICAgICAgICB0b19yYW5nZTogbnVsbCxcbiAgICAgICAgYWNjb3VudF9pZHM6IFtdLFxuICAgICAgICB0cmFuc2FjdGlvbl90eXBlczogW10sXG4gICAgICAgIG51bWJlcl9mb3JtYXQ6IHtcbiAgICAgICAgICBub19jZW50czogZmFsc2UsXG4gICAgICAgICAgZGl2aWRlXzEwMDA6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICAuLi5yZXEucXVlcnksXG4gICAgICB9O1xuICAgICAgY29uc3QgYWNjb3VudHNKb3VybmFsRW50cmllcyA9IGF3YWl0IEFjY291bnRUcmFuc2FjdGlvbi5xdWVyeSgpXG4gICAgICAgIC5tb2RpZnkoJ2ZpbHRlckRhdGVSYW5nZScsIGZpbHRlci5mcm9tX2RhdGUsIGZpbHRlci50b19kYXRlKVxuICAgICAgICAubW9kaWZ5KCdmaWx0ZXJBY2NvdW50cycsIGZpbHRlci5hY2NvdW50X2lkcylcbiAgICAgICAgLm1vZGlmeSgnZmlsdGVyVHJhbnNhY3Rpb25UeXBlcycsIGZpbHRlci50cmFuc2FjdGlvbl90eXBlcylcbiAgICAgICAgLm1vZGlmeSgnZmlsdGVyQW1vdW50UmFuZ2UnLCBmaWx0ZXIuZnJvbV9yYW5nZSwgZmlsdGVyLnRvX3JhbmdlKVxuICAgICAgICAud2l0aEdyYXBoRmV0Y2hlZCgnYWNjb3VudCcpO1xuXG4gICAgICBjb25zdCBmb3JtYXROdW1iZXIgPSBmb3JtYXROdW1iZXJDbG9zdXJlKGZpbHRlci5udW1iZXJfZm9ybWF0KTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgbWV0YTogeyAuLi5maWx0ZXIgfSxcbiAgICAgICAgaXRlbXM6IGFjY291bnRzSm91cm5hbEVudHJpZXMubWFwKChlbnRyeSkgPT4gKHtcbiAgICAgICAgICAuLi5lbnRyeSxcbiAgICAgICAgICBjcmVkaXQ6IGZvcm1hdE51bWJlcihlbnRyeS5jcmVkaXQpLFxuICAgICAgICAgIGRlYml0OiBmb3JtYXROdW1iZXIoZW50cnkuZGViaXQpLFxuICAgICAgICB9KSksXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgZ2VuZXJhbCBsZWRnZXIgZmluYW5jaWFsIHN0YXRlbWVudC5cbiAgICovXG4gIGdlbmVyYWxMZWRnZXI6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBxdWVyeSgnZnJvbV9kYXRlJykub3B0aW9uYWwoKS5pc0lTTzg2MDEoKSxcbiAgICAgIHF1ZXJ5KCd0b19kYXRlJykub3B0aW9uYWwoKS5pc0lTTzg2MDEoKSxcbiAgICAgIHF1ZXJ5KCdiYXNpcycpLm9wdGlvbmFsKCksXG4gICAgICBxdWVyeSgnbnVtYmVyX2Zvcm1hdC5ub19jZW50cycpLm9wdGlvbmFsKCkuaXNCb29sZWFuKCkudG9Cb29sZWFuKCksXG4gICAgICBxdWVyeSgnbnVtYmVyX2Zvcm1hdC5kaXZpZGVfMTAwMCcpLm9wdGlvbmFsKCkuaXNCb29sZWFuKCkudG9Cb29sZWFuKCksXG4gICAgICBxdWVyeSgnbm9uZV96ZXJvJykub3B0aW9uYWwoKS5pc0Jvb2xlYW4oKS50b0Jvb2xlYW4oKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmaWx0ZXIgPSB7XG4gICAgICAgIGZyb21fZGF0ZTogbW9tZW50KCkuc3RhcnRPZigneWVhcicpLmZvcm1hdCgnWVlZWS1NTS1ERCcpLFxuICAgICAgICB0b19kYXRlOiBtb21lbnQoKS5lbmRPZigneWVhcicpLmZvcm1hdCgnWVlZWS1NTS1ERCcpLFxuICAgICAgICBudW1iZXJfZm9ybWF0OiB7XG4gICAgICAgICAgbm9fY2VudHM6IGZhbHNlLFxuICAgICAgICAgIGRpdmlkZV8xMDAwOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgbm9uZV96ZXJvOiBmYWxzZSxcbiAgICAgICAgLi4ucmVxLnF1ZXJ5LFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGFjY291bnRzID0gYXdhaXQgQWNjb3VudC5xdWVyeSgpXG4gICAgICAgIC5vcmRlckJ5KCdpbmRleCcsICdERVNDJylcbiAgICAgICAgLndpdGhHcmFwaEZldGNoZWQoJ3RyYW5zYWN0aW9ucycpXG4gICAgICAgIC5tb2RpZnlHcmFwaCgndHJhbnNhY3Rpb25zJywgKGJ1aWxkZXIpID0+IHtcbiAgICAgICAgICBidWlsZGVyLm1vZGlmeSgnZmlsdGVyRGF0ZVJhbmdlJywgZmlsdGVyLmZyb21fZGF0ZSwgZmlsdGVyLnRvX2RhdGUpO1xuICAgICAgICB9KTtcblxuICAgICAgY29uc3Qgb3BlbmluZ0JhbGFuY2VUcmFuc2FjdGlvbnMgPSBhd2FpdCBBY2NvdW50VHJhbnNhY3Rpb24ucXVlcnkoKVxuICAgICAgICAubW9kaWZ5KCdmaWx0ZXJEYXRlUmFuZ2UnLCBudWxsLCBmaWx0ZXIuZnJvbV9kYXRlKVxuICAgICAgICAubW9kaWZ5KCdzdW1hdGlvbkNyZWRpdERlYml0JylcbiAgICAgICAgLndpdGhHcmFwaEZldGNoZWQoJ2FjY291bnQudHlwZScpO1xuXG4gICAgICBjb25zdCBjbG9zaW5nQmFsYW5jZVRyYW5zYWN0aW9ucyA9IGF3YWl0IEFjY291bnRUcmFuc2FjdGlvbi5xdWVyeSgpXG4gICAgICAgIC5tb2RpZnkoJ2ZpbHRlckRhdGVSYW5nZScsIG51bGwsIGZpbHRlci50b19kYXRlKVxuICAgICAgICAubW9kaWZ5KCdzdW1hdGlvbkNyZWRpdERlYml0JylcbiAgICAgICAgLndpdGhHcmFwaEZldGNoZWQoJ2FjY291bnQudHlwZScpO1xuXG4gICAgICBjb25zdCBvcGVpbmdCYWxhbmNlQ29sbGVjdGlvbiA9IG5ldyBKb3VybmFsUG9zdGVyKCk7XG4gICAgICBjb25zdCBjbG9zaW5nQmFsYW5jZUNvbGxlY3Rpb24gPSBuZXcgSm91cm5hbFBvc3RlcigpO1xuXG4gICAgICBvcGVpbmdCYWxhbmNlQ29sbGVjdGlvbi5sb2FkRW50cmllcyhvcGVuaW5nQmFsYW5jZVRyYW5zYWN0aW9ucyk7XG4gICAgICBjbG9zaW5nQmFsYW5jZUNvbGxlY3Rpb24ubG9hZEVudHJpZXMoY2xvc2luZ0JhbGFuY2VUcmFuc2FjdGlvbnMpO1xuXG4gICAgICAvLyBUcmFuc2FjdGlvbiBhbW91bnQgZm9ybWF0dGVyIGJhc2VkIG9uIHRoZSBnaXZlbiBxdWVyeS5cbiAgICAgIGNvbnN0IGZvcm1hdE51bWJlciA9IGZvcm1hdE51bWJlckNsb3N1cmUoZmlsdGVyLm51bWJlcl9mb3JtYXQpO1xuXG4gICAgICBjb25zdCBpdGVtcyA9IFtcbiAgICAgICAgLi4uYWNjb3VudHNcbiAgICAgICAgICAuZmlsdGVyKChhY2NvdW50KSA9PiAoXG4gICAgICAgICAgICBhY2NvdW50LnRyYW5zYWN0aW9ucy5sZW5ndGggPiAwIHx8ICFmaWx0ZXIubm9uZV96ZXJvXG4gICAgICAgICAgKSlcbiAgICAgICAgICAubWFwKChhY2NvdW50KSA9PiAoe1xuICAgICAgICAgICAgLi4ucGljayhhY2NvdW50LCBbJ2lkJywgJ25hbWUnLCAnY29kZScsICdpbmRleCddKSxcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uczogW1xuICAgICAgICAgICAgICAuLi5hY2NvdW50LnRyYW5zYWN0aW9ucy5tYXAoKHRyYW5zYWN0aW9uKSA9PiAoe1xuICAgICAgICAgICAgICAgIC4uLnRyYW5zYWN0aW9uLFxuICAgICAgICAgICAgICAgIGNyZWRpdDogZm9ybWF0TnVtYmVyKHRyYW5zYWN0aW9uLmNyZWRpdCksXG4gICAgICAgICAgICAgICAgZGViaXQ6IGZvcm1hdE51bWJlcih0cmFuc2FjdGlvbi5kZWJpdCksXG4gICAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBvcGVuaW5nOiB7XG4gICAgICAgICAgICAgIGRhdGU6IGZpbHRlci5mcm9tX2RhdGUsXG4gICAgICAgICAgICAgIGJhbGFuY2U6IG9wZWluZ0JhbGFuY2VDb2xsZWN0aW9uLmdldENsb3NpbmdCYWxhbmNlKGFjY291bnQuaWQpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsb3Npbmc6IHtcbiAgICAgICAgICAgICAgZGF0ZTogZmlsdGVyLnRvX2RhdGUsXG4gICAgICAgICAgICAgIGJhbGFuY2U6IGNsb3NpbmdCYWxhbmNlQ29sbGVjdGlvbi5nZXRDbG9zaW5nQmFsYW5jZShhY2NvdW50LmlkKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSkpLFxuICAgICAgXTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgIG1ldGE6IHsgLi4uZmlsdGVyIH0sXG4gICAgICAgIGl0ZW1zLFxuICAgICAgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGJhbGFuY2Ugc2hlZXQuXG4gICAqL1xuICBiYWxhbmNlU2hlZXQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBxdWVyeSgnYWNjb3VudGluZ19tZXRob2QnKS5vcHRpb25hbCgpLmlzSW4oWydjYXNoJywgJ2FjY3VyYWwnXSksXG4gICAgICBxdWVyeSgnZnJvbV9kYXRlJykub3B0aW9uYWwoKSxcbiAgICAgIHF1ZXJ5KCd0b19kYXRlJykub3B0aW9uYWwoKSxcbiAgICAgIHF1ZXJ5KCdkaXNwbGF5X2NvbHVtbnNfYnknKS5vcHRpb25hbCgpLmlzSW4oWyd5ZWFyJywgJ21vbnRoJywgJ3dlZWsnLCAnZGF5JywgJ3F1YXJ0ZXInXSksXG4gICAgICBxdWVyeSgnbnVtYmVyX2Zvcm1hdC5ub19jZW50cycpLm9wdGlvbmFsKCkuaXNCb29sZWFuKCkudG9Cb29sZWFuKCksXG4gICAgICBxdWVyeSgnbnVtYmVyX2Zvcm1hdC5kaXZpZGVfMTAwMCcpLm9wdGlvbmFsKCkuaXNCb29sZWFuKCkudG9Cb29sZWFuKCksXG4gICAgICBxdWVyeSgnbm9uZV96ZXJvJykub3B0aW9uYWwoKS5pc0Jvb2xlYW4oKS50b0Jvb2xlYW4oKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmaWx0ZXIgPSB7XG4gICAgICAgIGRpc3BsYXlfY29sdW1uc19ieTogJ3llYXInLFxuICAgICAgICBmcm9tX2RhdGU6IG1vbWVudCgpLnN0YXJ0T2YoJ3llYXInKS5mb3JtYXQoJ1lZWVktTU0tREQnKSxcbiAgICAgICAgdG9fZGF0ZTogbW9tZW50KCkuZW5kT2YoJ3llYXInKS5mb3JtYXQoJ1lZWVktTU0tREQnKSxcbiAgICAgICAgbnVtYmVyX2Zvcm1hdDoge1xuICAgICAgICAgIG5vX2NlbnRzOiBmYWxzZSxcbiAgICAgICAgICBkaXZpZGVfMTAwMDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIG5vbmVfemVybzogZmFsc2UsXG4gICAgICAgIC4uLnJlcS5xdWVyeSxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGJhbGFuY2VTaGVldFR5cGVzID0gYXdhaXQgQWNjb3VudFR5cGUucXVlcnkoKVxuICAgICAgICAud2hlcmUoJ2JhbGFuY2Vfc2hlZXQnLCB0cnVlKTtcblxuICAgICAgLy8gRmV0Y2ggYWxsIGJhbGFuY2Ugc2hlZXQgYWNjb3VudHMuXG4gICAgICBjb25zdCBhY2NvdW50cyA9IGF3YWl0IEFjY291bnQucXVlcnkoKVxuICAgICAgICAud2hlcmVJbignYWNjb3VudF90eXBlX2lkJywgYmFsYW5jZVNoZWV0VHlwZXMubWFwKChhKSA9PiBhLmlkKSlcbiAgICAgICAgLndpdGhHcmFwaEZldGNoZWQoJ3R5cGUnKVxuICAgICAgICAud2l0aEdyYXBoRmV0Y2hlZCgndHJhbnNhY3Rpb25zJylcbiAgICAgICAgLm1vZGlmeUdyYXBoKCd0cmFuc2FjdGlvbnMnLCAoYnVpbGRlcikgPT4ge1xuICAgICAgICAgIGJ1aWxkZXIubW9kaWZ5KCdmaWx0ZXJEYXRlUmFuZ2UnLCBudWxsLCBmaWx0ZXIudG9fZGF0ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICBjb25zdCBqb3VybmFsRW50cmllc0NvbGxlY3RlZCA9IEFjY291bnQuY29sbGVjdEpvdXJuYWxFbnRyaWVzKGFjY291bnRzKTtcbiAgICAgIGNvbnN0IGpvdXJuYWxFbnRyaWVzID0gbmV3IEpvdXJuYWxQb3N0ZXIoKTtcbiAgICAgIGpvdXJuYWxFbnRyaWVzLmxvYWRFbnRyaWVzKGpvdXJuYWxFbnRyaWVzQ29sbGVjdGVkKTtcblxuICAgICAgLy8gQWNjb3VudCBiYWxhbmNlIGZvcm1tYXR0ZXIgYmFzZWQgb24gdGhlIGdpdmVuIHF1ZXJ5LlxuICAgICAgY29uc3QgYmFsYW5jZUZvcm1hdHRlciA9IGZvcm1hdE51bWJlckNsb3N1cmUoZmlsdGVyLm51bWJlcl9mb3JtYXQpO1xuXG4gICAgICAvLyBHZXRzIHRoZSBkYXRlIHJhbmdlIHNldCBmcm9tIHN0YXJ0IHRvIGVuZCBkYXRlLlxuICAgICAgY29uc3QgZGF0ZVJhbmdlU2V0ID0gZGF0ZVJhbmdlQ29sbGVjdGlvbihcbiAgICAgICAgZmlsdGVyLmZyb21fZGF0ZSxcbiAgICAgICAgZmlsdGVyLnRvX2RhdGUsXG4gICAgICAgIGZpbHRlci5kaXNwbGF5X2NvbHVtbnNfYnksXG4gICAgICApO1xuICAgICAgLy8gUmV0cmlldmUgdGhlIGFzc2V0IGJhbGFuY2Ugc2hlZXQuXG4gICAgICBjb25zdCBhc3NldHMgPSBbXG4gICAgICAgIC4uLmFjY291bnRzXG4gICAgICAgICAgLmZpbHRlcigoYWNjb3VudCkgPT4gKFxuICAgICAgICAgICAgYWNjb3VudC50eXBlLm5vcm1hbCA9PT0gJ2RlYml0J1xuICAgICAgICAgICAgJiYgKGFjY291bnQudHJhbnNhY3Rpb25zLmxlbmd0aCA+IDAgfHwgIWZpbHRlci5ub25lX3plcm8pXG4gICAgICAgICAgKSlcbiAgICAgICAgICAubWFwKChhY2NvdW50KSA9PiAoe1xuICAgICAgICAgICAgLi4ucGljayhhY2NvdW50LCBbJ2lkJywgJ2luZGV4JywgJ25hbWUnLCAnY29kZSddKSxcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uczogZGF0ZVJhbmdlU2V0Lm1hcCgoZGF0ZSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB0eXBlID0gZmlsdGVyLmRpc3BsYXlfY29sdW1uc19ieTtcbiAgICAgICAgICAgICAgY29uc3QgYmFsYW5jZSA9IGpvdXJuYWxFbnRyaWVzLmdldENsb3NpbmdCYWxhbmNlKGFjY291bnQuaWQsIGRhdGUsIHR5cGUpO1xuICAgICAgICAgICAgICByZXR1cm4geyBkYXRlLCBiYWxhbmNlOiBiYWxhbmNlRm9ybWF0dGVyKGJhbGFuY2UpIH07XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9KSksXG4gICAgICBdO1xuICAgICAgLy8gUmV0cmlldmUgbGlhYmlsaXRpZXMgYW5kIGVxdWl0eSBiYWxhbmNlIHNoZWV0LlxuICAgICAgY29uc3QgbGlhYmlsaXRpZXNFcXVpdHkgPSBbXG4gICAgICAgIC4uLmFjY291bnRzXG4gICAgICAgICAgLmZpbHRlcigoYWNjb3VudCkgPT4gKFxuICAgICAgICAgICAgYWNjb3VudC50eXBlLm5vcm1hbCA9PT0gJ2NyZWRpdCdcbiAgICAgICAgICAgICYmIChhY2NvdW50LnRyYW5zYWN0aW9ucy5sZW5ndGggPiAwIHx8ICFmaWx0ZXIubm9uZV96ZXJvKVxuICAgICAgICAgICkpXG4gICAgICAgICAgLm1hcCgoYWNjb3VudCkgPT4gKHtcbiAgICAgICAgICAgIC4uLnBpY2soYWNjb3VudCwgWydpZCcsICdpbmRleCcsICduYW1lJywgJ2NvZGUnXSksXG4gICAgICAgICAgICB0cmFuc2FjdGlvbnM6IGRhdGVSYW5nZVNldC5tYXAoKGRhdGUpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IGZpbHRlci5kaXNwbGF5X2NvbHVtbnNfYnk7XG4gICAgICAgICAgICAgIGNvbnN0IGJhbGFuY2UgPSBqb3VybmFsRW50cmllcy5nZXRDbG9zaW5nQmFsYW5jZShhY2NvdW50LmlkLCBkYXRlLCB0eXBlKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0ZSwgYmFsYW5jZTogYmFsYW5jZUZvcm1hdHRlcihiYWxhbmNlKSB9O1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSkpLFxuICAgICAgXTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgIHF1ZXJ5OiB7IC4uLmZpbHRlciB9LFxuICAgICAgICBjb2x1bW5zOiB7IC4uLmRhdGVSYW5nZVNldCB9LFxuICAgICAgICBiYWxhbmNlX3NoZWV0OiB7XG4gICAgICAgICAgYXNzZXRzLFxuICAgICAgICAgIGxpYWJpbGl0aWVzX2VxdWl0eTogbGlhYmlsaXRpZXNFcXVpdHksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgdHJpYWwgYmFsYW5jZSBzaGVldC5cbiAgICovXG4gIHRyaWFsQmFsYW5jZVNoZWV0OiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcXVlcnkoJ2Jhc2lzJykub3B0aW9uYWwoKSxcbiAgICAgIHF1ZXJ5KCdmcm9tX2RhdGUnKS5vcHRpb25hbCgpLmlzSVNPODYwMSgpLFxuICAgICAgcXVlcnkoJ3RvX2RhdGUnKS5vcHRpb25hbCgpLmlzSVNPODYwMSgpLFxuICAgICAgcXVlcnkoJ251bWJlcl9mb3JtYXQubm9fY2VudHMnKS5vcHRpb25hbCgpLmlzQm9vbGVhbigpLFxuICAgICAgcXVlcnkoJ251bWJlcl9mb3JtYXQuMTAwMF9kaXZpZGUnKS5vcHRpb25hbCgpLmlzQm9vbGVhbigpLFxuICAgICAgcXVlcnkoJ2Jhc2lzJykub3B0aW9uYWwoKSxcbiAgICAgIHF1ZXJ5KCdub25lX3plcm8nKS5vcHRpb25hbCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGZpbHRlciA9IHtcbiAgICAgICAgZnJvbV9kYXRlOiBtb21lbnQoKS5zdGFydE9mKCd5ZWFyJykuZm9ybWF0KCdZWVlZLU1NLUREJyksXG4gICAgICAgIHRvX2RhdGU6IG1vbWVudCgpLmVuZE9mKCd5ZWFyJykuZm9ybWF0KCdZWVlZLU1NLUREJyksXG4gICAgICAgIG51bWJlcl9mb3JtYXQ6IHtcbiAgICAgICAgICBub19jZW50czogZmFsc2UsXG4gICAgICAgICAgZGl2aWRlXzEwMDA6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBiYXNpczogJ2FjY3VyYWwnLFxuICAgICAgICBub25lX3plcm86IGZhbHNlLFxuICAgICAgICAuLi5yZXEucXVlcnksXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBhY2NvdW50cyA9IGF3YWl0IEFjY291bnQucXVlcnkoKVxuICAgICAgICAud2l0aEdyYXBoRmV0Y2hlZCgndHlwZScpXG4gICAgICAgIC53aXRoR3JhcGhGZXRjaGVkKCd0cmFuc2FjdGlvbnMnKVxuICAgICAgICAubW9kaWZ5R3JhcGgoJ3RyYW5zYWN0aW9ucycsIChidWlsZGVyKSA9PiB7XG4gICAgICAgICAgYnVpbGRlci5tb2RpZnkoJ3N1bWF0aW9uQ3JlZGl0RGViaXQnKTtcbiAgICAgICAgICBidWlsZGVyLm1vZGlmeSgnZmlsdGVyRGF0ZVJhbmdlJywgZmlsdGVyLmZyb21fZGF0ZSwgZmlsdGVyLnRvX2RhdGUpO1xuICAgICAgICB9KTtcblxuICAgICAgY29uc3Qgam91cm5hbEVudHJpZXNDb2xsZWN0ID0gQWNjb3VudC5jb2xsZWN0Sm91cm5hbEVudHJpZXMoYWNjb3VudHMpO1xuICAgICAgY29uc3Qgam91cm5hbEVudHJpZXMgPSBuZXcgSm91cm5hbFBvc3RlcigpO1xuICAgICAgam91cm5hbEVudHJpZXMubG9hZEVudHJpZXMoam91cm5hbEVudHJpZXNDb2xsZWN0KTtcblxuICAgICAgLy8gQWNjb3VudCBiYWxhbmNlIGZvcm1tYXR0ZXIgYmFzZWQgb24gdGhlIGdpdmVuIHF1ZXJ5LlxuICAgICAgY29uc3QgYmFsYW5jZUZvcm1hdHRlciA9IGZvcm1hdE51bWJlckNsb3N1cmUoZmlsdGVyLm51bWJlcl9mb3JtYXQpO1xuXG4gICAgICBjb25zdCBpdGVtcyA9IGFjY291bnRzXG4gICAgICAgIC5maWx0ZXIoKGFjY291bnQpID0+IChcbiAgICAgICAgICBhY2NvdW50LnRyYW5zYWN0aW9ucy5sZW5ndGggPiAwIHx8ICFmaWx0ZXIubm9uZV96ZXJvXG4gICAgICAgICkpXG4gICAgICAgIC5tYXAoKGFjY291bnQpID0+IHtcbiAgICAgICAgICBjb25zdCB0cmlhbCA9IGpvdXJuYWxFbnRyaWVzLmdldFRyaWFsQmFsYW5jZShhY2NvdW50LmlkKTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYWNjb3VudF9pZDogYWNjb3VudC5pZCxcbiAgICAgICAgICAgIGNvZGU6IGFjY291bnQuY29kZSxcbiAgICAgICAgICAgIGFjY291bnROb3JtYWw6IGFjY291bnQudHlwZS5ub3JtYWwsXG4gICAgICAgICAgICBjcmVkaXQ6IGJhbGFuY2VGb3JtYXR0ZXIodHJpYWwuY3JlZGl0KSxcbiAgICAgICAgICAgIGRlYml0OiBiYWxhbmNlRm9ybWF0dGVyKHRyaWFsLmRlYml0KSxcbiAgICAgICAgICAgIGJhbGFuY2U6IGJhbGFuY2VGb3JtYXR0ZXIodHJpYWwuYmFsYW5jZSksXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoe1xuICAgICAgICBtZXRhOiB7IC4uLmZpbHRlciB9LFxuICAgICAgICBpdGVtczogWy4uLml0ZW1zXSxcbiAgICAgIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIHByb2ZpdC9sb3NzIGZpbmFuY2lhbCBzdGF0ZW1lbnQuXG4gICAqL1xuICBwcm9maXRMb3NzU2hlZXQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBxdWVyeSgnYmFzaXMnKS5vcHRpb25hbCgpLFxuICAgICAgcXVlcnkoJ2Zyb21fZGF0ZScpLm9wdGlvbmFsKCkuaXNJU084NjAxKCksXG4gICAgICBxdWVyeSgndG9fZGF0ZScpLm9wdGlvbmFsKCkuaXNJU084NjAxKCksXG4gICAgICBxdWVyeSgnbnVtYmVyX2Zvcm1hdC5ub19jZW50cycpLm9wdGlvbmFsKCkuaXNCb29sZWFuKCksXG4gICAgICBxdWVyeSgnbnVtYmVyX2Zvcm1hdC5kaXZpZGVfMTAwMCcpLm9wdGlvbmFsKCkuaXNCb29sZWFuKCksXG4gICAgICBxdWVyeSgnYmFzaXMnKS5vcHRpb25hbCgpLFxuICAgICAgcXVlcnkoJ25vbmVfemVybycpLm9wdGlvbmFsKCksXG4gICAgICBxdWVyeSgnZGlzcGxheV9jb2x1bW5zX2J5Jykub3B0aW9uYWwoKS5pc0luKFsneWVhcicsICdtb250aCcsICd3ZWVrJywgJ2RheScsICdxdWFydGVyJ10pLFxuICAgICAgcXVlcnkoJ2FjY291bnRzJykub3B0aW9uYWwoKS5pc0FycmF5KCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZmlsdGVyID0ge1xuICAgICAgICBmcm9tX2RhdGU6IG1vbWVudCgpLnN0YXJ0T2YoJ3llYXInKS5mb3JtYXQoJ1lZWVktTU0tREQnKSxcbiAgICAgICAgdG9fZGF0ZTogbW9tZW50KCkuZW5kT2YoJ3llYXInKS5mb3JtYXQoJ1lZWVktTU0tREQnKSxcbiAgICAgICAgbnVtYmVyX2Zvcm1hdDoge1xuICAgICAgICAgIG5vX2NlbnRzOiBmYWxzZSxcbiAgICAgICAgICBkaXZpZGVfMTAwMDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIGJhc2lzOiAnYWNjdXJhbCcsXG4gICAgICAgIG5vbmVfemVybzogZmFsc2UsXG4gICAgICAgIGRpc3BsYXlfY29sdW1uc19ieTogJ21vbnRoJyxcbiAgICAgICAgLi4ucmVxLnF1ZXJ5LFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGluY29tZVN0YXRlbWVudFR5cGVzID0gYXdhaXQgQWNjb3VudFR5cGUucXVlcnkoKS53aGVyZSgnaW5jb21lX3NoZWV0JywgdHJ1ZSk7XG5cbiAgICAgIGNvbnN0IGFjY291bnRzID0gYXdhaXQgQWNjb3VudC5xdWVyeSgpXG4gICAgICAgIC53aGVyZUluKCdhY2NvdW50X3R5cGVfaWQnLCBpbmNvbWVTdGF0ZW1lbnRUeXBlcy5tYXAoKHQpID0+IHQuaWQpKVxuICAgICAgICAud2l0aEdyYXBoRmV0Y2hlZCgndHlwZScpXG4gICAgICAgIC53aXRoR3JhcGhGZXRjaGVkKCd0cmFuc2FjdGlvbnMnKTtcblxuICAgICAgY29uc3QgZmlsdGVyZWRBY2NvdW50cyA9IGFjY291bnRzLmZpbHRlcigoYWNjb3VudCkgPT4ge1xuICAgICAgICByZXR1cm4gYWNjb3VudC50cmFuc2FjdGlvbnMubGVuZ3RoID4gMCB8fCAhZmlsdGVyLm5vbmVfemVybztcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgam91cm5hbEVudHJpZXNDb2xsZWN0ZWQgPSBBY2NvdW50LmNvbGxlY3RKb3VybmFsRW50cmllcyhhY2NvdW50cyk7XG4gICAgICBjb25zdCBqb3VybmFsRW50cmllcyA9IG5ldyBKb3VybmFsUG9zdGVyKCk7XG4gICAgICBqb3VybmFsRW50cmllcy5sb2FkRW50cmllcyhqb3VybmFsRW50cmllc0NvbGxlY3RlZCk7XG5cbiAgICAgIC8vIEFjY291bnQgYmFsYW5jZSBmb3JtbWF0dGVyIGJhc2VkIG9uIHRoZSBnaXZlbiBxdWVyeS5cbiAgICAgIGNvbnN0IG51bWJlckZvcm1hdHRlciA9IGZvcm1hdE51bWJlckNsb3N1cmUoZmlsdGVyLm51bWJlcl9mb3JtYXQpO1xuXG4gICAgICAvLyBHZXRzIHRoZSBkYXRlIHJhbmdlIHNldCBmcm9tIHN0YXJ0IHRvIGVuZCBkYXRlLlxuICAgICAgY29uc3QgZGF0ZVJhbmdlU2V0ID0gZGF0ZVJhbmdlQ29sbGVjdGlvbihcbiAgICAgICAgZmlsdGVyLmZyb21fZGF0ZSxcbiAgICAgICAgZmlsdGVyLnRvX2RhdGUsXG4gICAgICAgIGZpbHRlci5kaXNwbGF5X2NvbHVtbnNfYnksXG4gICAgICApO1xuICAgICAgY29uc3QgYWNjb3VudHNJbmNvbWUgPSBmaWx0ZXJlZEFjY291bnRzXG4gICAgICAgIC5maWx0ZXIoKGFjY291bnQpID0+IGFjY291bnQudHlwZS5ub3JtYWwgPT09ICdjcmVkaXQnKVxuICAgICAgICAubWFwKChhY2NvdW50KSA9PiAoe1xuICAgICAgICAgIC4uLnBpY2soYWNjb3VudCwgWydpZCcsICdpbmRleCcsICduYW1lJywgJ2NvZGUnXSksXG4gICAgICAgICAgZGF0ZXM6IGRhdGVSYW5nZVNldC5tYXAoKGRhdGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBmaWx0ZXIuZGlzcGxheV9jb2x1bW5zX2J5O1xuICAgICAgICAgICAgY29uc3QgYW1vdW50ID0gam91cm5hbEVudHJpZXMuZ2V0Q2xvc2luZ0JhbGFuY2UoYWNjb3VudC5pZCwgZGF0ZSwgdHlwZSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7IGRhdGUsIHJhd0Ftb3VudDogYW1vdW50LCBhbW91bnQ6IG51bWJlckZvcm1hdHRlcihhbW91bnQpIH07XG4gICAgICAgICAgfSksXG4gICAgICAgIH0pKTtcblxuICAgICAgY29uc3QgYWNjb3VudHNFeHBlbnNlcyA9IGZpbHRlcmVkQWNjb3VudHNcbiAgICAgICAgLmZpbHRlcigoYWNjb3VudCkgPT4gYWNjb3VudC50eXBlLm5vcm1hbCA9PT0gJ2RlYml0JylcbiAgICAgICAgLm1hcCgoYWNjb3VudCkgPT4gKHtcbiAgICAgICAgICAuLi5waWNrKGFjY291bnQsIFsnaWQnLCAnaW5kZXgnLCAnbmFtZScsICdjb2RlJ10pLFxuICAgICAgICAgIGRhdGVzOiBkYXRlUmFuZ2VTZXQubWFwKChkYXRlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gZmlsdGVyLmRpc3BsYXlfY29sdW1uc19ieTtcbiAgICAgICAgICAgIGNvbnN0IGFtb3VudCA9IGpvdXJuYWxFbnRyaWVzLmdldENsb3NpbmdCYWxhbmNlKGFjY291bnQuaWQsIGRhdGUsIHR5cGUpO1xuXG4gICAgICAgICAgICByZXR1cm4geyBkYXRlLCByYXdBbW91bnQ6IGFtb3VudCwgYW1vdW50OiBudW1iZXJGb3JtYXR0ZXIoYW1vdW50KSB9O1xuICAgICAgICAgIH0pLFxuICAgICAgICB9KSk7XG5cbiAgICAgIC8vIENhbGN1bGF0ZXMgdGhlIHRvdGFsIGluY29tZSBvZiBpbmNvbWUgYWNjb3VudHMuXG4gICAgICBjb25zdCB0b3RhbEFjY291bnRzSW5jb21lID0gZGF0ZVJhbmdlU2V0LnJlZHVjZSgoYWNjLCBkYXRlLCBpbmRleCkgPT4ge1xuICAgICAgICBsZXQgYW1vdW50ID0gMDtcbiAgICAgICAgYWNjb3VudHNJbmNvbWUuZm9yRWFjaCgoYWNjb3VudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gYWNjb3VudC5kYXRlc1tpbmRleF07XG4gICAgICAgICAgYW1vdW50ICs9IGN1cnJlbnREYXRlLnJhd0Ftb3VudCB8fCAwO1xuICAgICAgICB9KTtcbiAgICAgICAgYWNjW2RhdGVdID0geyBkYXRlLCByYXdBbW91bnQ6IGFtb3VudCwgYW1vdW50OiBudW1iZXJGb3JtYXR0ZXIoYW1vdW50KSB9O1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwge30pO1xuXG4gICAgICAvLyBDYWxjdWxhdGVzIHRoZSB0b3RhbCBleHBlbnNlcyBvZiBleHBlbnNlcyBhY2NvdW50cy5cbiAgICAgIGNvbnN0IHRvdGFsQWNjb3VudHNFeHBlbnNlcyA9IGRhdGVSYW5nZVNldC5yZWR1Y2UoKGFjYywgZGF0ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgbGV0IGFtb3VudCA9IDA7XG4gICAgICAgIGFjY291bnRzRXhwZW5zZXMuZm9yRWFjaCgoYWNjb3VudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gYWNjb3VudC5kYXRlc1tpbmRleF07XG4gICAgICAgICAgYW1vdW50ICs9IGN1cnJlbnREYXRlLnJhd0Ftb3VudCB8fCAwO1xuICAgICAgICB9KTtcbiAgICAgICAgYWNjW2RhdGVdID0geyBkYXRlLCByYXdBbW91bnQ6IGFtb3VudCwgYW1vdW50OiBudW1iZXJGb3JtYXR0ZXIoYW1vdW50KSB9O1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwge30pO1xuXG4gICAgICAvLyBUb3RhbCBpbmNvbWUoZGF0ZSkgLSBUb3RhbCBleHBlbnNlcyhkYXRlKSA9IE5ldCBpbmNvbWUoZGF0ZSlcbiAgICAgIGNvbnN0IG5ldEluY29tZSA9IGRhdGVSYW5nZVNldC5tYXAoKGRhdGUpID0+IHtcbiAgICAgICAgY29uc3QgdG90YWxJbmNvbWUgPSB0b3RhbEFjY291bnRzSW5jb21lW2RhdGVdO1xuICAgICAgICBjb25zdCB0b3RhbEV4cGVuc2VzID0gdG90YWxBY2NvdW50c0V4cGVuc2VzW2RhdGVdO1xuXG4gICAgICAgIGxldCBhbW91bnQgPSB0b3RhbEluY29tZS5yYXdBbW91bnQgfHwgMDtcbiAgICAgICAgYW1vdW50IC09IHRvdGFsRXhwZW5zZXMucmF3QW1vdW50IHx8IDA7XG4gICAgICAgIHJldHVybiB7IGRhdGUsIHJhd0Ftb3VudDogYW1vdW50LCBhbW91bnQ6IG51bWJlckZvcm1hdHRlcihhbW91bnQpIH07XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgbWV0YTogeyAuLi5maWx0ZXIgfSxcbiAgICAgICAgaW5jb21lOiB7XG4gICAgICAgICAgZW50cnlfbm9ybWFsOiAnY3JlZGl0JyxcbiAgICAgICAgICBhY2NvdW50czogYWNjb3VudHNJbmNvbWUsXG4gICAgICAgIH0sXG4gICAgICAgIGV4cGVuc2VzOiB7XG4gICAgICAgICAgZW50cnlfbm9ybWFsOiAnZGViaXQnLFxuICAgICAgICAgIGFjY291bnRzOiBhY2NvdW50c0V4cGVuc2VzLFxuICAgICAgICB9LFxuICAgICAgICB0b3RhbF9pbmNvbWU6IE9iamVjdC52YWx1ZXModG90YWxBY2NvdW50c0luY29tZSksXG4gICAgICAgIHRvdGFsX2V4cGVuc2VzOiBPYmplY3QudmFsdWVzKHRvdGFsQWNjb3VudHNFeHBlbnNlcyksXG4gICAgICAgIHRvdGFsX25ldF9pbmNvbWU6IG5ldEluY29tZSxcbiAgICAgIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgY2FzaEZsb3dTdGF0ZW1lbnQ6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBxdWVyeSgnZGF0ZV9mcm9tJykub3B0aW9uYWwoKSxcbiAgICAgIHF1ZXJ5KCdkYXRlX3RvJykub3B0aW9uYWwoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIFxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgbWV0YToge30sXG4gICAgICAgIG9wZXJhdGluZzogW10sXG4gICAgICAgIGZpbmFuY2luZzogW10sXG4gICAgICAgIGludmVzdGluZzogW10sXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxufVxuIiwiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgeyBjaGVjaywgcGFyYW0sIHZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICdleHByZXNzLXZhbGlkYXRvcic7XG5pbXBvcnQgYXN5bmNNaWRkbGV3YXJlIGZyb20gJy4uL21pZGRsZXdhcmUvYXN5bmNNaWRkbGV3YXJlJztcbmltcG9ydCBJdGVtQ2F0ZWdvcnkgZnJvbSAnQC9tb2RlbHMvSXRlbUNhdGVnb3J5JztcbmltcG9ydCBBdXRob3JpemF0aW9uIGZyb20gJ0AvaHR0cC9taWRkbGV3YXJlL2F1dGhvcml6YXRpb24nO1xuaW1wb3J0IEpXVEF1dGggZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvand0QXV0aCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyoqXG4gICAqIFJvdXRlciBjb25zdHJ1Y3RvciBtZXRob2QuXG4gICAqL1xuICByb3V0ZXIoKSB7XG4gICAgY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcbiAgICBjb25zdCBwZXJtaXQgPSBBdXRob3JpemF0aW9uKCdpdGVtc19jYXRlZ29yaWVzJyk7XG5cbiAgICByb3V0ZXIudXNlKEpXVEF1dGgpO1xuXG4gICAgcm91dGVyLnBvc3QoJy86aWQnLFxuICAgICAgcGVybWl0KCdjcmVhdGUnLCAnZWRpdCcpLFxuICAgICAgdGhpcy5lZGl0Q2F0ZWdvcnkudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmVkaXRDYXRlZ29yeS5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIucG9zdCgnLycsXG4gICAgICBwZXJtaXQoJ2NyZWF0ZScpLFxuICAgICAgdGhpcy5uZXdDYXRlZ29yeS52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMubmV3Q2F0ZWdvcnkuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmRlbGV0ZSgnLzppZCcsXG4gICAgICBwZXJtaXQoJ2NyZWF0ZScsICdlZGl0JywgJ2RlbGV0ZScpLFxuICAgICAgdGhpcy5kZWxldGVJdGVtLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5kZWxldGVJdGVtLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5nZXQoJy86aWQnLFxuICAgICAgcGVybWl0KCd2aWV3JyksXG4gICAgICB0aGlzLmdldENhdGVnb3J5LnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5nZXRDYXRlZ29yeS5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvJyxcbiAgICAgIHBlcm1pdCgndmlldycpLFxuICAgICAgdGhpcy5nZXRMaXN0LnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5nZXRMaXN0LnZhbGlkYXRpb24pKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgaXRlbSBjYXRlZ29yeS5cbiAgICovXG4gIG5ld0NhdGVnb3J5OiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgY2hlY2soJ25hbWUnKS5leGlzdHMoeyBjaGVja0ZhbHN5OiB0cnVlIH0pLnRyaW0oKS5lc2NhcGUoKSxcbiAgICAgIGNoZWNrKCdwYXJlbnRfY2F0ZWdvcnlfaWQnKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnZGVzY3JpcHRpb24nKS5vcHRpb25hbCgpLnRyaW0oKS5lc2NhcGUoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgbmFtZSwgcGFyZW50X2NhdGVnb3J5X2lkOiBwYXJlbnRDYXRlZ29yeUlkLCBkZXNjcmlwdGlvbiB9ID0gcmVxLmJvZHk7XG5cbiAgICAgIGlmIChwYXJlbnRDYXRlZ29yeUlkKSB7XG4gICAgICAgIGNvbnN0IGZvdW5kUGFyZW50Q2F0ZWdvcnkgPSBhd2FpdCBJdGVtQ2F0ZWdvcnkud2hlcmUoJ2lkJywgcGFyZW50Q2F0ZWdvcnlJZCkuZmV0Y2goKTtcblxuICAgICAgICBpZiAoIWZvdW5kUGFyZW50Q2F0ZWdvcnkpIHtcbiAgICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQoJ1RoZSBwYXJlbnQgY2F0ZWdvcnkgSUQgaXMgbm90IGZvdW5kLicsIHtcbiAgICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ1BBUkVOVF9DQVRFR09SWV9OT1RfRk9VTkQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IGNhdGVnb3J5ID0gYXdhaXQgSXRlbUNhdGVnb3J5LmZvcmdlKHtcbiAgICAgICAgbGFiZWw6IG5hbWUsXG4gICAgICAgIHBhcmVudF9jYXRlZ29yeV9pZDogcGFyZW50Q2F0ZWdvcnlJZCxcbiAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICB9KTtcblxuICAgICAgYXdhaXQgY2F0ZWdvcnkuc2F2ZSgpO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgaWQ6IGNhdGVnb3J5LmdldCgnaWQnKSB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBFZGl0IGRldGFpbHMgb2YgdGhlIGdpdmVuIGNhdGVnb3J5IGl0ZW0uXG4gICAqL1xuICBlZGl0Q2F0ZWdvcnk6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBwYXJhbSgnaWQnKS50b0ludCgpLFxuICAgICAgY2hlY2soJ25hbWUnKS5leGlzdHMoeyBjaGVja0ZhbHN5OiB0cnVlIH0pLnRyaW0oKS5lc2NhcGUoKSxcbiAgICAgIGNoZWNrKCdwYXJlbnRfY2F0ZWdvcnlfaWQnKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnZGVzY3JpcHRpb24nKS5vcHRpb25hbCgpLnRyaW0oKS5lc2NhcGUoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIXZhbGlkYXRpb25FcnJvcnMuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWREYXRhKG51bGwsIHtcbiAgICAgICAgICBjb2RlOiAndmFsaWRhdGlvbl9lcnJvcicsIC4uLnZhbGlkYXRpb25FcnJvcnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgeyBuYW1lLCBwYXJlbnRfY2F0ZWdvcnlfaWQ6IHBhcmVudENhdGVnb3J5SWQsIGRlc2NyaXB0aW9uIH0gPSByZXEuYm9keTtcbiAgICAgIGNvbnN0IGl0ZW1DYXRlZ29yeSA9IGF3YWl0IEl0ZW1DYXRlZ29yeS53aGVyZSgnaWQnLCBpZCkuZmV0Y2goKTtcblxuICAgICAgaWYgKCFpdGVtQ2F0ZWdvcnkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKCk7XG4gICAgICB9XG4gICAgICBpZiAocGFyZW50Q2F0ZWdvcnlJZCAmJiBwYXJlbnRDYXRlZ29yeUlkICE9PSBpdGVtQ2F0ZWdvcnkuYXR0cmlidXRlcy5wYXJlbnRfY2F0ZWdvcnlfaWQpIHtcbiAgICAgICAgY29uc3QgZm91bmRQYXJlbnRDYXRlZ29yeSA9IGF3YWl0IEl0ZW1DYXRlZ29yeS53aGVyZSgnaWQnLCBwYXJlbnRDYXRlZ29yeUlkKS5mZXRjaCgpO1xuXG4gICAgICAgIGlmICghZm91bmRQYXJlbnRDYXRlZ29yeSkge1xuICAgICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZCgnVGhlIHBhcmVudCBjYXRlZ29yeSBJRCBpcyBub3QgZm91bmQuJywge1xuICAgICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnUEFSRU5UX0NBVEVHT1JZX05PVF9GT1VORCcsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYXdhaXQgaXRlbUNhdGVnb3J5LnNhdmUoe1xuICAgICAgICBsYWJlbDogbmFtZSxcbiAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgIHBhcmVudF9jYXRlZ29yeV9pZDogcGFyZW50Q2F0ZWdvcnlJZCxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyBpZDogaXRlbUNhdGVnb3J5LmlkIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIERlbGV0ZSB0aGUgZ2l2ZSBpdGVtIGNhdGVnb3J5LlxuICAgKi9cbiAgZGVsZXRlSXRlbToge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdpZCcpLnRvSW50KCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgaXRlbUNhdGVnb3J5ID0gYXdhaXQgSXRlbUNhdGVnb3J5LndoZXJlKCdpZCcsIGlkKS5mZXRjaCgpO1xuXG4gICAgICBpZiAoIWl0ZW1DYXRlZ29yeSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQoKTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IGl0ZW1DYXRlZ29yeS5kZXN0cm95KCk7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoKTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgbGlzdCBvZiBpdGVtcy5cbiAgICovXG4gIGdldExpc3Q6IHtcbiAgICB2YWxpZGF0aW9uOiBbXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IEl0ZW1DYXRlZ29yeS5mZXRjaCgpO1xuXG4gICAgICBpZiAoIWl0ZW1zKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgaXRlbXM6IGl0ZW1zLnRvSlNPTigpIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGRldGFpbHMgb2YgdGhlIGdpdmVuIGNhdGVnb3J5LlxuICAgKi9cbiAgZ2V0Q2F0ZWdvcnk6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBwYXJhbSgnY2F0ZWdvcnlfaWQnKS50b0ludCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgeyBjYXRlZ29yeV9pZDogY2F0ZWdvcnlJZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IGl0ZW0gPSBhd2FpdCBJdGVtQ2F0ZWdvcnkud2hlcmUoJ2lkJywgY2F0ZWdvcnlJZCkuZmV0Y2goKTtcblxuICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnQ0FURUdPUllfTk9UX0ZPVU5EJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgY2F0ZWdvcnk6IGl0ZW0udG9KU09OKCkgfSk7XG4gICAgfSxcbiAgfSxcbn07XG4iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCB7IGNoZWNrLCB2YWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHsgZGlmZmVyZW5jZSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgYXN5bmNNaWRkbGV3YXJlIGZyb20gJ0AvaHR0cC9taWRkbGV3YXJlL2FzeW5jTWlkZGxld2FyZSc7XG5pbXBvcnQgand0QXV0aCBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9qd3RBdXRoJztcbmltcG9ydCBJdGVtIGZyb20gJ0AvbW9kZWxzL0l0ZW0nO1xuaW1wb3J0IEFjY291bnQgZnJvbSAnQC9tb2RlbHMvQWNjb3VudCc7XG5pbXBvcnQgSXRlbUNhdGVnb3J5IGZyb20gJ0AvbW9kZWxzL0l0ZW1DYXRlZ29yeSc7XG5pbXBvcnQgUmVzb3VyY2UgZnJvbSAnQC9tb2RlbHMvUmVzb3VyY2UnO1xuaW1wb3J0IFJlc291cmNlRmllbGQgZnJvbSAnQC9tb2RlbHMvUmVzb3VyY2VGaWVsZCc7XG5pbXBvcnQgQXV0aG9yaXphdGlvbiBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9hdXRob3JpemF0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIHJvdXRlcigpIHtcbiAgICBjb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuICAgIGNvbnN0IHBlcm1pdCA9IEF1dGhvcml6YXRpb24oJ2l0ZW1zJyk7XG5cbiAgICByb3V0ZXIudXNlKGp3dEF1dGgpO1xuXG4gICAgcm91dGVyLnBvc3QoJy86aWQnLFxuICAgICAgdGhpcy5lZGl0SXRlbS52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZWRpdEl0ZW0uaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLnBvc3QoJy8nLFxuICAgICAgLy8gcGVybWl0KCdjcmVhdGUnKSxcbiAgICAgIHRoaXMubmV3SXRlbS52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMubmV3SXRlbS5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZGVsZXRlKCcvOmlkJyxcbiAgICAgIHRoaXMuZGVsZXRlSXRlbS52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZGVsZXRlSXRlbS5oYW5kbGVyKSk7XG5cbiAgICAvLyByb3V0ZXIuZ2V0KCcvOmlkJyxcbiAgICAvLyAgIHRoaXMuZ2V0Q2F0ZWdvcnkudmFsaWRhdGlvbixcbiAgICAvLyAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmdldENhdGVnb3J5LmhhbmRsZXIpKTtcblxuICAgIC8vIHJvdXRlci5nZXQoJy8nLFxuICAgIC8vICAgdGhpcy5jYXRlZ29yaWVzTGlzdC52YWxpZGF0aW9uLFxuICAgIC8vICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuY2F0ZWdvcmllc0xpc3QudmFsaWRhdGlvbikpO1xuXG4gICAgcmV0dXJuIHJvdXRlcjtcbiAgfSxcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBpdGVtLlxuICAgKi9cbiAgbmV3SXRlbToge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCduYW1lJykuZXhpc3RzKCksXG4gICAgICBjaGVjaygndHlwZScpLmV4aXN0cygpLnRyaW0oKS5lc2NhcGUoKS5pc0luKFsnc2VydmljZScsICdwcm9kdWN0J10pLFxuICAgICAgY2hlY2soJ2Nvc3RfcHJpY2UnKS5leGlzdHMoKS5pc051bWVyaWMoKSxcbiAgICAgIGNoZWNrKCdzZWxsX3ByaWNlJykuZXhpc3RzKCkuaXNOdW1lcmljKCksXG4gICAgICBjaGVjaygnY29zdF9hY2NvdW50X2lkJykuZXhpc3RzKCkuaXNJbnQoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ3NlbGxfYWNjb3VudF9pZCcpLmV4aXN0cygpLmlzSW50KCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdjYXRlZ29yeV9pZCcpLm9wdGlvbmFsKCkuaXNJbnQoKS50b0ludCgpLFxuXG4gICAgICBjaGVjaygnY3VzdG9tX2ZpZWxkcycpLm9wdGlvbmFsKCkuaXNBcnJheSh7IG1pbjogMSB9KSxcbiAgICAgIGNoZWNrKCdjdXN0b21fZmllbGRzLioua2V5JykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdjdXN0b21fZmllbGRzLioudmFsdWUnKS5leGlzdHMoKSxcblxuICAgICAgY2hlY2soJ25vdGUnKS5vcHRpb25hbCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGZvcm0gPSB7XG4gICAgICAgIGN1c3RvbV9maWVsZHM6IFtdLFxuICAgICAgICAuLi5yZXEuYm9keSxcbiAgICAgIH07XG4gICAgICBjb25zdCBlcnJvclJlYXNvbnMgPSBbXTtcblxuICAgICAgY29uc3QgY29zdEFjY291bnRQcm9taXNlID0gQWNjb3VudC5xdWVyeSgpLmZpbmRCeUlkKGZvcm0uY29zdF9hY2NvdW50X2lkKTtcbiAgICAgIGNvbnN0IHNlbGxBY2NvdW50UHJvbWlzZSA9IEFjY291bnQucXVlcnkoKS5maW5kQnlJZChmb3JtLnNlbGxfYWNjb3VudF9pZCk7XG4gICAgICBjb25zdCBpdGVtQ2F0ZWdvcnlQcm9taXNlID0gKGZvcm0uY2F0ZWdvcnlfaWQpXG4gICAgICAgID8gSXRlbUNhdGVnb3J5LnF1ZXJ5KCkuZmluZEJ5SWQoZm9ybS5jYXRlZ29yeV9pZCkgOiBudWxsO1xuXG4gICAgICAvLyBWYWxpZGF0ZSB0aGUgY3VzdG9tIGZpZWxkcyBrZXkgYW5kIHZhbHVlIHR5cGUuXG4gICAgICBpZiAoZm9ybS5jdXN0b21fZmllbGRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgY3VzdG9tRmllbGRzS2V5cyA9IGZvcm0uY3VzdG9tX2ZpZWxkcy5tYXAoKGZpZWxkKSA9PiBmaWVsZC5rZXkpO1xuXG4gICAgICAgIC8vIEdldCByZXNvdXJjZSBpZCB0aGFuIGdldCBhbGwgcmVzb3VyY2UgZmllbGRzLlxuICAgICAgICBjb25zdCByZXNvdXJjZSA9IGF3YWl0IFJlc291cmNlLndoZXJlKCduYW1lJywgJ2l0ZW1zJykuZmV0Y2goKTtcbiAgICAgICAgY29uc3QgZmllbGRzID0gYXdhaXQgUmVzb3VyY2VGaWVsZC5xdWVyeSgocXVlcnkpID0+IHtcbiAgICAgICAgICBxdWVyeS53aGVyZSgncmVzb3VyY2VfaWQnLCByZXNvdXJjZS5pZCk7XG4gICAgICAgICAgcXVlcnkud2hlcmVJbigna2V5JywgY3VzdG9tRmllbGRzS2V5cyk7XG4gICAgICAgIH0pLmZldGNoQWxsKCk7XG5cbiAgICAgICAgY29uc3Qgc3RvcmVkRmllbGRzS2V5ID0gZmllbGRzLm1hcCgoZikgPT4gZi5hdHRyaWJ1dGVzLmtleSk7XG5cbiAgICAgICAgLy8gR2V0IGFsbCBub3QgZGVmaW5lZCByZXNvdXJjZSBmaWVsZHMuXG4gICAgICAgIGNvbnN0IG5vdEZvdW5kRmllbGRzID0gZGlmZmVyZW5jZShjdXN0b21GaWVsZHNLZXlzLCBzdG9yZWRGaWVsZHNLZXkpO1xuXG4gICAgICAgIGlmIChub3RGb3VuZEZpZWxkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnRklFTERfS0VZX05PVF9GT1VORCcsIGNvZGU6IDE1MCwgZmllbGRzOiBub3RGb3VuZEZpZWxkcyB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgW2Nvc3RBY2NvdW50LCBzZWxsQWNjb3VudCwgaXRlbUNhdGVnb3J5XSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgY29zdEFjY291bnRQcm9taXNlLCBzZWxsQWNjb3VudFByb21pc2UsIGl0ZW1DYXRlZ29yeVByb21pc2UsXG4gICAgICBdKTtcbiAgICAgIGlmICghY29zdEFjY291bnQpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnQ09TVF9BQ0NPVU5UX05PVF9GT1VORCcsIGNvZGU6IDEwMCB9KTtcbiAgICAgIH1cbiAgICAgIGlmICghc2VsbEFjY291bnQpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnU0VMTF9BQ0NPVU5UX05PVF9GT1VORCcsIGNvZGU6IDEyMCB9KTtcbiAgICAgIH1cbiAgICAgIGlmICghaXRlbUNhdGVnb3J5ICYmIGZvcm0uY2F0ZWdvcnlfaWQpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnSVRFTV9DQVRFR09SWV9OT1RfRk9VTkQnLCBjb2RlOiAxNDAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZXJyb3JSZWFzb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwgeyBlcnJvcnM6IGVycm9yUmVhc29ucyB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGl0ZW0gPSBhd2FpdCBJdGVtLnF1ZXJ5KCkuaW5zZXJ0QW5kRmV0Y2goe1xuICAgICAgICBuYW1lOiBmb3JtLm5hbWUsXG4gICAgICAgIHR5cGU6IGZvcm0udHlwZSxcbiAgICAgICAgY29zdF9wcmljZTogZm9ybS5jb3N0X3ByaWNlLFxuICAgICAgICBzZWxsX3ByaWNlOiBmb3JtLnNlbGxfcHJpY2UsXG4gICAgICAgIHNlbGxfYWNjb3VudF9pZDogZm9ybS5zZWxsX2FjY291bnRfaWQsXG4gICAgICAgIGNvc3RfYWNjb3VudF9pZDogZm9ybS5jb3N0X2FjY291bnRfaWQsXG4gICAgICAgIGN1cnJlbmN5X2NvZGU6IGZvcm0uY3VycmVuY3lfY29kZSxcbiAgICAgICAgbm90ZTogZm9ybS5ub3RlLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyBpZDogaXRlbS5pZCB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBFZGl0IHRoZSBnaXZlbiBpdGVtLlxuICAgKi9cbiAgZWRpdEl0ZW06IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBjaGVjaygnbmFtZScpLmV4aXN0cygpLFxuICAgICAgY2hlY2soJ3R5cGUnKS5leGlzdHMoKS50cmltKCkuZXNjYXBlKCkuaXNJbihbJ3Byb2R1Y3QnLCAnc2VydmljZSddKSxcbiAgICAgIGNoZWNrKCdjb3N0X3ByaWNlJykuZXhpc3RzKCkuaXNOdW1lcmljKCksXG4gICAgICBjaGVjaygnc2VsbF9wcmljZScpLmV4aXN0cygpLmlzTnVtZXJpYygpLFxuICAgICAgY2hlY2soJ2Nvc3RfYWNjb3VudF9pZCcpLmV4aXN0cygpLmlzSW50KCksXG4gICAgICBjaGVjaygnc2VsbF9hY2NvdW50X2lkJykuZXhpc3RzKCkuaXNJbnQoKSxcbiAgICAgIGNoZWNrKCdjYXRlZ29yeV9pZCcpLm9wdGlvbmFsKCkuaXNJbnQoKSxcbiAgICAgIGNoZWNrKCdub3RlJykub3B0aW9uYWwoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCBmb3JtID0ge1xuICAgICAgICBjdXN0b21fZmllbGRzOiBbXSxcbiAgICAgICAgLi4ucmVxLmJvZHksXG4gICAgICB9O1xuICAgICAgY29uc3QgaXRlbSA9IGF3YWl0IEl0ZW0ucXVlcnkoKS5maW5kQnlJZChpZCk7XG4gICAgICBcbiAgICAgIGlmICghaXRlbSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQobnVsbCwgeyBlcnJvcnM6IFtcbiAgICAgICAgICB7IHR5cGU6ICdJVEVNLk5PVC5GT1VORCcsIGNvZGU6IDEwMCB9LFxuICAgICAgICBdfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBlcnJvclJlYXNvbnMgPSBbXTtcblxuICAgICAgY29uc3QgY29zdEFjY291bnRQcm9taXNlID0gQWNjb3VudC5xdWVyeSgpLmZpbmRCeUlkKGZvcm0uY29zdF9hY2NvdW50X2lkKTtcbiAgICAgIGNvbnN0IHNlbGxBY2NvdW50UHJvbWlzZSA9IEFjY291bnQucXVlcnkoKS5maW5kQnlJZChmb3JtLnNlbGxfYWNjb3VudF9pZCk7XG4gICAgICBjb25zdCBpdGVtQ2F0ZWdvcnlQcm9taXNlID0gKGZvcm0uY2F0ZWdvcnlfaWQpXG4gICAgICAgID8gSXRlbUNhdGVnb3J5LnF1ZXJ5KCkuZmluZEJ5SWQoZm9ybS5jYXRlZ29yeV9pZCkgOiBudWxsO1xuXG4gICAgICBjb25zdCBbY29zdEFjY291bnQsIHNlbGxBY2NvdW50LCBpdGVtQ2F0ZWdvcnldID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBjb3N0QWNjb3VudFByb21pc2UsIHNlbGxBY2NvdW50UHJvbWlzZSwgaXRlbUNhdGVnb3J5UHJvbWlzZSxcbiAgICAgIF0pO1xuICAgICAgaWYgKCFjb3N0QWNjb3VudCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdDT1NUX0FDQ09VTlRfTk9UX0ZPVU5EJywgY29kZTogMTAwIH0pO1xuICAgICAgfVxuICAgICAgaWYgKCFzZWxsQWNjb3VudCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdTRUxMX0FDQ09VTlRfTk9UX0ZPVU5EJywgY29kZTogMTIwIH0pO1xuICAgICAgfVxuICAgICAgaWYgKCFpdGVtQ2F0ZWdvcnkgJiYgZm9ybS5jYXRlZ29yeV9pZCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdJVEVNX0NBVEVHT1JZX05PVF9GT1VORCcsIGNvZGU6IDE0MCB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChlcnJvclJlYXNvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkUmVxdWVzdChudWxsLCB7IGVycm9yczogZXJyb3JSZWFzb25zIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB1cGRhdGVkSXRlbSA9IGF3YWl0IEl0ZW0ucXVlcnkoKS5maW5kQnlJZChpZCkucGF0Y2goe1xuICAgICAgICBuYW1lOiBmb3JtLm5hbWUsXG4gICAgICAgIHR5cGU6IGZvcm0udHlwZSxcbiAgICAgICAgY29zdF9wcmljZTogZm9ybS5jb3N0X3ByaWNlLFxuICAgICAgICBzZWxsX3ByaWNlOiBmb3JtLnNlbGxfcHJpY2UsXG4gICAgICAgIGN1cnJlbmN5X2NvZGU6IGZvcm0uY3VycmVuY3lfY29kZSxcbiAgICAgICAgc2VsbF9hY2NvdW50X2lkOiBmb3JtLnNlbGxfYWNjb3VudF9pZCxcbiAgICAgICAgY29zdF9hY2NvdW50X2lkOiBmb3JtLmNvc3RfYWNjb3VudF9pZCxcbiAgICAgICAgY2F0ZWdvcnlfaWQ6IGZvcm0uY2F0ZWdvcnlfaWQsXG4gICAgICAgIG5vdGU6IGZvcm0ubm90ZSxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgaWQ6IHVwZGF0ZWRJdGVtLmlkIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIERlbGV0ZSB0aGUgZ2l2ZW4gaXRlbSBmcm9tIHRoZSBzdG9yYWdlLlxuICAgKi9cbiAgZGVsZXRlSXRlbToge1xuICAgIHZhbGlkYXRpb246IFtdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCBpdGVtID0gYXdhaXQgSXRlbS5xdWVyeSgpLmZpbmRCeUlkKGlkKTtcblxuICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnSVRFTV9OT1RfRk9VTkQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBEZWxldGUgdGhlIGZ1Y2tpbmcgdGhlIGdpdmVuIGl0ZW0gaWQuXG4gICAgICBhd2FpdCBJdGVtLnF1ZXJ5KCkuZmluZEJ5SWQoaXRlbS5pZCkuZGVsZXRlKCk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCgpO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHJpdmUgdGhlIGxpc3QgaXRlbXMgd2l0aCBwYWdpbmF0aW9uIG1ldGEuXG4gICAqL1xuICBsaXN0SXRlbXM6IHtcbiAgICB2YWxpZGF0aW9uOiBbXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCBmaWx0ZXIgPSB7XG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIFNLVTogJycsXG4gICAgICAgIGFjY291bnRfaWQ6IG51bGwsXG4gICAgICAgIHBhZ2Vfc2l6ZTogMTAsXG4gICAgICAgIHBhZ2U6IDEsXG4gICAgICAgIHN0YXJ0X2RhdGU6IG51bGwsXG4gICAgICAgIGVuZF9kYXRlOiBudWxsLFxuICAgICAgICAuLi5yZXEucXVlcnksXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IEl0ZW0ucXVlcnkoKHF1ZXJ5KSA9PiB7XG4gICAgICAgIGlmIChmaWx0ZXIuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICBxdWVyeS53aGVyZSgnZGVzY3JpcHRpb24nLCAnbGlrZScsIGAlJHtmaWx0ZXIuZGVzY3JpcHRpb259JWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWx0ZXIuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICBxdWVyeS53aGVyZSgnU0tVJywgZmlsdGVyLlNLWSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbHRlci5uYW1lKSB7XG4gICAgICAgICAgcXVlcnkud2hlcmUoJ25hbWUnLCBmaWx0ZXIubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbHRlci5zdGFydF9kYXRlKSB7XG4gICAgICAgICAgY29uc3Qgc3RhcnREYXRlRm9ybWF0dGVkID0gbW9tZW50KGZpbHRlci5zdGFydF9kYXRlKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06U1MnKTtcbiAgICAgICAgICBxdWVyeS53aGVyZSgnY3JlYXRlZF9hdCcsICc+PScsIHN0YXJ0RGF0ZUZvcm1hdHRlZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbHRlci5lbmRfZGF0ZSkge1xuICAgICAgICAgIGNvbnN0IGVuZERhdGVGb3JtYXR0ZWQgPSBtb21lbnQoZmlsdGVyLmVuZF9kYXRlKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06U1MnKTtcbiAgICAgICAgICBxdWVyeS53aGVyZSgnY3JlYXRlZF9hdCcsICc8PScsIGVuZERhdGVGb3JtYXR0ZWQpO1xuICAgICAgICB9XG4gICAgICB9KS5mZXRjaFBhZ2Uoe1xuICAgICAgICBwYWdlX3NpemU6IGZpbHRlci5wYWdlX3NpemUsXG4gICAgICAgIHBhZ2U6IGZpbHRlci5wYWdlLFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgIGl0ZW1zOiBpdGVtcy50b0pTT04oKSxcbiAgICAgICAgcGFnaW5hdGlvbjogaXRlbXMucGFnaW5hdGlvbixcbiAgICAgIH0pO1xuICAgIH0sXG4gIH0sXG59O1xuIiwiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgeyBib2R5LCBxdWVyeSwgdmFsaWRhdGlvblJlc3VsdCB9IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJztcbmltcG9ydCBhc3luY01pZGRsZXdhcmUgZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvYXN5bmNNaWRkbGV3YXJlJztcbmltcG9ydCBPcHRpb24gZnJvbSAnQC9tb2RlbHMvT3B0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogUm91dGVyIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbiAgICByb3V0ZXIucG9zdCgnLycsXG4gICAgICB0aGlzLnNhdmVPcHRpb25zLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5zYXZlT3B0aW9ucy5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvJyxcbiAgICAgIHRoaXMuZ2V0T3B0aW9ucy52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZ2V0U2V0dGluZ3MpKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNhdmVzIHRoZSBnaXZlbiBvcHRpb25zIHRvIHRoZSBzdG9yYWdlLlxuICAgKi9cbiAgc2F2ZU9wdGlvbnM6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBib2R5KCdvcHRpb25zJykuaXNBcnJheSgpLFxuICAgICAgYm9keSgnb3B0aW9ucy4qLmtleScpLmV4aXN0cygpLFxuICAgICAgYm9keSgnb3B0aW9ucy4qLnZhbHVlJykuZXhpc3RzKCksXG4gICAgICBib2R5KCdvcHRpb25zLiouZ3JvdXAnKS5leGlzdHMoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICdWQUxJREFUSU9OX0VSUk9SJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmb3JtID0geyAuLi5yZXEuYm9keSB9O1xuICAgICAgY29uc3Qgb3B0aW9uc0NvbGxlY3Rpb25zID0gYXdhaXQgT3B0aW9uLnF1ZXJ5KCk7XG5cbiAgICAgIGZvcm0ub3B0aW9ucy5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICAgICAgb3B0aW9uc0NvbGxlY3Rpb25zLnNldE1ldGEob3B0aW9uLmtleSwgb3B0aW9uLnZhbHVlLCBvcHRpb24uZ3JvdXApO1xuICAgICAgfSk7XG4gICAgICBhd2FpdCBvcHRpb25zQ29sbGVjdGlvbnMuc2F2ZU1ldGEoKTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKCk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGFwcGxpY2F0aW9uIG9wdGlvbnMgZnJvbSB0aGUgc3RvcmFnZS5cbiAgICovXG4gIGdldE9wdGlvbnM6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBxdWVyeSgna2V5Jykub3B0aW9uYWwoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICdWQUxJREFUSU9OX0VSUk9SJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBvcHRpb25zID0gYXdhaXQgT3B0aW9uLnF1ZXJ5KCk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZHMoeyBvcHRpb25zIH0pO1xuICAgIH0sXG4gIH0sXG59O1xuIiwiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQge1xuICBwYXJhbSxcbiAgcXVlcnksXG4gIHZhbGlkYXRpb25SZXN1bHQsXG59IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJztcbmltcG9ydCBhc3luY01pZGRsZXdhcmUgZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvYXN5bmNNaWRkbGV3YXJlJztcbmltcG9ydCBqd3RBdXRoIGZyb20gJ0AvaHR0cC9taWRkbGV3YXJlL2p3dEF1dGgnO1xuaW1wb3J0IFJlc291cmNlIGZyb20gJ0AvbW9kZWxzL1Jlc291cmNlJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogUm91dGVyIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbiAgICByb3V0ZXIudXNlKGp3dEF1dGgpO1xuXG4gICAgcm91dGVyLmdldCgnLzpyZXNvdXJjZV9zbHVnL2NvbHVtbnMnLFxuICAgICAgdGhpcy5yZXNvdXJjZUNvbHVtbnMudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLnJlc291cmNlQ29sdW1ucy5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvOnJlc291cmNlX3NsdWcvZmllbGRzJyxcbiAgICAgIHRoaXMucmVzb3VyY2VGaWVsZHMudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLnJlc291cmNlRmllbGRzLmhhbmRsZXIpKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIHJlc291cmNlIGNvbHVtbnMgb2YgdGhlIGdpdmVuIHJlc291cmNlLlxuICAgKi9cbiAgcmVzb3VyY2VDb2x1bW5zOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ3Jlc291cmNlX3NsdWcnKS50cmltKCkuZXNjYXBlKCkuZXhpc3RzKCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IHJlc291cmNlX3NsdWc6IHJlc291cmNlU2x1ZyB9ID0gcmVxLnBhcmFtcztcblxuICAgICAgY29uc3QgcmVzb3VyY2UgPSBhd2FpdCBSZXNvdXJjZS5xdWVyeSgpXG4gICAgICAgIC53aGVyZSgnbmFtZScsIHJlc291cmNlU2x1ZylcbiAgICAgICAgLndpdGhHcmFwaEZldGNoZWQoJ2ZpZWxkcycpXG4gICAgICAgIC5maXJzdCgpO1xuXG4gICAgICBpZiAoIXJlc291cmNlKSB7XG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnUkVTT1VSQ0UuU0xVRy5OT1QuRk9VTkQnLCBjb2RlOiAyMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgcmVzb3VyY2VGaWVsZHMgPSByZXNvdXJjZS5maWVsZHNcbiAgICAgICAgLmZpbHRlcigoZmllbGQpID0+IGZpZWxkLmNvbHVtbmFibGUpXG4gICAgICAgIC5tYXAoKGZpZWxkKSA9PiAoe1xuICAgICAgICAgIGlkOiBmaWVsZC5pZCxcbiAgICAgICAgICBsYWJlbDogZmllbGQubGFiZWxOYW1lLFxuICAgICAgICAgIGtleTogZmllbGQua2V5LFxuICAgICAgICB9KSk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgIHJlc291cmNlX2NvbHVtbnM6IHJlc291cmNlRmllbGRzLFxuICAgICAgICByZXNvdXJjZV9zbHVnOiByZXNvdXJjZVNsdWcsXG4gICAgICB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSByZXNvdXJjZSBmaWVsZHMgb2YgdGhlIGdpdmVuIHJlc291cmNlLlxuICAgKi9cbiAgcmVzb3VyY2VGaWVsZHM6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBwYXJhbSgncmVzb3VyY2Vfc2x1ZycpLnRyaW0oKS5lc2NhcGUoKS5leGlzdHMoKSxcbiAgICAgIHF1ZXJ5KCdwcmVkZWZpbmVkJykub3B0aW9uYWwoKS5pc0Jvb2xlYW4oKS50b0Jvb2xlYW4oKSxcbiAgICAgIHF1ZXJ5KCdidWlsdGluJykub3B0aW9uYWwoKS5pc0Jvb2xlYW4oKS50b0Jvb2xlYW4oKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgcmVzb3VyY2Vfc2x1ZzogcmVzb3VyY2VTbHVnIH0gPSByZXEucGFyYW1zO1xuXG4gICAgICBjb25zdCByZXNvdXJjZSA9IGF3YWl0IFJlc291cmNlLnF1ZXJ5KClcbiAgICAgICAgLndoZXJlKCduYW1lJywgcmVzb3VyY2VTbHVnKVxuICAgICAgICAud2l0aEdyYXBoRmV0Y2hlZCgnZmllbGRzJylcbiAgICAgICAgLmZpcnN0KCk7XG5cbiAgICAgIGlmICghcmVzb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdSRVNPVVJDRS5TTFVHLk5PVC5GT1VORCcsIGNvZGU6IDIwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoe1xuICAgICAgICByZXNvdXJjZV9maWVsZHM6IHJlc291cmNlLmZpZWxkcyxcbiAgICAgICAgcmVzb3VyY2Vfc2x1ZzogcmVzb3VyY2VTbHVnLFxuICAgICAgfSk7XG4gICAgfSxcbiAgfSxcbn07XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgeyBjaGVjaywgdmFsaWRhdGlvblJlc3VsdCB9IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJztcbmltcG9ydCB7IGRpZmZlcmVuY2UgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGFzeW5jTWlkZGxld2FyZSBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9hc3luY01pZGRsZXdhcmUnO1xuaW1wb3J0IFJvbGUgZnJvbSAnQC9tb2RlbHMvUm9sZSc7XG5pbXBvcnQgUGVybWlzc2lvbiBmcm9tICdAL21vZGVscy9QZXJtaXNzaW9uJztcbmltcG9ydCBSZXNvdXJjZSBmcm9tICdAL21vZGVscy9SZXNvdXJjZSc7XG5pbXBvcnQga25leCBmcm9tICdAL2RhdGFiYXNlL2tuZXgnO1xuXG5jb25zdCBBY2Nlc3NDb250cm9sbFNjaGVtYSA9IFtcbiAge1xuICAgIHJlc291cmNlOiAnaXRlbXMnLFxuICAgIGxhYmVsOiAncHJvZHVjdHNfc2VydmljZXMnLFxuICAgIHBlcm1pc3Npb25zOiBbJ2NyZWF0ZScsICdlZGl0JywgJ2RlbGV0ZScsICd2aWV3J10sXG4gICAgZnVsbEFjY2VzczogdHJ1ZSxcbiAgICBvd25Db250cm9sOiB0cnVlLFxuICB9LFxuXTtcblxuY29uc3QgZ2V0UmVzb3VyY2VTY2hlbWEgPSAocmVzb3VyY2UpID0+IEFjY2Vzc0NvbnRyb2xsU2NoZW1hXG4gIC5maW5kKChzY2hlbWEpID0+IHNjaGVtYS5yZXNvdXJjZSA9PT0gcmVzb3VyY2UpO1xuXG5jb25zdCBnZXRSZXNvdXJjZVBlcm1pc3Npb25zID0gKHJlc291cmNlKSA9PiB7XG4gIGNvbnN0IGZvdW5kUmVzb3VyY2UgPSBnZXRSZXNvdXJjZVNjaGVtYShyZXNvdXJjZSk7XG4gIHJldHVybiBmb3VuZFJlc291cmNlID8gZm91bmRSZXNvdXJjZS5wZXJtaXNzaW9ucyA6IFtdO1xufTtcblxuY29uc3QgZmluZE5vdEZvdW5kUmVzb3VyY2VzID0gKHJlc291cmNlc1NsdWdzKSA9PiB7XG4gIGNvbnN0IHNjaGVtYVJlc291cmNlc1NsdWdzID0gQWNjZXNzQ29udHJvbGxTY2hlbWEubWFwKChzKSA9PiBzLnJlc291cmNlKTtcbiAgcmV0dXJuIGRpZmZlcmVuY2UocmVzb3VyY2VzU2x1Z3MsIHNjaGVtYVJlc291cmNlc1NsdWdzKTtcbn07XG5cbmNvbnN0IGZpbmROb3RGb3VuZFBlcm1pc3Npb25zID0gKHBlcm1pc3Npb25zLCByZXNvdXJjZVNsdWcpID0+IHtcbiAgY29uc3Qgc2NoZW1hUGVybWlzc2lvbnMgPSBnZXRSZXNvdXJjZVBlcm1pc3Npb25zKHJlc291cmNlU2x1Zyk7XG4gIHJldHVybiBkaWZmZXJlbmNlKHBlcm1pc3Npb25zLCBzY2hlbWFQZXJtaXNzaW9ucyk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBSb3V0ZXIgY29uc3RydWN0b3IgbWV0aG9kLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbiAgICByb3V0ZXIucG9zdCgnLycsXG4gICAgICB0aGlzLm5ld1JvbGUudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLm5ld1JvbGUuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLnBvc3QoJy86aWQnLFxuICAgICAgdGhpcy5lZGl0Um9sZS52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZWRpdFJvbGUuaGFuZGxlci5iaW5kKHRoaXMpKSk7XG5cbiAgICByb3V0ZXIuZGVsZXRlKCcvOmlkJyxcbiAgICAgIHRoaXMuZGVsZXRlUm9sZS52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZGVsZXRlUm9sZS5oYW5kbGVyKSk7XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHJvbGUuXG4gICAqL1xuICBuZXdSb2xlOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgY2hlY2soJ25hbWUnKS5leGlzdHMoKS50cmltKCkuZXNjYXBlKCksXG4gICAgICBjaGVjaygnZGVzY3JpcHRpb24nKS5vcHRpb25hbCgpLnRyaW0oKS5lc2NhcGUoKSxcbiAgICAgIGNoZWNrKCdwZXJtaXNzaW9ucycpLmlzQXJyYXkoeyBtaW46IDAgfSksXG4gICAgICBjaGVjaygncGVybWlzc2lvbnMuKi5yZXNvdXJjZV9zbHVnJykuZXhpc3RzKCkud2hpdGVsaXN0KCdeW2EtejAtOV0rKD86LVthLXowLTldKykqJCcpLFxuICAgICAgY2hlY2soJ3Blcm1pc3Npb25zLioucGVybWlzc2lvbnMnKS5pc0FycmF5KHsgbWluOiAxIH0pLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHsgbmFtZSwgZGVzY3JpcHRpb24sIHBlcm1pc3Npb25zIH0gPSByZXEuYm9keTtcblxuICAgICAgY29uc3QgcmVzb3VyY2VzU2x1Z3MgPSBwZXJtaXNzaW9ucy5tYXAoKHBlcm0pID0+IHBlcm0ucmVzb3VyY2Vfc2x1Zyk7XG4gICAgICBjb25zdCBwZXJtaXNzaW9uc1NsdWdzID0gW107XG4gICAgICBjb25zdCByZXNvdXJjZXNOb3RGb3VuZCA9IGZpbmROb3RGb3VuZFJlc291cmNlcyhyZXNvdXJjZXNTbHVncyk7XG5cbiAgICAgIGNvbnN0IGVycm9yUmVhc29ucyA9IFtdO1xuICAgICAgY29uc3Qgbm90Rm91bmRQZXJtaXNzaW9ucyA9IFtdO1xuXG4gICAgICBpZiAocmVzb3VyY2VzTm90Rm91bmQubGVuZ3RoID4gMCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ1JFU09VUkNFX1NMVUdfTk9UX0ZPVU5EJywgY29kZTogMTAwLCByZXNvdXJjZXM6IHJlc291cmNlc05vdEZvdW5kLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHBlcm1pc3Npb25zLmZvckVhY2goKHBlcm0pID0+IHtcbiAgICAgICAgY29uc3QgYWJpbGl0aWVzID0gcGVybS5wZXJtaXNzaW9ucy5tYXAoKGFiaWxpdHkpID0+IGFiaWxpdHkpO1xuXG4gICAgICAgIC8vIEdldHMgdGhlIG5vdCBmb3VuZCBwZXJtaXNzaW9ucyBpbiB0aGUgc2NoZW1hLlxuICAgICAgICBjb25zdCBub3RGb3VuZEFiaWxpdGllcyA9IGZpbmROb3RGb3VuZFBlcm1pc3Npb25zKGFiaWxpdGllcywgcGVybS5yZXNvdXJjZV9zbHVnKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChub3RGb3VuZEFiaWxpdGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgbm90Rm91bmRQZXJtaXNzaW9ucy5wdXNoKHtcbiAgICAgICAgICAgIHJlc291cmNlX3NsdWc6IHBlcm0ucmVzb3VyY2Vfc2x1ZyxcbiAgICAgICAgICAgIHBlcm1pc3Npb25zOiBub3RGb3VuZEFiaWxpdGllcyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBwZXJtcyA9IHBlcm0ucGVybWlzc2lvbnMgfHwgW107XG4gICAgICAgICAgcGVybXMuZm9yRWFjaCgocGVybWlzc2lvbikgPT4ge1xuICAgICAgICAgICAgaWYgKHBlcm1zLmluZGV4T2YocGVybWlzc2lvbikgIT09IC0xKSB7XG4gICAgICAgICAgICAgIHBlcm1pc3Npb25zU2x1Z3MucHVzaChwZXJtaXNzaW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAobm90Rm91bmRQZXJtaXNzaW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnUEVSTUlTU0lPTlNfU0xVR19OT1RfRk9VTkQnLFxuICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICBwZXJtaXNzaW9uczogbm90Rm91bmRQZXJtaXNzaW9ucyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZXJyb3JSZWFzb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwgeyBlcnJvcnM6IGVycm9yUmVhc29ucyB9KTtcbiAgICAgIH1cbiAgICAgIC8vIFBlcm1pc3Npb25zLlxuICAgICAgY29uc3QgW3Jlc291cmNlc0NvbGxlY3Rpb24sIHBlcm1zQ29sbGVjdGlvbl0gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIFJlc291cmNlLnF1ZXJ5KChxdWVyeSkgPT4geyBxdWVyeS53aGVyZUluKCduYW1lJywgcmVzb3VyY2VzU2x1Z3MpOyB9KS5mZXRjaEFsbCgpLFxuICAgICAgICBQZXJtaXNzaW9uLnF1ZXJ5KChxdWVyeSkgPT4geyBxdWVyeS53aGVyZUluKCduYW1lJywgcGVybWlzc2lvbnNTbHVncyk7IH0pLmZldGNoQWxsKCksXG4gICAgICBdKTtcblxuICAgICAgY29uc3Qgbm90U3RvcmVkUmVzb3VyY2VzID0gZGlmZmVyZW5jZShcbiAgICAgICAgcmVzb3VyY2VzU2x1Z3MsIHJlc291cmNlc0NvbGxlY3Rpb24ubWFwKChzKSA9PiBzLm5hbWUpLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IG5vdFN0b3JlZFBlcm1pc3Npb25zID0gZGlmZmVyZW5jZShcbiAgICAgICAgcGVybWlzc2lvbnNTbHVncywgcGVybXNDb2xsZWN0aW9uLm1hcCgocGVybSkgPT4gcGVybS5zbHVnKSxcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IGluc2VydFRocmVhZCA9IFtdO1xuXG4gICAgICBpZiAobm90U3RvcmVkUmVzb3VyY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaW5zZXJ0VGhyZWFkLnB1c2goa25leCgncmVzb3VyY2VzJykuaW5zZXJ0KFtcbiAgICAgICAgICAuLi5ub3RTdG9yZWRSZXNvdXJjZXMubWFwKChyZXNvdXJjZSkgPT4gKHsgbmFtZTogcmVzb3VyY2UgfSkpLFxuICAgICAgICBdKSk7XG4gICAgICB9XG4gICAgICBpZiAobm90U3RvcmVkUGVybWlzc2lvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICBpbnNlcnRUaHJlYWQucHVzaChrbmV4KCdwZXJtaXNzaW9ucycpLmluc2VydChbXG4gICAgICAgICAgLi4ubm90U3RvcmVkUGVybWlzc2lvbnMubWFwKChwZXJtaXNzaW9uKSA9PiAoeyBuYW1lOiBwZXJtaXNzaW9uIH0pKSxcbiAgICAgICAgXSkpO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChpbnNlcnRUaHJlYWQpO1xuXG4gICAgICBjb25zdCBbc3RvcmVkUGVybWlzc2lvbnMsIHN0b3JlZFJlc291cmNlc10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIFBlcm1pc3Npb24ucXVlcnkoKHEpID0+IHsgcS53aGVyZUluKCduYW1lJywgcGVybWlzc2lvbnNTbHVncyk7IH0pLmZldGNoQWxsKCksXG4gICAgICAgIFJlc291cmNlLnF1ZXJ5KChxKSA9PiB7IHEud2hlcmVJbignbmFtZScsIHJlc291cmNlc1NsdWdzKTsgfSkuZmV0Y2hBbGwoKSxcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBzdG9yZWRSZXNvdXJjZXNTZXQgPSBuZXcgTWFwKHN0b3JlZFJlc291cmNlcy5tYXAoKHJlc291cmNlKSA9PiBbXG4gICAgICAgIHJlc291cmNlLmF0dHJpYnV0ZXMubmFtZSwgcmVzb3VyY2UuYXR0cmlidXRlcy5pZCxcbiAgICAgIF0pKTtcbiAgICAgIGNvbnN0IHN0b3JlZFBlcm1pc3Npb25zU2V0ID0gbmV3IE1hcChzdG9yZWRQZXJtaXNzaW9ucy5tYXAoKHBlcm0pID0+IFtcbiAgICAgICAgcGVybS5hdHRyaWJ1dGVzLm5hbWUsIHBlcm0uYXR0cmlidXRlcy5pZCxcbiAgICAgIF0pKTtcbiAgICAgIGNvbnN0IHJvbGUgPSBSb2xlLmZvcmdlKHsgbmFtZSwgZGVzY3JpcHRpb24gfSk7XG5cbiAgICAgIGF3YWl0IHJvbGUuc2F2ZSgpO1xuXG4gICAgICBjb25zdCByb2xlSGFzUGVybXMgPSBwZXJtaXNzaW9ucy5tYXAoKHJlc291cmNlKSA9PiByZXNvdXJjZS5wZXJtaXNzaW9ucy5tYXAoKHBlcm0pID0+ICh7XG4gICAgICAgIHJvbGVfaWQ6IHJvbGUuaWQsXG4gICAgICAgIHJlc291cmNlX2lkOiBzdG9yZWRSZXNvdXJjZXNTZXQuZ2V0KHJlc291cmNlLnJlc291cmNlX3NsdWcpLFxuICAgICAgICBwZXJtaXNzaW9uX2lkOiBzdG9yZWRQZXJtaXNzaW9uc1NldC5nZXQocGVybSksXG4gICAgICB9KSkpO1xuXG4gICAgICBpZiAocm9sZUhhc1Blcm1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXdhaXQga25leCgncm9sZV9oYXNfcGVybWlzc2lvbnMnKS5pbnNlcnQocm9sZUhhc1Blcm1zWzBdKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGlkOiByb2xlLmdldCgnaWQnKSB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBFZGl0IHRoZSBnaXZlIHJvbGUuXG4gICAqL1xuICBlZGl0Um9sZToge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCduYW1lJykuZXhpc3RzKCkudHJpbSgpLmVzY2FwZSgpLFxuICAgICAgY2hlY2soJ2Rlc2NyaXB0aW9uJykub3B0aW9uYWwoKS50cmltKCkuZXNjYXBlKCksXG4gICAgICBjaGVjaygncGVybWlzc2lvbnMnKS5pc0FycmF5KHsgbWluOiAwIH0pLFxuICAgICAgY2hlY2soJ3Blcm1pc3Npb25zLioucmVzb3VyY2Vfc2x1ZycpLmV4aXN0cygpLndoaXRlbGlzdCgnXlthLXowLTldKyg/Oi1bYS16MC05XSspKiQnKSxcbiAgICAgIGNoZWNrKCdwZXJtaXNzaW9ucy4qLnBlcm1pc3Npb25zJykuaXNBcnJheSh7IG1pbjogMSB9KSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCByb2xlID0gYXdhaXQgUm9sZS53aGVyZSgnaWQnLCBpZCkuZmV0Y2goKTtcblxuICAgICAgaWYgKCFyb2xlKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnUk9MRV9OT1RfRk9VTkQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7IHBlcm1pc3Npb25zIH0gPSByZXEuYm9keTtcbiAgICAgIGNvbnN0IGVycm9yUmVhc29ucyA9IFtdO1xuICAgICAgY29uc3QgcGVybWlzc2lvbnNTbHVncyA9IFtdO1xuICAgICAgY29uc3Qgbm90Rm91bmRQZXJtaXNzaW9ucyA9IFtdO1xuXG4gICAgICBjb25zdCByZXNvdXJjZXNTbHVncyA9IHBlcm1pc3Npb25zLm1hcCgocGVybSkgPT4gcGVybS5yZXNvdXJjZV9zbHVnKTtcbiAgICAgIGNvbnN0IHJlc291cmNlc05vdEZvdW5kID0gZmluZE5vdEZvdW5kUmVzb3VyY2VzKHJlc291cmNlc1NsdWdzKTtcblxuICAgICAgaWYgKHJlc291cmNlc05vdEZvdW5kLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdSRVNPVVJDRV9TTFVHX05PVF9GT1VORCcsXG4gICAgICAgICAgY29kZTogMTAwLFxuICAgICAgICAgIHJlc291cmNlczogcmVzb3VyY2VzTm90Rm91bmQsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBwZXJtaXNzaW9ucy5mb3JFYWNoKChwZXJtKSA9PiB7XG4gICAgICAgIGNvbnN0IGFiaWxpdGllcyA9IHBlcm0ucGVybWlzc2lvbnMubWFwKChhYmlsaXR5KSA9PiBhYmlsaXR5KTtcbiAgICAgICAgLy8gR2V0cyB0aGUgbm90IGZvdW5kIHBlcm1pc3Npb25zIGluIHRoZSBzY2hlbWEuXG4gICAgICAgIGNvbnN0IG5vdEZvdW5kQWJpbGl0aWVzID0gZmluZE5vdEZvdW5kUGVybWlzc2lvbnMoYWJpbGl0aWVzLCBwZXJtLnJlc291cmNlX3NsdWcpO1xuXG4gICAgICAgIGlmIChub3RGb3VuZEFiaWxpdGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgbm90Rm91bmRQZXJtaXNzaW9ucy5wdXNoKHtcbiAgICAgICAgICAgIHJlc291cmNlX3NsdWc6IHBlcm0ucmVzb3VyY2Vfc2x1ZywgcGVybWlzc2lvbnM6IG5vdEZvdW5kQWJpbGl0aWVzLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHBlcm1zID0gcGVybS5wZXJtaXNzaW9ucyB8fCBbXTtcbiAgICAgICAgICBwZXJtcy5mb3JFYWNoKChwZXJtaXNzaW9uKSA9PiB7XG4gICAgICAgICAgICBpZiAocGVybXMuaW5kZXhPZihwZXJtaXNzaW9uKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgcGVybWlzc2lvbnNTbHVncy5wdXNoKHBlcm1pc3Npb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKG5vdEZvdW5kUGVybWlzc2lvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ1BFUk1JU1NJT05TX1NMVUdfTk9UX0ZPVU5EJyxcbiAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgcGVybWlzc2lvbnM6IG5vdEZvdW5kUGVybWlzc2lvbnMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGVycm9yUmVhc29ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5iYWRSZXF1ZXN0KG51bGwsIHsgZXJyb3JzOiBlcnJvclJlYXNvbnMgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFBlcm1pc3Npb25zLlxuICAgICAgY29uc3QgW3Jlc291cmNlc0NvbGxlY3Rpb24sIHBlcm1zQ29sbGVjdGlvbl0gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIFJlc291cmNlLnF1ZXJ5KChxdWVyeSkgPT4geyBxdWVyeS53aGVyZUluKCduYW1lJywgcmVzb3VyY2VzU2x1Z3MpOyB9KS5mZXRjaEFsbCgpLFxuICAgICAgICBQZXJtaXNzaW9uLnF1ZXJ5KChxdWVyeSkgPT4geyBxdWVyeS53aGVyZUluKCduYW1lJywgcGVybWlzc2lvbnNTbHVncyk7IH0pLmZldGNoQWxsKCksXG4gICAgICBdKTtcblxuICAgICAgY29uc3Qgbm90U3RvcmVkUmVzb3VyY2VzID0gZGlmZmVyZW5jZShcbiAgICAgICAgcmVzb3VyY2VzU2x1Z3MsIHJlc291cmNlc0NvbGxlY3Rpb24ubWFwKChzKSA9PiBzLm5hbWUpLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IG5vdFN0b3JlZFBlcm1pc3Npb25zID0gZGlmZmVyZW5jZShcbiAgICAgICAgcGVybWlzc2lvbnNTbHVncywgcGVybXNDb2xsZWN0aW9uLm1hcCgocGVybSkgPT4gcGVybS5zbHVnKSxcbiAgICAgICk7XG4gICAgICBjb25zdCBpbnNlcnRUaHJlYWQgPSBbXTtcblxuICAgICAgaWYgKG5vdFN0b3JlZFJlc291cmNlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGluc2VydFRocmVhZC5wdXNoKGtuZXgoJ3Jlc291cmNlcycpLmluc2VydChbXG4gICAgICAgICAgLi4ubm90U3RvcmVkUmVzb3VyY2VzLm1hcCgocmVzb3VyY2UpID0+ICh7IG5hbWU6IHJlc291cmNlIH0pKSxcbiAgICAgICAgXSkpO1xuICAgICAgfVxuICAgICAgaWYgKG5vdFN0b3JlZFBlcm1pc3Npb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaW5zZXJ0VGhyZWFkLnB1c2goa25leCgncGVybWlzc2lvbnMnKS5pbnNlcnQoW1xuICAgICAgICAgIC4uLm5vdFN0b3JlZFBlcm1pc3Npb25zLm1hcCgocGVybWlzc2lvbikgPT4gKHsgbmFtZTogcGVybWlzc2lvbiB9KSksXG4gICAgICAgIF0pKTtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoaW5zZXJ0VGhyZWFkKTtcblxuICAgICAgY29uc3QgW3N0b3JlZFBlcm1pc3Npb25zLCBzdG9yZWRSZXNvdXJjZXNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBQZXJtaXNzaW9uLnF1ZXJ5KChxKSA9PiB7IHEud2hlcmVJbignbmFtZScsIHBlcm1pc3Npb25zU2x1Z3MpOyB9KS5mZXRjaEFsbCgpLFxuICAgICAgICBSZXNvdXJjZS5xdWVyeSgocSkgPT4geyBxLndoZXJlSW4oJ25hbWUnLCByZXNvdXJjZXNTbHVncyk7IH0pLmZldGNoQWxsKCksXG4gICAgICBdKTtcblxuICAgICAgY29uc3Qgc3RvcmVkUmVzb3VyY2VzU2V0ID0gbmV3IE1hcChzdG9yZWRSZXNvdXJjZXMubWFwKChyZXNvdXJjZSkgPT4gW1xuICAgICAgICByZXNvdXJjZS5hdHRyaWJ1dGVzLm5hbWUsIHJlc291cmNlLmF0dHJpYnV0ZXMuaWQsXG4gICAgICBdKSk7XG4gICAgICBjb25zdCBzdG9yZWRQZXJtaXNzaW9uc1NldCA9IG5ldyBNYXAoc3RvcmVkUGVybWlzc2lvbnMubWFwKChwZXJtKSA9PiBbXG4gICAgICAgIHBlcm0uYXR0cmlidXRlcy5uYW1lLCBwZXJtLmF0dHJpYnV0ZXMuaWQsXG4gICAgICBdKSk7XG5cbiAgICAgIGF3YWl0IHJvbGUuc2F2ZSgpO1xuXG5cbiAgICAgIGNvbnN0IHNhdmVkUm9sZUhhc1Blcm1zID0gYXdhaXQga25leCgncm9sZV9oYXNfcGVybWlzc2lvbnMnKS53aGVyZSh7XG4gICAgICAgIHJvbGVfaWQ6IHJvbGUuaWQsXG4gICAgICB9KTtcblxuICAgICAgY29uc29sZS5sb2coc2F2ZWRSb2xlSGFzUGVybXMpO1xuXG4gICAgICAvLyBjb25zdCByb2xlSGFzUGVybXMgPSBwZXJtaXNzaW9ucy5tYXAoKHJlc291cmNlKSA9PiByZXNvdXJjZS5wZXJtaXNzaW9ucy5tYXAoKHBlcm0pID0+ICh7XG4gICAgICAvLyAgIHJvbGVfaWQ6IHJvbGUuaWQsXG4gICAgICAvLyAgIHJlc291cmNlX2lkOiBzdG9yZWRSZXNvdXJjZXNTZXQuZ2V0KHJlc291cmNlLnJlc291cmNlX3NsdWcpLFxuICAgICAgLy8gICBwZXJtaXNzaW9uX2lkOiBzdG9yZWRQZXJtaXNzaW9uc1NldC5nZXQocGVybSksXG4gICAgICAvLyB9KSkpO1xuXG4gICAgICAvLyBpZiAocm9sZUhhc1Blcm1zLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vICAgYXdhaXQga25leCgncm9sZV9oYXNfcGVybWlzc2lvbnMnKS5pbnNlcnQocm9sZUhhc1Blcm1zWzBdKTtcbiAgICAgIC8vIH1cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGlkOiByb2xlLmdldCgnaWQnKSB9KTtcbiAgICB9LFxuICB9LFxuXG4gIGRlbGV0ZVJvbGU6IHtcbiAgICB2YWxpZGF0aW9uOiBbXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3Qgcm9sZSA9IGF3YWl0IFJvbGUud2hlcmUoJ2lkJywgaWQpLmZldGNoKCk7XG5cbiAgICAgIGlmICghcm9sZSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQoKTtcbiAgICAgIH1cbiAgICAgIGlmIChyb2xlLmF0dHJpYnV0ZXMucHJlZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkUmVxdWVzdChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnUk9MRV9QUkVERUZJTkVEJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgYXdhaXQga25leCgncm9sZV9oYXNfcGVybWlzc2lvbnMnKVxuICAgICAgICAud2hlcmUoJ3JvbGVfaWQnLCByb2xlLmlkKS5kZWxldGUoeyByZXF1aXJlOiBmYWxzZSB9KTtcblxuICAgICAgYXdhaXQgcm9sZS5kZXN0cm95KCk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCgpO1xuICAgIH0sXG4gIH0sXG5cbiAgZ2V0Um9sZToge1xuICAgIHZhbGlkYXRpb246IFtdLFxuICAgIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCgpO1xuICAgIH0sXG4gIH0sXG59O1xuIiwiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICByb3V0ZXIoKSB7XG4gICAgY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG59O1xuIiwiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQge1xuICBjaGVjayxcbiAgcXVlcnksXG4gIHBhcmFtLFxuICB2YWxpZGF0aW9uUmVzdWx0LFxufSBmcm9tICdleHByZXNzLXZhbGlkYXRvcic7XG5pbXBvcnQgVXNlciBmcm9tICdAL21vZGVscy9Vc2VyJztcbmltcG9ydCBhc3luY01pZGRsZXdhcmUgZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvYXN5bmNNaWRkbGV3YXJlJztcbmltcG9ydCBqd3RBdXRoIGZyb20gJ0AvaHR0cC9taWRkbGV3YXJlL2p3dEF1dGgnO1xuaW1wb3J0IEF1dGhvcml6YXRpb24gZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvYXV0aG9yaXphdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICAvKipcbiAgICogUm91dGVyIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG4gICAgLy8gY29uc3QgcGVybWl0ID0gQXV0aG9yaXphdGlvbigndXNlcnMnKTtcblxuICAgIHJvdXRlci51c2Uoand0QXV0aCk7XG5cbiAgICByb3V0ZXIucG9zdCgnLycsXG4gICAgICAvLyBwZXJtaXQoJ2NyZWF0ZScpLFxuICAgICAgdGhpcy5uZXdVc2VyLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5uZXdVc2VyLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCcvOmlkJyxcbiAgICAgIC8vIHBlcm1pdCgnY3JlYXRlJywgJ2VkaXQnKSxcbiAgICAgIHRoaXMuZWRpdFVzZXIudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmVkaXRVc2VyLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5nZXQoJy8nLFxuICAgICAgLy8gcGVybWl0KCd2aWV3JyksXG4gICAgICB0aGlzLmxpc3RVc2Vycy52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMubGlzdFVzZXJzLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5nZXQoJy86aWQnLFxuICAgICAgLy8gcGVybWl0KCd2aWV3JyksXG4gICAgICB0aGlzLmdldFVzZXIudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLmdldFVzZXIuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmRlbGV0ZSgnLzppZCcsXG4gICAgICAvLyBwZXJtaXQoJ2NyZWF0ZScsICdlZGl0JywgJ2RlbGV0ZScpLFxuICAgICAgdGhpcy5kZWxldGVVc2VyLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5kZWxldGVVc2VyLmhhbmRsZXIpKTtcblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgdXNlci5cbiAgICovXG4gIG5ld1VzZXI6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBjaGVjaygnZmlyc3RfbmFtZScpLnRyaW0oKS5lc2NhcGUoKS5leGlzdHMoKSxcbiAgICAgIGNoZWNrKCdsYXN0X25hbWUnKS50cmltKCkuZXNjYXBlKCkuZXhpc3RzKCksXG4gICAgICBjaGVjaygnZW1haWwnKS5leGlzdHMoKS5pc0VtYWlsKCksXG4gICAgICBjaGVjaygncGhvbmVfbnVtYmVyJykub3B0aW9uYWwoKS5pc01vYmlsZVBob25lKCksXG4gICAgICBjaGVjaygncGFzc3dvcmQnKS5pc0xlbmd0aCh7IG1pbjogNCB9KS5leGlzdHMoKS5jdXN0b20oKHZhbHVlLCB7IHJlcSB9KSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gcmVxLmJvZHkuY29uZmlybV9wYXNzd29yZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBhc3N3b3JkcyBkb24ndCBtYXRjaFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgY2hlY2soJ3N0YXR1cycpLmV4aXN0cygpLmlzQm9vbGVhbigpLnRvQm9vbGVhbigpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcblxuICAgICAgaWYgKCF2YWxpZGF0aW9uRXJyb3JzLmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkRGF0YShudWxsLCB7XG4gICAgICAgICAgY29kZTogJ3ZhbGlkYXRpb25fZXJyb3InLCAuLi52YWxpZGF0aW9uRXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHsgZW1haWwsIHBob25lX251bWJlcjogcGhvbmVOdW1iZXIgfSA9IHJlcS5ib2R5O1xuXG4gICAgICBjb25zdCBmb3VuZFVzZXJzID0gYXdhaXQgVXNlci5xdWVyeSgpXG4gICAgICAgIC53aGVyZSgnZW1haWwnLCBlbWFpbClcbiAgICAgICAgLm9yV2hlcmUoJ3Bob25lX251bWJlcicsIHBob25lTnVtYmVyKTtcblxuICAgICAgY29uc3QgZm91bmRVc2VyRW1haWwgPSBmb3VuZFVzZXJzLmZpbmQoKHUpID0+IHUuZW1haWwgPT09IGVtYWlsKTtcbiAgICAgIGNvbnN0IGZvdW5kVXNlclBob25lID0gZm91bmRVc2Vycy5maW5kKCh1KSA9PiB1LnBob25lTnVtYmVyID09PSBwaG9uZU51bWJlcik7XG5cbiAgICAgIGNvbnN0IGVycm9yUmVhc29ucyA9IFtdO1xuXG4gICAgICBpZiAoZm91bmRVc2VyRW1haWwpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnRU1BSUxfQUxSRUFEWV9FWElTVCcsIGNvZGU6IDEwMCB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZFVzZXJQaG9uZSkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdQSE9ORV9OVU1CRVJfQUxSRUFEWV9FWElTVCcsIGNvZGU6IDEyMCB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChlcnJvclJlYXNvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkUmVxdWVzdChudWxsLCB7IGVycm9yczogZXJyb3JSZWFzb25zIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB1c2VyID0gYXdhaXQgVXNlci5xdWVyeSgpLmluc2VydCh7XG4gICAgICAgIGZpcnN0X25hbWU6IHJlcS5ib2R5LmZpcnN0X25hbWUsXG4gICAgICAgIGxhc3RfbmFtZTogcmVxLmJvZHkubGFzdF9uYW1lLFxuICAgICAgICBlbWFpbDogcmVxLmJvZHkuZW1haWwsXG4gICAgICAgIHBob25lX251bWJlcjogcmVxLmJvZHkucGhvbmVfbnVtYmVyLFxuICAgICAgICBhY3RpdmU6IHJlcS5ib2R5LnN0YXR1cyxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyB1c2VyIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIEVkaXQgZGV0YWlscyBvZiB0aGUgZ2l2ZW4gdXNlci5cbiAgICovXG4gIGVkaXRVc2VyOiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ2lkJykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICAgIGNoZWNrKCdmaXJzdF9uYW1lJykuZXhpc3RzKCksXG4gICAgICBjaGVjaygnbGFzdF9uYW1lJykuZXhpc3RzKCksXG4gICAgICBjaGVjaygnZW1haWwnKS5leGlzdHMoKS5pc0VtYWlsKCksXG4gICAgICBjaGVjaygncGhvbmVfbnVtYmVyJykub3B0aW9uYWwoKS5pc01vYmlsZVBob25lKCksXG4gICAgICBjaGVjaygncGFzc3dvcmQnKS5pc0xlbmd0aCh7IG1pbjogNCB9KS5leGlzdHMoKS5jdXN0b20oKHZhbHVlLCB7IHJlcSB9KSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gcmVxLmJvZHkuY29uZmlybV9wYXNzd29yZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBhc3N3b3JkcyBkb24ndCBtYXRjaFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgY2hlY2soJ3N0YXR1cycpLmV4aXN0cygpLmlzQm9vbGVhbigpLnRvQm9vbGVhbigpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgeyBpZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCB1c2VyID0gYXdhaXQgVXNlci5xdWVyeSgpLndoZXJlKCdpZCcsIGlkKS5maXJzdCgpO1xuXG4gICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKCk7XG4gICAgICB9XG4gICAgICBjb25zdCB7IGVtYWlsLCBwaG9uZV9udW1iZXI6IHBob25lTnVtYmVyIH0gPSByZXEuYm9keTtcblxuICAgICAgY29uc3QgZm91bmRVc2VycyA9IGF3YWl0IFVzZXIucXVlcnkoKVxuICAgICAgICAud2hlcmVOb3QoJ2lkJywgaWQpXG4gICAgICAgIC5hbmRXaGVyZSgocSkgPT4ge1xuICAgICAgICAgIHEud2hlcmUoJ2VtYWlsJywgZW1haWwpO1xuICAgICAgICAgIHEub3JXaGVyZSgncGhvbmVfbnVtYmVyJywgcGhvbmVOdW1iZXIpO1xuICAgICAgICB9KTtcblxuICAgICAgY29uc3QgZm91bmRVc2VyRW1haWwgPSBmb3VuZFVzZXJzLmZpbmQoKHUpID0+IHUuZW1haWwgPT09IGVtYWlsKTtcbiAgICAgIGNvbnN0IGZvdW5kVXNlclBob25lID0gZm91bmRVc2Vycy5maW5kKCh1KSA9PiB1LnBob25lTnVtYmVyID09PSBwaG9uZU51bWJlcik7XG5cbiAgICAgIGNvbnN0IGVycm9yUmVhc29ucyA9IFtdO1xuXG4gICAgICBpZiAoZm91bmRVc2VyRW1haWwpIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnRU1BSUxfQUxSRUFEWV9FWElTVCcsIGNvZGU6IDEwMCB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZFVzZXJQaG9uZSkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdQSE9ORV9OVU1CRVJfQUxSRUFEWV9FWElTVCcsIGNvZGU6IDEyMCB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChlcnJvclJlYXNvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkUmVxdWVzdChudWxsLCB7IGVycm9yczogZXJyb3JSZWFzb25zIH0pO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCBVc2VyLnF1ZXJ5KCkud2hlcmUoJ2lkJywgaWQpLnVwZGF0ZSh7XG4gICAgICAgIGZpcnN0X25hbWU6IHJlcS5ib2R5LmZpcnN0X25hbWUsXG4gICAgICAgIGxhc3RfbmFtZTogcmVxLmJvZHkubGFzdF9uYW1lLFxuICAgICAgICBlbWFpbDogcmVxLmJvZHkuZW1haWwsXG4gICAgICAgIHBob25lX251bWJlcjogcmVxLmJvZHkucGhvbmVfbnVtYmVyLFxuICAgICAgICBhY3RpdmU6IHJlcS5ib2R5LnN0YXR1cyxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKCk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogU29mdCBkZWxldGluZyB0aGUgZ2l2ZW4gdXNlci5cbiAgICovXG4gIGRlbGV0ZVVzZXI6IHtcbiAgICB2YWxpZGF0aW9uOiBbXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgdXNlciA9IGF3YWl0IFVzZXIucXVlcnkoKS53aGVyZSgnaWQnLCBpZCkuZmlyc3QoKTtcblxuICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnVVNFUl9OT1RfRk9VTkQnLCBjb2RlOiAxMDAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgYXdhaXQgVXNlci5xdWVyeSgpLndoZXJlKCdpZCcsIGlkKS5kZWxldGUoKTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKCk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgdXNlciBkZXRhaWxzIG9mIHRoZSBnaXZlbiB1c2VyIGlkLlxuICAgKi9cbiAgZ2V0VXNlcjoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCdpZCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgdXNlciA9IGF3YWl0IFVzZXIucXVlcnkoKS53aGVyZSgnaWQnLCBpZCkuZmlyc3QoKTtcblxuICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgdXNlciB9KTtcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgbGlzdCBvZiB1c2Vycy5cbiAgICovXG4gIGxpc3RVc2Vyczoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHF1ZXJ5KCdwYWdlX3NpemUnKS5vcHRpb25hbCgpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBxdWVyeSgncGFnZScpLm9wdGlvbmFsKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IGZpbHRlciA9IHtcbiAgICAgICAgZmlyc3RfbmFtZTogJycsXG4gICAgICAgIGxhc3RfbmFtZTogJycsXG4gICAgICAgIGVtYWlsOiAnJyxcbiAgICAgICAgcGhvbmVfbnVtYmVyOiAnJyxcblxuICAgICAgICBwYWdlX3NpemU6IDEwLFxuICAgICAgICBwYWdlOiAxLFxuICAgICAgICAuLi5yZXEucXVlcnksXG4gICAgICB9O1xuXG4gICAgICBjb25zdCB1c2VycyA9IGF3YWl0IFVzZXIucXVlcnkoKVxuICAgICAgICAucGFnZShmaWx0ZXIucGFnZSAtIDEsIGZpbHRlci5wYWdlX3NpemUpO1xuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyB1c2VycyB9KTtcbiAgICB9LFxuICB9LFxufTtcbiIsImltcG9ydCB7IGRpZmZlcmVuY2UsIHBpY2sgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQge1xuICBjaGVjayxcbiAgcXVlcnksXG4gIHBhcmFtLFxuICBvbmVPZixcbiAgdmFsaWRhdGlvblJlc3VsdCxcbn0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InO1xuaW1wb3J0IGFzeW5jTWlkZGxld2FyZSBmcm9tICdAL2h0dHAvbWlkZGxld2FyZS9hc3luY01pZGRsZXdhcmUnO1xuaW1wb3J0IGp3dEF1dGggZnJvbSAnQC9odHRwL21pZGRsZXdhcmUvand0QXV0aCc7XG5pbXBvcnQgUmVzb3VyY2UgZnJvbSAnQC9tb2RlbHMvUmVzb3VyY2UnO1xuaW1wb3J0IFZpZXcgZnJvbSAnQC9tb2RlbHMvVmlldyc7XG5pbXBvcnQgVmlld1JvbGUgZnJvbSAnQC9tb2RlbHMvVmlld1JvbGUnO1xuaW1wb3J0IFZpZXdDb2x1bW4gZnJvbSAnQC9tb2RlbHMvVmlld0NvbHVtbic7XG5pbXBvcnQge1xuICB2YWxpZGF0ZVZpZXdMb2dpY0V4cHJlc3Npb24sXG59IGZyb20gJ0AvbGliL1ZpZXdSb2xlc0J1aWxkZXInO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHJlc291cmNlOiAnaXRlbXMnLFxuXG4gIC8qKlxuICAgKiBSb3V0ZXIgY29uc3RydWN0b3IuXG4gICAqL1xuICByb3V0ZXIoKSB7XG4gICAgY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcblxuICAgIHJvdXRlci51c2Uoand0QXV0aCk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvJyxcbiAgICAgIHRoaXMubGlzdFZpZXdzLnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5saXN0Vmlld3MuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLnBvc3QoJy8nLFxuICAgICAgdGhpcy5jcmVhdGVWaWV3LnZhbGlkYXRpb24sXG4gICAgICBhc3luY01pZGRsZXdhcmUodGhpcy5jcmVhdGVWaWV3LmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCcvOnZpZXdfaWQnLFxuICAgICAgdGhpcy5lZGl0Vmlldy52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZWRpdFZpZXcuaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLmRlbGV0ZSgnLzp2aWV3X2lkJyxcbiAgICAgIHRoaXMuZGVsZXRlVmlldy52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZGVsZXRlVmlldy5oYW5kbGVyKSk7XG5cbiAgICByb3V0ZXIuZ2V0KCcvOnZpZXdfaWQnLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMuZ2V0Vmlldy5oYW5kbGVyKSk7XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9LFxuXG4gIC8qKlxuICAgKiBMaXN0IGFsbCB2aWV3cyB0aGF0IGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gcmVzb3VyY2UuXG4gICAqL1xuICBsaXN0Vmlld3M6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBvbmVPZihbXG4gICAgICAgIHF1ZXJ5KCdyZXNvdXJjZV9uYW1lJykuZXhpc3RzKCkudHJpbSgpLmVzY2FwZSgpLFxuICAgICAgXSwgW1xuICAgICAgICBxdWVyeSgncmVzb3VyY2VfaWQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgXSksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCBmaWx0ZXIgPSB7IC4uLnJlcS5xdWVyeSB9O1xuXG4gICAgICBjb25zdCByZXNvdXJjZSA9IGF3YWl0IFJlc291cmNlLnF1ZXJ5KCkub25CdWlsZCgoYnVpbGRlcikgPT4ge1xuICAgICAgICBpZiAoZmlsdGVyLnJlc291cmNlX2lkKSB7XG4gICAgICAgICAgYnVpbGRlci53aGVyZSgnaWQnLCBmaWx0ZXIucmVzb3VyY2VfaWQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWx0ZXIucmVzb3VyY2VfbmFtZSkge1xuICAgICAgICAgIGJ1aWxkZXIud2hlcmUoJ25hbWUnLCBmaWx0ZXIucmVzb3VyY2VfbmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnVpbGRlci5maXJzdCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHZpZXdzID0gYXdhaXQgVmlldy5xdWVyeSgpLndoZXJlKCdyZXNvdXJjZV9pZCcsIHJlc291cmNlLmlkKTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgdmlld3MgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgdmlldyBkZXRhaWxzIG9mIHRoZSBnaXZlbiB2aWV3IGlkLlxuICAgKi9cbiAgZ2V0Vmlldzoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIHBhcmFtKCd2aWV3X2lkJykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHsgdmlld19pZDogdmlld0lkIH0gPSByZXEucGFyYW1zO1xuICAgICAgY29uc3QgdmlldyA9IGF3YWl0IFZpZXcucXVlcnkoKVxuICAgICAgICAud2hlcmUoJ2lkJywgdmlld0lkKVxuICAgICAgICAud2l0aEdyYXBoRmV0Y2hlZCgncmVzb3VyY2UnKVxuICAgICAgICAud2l0aEdyYXBoRmV0Y2hlZCgnY29sdW1ucycpXG4gICAgICAgIC53aXRoR3JhcGhGZXRjaGVkKCdyb2xlcy5maWVsZCcpXG4gICAgICAgIC5maXJzdCgpO1xuXG4gICAgICBpZiAoIXZpZXcpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLm5vdEZvdW5kKG51bGwsIHtcbiAgICAgICAgICBlcnJvcnM6IFt7IHR5cGU6ICdWSUVXX05PVF9GT1VORCcsIGNvZGU6IDEwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeyB2aWV3OiB2aWV3LnRvSlNPTigpIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgLyoqXG4gICAqIERlbGV0ZSB0aGUgZ2l2ZW4gdmlldyBvZiB0aGUgcmVzb3VyY2UuXG4gICAqL1xuICBkZWxldGVWaWV3OiB7XG4gICAgdmFsaWRhdGlvbjogW1xuICAgICAgcGFyYW0oJ3ZpZXdfaWQnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgeyB2aWV3X2lkOiB2aWV3SWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgICBjb25zdCB2aWV3ID0gYXdhaXQgVmlldy5xdWVyeSgpLmZpbmRCeUlkKHZpZXdJZCk7XG5cbiAgICAgIGlmICghdmlldykge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ1ZJRVdfTk9UX0ZPVU5EJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmICh2aWV3LnByZWRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZFJlcXVlc3QobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ1BSRURFRklORURfVklFVycsIGNvZGU6IDIwMCB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIHZpZXcuJHJlbGF0ZWRRdWVyeSgncm9sZXMnKS5kZWxldGUoKSxcbiAgICAgICAgdmlldy4kcmVsYXRlZFF1ZXJ5KCdjb2x1bW5zJykuZGVsZXRlKCksXG4gICAgICBdKTtcbiAgICAgIGF3YWl0IFZpZXcucXVlcnkoKS53aGVyZSgnaWQnLCB2aWV3LmlkKS5kZWxldGUoKTtcblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgaWQ6IHZpZXcuaWQgfSk7XG4gICAgfSxcbiAgfSxcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyB2aWV3LlxuICAgKi9cbiAgY3JlYXRlVmlldzoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCdyZXNvdXJjZV9uYW1lJykuZXhpc3RzKCkuZXNjYXBlKCkudHJpbSgpLFxuICAgICAgY2hlY2soJ25hbWUnKS5leGlzdHMoKS5lc2NhcGUoKS50cmltKCksXG4gICAgICBjaGVjaygnbG9naWNfZXhwcmVzc2lvbicpLmV4aXN0cygpLnRyaW0oKS5lc2NhcGUoKSxcbiAgICAgIGNoZWNrKCdyb2xlcycpLmlzQXJyYXkoeyBtaW46IDEgfSksXG4gICAgICBjaGVjaygncm9sZXMuKi5maWVsZF9rZXknKS5leGlzdHMoKS5lc2NhcGUoKS50cmltKCksXG4gICAgICBjaGVjaygncm9sZXMuKi5jb21wYXJhdG9yJykuZXhpc3RzKCksXG4gICAgICBjaGVjaygncm9sZXMuKi52YWx1ZScpLmV4aXN0cygpLFxuICAgICAgY2hlY2soJ3JvbGVzLiouaW5kZXgnKS5leGlzdHMoKS5pc051bWVyaWMoKS50b0ludCgpLFxuICAgICAgY2hlY2soJ2NvbHVtbnMnKS5leGlzdHMoKS5pc0FycmF5KHsgbWluOiAxIH0pLFxuICAgICAgY2hlY2soJ2NvbHVtbnMuKi5rZXknKS5leGlzdHMoKS5lc2NhcGUoKS50cmltKCksXG4gICAgICBjaGVjaygnY29sdW1ucy4qLmluZGV4JykuZXhpc3RzKCkuaXNOdW1lcmljKCkudG9JbnQoKSxcbiAgICBdLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmb3JtID0geyAuLi5yZXEuYm9keSB9O1xuICAgICAgY29uc3QgcmVzb3VyY2UgPSBhd2FpdCBSZXNvdXJjZS5xdWVyeSgpLndoZXJlKCduYW1lJywgZm9ybS5yZXNvdXJjZV9uYW1lKS5maXJzdCgpO1xuXG4gICAgICBpZiAoIXJlc291cmNlKSB7XG4gICAgICAgIHJldHVybiByZXMuYm9vbS5ub3RGb3VuZChudWxsLCB7XG4gICAgICAgICAgZXJyb3JzOiBbeyB0eXBlOiAnUkVTT1VSQ0VfTk9UX0ZPVU5EJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVycm9yUmVhc29ucyA9IFtdO1xuICAgICAgY29uc3QgZmllbGRzU2x1Z3MgPSBmb3JtLnJvbGVzLm1hcCgocm9sZSkgPT4gcm9sZS5maWVsZF9rZXkpO1xuXG4gICAgICBjb25zdCByZXNvdXJjZUZpZWxkcyA9IGF3YWl0IHJlc291cmNlLiRyZWxhdGVkUXVlcnkoJ2ZpZWxkcycpO1xuICAgICAgY29uc3QgcmVzb3VyY2VGaWVsZHNLZXlzID0gcmVzb3VyY2VGaWVsZHMubWFwKChmKSA9PiBmLmtleSk7XG4gICAgICBjb25zdCByZXNvdXJjZUZpZWxkc0tleXNNYXAgPSBuZXcgTWFwKHJlc291cmNlRmllbGRzLm1hcCgoZmllbGQpID0+IFtmaWVsZC5rZXksIGZpZWxkXSkpO1xuICAgICAgY29uc3QgY29sdW1uc0tleXMgPSBmb3JtLmNvbHVtbnMubWFwKChjKSA9PiBjLmtleSk7XG5cbiAgICAgIC8vIFRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIHN0b3JlZCByZXNvdXJjZSBmaWVsZHMgYW5kIHN1Ym1pdCBmaWVsZHMga2V5cy5cbiAgICAgIGNvbnN0IG5vdEZvdW5kRmllbGRzID0gZGlmZmVyZW5jZShmaWVsZHNTbHVncywgcmVzb3VyY2VGaWVsZHNLZXlzKTtcblxuICAgICAgaWYgKG5vdEZvdW5kRmllbGRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZXJyb3JSZWFzb25zLnB1c2goeyB0eXBlOiAnUkVTT1VSQ0VfRklFTERTX05PVF9FWElTVCcsIGNvZGU6IDEwMCwgZmllbGRzOiBub3RGb3VuZEZpZWxkcyB9KTtcbiAgICAgIH1cbiAgICAgIC8vIFRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIHN0b3JlZCByZXNvdXJjZSBmaWVsZHMgYW5kIHRoZSBzdWJtaXQgY29sdW1ucyBrZXlzLlxuICAgICAgY29uc3Qgbm90Rm91bmRDb2x1bW5zID0gZGlmZmVyZW5jZShjb2x1bW5zS2V5cywgcmVzb3VyY2VGaWVsZHNLZXlzKTtcblxuICAgICAgaWYgKG5vdEZvdW5kQ29sdW1ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVycm9yUmVhc29ucy5wdXNoKHsgdHlwZTogJ0NPTFVNTlNfTk9UX0VYSVNUJywgY29kZTogMjAwLCBjb2x1bW5zOiBub3RGb3VuZENvbHVtbnMgfSk7XG4gICAgICB9XG4gICAgICAvLyBWYWxpZGF0ZXMgdGhlIHZpZXcgY29uZGl0aW9uYWwgbG9naWMgZXhwcmVzc2lvbi5cbiAgICAgIGlmICghdmFsaWRhdGVWaWV3TG9naWNFeHByZXNzaW9uKGZvcm0ubG9naWNfZXhwcmVzc2lvbiwgZm9ybS5yb2xlcy5tYXAoKHIpID0+IHIuaW5kZXgpKSkge1xuICAgICAgICBlcnJvclJlYXNvbnMucHVzaCh7IHR5cGU6ICdWSUVXLlJPTEVTLkxPR0lDLkVYUFJFU1NJT04uSU5WQUxJRCcsIGNvZGU6IDQwMCB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChlcnJvclJlYXNvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20uYmFkUmVxdWVzdChudWxsLCB7IGVycm9yczogZXJyb3JSZWFzb25zIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBTYXZlIHZpZXcgZGV0YWlscy5cbiAgICAgIGNvbnN0IHZpZXcgPSBhd2FpdCBWaWV3LnF1ZXJ5KCkuaW5zZXJ0KHtcbiAgICAgICAgbmFtZTogZm9ybS5uYW1lLFxuICAgICAgICBwcmVkZWZpbmVkOiBmYWxzZSxcbiAgICAgICAgcmVzb3VyY2VfaWQ6IHJlc291cmNlLmlkLFxuICAgICAgICByb2xlc19sb2dpY19leHByZXNzaW9uOiBmb3JtLmxvZ2ljX2V4cHJlc3Npb24sXG4gICAgICB9KTtcbiAgICAgIC8vIFNhdmUgdmlldyByb2xlcyBhc3luYyBvcGVyYXRpb25zLlxuICAgICAgY29uc3Qgc2F2ZVZpZXdSb2xlc09wZXJzID0gW107XG5cbiAgICAgIGZvcm0ucm9sZXMuZm9yRWFjaCgocm9sZSkgPT4ge1xuICAgICAgICBjb25zdCBmaWVsZE1vZGVsID0gcmVzb3VyY2VGaWVsZHNLZXlzTWFwLmdldChyb2xlLmZpZWxkX2tleSk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBzYXZlVmlld1JvbGVPcGVyID0gVmlld1JvbGUucXVlcnkoKS5pbnNlcnQoe1xuICAgICAgICAgIC4uLnBpY2socm9sZSwgWydjb21wYXJhdG9yJywgJ3ZhbHVlJywgJ2luZGV4J10pLFxuICAgICAgICAgIGZpZWxkX2lkOiBmaWVsZE1vZGVsLmlkLFxuICAgICAgICAgIHZpZXdfaWQ6IHZpZXcuaWQsXG4gICAgICAgIH0pO1xuICAgICAgICBzYXZlVmlld1JvbGVzT3BlcnMucHVzaChzYXZlVmlld1JvbGVPcGVyKTtcbiAgICAgIH0pO1xuXG4gICAgICBmb3JtLmNvbHVtbnMuZm9yRWFjaCgoY29sdW1uKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpZWxkTW9kZWwgPSByZXNvdXJjZUZpZWxkc0tleXNNYXAuZ2V0KGNvbHVtbi5rZXkpO1xuXG4gICAgICAgIGNvbnN0IHNhdmVWaWV3Q29sdW1uT3BlciA9IFZpZXdDb2x1bW4ucXVlcnkoKS5pbnNlcnQoe1xuICAgICAgICAgIGZpZWxkX2lkOiBmaWVsZE1vZGVsLmlkLFxuICAgICAgICAgIHZpZXdfaWQ6IHZpZXcuaWQsXG4gICAgICAgICAgaW5kZXg6IGNvbHVtbi5pbmRleCxcbiAgICAgICAgfSk7XG4gICAgICAgIHNhdmVWaWV3Um9sZXNPcGVycy5wdXNoKHNhdmVWaWV3Q29sdW1uT3Blcik7XG4gICAgICB9KTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHNhdmVWaWV3Um9sZXNPcGVycyk7XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGlkOiB2aWV3LmlkIH0pO1xuICAgIH0sXG4gIH0sXG5cbiAgZWRpdFZpZXc6IHtcbiAgICB2YWxpZGF0aW9uOiBbXG4gICAgICBwYXJhbSgndmlld19pZCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgICBjaGVjaygnbGFiZWwnKS5leGlzdHMoKS5lc2NhcGUoKS50cmltKCksXG4gICAgICBjaGVjaygnY29sdW1ucycpLmlzQXJyYXkoeyBtaW46IDMgfSksXG4gICAgICBjaGVjaygncm9sZXMnKS5pc0FycmF5KCksXG4gICAgICBjaGVjaygncm9sZXMuKi5maWVsZCcpLmV4aXN0cygpLmVzY2FwZSgpLnRyaW0oKSxcbiAgICAgIGNoZWNrKCdyb2xlcy4qLmNvbXBhcmF0b3InKS5leGlzdHMoKSxcbiAgICAgIGNoZWNrKCdyb2xlcy4qLnZhbHVlJykuZXhpc3RzKCksXG4gICAgICBjaGVjaygncm9sZXMuKi5pbmRleCcpLmV4aXN0cygpLmlzTnVtZXJpYygpLnRvSW50KCksXG4gICAgXSxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCB7IHZpZXdfaWQ6IHZpZXdJZCB9ID0gcmVxLnBhcmFtcztcbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XG5cbiAgICAgIGlmICghdmFsaWRhdGlvbkVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5ib29tLmJhZERhdGEobnVsbCwge1xuICAgICAgICAgIGNvZGU6ICd2YWxpZGF0aW9uX2Vycm9yJywgLi4udmFsaWRhdGlvbkVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCB2aWV3ID0gYXdhaXQgVmlldy53aGVyZSgnaWQnLCB2aWV3SWQpLmZldGNoKCk7XG5cbiAgICAgIGlmICghdmlldykge1xuICAgICAgICByZXR1cm4gcmVzLmJvb20ubm90Rm91bmQobnVsbCwge1xuICAgICAgICAgIGVycm9yczogW3sgdHlwZTogJ1JPTEVfTk9UX0ZPVU5EJywgY29kZTogMTAwIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZCgpO1xuICAgIH0sXG4gIH0sXG59O1xuIiwiLy8gaW1wb3J0IE9BdXRoMiBmcm9tICdAL2h0dHAvY29udHJvbGxlcnMvT0F1dGgyJztcbmltcG9ydCBBdXRoZW50aWNhdGlvbiBmcm9tICdAL2h0dHAvY29udHJvbGxlcnMvQXV0aGVudGljYXRpb24nO1xuaW1wb3J0IFVzZXJzIGZyb20gJ0AvaHR0cC9jb250cm9sbGVycy9Vc2Vycyc7XG5pbXBvcnQgUm9sZXMgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL1JvbGVzJztcbmltcG9ydCBJdGVtcyBmcm9tICdAL2h0dHAvY29udHJvbGxlcnMvSXRlbXMnO1xuaW1wb3J0IEl0ZW1DYXRlZ29yaWVzIGZyb20gJ0AvaHR0cC9jb250cm9sbGVycy9JdGVtQ2F0ZWdvcmllcyc7XG5pbXBvcnQgQWNjb3VudHMgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL0FjY291bnRzJztcbmltcG9ydCBBY2NvdW50VHlwZXMgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL0FjY291bnRUeXBlcyc7XG5pbXBvcnQgQWNjb3VudE9wZW5pbmdCYWxhbmNlIGZyb20gJ0AvaHR0cC9jb250cm9sbGVycy9BY2NvdW50T3BlbmluZ0JhbGFuY2UnO1xuaW1wb3J0IFZpZXdzIGZyb20gJ0AvaHR0cC9jb250cm9sbGVycy9WaWV3cyc7XG5pbXBvcnQgQ3VzdG9tRmllbGRzIGZyb20gJ0AvaHR0cC9jb250cm9sbGVycy9GaWVsZHMnO1xuaW1wb3J0IEFjY291bnRpbmcgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL0FjY291bnRpbmcnO1xuaW1wb3J0IEZpbmFuY2lhbFN0YXRlbWVudHMgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL0ZpbmFuY2lhbFN0YXRlbWVudHMnO1xuaW1wb3J0IEV4cGVuc2VzIGZyb20gJ0AvaHR0cC9jb250cm9sbGVycy9FeHBlbnNlcyc7XG5pbXBvcnQgT3B0aW9ucyBmcm9tICdAL2h0dHAvY29udHJvbGxlcnMvT3B0aW9ucyc7XG5pbXBvcnQgQnVkZ2V0IGZyb20gJ0AvaHR0cC9jb250cm9sbGVycy9CdWRnZXQnO1xuaW1wb3J0IEJ1ZGdldFJlcG9ydHMgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL0J1ZGdldFJlcG9ydHMnO1xuaW1wb3J0IEN1cnJlbmNpZXMgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL0N1cnJlbmNpZXMnO1xuaW1wb3J0IEN1c3RvbWVycyBmcm9tICdAL2h0dHAvY29udHJvbGxlcnMvQ3VzdG9tZXJzJztcbmltcG9ydCBTdXBwbGllcnMgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL1N1cHBsaWVycyc7XG5pbXBvcnQgQmlsbHMgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL0JpbGxzJztcbmltcG9ydCBDdXJyZW5jeUFkanVzdG1lbnQgZnJvbSAnLi9jb250cm9sbGVycy9DdXJyZW5jeUFkanVzdG1lbnQnO1xuaW1wb3J0IFJlc291cmNlcyBmcm9tICcuL2NvbnRyb2xsZXJzL1Jlc291cmNlcyc7XG4vLyBpbXBvcnQgU2FsZXNSZXBvcnRzIGZyb20gJ0AvaHR0cC9jb250cm9sbGVycy9TYWxlc1JlcG9ydHMnO1xuLy8gaW1wb3J0IFB1cmNoYXNlc1JlcG9ydHMgZnJvbSAnQC9odHRwL2NvbnRyb2xsZXJzL1B1cmNoYXNlc1JlcG9ydHMnO1xuXG5leHBvcnQgZGVmYXVsdCAoYXBwKSA9PiB7XG4gIC8vIGFwcC51c2UoJy9hcGkvb2F1dGgyJywgT0F1dGgyLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS9hdXRoJywgQXV0aGVudGljYXRpb24ucm91dGVyKCkpO1xuICBhcHAudXNlKCcvYXBpL2N1cnJlbmNpZXMnLCBDdXJyZW5jaWVzLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS91c2VycycsIFVzZXJzLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS9yb2xlcycsIFJvbGVzLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS9hY2NvdW50cycsIEFjY291bnRzLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS9hY2NvdW50X3R5cGVzJywgQWNjb3VudFR5cGVzLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS9hY2NvdW50aW5nJywgQWNjb3VudGluZy5yb3V0ZXIoKSk7XG4gIGFwcC51c2UoJy9hcGkvYWNjb3VudHNfb3BlbmluZ19iYWxhbmNlcycsIEFjY291bnRPcGVuaW5nQmFsYW5jZS5yb3V0ZXIoKSk7XG4gIGFwcC51c2UoJy9hcGkvdmlld3MnLCBWaWV3cy5yb3V0ZXIoKSk7XG4gIGFwcC51c2UoJy9hcGkvZmllbGRzJywgQ3VzdG9tRmllbGRzLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS9pdGVtcycsIEl0ZW1zLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS9pdGVtX2NhdGVnb3JpZXMnLCBJdGVtQ2F0ZWdvcmllcy5yb3V0ZXIoKSk7XG4gIGFwcC51c2UoJy9hcGkvZXhwZW5zZXMnLCBFeHBlbnNlcy5yb3V0ZXIoKSk7XG4gIGFwcC51c2UoJy9hcGkvZmluYW5jaWFsX3N0YXRlbWVudHMnLCBGaW5hbmNpYWxTdGF0ZW1lbnRzLnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS9vcHRpb25zJywgT3B0aW9ucy5yb3V0ZXIoKSk7XG4gIGFwcC51c2UoJy9hcGkvYnVkZ2V0X3JlcG9ydHMnLCBCdWRnZXRSZXBvcnRzLnJvdXRlcigpKTtcbiAgLy8gYXBwLnVzZSgnL2FwaS9jdXN0b21lcnMnLCBDdXN0b21lcnMucm91dGVyKCkpO1xuICAvLyBhcHAudXNlKCcvYXBpL3N1cHBsaWVycycsIFN1cHBsaWVycy5yb3V0ZXIoKSk7XG4gIC8vIGFwcC51c2UoJy9hcGkvYmlsbHMnLCBCaWxscy5yb3V0ZXIoKSk7XG4gIGFwcC51c2UoJy9hcGkvYnVkZ2V0JywgQnVkZ2V0LnJvdXRlcigpKTtcbiAgYXBwLnVzZSgnL2FwaS9yZXNvdXJjZXMnLCBSZXNvdXJjZXMucm91dGVyKCkpO1xuICAvLyBhcHAudXNlKCcvYXBpL2N1cnJlbmN5X2FkanVzdG1lbnQnLCBDdXJyZW5jeUFkanVzdG1lbnQucm91dGVyKCkpO1xuICAvLyBhcHAudXNlKCcvYXBpL3JlcG9ydHMvc2FsZXMnLCBTYWxlc1JlcG9ydHMucm91dGVyKCkpO1xuICAvLyBhcHAudXNlKCcvYXBpL3JlcG9ydHMvcHVyY2hhc2VzJywgUHVyY2hhc2VzUmVwb3J0cy5yb3V0ZXIoKSk7XG59O1xuIiwiY29uc3QgYXN5bmNNaWRkbGV3YXJlID0gKGZuKSA9PiAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgUHJvbWlzZS5yZXNvbHZlKGZuKHJlcSwgcmVzLCBuZXh0KSlcbiAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICBuZXh0KGVycm9yKTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jTWlkZGxld2FyZTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIGNvbnNpc3RlbnQtcmV0dXJuICovXG5jb25zdCBhdXRob3JpemF0aW9uID0gKHJlc291cmNlTmFtZSkgPT4gKC4uLnBlcm1pc3Npb25zKSA9PiAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgY29uc3QgeyB1c2VyIH0gPSByZXE7XG4gIGNvbnN0IG9uRXJyb3IgPSAoKSA9PiB7XG4gICAgcmVzLmJvb20udW5hdXRob3JpemVkKCk7XG4gIH07XG4gIHVzZXIuaGFzUGVybWlzc2lvbnMocmVzb3VyY2VOYW1lLCBwZXJtaXNzaW9ucylcbiAgICAudGhlbigoYXV0aG9yaXplZCkgPT4ge1xuICAgICAgaWYgKCFhdXRob3JpemVkKSB7XG4gICAgICAgIHJldHVybiBvbkVycm9yKCk7XG4gICAgICB9XG4gICAgICBuZXh0KCk7XG4gICAgfSkuY2F0Y2gob25FcnJvcik7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhdXRob3JpemF0aW9uO1xuIiwiLyogZXNsaW50LWRpc2FibGUgY29uc2lzdGVudC1yZXR1cm4gKi9cbmltcG9ydCBqd3QgZnJvbSAnanNvbndlYnRva2VuJztcbmltcG9ydCBVc2VyIGZyb20gJ0AvbW9kZWxzL1VzZXInO1xuLy8gaW1wb3J0IEF1dGggZnJvbSAnQC9tb2RlbHMvQXV0aCc7XG5cbmNvbnN0IGF1dGhNaWRkbGV3YXJlID0gKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gIGNvbnN0IHsgSldUX1NFQ1JFVF9LRVkgfSA9IHByb2Nlc3MuZW52O1xuICBjb25zdCB0b2tlbiA9IHJlcS5oZWFkZXJzWyd4LWFjY2Vzcy10b2tlbiddIHx8IHJlcS5xdWVyeS50b2tlbjtcblxuICBjb25zdCBvbkVycm9yID0gKCkgPT4ge1xuICAgIC8vIEF1dGgubG9nZ2VkT3V0KCk7XG4gICAgcmVzLnN0YXR1cyg0MDEpLnNlbmQoe1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBtZXNzYWdlOiAndW5hdXRob3JpemVkJyxcbiAgICB9KTtcbiAgfTtcblxuICBpZiAoIXRva2VuKSB7XG4gICAgcmV0dXJuIG9uRXJyb3IoKTtcbiAgfVxuXG4gIGNvbnN0IHZlcmlmeSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBqd3QudmVyaWZ5KHRva2VuLCBKV1RfU0VDUkVUX0tFWSwgYXN5bmMgKGVycm9yLCBkZWNvZGVkKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlcnNjb3JlLWRhbmdsZVxuICAgICAgICByZXEudXNlciA9IGF3YWl0IFVzZXIucXVlcnkoKS5maW5kQnlJZChkZWNvZGVkLl9pZCk7XG4gICAgICAgIC8vIEF1dGguc2V0QXV0aGVudGljYXRlZFVzZXIocmVxLnVzZXIpO1xuXG4gICAgICAgIGlmICghcmVxLnVzZXIpIHtcbiAgICAgICAgICByZXR1cm4gb25FcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUoZGVjb2RlZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHZlcmlmeS50aGVuKCgpID0+IHsgbmV4dCgpOyB9KS5jYXRjaChvbkVycm9yKTtcbn07XG5leHBvcnQgZGVmYXVsdCBhdXRoTWlkZGxld2FyZTtcbiIsIlxuY29uc3QgT3BlcmF0aW9uVHlwZSA9IHtcbiAgTE9HSUM6ICdMT0dJQycsXG4gIFNUUklORzogJ1NUUklORycsXG4gIENPTVBBUklTT046ICdDT01QQVJJU09OJyxcbiAgTUFUSDogJ01BVEgnLFxufTtcblxuZXhwb3J0IGNsYXNzIExleGVyIHtcbiAgLy8gb3BlcmF0aW9uIHRhYmxlXG4gIHN0YXRpYyBnZXQgb3B0YWJsZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJz0nOiBPcGVyYXRpb25UeXBlLkxPR0lDLFxuICAgICAgJyYnOiBPcGVyYXRpb25UeXBlLkxPR0lDLFxuICAgICAgJ3wnOiBPcGVyYXRpb25UeXBlLkxPR0lDLFxuICAgICAgJz8nOiBPcGVyYXRpb25UeXBlLkxPR0lDLFxuICAgICAgJzonOiBPcGVyYXRpb25UeXBlLkxPR0lDLFxuXG4gICAgICAnXFwnJzogT3BlcmF0aW9uVHlwZS5TVFJJTkcsXG4gICAgICAnXCInOiBPcGVyYXRpb25UeXBlLlNUUklORyxcblxuICAgICAgJyEnOiBPcGVyYXRpb25UeXBlLkNPTVBBUklTT04sXG4gICAgICAnPic6IE9wZXJhdGlvblR5cGUuQ09NUEFSSVNPTixcbiAgICAgICc8JzogT3BlcmF0aW9uVHlwZS5DT01QQVJJU09OLFxuXG4gICAgICAnKCc6IE9wZXJhdGlvblR5cGUuTUFUSCxcbiAgICAgICcpJzogT3BlcmF0aW9uVHlwZS5NQVRILFxuICAgICAgJysnOiBPcGVyYXRpb25UeXBlLk1BVEgsXG4gICAgICAnLSc6IE9wZXJhdGlvblR5cGUuTUFUSCxcbiAgICAgICcqJzogT3BlcmF0aW9uVHlwZS5NQVRILFxuICAgICAgJy8nOiBPcGVyYXRpb25UeXBlLk1BVEgsXG4gICAgICAnJSc6IE9wZXJhdGlvblR5cGUuTUFUSCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7Kn0gZXhwcmVzc2lvbiAtXG4gICAqL1xuICBjb25zdHJ1Y3RvcihleHByZXNzaW9uKSB7XG4gICAgdGhpcy5jdXJyZW50SW5kZXggPSAwO1xuICAgIHRoaXMuaW5wdXQgPSBleHByZXNzaW9uO1xuICAgIHRoaXMudG9rZW5MaXN0ID0gW107XG4gIH1cblxuICBnZXRUb2tlbnMoKSB7XG4gICAgbGV0IHRvaztcbiAgICBkbyB7XG4gICAgICAvLyByZWFkIGN1cnJlbnQgdG9rZW4sIHNvIHN0ZXAgc2hvdWxkIGJlIC0xXG4gICAgICB0b2sgPSB0aGlzLnBpY2tOZXh0KC0xKTtcbiAgICAgIGNvbnN0IHBvcyA9IHRoaXMuY3VycmVudEluZGV4O1xuICAgICAgc3dpdGNoIChMZXhlci5vcHRhYmxlW3Rva10pIHtcbiAgICAgICAgY2FzZSBPcGVyYXRpb25UeXBlLkxPR0lDOlxuICAgICAgICAgIC8vID09ICYmIHx8ID09PVxuICAgICAgICAgIHRoaXMucmVhZExvZ2ljT3B0KHRvayk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBPcGVyYXRpb25UeXBlLlNUUklORzpcbiAgICAgICAgICB0aGlzLnJlYWRTdHJpbmcodG9rKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIE9wZXJhdGlvblR5cGUuQ09NUEFSSVNPTjpcbiAgICAgICAgICB0aGlzLnJlYWRDb21wYXJlKHRvayk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBPcGVyYXRpb25UeXBlLk1BVEg6XG4gICAgICAgICAgdGhpcy5yZWNlaXZlVG9rZW4oKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMucmVhZFZhbHVlKHRvayk7XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIHRoZSBwb3Mgbm90IGNoYW5nZWQsIHRoaXMgbG9vcCB3aWxsIGdvIGludG8gYSBpbmZpbml0ZSBsb29wLCBldmVyeSBzdGVwIG9mIHdoaWxlIGxvb3AsXG4gICAgICAvLyB3ZSBtdXN0IG1vdmUgdGhlIHBvcyBmb3J3YXJkXG4gICAgICAvLyBzbyBoZXJlIHdlIHNob3VsZCB0aHJvdyBlcnJvciwgZm9yIGV4YW1wbGUgYDEgJiAyYFxuICAgICAgaWYgKHBvcyA9PT0gdGhpcy5jdXJyZW50SW5kZXggJiYgdG9rICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKGB1bmtvbncgdG9rZW4gJHt0b2t9IGZyb20gaW5wdXQgc3RyaW5nICR7dGhpcy5pbnB1dH1gKTtcbiAgICAgICAgZXJyLm5hbWUgPSAnVW5rbm93VG9rZW4nO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfSB3aGlsZSAodG9rICE9PSB1bmRlZmluZWQpXG5cbiAgICByZXR1cm4gdGhpcy50b2tlbkxpc3Q7XG4gIH1cblxuICAvKipcbiAgICogcmVhZCBuZXh0IHRva2VuLCB0aGUgaW5kZXggcGFyYW0gY2FuIHNldCBuZXh0IHN0ZXAsIGRlZmF1bHQgZ28gZm93YXJkIDEgc3RlcFxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXggbmV4dCBwb3N0aW9uXG4gICAqL1xuICBwaWNrTmV4dChpbmRleCA9IDApIHtcbiAgICByZXR1cm4gdGhpcy5pbnB1dFtpbmRleCArIHRoaXMuY3VycmVudEluZGV4ICsgMV07XG4gIH1cblxuICAvKipcbiAgICogU3RvcmUgdG9rZW4gaW50byByZXN1bHQgdG9rZW5MaXN0LCBhbmQgbW92ZSB0aGUgcG9zIGluZGV4XG4gICAqXG4gICAqIEBwYXJhbSBpbmRleFxuICAgKi9cbiAgcmVjZWl2ZVRva2VuKGluZGV4ID0gMSkge1xuICAgIGNvbnN0IHRvayA9IHRoaXMuaW5wdXQuc2xpY2UodGhpcy5jdXJyZW50SW5kZXgsIHRoaXMuY3VycmVudEluZGV4ICsgaW5kZXgpLnRyaW0oKTtcbiAgICAvLyBza2lwIGVtcHR5IHN0cmluZ1xuICAgIGlmICh0b2spIHtcbiAgICAgIHRoaXMudG9rZW5MaXN0LnB1c2godG9rKTtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnRJbmRleCArPSBpbmRleDtcbiAgfVxuXG4gIC8vICcgb3IgXCJcbiAgcmVhZFN0cmluZyh0b2spIHtcbiAgICBsZXQgbmV4dDtcbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGRvIHtcbiAgICAgIG5leHQgPSB0aGlzLnBpY2tOZXh0KGluZGV4KTtcbiAgICAgIGluZGV4ICs9IDE7XG4gICAgfSB3aGlsZSAobmV4dCAhPT0gdG9rICYmIG5leHQgIT09IHVuZGVmaW5lZCk7XG4gICAgdGhpcy5yZWNlaXZlVG9rZW4oaW5kZXggKyAxKTtcbiAgfVxuXG4gIC8vID4gb3IgPCBvciA+PSBvciA8PSBvciAhPT1cbiAgLy8gdG9rIGluICg+LCA8LCAhKVxuICByZWFkQ29tcGFyZSh0b2spIHtcbiAgICBpZiAodGhpcy5waWNrTmV4dCgpICE9PSAnPScpIHtcbiAgICAgIHRoaXMucmVjZWl2ZVRva2VuKDEpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyAhPT1cbiAgICBpZiAodG9rID09PSAnIScgJiYgdGhpcy5waWNrTmV4dCgxKSA9PT0gJz0nKSB7XG4gICAgICB0aGlzLnJlY2VpdmVUb2tlbigzKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5yZWNlaXZlVG9rZW4oMik7XG4gIH1cblxuICAvLyA9PT0gb3IgPT1cbiAgLy8gJiYgfHxcbiAgcmVhZExvZ2ljT3B0KHRvaykge1xuICAgIGlmICh0aGlzLnBpY2tOZXh0KCkgPT09IHRvaykge1xuICAgICAgLy8gPT09XG4gICAgICBpZiAodG9rID09PSAnPScgJiYgdGhpcy5waWNrTmV4dCgxKSA9PT0gdG9rKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlY2VpdmVUb2tlbigzKTtcbiAgICAgIH1cbiAgICAgIC8vID09ICYmIHx8XG4gICAgICByZXR1cm4gdGhpcy5yZWNlaXZlVG9rZW4oMik7XG4gICAgfVxuICAgIC8vIGhhbmRsZSBhcyAmJlxuICAgIC8vIGEgPyBiIDogYyBpcyBlcXVhbCB0byBhICYmIGIgfHwgY1xuICAgIGlmICh0b2sgPT09ICc/JyB8fCB0b2sgPT09ICc6Jykge1xuICAgICAgcmV0dXJuIHRoaXMucmVjZWl2ZVRva2VuKDEpO1xuICAgIH1cbiAgfVxuXG4gIHJlYWRWYWx1ZSh0b2spIHtcbiAgICBpZiAoIXRvaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBpbmRleCA9IDA7XG4gICAgd2hpbGUgKCFMZXhlci5vcHRhYmxlW3Rva10gJiYgdG9rICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRvayA9IHRoaXMucGlja05leHQoaW5kZXgpO1xuICAgICAgaW5kZXggKz0gMTtcbiAgICB9XG4gICAgdGhpcy5yZWNlaXZlVG9rZW4oaW5kZXgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRva2VuKGV4cHJlc3Npb24pIHtcbiAgY29uc3QgbGV4ZXIgPSBuZXcgTGV4ZXIoZXhwcmVzc2lvbik7XG4gIHJldHVybiBsZXhlci5nZXRUb2tlbnMoKTtcbn1cbiIsImV4cG9ydCBjb25zdCBPUEVSQVRJT04gPSB7XG4gICchJzogNSxcbiAgJyonOiA0LFxuICAnLyc6IDQsXG4gICclJzogNCxcbiAgJysnOiAzLFxuICAnLSc6IDMsXG4gICc+JzogMixcbiAgJzwnOiAyLFxuICAnPj0nOiAyLFxuICAnPD0nOiAyLFxuICAnPT09JzogMixcbiAgJyE9PSc6IDIsXG4gICc9PSc6IDIsXG4gICchPSc6IDIsXG4gICcmJic6IDEsXG4gICd8fCc6IDEsXG4gICc/JzogMSxcbiAgJzonOiAxLFxufTtcblxuLy8gZXhwb3J0IGludGVyZmFjZSBOb2RlIHtcbi8vICAgbGVmdDogTm9kZSB8IHN0cmluZyB8IG51bGw7XG4vLyAgIHJpZ2h0OiBOb2RlIHwgc3RyaW5nIHwgbnVsbDtcbi8vICAgb3BlcmF0aW9uOiBzdHJpbmc7XG4vLyAgIGdyb3VwZWQ/OiBib29sZWFuO1xuLy8gfTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyc2VyIHtcblxuICBjb25zdHJ1Y3Rvcih0b2tlbikge1xuICAgIHRoaXMuaW5kZXggPSAtMTtcbiAgICB0aGlzLmJsb2NrTGV2ZWwgPSAwO1xuICAgIHRoaXMudG9rZW4gPSB0b2tlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBcbiAgICogQHJldHVybiB7Tm9kZSB8IHN0cmluZ30gPS0gXG4gICAqL1xuICBwYXJzZSgpIHtcbiAgICBsZXQgdG9rO1xuICAgIGxldCByb290ID0ge1xuICAgICAgbGVmdDogbnVsbCxcbiAgICAgIHJpZ2h0OiBudWxsLFxuICAgICAgb3BlcmF0aW9uOiBudWxsLFxuICAgIH07XG5cbiAgICBkbyB7XG4gICAgICB0b2sgPSB0aGlzLnBhcnNlU3RhdGVtZW50KCk7XG5cbiAgICAgIGlmICh0b2sgPT09IG51bGwgfHwgdG9rID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmIChyb290LmxlZnQgPT09IG51bGwpIHtcbiAgICAgICAgcm9vdC5sZWZ0ID0gdG9rO1xuICAgICAgICByb290Lm9wZXJhdGlvbiA9IHRoaXMubmV4dFRva2VuKCk7XG5cbiAgICAgICAgaWYgKCFyb290Lm9wZXJhdGlvbikge1xuICAgICAgICAgIHJldHVybiB0b2s7XG4gICAgICAgIH1cblxuICAgICAgICByb290LnJpZ2h0ID0gdGhpcy5wYXJzZVN0YXRlbWVudCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0b2sgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdvcGVyYXRpb24gbXVzdCBiZSBzdHJpbmcsIGJ1dCBnZXQgJyArIEpTT04uc3RyaW5naWZ5KHRvaykpO1xuICAgICAgICB9XG4gICAgICAgIHJvb3QgPSB0aGlzLmFkZE5vZGUodG9rLCB0aGlzLnBhcnNlU3RhdGVtZW50KCksIHJvb3QpO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKHRvayk7XG5cbiAgICByZXR1cm4gcm9vdDtcbiAgfVxuXG4gIG5leHRUb2tlbigpIHtcbiAgICB0aGlzLmluZGV4ICs9IDE7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5bdGhpcy5pbmRleF07XG4gIH1cblxuICBwcmV2VG9rZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5bdGhpcy5pbmRleCAtIDFdO1xuICB9XG5cbiAgLyoqXG4gICAqIFxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3BlcmF0aW9uIFxuICAgKiBAcGFyYW0ge05vZGV8U3RyaW5nfG51bGx9IHJpZ2h0IFxuICAgKiBAcGFyYW0ge05vZGV9IHJvb3QgXG4gICAqL1xuICBhZGROb2RlKG9wZXJhdGlvbiwgcmlnaHQsIHJvb3QpIHtcbiAgICBsZXQgcHJlID0gcm9vdDtcbiAgICBcbiAgICBpZiAodGhpcy5jb21wYXJlKHByZS5vcGVyYXRpb24sIG9wZXJhdGlvbikgPCAwICYmICFwcmUuZ3JvdXBlZCkge1xuICAgICAgXG4gICAgICB3aGlsZSAocHJlLnJpZ2h0ICE9PSBudWxsICYmXG4gICAgICAgIHR5cGVvZiBwcmUucmlnaHQgIT09ICdzdHJpbmcnICYmXG4gICAgICAgIHRoaXMuY29tcGFyZShwcmUucmlnaHQub3BlcmF0aW9uLCBvcGVyYXRpb24pIDwgMCAmJiAhcHJlLnJpZ2h0Lmdyb3VwZWQpIHtcbiAgICAgICAgcHJlID0gcHJlLnJpZ2h0O1xuICAgICAgfVxuXG4gICAgICBwcmUucmlnaHQgPSB7XG4gICAgICAgIG9wZXJhdGlvbixcbiAgICAgICAgbGVmdDogcHJlLnJpZ2h0LFxuICAgICAgICByaWdodCxcbiAgICAgIH07XG4gICAgICByZXR1cm4gcm9vdDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHByZSxcbiAgICAgIHJpZ2h0LFxuICAgICAgb3BlcmF0aW9uLFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBcbiAgICogQHBhcmFtIHtTdHJpbmd9IGEgXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBiIFxuICAgKi9cbiAgY29tcGFyZShhLCBiKSB7XG4gICAgaWYgKCFPUEVSQVRJT04uaGFzT3duUHJvcGVydHkoYSkgfHwgIU9QRVJBVElPTi5oYXNPd25Qcm9wZXJ0eShiKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bmtub3cgb3BlcmF0aW9uICR7YX0gb3IgJHtifWApO1xuICAgIH1cbiAgICByZXR1cm4gT1BFUkFUSU9OW2FdIC0gT1BFUkFUSU9OW2JdO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4gc3RyaW5nIHwgTm9kZSB8IG51bGxcbiAgICovXG4gIHBhcnNlU3RhdGVtZW50KCkge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5uZXh0VG9rZW4oKTtcbiAgICBpZiAodG9rZW4gPT09ICcoJykge1xuICAgICAgdGhpcy5ibG9ja0xldmVsICs9IDE7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5wYXJzZSgpO1xuICAgICAgdGhpcy5ibG9ja0xldmVsIC09IDE7XG5cbiAgICAgIGlmICh0eXBlb2Ygbm9kZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgbm9kZS5ncm91cGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIGlmICh0b2tlbiA9PT0gJyknKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodG9rZW4gPT09ICchJykge1xuICAgICAgcmV0dXJuIHsgbGVmdDogbnVsbCwgb3BlcmF0aW9uOiB0b2tlbiwgcmlnaHQ6IHRoaXMucGFyc2VTdGF0ZW1lbnQoKSB9XG4gICAgfVxuXG4gICAgLy8gMyA+IC0xMiBvciAtMTIgKyAxMFxuICAgIGlmICh0b2tlbiA9PT0gJy0nICYmIChPUEVSQVRJT05bdGhpcy5wcmV2VG9rZW4oKV0gPiAwIHx8IHRoaXMucHJldlRva2VuKCkgPT09IHVuZGVmaW5lZCkpIHtcbiAgICAgIHJldHVybiB7IGxlZnQ6ICcwJywgb3BlcmF0aW9uOiB0b2tlbiwgcmlnaHQ6IHRoaXMucGFyc2VTdGF0ZW1lbnQoKSwgZ3JvdXBlZDogdHJ1ZSB9O1xuICAgIH1cblxuICAgIHJldHVybiB0b2tlbjtcbiAgfVxufVxuIiwiaW1wb3J0IHsgT1BFUkFUSU9OIH0gZnJvbSAnLi9QYXJzZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWVyeVBhcnNlciB7XG5cbiAgY29uc3RydWN0b3IodHJlZSwgcXVlcmllcykge1xuICAgIHRoaXMudHJlZSA9IHRyZWU7XG4gICAgdGhpcy5xdWVyaWVzID0gcXVlcmllcztcbiAgICB0aGlzLnF1ZXJ5ID0gbnVsbDtcbiAgfVxuXG4gIHNldFF1ZXJ5KHF1ZXJ5KSB7XG4gICAgdGhpcy5xdWVyeSA9IHF1ZXJ5LmNsb25lKCk7XG4gIH1cblxuICBwYXJzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJzZU5vZGUodGhpcy50cmVlKTtcbiAgfVxuXG4gIHBhcnNlTm9kZShub2RlKSB7XG4gICAgaWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3Qgbm9kZVF1ZXJ5ID0gdGhpcy5nZXRRdWVyeShub2RlKTtcbiAgICAgIHJldHVybiAocXVlcnkpID0+IHsgbm9kZVF1ZXJ5KHF1ZXJ5KTsgfTtcbiAgICB9XG4gICAgaWYgKE9QRVJBVElPTltub2RlLm9wZXJhdGlvbl0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bmtub3cgZXhwcmVzc2lvbiAke25vZGUub3BlcmF0aW9ufWApO1xuICAgIH1cbiAgICBjb25zdCBsZWZ0UXVlcnkgPSB0aGlzLmdldFF1ZXJ5KG5vZGUubGVmdCk7XG4gICAgY29uc3QgcmlnaHRRdWVyeSA9IHRoaXMuZ2V0UXVlcnkobm9kZS5yaWdodCk7XG5cbiAgICBzd2l0Y2ggKG5vZGUub3BlcmF0aW9uKSB7XG4gICAgICBjYXNlICcmJic6XG4gICAgICBjYXNlICdBTkQnOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIChub2RlUXVlcnkpID0+IG5vZGVRdWVyeS53aGVyZSgocXVlcnkpID0+IHtcbiAgICAgICAgICBxdWVyeS53aGVyZSgocSkgPT4geyBsZWZ0UXVlcnkocSk7IH0pO1xuICAgICAgICAgIHF1ZXJ5LmFuZFdoZXJlKChxKSA9PiB7IHJpZ2h0UXVlcnkocSk7IH0pO1xuICAgICAgICB9KTtcbiAgICAgIGNhc2UgJ3x8JzpcbiAgICAgIGNhc2UgJ09SJzpcbiAgICAgICAgcmV0dXJuIChub2RlUXVlcnkpID0+IG5vZGVRdWVyeS53aGVyZSgocXVlcnkpID0+IHtcbiAgICAgICAgICBxdWVyeS53aGVyZSgocSkgPT4geyBsZWZ0UXVlcnkocSk7IH0pO1xuICAgICAgICAgIHF1ZXJ5Lm9yV2hlcmUoKHEpID0+IHsgcmlnaHRRdWVyeShxKTsgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldFF1ZXJ5KG5vZGUpIHtcbiAgICBpZiAodHlwZW9mIG5vZGUgIT09ICdzdHJpbmcnICYmIG5vZGUgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcnNlTm9kZShub2RlKTtcbiAgICB9XG4gICAgY29uc3QgdmFsdWUgPSBwYXJzZUZsb2F0KG5vZGUpO1xuXG4gICAgaWYgKCFpc05hTih2YWx1ZSkpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5xdWVyaWVzW25vZGVdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHVua25vdyBxdWVyeSB1bmRlciBpbmRleCAke25vZGV9YCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5xdWVyaWVzW25vZGVdO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufSIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWV0YWJsZUNvbGxlY3Rpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm1ldGFkYXRhID0gW107XG4gICAgdGhpcy5LRVlfQ09MVU1OID0gJ2tleSc7XG4gICAgdGhpcy5WQUxVRV9DT0xVTU4gPSAndmFsdWUnO1xuICAgIHRoaXMuVFlQRV9DT0xVTU4gPSAndHlwZSc7XG4gICAgdGhpcy5tb2RlbCA9IG51bGw7XG4gICAgdGhpcy5leHRyYUNvbHVtbnMgPSBbXTtcblxuICAgIHRoaXMuZXh0cmFRdWVyeSA9IChxdWVyeSwgbWV0YSkgPT4ge1xuICAgICAgcXVlcnkud2hlcmUoJ2tleScsIG1ldGFbdGhpcy5LRVlfQ09MVU1OXSk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgbW9kZWwgb2YgdGhpcyBtZXRhZGF0YSBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0ge09iamVjdH0gbW9kZWwgLVxuICAgKi9cbiAgc2V0TW9kZWwobW9kZWwpIHtcbiAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gIH1cblxuICAvKipcbiAgICogRmluZCB0aGUgZ2l2ZW4gbWV0YWRhdGEga2V5LlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IC1cbiAgICogQHJldHVybiB7b2JqZWN0fSAtIE1ldGFkYXRhIG9iamVjdC5cbiAgICovXG4gIGZpbmRNZXRhKGtleSkge1xuICAgIHJldHVybiB0aGlzLmFsbE1ldGFkYXRhKCkuZmluZCgobWV0YSkgPT4gbWV0YS5rZXkgPT09IGtleSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYWxsIG1ldGFkYXRhLlxuICAgKi9cbiAgYWxsTWV0YWRhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0YWRhdGEuZmlsdGVyKChtZXRhKSA9PiAhbWV0YS5tYXJrQXNEZWxldGVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBtZXRhZGF0YSBvZiB0aGUgZ2l2ZW4ga2V5LlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IC1cbiAgICogQHBhcmFtIHtNaXhpZWR9IGRlZmF1bHRWYWx1ZSAtXG4gICAqL1xuICBnZXRNZXRhKGtleSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgY29uc3QgbWV0YWRhdGEgPSB0aGlzLmZpbmRNZXRhKGtleSk7XG4gICAgcmV0dXJuIG1ldGFkYXRhID8gbWV0YWRhdGEudmFsdWUgOiBkZWZhdWx0VmFsdWUgfHwgZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogTWFya2VzIHRoZSBtZXRhZGF0YSB0byBzaG91bGQgYmUgZGVsZXRlZC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSAtXG4gICAqL1xuICByZW1vdmVNZXRhKGtleSkge1xuICAgIGNvbnN0IG1ldGFkYXRhID0gdGhpcy5maW5kTWV0YShrZXkpO1xuXG4gICAgaWYgKG1ldGFkYXRhKSB7XG4gICAgICBtZXRhZGF0YS5tYXJrQXNEZWxldGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBtZXRhIGRhdGEgb2YgdGhlIGdpdmVuIGdyb3VwLlxuICAgKiBAcGFyYW0geyp9IGdyb3VwXG4gICAqL1xuICByZW1vdmVBbGxNZXRhKGdyb3VwID0gJ2RlZmF1bHQnKSB7XG4gICAgdGhpcy5tZXRhZGF0YSA9IHRoaXMubWV0YWRhdGEubWFwKChtZXRhKSA9PiAoe1xuICAgICAgLi4ubWV0YSxcbiAgICAgIG1hcmtBc0RlbGV0ZWQ6IHRydWUsXG4gICAgfSkpO1xuICB9XG5cbiAgc2V0RXh0cmFRdWVyeShjYWxsYmFjaykge1xuICAgIHRoaXMuZXh0cmFRdWVyeSA9IGNhbGxiYWNrO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgbWV0YSBkYXRhIHRvIHRoZSBzdGFjay5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSAtXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZSAtXG4gICAqL1xuICBzZXRNZXRhKGtleSwgdmFsdWUsIHBheWxvYWQpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShrZXkpKSB7XG4gICAgICBjb25zdCBtZXRhZGF0YSA9IGtleTtcblxuICAgICAgbWV0YWRhdGEuZm9yRWFjaCgobWV0YSkgPT4ge1xuICAgICAgICB0aGlzLnNldE1ldGEobWV0YS5rZXksIG1ldGEudmFsdWUpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1ldGFkYXRhID0gdGhpcy5maW5kTWV0YShrZXkpO1xuXG4gICAgaWYgKG1ldGFkYXRhKSB7XG4gICAgICBtZXRhZGF0YS52YWx1ZSA9IHZhbHVlO1xuICAgICAgbWV0YWRhdGEubWFya0FzVXBkYXRlZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWV0YWRhdGEucHVzaCh7XG4gICAgICAgIHZhbHVlLCBrZXksIC4uLnBheWxvYWQsIG1hcmtBc0luc2VydGVkOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNhdmVkIHRoZSBtb2RpZmllZC9kZWxldGVkIGFuZCBpbnNlcnRlZCBtZXRhZGF0YS5cbiAgICovXG4gIGFzeW5jIHNhdmVNZXRhKCkge1xuICAgIGNvbnN0IGluc2VydGVkID0gdGhpcy5tZXRhZGF0YS5maWx0ZXIoKG0pID0+IChtLm1hcmtBc0luc2VydGVkID09PSB0cnVlKSk7XG4gICAgY29uc3QgdXBkYXRlZCA9IHRoaXMubWV0YWRhdGEuZmlsdGVyKChtKSA9PiAobS5tYXJrQXNVcGRhdGVkID09PSB0cnVlKSk7XG4gICAgY29uc3QgZGVsZXRlZCA9IHRoaXMubWV0YWRhdGEuZmlsdGVyKChtKSA9PiAobS5tYXJrQXNEZWxldGVkID09PSB0cnVlKSk7XG4gICAgY29uc3Qgb3BlcnMgPSBbXTtcblxuICAgIGlmIChkZWxldGVkLmxlbmd0aCA+IDApIHtcbiAgICAgIGRlbGV0ZWQuZm9yRWFjaCgobWV0YSkgPT4ge1xuICAgICAgICBjb25zdCBkZWxldGVPcGVyID0gdGhpcy5tb2RlbC5xdWVyeSgpLmJlZm9yZVJ1bigocXVlcnksIHJlc3VsdCkgPT4ge1xuICAgICAgICAgIHRoaXMuZXh0cmFRdWVyeShxdWVyeSwgbWV0YSk7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSkuZGVsZXRlKCk7XG4gICAgICAgIG9wZXJzLnB1c2goZGVsZXRlT3Blcik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaW5zZXJ0ZWQuZm9yRWFjaCgobWV0YSkgPT4ge1xuICAgICAgY29uc3QgaW5zZXJ0T3BlciA9IHRoaXMubW9kZWwucXVlcnkoKS5pbnNlcnQoe1xuICAgICAgICBbdGhpcy5LRVlfQ09MVU1OXTogbWV0YS5rZXksXG4gICAgICAgIFt0aGlzLlZBTFVFX0NPTFVNTl06IG1ldGEudmFsdWUsXG4gICAgICAgIC4uLnRoaXMuZXh0cmFDb2x1bW5zLnJlZHVjZSgob2JqLCBjb2x1bW4pID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIG1ldGFbY29sdW1uXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG9ialtjb2x1bW5dID0gbWV0YVtjb2x1bW5dO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9LCB7fSksXG4gICAgICB9KTtcbiAgICAgIG9wZXJzLnB1c2goaW5zZXJ0T3Blcik7XG4gICAgfSk7XG4gICAgdXBkYXRlZC5mb3JFYWNoKChtZXRhKSA9PiB7XG4gICAgICBjb25zdCB1cGRhdGVPcGVyID0gdGhpcy5tb2RlbC5xdWVyeSgpLm9uQnVpbGQoKHF1ZXJ5KSA9PiB7XG4gICAgICAgIHRoaXMuZXh0cmFRdWVyeShxdWVyeSwgbWV0YSk7XG4gICAgICB9KS5wYXRjaCh7XG4gICAgICAgIFt0aGlzLlZBTFVFX0NPTFVNTl06IG1ldGEudmFsdWUsXG4gICAgICB9KTtcbiAgICAgIG9wZXJzLnB1c2godXBkYXRlT3Blcik7XG4gICAgfSk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwob3BlcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIHRoZSBtZXRhZGF0YSBmcm9tIHRoZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0ga2V5IC1cbiAgICogQHBhcmFtIHtCb29sZWFufSBmb3JjZSAtXG4gICAqL1xuICBhc3luYyBsb2FkKCkge1xuICAgIGNvbnN0IG1ldGFkYXRhID0gYXdhaXQgdGhpcy5xdWVyeSgpO1xuXG4gICAgY29uc3QgbWV0YWRhdGFBcnJheSA9IHRoaXMubWFwTWV0YWRhdGFDb2xsZWN0aW9uKG1ldGFkYXRhKTtcbiAgICBtZXRhZGF0YUFycmF5LmZvckVhY2goKG1ldGEpID0+IHtcbiAgICAgIHRoaXMubWV0YWRhdGEucHVzaChtZXRhKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3JtYXQgdGhlIG1ldGFkYXRhIGJlZm9yZSBzYXZpbmcgdG8gdGhlIGRhdGFiYXNlLlxuICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ8Qm9vbGVhbn0gdmFsdWUgLVxuICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVUeXBlIC1cbiAgICogQHJldHVybiB7U3RyaW5nfE51bWJlcnxCb29sZWFufSAtXG4gICAqL1xuICBzdGF0aWMgZm9ybWF0TWV0YVZhbHVlKHZhbHVlLCB2YWx1ZVR5cGUpIHtcbiAgICBsZXQgcGFyc2VkVmFsdWU7XG5cbiAgICBzd2l0Y2ggKHZhbHVlVHlwZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgcGFyc2VkVmFsdWUgPSBgJHt2YWx1ZX1gO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICBwYXJzZWRWYWx1ZSA9IHZhbHVlID8gJzEnIDogJzAnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2pzb24nOlxuICAgICAgICBwYXJzZWRWYWx1ZSA9IEpTT04uc3RyaW5naWZ5KHBhcnNlZFZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBwYXJzZWRWYWx1ZSA9IHZhbHVlO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlZFZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcHBpbmcgYW5kIHBhcnNlIG1ldGFkYXRhIHRvIGNvbGxlY3Rpb24gZW50cmllcy5cbiAgICogQHBhcmFtIHtNZXRhfSBhdHRyIC1cbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhcnNlVHlwZSAtXG4gICAqL1xuICBtYXBNZXRhZGF0YShhdHRyLCBwYXJzZVR5cGUgPSAncGFyc2UnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGtleTogYXR0clt0aGlzLktFWV9DT0xVTU5dLFxuICAgICAgdmFsdWU6IChwYXJzZVR5cGUgPT09ICdwYXJzZScpXG4gICAgICAgID8gTWV0YWJsZUNvbGxlY3Rpb24ucGFyc2VNZXRhVmFsdWUoXG4gICAgICAgICAgYXR0clt0aGlzLlZBTFVFX0NPTFVNTl0sXG4gICAgICAgICAgdGhpcy5UWVBFX0NPTFVNTiA/IGF0dHJbdGhpcy5UWVBFX0NPTFVNTl0gOiBmYWxzZSxcbiAgICAgICAgKVxuICAgICAgICA6IE1ldGFibGVDb2xsZWN0aW9uLmZvcm1hdE1ldGFWYWx1ZShcbiAgICAgICAgICBhdHRyW3RoaXMuVkFMVUVfQ09MVU1OXSxcbiAgICAgICAgICB0aGlzLlRZUEVfQ09MVU1OID8gYXR0clt0aGlzLlRZUEVfQ09MVU1OXSA6IGZhbHNlLFxuICAgICAgICApLFxuICAgICAgLi4udGhpcy5leHRyYUNvbHVtbnMubWFwKChleHRyYUNvbCkgPT4gKHtcbiAgICAgICAgW2V4dHJhQ29sXTogYXR0cltleHRyYUNvbF0gfHwgbnVsbCxcbiAgICAgIH0pKSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnNlIHRoZSBtZXRhZGF0YSB0byB0aGUgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIHtBcnJheX0gY29sbGVjdGlvbiAtXG4gICAqL1xuICBtYXBNZXRhZGF0YVRvQ29sbGVjdGlvbihtZXRhZGF0YSwgcGFyc2VUeXBlID0gJ3BhcnNlJykge1xuICAgIHJldHVybiBtZXRhZGF0YS5tYXAoKG1vZGVsKSA9PiB0aGlzLm1hcE1ldGFkYXRhVG9Db2xsZWN0aW9uKG1vZGVsLCBwYXJzZVR5cGUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIG1ldGFkYXRhIHRvIHRoZSBtZXRhYmxlIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSB7QXJyYXl9IG1ldGEgLVxuICAgKi9cbiAgZnJvbShtZXRhKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkobWV0YSkpIHtcbiAgICAgIG1ldGEuZm9yRWFjaCgobSkgPT4geyB0aGlzLmZyb20obSk7IH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLm1ldGFkYXRhLnB1c2gobWV0YSk7XG4gIH1cblxuXG4gIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0YWRhdGE7XG4gIH1cblxuICAvKipcbiAgICogU3RhdGljIG1ldGhvZCB0byBsb2FkIG1ldGFkYXRhIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0ge0FycmF5fSBtZXRhIFxuICAgKi9cbiAgc3RhdGljIGZyb20obWV0YSkge1xuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBuZXcgTWV0YWJsZUNvbGxlY3Rpb24oKTtcbiAgICBjb2xsZWN0aW9uLmZyb20obWV0YSk7XG5cbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfVxufVxuIiwiaW1wb3J0IHsgZGlmZmVyZW5jZSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBMZXhlciB9IGZyb20gJ0AvbGliL0xvZ2ljRXZhbHVhdGlvbi9MZXhlcic7XG5pbXBvcnQgUGFyc2VyIGZyb20gJ0AvbGliL0xvZ2ljRXZhbHVhdGlvbi9QYXJzZXInO1xuaW1wb3J0IFF1ZXJ5UGFyc2VyIGZyb20gJ0AvbGliL0xvZ2ljRXZhbHVhdGlvbi9RdWVyeVBhcnNlcic7XG5pbXBvcnQgcmVzb3VyY2VGaWVsZHNLZXlzIGZyb20gJ0AvZGF0YS9SZXNvdXJjZUZpZWxkc0tleXMnO1xuXG4vLyAgY29uc3Qgcm9sZSA9IHtcbi8vICAgY29tcGF0b3RvcjogJycsXG4vLyAgIHZhbHVlOiAnJyxcbi8vICAgY29sdW1uS2V5OiAnJyxcbi8vICAgY29sdW1uU2x1ZzogJycsXG4vLyAgIGluZGV4OiAxLFxuLy8gfVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRSb2xlUXVlcnkocm9sZSkge1xuICBjb25zdCBjb2x1bW5OYW1lID0gcmVzb3VyY2VGaWVsZHNLZXlzW3JvbGUuY29sdW1uS2V5XTtcblxuICBzd2l0Y2ggKHJvbGUuY29tcGFyYXRvcikge1xuICAgIGNhc2UgJ2VxdWFscyc6XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAoYnVpbGRlcikgPT4ge1xuICAgICAgICBidWlsZGVyLndoZXJlKGNvbHVtbk5hbWUsIHJvbGUudmFsdWUpO1xuICAgICAgfTtcbiAgICBjYXNlICdub3RfZXF1YWwnOlxuICAgIGNhc2UgJ25vdF9lcXVhbHMnOlxuICAgICAgcmV0dXJuIChidWlsZGVyKSA9PiB7XG4gICAgICAgIGJ1aWxkZXIud2hlcmVOb3QoY29sdW1uTmFtZSwgcm9sZS52YWx1ZSk7XG4gICAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQnVpbGRzIGRhdGFiYXNlIHF1ZXJ5IGZyb20gc3RvcmVkIHZpZXcgcm9sZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gcm9sZXMgLVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2aWV3Um9sZXNCdWlsZGVyKHJvbGVzLCBsb2dpY0V4cHJlc3Npb24gPSAnJykge1xuICBjb25zdCByb2xlc0luZGV4U2V0ID0ge307XG5cbiAgcm9sZXMuZm9yRWFjaCgocm9sZSkgPT4ge1xuICAgIHJvbGVzSW5kZXhTZXRbcm9sZS5pbmRleF0gPSBidWlsZFJvbGVRdWVyeShyb2xlKTtcbiAgfSk7XG4gIC8vIExleGVyIGZvciBsb2dpYyBleHByZXNzaW9uLlxuICBjb25zdCBsZXhlciA9IG5ldyBMZXhlcihsb2dpY0V4cHJlc3Npb24pO1xuICBjb25zdCB0b2tlbnMgPSBsZXhlci5nZXRUb2tlbnMoKTtcblxuICAvLyBQYXJzZSB0aGUgbG9naWMgZXhwcmVzc2lvbi5cbiAgY29uc3QgcGFyc2VyID0gbmV3IFBhcnNlcih0b2tlbnMpO1xuICBjb25zdCBwYXJzZWRUcmVlID0gcGFyc2VyLnBhcnNlKCk7XG5cbiAgY29uc3QgcXVlcnlQYXJzZXIgPSBuZXcgUXVlcnlQYXJzZXIocGFyc2VkVHJlZSwgcm9sZXNJbmRleFNldCk7XG4gIHJldHVybiBxdWVyeVBhcnNlci5wYXJzZSgpO1xufVxuXG4vKipcbiAqIFZhbGlkYXRlcyB0aGUgdmlldyBsb2dpYyBleHByZXNzaW9uLlxuICogQHBhcmFtIHtTdHJpbmd9IGxvZ2ljRXhwcmVzc2lvbiBcbiAqIEBwYXJhbSB7QXJyYXl9IGluZGV4ZXMgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVZpZXdMb2dpY0V4cHJlc3Npb24obG9naWNFeHByZXNzaW9uLCBpbmRleGVzKSB7XG4gIGNvbnN0IGxvZ2ljRXhwSW5kZXhlcyA9IGxvZ2ljRXhwcmVzc2lvbi5tYXRjaCgvXFxkKy9nKSB8fCBbXTtcbiAgcmV0dXJuICFkaWZmZXJlbmNlKGxvZ2ljRXhwSW5kZXhlcy5tYXAoTnVtYmVyKSwgaW5kZXhlcykubGVuZ3RoO1xufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHtBcnJheX0gcm9sZXMgLVxuICogQHBhcmFtIHtTdHJpbmd9IGxvZ2ljRXhwcmVzc2lvbiAtXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVWaWV3Um9sZXMocm9sZXMsIGxvZ2ljRXhwcmVzc2lvbikge1xuICByZXR1cm4gdmFsaWRhdGVWaWV3TG9naWNFeHByZXNzaW9uKGxvZ2ljRXhwcmVzc2lvbiwgcm9sZXMubWFwKChyKSA9PiByLmluZGV4KSk7XG59XG5cbi8qKlxuICogTWFwZXMgdGhlIHZpZXcgcm9sZXMgdG8gdmlldyBjb25kaXRpb25hbHMuXG4gKiBAcGFyYW0ge0FycmF5fSB2aWV3Um9sZXMgLVxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXBWaWV3Um9sZXNUb0NvbmRpdGlvbmFscyh2aWV3Um9sZXMpIHtcbiAgcmV0dXJuIHZpZXdSb2xlcy5tYXAoKHZpZXdSb2xlKSA9PiAoe1xuICAgIGNvbXBhcmF0b3I6IHZpZXdSb2xlLmNvbXBhcmF0b3IsXG4gICAgdmFsdWU6IHZpZXdSb2xlLnZhbHVlLFxuICAgIGNvbHVtbktleTogdmlld1JvbGUuZmllbGQuY29sdW1uS2V5LFxuICAgIHNsdWc6IHZpZXdSb2xlLmZpZWxkLnNsdWcsXG4gICAgaW5kZXg6IHZpZXdSb2xlLmluZGV4LFxuICB9KSk7XG59IiwiLyogZXNsaW50LWRpc2FibGUgZ2xvYmFsLXJlcXVpcmUgKi9cbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnb2JqZWN0aW9uJztcbmltcG9ydCB7IGZsYXR0ZW4gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IEJhc2VNb2RlbCBmcm9tICdAL21vZGVscy9Nb2RlbCc7XG5pbXBvcnQge3ZpZXdSb2xlc0J1aWxkZXJ9IGZyb20gJ0AvbGliL1ZpZXdSb2xlc0J1aWxkZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY2NvdW50IGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWVcbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAnYWNjb3VudHMnO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vZGVsIG1vZGlmaWVycy5cbiAgICovXG4gIHN0YXRpYyBnZXQgbW9kaWZpZXJzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBmaWx0ZXJBY2NvdW50VHlwZXMocXVlcnksIHR5cGVzSWRzKSB7XG4gICAgICAgIGlmICh0eXBlc0lkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcXVlcnkud2hlcmVJbignYWNjb3VuX3R5cGVfaWQnLCB0eXBlc0lkcyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB2aWV3Um9sZXNCdWlsZGVyKHF1ZXJ5LCBjb25kaXRpb25hbHMsIGV4cHJlc3Npb24pIHtcbiAgICAgICAgdmlld1JvbGVzQnVpbGRlcihjb25kaXRpb25hbHMsIGV4cHJlc3Npb24pKHF1ZXJ5KTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxhdGlvbnNoaXAgbWFwcGluZy5cbiAgICovXG4gIHN0YXRpYyBnZXQgcmVsYXRpb25NYXBwaW5ncygpIHtcbiAgICBjb25zdCBBY2NvdW50VHlwZSA9IHJlcXVpcmUoJ0AvbW9kZWxzL0FjY291bnRUeXBlJyk7XG4gICAgY29uc3QgQWNjb3VudEJhbGFuY2UgPSByZXF1aXJlKCdAL21vZGVscy9BY2NvdW50QmFsYW5jZScpO1xuICAgIGNvbnN0IEFjY291bnRUcmFuc2FjdGlvbiA9IHJlcXVpcmUoJ0AvbW9kZWxzL0FjY291bnRUcmFuc2FjdGlvbicpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8qKlxuICAgICAgICogQWNjb3VudCBtb2RlbCBtYXkgYmVsb25ncyB0byBhY2NvdW50IHR5cGUuXG4gICAgICAgKi9cbiAgICAgIHR5cGU6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkJlbG9uZ3NUb09uZVJlbGF0aW9uLFxuICAgICAgICBtb2RlbENsYXNzOiBBY2NvdW50VHlwZS5kZWZhdWx0LFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ2FjY291bnRzLmFjY291bnRUeXBlSWQnLFxuICAgICAgICAgIHRvOiAnYWNjb3VudF90eXBlcy5pZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEFjY291bnQgbW9kZWwgbWF5IGhhcyBtYW55IGJhbGFuY2VzIGFjY291bnRzLlxuICAgICAgICovXG4gICAgICBiYWxhbmNlOiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5IYXNPbmVSZWxhdGlvbixcbiAgICAgICAgbW9kZWxDbGFzczogQWNjb3VudEJhbGFuY2UuZGVmYXVsdCxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICdhY2NvdW50cy5pZCcsXG4gICAgICAgICAgdG86ICdhY2NvdW50X2JhbGFuY2VzLmFjY291bnRJZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEFjY291bnQgbW9kZWwgbWF5IGhhcyBtYW55IHRyYW5zYWN0aW9ucy5cbiAgICAgICAqL1xuICAgICAgdHJhbnNhY3Rpb25zOiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5IYXNNYW55UmVsYXRpb24sXG4gICAgICAgIG1vZGVsQ2xhc3M6IEFjY291bnRUcmFuc2FjdGlvbi5kZWZhdWx0LFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ2FjY291bnRzLmlkJyxcbiAgICAgICAgICB0bzogJ2FjY291bnRzX3RyYW5zYWN0aW9ucy5hY2NvdW50SWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGNvbGxlY3RKb3VybmFsRW50cmllcyhhY2NvdW50cykge1xuICAgIHJldHVybiBmbGF0dGVuKGFjY291bnRzLm1hcCgoYWNjb3VudCkgPT4gYWNjb3VudC50cmFuc2FjdGlvbnMubWFwKCh0cmFuc2FjdGlvbikgPT4gKHtcbiAgICAgIGFjY291bnRJZDogYWNjb3VudC5pZCxcbiAgICAgIC4uLnRyYW5zYWN0aW9uLFxuICAgICAgYWNjb3VudE5vcm1hbDogYWNjb3VudC50eXBlLm5vcm1hbCxcbiAgICB9KSkpKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTW9kZWwgfSBmcm9tICdvYmplY3Rpb24nO1xuaW1wb3J0IEJhc2VNb2RlbCBmcm9tICdAL21vZGVscy9Nb2RlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjY291bnRCYWxhbmNlIGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWVcbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAnYWNjb3VudF9iYWxhbmNlcyc7XG4gIH1cblxuICAvKipcbiAgICogUmVsYXRpb25zaGlwIG1hcHBpbmcuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHJlbGF0aW9uTWFwcGluZ3MoKSB7XG4gICAgY29uc3QgQWNjb3VudCA9IHJlcXVpcmUoJ0AvbW9kZWxzL0FjY291bnQnKTtcblxuICAgIHJldHVybiB7XG4gICAgICBhY2NvdW50OiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5CZWxvbmdzVG9PbmVSZWxhdGlvbixcbiAgICAgICAgbW9kZWxDbGFzczogQWNjb3VudC5kZWZhdWx0LFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ2FjY291bnRfYmFsYW5jZS5hY2NvdW50X2lkJyxcbiAgICAgICAgICB0bzogJ2FjY291bnRzLmlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTW9kZWwgfSBmcm9tICdvYmplY3Rpb24nO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IEJhc2VNb2RlbCBmcm9tICdAL21vZGVscy9Nb2RlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjY291bnRUcmFuc2FjdGlvbiBleHRlbmRzIEJhc2VNb2RlbCB7XG4gIC8qKlxuICAgKiBUYWJsZSBuYW1lXG4gICAqL1xuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ2FjY291bnRzX3RyYW5zYWN0aW9ucyc7XG4gIH1cblxuICAvKipcbiAgICogTW9kZWwgbW9kaWZpZXJzLlxuICAgKi9cbiAgc3RhdGljIGdldCBtb2RpZmllcnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbHRlckFjY291bnRzKHF1ZXJ5LCBhY2NvdW50c0lkcykge1xuICAgICAgICBpZiAoYWNjb3VudHNJZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHF1ZXJ5LndoZXJlSW4oJ2FjY291bnRfaWQnLCBhY2NvdW50c0lkcyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmaWx0ZXJUcmFuc2FjdGlvblR5cGVzKHF1ZXJ5LCB0eXBlcykge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0eXBlcykgJiYgdHlwZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHF1ZXJ5LndoZXJlSW4oJ3JlZmVyZW5jZV90eXBlJywgdHlwZXMpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0eXBlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBxdWVyeS53aGVyZSgncmVmZXJlbmNlX3R5cGUnLCB0eXBlcyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmaWx0ZXJEYXRlUmFuZ2UocXVlcnksIHN0YXJ0RGF0ZSwgZW5kRGF0ZSwgdHlwZSA9ICdkYXknKSB7XG4gICAgICAgIGNvbnN0IGRhdGVGb3JtYXQgPSAnWVlZWS1NTS1ERCBISDptbTpzcyc7XG4gICAgICAgIGNvbnN0IGZyb21EYXRlID0gbW9tZW50KHN0YXJ0RGF0ZSkuc3RhcnRPZih0eXBlKS5mb3JtYXQoZGF0ZUZvcm1hdCk7XG4gICAgICAgIGNvbnN0IHRvRGF0ZSA9IG1vbWVudChlbmREYXRlKS5lbmRPZih0eXBlKS5mb3JtYXQoZGF0ZUZvcm1hdCk7XG5cbiAgICAgICAgaWYgKHN0YXJ0RGF0ZSkge1xuICAgICAgICAgIHF1ZXJ5LndoZXJlKCdkYXRlJywgJz49JywgZnJvbURhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbmREYXRlKSB7XG4gICAgICAgICAgcXVlcnkud2hlcmUoJ2RhdGUnLCAnPD0nLCB0b0RhdGUpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZmlsdGVyQW1vdW50UmFuZ2UocXVlcnksIGZyb21BbW91bnQsIHRvQW1vdW50KSB7XG4gICAgICAgIGlmIChmcm9tQW1vdW50KSB7XG4gICAgICAgICAgcXVlcnkuYW5kV2hlcmUoKHEpID0+IHtcbiAgICAgICAgICAgIHEud2hlcmUoJ2NyZWRpdCcsICc+PScsIGZyb21BbW91bnQpO1xuICAgICAgICAgICAgcS5vcldoZXJlKCdkZWJpdCcsICc+PScsIGZyb21BbW91bnQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0b0Ftb3VudCkge1xuICAgICAgICAgIHF1ZXJ5LmFuZFdoZXJlKChxKSA9PiB7XG4gICAgICAgICAgICBxLndoZXJlKCdjcmVkaXQnLCAnPD0nLCB0b0Ftb3VudCk7XG4gICAgICAgICAgICBxLm9yV2hlcmUoJ2RlYml0JywgJzw9JywgdG9BbW91bnQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc3VtYXRpb25DcmVkaXREZWJpdChxdWVyeSkge1xuICAgICAgICBxdWVyeS5zdW0oJ2NyZWRpdCBhcyBjcmVkaXQnKTtcbiAgICAgICAgcXVlcnkuc3VtKCdkZWJpdCBhcyBkZWJpdCcpO1xuICAgICAgICBxdWVyeS5ncm91cEJ5KCdhY2NvdW50X2lkJyk7XG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUmVsYXRpb25zaGlwIG1hcHBpbmcuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHJlbGF0aW9uTWFwcGluZ3MoKSB7XG4gICAgY29uc3QgQWNjb3VudCA9IHJlcXVpcmUoJ0AvbW9kZWxzL0FjY291bnQnKTtcblxuICAgIHJldHVybiB7XG4gICAgICBhY2NvdW50OiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5CZWxvbmdzVG9PbmVSZWxhdGlvbixcbiAgICAgICAgbW9kZWxDbGFzczogQWNjb3VudC5kZWZhdWx0LFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ2FjY291bnRzX3RyYW5zYWN0aW9ucy5hY2NvdW50SWQnLFxuICAgICAgICAgIHRvOiAnYWNjb3VudHMuaWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iLCIvLyBpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnb2JqZWN0aW9uJztcbmltcG9ydCBCYXNlTW9kZWwgZnJvbSAnQC9tb2RlbHMvTW9kZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY2NvdW50VHlwZSBleHRlbmRzIEJhc2VNb2RlbCB7XG4gIC8qKlxuICAgKiBUYWJsZSBuYW1lXG4gICAqL1xuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ2FjY291bnRfdHlwZXMnO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGF0aW9uc2hpcCBtYXBwaW5nLlxuICAgKi9cbiAgc3RhdGljIGdldCByZWxhdGlvbk1hcHBpbmdzKCkge1xuICAgIGNvbnN0IEFjY291bnQgPSByZXF1aXJlKCdAL21vZGVscy9BY2NvdW50Jyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLyoqXG4gICAgICAgKiBBY2NvdW50IHR5cGUgbWF5IGhhcyBtYW55IGFzc29jaWF0ZWQgYWNjb3VudHMuXG4gICAgICAgKi9cbiAgICAgIGFjY291bnRzOiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5IYXNNYW55UmVsYXRpb24sXG4gICAgICAgIG1vZGVsQ2xhc3M6IEFjY291bnQuZGVmYXVsdCxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICdhY2NvdW50X3R5cGVzLmlkJyxcbiAgICAgICAgICB0bzogJ2FjY291bnRzLmFjY291bnRUeXBlSWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZU1vZGVsIGZyb20gJ0AvbW9kZWxzL01vZGVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVkZ2V0IGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWVcbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAnYnVkZ2V0cyc7XG4gIH1cblxuICBzdGF0aWMgZ2V0IHZpcnR1YWxBdHRyaWJ1dGVzKCkge1xuICAgIHJldHVybiBbJ3JhbmdlQnknLCAncmFuZ2VJbmNyZW1lbnQnXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb2RlbCBtb2RpZmllcnMuXG4gICAqL1xuICBzdGF0aWMgZ2V0IG1vZGlmaWVycygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZmlsdGVyQnlZZWFyKHF1ZXJ5LCB5ZWFyKSB7XG4gICAgICAgIHF1ZXJ5LndoZXJlKCd5ZWFyJywgeWVhcik7XG4gICAgICB9LFxuICAgICAgZmlsdGVyQnlJbmNvbWVTdGF0ZW1lbnQocXVlcnkpIHtcbiAgICAgICAgcXVlcnkud2hlcmUoJ2FjY291bnRfdHlwZXMnLCAnaW5jb21lX3N0YXRlbWVudCcpO1xuICAgICAgfSxcbiAgICAgIGZpbHRlckJ5UHJvZml0TG9zcyhxdWVyeSkge1xuICAgICAgICBxdWVyeS53aGVyZSgnYWNjb3VudHNfdHlwZXMnLCAncHJvZml0X2xvc3MnKTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGdldCByYW5nZUJ5KCkge1xuICAgIHN3aXRjaCAodGhpcy5wZXJpb2QpIHtcbiAgICAgIGNhc2UgJ2hhbGYteWVhcic6XG4gICAgICBjYXNlICdxdWFydGVyJzpcbiAgICAgICAgcmV0dXJuICdtb250aCc7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdGhpcy5wZXJpb2Q7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHJhbmdlSW5jcmVtZW50KCkge1xuICAgIHN3aXRjaCAodGhpcy5wZXJpb2QpIHtcbiAgICAgIGNhc2UgJ2hhbGYteWVhcic6XG4gICAgICAgIHJldHVybiA2O1xuICAgICAgY2FzZSAncXVhcnRlcic6XG4gICAgICAgIHJldHVybiAzO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHJhbmdlT2Zmc2V0KCkge1xuICAgIHN3aXRjaCAodGhpcy5wZXJpb2QpIHtcbiAgICAgIGNhc2UgJ2hhbGYteWVhcic6IHJldHVybiA1O1xuICAgICAgY2FzZSAncXVhcnRlcic6IHJldHVybiAyO1xuICAgICAgZGVmYXVsdDogcmV0dXJuIDA7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgQmFzZU1vZGVsIGZyb20gJ0AvbW9kZWxzL01vZGVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVkZ2V0IGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWVcbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAnYnVkZ2V0X2VudHJpZXMnO1xuICB9XG59XG4iLCJpbXBvcnQgeyBNb2RlbCB9IGZyb20gJ29iamVjdGlvbic7XG5pbXBvcnQgQmFzZU1vZGVsIGZyb20gJ0AvbW9kZWxzL01vZGVsJztcbmltcG9ydCB7dmlld1JvbGVzQnVpbGRlcn0gZnJvbSAnQC9saWIvVmlld1JvbGVzQnVpbGRlcic7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHBlbnNlIGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWVcbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAnZXhwZW5zZXMnO1xuICB9XG5cbiAgc3RhdGljIGdldCByZWZlcmVuY2VUeXBlKCkge1xuICAgIHJldHVybiAnRXhwZW5zZSc7XG4gIH1cblxuICAvKipcbiAgICogTW9kZWwgbW9kaWZpZXJzLlxuICAgKi9cbiAgc3RhdGljIGdldCBtb2RpZmllcnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbHRlckJ5RGF0ZVJhbmdlKHF1ZXJ5LCBzdGFydERhdGUsIGVuZERhdGUpIHtcbiAgICAgICAgaWYgKHN0YXJ0RGF0ZSkge1xuICAgICAgICAgIHF1ZXJ5LndoZXJlKCdkYXRlJywgJz49Jywgc3RhcnREYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW5kRGF0ZSkge1xuICAgICAgICAgIHF1ZXJ5LndoZXJlKCdkYXRlJywgJzw9JywgZW5kRGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmaWx0ZXJCeUFtb3VudFJhbmdlKHF1ZXJ5LCBmcm9tLCB0bykge1xuICAgICAgICBpZiAoZnJvbSkge1xuICAgICAgICAgIHF1ZXJ5LndoZXJlKCdhbW91bnQnLCAnPj0nLCBmcm9tKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG8pIHtcbiAgICAgICAgICBxdWVyeS53aGVyZSgnYW1vdW50JywgJzw9JywgdG8pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZmlsdGVyQnlFeHBlbnNlQWNjb3VudChxdWVyeSwgYWNjb3VudElkKSB7XG4gICAgICAgIGlmIChhY2NvdW50SWQpIHtcbiAgICAgICAgICBxdWVyeS53aGVyZSgnZXhwZW5zZV9hY2NvdW50X2lkJywgYWNjb3VudElkKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZpbHRlckJ5UGF5bWVudEFjY291bnQocXVlcnksIGFjY291bnRJZCkge1xuICAgICAgICBpZiAoYWNjb3VudElkKSB7XG4gICAgICAgICAgcXVlcnkud2hlcmUoJ3BheW1lbnRfYWNjb3VudF9pZCcsIGFjY291bnRJZCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIHZpZXdSb2xlc0J1aWxkZXIocXVlcnksIGNvbmRpdGlvbmFscywgZXhwcmVzc2lvbikge1xuICAgICAgICB2aWV3Um9sZXNCdWlsZGVyKGNvbmRpdGlvbmFscywgZXhwcmVzc2lvbikocXVlcnkpO1xuICAgICAgfSxcblxuICAgICAgb3JkZXJCeShxdWVyeSkge1xuICAgICAgICBcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGF0aW9uc2hpcCBtYXBwaW5nLlxuICAgKi9cbiAgc3RhdGljIGdldCByZWxhdGlvbk1hcHBpbmdzKCkge1xuICAgIGNvbnN0IEFjY291bnQgPSByZXF1aXJlKCdAL21vZGVscy9BY2NvdW50Jyk7XG4gICAgY29uc3QgVXNlciA9IHJlcXVpcmUoJ0AvbW9kZWxzL1VzZXInKTtcblxuICAgIHJldHVybiB7XG4gICAgICBwYXltZW50QWNjb3VudDoge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuQmVsb25nc1RvT25lUmVsYXRpb24sXG4gICAgICAgIG1vZGVsQ2xhc3M6IEFjY291bnQuZGVmYXVsdCxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICdleHBlbnNlcy5wYXltZW50QWNjb3VudElkJyxcbiAgICAgICAgICB0bzogJ2FjY291bnRzLmlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG5cbiAgICAgIGV4cGVuc2VBY2NvdW50OiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5CZWxvbmdzVG9PbmVSZWxhdGlvbixcbiAgICAgICAgbW9kZWxDbGFzczogQWNjb3VudC5kZWZhdWx0LFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ2V4cGVuc2VzLmV4cGVuc2VBY2NvdW50SWQnLFxuICAgICAgICAgIHRvOiAnYWNjb3VudHMuaWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcblxuICAgICAgdXNlcjoge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuQmVsb25nc1RvT25lUmVsYXRpb24sXG4gICAgICAgIG1vZGVsQ2xhc3M6IFVzZXIuZGVmYXVsdCxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICdleHBlbnNlcy51c2VySWQnLFxuICAgICAgICAgIHRvOiAndXNlcnMuaWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgeyBNb2RlbCB9IGZyb20gJ29iamVjdGlvbic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBCYXNlTW9kZWwgZnJvbSAnQC9tb2RlbHMvTW9kZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJdGVtIGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWVcbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAnaXRlbXMnO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGF0aW9uc2hpcCBtYXBwaW5nLlxuICAgKi9cbiAgc3RhdGljIGdldCByZWxhdGlvbk1hcHBpbmdzKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvKipcbiAgICAgICAqIEl0ZW0gbWF5IGhhcyBtYW55IG1ldGEgZGF0YS5cbiAgICAgICAqL1xuICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkhhc01hbnlSZWxhdGlvbixcbiAgICAgICAgbW9kZWxCYXNlOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnSXRlbU1ldGFkYXRhJyksXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAnaXRlbXMuaWQnLFxuICAgICAgICAgIHRvOiAnaXRlbXNfbWV0YWRhdGEuaXRlbV9pZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEl0ZW0gbWF5IGJlbG9uZ3MgdG8gY2F0ZW9nb3J5IG1vZGVsLlxuICAgICAgICovXG4gICAgICBjYXRlZ29yeToge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuQmVsb25nc1RvT25lUmVsYXRpb24sXG4gICAgICAgIG1vZGVsQmFzZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ0l0ZW1DYXRlZ29yeScpLFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ2l0ZW1zLmNhdGVnb3J5SWQnLFxuICAgICAgICAgIHRvOiAnaXRlbXNfY2F0ZWdvcmllcy5pZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cbiIsImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICdvYmplY3Rpb24nO1xuaW1wb3J0IEJhc2VNb2RlbCBmcm9tICdAL21vZGVscy9Nb2RlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEl0ZW1DYXRlZ29yeSBleHRlbmRzIEJhc2VNb2RlbCB7XG4gIC8qKlxuICAgKiBUYWJsZSBuYW1lLlxuICAgKi9cbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICdpdGVtc19jYXRlZ29yaWVzJztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxhdGlvbnNoaXAgbWFwcGluZy5cbiAgICovXG4gIHN0YXRpYyBnZXQgcmVsYXRpb25NYXBwaW5ncygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLyoqXG4gICAgICAgKiBJdGVtIGNhdGVnb3J5IG1heSBoYXMgbWFueSBpdGVtcy5cbiAgICAgICAqL1xuICAgICAgaXRlbXM6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkhhc01hbnlSZWxhdGlvbixcbiAgICAgICAgbW9kZWxCYXNlOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnSXRlbScpLFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ2l0ZW1zX2NhdGVnb3JpZXMuaXRlbV9pZCcsXG4gICAgICAgICAgdG86ICdpdGVtcy5pZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlTW9kZWwgZnJvbSAnQC9tb2RlbHMvTW9kZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKb3VybmFsRW50cnkgZXh0ZW5kcyBCYXNlTW9kZWwge1xuICAvKipcbiAgICogVGFibGUgbmFtZS5cbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAnbWFudWFsX2pvdXJuYWxzJztcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VNb2RlbCBmcm9tICdAL21vZGVscy9Nb2RlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hbnVhbEpvdXJuYWwgZXh0ZW5kcyBCYXNlTW9kZWwge1xuICAvKipcbiAgICogVGFibGUgbmFtZS5cbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAnbWFudWFsX2pvdXJuYWxzJztcbiAgfVxufVxuIiwiaW1wb3J0IHsgTW9kZWwgfSBmcm9tICdvYmplY3Rpb24nO1xuaW1wb3J0IHt0cmFuc2Zvcm0sIHNuYWtlQ2FzZX0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7bWFwS2V5c0RlZXB9IGZyb20gJ0AvdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb2RlbEJhc2UgZXh0ZW5kcyBNb2RlbCB7XG4gIHN0YXRpYyBnZXQgY29sbGVjdGlvbigpIHtcbiAgICByZXR1cm4gQXJyYXk7XG4gIH1cblxuICBzdGF0aWMgcXVlcnkoLi4uYXJncykge1xuICAgIHJldHVybiBzdXBlci5xdWVyeSguLi5hcmdzKS5ydW5BZnRlcigocmVzdWx0KSA9PiB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uZnJvbShyZXN1bHQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9KTtcbiAgfVxuXG4gICRmb3JtYXRKc29uKGpzb24sIG9wdCkge1xuICAgIGNvbnN0IHRyYW5zZm9ybWVkID0gbWFwS2V5c0RlZXAoanNvbiwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIHJldHVybiBzbmFrZUNhc2Uoa2V5KTtcbiAgICB9KTtcbiAgICBjb25zdCBwYXJzZWRKc29uID0gc3VwZXIuJGZvcm1hdEpzb24odHJhbnNmb3JtZWQsIG9wdCk7XG5cbiAgICByZXR1cm4gcGFyc2VkSnNvbjtcbiAgfVxufVxuIiwiaW1wb3J0IHsgbWl4aW4gfSBmcm9tICdvYmplY3Rpb24nO1xuaW1wb3J0IEJhc2VNb2RlbCBmcm9tICdAL21vZGVscy9Nb2RlbCc7XG5pbXBvcnQgTWV0YWJsZUNvbGxlY3Rpb24gZnJvbSAnQC9saWIvTWV0YWJsZS9NZXRhYmxlQ29sbGVjdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9wdGlvbiBleHRlbmRzIG1peGluKEJhc2VNb2RlbCwgW21peGluXSkge1xuICAvKipcbiAgICogVGFibGUgbmFtZS5cbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAnb3B0aW9ucyc7XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGUgdGhlIG1vZGVsIHF1ZXJ5LlxuICAgKiBAcGFyYW0gIHsuLi5hbnl9IGFyZ3MgLVxuICAgKi9cbiAgc3RhdGljIHF1ZXJ5KC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gc3VwZXIucXVlcnkoLi4uYXJncykucnVuQWZ0ZXIoKHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIE1ldGFibGVDb2xsZWN0aW9uKSB7XG4gICAgICAgIHJlc3VsdC5zZXRNb2RlbChPcHRpb24pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgY29sbGVjdGlvbigpIHtcbiAgICByZXR1cm4gTWV0YWJsZUNvbGxlY3Rpb247XG4gIH1cbn1cbiIsImltcG9ydCBNb2RlbCBmcm9tICdAL21vZGVscy9Nb2RlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhc3N3b3JkUmVzZXRzIGV4dGVuZHMgTW9kZWwge1xuICAvKipcbiAgICogVGFibGUgbmFtZVxuICAgKi9cbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICdwYXNzd29yZF9yZXNldHMnO1xuICB9XG59XG4iLCJpbXBvcnQgeyBNb2RlbCB9IGZyb20gJ29iamVjdGlvbic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBCYXNlTW9kZWwgZnJvbSAnQC9tb2RlbHMvTW9kZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQZXJtaXNzaW9uIGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWUgb2YgUm9sZSBtb2RlbC5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAncGVybWlzc2lvbnMnO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGF0aW9uc2hpcCBtYXBwaW5nLlxuICAgKi9cbiAgc3RhdGljIGdldCByZWxhdGlvbk1hcHBpbmdzKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvKipcbiAgICAgICAqIFBlcm1pc3Npb24gbW9kZWwgbWF5IGJlbG9uZ3MgdG8gcm9sZSBtb2RlbC5cbiAgICAgICAqL1xuICAgICAgcm9sZToge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuQmVsb25nc1RvT25lUmVsYXRpb24sXG4gICAgICAgIG1vZGVsQmFzZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ1JvbGUnKSxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICdwZXJtaXNzaW9ucy5yb2xlX2lkJyxcbiAgICAgICAgICB0bzogJ3JvbGVzLmlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG5cbiAgICAgIC8vIHJlc291cmNlOiB7XG4gICAgICAvLyAgIHJlbGF0aW9uOiBNb2RlbC5CZWxvbmdzVG9PbmVSZWxhdGlvbixcbiAgICAgIC8vICAgbW9kZWxCYXNlOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnUmVzb3VyY2UnKSxcbiAgICAgIC8vICAgam9pbjoge1xuICAgICAgLy8gICAgIGZyb206ICdwZXJtaXNzaW9ucy4nLFxuICAgICAgLy8gICAgIHRvOiAnJyxcbiAgICAgIC8vICAgfVxuICAgICAgLy8gfVxuICAgIH07XG4gIH1cbn1cbiIsImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICdvYmplY3Rpb24nO1xuaW1wb3J0IEJhc2VNb2RlbCBmcm9tICdAL21vZGVscy9Nb2RlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc291cmNlIGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWUuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3Jlc291cmNlcyc7XG4gIH1cblxuICAvKipcbiAgICogVGltZXN0YW1wIGNvbHVtbnMuXG4gICAqL1xuICBzdGF0aWMgZ2V0IGhhc1RpbWVzdGFtcHMoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGF0aW9uc2hpcCBtYXBwaW5nLlxuICAgKi9cbiAgc3RhdGljIGdldCByZWxhdGlvbk1hcHBpbmdzKCkge1xuICAgIGNvbnN0IFZpZXcgPSByZXF1aXJlKCdAL21vZGVscy9WaWV3Jyk7XG4gICAgY29uc3QgUmVzb3VyY2VGaWVsZCA9IHJlcXVpcmUoJ0AvbW9kZWxzL1Jlc291cmNlRmllbGQnKTtcbiAgICBjb25zdCBQZXJtaXNzaW9uID0gcmVxdWlyZSgnQC9tb2RlbHMvUGVybWlzc2lvbicpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8qKlxuICAgICAgICogUmVzb3VyY2UgbW9kZWwgbWF5IGhhcyBtYW55IHZpZXdzLlxuICAgICAgICovXG4gICAgICB2aWV3czoge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuSGFzTWFueVJlbGF0aW9uLFxuICAgICAgICBtb2RlbENsYXNzOiBWaWV3LmRlZmF1bHQsXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAncmVzb3VyY2VzLmlkJyxcbiAgICAgICAgICB0bzogJ3ZpZXdzLnJlc291cmNlSWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBSZXNvdXJjZSBtb2RlbCBtYXkgaGFzIG1hbnkgZmllbGRzLlxuICAgICAgICovXG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkhhc01hbnlSZWxhdGlvbixcbiAgICAgICAgbW9kZWxDbGFzczogUmVzb3VyY2VGaWVsZC5kZWZhdWx0LFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ3Jlc291cmNlcy5pZCcsXG4gICAgICAgICAgdG86ICdyZXNvdXJjZV9maWVsZHMucmVzb3VyY2VJZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFJlc291cmNlIG1vZGVsIG1heSBoYXMgbWFueSBhc3NvY2lhdGVkIHBlcm1pc3Npb25zLlxuICAgICAgICovXG4gICAgICBwZXJtaXNzaW9uczoge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuTWFueVRvTWFueVJlbGF0aW9uLFxuICAgICAgICBtb2RlbENsYXNzOiBQZXJtaXNzaW9uLmRlZmF1bHQsXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAncmVzb3VyY2VzLmlkJyxcbiAgICAgICAgICB0aHJvdWdoOiB7XG4gICAgICAgICAgICBmcm9tOiAncm9sZV9oYXNfcGVybWlzc2lvbnMucmVzb3VyY2VJZCcsXG4gICAgICAgICAgICB0bzogJ3JvbGVfaGFzX3Blcm1pc3Npb25zLnBlcm1pc3Npb25JZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0bzogJ3Blcm1pc3Npb25zLmlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgc25ha2VDYXNlIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnb2JqZWN0aW9uJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEJhc2VNb2RlbCBmcm9tICdAL21vZGVscy9Nb2RlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc291cmNlRmllbGQgZXh0ZW5kcyBCYXNlTW9kZWwge1xuICAvKipcbiAgICogVGFibGUgbmFtZS5cbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAncmVzb3VyY2VfZmllbGRzJztcbiAgfVxuXG4gIHN0YXRpYyBnZXQganNvbkF0dHJpYnV0ZXMoKSB7XG4gICAgcmV0dXJuIFsnb3B0aW9ucyddO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vZGVsIG1vZGlmaWVycy5cbiAgICovXG4gIHN0YXRpYyBnZXQgbW9kaWZpZXJzKCkge1xuICAgIHJldHVybiB7XG4gICAgICB3aGVyZU5vdFByZWRlZmluZWQocXVlcnkpIHtcbiAgICAgICAgcXVlcnkud2hlcmVOb3QoJ3ByZWRlZmluZWQnLCB0cnVlKTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaW1lc3RhbXAgY29sdW1ucy5cbiAgICovXG4gIHN0YXRpYyBnZXQgaGFzVGltZXN0YW1wcygpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogVmlydHVhbCBhdHRyaWJ1dGVzLlxuICAgKi9cbiAgc3RhdGljIGdldCB2aXJ0dWFsQXR0cmlidXRlcygpIHtcbiAgICByZXR1cm4gWydrZXknXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNvdXJjZSBmaWVsZCBrZXkuXG4gICAqL1xuICBrZXkoKSB7XG4gICAgcmV0dXJuIHNuYWtlQ2FzZSh0aGlzLmxhYmVsTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVsYXRpb25zaGlwIG1hcHBpbmcuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHJlbGF0aW9uTWFwcGluZ3MoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8qKlxuICAgICAgICogUmVzb3VyY2UgZmllbGQgbWF5IGJlbG9uZ3MgdG8gcmVzb3VyY2UgbW9kZWwuXG4gICAgICAgKi9cbiAgICAgIHJlc291cmNlOiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5CZWxvbmdzVG9PbmVSZWxhdGlvbixcbiAgICAgICAgbW9kZWxCYXNlOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnUmVzb3VyY2UnKSxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICdyZXNvdXJjZV9maWVsZHMucmVzb3VyY2VfaWQnLFxuICAgICAgICAgIHRvOiAncmVzb3VyY2VzLmlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTW9kZWwgfSBmcm9tICdvYmplY3Rpb24nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgQmFzZU1vZGVsIGZyb20gJ0AvbW9kZWxzL01vZGVsJztcbmltcG9ydCBSZXNvdXJjZUZpZWxkTWV0YWRhdGFDb2xsZWN0aW9uIGZyb20gJ0AvY29sbGVjdGlvbi9SZXNvdXJjZUZpZWxkTWV0YWRhdGFDb2xsZWN0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVzb3VyY2VGaWVsZE1ldGFkYXRhIGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWUuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3Jlc291cmNlX2N1c3RvbV9maWVsZHNfbWV0YWRhdGEnO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIHRoZSByZXNvdXJjZSBmaWVsZCBtZXRhZGF0YSBjb2xsZWN0aW9uLlxuICAgKi9cbiAgc3RhdGljIGdldCBjb2xsZWN0aW9uKCkge1xuICAgIHJldHVybiBSZXNvdXJjZUZpZWxkTWV0YWRhdGFDb2xsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGF0aW9uc2hpcCBtYXBwaW5nLlxuICAgKi9cbiAgc3RhdGljIGdldCByZWxhdGlvbk1hcHBpbmdzKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvKipcbiAgICAgICAqIFJlc291cmNlIGZpZWxkIG1heSBiZWxvbmdzIHRvIHJlc291cmNlIG1vZGVsLlxuICAgICAgICovXG4gICAgICByZXNvdXJjZToge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuQmVsb25nc1RvT25lUmVsYXRpb24sXG4gICAgICAgIG1vZGVsQmFzZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ1Jlc291cmNlJyksXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAncmVzb3VyY2VfZmllbGRzLnJlc291cmNlX2lkJyxcbiAgICAgICAgICB0bzogJ3Jlc291cmNlcy5pZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cbiIsImltcG9ydCB7IE1vZGVsIH0gZnJvbSAnb2JqZWN0aW9uJztcbmltcG9ydCBCYXNlTW9kZWwgZnJvbSAnQC9tb2RlbHMvTW9kZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb2xlIGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLyoqXG4gICAqIFRhYmxlIG5hbWUgb2YgUm9sZSBtb2RlbC5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAncm9sZXMnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRpbWVzdGFtcCBjb2x1bW5zLlxuICAgKi9cbiAgc3RhdGljIGdldCBoYXNUaW1lc3RhbXBzKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxhdGlvbnNoaXAgbWFwcGluZy5cbiAgICovXG4gIHN0YXRpYyBnZXQgcmVsYXRpb25NYXBwaW5ncygpIHtcbiAgICBjb25zdCBQZXJtaXNzaW9uID0gcmVxdWlyZSgnQC9tb2RlbHMvUGVybWlzc2lvbicpO1xuICAgIGNvbnN0IFJlc291cmNlID0gcmVxdWlyZSgnQC9tb2RlbHMvUmVzb3VyY2UnKTtcbiAgICBjb25zdCBVc2VyID0gcmVxdWlyZSgnQC9tb2RlbHMvVXNlcicpO1xuICAgIGNvbnN0IFJlc291cmNlRmllbGQgPSByZXF1aXJlKCdAL21vZGVscy9SZXNvdXJjZUZpZWxkJyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLyoqXG4gICAgICAgKiBSb2xlIG1heSBoYXMgbWFueSBwZXJtaXNzaW9ucy5cbiAgICAgICAqL1xuICAgICAgcGVybWlzc2lvbnM6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLk1hbnlUb01hbnlSZWxhdGlvbixcbiAgICAgICAgbW9kZWxDbGFzczogUGVybWlzc2lvbi5kZWZhdWx0LFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ3JvbGVzLmlkJyxcbiAgICAgICAgICB0aHJvdWdoOiB7XG4gICAgICAgICAgICBmcm9tOiAncm9sZV9oYXNfcGVybWlzc2lvbnMucm9sZUlkJyxcbiAgICAgICAgICAgIHRvOiAncm9sZV9oYXNfcGVybWlzc2lvbnMucGVybWlzc2lvbklkJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRvOiAncGVybWlzc2lvbnMuaWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBSb2xlIG1heSBoYXMgbWFueSByZXNvdXJjZXMuXG4gICAgICAgKi9cbiAgICAgIHJlc291cmNlczoge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuTWFueVRvTWFueVJlbGF0aW9uLFxuICAgICAgICBtb2RlbENsYXNzOiBSZXNvdXJjZS5kZWZhdWx0LFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ3JvbGVzLmlkJyxcbiAgICAgICAgICB0aHJvdWdoOiB7XG4gICAgICAgICAgICBmcm9tOiAncm9sZV9oYXNfcGVybWlzc2lvbnMucm9sZUlkJyxcbiAgICAgICAgICAgIHRvOiAncm9sZV9oYXNfcGVybWlzc2lvbnMucmVzb3VyY2VJZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0bzogJ3Jlc291cmNlcy5pZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFJvbGUgbWF5IGhhcyByZXNvdXJjZSBmaWVsZC5cbiAgICAgICAqL1xuICAgICAgZmllbGQ6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkJlbG9uZ3NUb09uZVJlbGF0aW9uLFxuICAgICAgICBtb2RlbENsYXNzOiBSZXNvdXJjZUZpZWxkLmRlZmF1bHQsXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAncm9sZXMuZmllbGRJZCcsXG4gICAgICAgICAgdG86ICdyZXNvdXJjZV9maWVsZHMuaWQnLFxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFJvbGUgbWF5IGhhcyBtYW55IGFzc29jaWF0ZWQgdXNlcnMuXG4gICAgICAgKi9cbiAgICAgIHVzZXJzOiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5NYW55VG9NYW55UmVsYXRpb24sXG4gICAgICAgIG1vZGVsQ2xhc3M6IFVzZXIuZGVmYXVsdCxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICdyb2xlcy5pZCcsXG4gICAgICAgICAgdGhyb3VnaDoge1xuICAgICAgICAgICAgZnJvbTogJ3VzZXJfaGFzX3JvbGVzLnJvbGVJZCcsXG4gICAgICAgICAgICB0bzogJ3VzZXJfaGFzX3JvbGVzLnVzZXJJZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0bzogJ3VzZXJzLmlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHRqcyc7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJ29iamVjdGlvbic7XG5pbXBvcnQgQmFzZU1vZGVsIGZyb20gJ0AvbW9kZWxzL01vZGVsJztcbi8vIGltcG9ydCBQZXJtaXNzaW9uc1NlcnZpY2UgZnJvbSAnQC9zZXJ2aWNlcy9QZXJtaXNzaW9uc1NlcnZpY2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVc2VyIGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgLy8gLi4uUGVybWlzc2lvbnNTZXJ2aWNlXG5cbiAgc3RhdGljIGdldCB2aXJ0dWFsQXR0cmlidXRlcygpIHtcbiAgICByZXR1cm4gWydmdWxsTmFtZSddO1xuICB9XG5cbiAgLyoqXG4gICAqIFRhYmxlIG5hbWVcbiAgICovXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAndXNlcnMnO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGF0aW9uc2hpcCBtYXBwaW5nLlxuICAgKi9cbiAgc3RhdGljIGdldCByZWxhdGlvbk1hcHBpbmdzKCkge1xuICAgIGNvbnN0IFJvbGUgPSByZXF1aXJlKCdAL21vZGVscy9Sb2xlJyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgcm9sZXM6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLk1hbnlUb01hbnlSZWxhdGlvbixcbiAgICAgICAgbW9kZWxDbGFzczogUm9sZS5kZWZhdWx0LFxuICAgICAgICBqb2luOiB7XG4gICAgICAgICAgZnJvbTogJ3VzZXJzLmlkJyxcbiAgICAgICAgICB0aHJvdWdoOiB7XG4gICAgICAgICAgICBmcm9tOiAndXNlcl9oYXNfcm9sZXMudXNlcklkJyxcbiAgICAgICAgICAgIHRvOiAndXNlcl9oYXNfcm9sZXMucm9sZUlkJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRvOiAncm9sZXMuaWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFZlcmlmeSB0aGUgcGFzc3dvcmQgb2YgdGhlIHVzZXIuXG4gICAqIEBwYXJhbSAge1N0cmluZ30gcGFzc3dvcmQgLSBUaGUgZ2l2ZW4gcGFzc3dvcmQuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICB2ZXJpZnlQYXNzd29yZChwYXNzd29yZCkge1xuICAgIHJldHVybiBiY3J5cHQuY29tcGFyZVN5bmMocGFzc3dvcmQsIHRoaXMucGFzc3dvcmQpO1xuICB9XG5cbiAgZnVsbE5hbWUoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuZmlyc3ROYW1lfSAke3RoaXMubGFzdE5hbWV9YDtcbiAgfVxufVxuIiwiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJ29iamVjdGlvbic7XG5pbXBvcnQgQmFzZU1vZGVsIGZyb20gJ0AvbW9kZWxzL01vZGVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlldyBleHRlbmRzIEJhc2VNb2RlbCB7XG4gIC8qKlxuICAgKiBUYWJsZSBuYW1lLlxuICAgKi9cbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICd2aWV3cyc7XG4gIH1cblxuICAvKipcbiAgICogUmVsYXRpb25zaGlwIG1hcHBpbmcuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHJlbGF0aW9uTWFwcGluZ3MoKSB7XG4gICAgY29uc3QgUmVzb3VyY2UgPSByZXF1aXJlKCdAL21vZGVscy9SZXNvdXJjZScpO1xuICAgIGNvbnN0IFZpZXdDb2x1bW4gPSByZXF1aXJlKCdAL21vZGVscy9WaWV3Q29sdW1uJyk7XG4gICAgY29uc3QgVmlld1JvbGUgPSByZXF1aXJlKCdAL21vZGVscy9WaWV3Um9sZScpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8qKlxuICAgICAgICogVmlldyBtb2RlbCBiZWxvbmdzIHRvIHJlc291cmNlIG1vZGVsLlxuICAgICAgICovXG4gICAgICByZXNvdXJjZToge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuQmVsb25nc1RvT25lUmVsYXRpb24sXG4gICAgICAgIG1vZGVsQ2xhc3M6IFJlc291cmNlLmRlZmF1bHQsXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAndmlld3MucmVzb3VyY2VJZCcsXG4gICAgICAgICAgdG86ICdyZXNvdXJjZXMuaWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBWaWV3IG1vZGVsIG1heSBoYXMgbWFueSBjb2x1bW5zLlxuICAgICAgICovXG4gICAgICBjb2x1bW5zOiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5IYXNNYW55UmVsYXRpb24sXG4gICAgICAgIG1vZGVsQ2xhc3M6IFZpZXdDb2x1bW4uZGVmYXVsdCxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICd2aWV3cy5pZCcsXG4gICAgICAgICAgdG86ICd2aWV3X2hhc19jb2x1bW5zLnZpZXdJZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFZpZXcgbW9kZWwgbWF5IGhhcyBtYW55IHZpZXcgcm9sZXMuXG4gICAgICAgKi9cbiAgICAgIHJvbGVzOiB7XG4gICAgICAgIHJlbGF0aW9uOiBNb2RlbC5IYXNNYW55UmVsYXRpb24sXG4gICAgICAgIG1vZGVsQ2xhc3M6IFZpZXdSb2xlLmRlZmF1bHQsXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAndmlld3MuaWQnLFxuICAgICAgICAgIHRvOiAndmlld19yb2xlcy52aWV3SWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZU1vZGVsIGZyb20gJ0AvbW9kZWxzL01vZGVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlld0NvbHVtbiBleHRlbmRzIEJhc2VNb2RlbCB7XG4gIC8qKlxuICAgKiBUYWJsZSBuYW1lLlxuICAgKi9cbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICd2aWV3X2hhc19jb2x1bW5zJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaW1lc3RhbXAgY29sdW1ucy5cbiAgICovXG4gIHN0YXRpYyBnZXQgaGFzVGltZXN0YW1wcygpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCB7IE1vZGVsIH0gZnJvbSAnb2JqZWN0aW9uJztcbmltcG9ydCBCYXNlTW9kZWwgZnJvbSAnQC9tb2RlbHMvTW9kZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3Um9sZSBleHRlbmRzIEJhc2VNb2RlbCB7XG5cbiAgLyoqXG4gICAqIFZpcnR1YWwgYXR0cmlidXRlcy5cbiAgICovXG4gIHN0YXRpYyBnZXQgdmlydHVhbEF0dHJpYnV0ZXMoKSB7XG4gICAgcmV0dXJuIFsnY29tcGFyYXRvcnMnXTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgY29tcGFyYXRvcnMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICdlcXVhbHMnLCAnbm90X2VxdWFsJywgJ2NvbnRhaW5zJywgJ25vdF9jb250YWluJyxcbiAgICBdO1xuICB9XG5cbiAgLyoqXG4gICAqIFRhYmxlIG5hbWUuXG4gICAqL1xuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3ZpZXdfcm9sZXMnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRpbWVzdGFtcCBjb2x1bW5zLlxuICAgKi9cbiAgc3RhdGljIGdldCBoYXNUaW1lc3RhbXBzKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxhdGlvbnNoaXAgbWFwcGluZy5cbiAgICovXG4gIHN0YXRpYyBnZXQgcmVsYXRpb25NYXBwaW5ncygpIHtcbiAgICBjb25zdCBSZXNvdXJjZUZpZWxkID0gcmVxdWlyZSgnQC9tb2RlbHMvUmVzb3VyY2VGaWVsZCcpO1xuICAgIGNvbnN0IFZpZXcgPSByZXF1aXJlKCdAL21vZGVscy9WaWV3Jyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLyoqXG4gICAgICAgKiBWaWV3IHJvbGUgbW9kZWwgbWF5IGJlbG9uZ3MgdG8gdmlldyBtb2RlbC5cbiAgICAgICAqL1xuICAgICAgdmlldzoge1xuICAgICAgICByZWxhdGlvbjogTW9kZWwuQmVsb25nc1RvT25lUmVsYXRpb24sXG4gICAgICAgIG1vZGVsQ2xhc3M6IFZpZXcuZGVmYXVsdCxcbiAgICAgICAgam9pbjoge1xuICAgICAgICAgIGZyb206ICd2aWV3X3JvbGVzLnZpZXdJZCcsXG4gICAgICAgICAgdG86ICd2aWV3cy5pZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFZpZXcgcm9sZSBtb2RlbCBtYXkgYmVsb25ncyB0byByZXNvdXJjZSBmaWVsZCBtb2RlbC5cbiAgICAgICAqL1xuICAgICAgZmllbGQ6IHtcbiAgICAgICAgcmVsYXRpb246IE1vZGVsLkJlbG9uZ3NUb09uZVJlbGF0aW9uLFxuICAgICAgICBtb2RlbENsYXNzOiBSZXNvdXJjZUZpZWxkLmRlZmF1bHQsXG4gICAgICAgIGpvaW46IHtcbiAgICAgICAgICBmcm9tOiAndmlld19yb2xlcy5maWVsZElkJyxcbiAgICAgICAgICB0bzogJ3Jlc291cmNlX2ZpZWxkcy5pZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cbiIsImltcG9ydCB7IE1vZGVsIH0gZnJvbSAnb2JqZWN0aW9uJztcbmltcG9ydCBrbmV4IGZyb20gJ0AvZGF0YWJhc2Uva25leCc7XG5cbi8vIEJpbmQgYWxsIE1vZGVscyB0byBhIGtuZXggaW5zdGFuY2UuIElmIHlvdSBvbmx5IGhhdmUgb25lIGRhdGFiYXNlIGluXG4vLyB5b3VyIHNlcnZlciB0aGlzIGlzIGFsbCB5b3UgaGF2ZSB0byBkby4gRm9yIG11bHRpIGRhdGFiYXNlIHN5c3RlbXMsIHNlZVxuLy8gdGhlIE1vZGVsLmJpbmRLbmV4KCkgbWV0aG9kLlxuTW9kZWwua25leChrbmV4KTtcbiIsImltcG9ydCBlcnJvckhhbmRsZXIgZnJvbSAnZXJyb3JoYW5kbGVyJztcbmltcG9ydCBhcHAgZnJvbSAnQC9hcHAnO1xuXG5hcHAudXNlKGVycm9ySGFuZGxlcik7XG5cbmNvbnN0IHNlcnZlciA9IGFwcC5saXN0ZW4oYXBwLmdldCgncG9ydCcpLCAoKSA9PiB7XG4gIGNvbnNvbGUubG9nKFxuICAgICcgIEFwcCBpcyBydW5uaW5nIGF0IGh0dHA6Ly9sb2NhbGhvc3Q6JWQgaW4gJXMgbW9kZScsXG4gICAgYXBwLmdldCgncG9ydCcpLFxuICAgIGFwcC5nZXQoJ2VudicpLFxuICApO1xuICBjb25zb2xlLmxvZygnICBQcmVzcyBDVFJMLUMgdG8gc3RvcCcpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHNlcnZlcjtcbiIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSm91cm5hbEVudHJ5IHtcbiAgY29uc3RydWN0b3IoZW50cnkpIHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGNyZWRpdDogMCxcbiAgICAgIGRlYml0OiAwLFxuICAgIH07XG4gICAgdGhpcy5lbnRyeSA9IHsgLi4uZGVmYXVsdHMsIC4uLmVudHJ5IH07XG4gIH1cbn1cbiIsImltcG9ydCB7IHBpY2sgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IEpvdXJuYWxFbnRyeSBmcm9tICdAL3NlcnZpY2VzL0FjY291bnRpbmcvSm91cm5hbEVudHJ5JztcbmltcG9ydCBBY2NvdW50VHJhbnNhY3Rpb24gZnJvbSAnQC9tb2RlbHMvQWNjb3VudFRyYW5zYWN0aW9uJztcbmltcG9ydCBBY2NvdW50QmFsYW5jZSBmcm9tICdAL21vZGVscy9BY2NvdW50QmFsYW5jZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEpvdXJuYWxQb3N0ZXIge1xuICAvKipcbiAgICogSm91cm5hbCBwb3N0ZXIgY29uc3RydWN0b3IuXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVudHJpZXMgPSBbXTtcbiAgICB0aGlzLmJhbGFuY2VzQ2hhbmdlID0ge307XG4gIH1cblxuICAvKipcbiAgICogV3JpdGVzIHRoZSBjcmVkaXQgZW50cnkgZm9yIHRoZSBnaXZlbiBhY2NvdW50LlxuICAgKiBAcGFyYW0ge0pvdXJuYWxFbnRyeX0gZW50cnkgLVxuICAgKi9cbiAgY3JlZGl0KGVudHJ5TW9kZWwpIHtcbiAgICBpZiAoZW50cnlNb2RlbCBpbnN0YW5jZW9mIEpvdXJuYWxFbnRyeSA9PT0gZmFsc2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGVudHJ5IGlzIG5vdCBpbnN0YW5jZSBvZiBKb3VybmFsRW50cnkuJyk7XG4gICAgfVxuICAgIHRoaXMuZW50cmllcy5wdXNoKGVudHJ5TW9kZWwuZW50cnkpO1xuICAgIHRoaXMuc2V0QWNjb3VudEJhbGFuY2VDaGFuZ2UoZW50cnlNb2RlbC5lbnRyeSwgJ2NyZWRpdCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyaXRlcyB0aGUgZGViaXQgZW50cnkgZm9yIHRoZSBnaXZlbiBhY2NvdW50LlxuICAgKiBAcGFyYW0ge0pvdXJuYWxFbnRyeX0gZW50cnkgLVxuICAgKi9cbiAgZGViaXQoZW50cnlNb2RlbCkge1xuICAgIGlmIChlbnRyeU1vZGVsIGluc3RhbmNlb2YgSm91cm5hbEVudHJ5ID09PSBmYWxzZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgZW50cnkgaXMgbm90IGluc3RhbmNlIG9mIEpvdXJuYWxFbnRyeS4nKTtcbiAgICB9XG4gICAgdGhpcy5lbnRyaWVzLnB1c2goZW50cnlNb2RlbC5lbnRyeSk7XG4gICAgdGhpcy5zZXRBY2NvdW50QmFsYW5jZUNoYW5nZShlbnRyeU1vZGVsLmVudHJ5LCAnZGViaXQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGFjY291bnQgYmFsYW5jZSBjaGFuZ2UuXG4gICAqIEBwYXJhbSB7Sm91cm5hbEVudHJ5fSBlbnRyeVxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICAgKi9cbiAgc2V0QWNjb3VudEJhbGFuY2VDaGFuZ2UoZW50cnksIHR5cGUpIHtcbiAgICBpZiAoIXRoaXMuYmFsYW5jZXNDaGFuZ2VbZW50cnkuYWNjb3VudF0pIHtcbiAgICAgIHRoaXMuYmFsYW5jZXNDaGFuZ2VbZW50cnkuYWNjb3VudF0gPSAwO1xuICAgIH1cbiAgICBsZXQgY2hhbmdlID0gMDtcblxuICAgIGlmIChlbnRyeS5hY2NvdW50Tm9ybWFsID09PSAnY3JlZGl0Jykge1xuICAgICAgY2hhbmdlID0gKHR5cGUgPT09ICdjcmVkaXQnKSA/IGVudHJ5LmNyZWRpdCA6IC0xICogZW50cnkuZGViaXQ7XG4gICAgfSBlbHNlIGlmIChlbnRyeS5hY2NvdW50Tm9ybWFsID09PSAnZGViaXQnKSB7XG4gICAgICBjaGFuZ2UgPSAodHlwZSA9PT0gJ2RlYml0JykgPyBlbnRyeS5kZWJpdCA6IC0xICogZW50cnkuY3JlZGl0O1xuICAgIH1cbiAgICB0aGlzLmJhbGFuY2VzQ2hhbmdlW2VudHJ5LmFjY291bnRdICs9IGNoYW5nZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXBwaW5nIHRoZSBiYWxhbmNlIGNoYW5nZSB0byBsaXN0LlxuICAgKi9cbiAgbWFwQmFsYW5jZUNoYW5nZXNUb0xpc3QoKSB7XG4gICAgY29uc3QgbWFwcGVkTGlzdCA9IFtdO1xuXG4gICAgT2JqZWN0LmtleXModGhpcy5iYWxhbmNlc0NoYW5nZSkuZm9yRWFjaCgoYWNjb3VudElkKSA9PiB7XG4gICAgICBjb25zdCBiYWxhbmNlID0gdGhpcy5iYWxhbmNlc0NoYW5nZVthY2NvdW50SWRdO1xuXG4gICAgICBtYXBwZWRMaXN0LnB1c2goe1xuICAgICAgICBhY2NvdW50X2lkOiBhY2NvdW50SWQsXG4gICAgICAgIGFtb3VudDogYmFsYW5jZSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBtYXBwZWRMaXN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmVzIHRoZSBiYWxhbmNlIGNoYW5nZSBvZiBqb3VybmFsIGVudHJpZXMuXG4gICAqL1xuICBhc3luYyBzYXZlQmFsYW5jZSgpIHtcbiAgICBjb25zdCBiYWxhbmNlc0xpc3QgPSB0aGlzLm1hcEJhbGFuY2VDaGFuZ2VzVG9MaXN0KCk7XG4gICAgY29uc3QgYmFsYW5jZVVwZGF0ZU9wZXJzID0gW107XG4gICAgY29uc3QgYmFsYW5jZUluc2VydE9wZXJzID0gW107XG4gICAgY29uc3QgYmFsYW5jZUZpbmRPbmVPcGVycyA9IFtdO1xuICAgIGxldCBiYWxhbmNlQWNjb3VudHMgPSBbXTtcblxuICAgIGJhbGFuY2VzTGlzdC5mb3JFYWNoKChiYWxhbmNlKSA9PiB7XG4gICAgICBjb25zdCBvcGVyID0gQWNjb3VudEJhbGFuY2UucXVlcnkoKS5maW5kT25lKCdhY2NvdW50X2lkJywgYmFsYW5jZS5hY2NvdW50X2lkKTtcbiAgICAgIGJhbGFuY2VGaW5kT25lT3BlcnMucHVzaChvcGVyKTtcbiAgICB9KTtcbiAgICBiYWxhbmNlQWNjb3VudHMgPSBhd2FpdCBQcm9taXNlLmFsbChiYWxhbmNlRmluZE9uZU9wZXJzKTtcblxuICAgIGJhbGFuY2VzTGlzdC5mb3JFYWNoKChiYWxhbmNlKSA9PiB7XG4gICAgICBjb25zdCBtZXRob2QgPSBiYWxhbmNlLmFtb3VudCA8IDAgPyAnZGVjcmVtZW50JyA6ICdpbmNyZW1lbnQnO1xuXG4gICAgICAvLyBEZXRhcm1pbmUgaWYgdGhlIGFjY291bnQgYmFsYW5jZSBpcyBhbHJlYWR5IGV4aXN0cyBvciBub3QuXG4gICAgICBjb25zdCBmb3VuZEFjY0JhbGFuY2UgPSBiYWxhbmNlQWNjb3VudHMuc29tZSgoYWNjb3VudCkgPT4gKFxuICAgICAgICBhY2NvdW50ICYmIGFjY291bnQuYWNjb3VudF9pZCA9PT0gYmFsYW5jZS5hY2NvdW50X2lkXG4gICAgICApKTtcbiAgICAgIGlmIChmb3VuZEFjY0JhbGFuY2UpIHtcbiAgICAgICAgY29uc3QgcXVlcnkgPSBBY2NvdW50QmFsYW5jZVxuICAgICAgICAgIC5xdWVyeSgpW21ldGhvZF0oJ2Ftb3VudCcsIE1hdGguYWJzKGJhbGFuY2UuYW1vdW50KSlcbiAgICAgICAgICAud2hlcmUoJ2FjY291bnRfaWQnLCBiYWxhbmNlLmFjY291bnRfaWQpO1xuXG4gICAgICAgIGJhbGFuY2VVcGRhdGVPcGVycy5wdXNoKHF1ZXJ5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gQWNjb3VudEJhbGFuY2UucXVlcnkoKS5pbnNlcnQoe1xuICAgICAgICAgIGFjY291bnRfaWQ6IGJhbGFuY2UuYWNjb3VudF9pZCxcbiAgICAgICAgICBhbW91bnQ6IGJhbGFuY2UuYW1vdW50LFxuICAgICAgICAgIGN1cnJlbmN5X2NvZGU6ICdVU0QnLFxuICAgICAgICB9KTtcbiAgICAgICAgYmFsYW5jZUluc2VydE9wZXJzLnB1c2gocXVlcnkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIC4uLmJhbGFuY2VVcGRhdGVPcGVycywgLi4uYmFsYW5jZUluc2VydE9wZXJzLFxuICAgIF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmVzIHRoZSBzdGFja2VkIGpvdXJuYWwgZW50cmllcyB0byB0aGUgc3RvcmFnZS5cbiAgICovXG4gIGFzeW5jIHNhdmVFbnRyaWVzKCkge1xuICAgIGNvbnN0IHNhdmVPcGVyYXRpb25zID0gW107XG5cbiAgICB0aGlzLmVudHJpZXMuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgIGNvbnN0IG9wZXIgPSBBY2NvdW50VHJhbnNhY3Rpb24ucXVlcnkoKS5pbnNlcnQoe1xuICAgICAgICBhY2NvdW50SWQ6IGVudHJ5LmFjY291bnQsXG4gICAgICAgIC4uLnBpY2soZW50cnksIFsnY3JlZGl0JywgJ2RlYml0JywgJ3RyYW5zYWN0aW9uVHlwZScsXG4gICAgICAgICAgJ3JlZmVyZW5jZVR5cGUnLCAncmVmZXJlbmNlSWQnLCAnbm90ZSddKSxcbiAgICAgIH0pO1xuICAgICAgc2F2ZU9wZXJhdGlvbnMucHVzaChvcGVyKTtcbiAgICB9KTtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChzYXZlT3BlcmF0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmV2ZXJzZXMgdGhlIHN0YWNrZWQgam91cm5hbCBlbnRyaWVzLlxuICAgKi9cbiAgcmV2ZXJzZUVudHJpZXMoKSB7XG4gICAgY29uc3QgcmV2ZXJzZUVudHJpZXMgPSBbXTtcblxuICAgIHRoaXMuZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgY29uc3QgcmV2ZXJzZUVudHJ5ID0geyAuLi5lbnRyeSB9O1xuXG4gICAgICBpZiAoZW50cnkuY3JlZGl0KSB7XG4gICAgICAgIHJldmVyc2VFbnRyeS5kZWJpdCA9IGVudHJ5LmNyZWRpdDtcbiAgICAgIH1cbiAgICAgIGlmIChlbnRyeS5kZWJpdCkge1xuICAgICAgICByZXZlcnNlRW50cnkuY3JlZGl0ID0gZW50cnkuZGViaXQ7XG4gICAgICB9XG4gICAgICByZXZlcnNlRW50cmllcy5wdXNoKHJldmVyc2VFbnRyeSk7XG4gICAgfSk7XG4gICAgdGhpcy5lbnRyaWVzID0gcmV2ZXJzZUVudHJpZXM7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIHRoZSBnaXZlbiBvciBhbGwgc3RhY2tlZCBlbnRyaWVzLlxuICAgKiBAcGFyYW0ge0FycmF5fSBpZHMgLVxuICAgKi9cbiAgYXN5bmMgZGVsZXRlRW50cmllcyhpZHMpIHtcbiAgICBjb25zdCBlbnRyaWVzSWRzID0gaWRzIHx8IHRoaXMuZW50cmllcy5tYXAoKGUpID0+IGUuaWQpO1xuXG4gICAgaWYgKGVudHJpZXNJZHMubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgQWNjb3VudFRyYW5zYWN0aW9uLnF1ZXJ5KCkud2hlcmVJbignaWQnLCBlbnRyaWVzSWRzKS5kZWxldGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGNsb3NpbmcgYmFsYW5jZSBmb3IgdGhlIGdpdmVuIGFjY291bnQgYW5kIGNsb3NpbmcgZGF0ZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFjY291bnRJZCAtXG4gICAqIEBwYXJhbSB7RGF0ZX0gY2xvc2luZ0RhdGUgLVxuICAgKi9cbiAgZ2V0Q2xvc2luZ0JhbGFuY2UoYWNjb3VudElkLCBjbG9zaW5nRGF0ZSwgZGF0ZVR5cGUgPSAnZGF5Jykge1xuICAgIGxldCBjbG9zaW5nQmFsYW5jZSA9IDA7XG4gICAgY29uc3QgbW9tZW50Q2xvc2luZ0RhdGUgPSBtb21lbnQoY2xvc2luZ0RhdGUpO1xuXG4gICAgdGhpcy5lbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICAvLyBDYW4gbm90IGNvbnRpbnVlIGlmIG5vdCBiZWZvcmUgb3IgZXZlbnQgc2FtZSBjbG9zaW5nIGRhdGUuXG4gICAgICBpZiAoKCFtb21lbnRDbG9zaW5nRGF0ZS5pc0FmdGVyKGVudHJ5LmRhdGUsIGRhdGVUeXBlKVxuICAgICAgICAmJiAhbW9tZW50Q2xvc2luZ0RhdGUuaXNTYW1lKGVudHJ5LmRhdGUsIGRhdGVUeXBlKSlcbiAgICAgICAgfHwgKGVudHJ5LmFjY291bnQgIT09IGFjY291bnRJZCAmJiBhY2NvdW50SWQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChlbnRyeS5hY2NvdW50Tm9ybWFsID09PSAnY3JlZGl0Jykge1xuICAgICAgICBjbG9zaW5nQmFsYW5jZSArPSAoZW50cnkuY3JlZGl0KSA/IGVudHJ5LmNyZWRpdCA6IC0xICogZW50cnkuZGViaXQ7XG4gICAgICB9IGVsc2UgaWYgKGVudHJ5LmFjY291bnROb3JtYWwgPT09ICdkZWJpdCcpIHtcbiAgICAgICAgY2xvc2luZ0JhbGFuY2UgKz0gKGVudHJ5LmRlYml0KSA/IGVudHJ5LmRlYml0IDogLTEgKiBlbnRyeS5jcmVkaXQ7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGNsb3NpbmdCYWxhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIHRoZSBjcmVkaXQvZGViaXQgc3VtYXRpb24gZm9yIHRoZSBnaXZlbiBhY2NvdW50IGFuZCBkYXRlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gYWNjb3VudCAtXG4gICAqIEBwYXJhbSB7RGF0ZXxTdHJpbmd9IGNsb3NpbmdEYXRlIC1cbiAgICovXG4gIGdldFRyaWFsQmFsYW5jZShhY2NvdW50SWQsIGNsb3NpbmdEYXRlLCBkYXRlVHlwZSkge1xuICAgIGNvbnN0IG1vbWVudENsb3NpbmdEYXRlID0gbW9tZW50KGNsb3NpbmdEYXRlKTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICBjcmVkaXQ6IDAsXG4gICAgICBkZWJpdDogMCxcbiAgICAgIGJhbGFuY2U6IDAsXG4gICAgfTtcbiAgICB0aGlzLmVudHJpZXMuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgIGlmICgoIW1vbWVudENsb3NpbmdEYXRlLmlzQWZ0ZXIoZW50cnkuZGF0ZSwgZGF0ZVR5cGUpXG4gICAgICAgICYmICFtb21lbnRDbG9zaW5nRGF0ZS5pc1NhbWUoZW50cnkuZGF0ZSwgZGF0ZVR5cGUpKVxuICAgICAgICB8fCAoZW50cnkuYWNjb3VudCAhPT0gYWNjb3VudElkICYmIGFjY291bnRJZCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVzdWx0LmNyZWRpdCArPSBlbnRyeS5jcmVkaXQ7XG4gICAgICByZXN1bHQuZGViaXQgKz0gZW50cnkuZGViaXQ7XG5cbiAgICAgIGlmIChlbnRyeS5hY2NvdW50Tm9ybWFsID09PSAnY3JlZGl0Jykge1xuICAgICAgICByZXN1bHQuYmFsYW5jZSArPSAoZW50cnkuY3JlZGl0KSA/IGVudHJ5LmNyZWRpdCA6IC0xICogZW50cnkuZGViaXQ7XG4gICAgICB9IGVsc2UgaWYgKGVudHJ5LmFjY291bnROb3JtYWwgPT09ICdkZWJpdCcpIHtcbiAgICAgICAgcmVzdWx0LmJhbGFuY2UgKz0gKGVudHJ5LmRlYml0KSA/IGVudHJ5LmRlYml0IDogLTEgKiBlbnRyeS5jcmVkaXQ7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIGZldGNoZWQgYWNjb3VudHMgam91cm5hbCBlbnRyaWVzLlxuICAgKiBAcGFyYW0ge0FycmF5fSBlbnRyaWVzIC1cbiAgICovXG4gIGxvYWRFbnRyaWVzKGVudHJpZXMpIHtcbiAgICBlbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICB0aGlzLmVudHJpZXMucHVzaCh7XG4gICAgICAgIC4uLmVudHJ5LFxuICAgICAgICBhY2NvdW50OiBlbnRyeS5hY2NvdW50ID8gZW50cnkuYWNjb3VudC5pZCA6IGVudHJ5LmFjY291bnRJZCxcbiAgICAgICAgYWNjb3VudE5vcm1hbDogKGVudHJ5LmFjY291bnQgJiYgZW50cnkuYWNjb3VudC50eXBlKVxuICAgICAgICAgID8gZW50cnkuYWNjb3VudC50eXBlLm5vcm1hbCA6IGVudHJ5LmFjY291bnROb3JtYWwsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBsb2FkQWNjb3VudHMoKSB7XG5cbiAgfVxufVxuIiwiaW1wb3J0IFJlc291cmNlIGZyb20gJ0AvbW9kZWxzL1Jlc291cmNlJztcbmltcG9ydCBSZXNvdXJjZUZpZWxkIGZyb20gJ0AvbW9kZWxzL1Jlc291cmNlRmllbGQnO1xuaW1wb3J0IFJlc291cmNlRmllbGRNZXRhZGF0YSBmcm9tICdAL21vZGVscy9SZXNvdXJjZUZpZWxkTWV0YWRhdGEnO1xuaW1wb3J0IFJlc291cmNlRmllbGRNZXRhZGF0YUNvbGxlY3Rpb24gZnJvbSAnQC9jb2xsZWN0aW9uL1Jlc291cmNlRmllbGRNZXRhZGF0YUNvbGxlY3Rpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXNvdXJjZUN1c3RvbUZpZWxkUmVwb3NpdG9yeSB7XG4gIC8qKlxuICAgKiBDbGFzcyBjb25zdHJ1Y3Rvci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG1vZGVsKSB7XG4gICAgaWYgKHR5cGVvZiBtb2RlbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5yZXNvdXJjZU5hbWUgPSBtb2RlbC5uYW1lO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZGVsID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5yZXNvdXJjZU5hbWUgPSBtb2RlbDtcbiAgICB9XG4gICAgLy8gQ3VzdG9tIGZpZWxkcyBvZiB0aGUgZ2l2ZW4gcmVzb3VyY2UuXG4gICAgdGhpcy5jdXN0b21GaWVsZHMgPSBbXTtcbiAgICB0aGlzLmZpbGxlZEN1c3RvbUZpZWxkcyA9IHt9O1xuXG4gICAgLy8gbWV0YWRhdGEgb2YgY3VzdG9tIGZpZWxkcyBvZiB0aGUgZ2l2ZW4gcmVzb3VyY2UuXG4gICAgdGhpcy5maWVsZHNNZXRhZGF0YSA9IHt9O1xuICAgIHRoaXMucmVzb3VyY2UgPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGZXRjaGVzIG1ldGFkYXRhIG9mIGN1c3RvbSBmaWVsZHMgb2YgdGhlIGdpdmVuIHJlc291cmNlLlxuICAgKiBAcGFyYW0ge0ludGVnZXJ9IGlkIC0gUmVzb3VyY2UgaXRlbSBpZC5cbiAgICovXG4gIGFzeW5jIGZldGNoQ3VzdG9tRmllbGRzTWV0YWRhdGEoaWQpIHtcbiAgICBpZiAodHlwZW9mIGlkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgZGVmaW5lIHRoZSByZXNvdXJjZSBpdGVtIGlkLicpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMucmVzb3VyY2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGFyZ2V0IHJlc291cmNlIG1vZGVsIGlzIG5vdCBmb3VuZC4nKTtcbiAgICB9XG4gICAgY29uc3QgbWV0YWRhdGEgPSBhd2FpdCBSZXNvdXJjZUZpZWxkTWV0YWRhdGEucXVlcnkoKVxuICAgICAgLndoZXJlKCdyZXNvdXJjZV9pZCcsIHRoaXMucmVzb3VyY2UuaWQpXG4gICAgICAud2hlcmUoJ3Jlc291cmNlX2l0ZW1faWQnLCBpZCk7XG5cbiAgICB0aGlzLmZpZWxkc01ldGFkYXRhW2lkXSA9IG1ldGFkYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgcmVzb3VyY2UuXG4gICAqL1xuICBhc3luYyBsb2FkUmVzb3VyY2UoKSB7XG4gICAgY29uc3QgcmVzb3VyY2UgPSBhd2FpdCBSZXNvdXJjZS5xdWVyeSgpLndoZXJlKCduYW1lJywgdGhpcy5yZXNvdXJjZU5hbWUpLmZpcnN0KCk7XG5cbiAgICBpZiAoIXJlc291cmNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZXJlIGlzIG5vIHN0b3JlZCByZXNvdXJjZSBpbiB0aGUgc3RvcmFnZSB3aXRoIHRoZSBnaXZlbiBtb2RlbCBuYW1lLicpO1xuICAgIH1cbiAgICB0aGlzLnNldFJlc291cmNlKHJlc291cmNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIG1ldGFkYXRhIG9mIHRoZSByZXNvdXJjZS5cbiAgICovXG4gIGFzeW5jIGxvYWRSZXNvdXJjZUN1c3RvbUZpZWxkcygpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMucmVzb3VyY2UuaWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSBmZXRjaCByZXNvdXJjZSBkZXRhaWxzIGJlZm9yZSBmZXRjaCBjdXN0b20gZmllbGRzIG9mIHRoZSByZXNvdXJjZS4nKTtcbiAgICB9XG4gICAgY29uc3QgY3VzdG9tRmllbGRzID0gYXdhaXQgUmVzb3VyY2VGaWVsZC5xdWVyeSgpXG4gICAgICAud2hlcmUoJ3Jlc291cmNlX2lkJywgdGhpcy5yZXNvdXJjZS5pZClcbiAgICAgIC5tb2RpZnkoJ3doZXJlTm90UHJlZGVmaW5lZCcpO1xuXG4gICAgdGhpcy5zZXRSZXNvdXJjZUN1c3RvbUZpZWxkcyhjdXN0b21GaWVsZHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgcmVzb3VyY2UgbW9kZWwuXG4gICAqIEBwYXJhbSB7UmVzb3VyY2V9IHJlc291cmNlIC1cbiAgICovXG4gIHNldFJlc291cmNlKHJlc291cmNlKSB7XG4gICAgdGhpcy5yZXNvdXJjZSA9IHJlc291cmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgcmVzb3VyY2UgY3VzdG9tIGZpZWxkcyBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0ge0FycmF5fSBjdXN0b21GaWVsZHMgLVxuICAgKi9cbiAgc2V0UmVzb3VyY2VDdXN0b21GaWVsZHMoY3VzdG9tRmllbGRzKSB7XG4gICAgdGhpcy5jdXN0b21GaWVsZHMgPSBjdXN0b21GaWVsZHM7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgbWV0YWRhdGEgb2YgdGhlIHJlc291cmNlIGN1c3RvbSBmaWVsZHMuXG4gICAqIEBwYXJhbSB7SW50ZWdlcn0gaXRlbUlkIC1cbiAgICovXG4gIGdldE1ldGFkYXRhKGl0ZW1JZCkge1xuICAgIHJldHVybiB0aGlzLmZpZWxkc01ldGFkYXRhW2l0ZW1JZF0gfHwgdGhpcy5maWVsZHNNZXRhZGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaWxsIG1ldGFkYXRhIG9mIHRoZSBjdXN0b20gZmllbGRzIHRoYXQgYXNzb2NpYXRlZCB0byB0aGUgcmVzb3VyY2UuXG4gICAqIEBwYXJhbSB7SW50ZXJ9IGlkIC0gUmVzb3VyY2UgaXRlbSBpZC5cbiAgICogQHBhcmFtIHtBcnJheX0gYXR0cmlidXRlcyAtXG4gICAqL1xuICBmaWxsQ3VzdG9tRmllbGRzKGlkLCBhdHRyaWJ1dGVzKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmZpbGxlZEN1c3RvbUZpZWxkc1tpZF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLmZpbGxlZEN1c3RvbUZpZWxkc1tpZF0gPSBbXTtcbiAgICB9XG4gICAgYXR0cmlidXRlcy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICB0aGlzLmZpbGxlZEN1c3RvbUZpZWxkc1tpZF0ucHVzaChhdHRyKTtcblxuICAgICAgaWYgKCF0aGlzLmZpZWxkc01ldGFkYXRhW2lkXSkge1xuICAgICAgICB0aGlzLmZpZWxkc01ldGFkYXRhW2lkXSA9IG5ldyBSZXNvdXJjZUZpZWxkTWV0YWRhdGFDb2xsZWN0aW9uKCk7XG4gICAgICB9XG4gICAgICB0aGlzLmZpZWxkc01ldGFkYXRhW2lkXS5zZXRNZXRhKGF0dHIua2V5LCBhdHRyLnZhbHVlLCB7XG4gICAgICAgIHJlc291cmNlX2lkOiB0aGlzLnJlc291cmNlLmlkLFxuICAgICAgICByZXNvdXJjZV9pdGVtX2lkOiBpZCxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmVzIHRoZSBpbnN0ZXJlZCwgdXBkYXRlZCBhbmQgZGVsZXRlZCAgY3VzdG9tIGZpZWxkcyBtZXRhZGF0YS5cbiAgICogQHBhcmFtIHtJbnRlZ2VyfSBpZCAtIE9wdGlvbmFsIHJlc291cmNlIGl0ZW0gaWQuXG4gICAqL1xuICBhc3luYyBzYXZlQ3VzdG9tRmllbGRzKGlkKSB7XG4gICAgaWYgKGlkKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMuZmllbGRzTWV0YWRhdGFbaWRdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZXJlIGlzIG5vIHJlc291cmNlIGl0ZW0gd2l0aCB0aGUgZ2l2ZW4gaWQuJyk7XG4gICAgICB9XG4gICAgICBhd2FpdCB0aGlzLmZpZWxkc01ldGFkYXRhW2lkXS5zYXZlTWV0YSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBvcGVycyA9IFtdO1xuICAgICAgdGhpcy5maWVsZHNNZXRhZGF0YS5mb3JFYWNoKChtZXRhZGF0YSkgPT4ge1xuICAgICAgICBjb25zdCBvcGVyID0gbWV0YWRhdGEuc2F2ZU1ldGEoKTtcbiAgICAgICAgb3BlcnMucHVzaChvcGVyKTtcbiAgICAgIH0pO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwob3BlcnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZXMgdGhlIGV4aXN0IGN1c3RvbSBmaWVsZHMuXG4gICAqL1xuICB2YWxpZGF0ZUV4aXN0Q3VzdG9tRmllbGRzKCkge1xuXG4gIH1cblxuICB0b0FycmF5KCkge1xuICAgIHJldHVybiB0aGlzLmZpZWxkc01ldGFkYXRhLnRvQXJyYXkoKTtcbiAgfVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgYXdhaXQgdGhpcy5sb2FkUmVzb3VyY2UoKTtcbiAgICBhd2FpdCB0aGlzLmxvYWRSZXNvdXJjZUN1c3RvbUZpZWxkcygpO1xuICB9XG5cbiAgc3RhdGljIGZvcmdlTWV0YWRhdGFDb2xsZWN0aW9uKCkge1xuXG4gIH1cbn1cbiIsImltcG9ydCBNb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7IGV4dGVuZE1vbWVudCB9IGZyb20gJ21vbWVudC1yYW5nZSc7XG5cbmNvbnN0IG1vbWVudCA9IGV4dGVuZE1vbWVudChNb21lbnQpO1xuXG5leHBvcnQgZGVmYXVsdCBtb21lbnQ7XG4iLCJpbXBvcnQgbm9kZW1haWxlciBmcm9tICdub2RlbWFpbGVyJztcblxuLy8gY3JlYXRlIHJldXNhYmxlIHRyYW5zcG9ydGVyIG9iamVjdCB1c2luZyB0aGUgZGVmYXVsdCBTTVRQIHRyYW5zcG9ydFxuY29uc3QgdHJhbnNwb3J0ZXIgPSBub2RlbWFpbGVyLmNyZWF0ZVRyYW5zcG9ydCh7XG4gIGhvc3Q6IHByb2Nlc3MuZW52Lk1BSUxfSE9TVCxcbiAgcG9ydDogTnVtYmVyKHByb2Nlc3MuZW52Lk1BSUxfUE9SVCksXG4gIHNlY3VyZTogcHJvY2Vzcy5lbnYuTUFJTF9TRUNVUkUgPT09ICd0cnVlJywgLy8gdHJ1ZSBmb3IgNDY1LCBmYWxzZSBmb3Igb3RoZXIgcG9ydHNcbiAgYXV0aDoge1xuICAgIHVzZXI6IHByb2Nlc3MuZW52Lk1BSUxfVVNFUk5BTUUsXG4gICAgcGFzczogcHJvY2Vzcy5lbnYuTUFJTF9QQVNTV09SRCxcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCB0cmFuc3BvcnRlcjtcbiIsImltcG9ydCBiY3J5cHQgZnJvbSAnYmNyeXB0anMnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmNvbnN0IHsgbWFwLCBpc0FycmF5LCBpc1BsYWluT2JqZWN0LCBtYXBLZXlzLCBtYXBWYWx1ZXMgfSA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5cblxuY29uc3QgaGFzaFBhc3N3b3JkID0gKHBhc3N3b3JkKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICBiY3J5cHQuZ2VuU2FsdCgxMCwgKGVycm9yLCBzYWx0KSA9PiB7XG4gICAgYmNyeXB0Lmhhc2gocGFzc3dvcmQsIHNhbHQsIChlcnIsIGhhc2gpID0+IHsgcmVzb2x2ZShoYXNoKTsgfSk7XG4gIH0pO1xufSk7XG5cbmNvbnN0IG9yaWdpbiA9IChyZXF1ZXN0KSA9PiBgJHtyZXF1ZXN0LnByb3RvY29sfTovLyR7cmVxdWVzdC5ob3N0bmFtZX1gO1xuXG5jb25zdCBkYXRlUmFuZ2VDb2xsZWN0aW9uID0gKGZyb21EYXRlLCB0b0RhdGUsIGFkZFR5cGUgPSAnZGF5JywgaW5jcmVtZW50ID0gMSkgPT4ge1xuICBjb25zdCBjb2xsZWN0aW9uID0gW107XG4gIGNvbnN0IG1vbWVudEZyb21EYXRlID0gbW9tZW50KGZyb21EYXRlKTtcbiAgbGV0IGRhdGVGb3JtYXQgPSAnJztcblxuICBzd2l0Y2ggKGFkZFR5cGUpIHtcbiAgICBjYXNlICdkYXknOlxuICAgIGRlZmF1bHQ6XG4gICAgICBkYXRlRm9ybWF0ID0gJ1lZWVktTU0tREQnOyBicmVhaztcbiAgICBjYXNlICdtb250aCc6XG4gICAgY2FzZSAncXVhcnRlcic6XG4gICAgICBkYXRlRm9ybWF0ID0gJ1lZWVktTU0nOyBicmVhaztcbiAgICBjYXNlICd5ZWFyJzpcbiAgICAgIGRhdGVGb3JtYXQgPSAnWVlZWSc7IGJyZWFrO1xuICB9XG4gIGZvciAobGV0IGkgPSBtb21lbnRGcm9tRGF0ZTtcbiAgICAoaS5pc0JlZm9yZSh0b0RhdGUsIGFkZFR5cGUpIHx8IGkuaXNTYW1lKHRvRGF0ZSwgYWRkVHlwZSkpO1xuICAgIGkuYWRkKGluY3JlbWVudCwgYCR7YWRkVHlwZX1zYCkpIHtcbiAgICBjb2xsZWN0aW9uLnB1c2goaS5lbmRPZihhZGRUeXBlKS5mb3JtYXQoZGF0ZUZvcm1hdCkpO1xuICB9XG4gIHJldHVybiBjb2xsZWN0aW9uO1xufTtcblxuY29uc3QgZGF0ZVJhbmdlRm9ybWF0ID0gKHJhbmdlVHlwZSkgPT4ge1xuICBzd2l0Y2ggKHJhbmdlVHlwZSkge1xuICAgIGNhc2UgJ3llYXInOlxuICAgICAgcmV0dXJuICdZWVlZJztcbiAgICBjYXNlICdtb250aCc6XG4gICAgY2FzZSAncXVhcnRlcic6XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnWVlZWS1NTSc7XG4gIH1cbn07XG5cblxuY29uc3QgbWFwS2V5c0RlZXAgPSAob2JqLCBjYikgPT4ge1xuICBpZiAoXy5pc0FycmF5KG9iaikpIHtcbiAgICAgIHJldHVybiBvYmoubWFwKGlubmVyT2JqID0+IG1hcEtleXNEZWVwKGlubmVyT2JqLCBjYikpO1xuICB9XG4gIGVsc2UgaWYgKF8uaXNPYmplY3Qob2JqKSkge1xuICAgICAgcmV0dXJuIF8ubWFwVmFsdWVzKFxuICAgICAgICAgIF8ubWFwS2V5cyhvYmosIGNiKSxcbiAgICAgICAgICB2YWwgPT4gbWFwS2V5c0RlZXAodmFsLCBjYiksXG4gICAgICApXG4gIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JqO1xuICB9XG59XG5cbmNvbnN0IG1hcFZhbHVlc0RlZXAgPSAodiwgY2FsbGJhY2spID0+IChcbiAgXy5pc09iamVjdCh2KVxuICAgID8gXy5tYXBWYWx1ZXModiwgdiA9PiBtYXBWYWx1ZXNEZWVwKHYsIGNhbGxiYWNrKSlcbiAgICA6IGNhbGxiYWNrKHYpKTtcblxuZXhwb3J0IHtcbiAgaGFzaFBhc3N3b3JkLFxuICBvcmlnaW4sXG4gIGRhdGVSYW5nZUNvbGxlY3Rpb24sXG4gIGRhdGVSYW5nZUZvcm1hdCxcbiAgbWFwVmFsdWVzRGVlcCxcbiAgbWFwS2V5c0RlZXAsXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGJhYmVsL3BsdWdpbi10cmFuc2Zvcm0tcnVudGltZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2FzeW5jVG9HZW5lcmF0b3JcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVja1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvZGVmaW5lUHJvcGVydHlcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9nZXRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9nZXRQcm90b3R5cGVPZlwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2luaGVyaXRzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVyblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL3NsaWNlZFRvQXJyYXlcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy90b0NvbnN1bWFibGVBcnJheVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9yZWdlbmVyYXRvclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiY3J5cHRqc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkb3RlbnZcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXJyb3JoYW5kbGVyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzcy1ib29tXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3MtdmFsaWRhdG9yXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhlbG1ldFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJqc29ud2VidG9rZW5cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwia25leFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9tZW50XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm1vbWVudC1yYW5nZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtdXN0YWNoZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJub2RlbWFpbGVyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm9iamVjdGlvblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2hEQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEVBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzNFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ0pBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ1ZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDL0lBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzdCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFqRkE7QUFtRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3JOQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBbkJBO0FBQ0E7QUFDQTtBQXFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDaE1BO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDUkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNsUEE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUE3RUE7QUErRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFUQTs7Ozs7Ozs7Ozs7O0FDNUdBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDWkE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNSQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFoREE7QUFrREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBN0RBO0FBQ0E7QUErREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdkZBO0FBeUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDdGZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN0T0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2pnQkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3BMQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFuQ0E7QUFxQ0E7QUFDQTtBQUNBO0FBdkNBO0FBeUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzlRQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3RFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN6RkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBaElBO0FBQ0E7QUFDQTtBQUNBO0FBa0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3ZWQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ1JBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUMvT0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3ZRQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDcERBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNSQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNmQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBM0JBO0FBK0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQTlFQTtBQW1GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBdkZBO0FBNEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF0R0E7QUF3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWxIQTtBQW9IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBaklBO0FBbUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDM0tBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDN0pBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkE7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBcEVBO0FBd0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDalBBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3hGQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQXpFQTs7QUFPQTs7QUFnQkE7O0FBU0E7O0FBWUE7O0FBWUE7Ozs7Ozs7Ozs7OztBQ2xFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUMzQkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQy9FQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUMvQkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQXBEQTs7QUFXQTs7Ozs7Ozs7Ozs7O0FDakJBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDUkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzVGQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3pDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDN0JBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDUkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNSQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3pCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBZkE7QUFrQkE7QUFDQTs7Ozs7Ozs7Ozs7O0FDM0JBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDUkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXBCQTtBQXNCQTs7Ozs7Ozs7Ozs7OztBQ3ZDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNwRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUEzQ0E7O0FBR0E7O0FBV0E7O0FBV0E7O0FBT0E7O0FBbUJBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ2xFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3JDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3pGQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUE1Q0E7O0FBT0E7O0FBT0E7Ozs7Ozs7Ozs7OztBQ3RCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDekRBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDZkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDaEVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ05BO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDUkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQy9PQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDeEpBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ0xBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2JBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25FQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7OztBIiwic291cmNlUm9vdCI6IiJ9