"use client"

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Collapsible = forwardRef(function Collapsible({ className, ...props }, ref) {
  return (
    <div ref={ref} className={cn("collapsible-root", className)} {...props} />
  );
});

export { Collapsible };
