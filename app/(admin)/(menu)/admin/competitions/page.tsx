import { getQueryParameter, GetQueryParameter } from "@/lib/utils"

import { RootContainer } from "./_components/RootContainer"

type IndexPageProps = GetQueryParameter

export default function IndexPage({ searchParams }: IndexPageProps) {
  const queryParameter = getQueryParameter({ searchParams })
  return <RootContainer queryParameter={queryParameter} />
}
