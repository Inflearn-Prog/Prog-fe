"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default" | "lg";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        // Layout & spacing
        "flex w-fit items-center justify-between gap-2",
        "px-4 py-2 rounded-md",
        // Typography
        "text-sm whitespace-nowrap",
        // Border & background
        "border border-input bg-transparent",
        // Shadow & transition
        "shadow-xs transition-[color,box-shadow]",
        // Focus & outline
        "outline-none",
        // Size variants
        "data-[size=default]:h-9 data-[size=sm]:h-8 data-[size=lg]:h-12 ",
        // Placeholder state
        "data-[placeholder]:text-muted-foreground",
        // Open state
        "data-[state=open]:border-frog-300",
        "data-[state=open]:text-frog-600",
        "data-[state=open]:bg-frog-100",
        // Disabled state
        "disabled:cursor-not-allowed",
        // Invalid state
        "aria-invalid:border-destructive",
        // Dark mode
        "dark:bg-input/30 dark:hover:bg-input/50",
        // SelectValue styles
        "*:data-[slot=select-value]:line-clamp-1",
        "*:data-[slot=select-value]:flex",
        "*:data-[slot=select-value]:items-center",
        "*:data-[slot=select-value]:gap-2",
        // SVG styles
        "[&_svg]:pointer-events-none",
        "[&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-4",
        "[&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon
          className={cn("size-4 opacity-50", "hover:text-frog-600")}
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          // Position & layout
          "relative z-50",
          "min-w-[8rem] max-h-(--radix-select-content-available-height)",
          "origin-(--radix-select-content-transform-origin)",
          // Overflow
          "overflow-x-hidden overflow-y-auto",
          // Styling
          "rounded-md border shadow-md",
          "bg-popover text-popover-foreground",
          // Animations - Open
          "data-[state=open]:animate-in",
          "data-[state=open]:fade-in-0",
          "data-[state=open]:zoom-in-95",
          // Animations - Closed
          "data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0",
          "data-[state=closed]:zoom-out-95",
          // Slide animations
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",
          // Popper position adjustments
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        // Layout
        "relative flex w-full items-center gap-2",
        // Spacing
        "py-1.5 pr-8 pl-2 rounded-sm",
        // Typography
        "text-sm",
        // Interaction
        "cursor-default select-none outline-hidden",
        // Focus state
        "focus:bg-accent focus:text-accent-foreground",
        // Disabled state
        "data-[disabled]:pointer-events-none",
        // SVG styles
        "[&_svg]:pointer-events-none",
        "[&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-4",
        "[&_svg:not([class*='text-'])]:text-muted-foreground",
        // Span styles
        "*:[span]:last:flex",
        "*:[span]:last:items-center",
        "*:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span
        data-slot="select-item-indicator"
        className="absolute right-2 flex size-3.5 items-center justify-center"
      />
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
