import { SubmissionResult, useForm } from "@conform-to/react"
import { FormOptions } from "@conform-to/react/context"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { useFormState } from "react-dom"
import type { z } from "zod"

export type ConformStateType = SubmissionResult<string[]> | undefined

export type ConformServerAction = (
  previous: ConformStateType,
  formData: FormData
) => Promise<ConformStateType>

export const useConform = (
  serverAction: ConformServerAction,
  {
    schema,
    ...options
  }: Omit<FormOptions<z.output<z.ZodType>>, "formId"> & {
    schema: z.ZodType
  }
) => {
  const [lastResult, action] = useFormState(serverAction, undefined)

  const [form, fields] = useForm<z.output<z.ZodType>>({
    lastResult,
    onValidate({ formData }) {
      const parsed = parseWithZod(formData, { schema })
      return parsed
    },
    constraint: getZodConstraint(schema),
    shouldValidate: "onSubmit",
    ...options,
  })

  return [form, fields, action] as const
}
