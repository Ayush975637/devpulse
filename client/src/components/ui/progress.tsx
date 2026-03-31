// import * as React from "react"
// import { Progress as ProgressPrimitive } from "radix-ui"

// import { cn } from "@/lib/utils"

// function Progress({
//   className,
//   value,
//   ...props
// }: React.ComponentProps<typeof ProgressPrimitive.Root>) {
//   return (
//     <ProgressPrimitive.Root
//       data-slot="progress"
//       className={cn(
//         "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
//         className
//       )}
//       {...props}
//     >
//       <ProgressPrimitive.Indicator
//         data-slot="progress-indicator"
//         className="size-full flex-1 bg-primary transition-all"
//         style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
//       />
//     </ProgressPrimitive.Root>
//   )
// }

// export { Progress }
import * as React from "react";

const Progress = ({ value = 0, className = "" ,indicatorClassName = ""  }) => {
  return (
    <div className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className} `}>
      <div
        className={`h-full      ${indicatorClassName} bg-grey-400 transition-all duration-500`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export { Progress };
