import { RootContainer } from "./_components/RootContainer"

export default function Page({ params }: { params: { id: string } }) {
  return <RootContainer id={params.id} />
}
