import React from "react"

import { cn } from "@/lib/utils"

type TOCProps = {
  body: string
  className?: string
}

const TOC = ({ body, className }: TOCProps) => {
  const lines = body.split("\n")
  const tocItems = lines
    .map((line) => {
      const trimmedLine = line.trimStart()
      const match = trimmedLine.match(/^#+/)
      if (!match) return null
      const level = match[0].length
      const text = trimmedLine.replace(/^#+\s*/, "")
      const id = text.toLowerCase().replace(/\s+/g, "-").replace(/-+$/, "")
      return { level, text, id }
    })
    .filter((item) => item !== null)

  return (
    <div className={cn("p-4 bg-gray-100 rounded-md shadow-md", className)}>
      <h2 className="text-lg font-bold mb-4">table of contents</h2>
      <ul className="list-disc ">
        {tocItems.map((item, index) => (
          <li
            key={index}
            className={cn({
              "ml-2": item.level === 1,
              "ml-6": item.level === 2,
              "ml-10": item.level === 3,
            })}
          >
            <a href={`#${item.id}`} className="text-blue-600 hover:underline">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TOC
