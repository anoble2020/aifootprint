"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

const platforms = [
  {
    value: "cursor",
    label: "Cursor",
  },
  {
    value: "openai",
    label: "OpenAI",
  },
  {
    value: "claude",
    label: "Claude",
  },
  {
    value: "gemini",
    label: "Gemini",
  },
]

export function PlatformCombobox({ value, onValueChange, className }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value
            ? platforms.find((platform) => platform.value === value)?.label
            : "Select platform..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-1 z-[10000] bg-white border shadow-lg" align="start" side="bottom" sideOffset={4}>
        <div className="space-y-1">
          {platforms.map((platform) => (
            <button
              key={platform.value}
              className={cn(
                "w-full flex items-center justify-start px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                value === platform.value && "bg-accent text-accent-foreground"
              )}
              onClick={() => {
                onValueChange(platform.value)
                setOpen(false)
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === platform.value ? "opacity-100" : "opacity-0"
                )}
              />
              {platform.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
