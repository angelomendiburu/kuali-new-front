"use client"

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Calendar = forwardRef(function Calendar({ className, ...props }, ref) {
  return (
    <div ref={ref} className={cn("calendar-root", className)} {...props} />
  );
});

export { Calendar };
