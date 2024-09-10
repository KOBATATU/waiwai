"use client"

import { useState } from "react"
import { CompetitionOverviewSchema } from "@/features/server/domain/competition/competition"
import {
  getFormProps,
  getInputProps,
  getTextareaProps,
} from "@conform-to/react"
import DOMPurify from "isomorphic-dompurify"
import { EditIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { ConformStateType, useConform } from "@/hooks/useConform"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ActionButton } from "@/components/Button/ActionButton"
import { AnyField } from "@/components/Form/AnyField"
import { Markdown } from "@/components/Markdown/Markdown"

import { updateCompetitioOverviewAction } from "../../actions/updateCompetitionOverviewAction"

type EditOverviewProp = {
  id: string
  description: string
}

export const EditOverview = ({ id, description }: EditOverviewProp) => {
  const [editMode, setEditMode] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const [form, fields, action] = useConform(
    async (prev: ConformStateType, formData: FormData) => {
      const result = await updateCompetitioOverviewAction(prev, formData)
      setEditMode(false)
      return result.submission
    },
    {
      schema: CompetitionOverviewSchema,
      defaultValue: {
        id,
      },
    }
  )

  return (
    <div className="w-full">
      {!editMode && (
        <Button
          variant="outline"
          className="flex gap-2 mb-4"
          onClick={() => {
            setEditMode(!editMode)
          }}
        >
          Edit <EditIcon className="size-4" />
        </Button>
      )}

      {editMode ? (
        <div className="w-full">
          <form className="w-full" action={action} {...getFormProps(form)}>
            <Input
              className="hidden"
              {...getInputProps(fields.id, { type: "text" })}
              key={fields.id.key}
              defaultValue={id}
            />
            <AnyField error={fields.description.errors}>
              <div className="flex gap-2 justify-end">
                <Button
                  variant={"outline"}
                  size={"sm"}
                  onClick={() => {
                    setPreviewMode(!previewMode)
                  }}
                  type="button"
                >
                  {previewMode ? "edit" : "preview"}
                </Button>
                <Button variant={"outline"} size={"sm"} type="button">
                  image upload
                </Button>
              </div>

              <Markdown
                body={DOMPurify.sanitize(fields.description.value as string)}
                className={cn(
                  !previewMode && "hidden",
                  "!h-96 overflow-scroll border rounded p-4"
                )}
              />
              <>
                <Textarea
                  className={cn("w-full h-96", previewMode && "hidden")}
                  {...getTextareaProps(fields.description)}
                  placeholder="In the subtitle, please explain what kind of competition it is."
                  key={fields.description.key}
                  defaultValue={description}
                />
              </>
            </AnyField>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setEditMode(false)
                }}
              >
                cancel
              </Button>
              <ActionButton type="submit">update</ActionButton>
            </div>
          </form>
        </div>
      ) : (
        <Markdown body={description} />
      )}
    </div>
  )
}
