import * as React from "react"
import { cn } from "../../lib/utils"

const Table = React.forwardRef(function Table({ className, ...props }, ref) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn(
          "w-full caption-bottom text-sm border-collapse",
          "border border-zinc-200 dark:border-zinc-800",
          "rounded-lg overflow-hidden",
          className
        )}
        {...props}
      />
    </div>
  )
})
Table.displayName = "Table"

const TableHeader = React.forwardRef(function TableHeader({ className, ...props }, ref) {
  return (
    <thead
      ref={ref}
      className={cn(
        "bg-zinc-100 dark:bg-zinc-800",
        "[&_tr]:border-b [&_tr]:border-zinc-200 dark:[&_tr]:border-zinc-800",
        className
      )}
      {...props}
    />
  )
})
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef(function TableBody({ className, ...props }, ref) {
  return (
    <tbody
      ref={ref}
      className={cn(
        "[&_tr]:border-b [&_tr]:border-zinc-200 dark:[&_tr]:border-zinc-800",
        "[&_tr:last-child]:border-0",
        className
      )}
      {...props}
    />
  )
})
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef(function TableFooter({ className, ...props }, ref) {
  return (
    <tfoot
      ref={ref}
      className={cn(
        "border-t bg-zinc-100/50 dark:bg-zinc-800/50 font-medium",
        "[&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
})
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef(function TableRow({ className, ...props }, ref) {
  return (
    <tr
      ref={ref}
      className={cn(
        "transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
        "data-[state=selected]:bg-zinc-100 dark:data-[state=selected]:bg-zinc-800",
        className
      )}
      {...props}
    />
  )
})
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef(function TableHead({ className, ...props }, ref) {
  return (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-zinc-700 dark:text-zinc-300",
        "[&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
})
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef(function TableCell({ className, ...props }, ref) {
  return (
    <td
      ref={ref}
      className={cn(
        "p-4 align-middle",
        "border-r border-zinc-200 dark:border-zinc-800 last:border-0",
        "[&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
})
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef(function TableCaption({ className, ...props }, ref) {
  return (
    <caption
      ref={ref}
      className={cn("mt-4 text-sm text-zinc-600 dark:text-zinc-400", className)}
      {...props}
    />
  )
})
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}