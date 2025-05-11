import * as React from "react";
import { cn } from "@/lib/utils";
import { CarouselContent } from "./carousel-content";
import { CarouselItem } from "./carousel-item";
import { CarouselPrevious } from "./carousel-previous";
import { CarouselNext } from "./carousel-next";

const Carousel = React.forwardRef(function Carousel({ className, ...props }, ref) {
  return (
    <div ref={ref} className={cn("carousel-root", className)} {...props} />
  );
});

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}