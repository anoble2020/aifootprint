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

const defaultPlatforms = [
  {
    value: "cursor",
    label: "Cursor",
    disabled: false,
  },
  {
    value: "openai",
    label: "OpenAI",
    disabled: true,
  },
  {
    value: "claude",
    label: "Claude",
    disabled: true,
  },
  {
    value: "gemini",
    label: "Gemini",
    disabled: true,
  },
]

export function PlatformCombobox({ 
  value, 
  onValueChange, 
  className, 
  options = defaultPlatforms,
  placeholder = "Select platform..."
}) {
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
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-1 z-[10000] bg-white border shadow-lg" align="start" side="bottom" sideOffset={4}>
        <div className="space-y-1">
          {options.map((option) => (
            <button
              key={option.value}
              disabled={option.disabled}
              className={cn(
                "w-full flex items-center justify-start px-2 py-1.5 text-sm rounded-sm transition-colors",
                option.disabled 
                  ? "opacity-50 cursor-not-allowed text-gray-400" 
                  : "hover:bg-accent hover:text-accent-foreground",
                value === option.value && !option.disabled && "bg-accent text-accent-foreground"
              )}
              onClick={() => {
                if (!option.disabled) {
                  onValueChange(option.value)
                  setOpen(false)
                }
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === option.value ? "opacity-100" : "opacity-0"
                )}
              />
              {option.label}
              {option.disabled && (
                <span className="ml-auto text-xs text-gray-400">(Coming Soon)</span>
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
