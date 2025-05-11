import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

const Breadcrumb = React.forwardRef(function Breadcrumb({ className, ...props }, ref) {
  return (
    <nav ref={ref} className={cn("flex", className)} aria-label="Breadcrumb" {...props} />
  );
});

const BreadcrumbList = React.forwardRef(function BreadcrumbList({ className, ...props }, ref) {
  return (
    <ol ref={ref} className={cn("flex items-center space-x-1", className)} {...props} />
  );
});

const BreadcrumbItem = React.forwardRef(function BreadcrumbItem({ className, ...props }, ref) {
  return (
    <li ref={ref} className={cn("flex items-center", className)} {...props} />
  );
});

const BreadcrumbLink = React.forwardRef(function BreadcrumbLink({ className, ...props }, ref) {
  return (
    <a
      ref={ref}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        className
      )}
      {...props}
    />
  );
});

const BreadcrumbPage = React.forwardRef(function BreadcrumbPage({ className, ...props }, ref) {
  return (
    <span
      ref={ref}
      className={cn("text-sm font-medium text-muted-foreground", className)}
      {...props}
    />
  );
});

const BreadcrumbSeparator = React.forwardRef(function BreadcrumbSeparator({ className, ...props }, ref) {
  return (
    <ChevronRight
      ref={ref}
      className={cn("h-4 w-4 text-muted-foreground", className)}
      {...props}
    />
  );
});

const BreadcrumbEllipsis = React.forwardRef(function BreadcrumbEllipsis({ className, ...props }, ref) {
  return (
    <span ref={ref} className={cn("text-sm font-medium text-muted-foreground", className)} {...props}>
      ...
    </span>
  );
});

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}