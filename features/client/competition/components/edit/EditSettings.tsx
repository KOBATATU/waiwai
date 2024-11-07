"use client"

import { updateCompetitionAction } from "@/features/client/competition/actions/updateCompetitionSettingAction"
import {
  CompetitionCustomOptionalDefaultsSchema,
  evaluationFuncOptions,
} from "@/features/server/domain/competition/competition"
import { GetCompetitionServiceType } from "@/features/server/service/competition/base/getService"
import {
  FieldMetadata,
  getFormProps,
  getInputProps,
  getTextareaProps,
} from "@conform-to/react"

import { toLocalISOString } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { ConformStateType, useConform } from "@/hooks/useConform"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ActionButton } from "@/components/Button/ActionButton"
import { AnyField } from "@/components/Form/AnyField"
import { SwitchConform } from "@/components/Form/Switch/Switch"

type EditSettingsProps = {
  competition: GetCompetitionServiceType["getCompetitionByIdAndAdmin"]
}

export const EditSettings = ({ competition }: EditSettingsProps) => {
  const { toast } = useToast()
  const [form, fields, action] = useConform(
    async (prev: ConformStateType, formData: FormData) => {
      const result = await updateCompetitionAction(prev, formData)

      if (result.submission.status === "success") {
        toast({
          title: "success",
          description: "success edit settings!",
        })
      } else {
        toast({
          variant: "destructive",
          title: "failed",
          description: "failed edit settings",
        })
      }

      return result.submission
    },
    {
      schema: CompetitionCustomOptionalDefaultsSchema,
      defaultValue: {
        ...competition,
      },
    }
  )
  return (
    <form
      action={action}
      {...getFormProps(form)}
      className="p-2 flex flex-col gap-4 w-full"
    >
      <Input
        className="hidden"
        {...getInputProps(fields.id, { type: "text" })}
        key={fields.id.key}
      />
      <h2 className="font-bold text-xl">Basic</h2>
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

      <h2 className="font-bold text-xl">Scoring & Teams</h2>
      <div className="flex gap-4 sm:flex-row flex-col">
        <AnyField
          className="flex-1"
          error={fields.limitSubmissionNum.errors}
          label="number of submissions"
          description="How many user can submit the number of submission files"
          required
        >
          <Input
            {...getInputProps(fields.limitSubmissionNum, { type: "number" })}
            placeholder="number of submissions"
            key={fields.limitSubmissionNum.key}
          />
        </AnyField>
      </div>

      <h2 className="font-bold text-xl">Schedule</h2>
      <div className="flex gap-4 sm:flex-row flex-col">
        <AnyField
          className="flex-1"
          error={fields.startDate.errors}
          label="competition start date"
          required
        >
          <Input
            {...getInputProps(fields.startDate, { type: "datetime-local" })}
            key={fields.startDate.key}
            defaultValue={toLocalISOString(competition.startDate)}
          />
        </AnyField>
        <AnyField
          className="flex-1"
          error={fields.endDate.errors}
          label="competition end date"
          required
        >
          <Input
            {...getInputProps(fields.endDate, { type: "datetime-local" })}
            key={fields.endDate.key}
            defaultValue={toLocalISOString(competition.endDate)}
          />
        </AnyField>
      </div>

      <h2 className="font-bold text-xl">Evaluation Func</h2>
      <AnyField
        className="flex-1"
        error={fields.evaluationFunc.errors}
        label="competition evaluationFunc"
        required
      >
        <Select
          key={fields.evaluationFunc.key}
          name={fields.evaluationFunc.name}
          defaultValue={competition.evaluationFunc}
          onValueChange={(value) => {
            form.update({
              name: fields.evaluationFunc.name,
              value,
            })
          }}
          value={fields.evaluationFunc.value as string}
        >
          <SelectTrigger id={fields.evaluationFunc.id}>
            <SelectValue placeholder="select evaluationFunc" />
          </SelectTrigger>
          <SelectContent>
            {evaluationFuncOptions.map((option) => {
              return (
                <SelectItem value={option.value} key={option.value}>
                  {option.label}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </AnyField>

      <h2 className="font-bold text-xl">User Access</h2>
      <AnyField
        className="flex-1"
        error={fields.open.errors}
        label="competition open"
        required
        description="All users can see this competition"
      >
        <SwitchConform meta={fields.open as FieldMetadata<boolean>} />
      </AnyField>

      <ActionButton className=" w-max" type="submit">
        update
      </ActionButton>
    </form>
  )
}
