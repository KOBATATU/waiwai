import Link from "next/link"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/Header/Header"

export default function IndexPage() {
  return (
    <div>
      <SiteHeader />
      <div className="flex items-center justify-center h-[80vh] ">
        <div className="text-center">
          <h1 className="text-6xl font-bold  mb-4">😀waiwai😀</h1>
          <p className="text-xl text-gray-700 mb-4">
            Let's enjoy the company competition
          </p>
          <Link href="/competitions">
            <Button variant="outline">start</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
