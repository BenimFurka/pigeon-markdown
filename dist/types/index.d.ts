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
export declare class PigeonMarkdown {
    private options;
    constructor(options?: ParserOptions);
    /**
     * Parses Markdown into HTML
     * @param markdown - Text in Markdown format
     * @returns HTML string
     */
    parse(markdown: string): string;
    private escapeHtml;
}
export default PigeonMarkdown;
