"use client"

import { updateTeamNameAction } from "@/features/client/team/actions/updateTeamName"
import { TeamNameSchema } from "@/features/server/domain/team/team"
import { getFormProps, getInputProps } from "@conform-to/react"

import { useToast } from "@/hooks/use-toast"
import { ConformStateType, useConform } from "@/hooks/useConform"
import { Input } from "@/components/ui/input"
import { ActionButton } from "@/components/Button/ActionButton"
import { AnyField } from "@/components/Form/AnyField"

type TeamNameProps = {
  competitionId: string
  teamName: string
}

export const TeamName = ({ competitionId, teamName }: TeamNameProps) => {
  const { toast } = useToast()
  const [form, fields, action] = useConform(
    async (prev: ConformStateType, formData: FormData) => {
      const result = await updateTeamNameAction(prev, formData)

      if (result.submission.status === "success") {
        toast({
          title: "success",
          description: "success change teamname!",
        })
      } else {
        toast({
          variant: "destructive",
          title: "failed",
          description: "failed change teamname",
        })
      }
      return result.submission
    },
    {
      schema: TeamNameSchema,
      defaultValue: {
        competitionId,
        name: teamName,
      },
    }
  )

  return (
    <form className="w-full" action={action} {...getFormProps(form)}>
      <h2 className="font-bold text-xl">Basic</h2>
      <p className="texg-gray-500 text-sm mb-2">
        You can change the your team name.
      </p>

      <div className="flex gap-2 items-center">
        <Input
          className="hidden"
          {...getInputProps(fields.competitionId, { type: "text" })}
          key={fields.competitionId.key}
        />
        <AnyField
          error={fields.name.errors}
          label="name"
          required
          className="w-96"
        >
          <Input
            {...getInputProps(fields.name, { type: "text" })}
            placeholder="name"
            key={fields.name.key}
          />
        </AnyField>

        <ActionButton className="rounded-full mt-4" type="submit">
          save
        </ActionButton>
      </div>
    </form>
  )
}
