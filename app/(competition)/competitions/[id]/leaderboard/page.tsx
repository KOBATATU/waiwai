import { GetQueryParameter } from "@/lib/utils"

import { RootContainer } from "./_components/RootContainer"

type PageProps = {
  params: { id: string }
} & GetQueryParameter

export default function Page({ params, searchParams }: PageProps) {
  const tabQuery = typeof searchParams.tab === "string" ? searchParams.tab : ""

  return <RootContainer id={params.id} tabQuery={tabQuery} />
}
