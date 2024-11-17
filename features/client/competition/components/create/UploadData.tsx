"use client"

import { Delete, UploadIcon } from "lucide-react"

import { cn, handleDownload } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

import { deleteCompetitionDataAction } from "../../actions/deleteCompetitionDataAction"
import { downloadCompetitionDataAction } from "../../actions/downloadCompetitionDataAction"
import { uploadCompetitionDataAction } from "../../actions/uploadCompetitionDataAction"

type UploadDataProps = {
  id: string
  competitionDatas: {
    id: string
    dataPath: string
  }[]
  className?: string
}

export const UploadData = ({
  id,
  className,
  competitionDatas,
}: UploadDataProps) => {
  const { toast } = useToast()
  return (
    <div className={cn("mt-4 p-4  rounded-md shadow-md", className)}>
      <h2 className="text-xl font-bold ">datasource</h2>
      <p className="text-sm text-gray-500">
        The datasource represents CSV data that users can download.
      </p>
      <form className="mt-4 mx-auto mb-4 max-w-sm cursor-pointer items-center rounded-lg border-2 border-dashed border-gray-400  p-6 ">
        <input
          onChange={async (e) => {
            const file = e.target.files && e.target.files[0]
            if (file) {
              const formData = new FormData()
              formData.append("id", id)
              formData.append("file", file)

              const result = await uploadCompetitionDataAction(
                undefined,
                formData
              )
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
            }
          }}
          id="upload"
          type="file"
          className="hidden"
          accept="text/csv"
        />
        <label htmlFor="upload" className="cursor-pointer">
          <UploadIcon className="mx-auto size-8" />
          <h2 className="mb-2 text-center text-xl font-bold tracking-tight text-gray-700">
            upload data file
          </h2>
        </label>
      </form>
      <div>
        <h3 className="text-lg font-bold ">File</h3>
        <ul className="list-disc ml-3">
          {competitionDatas.map((competitionData) => {
            const filename = competitionData.dataPath.split("/").at(-1)
            return (
              <li key={competitionData.id} className="flex gap-2 items-center">
                <button
                  className=" text-sm text-blue-500  hover:border-b cursor-pointer"
                  onClick={async () => {
                    const formData = new FormData()
                    formData.append("competitionDataId", competitionData.id)

                    const url = await downloadCompetitionDataAction(
                      undefined,
                      formData
                    )
                    if (url.value.url) {
                      handleDownload(url.value.url, filename)
                    }
                  }}
                >
                  ・{filename}
                </button>
                <Delete
                  className="  cursor-pointer"
                  onClick={async () => {
                    if (confirm(`delete ${filename} ok?`)) {
                      const formData = new FormData()
                      formData.append("id", competitionData.id)
                      await deleteCompetitionDataAction(undefined, formData)
                    }
                  }}
                />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
