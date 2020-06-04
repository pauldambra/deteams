/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["tjUo","vendors"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "4i4B":
/*!********************!*\
  !*** ./src/url.js ***!
  \********************/
/*! exports provided: isValidHttpUrl, isTeamsLink, mightContainASecretHiddenLink */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isValidHttpUrl\", function() { return isValidHttpUrl; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isTeamsLink\", function() { return isTeamsLink; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"mightContainASecretHiddenLink\", function() { return mightContainASecretHiddenLink; });\n/* harmony import */ var _messages__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./messages */ \"x9rb\");\n\n\n\n//from https://stackoverflow.com/a/43467144/222163\nconst isValidHttpUrl = string => {\n  let url;\n\n  try {\n    url = new URL(string);\n  } catch (_) {\n    return false;\n  }\n\n  if (url.protocol === \"http:\" || url.protocol === \"https:\") {\n    return true\n  } else {\n    Object(_messages__WEBPACK_IMPORTED_MODULE_0__[\"send\"])(`${string} is not an HTTP URL`)\n    return false\n  }\n}\n\n//assumes input is definitely a valid url\nconst isTeamsLink = url => {\n  if (url.host === \"teams.microsoft.com\") {\n    return true\n  } else {\n    Object(_messages__WEBPACK_IMPORTED_MODULE_0__[\"send\"])(`${url.toString()} is not a teams URL`)\n    return false\n  }\n}\n\nconst mightContainASecretHiddenLink = url => {\n  if (url.search && url.search.includes('https%3A%2F%2F')) {\n    return true\n  } else {\n    Object(_messages__WEBPACK_IMPORTED_MODULE_0__[\"send\"])('this teams link does not contain a hidden link. to deteamsify - just stop using teams')\n    return false\n  }\n}\n\n\n//# sourceURL=webpack:///./src/url.js?");

/***/ }),

/***/ "DtcT":
/*!*********************!*\
  !*** ./src/html.js ***!
  \*********************/
/*! exports provided: link, listItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"link\", function() { return link; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"listItem\", function() { return listItem; });\nconst link = s => {\n  const a = document.createElement('a')\n  const linkText = document.createTextNode(s)\n  a.appendChild(linkText)\n  a.title = s\n  a.href = s\n  a.target = '_blank'\n  return a\n}\n\nconst listItem = child => {\n  const li = document.createElement('li')\n  li.appendChild(child)\n  return li\n}\n\n\n//# sourceURL=webpack:///./src/html.js?");

/***/ }),

/***/ "tjUo":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ \"DtyJ\");\n/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ \"ahDk\");\n/* harmony import */ var _url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./url */ \"4i4B\");\n/* harmony import */ var _deteamsifier__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./deteamsifier */ \"wL/g\");\n/* harmony import */ var _html__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./html */ \"DtcT\");\n\n\n\n\n\n\n\nconst onError = e => {\n  document.getElementsByClassName('message')[0].innerHTML = e.message\n}\n\nconst onNext = s => {\n  const ul = document.getElementsByClassName('links')[0].children[0]\n  const li = Object(_html__WEBPACK_IMPORTED_MODULE_4__[\"listItem\"])(Object(_html__WEBPACK_IMPORTED_MODULE_4__[\"link\"])(s))\n  ul.appendChild(li)\n}\n\n\n\n/**\n * ok on input even check if it's a link\n * then check that it's a teams link\n * then see if it has a link inside it\n * put a message in the UI if it is\n * if the message is some feedback it goes in \"slot 0\" at the top of the output\n * if the message is a deteams'd link then it goes at the top of slot 1, keeping previous items below it\n */\n\nconst wiring = () => {\n  Object(rxjs__WEBPACK_IMPORTED_MODULE_0__[\"fromEvent\"])(document.getElementsByClassName('undeteamsified'), 'input')\n    .pipe(\n      Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__[\"debounceTime\"])(200),\n      Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__[\"map\"])(x => x.target.value),\n      Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__[\"filter\"])(_url__WEBPACK_IMPORTED_MODULE_2__[\"isValidHttpUrl\"]),\n      Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__[\"map\"])(u => new URL(u)),\n      Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__[\"filter\"])(_url__WEBPACK_IMPORTED_MODULE_2__[\"isTeamsLink\"]),\n      Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__[\"filter\"])(_url__WEBPACK_IMPORTED_MODULE_2__[\"mightContainASecretHiddenLink\"]),\n      Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__[\"map\"])(_deteamsifier__WEBPACK_IMPORTED_MODULE_3__[\"deteamsify\"])\n    )\n    .subscribe(onNext, onError)\n\n}\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  wiring()\n})\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "wL/g":
/*!*****************************!*\
  !*** ./src/deteamsifier.js ***!
  \*****************************/
/*! exports provided: deteamsify */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deteamsify\", function() { return deteamsify; });\n/* harmony import */ var _messages__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./messages */ \"x9rb\");\n\n\n\n// this massively assumes that u is a url and a teams url at that\nconst deteamsify = u => {\n  // the assumption is that this is a teams link with an encoded link in searchparams\n  const searchParams = u.searchParams\n  const objectURL = searchParams.get(\"objectUrl\")\n\n  if (objectURL) {\n    Object(_messages__WEBPACK_IMPORTED_MODULE_0__[\"send\"])('')\n    return objectURL\n  } else {\n    Object(_messages__WEBPACK_IMPORTED_MODULE_0__[\"send\"])(\"no URL found in this teams URL, soz. 🤷‍♀️\")\n  }\n}\n\n\n//# sourceURL=webpack:///./src/deteamsifier.js?");

/***/ }),

/***/ "x9rb":
/*!*************************!*\
  !*** ./src/messages.js ***!
  \*************************/
/*! exports provided: send */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"send\", function() { return send; });\n/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ \"DtyJ\");\n\n\nconst messages = new rxjs__WEBPACK_IMPORTED_MODULE_0__[\"Subject\"]()\nmessages.subscribe(\n  s => document.getElementsByClassName('message')[0].textContent = s\n)\nconst send = s => {\n  messages.next(s)\n}\n\n\n//# sourceURL=webpack:///./src/messages.js?");

/***/ })

/******/ });