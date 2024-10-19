"use client"

import { signupAction } from "@/features/client/user/actions/signupAction"
import { UserSignupSchema } from "@/features/server/domain/user/user"
import { getFormProps, getInputProps } from "@conform-to/react"

import { ConformStateType, useConform } from "@/hooks/useConform"
import { Input } from "@/components/ui/input"
import { ActionButton } from "@/components/Button/ActionButton"
import { AnyField } from "@/components/Form/AnyField"

export const Signup = () => {
  const [form, fields, action] = useConform(
    async (prev: ConformStateType, formData: FormData) => {
      const result = await signupAction(prev, formData)
      return result.submission
    },
    {
      schema: UserSignupSchema,
    }
  )

  return (
    <div className="mx-auto w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <h1 className="text-xl font-bold  mb-4 text-center">signup</h1>

      <form
        action={action}
        {...getFormProps(form)}
        className="w-full flex flex-col items-center justify-center  mx-auto lg:py-0 gap-4 "
      >
        <AnyField
          className="w-full px-4 py-2"
          error={fields.name.errors}
          label="name"
          required
        >
          <Input
            {...getInputProps(fields.name, { type: "text" })}
            placeholder="name"
            key={fields.name.key}
          />
        </AnyField>
        <AnyField
          className="w-full px-4 pb-2"
          error={fields.email.errors}
          label="email"
          required
        >
          <Input
            {...getInputProps(fields.email, { type: "email" })}
            placeholder="email"
            key={fields.email.key}
          />
        </AnyField>
        <AnyField
          className="w-full px-4 pb-2"
          error={fields.password.errors}
          label="password"
          required
        >
          <Input
            {...getInputProps(fields.password, { type: "password" })}
            placeholder="password"
            key={fields.password.key}
          />
        </AnyField>
        <ActionButton type="submit" className="mb-2 ">
          save
        </ActionButton>
      </form>
    </div>
  )
}
