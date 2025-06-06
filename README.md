# PigeonMarkdown

A lightweight Markdown parser for browsers and Node.js.

## Quick Start

### Basic Usage

```javascript
// In browser or Node.js
const PigeonMarkdown = require('pigeon-markdown');
const parser = new PigeonMarkdown();
const html = parser.parse('# Hello World!');
```

## Features

- **Text Formatting**: Bold, italic, strikethrough, underline
- **Headings**: Support for h1-h6
- **Code**: Inline code and fenced code blocks with syntax highlighting
- **Links**: Inline links with URL validation
- **HTML**: Option to allow/disallow HTML in markdown
- **Extensible**: Customizable parsing options

## Documentation

### Initialization

```javascript
const parser = new PigeonMarkdown({
  // Enable/disable features
  features: {
    bold: true,          // **bold**
    italic: true,       // *italic*
    underline: true,    // ~underline~
    strikethrough: true, // ~~strikethrough~~
    inlineCode: true,   // `code`
    codeBlock: true,    // ```code```
    links: true,        // [text](url)
    headings: true      // #, ##, ###
  }
});
```

### Methods

#### parse(markdown: string): string

Converts Markdown to HTML.

```javascript
const html = parser.parse('# Heading\n\nParagraph with **bold** text.');
```

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open `examples/basic.html` in your browser

## License

MIT