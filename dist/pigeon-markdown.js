/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("PigeonMarkdown", [], factory);
	else if(typeof exports === 'object')
		exports["PigeonMarkdown"] = factory();
	else
		root["PigeonMarkdown"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, exports) => {

eval("var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**\n * Pigeon Markdown - Lightweight Markdown parser\n */\n\nclass PigeonMarkdown {\n  /**\n   * Creates an instance of the parser\n   * @param {Object} options - Parser options\n   */\n  constructor(options = {}) {\n    const defaultOptions = {\n      features: {\n        bold: true,\n        italic: true,\n        underline: true,\n        strikethrough: true,\n        inlineCode: true,\n        codeBlock: true,\n        links: true,\n        headings: true // Support for #, ##, ###\n      }\n    };\n    this.options = {\n      ...defaultOptions,\n      ...options,\n      features: {\n        ...defaultOptions.features,\n        ...(options.features || {})\n      }\n    };\n  }\n\n  /**\n   * Parses Markdown into HTML\n   * @param {string} markdown - Text in Markdown format\n   * @returns {string} HTML\n   */\n  parse(markdown) {\n    if (typeof markdown !== 'string') {\n      return '';\n    }\n\n    // Normalize line endings to \\n\n    let text = markdown.replace(/\\r\\n?/g, '\\n').trim();\n    if (!text) {\n      return '';\n    }\n\n    // Process headings if enabled\n    if (this.options.features.headings) {\n      // Process ATX-style headings: #, ##, ###\n      text = text.replace(/^(#{1,3})\\s+(.+?)\\s*$/gm, (match, hashes, content) => {\n        const level = hashes.length;\n        return `<h${level}>${content}</h${level}>`;\n      });\n\n      // Process Setext-style headings (only h1 and h2)\n      // h1: ===\n      // h2: ---\n      const lines = text.split('\\n');\n      for (let i = 1; i < lines.length; i++) {\n        const prevLine = lines[i - 1].trim();\n        const currentLine = lines[i].trim();\n        if (currentLine.match(/^=+$/) && !prevLine.match(/^<h[1-6]>/) && prevLine) {\n          lines[i - 1] = `<h1>${prevLine}</h1>`;\n          lines[i] = '';\n        } else if (currentLine.match(/^-+$/) && !prevLine.match(/^<h[1-6]>/) && prevLine) {\n          lines[i - 1] = `<h2>${prevLine}</h2>`;\n          lines[i] = '';\n        }\n      }\n      text = lines.filter(Boolean).join('\\n');\n    }\n    const codeBlockMatches = [];\n    if (this.options.features.codeBlock) {\n      text = text.replace(/```(\\w*)\\n([\\s\\S]*?)\\n```/g, (match, language, code) => {\n        const id = `__CODE_BLOCK_${codeBlockMatches.length}__`;\n        codeBlockMatches.push({\n          id,\n          code: code,\n          language: (language || '').trim()\n        });\n        return `\\n${id}\\n`;\n      });\n    }\n    const lines = text.split('\\n');\n    const result = [];\n    let currentParagraph = [];\n\n    // Helper function to close the current paragraph\n    const flushParagraph = () => {\n      if (currentParagraph.length > 0) {\n        // Join lines with <br> tags and trim the result\n        const content = currentParagraph.join('<br>').trim();\n        result.push(`<p>${content}</p>`);\n        currentParagraph = [];\n      }\n    };\n    for (let i = 0; i < lines.length; i++) {\n      // Process code blocks first\n      const codeBlock = codeBlockMatches.find(block => lines[i].includes(block.id));\n      if (codeBlock) {\n        flushParagraph();\n        result.push(this.wrapCodeBlock(codeBlock.code, codeBlock.language));\n        continue;\n      }\n      const line = lines[i].trim();\n\n      // Handle empty lines (end of paragraph)\n      if (!line) {\n        flushParagraph();\n        if (this.options.breaks) {\n          result.push('<br>');\n        }\n        continue;\n      }\n\n      // Handle headings (already processed)\n      if (line.match(/^<h[1-6]>/)) {\n        flushParagraph();\n        result.push(line);\n        continue;\n      }\n\n      // Handle code blocks (already processed)\n      if (line.startsWith('<pre>') || line.startsWith('</pre>') || line.startsWith('<code>') || line.startsWith('</code>')) {\n        flushParagraph();\n        result.push(line);\n        continue;\n      }\n\n      // Add line to current paragraph (with inline parsing)\n      const processedLine = this.parseInlineElements(line);\n      if (processedLine) {\n        currentParagraph.push(processedLine);\n      }\n    }\n\n    // Flush any remaining paragraph\n    flushParagraph();\n    return result.join('');\n  }\n\n  /**\n   * Parses inline elements in a line\n   * @private\n   */\n  parseInlineElements(text) {\n    if (!this.options.html) {\n      text = this.escapeHtml(text);\n    }\n    const {\n      features\n    } = this.options;\n    if (features.bold || features.italic) {\n      if (features.bold && features.italic) {\n        text = text.replace(/\\*\\*\\*(.*?)\\*\\*\\*/g, '<strong><em>$1</em></strong>').replace(/___(.*?)___/g, '<strong><em>$1</em></strong>');\n      }\n      if (features.bold) {\n        text = text.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>').replace(/__(.*?)__/g, '<strong>$1</strong>');\n      }\n      if (features.italic) {\n        text = text.replace(/\\*(.*?)\\*/g, '<em>$1</em>').replace(/_(.*?)_/g, '<em>$1</em>');\n      }\n    }\n    if (features.strikethrough) {\n      text = text.replace(/~~(.*?)~~/g, '<del>$1</del>');\n    }\n    if (features.underline) {\n      text = text.replace(/~(.+?)~/g, '<u>$1</u>');\n    }\n    if (features.inlineCode) {\n      text = text.replace(/`([^`]+)`/g, '<code>$1</code>');\n    }\n    if (features.links) {\n      text = text.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href=\"$2\">$1</a>');\n    }\n    return text;\n  }\n\n  /**\n   * Wraps code block with syntax highlighting tags\n   * @private\n   */\n  wrapCodeBlock(code, language = '') {\n    const escapedCode = this.escapeHtml(code);\n    if (language) {\n      return `\\n<pre><code class=\"language-${language}\">${escapedCode}</code></pre>\\n`;\n    }\n    return `\\n<pre><code>${escapedCode}</code></pre>\\n`;\n  }\n\n  /**\n   * Escapes HTML tags for security\n   * @private\n   */\n  escapeHtml(unsafe) {\n    return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#039;');\n  }\n}\nif ( true && typeof module.exports !== 'undefined') {\n  module.exports = PigeonMarkdown;\n} else if (true) {\n  !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (() => PigeonMarkdown).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),\n\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n} else // removed by dead control flow\n{}\n\n//# sourceURL=webpack://PigeonMarkdown/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});