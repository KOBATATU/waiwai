"use client"

import { useRouter } from "next/navigation"
import { UserSigninSchema } from "@/features/server/domain/user/user"
import { getFormProps, getInputProps } from "@conform-to/react"
import { signIn } from "next-auth/react"

import { ConformStateType, useConform } from "@/hooks/useConform"
import { Input } from "@/components/ui/input"
import { ActionButton } from "@/components/Button/ActionButton"
import { AnyField } from "@/components/Form/AnyField"

import { signinAction } from "../../actions/signinAction"

export const Signin = () => {
  const router = useRouter()
  const [form, fields, action] = useConform(
    async (prev: ConformStateType, formData: FormData) => {
      const result = await signinAction(prev, formData)
      if (result.submission.status === "success") {
        const email = result.value.email
        const password = result.value.password

        const authResult = await signIn("credentials", {
          redirect: false,
          email,
          password,
        })
        if (authResult?.ok) {
          router.refresh()
        }
      }
      return result.submission
    },
    {
      schema: UserSigninSchema,
    }
  )

  return (
    <div className="mx-auto w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <h1 className="text-xl font-bold  mb-4 text-center">signin</h1>

      <form
        action={action}
        {...getFormProps(form)}
        className="w-full flex flex-col items-center justify-center  mx-auto lg:py-0 gap-4 "
      >
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
          signin
        </ActionButton>
      </form>
    </div>
  )
}
