import { GetQueryParameter, getQueryParameter } from "@/lib/utils"

import { RootContainer } from "./_components/RootContainer"

type IndexPageProps = { params: { id: string } } & GetQueryParameter

export default function Page({ params, searchParams }: IndexPageProps) {
  const queryParameter = getQueryParameter({ searchParams })

  return <RootContainer id={params.id} queryParameter={queryParameter} />
}
