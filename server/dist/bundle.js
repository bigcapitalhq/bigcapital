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
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config */ "./config/index.js");
/* harmony import */ var _http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/http */ "./src/http/index.js");




var app = express__WEBPACK_IMPORTED_MODULE_0___default()();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(express__WEBPACK_IMPORTED_MODULE_0___default.a.json());

Object(_http__WEBPACK_IMPORTED_MODULE_2__["default"])(app);

/* harmony default export */ __webpack_exports__["default"] = (app);

/***/ }),

/***/ "./src/http/controllers/Authentication.js":
/*!************************************************!*\
  !*** ./src/http/controllers/Authentication.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express-validator */ "express-validator");
/* harmony import */ var express_validator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express_validator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../middleware/asyncMiddleware */ "./src/http/middleware/asyncMiddleware.js");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}




/* harmony default export */ __webpack_exports__["default"] = ({
  /**
                  * Constructor method.
                  */
  router: function router() {
    var router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();

    router.post('login',
    this.login.validation,
    Object(_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_2__["default"])(this.login.handler));

    router.post('/send_reset_password',
    this.sendResetPassword.validation,
    Object(_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_2__["default"])(this.sendResetPassword.handler));

    router.post('/reset/:token',
    this.resetPassword.validation,
    Object(_middleware_asyncMiddleware__WEBPACK_IMPORTED_MODULE_2__["default"])(this.resetPassword.handler));

    return router;
  },

  /**
      * User login authentication request.
      */
  login: {
    validation: [
    Object(express_validator__WEBPACK_IMPORTED_MODULE_1__["check"])('crediential').isEmail(),
    Object(express_validator__WEBPACK_IMPORTED_MODULE_1__["check"])('password').isLength({ min: 5 })],

    handler: function () {var _handler = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {var errors;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                errors = Object(express_validator__WEBPACK_IMPORTED_MODULE_1__["validationResult"])(req);if (

                errors.isEmpty()) {_context.next = 3;break;}return _context.abrupt("return",
                res.status(422).json({ errors: errors.array() }));case 3:return _context.abrupt("return",


                res.status(200).send({}));case 4:case "end":return _context.stop();}}}, _callee);}));function handler(_x, _x2) {return _handler.apply(this, arguments);}return handler;}() },



  sendResetPassword: {
    validation: [],
    handler: function handler() {

    } },


  resetPassword: {
    validation: [],
    handler: function handler() {

    } } });

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


