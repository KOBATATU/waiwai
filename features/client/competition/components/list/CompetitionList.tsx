import Link from "next/link"
import { GetCompetitionServiceType } from "@/features/server/service/competition/base/getService"

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
}

export const CompetitionList = ({ competitions }: CompetitionListProps) => {
  return (
    <section className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-3  gap-6 p-4  overflow-hidden ">
      {competitions[0].map((competition) => {
        return (
          <Card
            key={competition.id}
            className="hover:scale-105 transition-all  flex flex-col justify-between  w-full max-w-sm rounded-lg overflow-hidden shadow-md  "
          >
            <Link
              href={`/admin/competitions/${competition.id}`}
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

      {/* <Card className="h-[320px] overflow-hidden rounded-lg shadow-sm transition-all hover:scale-105 ">
        <Link href="#">
          <CardHeader className="p-0">
            <img
              src="/waiwai.png"
              alt="Card Image"
              width="250"
              height="200"
              className="h-20 w-full object-cover"
            />
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle>Card Title Description Description</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Link>
      </Card> */}
    </section>
  )
}
