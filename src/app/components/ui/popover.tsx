"use client";

import * as React from "react";
import { useCallback, useRef } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "./utils";
import { mergeRefs } from "./merge-refs";
import { bindGsapRadixPresence, type RadixPresenceVariant } from "@/app/lib/gsapRadixPresence";

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    presenceVariant?: RadixPresenceVariant;
  }
>(function PopoverContent(
  { className, align = "center", sideOffset = 4, presenceVariant = "zoom", ...props },
  forwardedRef,
) {
  const cleanupRef = useRef<(() => void) | null>(null);
  const bindRef = useCallback(
    (node: HTMLDivElement | null) => {
      cleanupRef.current?.();
      cleanupRef.current = null;
      if (node) cleanupRef.current = bindGsapRadixPresence(node, presenceVariant);
    },
    [presenceVariant],
  );

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        forceMount
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        ref={mergeRefs(bindRef, forwardedRef)}
        className={cn(
          "bg-popover text-popover-foreground z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden data-[state=closed]:pointer-events-none",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
export type { RadixPresenceVariant };
