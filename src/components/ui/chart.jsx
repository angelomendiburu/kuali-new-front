import React from 'react';
import cn from 'classnames';

const Chart = React.forwardRef(function Chart({ className, ...props }, ref) {
  return (
    <div ref={ref} className={cn("chart-root", className)} {...props} />
  );
});

export { Chart };