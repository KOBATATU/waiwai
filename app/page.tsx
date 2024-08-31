"use client"

import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <div>
      <Button onClick={() => signIn("github")}>login</Button>
    </div>
  )
}
