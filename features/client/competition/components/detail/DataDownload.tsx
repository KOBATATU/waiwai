"use client"

import { downloadCompetitionDataAction } from "@/features/client/competition/actions/downloadCompetitionDataAction"

import { cn, handleDownload } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

type DataDownloadProps = {
  id: string
  competitionDatas: {
    id: string
    dataPath: string
  }[]
  isCompetitionParticipated: boolean
  className?: string
}
export const DataDownload = ({
  id,
  className,
  isCompetitionParticipated,
  competitionDatas,
}: DataDownloadProps) => {
  const { toast } = useToast()

  return (
    <div className={cn("mt-4 p-4  rounded-md shadow-md", className)}>
      <h2 className="text-xl font-bold mb-4">datasource</h2>
      <div>
        <h3 className="text-lg font-bold mb-4">File</h3>
        <ul className="list-disc ml-3">
          {competitionDatas.map((competitionData) => {
            const filename = competitionData.dataPath.split("/").at(-1)
            return (
              <li key={competitionData.id} className="flex gap-2 items-center">
                <button
                  className={`${isCompetitionParticipated ? "hover:border-b cursor-pointer text-blue-500" : ""}`}
                  onClick={async () => {
                    if (!isCompetitionParticipated) return

                    const formData = new FormData()
                    formData.append("competitionDataId", competitionData.id)

                    const result = await downloadCompetitionDataAction(
                      undefined,
                      formData
                    )

                    if (result.submission.status === "success") {
                      toast({
                        title: "success",
                        description: "success download data!",
                      })
                      if (result.value.url) {
                        handleDownload(result.value.url, filename)
                      }
                    } else {
                      toast({
                        variant: "destructive",
                        title: "failed",
                        description: "failed download data",
                      })
                    }
                  }}
                >
                  ・{filename}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
