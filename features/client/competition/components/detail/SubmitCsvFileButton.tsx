"use client"

import { useState } from "react"
import { submitCsvFileAction } from "@/features/client/team/actions/submitCsvFileAction"
import { CompetitionTitleAndSubtitleSchema } from "@/features/server/domain/competition/competition"
import { TeamSubmitFileSchema } from "@/features/server/domain/team/team"
import {
  getFormProps,
  getInputProps,
  getTextareaProps,
} from "@conform-to/react"
import { PlusIcon, UploadIcon } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
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
import { ActionButton } from "@/components/Button/ActionButton"

type SubmitCsvFileButtonProps = {
  competitionId: string
  canSubmit: boolean
}

export const SubmitCsvFileButton = ({
  competitionId,
  canSubmit,
}: SubmitCsvFileButtonProps) => {
  const { toast } = useToast()
  const [form, fields, action] = useConform(
    async (prev: ConformStateType, formData: FormData) => {
      const result = await submitCsvFileAction(prev, formData)

      if (result.submission.status === "success") {
        toast({
          title: "success",
          description: "success upload data!",
        })
      } else {
        toast({
          variant: "destructive",
          title: "failed",
          description: "failed upload data",
        })
      }

      return result.submission
    },
    {
      schema: TeamSubmitFileSchema,
    }
  )
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            disabled={!canSubmit}
            className="rounded-full flex gap-2"
            size="sm"
          >
            submit prediction <PlusIcon width={"20"} height={"20"} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Prediction</DialogTitle>
            <DialogDescription>
              Please submit the predicted CSV file.
            </DialogDescription>
          </DialogHeader>

          <form action={action} {...getFormProps(form)}>
            <Input
              className="hidden"
              {...getInputProps(fields.competitionId, { type: "text" })}
              key={fields.competitionId.key}
              defaultValue={competitionId}
            />
            <div className="mx-auto mb-4 max-w-sm cursor-pointer items-center rounded-lg border-2 border-dashed border-gray-400  p-6 ">
              <Input
                {...getInputProps(fields.file, { type: "text" })}
                placeholder="File"
                id="upload"
                type="file"
                className="hidden"
                accept="text/csv"
                key={fields.file.key}
              />

              <label htmlFor="upload" className="cursor-pointer">
                <UploadIcon className="mx-auto size-8" />
                <h2 className="mb-2 text-center text-xl font-bold tracking-tight text-gray-700">
                  upload data file
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
                  form.reset()
                  setOpen(false)
                }}
              >
                cancel
              </Button>
              <ActionButton className="flex-1" type="submit">
                submit
              </ActionButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
