/**
 * Pigeon Markdown - Lightweight Markdown parser
 */

class PigeonMarkdown {
  /**
   * Creates an instance of the parser
   * @param {Object} options - Parser options
   */
  constructor(options = {}) {
    const defaultOptions = {
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

    this.options = {
      ...defaultOptions,
      ...options,
      features: {
        ...defaultOptions.features,
        ...(options.features || {})
      }
    };
  }

  /**
   * Parses Markdown into HTML
   * @param {string} markdown - Text in Markdown format
   * @returns {string} HTML
   */
  parse(markdown) {
    if (typeof markdown !== 'string') {
      return '';
    }

    let text = markdown.replace(/\r\n?/g, '\n').trim();
    
    if (!text) {
      return '';
    }
    
    if (this.options.features.headings) {
      text = text.replace(/^(#{1,3})\s+(.+?)\s*$/gm, (match, hashes, content) => {
        const level = hashes.length;
        return `<h${level}>${content}</h${level}>`;
      });
      
      const lines = text.split('\n');
      for (let i = 1; i < lines.length; i++) {
        const prevLine = lines[i - 1].trim();
        const currentLine = lines[i].trim();
        
        if (currentLine.match(/^=+$/) && !prevLine.match(/^<h[1-6]>/) && prevLine) {
          lines[i-1] = `<h1>${prevLine}</h1>`;
          lines[i] = '';
        } else if (currentLine.match(/^-+$/) && !prevLine.match(/^<h[1-6]>/) && prevLine) {
          lines[i-1] = `<h2>${prevLine}</h2>`;
          lines[i] = '';
        }
      }
      text = lines.filter(Boolean).join('\n');
    }

    const codeBlockMatches = [];
    if (this.options.features.codeBlock) {
      text = text.replace(/```(\w*)\n([\s\S]*?)\n```/g, (match, language, code) => {
        const id = `__CODE_BLOCK_${codeBlockMatches.length}__`;
        codeBlockMatches.push({ 
          id, 
          code: code, 
          language: (language || '').trim() 
        });
        return `\n${id}\n`;
      });
    }
    
    const lines = text.split('\n');
    const result = [];
    let currentParagraph = [];
    
    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const content = currentParagraph.join('<br>').trim();
        result.push(`<p>${content}</p>`);
        currentParagraph = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const codeBlock = codeBlockMatches.find(block => lines[i].includes(block.id));
      if (codeBlock) {
        flushParagraph();
        result.push(this.wrapCodeBlock(codeBlock.code, codeBlock.language));
        continue;
      }
      
      const line = lines[i].trim();
      
      if (!line) {
        flushParagraph();
        if (this.options.breaks) {
          result.push('<br>');
        }
        continue;
      }
      
      if (line.match(/^<h[1-6]>/)) {
        flushParagraph();
        result.push(line);
        continue;
      }
      
      if (line.startsWith('<pre>') || line.startsWith('</pre>') || 
          line.startsWith('<code>') || line.startsWith('</code>')) {
        flushParagraph();
        result.push(line);
        continue;
      }
      
      const processedLine = this.parseInlineElements(line);
      if (processedLine) {
        currentParagraph.push(processedLine);
      }
    }
    
    flushParagraph();

    return result.join('');
  }

  /**
   * Parses inline elements in a line
   * @private
   */
  parseInlineElements(text) {
    if (!this.options.html) {
      text = this.escapeHtml(text);
    }

    const { features } = this.options;

    if (features.bold || features.italic) {
      if (features.bold && features.italic) {
        text = text
          .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
          .replace(/___(.*?)___/g, '<strong><em>$1</em></strong>');
      }
      
      if (features.bold) {
        text = text
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/__(.*?)__/g, '<strong>$1</strong>');
      }
      
      if (features.italic) {
        text = text
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/_(.*?)_/g, '<em>$1</em>');
      }
    }

    if (features.strikethrough) {
      text = text.replace(/~~(.*?)~~/g, '<del>$1</del>');
    }
    
    if (features.underline) {
      text = text.replace(/~(.+?)~/g, '<u>$1</u>');
    }

    if (features.inlineCode) {
      text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    }

    if (features.links) {
      text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    }

    return text;
  }

  /**
   * Wraps code block with syntax highlighting tags
   * @private
   */
  wrapCodeBlock(code, language = '') {
    const escapedCode = this.escapeHtml(code);
    if (language) {
      return `\n<pre><code class="language-${language}">${escapedCode}</code></pre>\n`;
    }
    return `\n<pre><code>${escapedCode}</code></pre>\n`;
  }

  /**
   * Escapes HTML tags for security
   * @private
   */
  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = PigeonMarkdown;
} else if (typeof define === 'function' && define.amd) {
  define([], () => PigeonMarkdown);
} else if (typeof window !== 'undefined') {
  window.PigeonMarkdown = PigeonMarkdown;
}
