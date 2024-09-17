import Link from "next/link"
import { GetCompetitionServiceType } from "@/features/server/service/competition/base/getService"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type CompetitionListProps = {
  competitions:
    | GetCompetitionServiceType["getCompetitionsByAdmin"]
    | GetCompetitionServiceType["getCompetitions"]
  isAdminPage?: boolean
  className?: string
}

export const CompetitionList = ({
  competitions,
  isAdminPage,
  className,
}: CompetitionListProps) => {
  return (
    <section
      className={cn(
        "grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6 p-4  overflow-hidden ",
        className
      )}
    >
      {competitions[0].map((competition) => {
        return (
          <Card
            key={competition.id}
            className="hover:scale-105 transition-all  flex flex-col justify-between  w-full max-w-sm rounded-lg overflow-hidden shadow-md  "
          >
            <Link
              href={
                isAdminPage
                  ? `/admin/competitions/${competition.id}`
                  : `/competitions/${competition.id}`
              }
              className="flex-grow"
            >
              <img
                src="/waiwai.png"
                alt="Product Image"
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <CardContent className="max-w-[280px] p-4 ">
                <div className="flex-grow">
                  <CardTitle className="text-lg font-medium  break-words">
                    {competition.title}
                  </CardTitle>
                  <CardDescription className=" break-words text-gray-500 dark:text-gray-400">
                    {competition.subtitle}
                  </CardDescription>
                </div>
              </CardContent>
            </Link>
            <CardFooter className="p-4 flex items-center justify-between border-t">
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        )
      })}
    </section>
  )
}