/* harmony default export */ __webpack_exports__["default"] = (function (app) {
  app.use(_http_controllers_Authentication__WEBPACK_IMPORTED_MODULE_0__["default"].router());
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

/***/ 0:
/*!*************************!*\
  !*** multi @/server.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! @/server.js */"./src/server.js");


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

/***/ "express-validator":
/*!************************************!*\
  !*** external "express-validator" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-validator");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrL2Jvb3RzdHJhcCIsIi9ob21lL2FobWVkL1JhdHRlYjIvc2VydmVyL2NvbmZpZy9pbmRleC5qcyIsIi9ob21lL2FobWVkL1JhdHRlYjIvc2VydmVyL3NyYy9hcHAuanMiLCIvaG9tZS9haG1lZC9SYXR0ZWIyL3NlcnZlci9zcmMvaHR0cC9jb250cm9sbGVycy9BdXRoZW50aWNhdGlvbi5qcyIsIi9ob21lL2FobWVkL1JhdHRlYjIvc2VydmVyL3NyYy9odHRwL2luZGV4LmpzIiwiL2hvbWUvYWhtZWQvUmF0dGViMi9zZXJ2ZXIvc3JjL2h0dHAvbWlkZGxld2FyZS9hc3luY01pZGRsZXdhcmUuanMiLCIvaG9tZS9haG1lZC9SYXR0ZWIyL3NlcnZlci9zcmMvc2VydmVyLmpzIiwiZXh0ZXJuYWwgXCJkb3RlbnZcIiIsImV4dGVybmFsIFwiZXJyb3JoYW5kbGVyXCIiLCJleHRlcm5hbCBcImV4cHJlc3NcIiIsImV4dGVybmFsIFwiZXhwcmVzcy12YWxpZGF0b3JcIiIsImV4dGVybmFsIFwicGF0aFwiIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiZGlzdC9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuIiwiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZG90ZW52IGZyb20gJ2RvdGVudic7XG5cbmRvdGVudi5jb25maWcoe1xuICBwYXRoOiBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJy5lbnYudGVzdCcpLFxufSk7XG4iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCAnLi4vY29uZmlnJztcbmltcG9ydCByb3V0ZXMgZnJvbSAnQC9odHRwJztcblxuY29uc3QgYXBwID0gZXhwcmVzcygpO1xuXG4vLyBFeHByZXNzIGNvbmZpZ3VyYXRpb25cbmFwcC5zZXQoJ3BvcnQnLCBwcm9jZXNzLmVudi5QT1JUIHx8IDMwMDApO1xuYXBwLnVzZShleHByZXNzLmpzb24oKSk7XG5cbnJvdXRlcyhhcHApO1xuXG5leHBvcnQgZGVmYXVsdCBhcHA7XG4iLCJcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgY2hlY2ssIHZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICdleHByZXNzLXZhbGlkYXRvcic7XG5pbXBvcnQgYXN5bmNNaWRkbGV3YXJlIGZyb20gJy4uL21pZGRsZXdhcmUvYXN5bmNNaWRkbGV3YXJlJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgbWV0aG9kLlxuICAgKi9cbiAgcm91dGVyKCkge1xuICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbiAgICByb3V0ZXIucG9zdCgnbG9naW4nLFxuICAgICAgdGhpcy5sb2dpbi52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMubG9naW4uaGFuZGxlcikpO1xuXG4gICAgcm91dGVyLnBvc3QoJy9zZW5kX3Jlc2V0X3Bhc3N3b3JkJyxcbiAgICAgIHRoaXMuc2VuZFJlc2V0UGFzc3dvcmQudmFsaWRhdGlvbixcbiAgICAgIGFzeW5jTWlkZGxld2FyZSh0aGlzLnNlbmRSZXNldFBhc3N3b3JkLmhhbmRsZXIpKTtcblxuICAgIHJvdXRlci5wb3N0KCcvcmVzZXQvOnRva2VuJyxcbiAgICAgIHRoaXMucmVzZXRQYXNzd29yZC52YWxpZGF0aW9uLFxuICAgICAgYXN5bmNNaWRkbGV3YXJlKHRoaXMucmVzZXRQYXNzd29yZC5oYW5kbGVyKSk7XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9LFxuXG4gIC8qKlxuICAgKiBVc2VyIGxvZ2luIGF1dGhlbnRpY2F0aW9uIHJlcXVlc3QuXG4gICAqL1xuICBsb2dpbjoge1xuICAgIHZhbGlkYXRpb246IFtcbiAgICAgIGNoZWNrKCdjcmVkaWVudGlhbCcpLmlzRW1haWwoKSxcbiAgICAgIGNoZWNrKCdwYXNzd29yZCcpLmlzTGVuZ3RoKHsgbWluOiA1IH0pLFxuICAgIF0sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgZXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xuXG4gICAgICBpZiAoIWVycm9ycy5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDIyKS5qc29uKHsgZXJyb3JzOiBlcnJvcnMuYXJyYXkoKSB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHt9KTtcbiAgICB9LFxuICB9LFxuXG4gIHNlbmRSZXNldFBhc3N3b3JkOiB7XG4gICAgdmFsaWRhdGlvbjogW10sXG4gICAgaGFuZGxlcigpIHtcblxuICAgIH0sXG4gIH0sXG5cbiAgcmVzZXRQYXNzd29yZDoge1xuICAgIHZhbGlkYXRpb246IFtdLFxuICAgIGhhbmRsZXIoKSB7XG5cbiAgICB9LFxuICB9LFxufTtcbiIsImltcG9ydCBBdXRoZW50aWNhdGlvbiBmcm9tICdAL2h0dHAvY29udHJvbGxlcnMvQXV0aGVudGljYXRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCAoYXBwKSA9PiB7XG4gIGFwcC51c2UoQXV0aGVudGljYXRpb24ucm91dGVyKCkpO1xufTtcbiIsImNvbnN0IGFzeW5jTWlkZGxld2FyZSA9IChmbikgPT4gKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gIFByb21pc2UucmVzb2x2ZShmbihyZXEsIHJlcywgbmV4dCkpXG4gICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgbmV4dChlcnJvcik7XG4gICAgfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhc3luY01pZGRsZXdhcmU7XG4iLCJpbXBvcnQgZXJyb3JIYW5kbGVyIGZyb20gJ2Vycm9yaGFuZGxlcic7XG5pbXBvcnQgYXBwIGZyb20gJ0AvYXBwJztcblxuYXBwLnVzZShlcnJvckhhbmRsZXIpO1xuXG5jb25zdCBzZXJ2ZXIgPSBhcHAubGlzdGVuKGFwcC5nZXQoJ3BvcnQnKSwgKCkgPT4ge1xuICBjb25zb2xlLmxvZyhcbiAgICAnICBBcHAgaXMgcnVubmluZyBhdCBodHRwOi8vbG9jYWxob3N0OiVkIGluICVzIG1vZGUnLFxuICAgIGFwcC5nZXQoJ3BvcnQnKSxcbiAgICBhcHAuZ2V0KCdlbnYnKSxcbiAgKTtcbiAgY29uc29sZS5sb2coJyAgUHJlc3MgQ1RSTC1DIHRvIHN0b3AnKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBzZXJ2ZXI7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkb3RlbnZcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXJyb3JoYW5kbGVyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzcy12YWxpZGF0b3JcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNKQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDekRBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNKQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDUkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDZEE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7QSIsInNvdXJjZVJvb3QiOiIifQ==