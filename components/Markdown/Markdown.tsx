import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"

import styles from "./styles.module.css"

export const Markdown = ({ body }: { body: string }) => {
  return (
    <ReactMarkdown
      skipHtml={true}
      children={body!}
      className={`${styles.markdown} `}
      components={{
        code({ node, className, children, ref, ...props }) {
          const match = /language-(\w+)/.exec(className || "")
          return match ? (
            <SyntaxHighlighter
              children={String(children).replace(/\n$/, "")}
              style={dracula as any}
              language={match[1]}
              PreTag="div"
              {...props}
            />
          ) : (
            <code {...props}>{children}</code>
          )
        },
      }}
    />
  )
}
