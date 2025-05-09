"use client"

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

const AspectRatio = React.forwardRef(({ className, ratio = 1, ...props }, ref) => {
  return (
    <div
      ref={ref}
      style={{ aspectRatio: ratio }}
      className={className}
      {...props}
    />
  )
})
AspectRatio.displayName = "AspectRatio"

export { AspectRatio }
