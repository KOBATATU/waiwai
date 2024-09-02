"use client"

import { useState } from "react"
import { CompetitionTitleAndSubtitleSchema } from "@/features/server/domain/competition/competition"
import {
  getFormProps,
  getInputProps,
  getTextareaProps,
} from "@conform-to/react"
import { PlusIcon } from "lucide-react"

import { ConformStateType, useConform } from "@/hooks/useConform"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ActionButton } from "@/components/Button/ActionButton"
import { AnyField } from "@/components/Form/AnyField"

import { createCompetitionAction } from "../../actions/createCompetitionAction"

export const CreateCompetitionButton = () => {
  const [form, fields, action] = useConform(
    async (prev: ConformStateType, formData: FormData) => {
      const result = await createCompetitionAction(prev, formData)

      return result.submission
    },
    {
      schema: CompetitionTitleAndSubtitleSchema,
    }
  )
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="rounded-full flex gap-2">
            Create Competition <PlusIcon width={"20"} height={"20"} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Competition</DialogTitle>
            <DialogDescription>
              Please enter the title and subtitle. Other fields can be edited
              after entering these two.
            </DialogDescription>
          </DialogHeader>
          <form
            action={action}
            {...getFormProps(form)}
            className="flex flex-col gap-4"
          >
            <AnyField error={fields.title.errors} label="title" required>
              <Input
                {...getInputProps(fields.title, { type: "text" })}
                placeholder="title"
                key={fields.title.key}
              />
            </AnyField>

            <AnyField error={fields.subtitle.errors} label="subtitle" required>
              <Textarea
                {...getTextareaProps(fields.subtitle)}
                placeholder="In the subtitle, please explain what kind of competition it is."
                key={fields.subtitle.key}
              />
            </AnyField>
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
