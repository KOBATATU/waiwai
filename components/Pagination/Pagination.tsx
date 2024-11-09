import Link from "next/link"
import { PageNumberPaginationMeta } from "prisma-extension-pagination"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type PaginationProps = {
  nextPagePath: string
  previousPagePath: string
  meta: PageNumberPaginationMeta<true>

  className?: string
}

export const Pagination = ({
  className,
  nextPagePath,
  previousPagePath,
  meta,
}: PaginationProps) => {
  return (
    <div className={cn("flex justify-center", className)}>
      {meta.previousPage && (
        <Link href={previousPagePath} className="text-center">
          <Button variant="outline">back({meta.previousPage}ページへ)</Button>
        </Link>
      )}
      {meta.nextPage && (
        <Link href={nextPagePath} className="text-center">
          <Button>next page</Button>
        </Link>
      )}
    </div>
  )
}
