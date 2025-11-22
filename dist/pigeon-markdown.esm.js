/******/ var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PigeonMarkdown: () => (/* binding */ PigeonMarkdown),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* module decorator */ module = __webpack_require__.hmd(module);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var PigeonMarkdown = /*#__PURE__*/function () {
  function PigeonMarkdown() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, PigeonMarkdown);
    var defaultOptions = {
      features: {
        bold: true,
        italic: true,
        underline: true,
        strikethrough: true,
        inlineCode: true,
        codeBlock: true,
        links: true,
        headings: true
      }
    };
    this.options = Object.assign(Object.assign(Object.assign({}, defaultOptions), options), {
      features: Object.assign(Object.assign({}, defaultOptions.features), options.features || {})
    });
  }
  /**
   * Parses Markdown into HTML
   * @param markdown - Text in Markdown format
   * @returns HTML string
   */
  return _createClass(PigeonMarkdown, [{
    key: "parse",
    value: function parse(markdown) {
      var _this = this;
      if (typeof markdown !== 'string') {
        return '';
      }
      var text = markdown.replace(/\r\n?/g, '\n').trim();
      if (!text) {
        return '';
      }
      if (this.options.features.headings) {
        text = text.replace(/^(#{1,3})\s+(.+?)\s*$/gm, function (match, hashes, content) {
          var level = hashes.length;
          return "<h".concat(level, ">").concat(content, "</h").concat(level, ">");
        });
        var _lines = text.split('\n');
        for (var i = 1; i < _lines.length; i++) {
          var prevLine = _lines[i - 1].trim();
          var currentLine = _lines[i].trim();
          if (currentLine.match(/^=+$/) && !prevLine.match(/^<h[1-6]>/) && prevLine) {
            _lines[i - 1] = "<h1>".concat(prevLine, "</h1>");
            _lines[i] = '';
          } else if (currentLine.match(/^-+$/) && !prevLine.match(/^<h[1-6]>/) && prevLine) {
            _lines[i - 1] = "<h2>".concat(prevLine, "</h2>");
            _lines[i] = '';
          }
        }
        text = _lines.filter(Boolean).join('\n');
      }
      var codeBlockMatches = [];
      if (this.options.features.codeBlock) {
        text = text.replace(/```(\w*)\n([\s\S]*?)\n```/g, function (match, language, code) {
          var id = "__CODE_BLOCK_".concat(codeBlockMatches.length, "__");
          codeBlockMatches.push({
            id: id,
            code: code,
            language: (language || '').trim()
          });
          return "\n".concat(id, "\n");
        });
      }
      var lines = text.split('\n');
      var result = [];
      var currentParagraph = [];
      var flushParagraph = function flushParagraph() {
        if (currentParagraph.length > 0) {
          var content = currentParagraph.join('<br>').trim();
          result.push("<p>".concat(content, "</p>"));
          currentParagraph = [];
        }
      };
      var _loop = function _loop(_i) {
        var codeBlock = codeBlockMatches.find(function (block) {
          return lines[_i].includes(block.id);
        });
        if (codeBlock) {
          flushParagraph();
          result.push("<pre><code class=\"language-".concat(codeBlock.language || 'plaintext', "\">").concat(_this.escapeHtml(codeBlock.code), "</code></pre>"));
          return 1; // continue
        }
        var line = lines[_i].trim();
        if (line === '') {
          flushParagraph();
        } else {
          var processedLine = line;
          if (_this.options.features.bold) {
            processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/__(.*?)__/g, '<strong>$1</strong>');
          }
          if (_this.options.features.italic) {
            processedLine = processedLine.replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/_(.*?)_/g, '<em>$1</em>');
          }
          if (_this.options.features.strikethrough) {
            processedLine = processedLine.replace(/~~(.*?)~~/g, '<del>$1</del>');
          }
          if (_this.options.features.underline) {
            processedLine = processedLine.replace(/__(.*?)__/g, '<u>$1</u>');
          }
          if (_this.options.features.inlineCode) {
            processedLine = processedLine.replace(/`([^`]+)`/g, '<code>$1</code>');
          }
          if (_this.options.features.links) {
            processedLine = processedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
          }
          currentParagraph.push(processedLine);
        }
      };
      for (var _i = 0; _i < lines.length; _i++) {
        if (_loop(_i)) continue;
      }
      flushParagraph();
      return result.join('\n');
    }
  }, {
    key: "escapeHtml",
    value: function escapeHtml(unsafe) {
      return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }
  }]);
}();
// UMD/CommonJS export
if ( true && module.exports) {
  module.exports = PigeonMarkdown;
}
if (typeof define === 'function' && __webpack_require__.amdO) {
  define([], function () {
    return PigeonMarkdown;
  });
}
// Browser global
if (typeof window !== 'undefined') {
  window.PigeonMarkdown = PigeonMarkdown;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PigeonMarkdown);

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		id: moduleId,
/******/ 		loaded: false,
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Flag the module as loaded
/******/ 	module.loaded = true;
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/amd options */
/******/ (() => {
/******/ 	__webpack_require__.amdO = {};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/harmony module decorator */
/******/ (() => {
/******/ 	__webpack_require__.hmd = (module) => {
/******/ 		module = Object.create(module);
/******/ 		if (!module.children) module.children = [];
/******/ 		Object.defineProperty(module, 'exports', {
/******/ 			enumerable: true,
/******/ 			set: () => {
/******/ 				throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 			}
/******/ 		});
/******/ 		return module;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module is referenced by other modules so it can't be inlined
/******/ var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ const __webpack_exports__PigeonMarkdown = __webpack_exports__.PigeonMarkdown;
/******/ const __webpack_exports__default = __webpack_exports__["default"];
/******/ export { __webpack_exports__PigeonMarkdown as PigeonMarkdown, __webpack_exports__default as default };
/******/ 

//# sourceMappingURL=pigeon-markdown.esm.js.map