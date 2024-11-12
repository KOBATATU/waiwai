"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function Error() {
  return (
    <div>
      <div className="sm:container px-2 grid items-center gap-6 pb-8 pt-6 md:py-10">
        <Button>
          <Link href={"/"}>home</Link>
        </Button>
      </div>
    </div>
  )
}
