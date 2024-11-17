"use client"

import { updateUserAction } from "@/features/client/user/actions/updateUserAction"
import { UserNameSchema } from "@/features/server/domain/user/user"
import { getFormProps, getInputProps } from "@conform-to/react"

import { useToast } from "@/hooks/use-toast"
import { ConformStateType, useConform } from "@/hooks/useConform"
import { Input } from "@/components/ui/input"
import { ActionButton } from "@/components/Button/ActionButton"
import { AnyField } from "@/components/Form/AnyField"

type EditUserProps = {
  name: string
}

export const EditUser = ({ name }: EditUserProps) => {
  const { toast } = useToast()
  const [form, fields, action] = useConform(
    async (prev: ConformStateType, formData: FormData) => {
      const result = await updateUserAction(prev, formData)

      if (result.submission.status === "success") {
        toast({
          title: "success",
          description: "success change user!",
        })
      } else {
        toast({
          variant: "destructive",
          title: "failed",
          description: "failed change user",
        })
      }
      return result.submission
    },
    {
      schema: UserNameSchema,
      defaultValue: {
        name,
      },
    }
  )

  return (
    <form className="w-full" action={action} {...getFormProps(form)}>
      <h2 className="font-bold text-xl">Basic</h2>
      <div className="flex gap-2 items-center">
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
      </div>
      <ActionButton className="rounded-full mt-4" type="submit">
        save
      </ActionButton>
    </form>
  )
}
