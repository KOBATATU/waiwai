import Link from "next/link"
import { GetCompetitionServiceType } from "@/features/server/service/competition/base/getService"

import { cn, formatUTCString } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Pagination } from "@/components/Pagination/Pagination"

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
    <div className={cn(" p-4  ", className)}>
      <section
        className={cn(
          "grid grid-cols-1 gap-6  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 "
        )}
      >
        {competitions[0].map((competition) => {
          return (
            <Card
              key={competition.id}
              className="hover:scale-105 transition-all  flex flex-col justify-between  w-full max-w-sm rounded-lg  shadow-md  "
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
                  <div className="">
                    <CardTitle className="text-lg font-medium  break-words">
                      {competition.title}
                    </CardTitle>
                    <CardDescription className=" break-words text-gray-500 dark:text-gray-400">
                      {competition.subtitle}
                    </CardDescription>
                  </div>
                  <ul className="text-sm mt-2">
                    <li>{competition._count.teams} teams</li>
                  </ul>
                </CardContent>
              </Link>
              <CardFooter className="p-4 flex items-center justify-between border-t text-sm">
                <p>end date: {formatUTCString(competition.endDate)}</p>
              </CardFooter>
            </Card>
          )
        })}
      </section>

      <Pagination
        className="mt-4"
        nextPagePath={
          isAdminPage
            ? `/admin/competitions?page=${competitions[1].nextPage}`
            : `/competitions?page=${competitions[1].nextPage}`
        }
        previousPagePath={
          isAdminPage
            ? `/admin/competitions?page=${competitions[1].previousPage}`
            : `/competitions?page=${competitions[1].previousPage}`
        }
        meta={competitions[1]}
      />
    </div>
  )
}
