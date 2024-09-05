import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkGfm from "remark-gfm"

import styles from "./styles.module.css"

const getTitle = (props: any) => {
  return props.node?.children[0] && "value" in props.node?.children[0]
    ? props.node?.children[0].value
    : ""
}
export const Markdown = ({ body }: { body: string }) => {
  return (
    <ReactMarkdown
      skipHtml={true}
      children={body!}
      className={`${styles.markdown} `}
      remarkPlugins={[remarkGfm]}
      components={{
        h1: (props) => {
          const title = getTitle(props)
          return <h1 id={title}>{title}</h1>
        },
        h2: (props) => {
          const title = getTitle(props)
          return <h2 id={title}>{title}</h2>
        },
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
