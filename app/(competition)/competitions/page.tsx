import { getQueryParameter, GetQueryParameter } from "@/lib/utils"
import { SiteHeader } from "@/components/Header/Header"

import { RootContainer } from "./_components/RootContainer"

type IndexPageProps = GetQueryParameter

export default function IndexPage({ searchParams }: IndexPageProps) {
  const queryParameter = getQueryParameter({ searchParams })

  return (
    <div>
      <SiteHeader />
      <RootContainer queryParameter={queryParameter} />
    </div>
  )
}
