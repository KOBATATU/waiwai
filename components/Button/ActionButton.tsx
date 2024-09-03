"use client"

import React from "react"
import { useFormStatus } from "react-dom"

import { Button, ButtonProps } from "@/components/ui/button"

export const ActionButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ disabled, ...props }, ref) => {
    const status = useFormStatus()

    return <Button disabled={disabled || status.pending} ref={ref} {...props} />
  }
)

ActionButton.displayName = "ActionButton"
