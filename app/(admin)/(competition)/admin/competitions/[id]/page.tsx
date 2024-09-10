import { redirect } from "next/navigation"

export default function Page({ params }: { params: { id: string } }) {
  redirect(`/admin/competitions/${params.id}/overview`)
}
