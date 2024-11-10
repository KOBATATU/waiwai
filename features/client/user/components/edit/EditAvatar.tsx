"use client"

import { useState } from "react"
import { uploadUserAvatarAction } from "@/features/client/user/actions/uploadAvatarAction"
import { UserAvatarSchema } from "@/features/server/domain/user/user"
import { getFormProps, getInputProps } from "@conform-to/react"
import { UploadIcon } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { ConformStateType, useConform } from "@/hooks/useConform"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ActionButton } from "@/components/Button/ActionButton"
import { AnyField } from "@/components/Form/AnyField"

type EditAvatarProps = {
  avatar?: string | null
}

export const EditAvatar = ({ avatar }: EditAvatarProps) => {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [form, fields, action] = useConform(
    async (prev: ConformStateType, formData: FormData) => {
      const result = await uploadUserAvatarAction(prev, formData)

      if (result.submission.status === "success") {
        toast({
          title: "success",
          description: "success change profile icon!",
        })
        setOpen(false)
      } else {
        toast({
          variant: "destructive",
          title: "failed",
          description: `failed change profile icon: ${result.value?.code}(code)`,
        })
      }
      return result.submission
    },
    {
      schema: UserAvatarSchema,
      defaultValue: {
        avatar,
      },
    }
  )

  return (
    <div>
      <h2 className="font-bold text-xl">Avatar</h2>
      <div className="flex gap-2 items-center">
        <AnyField
          error={fields.avatar.errors}
          label="avatar"
          description="user profile icon image. By clicking, you can change the image"
        >
          <Avatar className="size-40">
            <AvatarImage
              width={"100"}
              height={"100"}
              src={avatar ?? ""}
              alt={"name"}
              onClick={() => setOpen(true)}
            />
            <AvatarFallback onClick={() => setOpen(true)}>?</AvatarFallback>
          </Avatar>
        </AnyField>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Profile Image</DialogTitle>
          </DialogHeader>
          <form action={action} {...getFormProps(form)}>
            <div className="mx-auto mb-4 max-w-sm cursor-pointer items-center rounded-lg border-2 border-dashed border-gray-400  p-6 ">
              <Input
                {...getInputProps(fields.file, { type: "text" })}
                placeholder="File"
                id="upload"
                type="file"
                className="hidden"
                accept="image/png, image/jpeg"
                key={fields.file.key}
              />

              <label htmlFor="upload" className="cursor-pointer">
                <UploadIcon className="mx-auto size-8" />
                <h2 className="mb-2 text-center text-xl font-bold tracking-tight text-gray-700">
                  upload image file
                </h2>
              </label>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              filename: {(fields.file?.value as File)?.name ?? ""}
            </p>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                variant="outline"
                type="button"
                onClick={() => {
                  setOpen(false)
                }}
              >
                cancel
              </Button>
              <ActionButton className="flex-1" type="submit">
                create
              </ActionButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
