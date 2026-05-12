import React from "react";
import { cn } from "../ui/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

/**
 * Shared page container.
 * All sections and the navbar use this so horizontal
 * alignment is consistent across every breakpoint.
 */
export function Container({ children, className, as: Tag = "div" }: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full px-6", className)}>
      {children}
    </Tag>
  );
}
