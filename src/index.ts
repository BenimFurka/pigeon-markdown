interface ParserOptions {
  features?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    inlineCode?: boolean;
    codeBlock?: boolean;
    links?: boolean;
    headings?: boolean;
  };
}

interface CodeBlock {
  id: string;
  code: string;
  language: string;
}

export class PigeonMarkdown {
  private options: Required<ParserOptions>;

  constructor(options: ParserOptions = {}) {
    const defaultOptions: Required<ParserOptions> = {
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
   * @param markdown - Text in Markdown format
   * @returns HTML string
   */
  public parse(markdown: string): string {
    if (typeof markdown !== 'string') {
      return '';
    }

    let text = markdown.replace(/\r\n?/g, '\n').trim();
    
    if (!text) {
      return '';
    }
    
    if (this.options.features.headings) {
      text = text.replace(/^(#{1,3})\s+(.+?)\s*$/gm, (match: string, hashes: string, content: string) => {
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

    const codeBlockMatches: CodeBlock[] = [];
    if (this.options.features.codeBlock) {
      text = text.replace(/```(\w*)\n([\s\S]*?)\n```/g, (match: string, language: string, code: string) => {
        const id = `__CODE_BLOCK_${codeBlockMatches.length}__`;
        codeBlockMatches.push({ 
          id, 
          code, 
          language: (language || '').trim() 
        });
        return `\n${id}\n`;
      });
    }
    
    const lines = text.split('\n');
    const result: string[] = [];
    let currentParagraph: string[] = [];
    
    const flushParagraph = (): void => {
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
        result.push(`<pre><code class="language-${codeBlock.language || 'plaintext'}">${this.escapeHtml(codeBlock.code)}</code></pre>`);
        continue;
      }

      const line = lines[i].trim();
      
      if (line === '') {
        flushParagraph();
      } else {
        let processedLine = line;
        
        if (this.options.features.bold) {
          processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                     .replace(/__(.*?)__/g, '<strong>$1</strong>');
        }
        
        if (this.options.features.italic) {
          processedLine = processedLine.replace(/\*(.*?)\*/g, '<em>$1</em>')
                                     .replace(/_(.*?)_/g, '<em>$1</em>');
        }
        
        if (this.options.features.strikethrough) {
          processedLine = processedLine.replace(/~~(.*?)~~/g, '<del>$1</del>');
        }
        
        if (this.options.features.underline) {
          processedLine = processedLine.replace(/__(.*?)__/g, '<u>$1</u>');
        }
        
        if (this.options.features.inlineCode) {
          processedLine = processedLine.replace(/`([^`]+)`/g, '<code>$1</code>');
        }
        
        if (this.options.features.links) {
          processedLine = processedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        }
        
        currentParagraph.push(processedLine);
      }
    }
    
    flushParagraph();
    
    return result.join('\n');
  }
  
  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// UMD/CommonJS export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PigeonMarkdown;
}

// AMD export
declare let define: any;
if (typeof define === 'function' && define.amd) {
  define([], () => PigeonMarkdown);
}

// Browser global
if (typeof window !== 'undefined') {
  (window as any).PigeonMarkdown = PigeonMarkdown;
}

export default PigeonMarkdown;
