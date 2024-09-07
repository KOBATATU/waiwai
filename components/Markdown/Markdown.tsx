import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkGfm from "remark-gfm"

import styles from "./styles.module.css"

export const Markdown = ({ body }: { body: string }) => {
  return (
    <ReactMarkdown
      skipHtml={true}
      children={body!}
      className={`${styles.markdown} `}
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => {
          console.log(node, props)
          return (
            <h1
              id={props.children?.toString().toLowerCase().replace(/\s+/g, "-")}
            >
              {props.children}
            </h1>
          )
        },
        h2: ({ node, ...props }) => (
          <h2
            id={props.children?.toString().toLowerCase().replace(/\s+/g, "-")}
          >
            {props.children}
          </h2>
        ),
        h3: ({ node, ...props }) => (
          <h3
            id={props.children?.toString().toLowerCase().replace(/\s+/g, "-")}
          >
            {props.children}
          </h3>
        ),
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
