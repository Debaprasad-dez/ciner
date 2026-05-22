import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Markdown({ content }: { content: string }) {
  return (
    <div className="space-y-2 font-ui text-sm leading-relaxed text-text-secondary">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
          em: ({ children }) => <em className="italic text-accent-gold">{children}</em>,
          ul: ({ children }) => <ul className="ml-1 space-y-1.5">{children}</ul>,
          ol: ({ children }) => <ol className="ml-4 list-decimal space-y-1.5">{children}</ol>,
          li: ({ children }) => (
            <li className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-crimson" />
              <span className="flex-1">{children}</span>
            </li>
          ),
          h1: ({ children }) => <h3 className="font-display text-base italic text-text-primary">{children}</h3>,
          h2: ({ children }) => <h3 className="font-display text-base italic text-text-primary">{children}</h3>,
          h3: ({ children }) => <h4 className="font-ui text-sm font-semibold text-text-primary">{children}</h4>,
          a: ({ children, href }) => (
            <a href={href} className="text-accent-teal underline" target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="rounded bg-void-2 px-1.5 py-0.5 font-mono text-xs text-accent-teal">{children}</code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-accent-violet pl-3 italic text-text-muted">{children}</blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
