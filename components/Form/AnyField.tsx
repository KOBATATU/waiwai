import { ReactNode } from "react"

import { Label } from "@/components/ui/label"

type AnyFormProps = {
  label?: string
  description?: string
  error?: string[] | string
  required?: boolean
  children: ReactNode
}

export const AnyField = ({
  label,
  required,
  description,
  error,
  children,
}: AnyFormProps) => {
  return (
    <section className="flex flex-col gap-2">
      <header className="flex items-center gap-2">
        <Label className="flex items-center gap-1.5 text-sm font-bold">
          {label}
          {required && (
            <span className="text-xs text-red-500 font-bold">Required</span>
          )}
        </Label>
      </header>
      {children}
      <footer>
        {description && <span className="text-sm">{description}</span>}
        {error && (
          <ul className="text-red-500 text-xs">
            {Array.isArray(error) ? (
              error.map((err, index) => <li key={index}>{err}</li>)
            ) : (
              <li>{error}</li>
            )}
          </ul>
        )}
      </footer>
    </section>
  )
}
