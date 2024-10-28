"use client"

import { updateCompetitionCompleteAction } from "@/features/client/competition/actions/updateCompetitionCompleteAction"
import { CompetitionCompleteSchema } from "@/features/server/domain/competition/competition"
import { getFormProps, getInputProps } from "@conform-to/react"

import { ConformStateType, useConform } from "@/hooks/useConform"
import { Input } from "@/components/ui/input"
import { ActionButton } from "@/components/Button/ActionButton"

type CompleteButtonProps = {
  id: string
}

export const CompleteButton = ({ id }: CompleteButtonProps) => {
  const [form, fields, action] = useConform(
    async (prev: ConformStateType, formData: FormData) => {
      if (!confirm("competition completed ok?")) {
        return
      }
      const result = await updateCompetitionCompleteAction(prev, formData)

      return result.submission
    },
    {
      schema: CompetitionCompleteSchema,
    }
  )

  return (
    <div className="mt-5">
      <form action={action} {...getFormProps(form)}>
        <Input
          className="hidden"
          {...getInputProps(fields.id, { type: "text" })}
          key={fields.id.key}
          defaultValue={id}
        />

        <ActionButton>completed</ActionButton>
      </form>
    </div>
  )
}
