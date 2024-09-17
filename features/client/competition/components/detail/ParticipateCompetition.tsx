"use client"

import { CompetitionSchema } from "@/prisma/generated/zod"
import { getFormProps, getInputProps } from "@conform-to/react"

import { ConformStateType, useConform } from "@/hooks/useConform"
import { Input } from "@/components/ui/input"
import { ActionButton } from "@/components/Button/ActionButton"

import { createCompetitionParticipateAction } from "../../actions/createCompetitionParticipateAction"

type ParticipateCompetitionProps = {
  id: string
}

export const ParticipateCompetition = ({ id }: ParticipateCompetitionProps) => {
  const [form, fields, action] = useConform(
    async (prev: ConformStateType, formData: FormData) => {
      const result = await createCompetitionParticipateAction(prev, formData)

      return result.submission
    },
    {
      schema: CompetitionSchema.pick({ id: true }),
      defaultValue: {
        id,
      },
    }
  )

  return (
    <div>
      <p>You can participate in the competition by clicking below button.</p>
      <form className="w-full" action={action} {...getFormProps(form)}>
        <Input
          className="hidden"
          {...getInputProps(fields.id, { type: "text" })}
          key={fields.id.key}
          defaultValue={id}
        />
        <ActionButton className="rounded-full mt-4" type="submit">
          Participate
        </ActionButton>
      </form>
    </div>
  )
}
